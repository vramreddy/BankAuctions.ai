import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting BankAuctions.ai Database Seeding ---');

  // 1. Clean existing records safely
  try {
    await prisma.auditLog.deleteMany();
    await prisma.analyticsEvent.deleteMany();
    await prisma.savedProperty.deleteMany();
    await prisma.propertyUnlock.deleteMany();
    await prisma.inspectionReport.deleteMany();
    await prisma.inspectionAssignment.deleteMany();
    await prisma.verificationReview.deleteMany();
    await prisma.auctionAttribute.deleteMany();
    await prisma.auctionNotice.deleteMany();
    await prisma.auctionCategory.deleteMany();
    await prisma.bank.deleteMany();
    await prisma.user.deleteMany();
    await prisma.siteSetting.deleteMany();
  } catch (err) {
    console.log('Initial clean skipped or empty tables:', err.message);
  }

  // 2. Seed Default Site Settings
  await prisma.siteSetting.create({
    data: {
      makerAutoPublish: true,
      chatWidget: true,
      bannerNotice: 'Scheduled SARFAESI mega-auction listings updated for Chennai, Bengaluru and Hyderabad.'
    }
  });

  // 3. Seed Users across all 4 roles
  const salt = await bcrypt.genSalt(10);
  const adminPass = await bcrypt.hash('Admin@123456', salt);
  const checkerPass = await bcrypt.hash('Checker@123456', salt);
  const engineerPass = await bcrypt.hash('Engineer@123456', salt);
  const buyerPass = await bcrypt.hash('Buyer@123456', salt);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@bankauctions.ai',
      passwordHash: adminPass,
      fullName: 'Sajith Executive Admin',
      phone: '9840011223',
      role: 'ADMIN',
      planTier: 'PREMIUM',
      unlocksRemaining: 999,
      city: 'chennai'
    }
  });

  const checker = await prisma.user.create({
    data: {
      email: 'checker@bankauctions.ai',
      passwordHash: checkerPass,
      fullName: 'Latha M. Senior Verification Checker',
      phone: '9840022334',
      role: 'CHECKER',
      planTier: 'FREE',
      unlocksRemaining: 0,
      city: 'chennai'
    }
  });

  const engineer = await prisma.user.create({
    data: {
      email: 'engineer@bankauctions.ai',
      passwordHash: engineerPass,
      fullName: 'Karthik S. Chartered Field Engineer',
      phone: '9840033445',
      role: 'ENGINEER',
      planTier: 'FREE',
      unlocksRemaining: 0,
      city: 'chennai'
    }
  });

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@bankauctions.ai',
      passwordHash: buyerPass,
      fullName: 'Venkata Rami Reddy',
      phone: '9000000000',
      role: 'BUYER',
      planTier: 'PRO',
      unlocksRemaining: 5,
      city: 'chennai'
    }
  });

  console.log('Seeded Users: Admin, Checker, Engineer, Buyer');

  // 4. Seed Banks
  const banksData = [
    { code: 'SBI', name: 'State Bank of India', contactPhone: '1800 11 2211' },
    { code: 'CANARA', name: 'Canara Bank', contactPhone: '1800 425 0018' },
    { code: 'INDIAN', name: 'Indian Bank', contactPhone: '1800 425 0000' },
    { code: 'IOB', name: 'Indian Overseas Bank', contactPhone: '1800 425 4445' },
    { code: 'BOB', name: 'Bank of Baroda', contactPhone: '1800 258 4455' },
    { code: 'REPCO', name: 'Repco Home Finance', contactPhone: '044 2499 4423' },
    { code: 'UNION', name: 'Union Bank of India', contactPhone: '1800 22 2244' },
    { code: 'KARNATAKA', name: 'Karnataka Bank', contactPhone: '1800 425 1444' },
    { code: 'SHRIRAM', name: 'Shriram Finance', contactPhone: '1800 103 4959' },
    { code: 'SOUTH_IND', name: 'South Indian Bank', contactPhone: '1800 425 1809' },
    { code: 'INDUSIND', name: 'IndusInd Bank', contactPhone: '1860 267 7777' }
  ];

  const bankMap = {};
  for (const b of banksData) {
    const created = await prisma.bank.create({ data: b });
    bankMap[b.code] = created;
    bankMap[b.name] = created;
  }
  console.log(`Seeded ${banksData.length} Banks`);

  // 5. Seed Categories
  const categoriesData = [
    { code: 'flat', name: 'Flats & Apartments', slug: 'flats', icon: 'Building2', description: 'Multi-storey apartments and builder floors' },
    { code: 'house', name: 'Houses & Villas', slug: 'houses', icon: 'Home', description: 'Independent villas, houses and bungalows' },
    { code: 'land', name: 'Plots & Land', slug: 'plots', icon: 'MapPin', description: 'Residential plots, commercial and agricultural land' },
    { code: 'shop', name: 'Shops & Showrooms', slug: 'shops', icon: 'Store', description: 'Retail units, commercial shops and retail spaces' },
    { code: 'office', name: 'Offices', slug: 'offices', icon: 'Briefcase', description: 'IT park offices and commercial building floors' },
    { code: 'warehouse', name: 'Warehouses & Industrial', slug: 'warehouses', icon: 'Warehouse', description: 'Warehouses, industrial sheds and godowns' },
    { code: 'vehicle', name: 'Vehicles & Machinery', slug: 'vehicles', icon: 'Truck', description: 'Trucks, commercial vehicles and heavy machinery' }
  ];

  const catMap = {};
  for (const c of categoriesData) {
    const created = await prisma.auctionCategory.create({ data: c });
    catMap[c.code] = created;
  }
  console.log(`Seeded ${categoriesData.length} Asset Categories`);

  // 6. Seed Realistic Authentic Auctions
  const authenticAuctions = [
    {
      sourceRef: 'BNK-CHE-10241',
      title: '2BHK flat, 1,040 sq ft · Velachery',
      shortTitle: '2BHK flat',
      city: 'chennai',
      locality: 'Velachery',
      address: 'Flat No. 2B, Second Floor, Marvel Greens, 100 Feet Bypass Road, Velachery, Chennai',
      pincode: '600042',
      bankCode: 'CANARA',
      catCode: 'flat',
      reservePrice: 6100000,
      estimatedMarketValue: 7680000,
      emdAmount: 610000,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-11-28T11:00:00Z'),
      noticeDate: new Date('2026-10-24T00:00:00Z'),
      inspectionDate: '24 Nov 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'None disclosed',
      contactOfficerName: 'R. K. Sundaram, Chief Manager',
      contactOfficerPhone: '9444012345',
      aiScore: 77,
      aiRank: 2,
      aiDiscountPct: 21,
      isPremium: false,
      hasBankPhotos: true,
      featured: true,
      primaryImageUrl: '/images/chennai-flat-1.jpg',
      additionalImages: ['/images/chennai-flat-1.jpg', '/images/chennai-flat-2.jpg'],
      status: 'PUBLISHED',
      attributes: {
        bhk: '2BHK',
        floor_number: 2,
        total_floors: 4,
        built_up_area_sqft: 1040,
        super_built_up_sqft: 1196,
        car_parking: 'Covered',
        society_name: 'Marvel Greens'
      },
      makerExtraction: {
        reserve_price: { v: 6100000, confidence: 98, status: 'ok' },
        emd_amount: { v: 610000, confidence: 99, status: 'ok' },
        possession: { v: 'Physical possession', confidence: 95, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-CHE-10389',
      title: '3BHK corner flat, main-road facing, 1,480 sq ft · Sholinganallur',
      shortTitle: '3BHK corner flat, main-road facing',
      city: 'chennai',
      locality: 'Sholinganallur',
      address: 'Block C, Flat 402, Radiant Marina Bay, OMR Expressway, Sholinganallur, Chennai',
      pincode: '600119',
      bankCode: 'REPCO',
      catCode: 'flat',
      reservePrice: 8940000,
      estimatedMarketValue: 11680000,
      emdAmount: 894000,
      bidIncrement: 50000,
      auctionStartDate: new Date('2026-12-05T11:00:00Z'),
      noticeDate: new Date('2026-10-10T00:00:00Z'),
      inspectionDate: '30 Nov 2026, 10 am to 5 pm',
      possession: 'Physical possession',
      encumbrances: 'Property tax dues of ₹14,200',
      contactOfficerName: 'P. Murugan, Authorized Officer',
      contactOfficerPhone: '9841029384',
      aiScore: 84,
      aiRank: 1,
      aiDiscountPct: 23,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      primaryImageUrl: '/images/chennai-flat-2.jpg',
      additionalImages: ['/images/chennai-flat-2.jpg', '/images/chennai-flat-3.jpg'],
      status: 'PUBLISHED',
      attributes: {
        bhk: '3BHK',
        floor_number: 4,
        total_floors: 14,
        built_up_area_sqft: 1480,
        super_built_up_sqft: 1720,
        car_parking: '2 Covered Slots',
        society_name: 'Radiant Marina Bay'
      },
      makerExtraction: {
        reserve_price: { v: 8940000, confidence: 99, status: 'ok' },
        emd_amount: { v: 894000, confidence: 99, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-BEN-10250',
      title: 'Independent villa with private garden, 2,400 sq ft · Whitefield',
      shortTitle: 'Independent villa with garden',
      city: 'bengaluru',
      locality: 'Whitefield',
      address: 'Villa No. 18, Palm Meadows Extension, Varthur Main Road, Whitefield, Bengaluru',
      pincode: '560066',
      bankCode: 'SBI',
      catCode: 'house',
      reservePrice: 19800000,
      estimatedMarketValue: 27500000,
      emdAmount: 1980000,
      bidIncrement: 100000,
      auctionStartDate: new Date('2026-12-02T11:00:00Z'),
      noticeDate: new Date('2026-10-15T00:00:00Z'),
      inspectionDate: '26 Nov 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'None',
      contactOfficerName: 'K. N. Prasad, Assistant General Manager',
      contactOfficerPhone: '9845012399',
      aiScore: 88,
      aiRank: 1,
      aiDiscountPct: 28,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      primaryImageUrl: '/images/bengaluru-house-1.jpg',
      additionalImages: ['/images/bengaluru-house-1.jpg', '/images/bengaluru-house-2.jpg'],
      status: 'PUBLISHED',
      attributes: {
        bedrooms: 4,
        floors: 2,
        built_up_area_sqft: 2400,
        plot_area_sqft: 3200,
        condition: 'Excellent',
        possession: 'Physical possession'
      },
      makerExtraction: {
        reserve_price: { v: 19800000, confidence: 99, status: 'ok' },
        possession: { v: 'Physical possession', confidence: 97, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-HYD-10290',
      title: 'Commercial Showroom, Prime Junction, 1,850 sq ft · Gachibowli',
      shortTitle: 'Commercial Showroom, 1,850 sq ft',
      city: 'hyderabad',
      locality: 'Gachibowli',
      address: 'Ground Floor, Cyber Gateway Towers, Outer Ring Road, Gachibowli, Hyderabad',
      pincode: '500032',
      bankCode: 'INDIAN',
      catCode: 'shop',
      reservePrice: 14500000,
      estimatedMarketValue: 19800000,
      emdAmount: 1450000,
      bidIncrement: 50000,
      auctionStartDate: new Date('2026-12-10T11:00:00Z'),
      noticeDate: new Date('2026-10-20T00:00:00Z'),
      inspectionDate: '04 Dec 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'None known',
      contactOfficerName: 'S. Ramakrishna, Chief Manager',
      contactOfficerPhone: '9988776655',
      aiScore: 82,
      aiRank: 1,
      aiDiscountPct: 27,
      isPremium: true,
      hasBankPhotos: true,
      featured: true,
      primaryImageUrl: '/images/hyderabad-shop-1.jpg',
      additionalImages: ['/images/hyderabad-shop-1.jpg', '/images/hyderabad-shop-2.jpg'],
      status: 'PUBLISHED',
      attributes: {
        carpet_area_sqft: 1850,
        floor_level: 'Ground Floor',
        frontage_ft: 35,
        main_road_facing: true,
        commercial_score: 92
      },
      makerExtraction: {
        reserve_price: { v: 14500000, confidence: 96, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-COI-10310',
      title: 'Industrial Warehouse, 12,000 sq ft · Peelamedu',
      shortTitle: 'Industrial Warehouse, 12,000 sq ft',
      city: 'coimbatore',
      locality: 'Peelamedu',
      address: 'SF No. 402/1, Avinashi Road, Near Airport Junction, Peelamedu, Coimbatore',
      pincode: '641004',
      bankCode: 'IOB',
      catCode: 'warehouse',
      reservePrice: 16500000,
      estimatedMarketValue: 22000000,
      emdAmount: 1650000,
      bidIncrement: 50000,
      auctionStartDate: new Date('2026-12-08T11:00:00Z'),
      noticeDate: new Date('2026-10-22T00:00:00Z'),
      inspectionDate: '01 Dec 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'Electricity Board arrears ₹32,000',
      contactOfficerName: 'G. Selvam, Authorized Officer',
      contactOfficerPhone: '9443322110',
      aiScore: 81,
      aiRank: 1,
      aiDiscountPct: 25,
      isPremium: false,
      hasBankPhotos: true,
      featured: true,
      primaryImageUrl: '/images/coimbatore-warehouse-1.jpg',
      additionalImages: ['/images/coimbatore-warehouse-1.jpg'],
      status: 'PUBLISHED',
      attributes: {
        covered_area_sqft: 12000,
        land_area_acres: 0.65,
        power_load_kva: 150,
        highway_frontage: true,
        ceiling_height_ft: 28
      },
      makerExtraction: {
        reserve_price: { v: 16500000, confidence: 95, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-KER-10350',
      title: 'Commercial Office Floor, Infopark Vicinity, 3,200 sq ft · Kakkanad',
      shortTitle: 'Office Floor, Infopark Vicinity',
      city: 'kerala',
      locality: 'Kakkanad',
      address: '3rd Floor, Infoview Corporate Park, Seaport-Airport Road, Kakkanad, Kochi, Kerala',
      pincode: '682030',
      bankCode: 'SOUTH_IND',
      catCode: 'office',
      reservePrice: 18500000,
      estimatedMarketValue: 24500000,
      emdAmount: 1850000,
      bidIncrement: 50000,
      auctionStartDate: new Date('2026-12-12T11:00:00Z'),
      noticeDate: new Date('2026-10-25T00:00:00Z'),
      inspectionDate: '05 Dec 2026, 11 am to 4 pm',
      possession: 'Symbolic possession',
      encumbrances: 'None',
      contactOfficerName: 'Mathew Thomas, AGM',
      contactOfficerPhone: '9847012345',
      aiScore: 79,
      aiRank: 1,
      aiDiscountPct: 24,
      isPremium: true,
      hasBankPhotos: true,
      featured: false,
      primaryImageUrl: '/images/kerala-office-1.jpg',
      additionalImages: ['/images/kerala-office-1.jpg', '/images/kerala-office-2.jpg'],
      status: 'PUBLISHED',
      attributes: {
        super_built_up_sqft: 3200,
        furnishing_status: 'Fully Furnished Plug & Play',
        parking_slots: 6,
        it_corridor: true,
        lease_status: 'Vacant'
      },
      makerExtraction: {
        reserve_price: { v: 18500000, confidence: 94, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-BEN-10390',
      title: 'Residential Villa Plot, 2,400 sq ft · Electronic City',
      shortTitle: 'Villa Plot, 2,400 sq ft',
      city: 'bengaluru',
      locality: 'Electronic City',
      address: 'Plot No. 44, Concorde Silicon Valley Layout, Neeladri Road, Electronic City Phase 1, Bengaluru',
      pincode: '560100',
      bankCode: 'KARNATAKA',
      catCode: 'land',
      reservePrice: 9200000,
      estimatedMarketValue: 12500000,
      emdAmount: 920000,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-12-04T11:00:00Z'),
      noticeDate: new Date('2026-10-18T00:00:00Z'),
      inspectionDate: '28 Nov 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'None',
      contactOfficerName: 'V. Bhat, Senior Manager',
      contactOfficerPhone: '9845099887',
      aiScore: 86,
      aiRank: 1,
      aiDiscountPct: 26,
      isPremium: false,
      hasBankPhotos: true,
      featured: true,
      primaryImageUrl: '/images/bengaluru-land-1.jpg',
      additionalImages: ['/images/bengaluru-land-1.jpg'],
      status: 'PUBLISHED',
      attributes: {
        plot_number: 'Plot 44',
        survey_number: 'Sy No. 89/2',
        land_area_sqft: 2400,
        frontage_road_width_ft: 40,
        zoning: 'Residential (BMRDA Approved)',
        boundaries: 'East: 40ft Road, West: Plot 45, North: Plot 43, South: Park'
      },
      makerExtraction: {
        reserve_price: { v: 9200000, confidence: 98, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-KER-10440',
      title: 'Ashok Leyland 1618 Tipper Truck (2020 Model) · Chalakudy Yard',
      shortTitle: 'Tipper Truck, 2020',
      city: 'kerala',
      locality: 'Chalakudy',
      address: 'Shriram Vehicle Yard, NH 544, Near Toll Plaza, Chalakudy, Kerala',
      pincode: '680307',
      bankCode: 'SHRIRAM',
      catCode: 'vehicle',
      reservePrice: 1150000,
      estimatedMarketValue: 1600000,
      emdAmount: 115000,
      bidIncrement: 10000,
      auctionStartDate: new Date('2026-11-30T11:00:00Z'),
      noticeDate: new Date('2026-10-28T00:00:00Z'),
      inspectionDate: '26 Nov 2026, 10 am to 5 pm',
      possession: 'Physical possession',
      encumbrances: 'Road tax paid up to Dec 2026',
      contactOfficerName: 'Unnikrishnan P., Yard In-Charge',
      contactOfficerPhone: '9847112233',
      aiScore: 83,
      aiRank: 1,
      aiDiscountPct: 28,
      isPremium: false,
      hasBankPhotos: true,
      featured: false,
      primaryImageUrl: '/images/kerala-vehicle-1.jpg',
      additionalImages: ['/images/kerala-vehicle-1.jpg', '/images/kerala-vehicle-2.jpg'],
      status: 'PUBLISHED',
      attributes: {
        make: 'Ashok Leyland',
        model: '1618 Tipper Truck',
        manufacturing_year: 2020,
        registration_number: 'KL-45-S-8812',
        yard_location: 'Chalakudy Shriram Yard',
        running_condition: 'Running Engine, Tyres 70%'
      },
      makerExtraction: {
        reserve_price: { v: 1150000, confidence: 98, status: 'ok' }
      }
    }
  ];

  // 7. Seed Pending Exception Notices (Directly from Sajith's exc.js test suite)
  const exceptionAuctions = [
    {
      sourceRef: 'BNK-CHE-47019',
      title: '1BHK flat, ground floor, 1,180 sq ft · Ambattur',
      shortTitle: '1BHK flat, ground floor',
      city: 'chennai',
      locality: 'Ambattur',
      address: 'RS no. 221/3B, Flat G1, Ground Floor, Sai Krupa Apartments, MTH Road, Ambattur, Chennai',
      pincode: '600024',
      bankCode: 'SBI',
      catCode: 'flat',
      reservePrice: 8750000,
      estimatedMarketValue: 11000000,
      emdAmount: 875000,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-12-04T11:00:00Z'),
      noticeDate: new Date('2026-10-29T00:00:00Z'),
      inspectionDate: '28 Nov 2026, 11 am to 4 pm',
      possession: 'Symbolic possession',
      encumbrances: 'Property tax dues of ₹18,400',
      contactOfficerName: 'K. Manoj Reddy, Authorised Officer',
      contactOfficerPhone: '9678417751',
      aiScore: 75,
      aiRank: 3,
      aiDiscountPct: 20,
      isPremium: false,
      hasBankPhotos: true,
      featured: false,
      primaryImageUrl: '/images/chennai-flat-1.jpg',
      additionalImages: ['/images/chennai-flat-1.jpg', '/images/chennai-flat-2.jpg'],
      status: 'PENDING_CHECKER',
      attributes: {
        bhk: '1BHK',
        floor_number: 0,
        total_floors: 3,
        built_up_area_sqft: 1180,
        survey_number: 'RS no. 221/3B',
        flag_reason: 'Reserve price and EMD obscured by a bank stamp on scanned notice'
      },
      makerExtraction: {
        reserve_price: { v: '', confidence: 0, status: 'missing', flag: 'stamp' },
        emd_amount: { v: '1312000', confidence: 57, status: 'low', flag: 'stamp' },
        auction_date: { v: '2026-12-04', confidence: 90, status: 'ok' },
        possession: { v: 'Symbolic possession', confidence: 88, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-HYD-47043',
      title: 'Shop on main road, 300 sq ft · Shamshabad',
      shortTitle: 'Shop on main road',
      city: 'hyderabad',
      locality: 'Shamshabad',
      address: 'Plot no. 38, Sector 4, Airport Road, Shamshabad, Hyderabad',
      pincode: '500067',
      bankCode: 'REPCO',
      catCode: 'shop',
      reservePrice: 10850000,
      estimatedMarketValue: 13500000,
      emdAmount: 1085000,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-12-04T11:00:00Z'),
      noticeDate: new Date('2026-10-29T00:00:00Z'),
      inspectionDate: '28 Nov 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'Property tax dues of ₹18,400',
      contactOfficerName: 'V. Ramesh Babu, Authorised Officer',
      contactOfficerPhone: '6691919222',
      aiScore: 78,
      aiRank: 2,
      aiDiscountPct: 20,
      isPremium: false,
      hasBankPhotos: true,
      featured: false,
      primaryImageUrl: '/images/hyderabad-shop-1.jpg',
      additionalImages: ['/images/hyderabad-shop-1.jpg'],
      status: 'PENDING_CHECKER',
      attributes: {
        carpet_area_sqft: 300,
        survey_number: 'Plot no. 38, Sector 4',
        flag_reason: 'Handwritten amendment to auction date and time by bank officer'
      },
      makerExtraction: {
        auction_date: { v: '2026-11-28', confidence: 44, status: 'low', flag: 'handwritten' },
        auction_time: { v: '', confidence: 0, status: 'missing', flag: 'handwritten' },
        reserve_price: { v: '10850000', confidence: 89, status: 'ok' }
      }
    },
    {
      sourceRef: 'BNK-COI-48239',
      title: '1BHK flat, ground floor, 1,180 sq ft · Mettupalayam Road',
      shortTitle: '1BHK flat, ground floor',
      city: 'coimbatore',
      locality: 'Mettupalayam Road',
      address: 'Survey no. 114/2A, Green Meadows, Mettupalayam Road, Coimbatore',
      pincode: '641092',
      bankCode: 'BOB',
      catCode: 'flat',
      reservePrice: 8450000,
      estimatedMarketValue: 10800000,
      emdAmount: 845000,
      bidIncrement: 25000,
      auctionStartDate: new Date('2026-11-20T11:00:00Z'),
      noticeDate: new Date('2026-10-23T00:00:00Z'),
      inspectionDate: '14 Nov 2026, 11 am to 4 pm',
      possession: 'Symbolic possession',
      encumbrances: 'None known',
      contactOfficerName: 'S. Fathima Begum, Authorised Officer',
      contactOfficerPhone: '8411807825',
      aiScore: 73,
      aiRank: 4,
      aiDiscountPct: 22,
      isPremium: false,
      hasBankPhotos: true,
      featured: false,
      primaryImageUrl: '/images/coimbatore-flat-1.jpg',
      additionalImages: ['/images/coimbatore-flat-1.jpg'],
      status: 'PENDING_CHECKER',
      attributes: {
        bhk: '1BHK',
        built_up_area_sqft: 1180,
        survey_number: 'Survey no. 114/2A',
        flag_reason: 'Handwritten correction to auction date'
      },
      makerExtraction: {
        auction_date: { v: '2026-11-14', confidence: 49, status: 'low' },
        auction_time: { v: '', confidence: 0, status: 'missing' }
      }
    }
  ];

  // 8. Seed Engineer Assigned Auction
  const engineerAuction = {
    sourceRef: 'BNK-CHE-10999',
    title: '3BHK luxury apartment, 1,650 sq ft · Anna Nagar West',
    shortTitle: '3BHK luxury flat',
    city: 'chennai',
    locality: 'Anna Nagar',
    address: 'Plot 104, 6th Avenue, Anna Nagar West, Chennai',
    pincode: '600040',
    bankCode: 'SBI',
    catCode: 'flat',
    reservePrice: 15500000,
    estimatedMarketValue: 21000000,
    emdAmount: 1550000,
    bidIncrement: 50000,
    auctionStartDate: new Date('2026-12-15T11:00:00Z'),
    noticeDate: new Date('2026-10-30T00:00:00Z'),
    inspectionDate: '01 Dec 2026, 11 am to 4 pm',
    possession: 'Physical possession',
    encumbrances: 'None known',
    contactOfficerName: 'V. Sundaram, AGM',
    contactOfficerPhone: '9444099881',
    aiScore: 85,
    aiRank: 1,
    aiDiscountPct: 26,
    isPremium: true,
    hasBankPhotos: true,
    featured: false,
    primaryImageUrl: '/images/chennai-flat-3.jpg',
    additionalImages: ['/images/chennai-flat-3.jpg', '/images/chennai-flat-4.jpg'],
    status: 'ENGINEER_ASSIGNED',
    attributes: {
      bhk: '3BHK',
      built_up_area_sqft: 1650,
      society_name: 'Imperial Heights'
    },
    makerExtraction: {
      reserve_price: { v: 15500000, confidence: 99, status: 'ok' }
    }
  };

  // Insert all auctions and their attributes
  const allLotSeeds = [...authenticAuctions, ...exceptionAuctions, engineerAuction];

  for (const item of allLotSeeds) {
    const { attributes, makerExtraction, bankCode, catCode, ...noticeFields } = item;
    const bank = bankMap[bankCode];
    const category = catMap[catCode];

    const notice = await prisma.auctionNotice.create({
      data: {
        ...noticeFields,
        bankId: bank.id,
        categoryId: category.id
      }
    });

    await prisma.auctionAttribute.create({
      data: {
        auctionId: notice.id,
        attributes: attributes || {},
        makerExtraction: makerExtraction || {}
      }
    });

    // If it's the engineer lot, create assignment
    if (item.sourceRef === 'BNK-CHE-10999') {
      await prisma.inspectionAssignment.create({
        data: {
          auctionId: notice.id,
          engineerId: engineer.id,
          assignedById: admin.id,
          scheduledDate: new Date('2026-11-29T10:00:00Z'),
          scheduledSlot: 'Morning (10:00 AM - 1:00 PM)',
          status: 'SCHEDULED'
        }
      });
    }

    // Attach sample verified field inspection on first Velachery property
    if (item.sourceRef === 'BNK-CHE-10241') {
      const assignment = await prisma.inspectionAssignment.create({
        data: {
          auctionId: notice.id,
          engineerId: engineer.id,
          assignedById: admin.id,
          scheduledDate: new Date('2026-11-20T10:00:00Z'),
          status: 'APPROVED'
        }
      });

      await prisma.inspectionReport.create({
        data: {
          assignmentId: assignment.id,
          occupancyStatus: 'Vacant, under bank seal lock',
          accessRoadType: '40ft wide blacktopped municipal road',
          boundaryMatches: true,
          propertyCondition: 'Good, building structure intact, minor paint weathering',
          utilitiesObserved: ['Three-phase EB connection', 'Metro Water sump & pump', 'Drainage connected'],
          litigationObserved: 'None seen on notice board or site entrance',
          engineerValuationEstimate: 7850000,
          engineerNotes: 'Building is well constructed (approx 6 years old). Lift functioning. Clear parking marked for unit 2B.',
          gpsCoordinates: '12.97850, 80.22120',
          landmarkName: 'Phoenix MarketCity Velachery',
          landmarkDistanceKm: 1.4,
          photos: ['/images/chennai-flat-1.jpg', '/images/chennai-flat-2.jpg', '/images/chennai-flat-3.jpg']
        }
      });

      // Save lot for test buyer
      await prisma.savedProperty.create({
        data: {
          userId: buyer.id,
          auctionId: notice.id
        }
      });

      // Unlock for test buyer
      await prisma.propertyUnlock.create({
        data: {
          userId: buyer.id,
          auctionId: notice.id
        }
      });
    }
  }

  console.log(`Successfully seeded ${allLotSeeds.length} auctions across all workflow statuses.`);

  // 9. Initial Audit Log
  await prisma.auditLog.create({
    data: {
      actorName: 'System Seeder',
      actorRole: 'ADMIN',
      action: 'INITIAL_DATABASE_SEED',
      entityType: 'SYSTEM',
      entityId: 'SYSTEM_BOOTSTRAP',
      beforeState: {},
      afterState: { auctionsCount: allLotSeeds.length, usersCount: 4 },
      ipAddress: '127.0.0.1'
    }
  });

  console.log('--- Database Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
