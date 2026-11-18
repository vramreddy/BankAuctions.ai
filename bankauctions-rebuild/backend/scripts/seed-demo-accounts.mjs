import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { db } from '../src/services/db.js';

const accounts = [
  {
    email: 'admin@bankauctions.ai',
    fullName: 'Central Administrator',
    phone: '+919999900001',
    role: 'ADMIN',
    password: 'Admin@123'
  },
  {
    email: 'checker@bankauctions.ai',
    fullName: 'Quality Checker',
    phone: '+919999900002',
    role: 'CHECKER',
    password: 'Checker@123'
  },
  {
    email: 'advocate@bankauctions.ai',
    fullName: 'Senior Legal Advocate (12B Desk)',
    phone: '+919999900003',
    role: 'ADVOCATE',
    password: 'Advocate@123'
  },
  {
    email: 'engineer@bankauctions.ai',
    fullName: 'Field Valuation Engineer',
    phone: '+919999900004',
    role: 'ENGINEER',
    password: 'Engineer@123'
  },
  {
    email: 'buyer@bankauctions.ai',
    fullName: 'Commercial Investor',
    phone: '+919999900005',
    role: 'BUYER',
    password: 'Buyer@123'
  }
];

async function seed() {
  console.log('Seeding demo accounts for all panels...');
  for (const acc of accounts) {
    const passwordHash = await bcrypt.hash(acc.password, 10);
    const existing = await db.user.findUnique({ where: { email: acc.email } });
    if (existing) {
      await db.user.update({
        where: { id: existing.id },
        data: {
          fullName: acc.fullName,
          role: acc.role,
          passwordHash,
          isActive: true
        }
      });
      console.log(`Updated ${acc.role}: ${acc.email} / ${acc.password}`);
    } else {
      await db.user.create({
        data: {
          email: acc.email,
          fullName: acc.fullName,
          phone: acc.phone,
          role: acc.role,
          passwordHash,
          planTier: acc.role === 'BUYER' ? 'PRO' : 'FREE',
          unlocksRemaining: acc.role === 'BUYER' ? 5 : 0,
          isActive: true
        }
      });
      console.log(`Created ${acc.role}: ${acc.email} / ${acc.password}`);
    }
  }
  console.log('All panel demo accounts are ready.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Failed to seed accounts:', err);
  process.exit(1);
});
