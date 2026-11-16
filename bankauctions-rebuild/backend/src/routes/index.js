import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import auctionRoutes from '../modules/auctions/auctions.routes.js';
import categoryRoutes from '../modules/categories/categories.routes.js';
import verificationRoutes from '../modules/verification/verification.routes.js';
import inspectionRoutes from '../modules/inspections/inspections.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import userRoutes from '../modules/users/users.routes.js';
import { db } from '../services/db.js';

const router = Router();

// Health check
router.get('/health', async (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Public metadata & plans configuration
router.get('/config/plans', async (req, res) => {
  res.json({
    success: true,
    data: {
      plans: [
        {
          id: 'free',
          name: 'Free Access',
          price: 0,
          period: 'forever',
          features: [
            'Search bank auction properties across 5 South India regions',
            'View high-level AI rank & discount score',
            'Filter by bank, category, budget and auction date',
            'Access public SARFAESI auction notice details'
          ]
        },
        {
          id: 'pro',
          name: 'Pro Pack',
          price: 499,
          period: 'pack of 5 unlocks',
          badge: 'Most Popular',
          features: [
            '5 property dossier unlocks that never expire',
            'Detailed 4-pillar AI rank breakdown',
            'Chartered engineer site verification report & photos',
            'GPS coordinates, landmark proximity & valuation estimate',
            'Permanent archive access with PDF export'
          ]
        },
        {
          id: 'premium',
          name: 'City Premium',
          price: 1999,
          period: 'per month',
          badge: 'High Value',
          features: [
            'All Pro pack capabilities included',
            'Curated highway, corner and high-commercial lots',
            'Real-time WhatsApp/SMS notifications for new notices',
            'Dedicated legal title report assistance',
            'Direct access to empanelled auction advocates'
          ]
        }
      ]
    }
  });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/auctions', auctionRoutes);
router.use('/categories', categoryRoutes);
router.use('/checker', verificationRoutes);
router.use('/engineer', inspectionRoutes);
router.use('/admin', adminRoutes);
router.use('/me', userRoutes);

export default router;
