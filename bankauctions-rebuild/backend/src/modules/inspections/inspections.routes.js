import { Router } from 'express';
import {
  getEngineerAssignments,
  getAssignmentDetails,
  scheduleVisit,
  submitInspectionReport
} from './inspections.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

// Engineer and Admin access
router.use(requireAuth, requireRole('ENGINEER', 'ADMIN'));

router.get('/assignments', getEngineerAssignments);
router.get('/assignments/:id', getAssignmentDetails);
router.post('/assignments/:id/schedule', scheduleVisit);
router.post('/assignments/:id/submit', submitInspectionReport);

export default router;
