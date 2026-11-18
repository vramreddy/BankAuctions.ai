import { Router } from "express";
import { createHash } from "node:crypto";
import { db } from "../../services/db.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import {
  capabilities,
  PLAN_CAPABILITIES,
} from "../../../../shared/constants/entitlements.js";
import {
  importNotices,
  extractionDetail,
  claimNotice,
  reviewNotice,
  fail,
  staff,
  audit,
} from "./notices.service.js";
import {
  createRequest,
  requestDetail,
  accessibleRequest,
  addMessage,
  updateRequest,
  submitRequestedReport,
  recommendPlan,
  reviewRecommendation,
} from "./requests.service.js";
import {
  queueReport,
  deliverReport,
  mailConfigured,
} from "./delivery.service.js";
import { reviewInspection } from "./field.service.js";
const router = Router();
const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (error) {
    next(error);
  }
};
router.use(requireAuth);
router.patch(
  "/buyers/:id/plan",
  requireRole("ADMIN"),
  handle(async (req, res) => {
    const { plan, notes } = req.body;
    if (
      !PLAN_CAPABILITIES[plan] ||
      typeof notes !== "string" ||
      notes.trim().length < 10
    )
      fail(400, "Choose a valid plan and record the authorization reason.");
    const data = await db.$transaction(async (tx) => {
      const buyer = await tx.user.findUnique({ where: { id: req.params.id } });
      if (buyer?.role !== "BUYER") fail(404, "Buyer not found.");
      const updated = await tx.user.update({
        where: { id: buyer.id },
        data: { planTier: plan },
        select: { id: true, planTier: true },
      });
      await audit(tx, req.user, "BUYER_PLAN_CHANGED", buyer.id, {
        previous: buyer.planTier,
        plan,
        notes: notes.trim(),
      });
      return updated;
    });
    res.json({ success: true, data });
  }),
);
router.get(
  "/inspections",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await db.inspectionAssignment.findMany({
        where: { status: "SUBMITTED" },
        include: {
          report: true,
          auction: true,
          engineer: { select: { fullName: true } },
        },
        orderBy: { updatedAt: "asc" },
      }),
    }),
  ),
);
router.patch(
  "/inspections/:id",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await reviewInspection(req.user, req.params.id, req.body),
    }),
  ),
);
router.get(
  "/capabilities",
  handle(async (req, res) =>
    res.json({ success: true, data: capabilities(req.user) }),
  ),
);
router.get(
  "/overview",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) => {
    const [notices, requests, reports, recommendations, deliveries] =
      await Promise.all([
        db.noticeExtraction.count({
          where: { status: { in: ["PENDING_CHECKER", "NEEDS_CORRECTION"] } },
        }),
        db.supportRequest.count({
          where: { status: { notIn: ["CLOSED", "RESOLVED"] } },
        }),
        db.supportRequest.count({ where: { status: "REPORT_SUBMITTED" } }),
        db.planRecommendation.count({ where: { status: "PENDING_CHECKER" } }),
        db.emailDelivery.count({
          where: { status: { in: ["PENDING", "FAILED", "SENDING"] } },
        }),
      ]);
    res.json({
      success: true,
      data: {
        notices,
        requests,
        reports,
        recommendations,
        deliveries,
        mailConfigured: mailConfigured(),
      },
    });
  }),
);
router.get(
  "/staff",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await db.user.findMany({
        where: { role: { in: ["CHECKER", "ENGINEER"] }, isActive: true },
        select: { id: true, fullName: true, role: true },
      }),
    }),
  ),
);
router.get(
  "/notices",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) => {
    const data = await db.noticeExtraction.findMany({
      where: req.query.status ? { status: req.query.status } : {},
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        sourceName: true,
        reviewed: true,
        status: true,
        version: true,
        claimedById: true,
        createdAt: true,
        auctionId: true,
      },
    });
    res.json({ success: true, data });
  }),
);
router.post(
  "/notices/import",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res
      .status(201)
      .json({
        success: true,
        data: await importNotices(
          req.user,
          req.body.records,
          req.body.sourceName,
        ),
      }),
  ),
);
router.get(
  "/notices/:id",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({ success: true, data: await extractionDetail(req.params.id) }),
  ),
);
router.get(
  "/notices/:id/export",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) => {
    const item = await extractionDetail(req.params.id);
    res
      .set(
        "Content-Disposition",
        `attachment; filename="reviewed-notice-${item.id}.json"`,
      )
      .json([req.query.original === "1" ? item.raw : item.reviewed]);
  }),
);
router.post(
  "/notices/:id/claim",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await claimNotice(req.user, req.params.id),
    }),
  ),
);
router.patch(
  "/notices/:id",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await reviewNotice(req.user, req.params.id, req.body),
    }),
  ),
);
router.get(
  "/requests",
  handle(async (req, res) => {
    const where = staff(req.user)
      ? {}
      : req.user.role === "ENGINEER"
        ? { assignedEngineerId: req.user.id }
        : { requesterId: req.user.id };
    if (req.query.status) where.status = req.query.status;
    const data = await db.supportRequest.findMany({
      where,
      orderBy: [{ priority: "desc" }, { updatedAt: "desc" }],
      take: 200,
      select: {
        id: true,
        kind: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        assignedCheckerId: true,
        auction: { select: { title: true } },
        requester: { select: { fullName: true } },
      },
    });
    res.json({ success: true, data });
  }),
);
router.post(
  "/requests",
  requireRole("BUYER", "ADMIN"),
  handle(async (req, res) =>
    res
      .status(201)
      .json({ success: true, data: await createRequest(req.user, req.body) }),
  ),
);
router.get(
  "/requests/:id",
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await requestDetail(req.user, req.params.id),
    }),
  ),
);
router.post(
  "/requests/:id/messages",
  handle(async (req, res) =>
    res
      .status(201)
      .json({
        success: true,
        data: await addMessage(req.user, req.params.id, req.body),
      }),
  ),
);
router.patch(
  "/requests/:id",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await updateRequest(req.user, req.params.id, req.body),
    }),
  ),
);
router.post(
  "/requests/:id/report",
  requireRole("ENGINEER"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await submitRequestedReport(req.user, req.params.id, req.body),
    }),
  ),
);
router.post(
  "/requests/:id/deliver",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) => {
    const delivery = await queueReport(req.user, req.params.id);
    if (delivery.status === "SENT")
      return res.json({ success: true, data: { status: "SENT" } });
    res.json({
      success: true,
      data: await deliverReport(req.user, delivery.id),
    });
  }),
);
router.get(
  "/recommendations",
  requireRole("CHECKER", "ADMIN", "MARKETING", "BUYER"),
  handle(async (req, res) => {
    const where =
      req.user.role === "BUYER"
        ? { buyerId: req.user.id, status: "APPROVED" }
        : req.user.role === "MARKETING"
          ? { proposedById: req.user.id }
          : {};
    res.json({
      success: true,
      data: await db.planRecommendation.findMany({
        where,
        include: { buyer: { select: { fullName: true, email: true } } },
        orderBy: { createdAt: "desc" },
        take: 200,
      }),
    });
  }),
);
router.post(
  "/recommendations",
  requireRole("MARKETING", "ADMIN"),
  handle(async (req, res) =>
    res
      .status(201)
      .json({ success: true, data: await recommendPlan(req.user, req.body) }),
  ),
);
router.patch(
  "/recommendations/:id",
  requireRole("CHECKER", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await reviewRecommendation(req.user, req.params.id, req.body),
    }),
  ),
);
router.get(
  "/buyers",
  requireRole("MARKETING", "ADMIN"),
  handle(async (req, res) =>
    res.json({
      success: true,
      data: await db.user.findMany({
        where: { role: "BUYER", isActive: true },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          planTier: true,
          lastLoginAt: true,
        },
        take: 200,
      }),
    }),
  ),
);
router.post(
  "/files",
  handle(async (req, res) => {
    const { extractionId, requestId, name, mime, base64 } = req.body;
    const purpose =
      req.body.purpose === "PROPERTY_PHOTO" ? "PROPERTY_PHOTO" : "EVIDENCE";
    if (
      purpose === "PROPERTY_PHOTO" &&
      (!extractionId || !["image/jpeg", "image/png"].includes(mime))
    )
      fail(
        400,
        "Property photos must be PNG or JPEG images attached to a notice.",
      );
    if (Boolean(extractionId) === Boolean(requestId))
      fail(400, "Attach to exactly one notice or request.");
    if (extractionId) {
      if (!staff(req.user))
        fail(403, "Only checkers can attach notice evidence.");
      const item = await db.noticeExtraction.findUnique({
        where: { id: extractionId },
      });
      if (
        !item ||
        !["PENDING_CHECKER", "NEEDS_CORRECTION"].includes(item.status)
      )
        fail(409, "Notice is not editable.");
    }
    if (requestId) {
      const item = await accessibleRequest(req.user, requestId);
      if (["CLOSED", "RESOLVED", "REPORT_APPROVED"].includes(item.status))
        fail(409, "Attachments are closed for this request.");
    }
    if (
      !["application/pdf", "image/jpeg", "image/png"].includes(mime) ||
      typeof base64 !== "string" ||
      base64.length > 12 * 1024 * 1024
    )
      fail(400, "Upload a PDF, JPG or PNG up to 8 MB.");
    const bytes = Buffer.from(base64, "base64");
    if (!bytes.length || bytes.length > 8 * 1024 * 1024)
      fail(400, "File must be 1 byte–8 MB.");
    const valid =
      mime === "application/pdf"
        ? bytes.subarray(0, 5).toString() === "%PDF-"
        : mime === "image/png"
          ? bytes
              .subarray(0, 8)
              .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
          : bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
    if (!valid) fail(400, "File content does not match the declared type.");
    const item = await db.managedFile.create({
      data: {
        name: String(name || "attachment")
          .replace(/[\r\n\\/]/g, "_")
          .slice(0, 180),
        mime,
        purpose,
        bytes,
        size: bytes.length,
        sha256: createHash("sha256").update(bytes).digest("hex"),
        uploadedById: req.user.id,
        extractionId: extractionId || null,
        requestId: requestId || null,
      },
      select: { id: true, name: true, size: true, mime: true },
    });
    res.status(201).json({ success: true, data: item });
  }),
);
router.get(
  "/files/:id",
  handle(async (req, res) => {
    const file = await db.managedFile.findUnique({
      where: { id: req.params.id },
    });
    if (!file) fail(404, "File not found.");
    if (file.extractionId && !staff(req.user))
      fail(403, "Notice evidence is restricted to the checker workspace.");
    if (file.requestId) {
      const item = await accessibleRequest(req.user, file.requestId);
      if (
        req.user.role === "BUYER" &&
        !item.approvedReport?.fileIds?.includes(file.id)
      )
        fail(403, "This attachment has not been approved for delivery.");
    }
    res
      .set({
        "Content-Type": file.mime,
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      })
      .send(Buffer.from(file.bytes));
  }),
);
export default router;
