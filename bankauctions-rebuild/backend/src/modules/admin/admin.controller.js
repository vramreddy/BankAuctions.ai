import { importNotices, fail } from '../workflow/notices.service.js';
import { reviewInspection } from '../workflow/field.service.js';
import { db } from '../../services/db.js';
import { logAuditEvent } from '../../services/audit.service.js';
import bcrypt from 'bcryptjs';

export async function getOverview(req, res, next) {
  try {
    const totalAuctions = await db.auctionNotice.count();
    const publishedAuctions = await db.auctionNotice.count({ where: { status: 'PUBLISHED' } });
    const pendingChecker = await db.auctionNotice.count({ where: { status: 'PENDING_CHECKER' } });
    const pendingInspections = await db.inspectionAssignment.findMany({ where: { status: 'ASSIGNED' } });
    const inspectionSubmissions = await db.auctionNotice.count({ where: { status: 'INSPECTION_SUBMITTED' } });
    const checkerVerified = await db.auctionNotice.count({ where: { status: 'CHECKER_VERIFIED' } });
    const totalBuyers = await db.user.count({ where: { role: 'BUYER' } });
    const recentAudits = (await db.auditLog.findMany()).slice(0, 8);

    // City aggregation
    const allAuctions = await db.auctionNotice.findMany();
    const cityCounts = {};
    const categoryCounts = {};
    for (const a of allAuctions) {
      cityCounts[a.city] = (cityCounts[a.city] || 0) + 1;
      categoryCounts[a.categoryId] = (categoryCounts[a.categoryId] || 0) + 1;
    }

    return res.json({
      success: true,
      data: {
        metrics: {
          totalAuctions,
          publishedAuctions,
          pendingChecker,
          pendingInspections: pendingInspections.length,
          pendingApprovals: inspectionSubmissions + checkerVerified,
          totalBuyers,
          searchesPerformed: null,
          propertyViews: null
        },
        cityCounts,
        recentAudits
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAuctions(req, res, next) {
  try {
    const { status, city, categoryId, page = 1, limit = 50 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (city && city !== 'all') where.city = city.toLowerCase();
    if (categoryId) where.categoryId = categoryId;

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const take = Number(limit);

    const auctions = await db.auctionNotice.findMany({
      where,
      include: {
        bank: true,
        category: true,
        attributes: true,
        inspectionAssignments: true
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take
    });

    const total = await db.auctionNotice.count({ where });

    return res.json({
      success: true,
      data: auctions,
      meta: { total, page: Number(page), limit: Number(limit) }
    });
  } catch (err) {
    next(err);
  }
}

export async function publishAuction(req,res,next){try{const item=await db.auctionNotice.findUnique({where:{id:req.params.id},include:{extraction:true}});if(!item?.checkerApprovedAt||item.extraction?.status!=='APPROVED')fail(409,'Checker approval is required. Import and review the notice in the checker registry first.');const data=await db.auctionNotice.update({where:{id:item.id},data:{status:'PUBLISHED'}});await logAuditEvent({actorId:req.user.id,actorName:req.user.fullName,actorRole:req.user.role,action:'REPUBLISH_APPROVED_ASSET',entityType:'AUCTION',entityId:item.id});res.json({success:true,data});}catch(e){next(e);}}

export async function unpublishAuction(req, res, next) {
  try {
    const { id } = req.params;
    const admin = req.user;

    const auction = await db.auctionNotice.findUnique({ where: { id } });
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const updated = await db.auctionNotice.update({
      where: { id },
      data: { status: 'ARCHIVED' }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'UNPUBLISH_AUCTION_LISTING',
      entityType: 'AUCTION',
      entityId: id,
      beforeState: { status: auction.status },
      afterState: { status: 'ARCHIVED' },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Property listing archived from public search.', data: { id:updated.id,unlocksRemaining:updated.unlocksRemaining,isActive:updated.isActive } });
  } catch (err) {
    next(err);
  }
}

export async function assignEngineer(req, res, next) {
  try {
    const { auctionId, engineerId, scheduledDate, scheduledSlot } = req.body;
    const admin = req.user;

    if (!auctionId || !engineerId) {
      return res.status(400).json({ success: false, message: 'auctionId and engineerId are required.' });
    }

    const engineer = await db.user.findFirst({where:{id:engineerId,role:'ENGINEER',isActive:true}});
    if(!engineer) fail(400,'Select an active engineer.');
    const assignment = await db.inspectionAssignment.create({
      data: {
        auctionId,
        engineerId,
        assignedById: admin.id,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        scheduledSlot: scheduledSlot || 'Morning (10:00 AM - 1:00 PM)',
        status: 'ASSIGNED'
      }
    });

    // Assignments do not change listing publication status.

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'ASSIGN_FIELD_ENGINEER',
      entityType: 'AUCTION',
      entityId: auctionId,
      afterState: { engineerId, scheduledDate, scheduledSlot },
      ipAddress: req.ip
    });

    return res.status(201).json({ success: true, message: 'Inspection assigned to engineer successfully.', data: assignment });
  } catch (err) {
    next(err);
  }
}

export async function approveInspection(req,res,next){try{const data=await reviewInspection(req.user,req.params.id,{action:req.body.action==='APPROVE'?'APPROVE':'RETURN',notes:req.body.notes});res.json({success:true,data});}catch(e){next(e);}}

export async function importBatch(req,res,next){try{const data=await importNotices(req.user,req.body.records,req.body.sourceName);res.status(201).json({success:true,data:data.imported,importedCount:data.imported.length,skippedCount:data.duplicates.length,message:'Imported into checker registry. Nothing has been published.'});}catch(e){next(e);}}

export async function getUsers(req, res, next) {
  try {
    const { role } = req.query;
    const where = {};
    if (role) where.role = role.toUpperCase();

    const users = await db.user.findMany({ where });
    const clean = users.map(({ passwordHash, ...u }) => u);
    return res.json({ success: true, data: clean });
  } catch (err) {
    next(err);
  }
}

export async function giftUnlocks(req, res, next) {
  try {
    const { id } = req.params;
    const { count = 5 } = req.body;
    if(!Number.isInteger(count)||count<1||count>1000) return res.status(400).json({success:false,message:'Credits must be a whole number between 1 and 1000.'});
    const admin = req.user;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        unlocksRemaining: { increment: count },
        planTier: user.planTier
      }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'GIFT_PROPERTY_UNLOCKS',
      entityType: 'USER',
      entityId: id,
      afterState: { granted: count, total: updated.unlocksRemaining },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `Granted ${count} unlocks to ${user.fullName}`, data: { id:updated.id,unlocksRemaining:updated.unlocksRemaining,isActive:updated.isActive } });
  } catch (err) {
    next(err);
  }
}

export async function toggleUserStatus(req, res, next) {
  try {
    const { id } = req.params;
    const admin = req.user;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = await db.user.update({
      where: { id },
      data: { isActive: !user.isActive }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: updated.isActive ? 'REINSTATE_USER' : 'SUSPEND_USER',
      entityType: 'USER',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `User account ${updated.isActive ? 'reinstated' : 'suspended'}`, data: { id:updated.id,unlocksRemaining:updated.unlocksRemaining,isActive:updated.isActive } });
  } catch (err) {
    next(err);
  }
}

export async function createStaff(req, res, next) {
  try {
    const { password, fullName, phone, role, city } = req.body;
    const email=String(req.body.email||'').trim().toLowerCase();
    if(!email.includes('@')||!fullName?.trim()||!/^\d{10}$/.test(phone||'')) return res.status(400).json({success:false,message:'Provide a name, valid email and ten-digit phone.'});
    const admin = req.user;

    if (!['CHECKER', 'ENGINEER', 'MARKETING', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be CHECKER, ENGINEER, MARKETING or ADMIN' });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Staff member with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    if (typeof password !== 'string' || password.length < 12) return res.status(400).json({success:false,message:'Choose a staff password of at least 12 characters.'});
    const passwordHash = await bcrypt.hash(password, salt);

    const staff = await db.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone,
        role,
        city: city || 'chennai',
        isActive: true
      }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'CREATE_STAFF_MEMBER',
      entityType: 'USER',
      entityId: staff.id,
      afterState: { role, email },
      ipAddress: req.ip
    });

    const { passwordHash: _, ...clean } = staff;
    return res.status(201).json({ success: true, message: 'Staff account created successfully', data: clean });
  } catch (err) {
    next(err);
  }
}

export async function getAuditLogs(req, res, next) {
  try {
    const logs = await db.auditLog.findMany();
    return res.json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
}

export async function getSettings(req, res, next) {
  try {
    const settings = await db.siteSetting.findFirst();
    return res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

export async function updateSettings(req, res, next) {
  try {
    const { makerAutoPublish, chatWidget, bannerNotice } = req.body;
    const admin = req.user;

    const settings = await db.siteSetting.findFirst();
    const updated = await db.siteSetting.update({
      where: { id: settings.id },
      data: {
        ...(makerAutoPublish !== undefined && { makerAutoPublish }),
        ...(chatWidget !== undefined && { chatWidget }),
        ...(bannerNotice !== undefined && { bannerNotice })
      }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'UPDATE_PLATFORM_SETTINGS',
      entityType: 'SYSTEM_SETTINGS',
      entityId: 'ROOT',
      afterState: updated,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Platform settings updated', data: { id:updated.id,unlocksRemaining:updated.unlocksRemaining,isActive:updated.isActive } });
  } catch (err) {
    next(err);
  }
}
