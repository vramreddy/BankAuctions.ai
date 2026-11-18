import { db } from "../../services/db.js";
import { capabilities } from "../../../../shared/constants/entitlements.js";
import { publishedWhere, fail, audit } from "../workflow/notices.service.js";
const include = { bank: true, category: true, attributes: true };
export function buyerAsset(item, { unlocked = false } = {}) {
  const fields = [
    "id",
    "sourceRef",
    "title",
    "shortTitle",
    "city",
    "locality",
    "address",
    "pincode",
    "reservePrice",
    "accessPricePaise",
    "emdAmount",
    "bidIncrement",
    "auctionStartDate",
    "auctionEndDate",
    "noticeDate",
    "inspectionDate",
    "possession",
    "encumbrances",
    "isPremium",
    "featured",
    "primaryImageUrl",
    "additionalImages",
    "checkerApprovedAt",
    "status",
  ];
  const result = Object.fromEntries(fields.map((key) => [key, item[key]]));
  result.bank = item.bank
    ? { id: item.bank.id, name: item.bank.name, code: item.bank.code }
    : null;
  result.bankName = item.bank?.name;
  result.category = item.category;
  result.isVerifiedByChecker = Boolean(item.checkerApprovedAt);
  result.attributes = item.attributes
    ? { attributes: item.attributes.attributes }
    : null;
  if (unlocked) {
    result.estimatedMarketValue = item.estimatedMarketValue;
    result.inspectionAssignments = (item.inspectionAssignments || [])
      .filter((value) => value.status === "APPROVED")
      .map((value) => ({
        id: value.id,
        status: value.status,
        report: value.report,
      }));
  }
  return result;
}
function searchWhere(req) {
  const q = req.query,
    caps = capabilities(req.user),
    where = { ...publishedWhere };
  if (q.bankId && !caps.bankFilters)
    fail(403, "Bank filters are available with Pro or higher.");
  if (q.days && !caps.dateFilters)
    fail(403, "Auction-date filters are available with Pro or higher.");
  if ((q.prem === "1" || q.possession) && !caps.possessionFilters)
    fail(403, "Premium filters require Premium or Pro Premium.");
  if (q.minMarketValue && !caps.valueFilters)
    fail(403, "Valuation filters require Premium or Pro Premium.");
  if (q.city && q.city !== "all") where.city = String(q.city).toLowerCase();
  if (q.cat) where.category = { slug: q.cat };
  else if (q.categoryId) where.categoryId = q.categoryId;
  if (q.bankId) where.bankId = q.bankId;
  if (q.prem === "1") where.isPremium = true;
  if (q.possession) {
    if (!["Physical possession", "Symbolic possession"].includes(q.possession))
      fail(400, "Invalid possession filter.");
    where.possession = q.possession;
  }
  for (const [key, operator] of [
    ["maxBudget", "lte"],
    ["minBudget", "gte"],
  ])
    if (q[key]) {
      let value = Number(q[key]);
      if (!Number.isFinite(value) || value < 0)
        fail(400, "Budget must be a positive number.");
      if (value < 5000) value *= 100000;
      where.reservePrice = { ...where.reservePrice, [operator]: value };
    }
  if (q.days) {
    const days = Number(q.days);
    if (!Number.isInteger(days) || days < 1 || days > 365)
      fail(400, "Days must be between 1 and 365.");
    where.auctionStartDate = {
      gte: new Date(),
      lte: new Date(Date.now() + days * 86400000),
    };
  }
  if (q.minMarketValue) {
    const value = Number(q.minMarketValue);
    if (!Number.isFinite(value) || value < 0)
      fail(400, "Invalid value filter.");
    where.estimatedMarketValue = { gte: value };
  }
  if (q.search?.trim()) {
    const contains = q.search.trim().slice(0, 200),
      mode = "insensitive";
    where.OR = [
      { title: { contains, mode } },
      { locality: { contains, mode } },
      { address: { contains, mode } },
      { bank: { name: { contains, mode } } },
    ];
  }
  return where;
}
export async function getAuctions(req, res, next) {
  try {
    const where = searchWhere(req),
      page = Math.max(1, parseInt(req.query.page) || 1),
      limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 24));
    const orderBy = {
      price_asc: { reservePrice: "asc" },
      price_desc: { reservePrice: "desc" },
      days: { auctionStartDate: "asc" },
      rank: { checkerApprovedAt: "desc" },
    }[req.query.sort || "rank"];
    if (!orderBy) fail(400, "Invalid sort order.");
    const [items, total] = await Promise.all([
      db.auctionNotice.findMany({
        where,
        include,
        orderBy: [orderBy, { id: "asc" }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.auctionNotice.count({ where }),
    ]);
    res.json({
      success: true,
      data: items.map((item) => buyerAsset(item)),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
      capabilities: capabilities(req.user),
    });
  } catch (e) {
    next(e);
  }
}
export async function getFeaturedAuctions(req, res, next) {
  try {
    const items = await db.auctionNotice.findMany({
      where: {
        ...publishedWhere,
        isPremium: true,
        featured: true,
        primaryImageUrl: { not: null },
      },
      include,
      orderBy: { checkerApprovedAt: "desc" },
      take: 5,
    });
    res.json({ success: true, data: items.map((item) => buyerAsset(item)) });
  } catch (e) {
    next(e);
  }
}
export async function getAuctionById(req, res, next) {
  try {
    const item = await db.auctionNotice.findFirst({
      where: { id: req.params.id, ...publishedWhere },
      include: {
        ...include,
        inspectionAssignments: {
          where: { status: "APPROVED" },
          include: { report: true },
        },
      },
    });
    if (!item) fail(404, "Published auction not found.");
    const key = {
      userId_auctionId: { userId: req.user?.id || "", auctionId: item.id },
    };
    const [unlock, saved] = req.user
      ? await Promise.all([
          db.propertyUnlock.findUnique({ where: key }),
          db.savedProperty.findUnique({ where: key }),
        ])
      : [null, null];
    const isUnlocked = Boolean(
      unlock || ["ADMIN", "CHECKER", "ENGINEER"].includes(req.user?.role),
    );
    res.json({
      success: true,
      data: buyerAsset(item, { unlocked: isUnlocked }),
      userState: { isUnlocked, isSaved: Boolean(saved) },
    });
  } catch (e) {
    next(e);
  }
}
export async function unlockAuction(req, res, next) {
  try {
    const result = await db.$transaction(async (tx) => {
      if (
        !(await tx.auctionNotice.findFirst({
          where: { id: req.params.id, ...publishedWhere },
        }))
      )
        fail(404, "Published auction not found.");
      const where = {
        userId_auctionId: { userId: req.user.id, auctionId: req.params.id },
      };
      if (await tx.propertyUnlock.findUnique({ where }))
        return {
          isUnlocked: true,
          unlocksRemaining: (
            await tx.user.findUnique({ where: { id: req.user.id } })
          ).unlocksRemaining,
        };
      const changed = await tx.user.updateMany({
        where: { id: req.user.id, unlocksRemaining: { gt: 0 } },
        data: { unlocksRemaining: { decrement: 1 } },
      });
      if (!changed.count)
        fail(
          402,
          "No unlock credits remain. Contact the checker for plan assistance.",
        );
      await tx.propertyUnlock.create({
        data: { userId: req.user.id, auctionId: req.params.id },
      });
      await audit(tx, req.user, "ASSET_UNLOCKED", req.params.id);
      return {
        isUnlocked: true,
        unlocksRemaining: (
          await tx.user.findUnique({ where: { id: req.user.id } })
        ).unlocksRemaining,
      };
    });
    res.json({ success: true, ...result });
  } catch (e) {
    if (e.code === "P2002")
      return res.json({ success: true, isUnlocked: true });
    next(e);
  }
}
export async function toggleSaveAuction(req, res, next) {
  try {
    if (
      !(await db.auctionNotice.findFirst({
        where: { id: req.params.id, ...publishedWhere },
      }))
    )
      fail(404, "Published auction not found.");
    const where = {
      userId_auctionId: { userId: req.user.id, auctionId: req.params.id },
    };
    const existing = await db.savedProperty.findUnique({ where });
    if (existing) await db.savedProperty.delete({ where });
    else
      await db.savedProperty.create({
        data: { userId: req.user.id, auctionId: req.params.id },
      });
    res.json({ success: true, saved: !existing });
  } catch (e) {
    next(e);
  }
}
export async function assetPhoto(req, res, next) {
  try {
    const asset = await db.auctionNotice.findFirst({
      where: { id: req.params.id, ...publishedWhere },
      include: { extraction: true },
    });
    const photoId = asset?.extraction?.listing?.photoId;
    if (!photoId) fail(404, "No verified asset photo.");
    const file = await db.managedFile.findFirst({
      where: {
        id: photoId,
        extractionId: asset.extraction.id,
        purpose: "PROPERTY_PHOTO",
      },
    });
    if (!file) fail(404, "Photo not found.");
    res
      .set({
        "Content-Type": file.mime,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=300",
      })
      .send(Buffer.from(file.bytes));
  } catch (e) {
    next(e);
  }
}

export async function exportAuctions(req, res, next) {
  try {
    if (!capabilities(req.user).export)
      fail(403, "Exports require Pro Premium.");
    const items = await db.auctionNotice.findMany({
      where: searchWhere(req),
      include,
      orderBy: { id: "asc" },
      take: 1000,
    });
    res.json({
      success: true,
      data: items.map((item) => buyerAsset(item)),
      meta: { limit: 1000 },
    });
  } catch (e) {
    next(e);
  }
}
export async function getBanks(req, res, next) {
  try {
    const data = await db.bank.findMany({
      where: { auctions: { some: publishedWhere } },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });
    res.json({ success: true, data });
  } catch (e) {
    next(e);
  }
}
