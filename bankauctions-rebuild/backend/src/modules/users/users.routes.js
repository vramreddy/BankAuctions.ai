import { Router } from 'express';
import { getSavedProperties, getUnlockedProperties, updateProfile } from './users.controller.js';
import { requireAuth } from '../../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/saved', getSavedProperties);
router.get('/unlocked', getUnlockedProperties);
router.put('/profile', updateProfile);

export default router;
