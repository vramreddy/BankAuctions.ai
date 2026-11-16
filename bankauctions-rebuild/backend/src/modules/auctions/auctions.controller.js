import { db } from '../../services/db.js';
import { logAuditEvent } from '../../services/audit.service.js';

export async function getAuctions(req, res, next) {
  try {
    const {
      city,
      cat,
      categoryId,
      bankId,
      maxBudget,
      minBudget,
      days,
      prem,
      sort = 'rank',
      search,
      page = 1,
      limit = 24
    } = req.query;

    const where = {
      status: 'PUBLISHED'
    };

    if (city && city !== 'all') {
      where.city = city.toLowerCase();
    }

    if (cat) {
      const category = await db.auctionCategory.findUnique({ where: { slug: cat } });
      if (category) {
        where.categoryId = category.id;
      }
    } else if (categoryId) {
      where.categoryId = categoryId;
    }

    if (bankId) {
      where.bankId = bankId;
    }

    if (prem === '1' || prem === 'true') {
      where.isPremium = true;
    }

    if (maxBudget) {
      // In INR (if passed as Lakhs like 50, multiply by 100000; if passed as absolute INR, use as is)
      const num = Number(maxBudget);
      const val = num < 5000 ? num * 100000 : num;
      where.reservePrice = { ...(where.reservePrice || {}), lte: val };
    }

    if (minBudget) {
      const num = Number(minBudget);
      const val = num < 5000 ? num * 100000 : num;
      where.reservePrice = { ...(where.reservePrice || {}), gte: val };
    }

    const orderBy = {};
    if (sort === 'price_asc') {
      orderBy.reservePrice = 'asc';
    } else if (sort === 'price_desc') {
      orderBy.reservePrice = 'desc';
    } else if (sort === 'days') {
      orderBy.auctionStartDate = 'asc';
    } else {
      orderBy.aiScore = 'desc';
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const take = Number(limit);

    let auctions = await db.auctionNotice.findMany({
      where,
      include: {
        bank: true,
        category: true,
        attributes: true,
        inspectionAssignments: true
      },
      orderBy,
      skip,
      take
    });

    // In-memory text search filtering if query provided
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      auctions = auctions.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.locality.toLowerCase().includes(q) ||
          a.address.toLowerCase().includes(q) ||
          (a.bank && a.bank.name.toLowerCase().includes(q))
      );
    }

    // Days closing filter
    if (days && Number(days) > 0) {
      const maxMs = Number(days) * 86400000;
      const now = Date.now();
      auctions = auctions.filter((a) => {
        const diff = new Date(a.auctionStartDate).getTime() - now;
        return diff > 0 && diff <= maxMs;
      });
    }

    const totalCount = await db.auctionNotice.count({ where });

    // Track analytics search event
    if (req.user) {
      await db.analyticsEvent.create({
        data: {
          eventType: 'SEARCH',
          entityId: city || 'all',
          userId: req.user.id,
          metadata: { city, cat, maxBudget, search }
        }
      });
    }

    return res.json({
      success: true,
      data: auctions,
      meta: {
        total: totalCount,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(totalCount / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getFeaturedAuctions(req, res, next) {
  try {
    const auctions = await db.auctionNotice.findMany({
      where: {
        status: 'PUBLISHED',
        featured: true
      },
      include: {
        bank: true,
        category: true,
        attributes: true
      },
      orderBy: { aiScore: 'desc' },
      take: 5
    });

    return res.json({
      success: true,
      data: auctions
    });
  } catch (err) {
    next(err);
  }
}

export async function getAuctionById(req, res, next) {
  try {
    const { id } = req.params;
    const auction = await db.auctionNotice.findUnique({
      where: { id },
      include: {
        bank: true,
        category: true,
        attributes: true,
        inspectionAssignments: true
      }
    });

    if (!auction) {
      return res.status(404).json({ success: false, message: 'Property auction notice not found.' });
    }

    let isUnlocked = false;
    let isSaved = false;

    if (req.user) {
      const unlockRecord = await db.propertyUnlock.findUnique({
        where: {
          userId_auctionId: {
            userId: req.user.id,
            auctionId: id
          }
        }
      });
      isUnlocked = Boolean(unlockRecord || req.user.role === 'ADMIN' || req.user.role === 'CHECKER' || req.user.role === 'ENGINEER');

      const saveRecord = await db.savedProperty.findUnique({
        where: {
          userId_auctionId: {
            userId: req.user.id,
            auctionId: id
          }
        }
      });
      isSaved = Boolean(saveRecord);

      // Track view
      await db.analyticsEvent.create({
        data: {
          eventType: 'VIEW_PROPERTY',
          entityId: id,
          userId: req.user.id,
          metadata: { city: auction.city, category: auction.category?.code }
        }
      });
    }

    return res.json({
      success: true,
      data: auction,
      userState: {
        isUnlocked,
        isSaved
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function unlockAuction(req, res, next) {
  try {
    const { id } = req.params;
    const user = req.user;

    const auction = await db.auctionNotice.findUnique({ where: { id } });
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    const existing = await db.propertyUnlock.findUnique({
      where: {
        userId_auctionId: {
          userId: user.id,
          auctionId: id
        }
      }
    });

    if (existing) {
      return res.json({ success: true, message: 'Property is already unlocked in your archive', isUnlocked: true });
    }

    if (user.unlocksRemaining <= 0) {
      return res.status(402).json({
        success: false,
        message: 'No property unlocks remaining. Please top up with a Pro pack to unlock full valuation details.'
      });
    }

    // Deduct 1 credit
    await db.user.update({
      where: { id: user.id },
      data: { unlocksRemaining: user.unlocksRemaining - 1 }
    });

    await db.propertyUnlock.create({
      data: {
        userId: user.id,
        auctionId: id
      }
    });

    await logAuditEvent({
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'UNLOCK_PROPERTY_DOSSIER',
      entityType: 'AUCTION',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: 'Property unlocked successfully. Saved to your permanent archive.',
      unlocksRemaining: user.unlocksRemaining - 1,
      isUnlocked: true
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleSaveAuction(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await db.savedProperty.findUnique({
      where: {
        userId_auctionId: {
          userId,
          auctionId: id
        }
      }
    });

    if (existing) {
      await db.savedProperty.delete({
        where: {
          userId_auctionId: {
            userId,
            auctionId: id
          }
        }
      });
      return res.json({ success: true, saved: false, message: 'Removed from bookmarks' });
    } else {
      await db.savedProperty.create({
        data: {
          userId,
          auctionId: id
        }
      });
      return res.json({ success: true, saved: true, message: 'Saved to bookmarks' });
    }
  } catch (err) {
    next(err);
  }
}
