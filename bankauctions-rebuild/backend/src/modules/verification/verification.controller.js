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

export async function submitReview(req, res, next) {
  try {
    const { id } = req.params;
    const checker = req.user;
    const validated = checkerCorrectionSchema.parse(req.body);

    const auction = await db.auctionNotice.findUnique({ where: { id } });
    if (!auction) {
      return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    let nextStatus = 'CHECKER_VERIFIED';
    if (validated.decision === 'REJECTED') {
      nextStatus = 'REJECTED';
    } else if (validated.decision === 'NEEDS_CORRECTION') {
      nextStatus = 'NEEDS_CORRECTION';
    }

    const updatedAuction = await db.auctionNotice.update({
      where: { id },
      data: {
        status: nextStatus,
        claimedByCheckerId: null,
        claimedAt: null,
        // Apply field corrections if supplied
        ...(validated.corrections?.reservePrice && { reservePrice: Number(validated.corrections.reservePrice) }),
        ...(validated.corrections?.emdAmount && { emdAmount: Number(validated.corrections.emdAmount) }),
        ...(validated.corrections?.auctionStartDate && { auctionStartDate: new Date(validated.corrections.auctionStartDate) }),
        ...(validated.corrections?.possession && { possession: validated.corrections.possession })
      }
    });

    await db.verificationReview.create({
      data: {
        auctionId: id,
        checkerId: checker.id,
        decision: validated.decision,
        correctionNotes: validated.correctionNotes || 'Verified by quality team',
        fieldCorrections: validated.corrections || {}
      }
    });

    await logAuditEvent({
      actorId: checker.id,
      actorName: checker.fullName,
      actorRole: checker.role,
      action: `CHECKER_${validated.decision}`,
      entityType: 'AUCTION',
      entityId: id,
      beforeState: { status: auction.status },
      afterState: { status: nextStatus, corrections: validated.corrections },
      ipAddress: req.ip
    });

    return res.json({
      success: true,
      message: `Verification review saved. Status updated to ${nextStatus}.`,
      data: updatedAuction
    });
  } catch (err) {
    next(err);
  }
}

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
