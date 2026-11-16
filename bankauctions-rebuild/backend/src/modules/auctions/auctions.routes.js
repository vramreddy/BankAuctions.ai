import { Router } from 'express';
import {
  getAuctions,
  getFeaturedAuctions,
  getAuctionById,
  unlockAuction,
  toggleSaveAuction
} from './auctions.controller.js';
import { optionalAuth, requireAuth } from '../../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getAuctions);
router.get('/featured', getFeaturedAuctions);
router.get('/:id', optionalAuth, getAuctionById);
router.post('/unlock/:id', requireAuth, unlockAuction);
router.post('/save/:id', requireAuth, toggleSaveAuction);

export default router;
