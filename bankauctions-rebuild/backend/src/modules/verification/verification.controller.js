import { db } from '../../services/db.js';
import { logAuditEvent } from '../../services/audit.service.js';
import { checkerCorrectionSchema } from '../../../../shared/schemas/auctionSchemas.js';

export async function getQueue(req, res, next) {
  try {
    const { city, search } = req.query;

    const where = {
      status: 'PENDING_CHECKER'
    };

    if (city && city !== 'all') {
      where.city = city.toLowerCase();
    }

    let items = await db.auctionNotice.findMany({
      where,
      include: {
        bank: true,
        category: true,
        attributes: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (i) =>
          i.sourceRef.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.locality.toLowerCase().includes(q)
      );
    }

    return res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (err) {
    next(err);
  }
}

export async function claimLot(req, res, next) {
  try {
    const { id } = req.params;
    const checker = req.user;

    const auction = await db.auctionNotice.findUnique({ where: { id } });
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Auction not found' });
    }

    if (auction.claimedByCheckerId && auction.claimedByCheckerId !== checker.id) {
      return res.status(409).json({
        success: false,
        message: 'This auction notice is already being reviewed by another checker.'
      });
    }

    const updated = await db.auctionNotice.update({
      where: { id },
      data: {
        claimedByCheckerId: checker.id,
        claimedAt: new Date()
      }
    });

    await logAuditEvent({
      actorId: checker.id,
      actorName: checker.fullName,
      actorRole: checker.role,
      action: 'CLAIM_CHECKER_NOTICE',
      entityType: 'AUCTION',
      entityId: id,
      ipAddress: req.ip
    });

    return res.json({ success: true, message: 'Notice claimed for verification', data: updated });
  } catch (err) {
    next(err);
  }
}

export async function getReviewDetails(req, res, next) {
  try {
    const { id } = req.params;
    const auction = await db.auctionNotice.findUnique({
      where: { id },
      include: {
        bank: true,
        category: true,
        attributes: true,
        verificationReviews: true
      }
    });

    if (!auction) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    return res.json({
      success: true,
      data: auction
    });
  } catch (err) {
    next(err);
  }
}

export async function submitReview(req,res){return res.status(409).json({success:false,message:'Use the notice registry review workflow; legacy review cannot publish an asset.'});}

export async function getCheckerHistory(req, res, next) {
  try {
    const checkerId = req.user.id;
    const reviews = await db.verificationReview.findMany({
      where: { checkerId }
    });

    return res.json({
      success: true,
      data: reviews
    });
  } catch (err) {
    next(err);
  }
}
