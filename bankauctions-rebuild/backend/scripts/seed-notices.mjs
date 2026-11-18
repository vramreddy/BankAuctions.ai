import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding sample bank notices into PostgreSQL...');

  // Ensure banks exist
  const sbi = await prisma.bank.upsert({
    where: { code: 'SBI' },
    update: {},
    create: {
      code: 'SBI',
      name: 'State Bank of India',
      contactPhone: '9962052203'
    }
  });

  const canara = await prisma.bank.upsert({
    where: { code: 'CANARA' },
    update: {},
    create: {
      code: 'CANARA',
      name: 'Canara Bank',
      contactPhone: '8220095299'
    }
  });

  const iob = await prisma.bank.upsert({
    where: { code: 'IOB' },
    update: {},
    create: {
      code: 'IOB',
      name: 'Indian Overseas Bank',
      contactPhone: '9597711515'
    }
  });

  // Ensure categories exist
  const flatCat = await prisma.auctionCategory.upsert({
    where: { code: 'flat' },
    update: {},
    create: { code: 'flat', name: 'Apartment / Flat', slug: 'flat' }
  });

  const houseCat = await prisma.auctionCategory.upsert({
    where: { code: 'house' },
    update: {},
    create: { code: 'house', name: 'Independent House / Villa', slug: 'house' }
  });

  const landCat = await prisma.auctionCategory.upsert({
    where: { code: 'land' },
    update: {},
    create: { code: 'land', name: 'Residential Plot / Land', slug: 'land' }
  });

  const commercialCat = await prisma.auctionCategory.upsert({
    where: { code: 'commercial' },
    update: {},
    create: { code: 'commercial', name: 'Commercial Building / Shop', slug: 'commercial' }
  });

  // Notice 1: SBI Flat in Chennai (Adhanur Village, Kundrathur)
  await prisma.auctionNotice.upsert({
    where: { sourceRef: 'SBI-CHE-2026-F6' },
    update: { status: 'PUBLISHED', featured: true, checkerApprovedAt: new Date() },
    create: {
      sourceRef: 'SBI-CHE-2026-F6',
      bankId: sbi.id,
      categoryId: flatCat.id,
      title: '2 BHK Residential Apartment (799 Sq.ft) in Shri Sai Homes, Adhanur',
      shortTitle: '2 BHK Flat, Kundrathur',
      city: 'chennai',
      locality: 'Kundrathur / Adhanur',
      address: 'Flat No. S-2, Second Floor, Shri Sai Homes, Plot No: 20, Sri Sai Baba Nagar, Adhanur Village, Kundrathur Taluk, Kancheepuram District, Chennai - 603202',
      pincode: '603202',
      reservePrice: 2300000,
      estimatedMarketValue: 3400000,
      emdAmount: 230000,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-11-27T10:00:00.000Z'),
      inspectionDate: '2026-11-22',
      possession: 'Physical possession',
      encumbrances: 'None disclosed. Title verified clean by SBI panel advocate.',
      contactOfficerName: 'Recovery Officer SARB Chennai',
      contactOfficerPhone: '9962052203',
      aiScore: 92,
      aiRank: 1,
      aiDiscountPct: 32.4,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      status: 'PUBLISHED',
      checkerApprovedAt: new Date(),
      primaryImageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  });

  // Notice 2: Luxury Sea-Facing Villa / Apartment in OMR Chennai
  await prisma.auctionNotice.upsert({
    where: { sourceRef: 'SBI-CHE-2026-OMR' },
    update: { status: 'PUBLISHED', featured: true, checkerApprovedAt: new Date() },
    create: {
      sourceRef: 'SBI-CHE-2026-OMR',
      bankId: sbi.id,
      categoryId: flatCat.id,
      title: '3 BHK Sea-View Luxury Apartment (1,840 Sq.ft), OMR IT Corridor',
      shortTitle: '3 BHK Luxury Apt, OMR',
      city: 'chennai',
      locality: 'OMR - Sholinganallur',
      address: 'Tower B, 11th Floor, Prestige Cyber Towers, Rajiv Gandhi Salai (OMR), Sholinganallur, Chennai - 600119',
      pincode: '600119',
      reservePrice: 6850000,
      estimatedMarketValue: 10500000,
      emdAmount: 685000,
      bidIncrement: 50000,
      auctionStartDate: new Date('2026-11-28T11:00:00.000Z'),
      inspectionDate: '2026-11-24',
      possession: 'Physical possession',
      encumbrances: 'Nil encumbrance certificate obtained for 32 years.',
      contactOfficerName: 'Chief Manager SAMB Chennai',
      contactOfficerPhone: '9840012345',
      aiScore: 95,
      aiRank: 2,
      aiDiscountPct: 34.8,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      status: 'PUBLISHED',
      checkerApprovedAt: new Date(),
      primaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80',
      additionalImages: [
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80'
      ]
    }
  });

  // Notice 3: Canara Bank Commercial Plot / Land (Rajapalayam / South TN)
  await prisma.auctionNotice.upsert({
    where: { sourceRef: 'CAN-VNR-2026-P1' },
    update: { status: 'PUBLISHED', featured: true, checkerApprovedAt: new Date() },
    create: {
      sourceRef: 'CAN-VNR-2026-P1',
      bankId: canara.id,
      categoryId: landCat.id,
      title: 'Commercial / Residential Plot (2,277 Sq.ft) in Alagai Nagar',
      shortTitle: 'Commercial Plot 2277 sqft',
      city: 'chennai',
      locality: 'Alagai Nagar',
      address: 'Ward No: 28, Alagai Nagar, Survey No: 17/1B2, Rajapalayam Sub Registrar Jurisdiction, Tamil Nadu - 626108',
      pincode: '626108',
      reservePrice: 5638000,
      estimatedMarketValue: 8200000,
      emdAmount: 563800,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-12-16T12:30:00.000Z'),
      inspectionDate: '2026-12-05',
      possession: 'Symbolic possession',
      encumbrances: 'SARFAESI Section 13(4) possession established.',
      contactOfficerName: 'Canara Bank Branch Manager',
      contactOfficerPhone: '8220095299',
      aiScore: 88,
      aiRank: 3,
      aiDiscountPct: 31.2,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      status: 'PUBLISHED',
      checkerApprovedAt: new Date(),
      primaryImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80'
    }
  });

  // Notice 4: Indian Overseas Bank Residential Plot (Kancheepuram)
  await prisma.auctionNotice.upsert({
    where: { sourceRef: 'IOB-KPM-2026-M94' },
    update: { status: 'PUBLISHED', featured: true, checkerApprovedAt: new Date() },
    create: {
      sourceRef: 'IOB-KPM-2026-M94',
      bankId: iob.id,
      categoryId: landCat.id,
      title: 'TNHB Approved M.I.G Residential Plot (1,590 Sq.ft), Pappankuzhi',
      shortTitle: 'TNHB MIG Plot, Kanchipuram',
      city: 'chennai',
      locality: 'Kancheepuram / Pappankuzhi',
      address: 'M.I.G Plot No. M-94, TNHB Scheme Phase-II, Pappankuzhi Village, Kancheepuram Taluk - 631502',
      pincode: '631502',
      reservePrice: 1510500,
      estimatedMarketValue: 2400000,
      emdAmount: 151050,
      bidIncrement: 20000,
      auctionStartDate: new Date('2026-12-10T10:00:00.000Z'),
      inspectionDate: '2026-12-02',
      possession: 'Symbolic possession',
      encumbrances: 'None. TNHB direct allotment with full clear documentation.',
      contactOfficerName: 'Authorized Officer IOB Kancheepuram',
      contactOfficerPhone: '9597711515',
      aiScore: 89,
      aiRank: 4,
      aiDiscountPct: 37.1,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      status: 'PUBLISHED',
      checkerApprovedAt: new Date(),
      primaryImageUrl: 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?auto=format&fit=crop&w=1000&q=80'
    }
  });

  // Notice 5: Independent Commercial House / Building in Anna Nagar
  await prisma.auctionNotice.upsert({
    where: { sourceRef: 'SBI-CHE-2026-AN' },
    update: { status: 'PUBLISHED', featured: true, checkerApprovedAt: new Date() },
    create: {
      sourceRef: 'SBI-CHE-2026-AN',
      bankId: sbi.id,
      categoryId: houseCat.id,
      title: 'G+2 Independent Residential Bungalow (3,200 Sq.ft), Anna Nagar West',
      shortTitle: 'G+2 Bungalow, Anna Nagar',
      city: 'chennai',
      locality: 'Anna Nagar West',
      address: 'Plot No. 418, 12th Main Road, Anna Nagar West Extension, Chennai - 600101',
      pincode: '600101',
      reservePrice: 19500000,
      estimatedMarketValue: 29000000,
      emdAmount: 1950000,
      bidIncrement: 100000,
      auctionStartDate: new Date('2026-12-04T11:00:00.000Z'),
      inspectionDate: '2026-11-28',
      possession: 'Physical possession',
      encumbrances: 'Court Receiver vacant possession handed over. 100% Clear Title.',
      contactOfficerName: 'Assistant General Manager SBI SAMB',
      contactOfficerPhone: '9962052203',
      aiScore: 96,
      aiRank: 5,
      aiDiscountPct: 32.8,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      status: 'PUBLISHED',
      checkerApprovedAt: new Date(),
      primaryImageUrl: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80'
    }
  });

  console.log('Seeded 5 verified SARFAESI bank auction listings successfully!');
}

seed()
  .catch(err => {
    console.error('Error seeding notices:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
