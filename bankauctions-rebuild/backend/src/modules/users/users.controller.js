import { buyerAsset } from '../auctions/auctions.controller.js';
import { publishedWhere } from '../workflow/notices.service.js';
import { db } from '../../services/db.js';

export async function getSavedProperties(req, res, next) {
  try {
    const userId = req.user.id;
    const list = await db.savedProperty.findMany({
      where: { userId, auction: publishedWhere },
      include: { auction: { include: { bank: true, category: true, attributes: true } } }
    });

    return res.json({
      success: true,
      data: list.map(item => ({ ...item, auction: buyerAsset(item.auction) }))
    });
  } catch (err) {
    next(err);
  }
}

export async function getUnlockedProperties(req, res, next) {
  try {
    const userId = req.user.id;
    const list = await db.propertyUnlock.findMany({
      where: { userId, auction: publishedWhere },
      include: { auction: { include: { bank: true, category: true, attributes: true } } }
    });

    return res.json({
      success: true,
      data: list.map(item => ({ ...item, auction: buyerAsset(item.auction) }))
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id;
    const { fullName, city } = req.body;

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        ...(fullName && { fullName }),
        ...(city && { city })
      }
    });

    const { passwordHash, ...clean } = updated;
    return res.json({ success: true, message: 'Profile updated', data: clean });
  } catch (err) {
    next(err);
  }
}
