import { Router } from 'express';
import { getSavedProperties, getUnlockedProperties, updateProfile } from './users.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/saved', requireRole('BUYER'), getSavedProperties);
router.get('/unlocked', requireRole('BUYER'), getUnlockedProperties);
router.put('/profile', updateProfile);

export default router;
