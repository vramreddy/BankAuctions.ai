import { db } from '../../services/db.js';

export async function getCategories(req, res, next) {
  try {
    const { city } = req.query;
    const categories = await db.auctionCategory.findMany();

    // Attach real live counts
    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const where = {
          categoryId: cat.id,
          status: 'PUBLISHED'
        };
        if (city && city !== 'all') {
          where.city = city.toLowerCase();
        }
        const count = await db.auctionNotice.count({ where });
        return {
          ...cat,
          count
        };
      })
    );

    return res.json({
      success: true,
      data: enriched
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const category = await db.auctionCategory.findUnique({ where: { slug } });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    return res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
}
