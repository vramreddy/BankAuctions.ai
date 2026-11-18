import { Router } from "express";
import {
  getAuctions,
  getFeaturedAuctions,
  getAuctionById,
  unlockAuction,
  toggleSaveAuction,
  assetPhoto,
  exportAuctions,
  getBanks,
} from "./auctions.controller.js";
import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "../../middleware/auth.js";

const router = Router();

router.get("/", optionalAuth, getAuctions);
router.get("/export", requireAuth, exportAuctions);
router.get("/banks", optionalAuth, getBanks);
router.get("/featured", getFeaturedAuctions);
router.get("/:id/photo", assetPhoto);
router.get("/:id", optionalAuth, getAuctionById);
router.post("/unlock/:id", requireAuth, requireRole("BUYER"), unlockAuction);
router.post("/save/:id", requireAuth, requireRole("BUYER"), toggleSaveAuction);

export default router;
