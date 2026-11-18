import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes.js';
import auctionRoutes from '../modules/auctions/auctions.routes.js';
import categoryRoutes from '../modules/categories/categories.routes.js';
import verificationRoutes from '../modules/verification/verification.routes.js';
import inspectionRoutes from '../modules/inspections/inspections.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import userRoutes from '../modules/users/users.routes.js';
import paymentRoutes from '../modules/payments/payments.routes.js';
import managementRoutes from '../modules/workflow/management.routes.js';
import workflowRoutes from '../modules/workflow/workflow.routes.js';
import { db } from '../services/db.js';

const router = Router();

// Readiness includes the persistent database.
router.get('/health', async (req,res) => {
 try { await db.$queryRaw`SELECT 1`; res.json({status:'healthy',database:'connected'}); }
 catch { res.status(503).json({status:'unavailable',database:'unavailable'}); }
});
router.get('/config/plans', (req,res) => res.json({success:true,data:{plans:[
 {id:'free',name:'Free',price:0,features:['Basic location, category and budget search','Checker support','Three initial unlock credits']},
 {id:'pro',name:'Pro',price:null,features:['All Free features','Bank filters','Auction date filters']},
 {id:'premium',name:'Premium',price:null,features:['All Pro features','Possession and valuation filters','Priority requests']},
 {id:'pro_premium',name:'Pro Premium',price:null,features:['All Premium features','Advanced exports']}
]}}));

// Mount modules
router.use('/auth', authRoutes);
router.use('/auctions', auctionRoutes);
router.use('/categories', categoryRoutes);
router.use('/checker', verificationRoutes);
router.use('/engineer', inspectionRoutes);
router.use('/admin', adminRoutes);
router.use('/me', userRoutes);
router.use('/workflow', workflowRoutes);
router.use('/management', managementRoutes);
router.use('/payments', paymentRoutes);

export default router;
