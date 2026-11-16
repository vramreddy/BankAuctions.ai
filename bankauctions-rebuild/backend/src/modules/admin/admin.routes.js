import { Router } from 'express';
import {
  getOverview,
  getAuctions,
  publishAuction,
  unpublishAuction,
  assignEngineer,
  approveInspection,
  importBatch,
  getUsers,
  giftUnlocks,
  toggleUserStatus,
  createStaff,
  getAuditLogs,
  getSettings,
  updateSettings
} from './admin.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('ADMIN'));

router.get('/overview', getOverview);
router.get('/auctions', getAuctions);
router.post('/auctions/:id/publish', publishAuction);
router.post('/auctions/:id/unpublish', unpublishAuction);
router.post('/engineers/assign', assignEngineer);
router.post('/approvals/:id', approveInspection);
router.post('/imports', importBatch);
router.get('/users', getUsers);
router.post('/users/:id/gift-unlocks', giftUnlocks);
router.post('/users/:id/toggle-status', toggleUserStatus);
router.post('/staff', createStaff);
router.get('/audit-logs', getAuditLogs);
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

export default router;
