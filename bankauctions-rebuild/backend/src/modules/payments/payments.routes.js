import { Router } from "express";
import { db } from "../../services/db.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { preparePropertyPurchase } from "./payments.service.js";
import { fail } from "../workflow/notices.service.js";
const router = Router();
const handle = (fn) => async (req, res, next) => {
  try {
    await fn(req, res);
  } catch (e) {
    next(e);
  }
};
router.use(requireAuth, requireRole("BUYER"));
router.get(
  "/",
  handle(async (req, res) => {
    const items = await db.propertyPaymentIntent.findMany({
      where: { buyerId: req.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        auctionId: true,
        amountPaise: true,
        currency: true,
        status: true,
        paidAt: true,
      },
    });
    const assets = await db.auctionNotice.findMany({
      where: { id: { in: items.map((p) => p.auctionId) } },
      select: { id: true, title: true },
    });
    res.json({
      success: true,
      data: items.map((p) => ({
        ...p,
        auctionTitle:
          assets.find((a) => a.id === p.auctionId)?.title ||
          "Property purchase",
      })),
    });
  }),
);
router.post(
  "/property/:id",
  handle(async (req, res) => {
    const item = await preparePropertyPurchase(req.user, req.params.id);
    res.json({
      success: true,
      data: {
        id: item.id,
        auctionId: item.auctionId,
        amountPaise: item.amountPaise,
        currency: item.currency,
        status: item.status,
        checkoutAvailable: false,
        message:
          "Online payment is not available yet. No money has been collected and property access has not changed.",
      },
    });
  }),
);
router.get(
  "/:id",
  handle(async (req, res) => {
    const item = await db.propertyPaymentIntent.findFirst({
      where: { id: req.params.id, buyerId: req.user.id },
      select: {
        id: true,
        auctionId: true,
        amountPaise: true,
        currency: true,
        status: true,
        paidAt: true,
      },
    });
    if (!item) fail(404, "Purchase not found.");
    res.json({ success: true, data: { ...item, checkoutAvailable: false } });
  }),
);
export default router;
