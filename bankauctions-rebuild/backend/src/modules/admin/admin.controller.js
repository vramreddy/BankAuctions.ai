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
          searchesPerformed: 124,
          propertyViews: 418
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

export async function publishAuction(req, res, next) {
  try {
    const { id } = req.params;
    const admin = req.user;

    const auction = await db.auctionNotice.findUnique({ where: { id } });
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const updated = await db.auctionNotice.update({
      where: { id },
      data: { status: 'PUBLISHED' }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'PUBLISH_AUCTION_LISTING',
      entityType: 'AUCTION',
      entityId: id,
      beforeState: { status: auction.status },
      afterState: { status: 'PUBLISHED' },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Property listing published successfully.', data: updated });
  } catch (err) {
    next(err);
  }
}

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

    return res.json({ success: true, message: 'Property listing archived from public search.', data: updated });
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

    await db.auctionNotice.update({
      where: { id: auctionId },
      data: { status: 'ENGINEER_ASSIGNED' }
    });

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

export async function approveInspection(req, res, next) {
  try {
    const { id } = req.params; // assignmentId
    const { action } = req.body; // 'APPROVE' or 'REJECT'
    const admin = req.user;

    const assignment = await db.inspectionAssignment.findUnique({
      where: { id },
      include: { auction: true, report: true }
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Inspection assignment not found.' });
    }

    const nextStatus = action === 'APPROVE' ? 'PUBLISHED' : 'NEEDS_CORRECTION';

    await db.inspectionAssignment.update({
      where: { id },
      data: { status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED' }
    });

    await db.auctionNotice.update({
      where: { id: assignment.auctionId },
      data: { status: nextStatus }
    });

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: `ADMIN_${action}_INSPECTION`,
      entityType: 'INSPECTION',
      entityId: id,
      afterState: { newAuctionStatus: nextStatus },
      ipAddress: req.ip
    });

    return res.json({ success: true, message: `Inspection ${action === 'APPROVE' ? 'approved & published' : 'rejected'}.` });
  } catch (err) {
    next(err);
  }
}

export async function importBatch(req, res, next) {
  try {
    const { records } = req.body;
    const admin = req.user;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'records array with structured auction items is required' });
    }

    const banks = await db.bank.findMany();
    const categories = await db.auctionCategory.findMany();

    const createdLots = [];
    const skippedLots = [];

    for (const r of records) {
      // Check existing sourceRef to prevent duplicates
      const existing = await db.auctionNotice.findUnique({ where: { sourceRef: r.sourceRef } });
      if (existing) {
        skippedLots.push({ sourceRef: r.sourceRef, reason: 'Duplicate sourceRef already exists' });
        continue;
      }

      const bank = banks.find((b) => b.code === r.bankCode || b.name === r.bankName) || banks[0];
      const category = categories.find((c) => c.code === r.catCode || c.slug === r.catCode) || categories[0];

      const notice = await db.auctionNotice.create({
        data: {
          sourceRef: r.sourceRef,
          title: r.title,
          shortTitle: r.shortTitle || r.title.slice(0, 30),
          city: (r.city || 'chennai').toLowerCase(),
          locality: r.locality || 'City Centre',
          address: r.address || 'Address disclosed on tender notice',
          pincode: r.pincode || '600001',
          bankId: bank.id,
          categoryId: category.id,
          reservePrice: Number(r.reservePrice),
          estimatedMarketValue: r.estimatedMarketValue ? Number(r.estimatedMarketValue) : Number(r.reservePrice) * 1.3,
          emdAmount: Number(r.emdAmount || r.reservePrice * 0.1),
          bidIncrement: Number(r.bidIncrement || 25000),
          auctionStartDate: new Date(r.auctionStartDate || Date.now() + 14 * 86400000),
          noticeDate: new Date(r.noticeDate || Date.now()),
          possession: r.possession || 'Symbolic possession',
          encumbrances: r.encumbrances || 'None known',
          contactOfficerName: r.contactOfficerName || 'Authorized Officer',
          contactOfficerPhone: r.contactOfficerPhone || '044 2499 4423',
          aiScore: Number(r.aiScore || 75),
          aiRank: Number(r.aiRank || 1),
          aiDiscountPct: Number(r.aiDiscountPct || 25),
          isPremium: Boolean(r.isPremium),
          hasBankPhotos: Boolean(r.hasBankPhotos),
          primaryImageUrl: r.primaryImageUrl || `/images/${(r.city || 'chennai').toLowerCase()}-${category.code}-1.jpg`,
          additionalImages: r.additionalImages || [],
          status: 'PENDING_CHECKER',
          attributes: r.attributes || {}
        }
      });
      createdLots.push(notice);
    }

    await logAuditEvent({
      actorId: admin.id,
      actorName: admin.fullName,
      actorRole: admin.role,
      action: 'IMPORT_AUCTION_BATCH',
      entityType: 'IMPORT_BATCH',
      entityId: `batch-${Date.now()}`,
      afterState: { imported: createdLots.length, skipped: skippedLots.length },
      ipAddress: req.ip
    });

    return res.status(201).json({
      success: true,
      message: `Batch imported: ${createdLots.length} records staged for Checker review. ${skippedLots.length} duplicates skipped.`,
      importedCount: createdLots.length,
      skippedCount: skippedLots.length,
      data: createdLots
    });
  } catch (err) {
    next(err);
  }
}

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
    const admin = req.user;

    const user = await db.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const updated = await db.user.update({
      where: { id },
      data: {
        unlocksRemaining: user.unlocksRemaining + Number(count),
        planTier: user.planTier === 'FREE' ? 'PRO' : user.planTier
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

    return res.json({ success: true, message: `Granted ${count} unlocks to ${user.fullName}`, data: updated });
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

    return res.json({ success: true, message: `User account ${updated.isActive ? 'reinstated' : 'suspended'}`, data: updated });
  } catch (err) {
    next(err);
  }
}

export async function createStaff(req, res, next) {
  try {
    const { email, password, fullName, phone, role, city } = req.body;
    const admin = req.user;

    if (!['CHECKER', 'ENGINEER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Role must be CHECKER, ENGINEER, or ADMIN' });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Staff member with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password || 'Staff@123456', salt);

    const staff = await db.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        phone: phone || `98400${Math.floor(10000 + Math.random() * 90000)}`,
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

    const updated = await db.siteSetting.update({
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

    return res.json({ success: true, message: 'Platform settings updated', data: updated });
  } catch (err) {
    next(err);
  }
}
