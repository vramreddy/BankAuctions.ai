import { Router } from 'express';
import {
  getQueue,
  claimLot,
  getReviewDetails,
  submitReview,
  getCheckerHistory
} from './verification.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// Checker & Admin have access
router.use(requireAuth, requireRole('CHECKER', 'ADMIN'));

router.get('/queue', getQueue);
router.post('/claim/:id', claimLot);
router.get('/reviews/:id', getReviewDetails);
router.patch('/reviews/:id', submitReview);
router.get('/history', getCheckerHistory);

export default router;
