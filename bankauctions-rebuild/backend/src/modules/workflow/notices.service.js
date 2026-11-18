import { createHash } from "node:crypto";
import { db } from "../../services/db.js";
import {
  noticeSchema,
  reviewWarnings,
  publicationErrors,
  ASSET_CATEGORY_MAP,
  parseMoney,
  auctionTimestamp,
  parseNoticeDate,
} from "../../../../shared/notices/contract.js";

export function fail(status, message) {
  const error = new Error(message);
  error.statusCode = status;
  throw error;
}
export const staff = (user) => ["CHECKER", "ADMIN"].includes(user.role);
export const publishedWhere = {
  status: "PUBLISHED",
  checkerApprovedAt: { not: null },
};
export async function audit(
  tx,
  user,
  action,
  entityId,
  afterState,
  beforeState,
) {
  return tx.auditLog.create({
    data: {
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action,
      entityType: "WORKFLOW",
      entityId,
      afterState: afterState || {},
      beforeState: beforeState || {},
    },
  });
}
function stable(value) {
  return value && typeof value === "object"
    ? Array.isArray(value)
      ? value.map(stable)
      : Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, stable(value[key])]),
        )
    : value;
}
export async function importNotices(user, records, sourceName) {
  if (!Array.isArray(records) || !records.length || records.length > 100)
    fail(400, "Upload an array of 1–100 notice records.");
  const parsed = records.map((raw) => ({
    raw,
    reviewed: noticeSchema.parse(raw),
  }));
  return db.$transaction(async (tx) => {
    const imported = [],
      duplicates = [];
    for (const { raw, reviewed } of parsed) {
      const fingerprint = createHash("sha256")
        .update(JSON.stringify(stable(raw)))
        .digest("hex");
      const exists = await tx.noticeExtraction.findUnique({
        where: { fingerprint },
      });
      if (exists) {
        duplicates.push(exists.id);
        continue;
      }
      const item = await tx.noticeExtraction.create({
        data: {
          fingerprint,
          sourceName: String(sourceName || "JSON upload").slice(0, 255),
          raw,
          reviewed,
          importedById: user.id,
        },
      });
      await audit(tx, user, "NOTICE_IMPORTED", item.id, {
        fingerprint,
        sourceName: item.sourceName,
      });
      imported.push(item);
    }
    return { imported, duplicates };
  });
}
export async function extractionDetail(id) {
  const notice = await db.noticeExtraction.findUnique({ where: { id } });
  if (!notice) fail(404, "Notice not found.");
  const files = await db.managedFile.findMany({
    where: { extractionId: id },
    select: {
      id: true,
      name: true,
      mime: true,
      size: true,
      purpose: true,
      createdAt: true,
    },
  });
  const history = await db.auditLog.findMany({
    where: { entityId: id },
    orderBy: { createdAt: "desc" },
  });
  return {
    ...notice,
    files,
    history,
    warnings: reviewWarnings(notice.reviewed),
    publicationErrors: publicationErrors(notice.reviewed),
  };
}
export async function claimNotice(user, id) {
  const result = await db.noticeExtraction.updateMany({
    where: {
      id,
      status: { in: ["PENDING_CHECKER", "NEEDS_CORRECTION"] },
      OR: [
        { claimedById: null },
        { claimedById: user.id },
        { claimedAt: { lt: new Date(Date.now() - 30 * 60 * 1000) } },
      ],
    },
    data: { claimedById: user.id, claimedAt: new Date() },
  });
  if (!result.count)
    fail(409, "Notice is already claimed or no longer awaiting review.");
  return extractionDetail(id);
}
export async function reviewNotice(user, id, input) {
  const decisions = ["SAVE", "APPROVE", "REJECT", "NEEDS_CORRECTION"];
  if (!decisions.includes(input.decision))
    fail(400, "Invalid review decision.");
  if (!Number.isInteger(input.version))
    fail(400, "Review version is required.");
  const reviewed = noticeSchema.parse(input.reviewed);
  const listing = {
    isPremium: input.listing?.isPremium === true,
    featured: input.listing?.featured === true,
    photoId:
      typeof input.listing?.photoId === "string" ? input.listing.photoId : null,
  };
  const notes = String(input.notes || "").trim();
  if (!notes) fail(400, "Record your verification notes and evidence.");
  return db.$transaction(async (tx) => {
    const current = await tx.noticeExtraction.findUnique({ where: { id } });
    if (!current) fail(404, "Notice not found.");
    if (current.claimedById !== user.id)
      fail(409, "Claim this notice before saving a review.");
    if (!["PENDING_CHECKER", "NEEDS_CORRECTION"].includes(current.status))
      fail(409, "This notice has already been finalized.");
    if (input.decision === "APPROVE") {
      const errors = publicationErrors(reviewed);
      if (!ASSET_CATEGORY_MAP[reviewed.assetType])
        errors.push("Select a supported asset type.");
      if (!input.evidenceConfirmed)
        errors.push(
          "Confirm that you checked the original evidence and resolved review warnings.",
        );
      const sourceCount = await tx.managedFile.count({
        where: { extractionId: id, purpose: "EVIDENCE" },
      });
      if (!sourceCount)
        errors.push(
          "Attach the original notice PDF or source image before approval.",
        );
      if (errors.length) fail(422, errors.join(" "));
      if (
        listing.photoId &&
        !(await tx.managedFile.findFirst({
          where: {
            id: listing.photoId,
            extractionId: id,
            purpose: "PROPERTY_PHOTO",
          },
        }))
      )
        fail(400, "Choose a property photo uploaded for this notice.");
    }
    const status = {
      SAVE: "PENDING_CHECKER",
      APPROVE: "APPROVED",
      REJECT: "REJECTED",
      NEEDS_CORRECTION: "NEEDS_CORRECTION",
    }[input.decision];
    const updated = await tx.noticeExtraction.updateMany({
      where: {
        id,
        version: input.version,
        claimedById: user.id,
        status: current.status,
      },
      data: {
        reviewed,
        listing,
        status,
        version: { increment: 1 },
        reviewNotes: notes,
        ...(input.decision !== "SAVE"
          ? {
              reviewedById: user.id,
              reviewedAt: new Date(),
              claimedById: null,
              claimedAt: null,
            }
          : { claimedAt: new Date() }),
      },
    });
    if (!updated.count)
      fail(409, "This record changed. Reload it before saving your review.");
    let auctionId = current.auctionId;
    if (input.decision === "APPROVE") {
      const bankCode =
        "BANK-" +
        createHash("sha256")
          .update(reviewed.bankName.toLowerCase())
          .digest("hex")
          .slice(0, 12);
      const bank = await tx.bank.upsert({
        where: { code: bankCode },
        create: { code: bankCode, name: reviewed.bankName },
        update: {},
      });
      const code = ASSET_CATEGORY_MAP[reviewed.assetType];
      const category = await tx.auctionCategory.findUnique({ where: { code } });
      if (!category)
        fail(
          503,
          "Category reference data is not initialized. Run the reference-data bootstrap.",
        );
      const title = [
        reviewed.propertyType || reviewed.assetType,
        reviewed.locality,
      ]
        .filter(Boolean)
        .join(" — ");
      const data = {
        sourceRef: `NOTICE-${id}`,
        bankId: bank.id,
        categoryId: category.id,
        title,
        shortTitle: reviewed.propertyType || reviewed.assetType,
        city: reviewed.city.trim().toLowerCase(),
        locality: reviewed.locality,
        address: reviewed.propertyAddress,
        pincode: reviewed.propertyDetails?.pincode || null,
        reservePrice: parseMoney(reviewed.reservePrice),
        emdAmount: parseMoney(reviewed.emdAmount),
        bidIncrement: parseMoney(reviewed.bidIncrementAmount) || 0,
        auctionStartDate: auctionTimestamp(
          reviewed.auctionDate,
          reviewed.auctionTime,
        ),
        noticeDate: parseNoticeDate(reviewed.noticeDate)
          ? new Date(`${parseNoticeDate(reviewed.noticeDate)}T00:00:00Z`)
          : null,
        inspectionDate: reviewed.inspectionDate || null,
        possession:
          reviewed.possessionStatus === "PHYSICAL"
            ? "Physical possession"
            : "Symbolic possession",
        encumbrances: "Not independently assessed",
        aiScore: 0,
        aiRank: 0,
        aiDiscountPct: 0,
        status: "PUBLISHED",
        checkerApprovedById: user.id,
        checkerApprovedAt: new Date(),
      };
      const auction = current.auctionId
        ? await tx.auctionNotice.update({
            where: { id: current.auctionId },
            data,
          })
        : await tx.auctionNotice.create({ data });
      auctionId = auction.id;
      await tx.auctionNotice.update({
        where: { id: auctionId },
        data: {
          isPremium: listing.isPremium,
          featured: listing.featured,
          primaryImageUrl: listing.photoId
            ? `/api/v1/auctions/${auctionId}/photo`
            : null,
        },
      });
      await tx.auctionAttribute.upsert({
        where: { auctionId },
        create: {
          auctionId,
          attributes: {
            propertyDetails: reviewed.propertyDetails,
            assetType: reviewed.assetType,
            assetCategory: reviewed.assetCategory,
            propertyArea: reviewed.propertyArea,
            propertyDescription: reviewed.propertyDescription,
            vehicle: {
              make: reviewed.vehicleMake,
              model: reviewed.vehicleModel,
              year: reviewed.vehicleYear,
              registrationNumber: reviewed.vehicleRegistrationNumber,
              location: reviewed.vehicleLocation,
            },
            machinery: {
              name: reviewed.machineryName,
              model: reviewed.machineryModel,
              year: reviewed.machineryYear,
              location: reviewed.machineryLocation,
              description: reviewed.machineryDescription,
            },
          },
          makerExtraction: {},
        },
        update: {
          attributes: {
            propertyDetails: reviewed.propertyDetails,
            assetType: reviewed.assetType,
            assetCategory: reviewed.assetCategory,
            propertyArea: reviewed.propertyArea,
            propertyDescription: reviewed.propertyDescription,
            vehicle: {
              make: reviewed.vehicleMake,
              model: reviewed.vehicleModel,
              year: reviewed.vehicleYear,
              registrationNumber: reviewed.vehicleRegistrationNumber,
              location: reviewed.vehicleLocation,
            },
            machinery: {
              name: reviewed.machineryName,
              model: reviewed.machineryModel,
              year: reviewed.machineryYear,
              location: reviewed.machineryLocation,
              description: reviewed.machineryDescription,
            },
          },
        },
      });
      await tx.noticeExtraction.update({ where: { id }, data: { auctionId } });
      await tx.verificationReview.create({
        data: {
          auctionId,
          checkerId: user.id,
          decision: "VERIFIED",
          correctionNotes: notes,
          fieldCorrections: { extractionId: id, version: input.version + 1 },
        },
      });
    }
    await audit(
      tx,
      user,
      `NOTICE_${input.decision}`,
      id,
      { status, reviewed, notes, auctionId },
      { status: current.status, reviewed: current.reviewed },
    );
    return tx.noticeExtraction.findUnique({ where: { id } });
  });
}
