import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "../../services/db.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { audit, fail } from "./notices.service.js";
export const CONTENT_PAGES = {
  terms: "Terms and conditions",
  privacy: "Privacy policy",
  payments: "Payment information",
  refunds: "Cancellation and refund policy",
};
const router = Router();
const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (e) {
    next(e);
  }
};
router.get(
  "/public/:slug",
  handle(async (req, res) => {
    if (!CONTENT_PAGES[req.params.slug]) fail(404, "Page not found.");
    const item = await db.buyerContent.findUnique({
      where: { slug: req.params.slug },
    });
    if (!item?.published)
      fail(
        404,
        "This information has not been published yet. Please contact checker support.",
      );
    res.json({
      success: true,
      data: { ...item.published, publishedAt: item.publishedAt },
    });
  }),
);
router.use(requireAuth, requireRole("CHECKER", "ADMIN"));
router.get(
  "/pages",
  handle(async (req, res) => {
    const stored = await db.buyerContent.findMany();
    res.json({
      success: true,
      data: Object.entries(CONTENT_PAGES).map(
        ([slug, title]) =>
          stored.find((p) => p.slug === slug) || {
            slug,
            draft: { title, body: "" },
            published: null,
            version: 0,
          },
      ),
    });
  }),
);
router.patch(
  "/pages/:slug",
  handle(async (req, res) => {
    const slug = req.params.slug;
    if (!CONTENT_PAGES[slug]) fail(404, "Page not found.");
    const input = z
      .object({
        version: z.number().int().nonnegative(),
        action: z.enum(["SAVE", "PUBLISH", "WITHDRAW"]),
        title: z.string().trim().min(3).max(160),
        body: z.string().max(60000),
        notes: z.string().trim().min(5).max(2000),
      })
      .parse(req.body);
    if (input.action === "PUBLISH" && input.body.trim().length < 40)
      fail(
        400,
        "Provide the reviewed policy or payment information before publication.",
      );
    const data = await db.$transaction(async (tx) => {
      const current = await tx.buyerContent.findUnique({ where: { slug } });
      if ((current?.version || 0) !== input.version)
        fail(409, "Content changed. Reload before saving.");
      const draft = { title: input.title, body: input.body };
      const values = {
        draft,
        updatedById: req.user.id,
        ...(input.action === "PUBLISH"
          ? { published: draft, publishedAt: new Date() }
          : {}),
        ...(input.action === "WITHDRAW"
          ? { published: Prisma.DbNull, publishedAt: null }
          : {}),
      };
      if (current) {
        const changed = await tx.buyerContent.updateMany({
          where: { slug, version: input.version },
          data: { ...values, version: { increment: 1 } },
        });
        if (!changed.count) fail(409, "Content changed. Reload before saving.");
      } else {
        if (input.version !== 0) fail(409, "Content changed.");
        await tx.buyerContent.create({ data: { slug, ...values, version: 1 } });
      }
      await audit(
        tx,
        req.user,
        `BUYER_CONTENT_${input.action}`,
        slug,
        { ...draft, notes: input.notes },
        current?.draft,
      );
      return tx.buyerContent.findUnique({ where: { slug } });
    });
    res.json({ success: true, data });
  }),
);
router.get(
  "/assets",
  handle(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1),
      where = { checkerApprovedAt: { not: null } };
    if (req.query.search)
      where.OR = [
        {
          title: {
            contains: String(req.query.search).slice(0, 100),
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: String(req.query.search).slice(0, 100),
            mode: "insensitive",
          },
        },
      ];
    const [data, total] = await Promise.all([
      db.auctionNotice.findMany({
        where,
        include: {
          extraction: { select: { id: true, status: true, version: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * 30,
        take: 30,
      }),
      db.auctionNotice.count({ where }),
    ]);
    res.json({
      success: true,
      data,
      meta: { page, total, totalPages: Math.ceil(total / 30) },
    });
  }),
);
router.patch(
  "/assets/:id",
  handle(async (req, res) => {
    const input = z
      .object({
        action: z.enum([
          "WITHDRAW",
          "PUBLISH",
          "PRESENTATION",
          "REVISE",
          "ACCESS_PRICE",
        ]),
        notes: z.string().trim().min(5),
        version: z.number().int(),
        isPremium: z.boolean().optional(),
        featured: z.boolean().optional(),
        accessPricePaise: z
          .number()
          .int()
          .min(1)
          .max(100000000)
          .nullable()
          .optional(),
      })
      .parse(req.body);
    if (input.action === "ACCESS_PRICE" && input.accessPricePaise === undefined)
      fail(400, "Provide an access fee or clear it.");
    const data = await db.$transaction(async (tx) => {
      const item = await tx.auctionNotice.findUnique({
        where: { id: req.params.id },
        include: { extraction: true },
      });
      if (!item?.extraction || !item.checkerApprovedAt)
        fail(404, "Reviewed asset not found.");
      if (item.extraction.status !== "APPROVED")
        fail(
          409,
          "Finish the current notice review before managing publication.",
        );
      const changed = await tx.noticeExtraction.updateMany({
        where: {
          id: item.extraction.id,
          version: input.version,
          status: "APPROVED",
        },
        data: {
          version: { increment: 1 },
          ...(input.action === "REVISE"
            ? {
                status: "PENDING_CHECKER",
                claimedById: req.user.id,
                claimedAt: new Date(),
              }
            : {}),
          ...(input.action === "PRESENTATION"
            ? {
                listing: {
                  ...item.extraction.listing,
                  isPremium: Boolean(input.isPremium),
                  featured: Boolean(input.featured),
                },
              }
            : {}),
        },
      });
      if (!changed.count)
        fail(409, "Asset changed. Reload before applying this action.");
      const values =
        input.action === "ACCESS_PRICE"
          ? { accessPricePaise: input.accessPricePaise }
          : input.action === "PRESENTATION"
            ? {
                isPremium: Boolean(input.isPremium),
                featured: Boolean(input.featured),
              }
            : {
                status:
                  input.action === "PUBLISH" ? "PUBLISHED" : "UNPUBLISHED",
              };
      const updated = await tx.auctionNotice.update({
        where: { id: item.id },
        data: values,
      });
      await audit(
        tx,
        req.user,
        `ASSET_${input.action}`,
        item.id,
        { ...values, notes: input.notes },
        {
          status: item.status,
          isPremium: item.isPremium,
          featured: item.featured,
        },
      );
      return updated;
    });
    res.json({ success: true, data });
  }),
);
router.get(
  "/buyers",
  handle(async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1),
      where = { role: "BUYER" };
    if (req.query.search)
      where.OR = [
        {
          fullName: {
            contains: String(req.query.search).slice(0, 100),
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: String(req.query.search).slice(0, 100),
            mode: "insensitive",
          },
        },
      ];
    const [data, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          city: true,
          planTier: true,
          lastLoginAt: true,
          isActive: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * 30,
        take: 30,
      }),
      db.user.count({ where }),
    ]);
    res.json({
      success: true,
      data,
      meta: { page, total, totalPages: Math.ceil(total / 30) },
    });
  }),
);
router.get(
  "/buyers/:id",
  handle(async (req, res) => {
    const buyer = await db.user.findFirst({
      where: { id: req.params.id, role: "BUYER" },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        city: true,
        planTier: true,
        lastLoginAt: true,
        isActive: true,
      },
    });
    if (!buyer) fail(404, "Buyer not found.");
    const [logins, saved, unlocked, requests, recommendations, purchases] =
      await Promise.all([
        db.auditLog.findMany({
          where: { actorId: buyer.id, action: "USER_LOGIN" },
          select: { id: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 30,
        }),
        db.savedProperty.findMany({
          where: { userId: buyer.id },
          select: {
            savedAt: true,
            auction: {
              select: { id: true, title: true, city: true, status: true },
            },
          },
          orderBy: { savedAt: "desc" },
          take: 100,
        }),
        db.propertyUnlock.findMany({
          where: { userId: buyer.id },
          select: {
            unlockedAt: true,
            auction: {
              select: { id: true, title: true, city: true, status: true },
            },
          },
          orderBy: { unlockedAt: "desc" },
          take: 100,
        }),
        db.supportRequest.findMany({
          where: { requesterId: buyer.id },
          select: {
            id: true,
            subject: true,
            kind: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        db.planRecommendation.findMany({
          where: { buyerId: buyer.id },
          select: { id: true, plan: true, status: true, createdAt: true },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
        db.propertyPaymentIntent.findMany({
          where: { buyerId: buyer.id },
          select: {
            id: true,
            auctionId: true,
            status: true,
            amountPaise: true,
            currency: true,
            paidAt: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          take: 100,
        }),
      ]);
    await audit(db, req.user, "BUYER_ACTIVITY_VIEWED", buyer.id, {});
    res.json({
      success: true,
      data: {
        buyer,
        logins,
        saved,
        unlocked,
        requests,
        recommendations,
        purchases,
      },
    });
  }),
);
export default router;
