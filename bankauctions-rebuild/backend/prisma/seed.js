import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { CATEGORY_DETAILS } from '../../shared/constants/categories.js';
const db = new PrismaClient();
try {
  for (const [code, category] of Object.entries(CATEGORY_DETAILS)) {
    await db.auctionCategory.upsert({ where: { code }, create: { code, name: category.name, slug: category.slug, icon: category.icon, description: category.description }, update: { name: category.name, slug: category.slug } });
  }
  for (const [code, name, slug] of [['machinery', 'Machinery & Equipment', 'machinery'], ['other', 'Other Assets', 'other']]) await db.auctionCategory.upsert({ where: { code }, create: { code, name, slug }, update: {} });
  await db.siteSetting.upsert({ where: { id: 'default-setting' }, create: { id: 'default-setting', makerAutoPublish: false }, update: { makerAutoPublish: false } });
  console.log('Reference data ready. No users or auction listings were created or deleted.');
} finally { await db.$disconnect(); }
