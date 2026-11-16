import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import { createDemoAssets } from './demoAssets.js';

// In-Memory Enterprise Mock Store for instant local execution & zero-dependency resilience
const store = {
  users: [],
  banks: [],
  categories: [],
  auctions: [],
  attributes: [],
  verificationReviews: [],
  inspectionAssignments: [],
  inspectionReports: [],
  savedProperties: [],
  propertyUnlocks: [],
  analyticsEvents: [],
  auditLogs: [],
  siteSettings: {
    id: 'default-setting',
    makerAutoPublish: true,
    chatWidget: true,
    bannerNotice: 'Scheduled SARFAESI mega-auction listings updated for Chennai, Bengaluru and Hyderabad.'
  }
};

// Seed in-memory store synchronously so the app is always functional
function initStore() {
  const salt = bcrypt.genSaltSync(10);
  const hash = (p) => bcrypt.hashSync(p, salt);

  store.users = [
    {
      id: 'usr-admin-1',
      email: 'admin@bankauctions.ai',
      passwordHash: hash('Admin@123'),
      fullName: 'Sajith Executive Admin',
      phone: '9840011223',
      role: 'ADMIN',
      planTier: 'PREMIUM',
      unlocksRemaining: 999,
      city: 'chennai',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'usr-checker-1',
      email: 'checker@bankauctions.ai',
      passwordHash: hash('Checker@123'),
      fullName: 'Latha M. Senior Verification Checker',
      phone: '9840022334',
      role: 'CHECKER',
      planTier: 'FREE',
      unlocksRemaining: 0,
      city: 'chennai',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'usr-engineer-1',
      email: 'engineer@bankauctions.ai',
      passwordHash: hash('Engineer@123'),
      fullName: 'Karthik S. Chartered Field Engineer',
      phone: '9840033445',
      role: 'ENGINEER',
      planTier: 'FREE',
      unlocksRemaining: 0,
      city: 'chennai',
      isActive: true,
      createdAt: new Date()
    },
    {
      id: 'usr-buyer-1',
      email: 'buyer@bankauctions.ai',
      passwordHash: hash('Buyer@123'),
      fullName: 'Venkata Rami Reddy',
      phone: '9000000000',
      role: 'BUYER',
      planTier: 'PRO',
      unlocksRemaining: 5,
      city: 'chennai',
      isActive: true,
      createdAt: new Date()
    }
  ];

  store.banks = [
    { id: 'bnk-sbi', code: 'SBI', name: 'State Bank of India', contactPhone: '1800 11 2211' },
    { id: 'bnk-canara', code: 'CANARA', name: 'Canara Bank', contactPhone: '1800 425 0018' },
    { id: 'bnk-indian', code: 'INDIAN', name: 'Indian Bank', contactPhone: '1800 425 0000' },
    { id: 'bnk-iob', code: 'IOB', name: 'Indian Overseas Bank', contactPhone: '1800 425 4445' },
    { id: 'bnk-bob', code: 'BOB', name: 'Bank of Baroda', contactPhone: '1800 258 4455' },
    { id: 'bnk-repco', code: 'REPCO', name: 'Repco Home Finance', contactPhone: '044 2499 4423' },
    { id: 'bnk-karnataka', code: 'KARNATAKA', name: 'Karnataka Bank', contactPhone: '1800 425 1444' },
    { id: 'bnk-shriram', code: 'SHRIRAM', name: 'Shriram Finance', contactPhone: '1800 103 4959' },
    { id: 'bnk-southind', code: 'SOUTH_IND', name: 'South Indian Bank', contactPhone: '1800 425 1809' },
    { id: 'bnk-indusind', code: 'INDUSIND', name: 'IndusInd Bank', contactPhone: '1860 267 7777' }
  ];

  store.categories = [
    { id: 'cat-flat', code: 'flat', name: 'Flats & Apartments', slug: 'flats', icon: 'Building2', description: 'Apartments and builder floors sold under SARFAESI' },
    { id: 'cat-house', code: 'house', name: 'Houses & Villas', slug: 'houses', icon: 'Home', description: 'Independent villas, houses and bungalows' },
    { id: 'cat-land', code: 'land', name: 'Plots & Land', slug: 'plots', icon: 'MapPin', description: 'Residential plots, commercial and agricultural land' },
    { id: 'cat-shop', code: 'shop', name: 'Shops & Showrooms', slug: 'shops', icon: 'Store', description: 'Retail units, commercial shops and retail spaces' },
    { id: 'cat-office', code: 'office', name: 'Offices', slug: 'offices', icon: 'Briefcase', description: 'IT park offices and commercial floors' },
    { id: 'cat-warehouse', code: 'warehouse', name: 'Warehouses & Industrial', slug: 'warehouses', icon: 'Warehouse', description: 'Warehouses, industrial sheds and godowns' },
    { id: 'cat-vehicle', code: 'vehicle', name: 'Vehicles & Machinery', slug: 'vehicles', icon: 'Truck', description: 'Trucks, commercial vehicles and heavy machinery' }
  ];

  const now = new Date();
  const dFuture = (days) => new Date(now.getTime() + days * 86400000);
  const dPast = (days) => new Date(now.getTime() - days * 86400000);

  const rawLots = [
    {
      id: 'auc-che-10241',
      sourceRef: 'BNK-CHE-10241',
      title: '2BHK flat, 1,040 sq ft · Velachery',
      shortTitle: '2BHK flat',
      city: 'chennai',
      locality: 'Velachery',
      address: 'Flat No. 2B, Second Floor, Marvel Greens, 100 Feet Bypass Road, Velachery, Chennai',
      pincode: '600042',
      bankId: 'bnk-canara',
      categoryId: 'cat-flat',
      reservePrice: 6100000,
      estimatedMarketValue: 7680000,
      emdAmount: 610000,
      bidIncrement: 25000,
      auctionStartDate: dFuture(5),
      noticeDate: dPast(20),
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
      createdAt: dPast(15),
      attributes: { bhk: '2BHK', floor_number: 2, total_floors: 4, built_up_area_sqft: 1040, society_name: 'Marvel Greens' }
    },
    {
      id: 'auc-che-10389',
      sourceRef: 'BNK-CHE-10389',
      title: '3BHK corner flat, main-road facing, 1,480 sq ft · Sholinganallur',
      shortTitle: '3BHK corner flat',
      city: 'chennai',
      locality: 'Sholinganallur',
      address: 'Block C, Flat 402, Radiant Marina Bay, OMR Expressway, Sholinganallur, Chennai',
      pincode: '600119',
      bankId: 'bnk-repco',
      categoryId: 'cat-flat',
      reservePrice: 8940000,
      estimatedMarketValue: 11680000,
      emdAmount: 894000,
      bidIncrement: 50000,
      auctionStartDate: dFuture(9),
      noticeDate: dPast(15),
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
      createdAt: dPast(10),
      attributes: { bhk: '3BHK', floor_number: 4, total_floors: 14, built_up_area_sqft: 1480, society_name: 'Radiant Marina Bay' }
    },
    {
      id: 'auc-ben-10250',
      sourceRef: 'BNK-BEN-10250',
      title: 'Independent villa with private garden, 2,400 sq ft · Whitefield',
      shortTitle: 'Independent villa with garden',
      city: 'bengaluru',
      locality: 'Whitefield',
      address: 'Villa No. 18, Palm Meadows Extension, Varthur Main Road, Whitefield, Bengaluru',
      pincode: '560066',
      bankId: 'bnk-sbi',
      categoryId: 'cat-house',
      reservePrice: 19800000,
      estimatedMarketValue: 27500000,
      emdAmount: 1980000,
      bidIncrement: 100000,
      auctionStartDate: dFuture(12),
      noticeDate: dPast(18),
      inspectionDate: '26 Nov 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'None',
      contactOfficerName: 'K. N. Prasad, AGM',
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
      createdAt: dPast(12),
      attributes: { bedrooms: 4, floors: 2, built_up_area_sqft: 2400, plot_area_sqft: 3200, condition: 'Excellent' }
    },
    {
      id: 'auc-hyd-10290',
      sourceRef: 'BNK-HYD-10290',
      title: 'Commercial Showroom, Prime Junction, 1,850 sq ft · Gachibowli',
      shortTitle: 'Commercial Showroom',
      city: 'hyderabad',
      locality: 'Gachibowli',
      address: 'Ground Floor, Cyber Gateway Towers, Outer Ring Road, Gachibowli, Hyderabad',
      pincode: '500032',
      bankId: 'bnk-indian',
      categoryId: 'cat-shop',
      reservePrice: 14500000,
      estimatedMarketValue: 19800000,
      emdAmount: 1450000,
      bidIncrement: 50000,
      auctionStartDate: dFuture(14),
      noticeDate: dPast(14),
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
      additionalImages: ['/images/hyderabad-shop-1.jpg'],
      status: 'PUBLISHED',
      createdAt: dPast(8),
      attributes: { carpet_area_sqft: 1850, floor_level: 'Ground Floor', frontage_ft: 35, commercial_score: 92 }
    },
    {
      id: 'auc-coi-10310',
      sourceRef: 'BNK-COI-10310',
      title: 'Industrial Warehouse, 12,000 sq ft · Peelamedu',
      shortTitle: 'Industrial Warehouse',
      city: 'coimbatore',
      locality: 'Peelamedu',
      address: 'SF No. 402/1, Avinashi Road, Near Airport Junction, Peelamedu, Coimbatore',
      pincode: '641004',
      bankId: 'bnk-iob',
      categoryId: 'cat-warehouse',
      reservePrice: 16500000,
      estimatedMarketValue: 22000000,
      emdAmount: 1650000,
      bidIncrement: 50000,
      auctionStartDate: dFuture(18),
      noticeDate: dPast(10),
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
      createdAt: dPast(7),
      attributes: { covered_area_sqft: 12000, land_area_acres: 0.65, power_load_kva: 150, highway_frontage: true }
    },
    {
      id: 'auc-ker-10350',
      sourceRef: 'BNK-KER-10350',
      title: 'Commercial Office Floor, Infopark Vicinity, 3,200 sq ft · Kakkanad',
      shortTitle: 'Office Floor, Infopark Vicinity',
      city: 'kerala',
      locality: 'Kakkanad',
      address: '3rd Floor, Infoview Corporate Park, Seaport-Airport Road, Kakkanad, Kochi, Kerala',
      pincode: '682030',
      bankId: 'bnk-southind',
      categoryId: 'cat-office',
      reservePrice: 18500000,
      estimatedMarketValue: 24500000,
      emdAmount: 1850000,
      bidIncrement: 50000,
      auctionStartDate: dFuture(22),
      noticeDate: dPast(12),
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
      additionalImages: ['/images/kerala-office-1.jpg'],
      status: 'PUBLISHED',
      createdAt: dPast(6),
      attributes: { super_built_up_sqft: 3200, furnishing_status: 'Fully Furnished', parking_slots: 6, it_corridor: true }
    },
    {
      id: 'auc-ben-10390',
      sourceRef: 'BNK-BEN-10390',
      title: 'Residential Villa Plot, 2,400 sq ft · Electronic City',
      shortTitle: 'Villa Plot, 2,400 sq ft',
      city: 'bengaluru',
      locality: 'Electronic City',
      address: 'Plot No. 44, Concorde Silicon Valley Layout, Neeladri Road, Electronic City Phase 1, Bengaluru',
      pincode: '560100',
      bankId: 'bnk-karnataka',
      categoryId: 'cat-land',
      reservePrice: 9200000,
      estimatedMarketValue: 12500000,
      emdAmount: 920000,
      bidIncrement: 25000,
      auctionStartDate: dFuture(16),
      noticeDate: dPast(15),
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
      createdAt: dPast(5),
      attributes: { plot_number: 'Plot 44', survey_number: 'Sy No. 89/2', land_area_sqft: 2400, zoning: 'Residential' }
    },
    {
      id: 'auc-ker-10440',
      sourceRef: 'BNK-KER-10440',
      title: 'Ashok Leyland 1618 Tipper Truck (2020 Model) · Chalakudy Yard',
      shortTitle: 'Tipper Truck, 2020',
      city: 'kerala',
      locality: 'Chalakudy',
      address: 'Shriram Vehicle Yard, NH 544, Near Toll Plaza, Chalakudy, Kerala',
      pincode: '680307',
      bankId: 'bnk-shriram',
      categoryId: 'cat-vehicle',
      reservePrice: 1150000,
      estimatedMarketValue: 1600000,
      emdAmount: 115000,
      bidIncrement: 10000,
      auctionStartDate: dFuture(11),
      noticeDate: dPast(8),
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
      additionalImages: ['/images/kerala-vehicle-1.jpg'],
      status: 'PUBLISHED',
      createdAt: dPast(4),
      attributes: { make: 'Ashok Leyland', model: '1618 Tipper Truck', manufacturing_year: 2020, registration_number: 'KL-45-S-8812' }
    },
    {
      id: 'auc-exc-2041',
      sourceRef: 'BNK-CHE-47019',
      title: '1BHK flat, ground floor, 1,180 sq ft · Ambattur',
      shortTitle: '1BHK flat, ground floor',
      city: 'chennai',
      locality: 'Ambattur',
      address: 'RS no. 221/3B, Flat G1, Ground Floor, Sai Krupa Apartments, MTH Road, Ambattur, Chennai',
      pincode: '600024',
      bankId: 'bnk-sbi',
      categoryId: 'cat-flat',
      reservePrice: 8750000,
      estimatedMarketValue: 11000000,
      emdAmount: 875000,
      bidIncrement: 25000,
      auctionStartDate: dFuture(14),
      noticeDate: dPast(16),
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
      claimedByCheckerId: null,
      claimedAt: null,
      createdAt: dPast(2),
      attributes: {
        bhk: '1BHK',
        floor_number: 0,
        built_up_area_sqft: 1180,
        survey_number: 'RS no. 221/3B',
        flag_reason: 'Reserve price and EMD obscured by a bank stamp on notice scan'
      },
      makerExtraction: {
        reserve_price: { v: '', confidence: 0, status: 'missing', flag: 'stamp' },
        emd_amount: { v: '1312000', confidence: 57, status: 'low', flag: 'stamp' },
        auction_date: { v: '2026-12-04', confidence: 90, status: 'ok' },
        possession: { v: 'Symbolic possession', confidence: 88, status: 'ok' }
      }
    },
    {
      id: 'auc-exc-2042',
      sourceRef: 'BNK-HYD-47043',
      title: 'Shop on main road, 300 sq ft · Shamshabad',
      shortTitle: 'Shop on main road',
      city: 'hyderabad',
      locality: 'Shamshabad',
      address: 'Plot no. 38, Sector 4, Airport Road, Shamshabad, Hyderabad',
      pincode: '500067',
      bankId: 'bnk-repco',
      categoryId: 'cat-shop',
      reservePrice: 10850000,
      estimatedMarketValue: 13500000,
      emdAmount: 1085000,
      bidIncrement: 25000,
      auctionStartDate: dFuture(18),
      noticeDate: dPast(16),
      inspectionDate: '28 Nov 2026, 11 am to 4 pm',
      possession: 'Physical possession',
      encumbrances: 'None',
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
      claimedByCheckerId: null,
      claimedAt: null,
      createdAt: dPast(3),
      attributes: {
        carpet_area_sqft: 300,
        survey_number: 'Plot no. 38, Sector 4',
        flag_reason: 'Handwritten amendment to auction date and time'
      },
      makerExtraction: {
        auction_date: { v: '2026-11-28', confidence: 44, status: 'low', flag: 'handwritten' },
        auction_time: { v: '', confidence: 0, status: 'missing', flag: 'handwritten' },
        reserve_price: { v: '10850000', confidence: 89, status: 'ok' }
      }
    },
    {
      id: 'auc-eng-10999',
      sourceRef: 'BNK-CHE-10999',
      title: '3BHK luxury apartment, 1,650 sq ft · Anna Nagar West',
      shortTitle: '3BHK luxury flat',
      city: 'chennai',
      locality: 'Anna Nagar',
      address: 'Plot 104, 6th Avenue, Anna Nagar West, Chennai',
      pincode: '600040',
      bankId: 'bnk-sbi',
      categoryId: 'cat-flat',
      reservePrice: 15500000,
      estimatedMarketValue: 21000000,
      emdAmount: 1550000,
      bidIncrement: 50000,
      auctionStartDate: dFuture(25),
      noticeDate: dPast(10),
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
      createdAt: dPast(3),
      attributes: { bhk: '3BHK', built_up_area_sqft: 1650, society_name: 'Imperial Heights' }
    }
  ];

  rawLots.push(...createDemoAssets(now));
  store.auctions = rawLots;

  store.attributes = rawLots.map((r) => ({
    id: `attr-${r.id}`,
    auctionId: r.id,
    attributes: r.attributes || {},
    makerExtraction: r.makerExtraction || {}
  }));

  store.inspectionAssignments = [
    {
      id: 'asg-1',
      auctionId: 'auc-eng-10999',
      engineerId: 'usr-engineer-1',
      assignedById: 'usr-admin-1',
      scheduledDate: dFuture(3),
      scheduledSlot: 'Morning (10:00 AM - 1:00 PM)',
      status: 'ASSIGNED',
      createdAt: dPast(1)
    },
    {
      id: 'asg-velachery',
      auctionId: 'auc-che-10241',
      engineerId: 'usr-engineer-1',
      assignedById: 'usr-admin-1',
      scheduledDate: dPast(4),
      scheduledSlot: 'Morning',
      status: 'APPROVED',
      createdAt: dPast(6)
    }
  ];

  store.inspectionReports = [
    {
      id: 'rep-velachery',
      assignmentId: 'asg-velachery',
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
      photos: ['/images/chennai-flat-1.jpg', '/images/chennai-flat-2.jpg', '/images/chennai-flat-3.jpg'],
      submittedAt: dPast(3)
    }
  ];

  store.savedProperties = [
    { id: 'sp-1', userId: 'usr-buyer-1', auctionId: 'auc-che-10241', savedAt: dPast(2) },
    { id: 'sp-2', userId: 'usr-buyer-1', auctionId: 'auc-ben-10250', savedAt: dPast(1) }
  ];

  store.propertyUnlocks = [
    { id: 'pu-1', userId: 'usr-buyer-1', auctionId: 'auc-che-10241', unlockedAt: dPast(2) }
  ];

  store.auditLogs = [
    {
      id: 'aud-1',
      actorId: 'usr-admin-1',
      actorName: 'Sajith Executive Admin',
      actorRole: 'ADMIN',
      action: 'SYSTEM_BOOTSTRAP',
      entityType: 'PLATFORM',
      entityId: 'ROOT',
      ipAddress: '127.0.0.1',
      createdAt: dPast(5)
    }
  ];
}

initStore();

function createStoreAdapter() {
  return {
    rawStore: store,
    user: {
      findUnique: async ({ where }) => {
        if (where.id) return store.users.find((u) => u.id === where.id) || null;
        if (where.email) return store.users.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
        if (where.phone) return store.users.find((u) => u.phone === where.phone) || null;
        return null;
      },
      findMany: async ({ where = {} } = {}) => {
        let list = [...store.users];
        if (where.role) list = list.filter((u) => u.role === where.role);
        return list;
      },
      create: async ({ data }) => {
        const u = { id: `usr-${Date.now()}`, ...data, createdAt: new Date() };
        store.users.push(u);
        return u;
      },
      update: async ({ where, data }) => {
        const idx = store.users.findIndex((u) => u.id === where.id);
        if (idx === -1) throw new Error('User not found');
        store.users[idx] = { ...store.users[idx], ...data };
        return store.users[idx];
      },
      count: async ({ where = {} } = {}) => {
        let list = [...store.users];
        if (where.role) list = list.filter((u) => u.role === where.role);
        return list.length;
      }
    },
    auctionNotice: {
      findMany: async (args = {}) => {
        const { where = {}, include = {}, orderBy = {}, skip = 0, take = 50 } = args;
        let list = [...store.auctions];

        if (where.status) {
          if (typeof where.status === 'string') {
            list = list.filter((a) => a.status === where.status);
          } else if (where.status.in) {
            list = list.filter((a) => where.status.in.includes(a.status));
          }
        }
        if (where.city) list = list.filter((a) => a.city.toLowerCase() === where.city.toLowerCase());
        if (where.categoryId) list = list.filter((a) => a.categoryId === where.categoryId);
        if (where.bankId) list = list.filter((a) => a.bankId === where.bankId);
        if (where.isPremium !== undefined) list = list.filter((a) => a.isPremium === where.isPremium);
        if (where.featured !== undefined) list = list.filter((a) => a.featured === where.featured);
        if (where.reservePrice?.lte) list = list.filter((a) => a.reservePrice <= where.reservePrice.lte);
        if (where.reservePrice?.gte) list = list.filter((a) => a.reservePrice >= where.reservePrice.gte);

        if (orderBy.reservePrice) {
          list.sort((a, b) => (orderBy.reservePrice === 'asc' ? a.reservePrice - b.reservePrice : b.reservePrice - a.reservePrice));
        } else if (orderBy.aiScore) {
          list.sort((a, b) => b.aiScore - a.aiScore);
        } else if (orderBy.auctionStartDate) {
          list.sort((a, b) => new Date(a.auctionStartDate) - new Date(b.auctionStartDate));
        }

        const paginated = list.slice(skip, skip + take);

        return paginated.map((item) => {
          const res = { ...item };
          if (include.bank) res.bank = store.banks.find((b) => b.id === item.bankId);
          if (include.category) res.category = store.categories.find((c) => c.id === item.categoryId);
          if (include.attributes) res.attributes = store.attributes.find((at) => at.auctionId === item.id);
          if (include.inspectionAssignments) {
            res.inspectionAssignments = store.inspectionAssignments.filter((ia) => ia.auctionId === item.id).map((ia) => {
              const rep = store.inspectionReports.find((r) => r.assignmentId === ia.id);
              return { ...ia, report: rep };
            });
          }
          return res;
        });
      },
      findUnique: async ({ where, include = {} }) => {
        const item = store.auctions.find((a) => a.id === where.id || a.sourceRef === where.sourceRef);
        if (!item) return null;
        const res = { ...item };
        if (include.bank) res.bank = store.banks.find((b) => b.id === item.bankId);
        if (include.category) res.category = store.categories.find((c) => c.id === item.categoryId);
        if (include.attributes) res.attributes = store.attributes.find((at) => at.auctionId === item.id);
        if (include.verificationReviews) res.verificationReviews = store.verificationReviews.filter((vr) => vr.auctionId === item.id);
        if (include.inspectionAssignments) {
          res.inspectionAssignments = store.inspectionAssignments.filter((ia) => ia.auctionId === item.id).map((ia) => {
            const rep = store.inspectionReports.find((r) => r.assignmentId === ia.id);
            const eng = store.users.find((u) => u.id === ia.engineerId);
            return { ...ia, report: rep, engineer: eng };
          });
        }
        return res;
      },
      count: async ({ where = {} } = {}) => {
        let list = [...store.auctions];
        if (where.status) {
          if (typeof where.status === 'string') list = list.filter((a) => a.status === where.status);
          else if (where.status.in) list = list.filter((a) => where.status.in.includes(a.status));
        }
        if (where.city) list = list.filter((a) => a.city === where.city);
        return list.length;
      },
      create: async ({ data }) => {
        const { attributes, ...fields } = data;
        const id = `auc-${Date.now()}`;
        const newLot = { id, ...fields, createdAt: new Date(), updatedAt: new Date() };
        store.auctions.unshift(newLot);
        if (attributes) {
          store.attributes.push({ id: `attr-${id}`, auctionId: id, attributes, makerExtraction: {} });
        }
        return newLot;
      },
      update: async ({ where, data }) => {
        const idx = store.auctions.findIndex((a) => a.id === where.id);
        if (idx === -1) throw new Error('Auction not found');
        store.auctions[idx] = { ...store.auctions[idx], ...data, updatedAt: new Date() };
        return store.auctions[idx];
      }
    },
    auctionCategory: {
      findMany: async () => [...store.categories],
      findUnique: async ({ where }) => store.categories.find((c) => c.slug === where.slug || c.id === where.id || c.code === where.code) || null
    },
    bank: {
      findMany: async () => [...store.banks],
      findUnique: async ({ where }) => store.banks.find((b) => b.id === where.id || b.code === where.code) || null
    },
    verificationReview: {
      create: async ({ data }) => {
        const vr = { id: `vr-${Date.now()}`, ...data, createdAt: new Date() };
        store.verificationReviews.push(vr);
        return vr;
      },
      findMany: async ({ where = {} } = {}) => {
        let list = [...store.verificationReviews];
        if (where.checkerId) list = list.filter((v) => v.checkerId === where.checkerId);
        return list;
      }
    },
    inspectionAssignment: {
      findMany: async ({ where = {}, include = {} } = {}) => {
        let list = [...store.inspectionAssignments];
        if (where.engineerId) list = list.filter((a) => a.engineerId === where.engineerId);
        if (where.status) list = list.filter((a) => a.status === where.status);
        return list.map((item) => {
          const res = { ...item };
          if (include.auction) {
            const auc = store.auctions.find((a) => a.id === item.auctionId);
            res.auction = auc ? { ...auc, category: store.categories.find(c => c.id === auc.categoryId) } : null;
          }
          if (include.report) {
            res.report = store.inspectionReports.find((r) => r.assignmentId === item.id) || null;
          }
          return res;
        });
      },
      findUnique: async ({ where, include = {} }) => {
        const item = store.inspectionAssignments.find((a) => a.id === where.id);
        if (!item) return null;
        const res = { ...item };
        if (include.auction) res.auction = store.auctions.find((a) => a.id === item.auctionId);
        if (include.report) res.report = store.inspectionReports.find((r) => r.assignmentId === item.id);
        return res;
      },
      create: async ({ data }) => {
        const asg = { id: `asg-${Date.now()}`, ...data, createdAt: new Date(), updatedAt: new Date() };
        store.inspectionAssignments.push(asg);
        return asg;
      },
      update: async ({ where, data }) => {
        const idx = store.inspectionAssignments.findIndex((a) => a.id === where.id);
        if (idx === -1) throw new Error('Assignment not found');
        store.inspectionAssignments[idx] = { ...store.inspectionAssignments[idx], ...data, updatedAt: new Date() };
        return store.inspectionAssignments[idx];
      }
    },
    inspectionReport: {
      create: async ({ data }) => {
        const rep = { id: `rep-${Date.now()}`, ...data, submittedAt: new Date() };
        store.inspectionReports.push(rep);
        return rep;
      },
      findUnique: async ({ where }) => store.inspectionReports.find((r) => r.assignmentId === where.assignmentId || r.id === where.id) || null
    },
    savedProperty: {
      findMany: async ({ where, include = {} }) => {
        const list = store.savedProperties.filter((s) => s.userId === where.userId);
        return list.map((item) => {
          const res = { ...item };
          if (include.auction) {
            const auc = store.auctions.find((a) => a.id === item.auctionId);
            res.auction = auc ? { ...auc, bank: store.banks.find(b => b.id === auc.bankId), category: store.categories.find(c => c.id === auc.categoryId) } : null;
          }
          return res;
        });
      },
      findUnique: async ({ where }) => {
        return store.savedProperties.find((s) => s.userId === where.userId_auctionId.userId && s.auctionId === where.userId_auctionId.auctionId) || null;
      },
      create: async ({ data }) => {
        const sp = { id: `sp-${Date.now()}`, ...data, savedAt: new Date() };
        store.savedProperties.push(sp);
        return sp;
      },
      delete: async ({ where }) => {
        const idx = store.savedProperties.findIndex(
          (s) => s.userId === where.userId_auctionId.userId && s.auctionId === where.userId_auctionId.auctionId
        );
        if (idx > -1) store.savedProperties.splice(idx, 1);
        return { success: true };
      }
    },
    propertyUnlock: {
      findMany: async ({ where, include = {} }) => {
        const list = store.propertyUnlocks.filter((p) => p.userId === where.userId);
        return list.map((item) => {
          const res = { ...item };
          if (include.auction) {
            const auc = store.auctions.find((a) => a.id === item.auctionId);
            res.auction = auc ? { ...auc, bank: store.banks.find(b => b.id === auc.bankId), category: store.categories.find(c => c.id === auc.categoryId) } : null;
          }
          return res;
        });
      },
      findUnique: async ({ where }) => {
        return store.propertyUnlocks.find((p) => p.userId === where.userId_auctionId.userId && p.auctionId === where.userId_auctionId.auctionId) || null;
      },
      create: async ({ data }) => {
        const pu = { id: `pu-${Date.now()}`, ...data, unlockedAt: new Date() };
        store.propertyUnlocks.push(pu);
        return pu;
      }
    },
    analyticsEvent: {
      create: async ({ data }) => {
        const ev = { id: `ev-${Date.now()}`, ...data, createdAt: new Date() };
        store.analyticsEvents.push(ev);
        return ev;
      },
      findMany: async () => [...store.analyticsEvents]
    },
    auditLog: {
      create: async ({ data }) => {
        const al = { id: `aud-${Date.now()}`, ...data, createdAt: new Date() };
        store.auditLogs.unshift(al);
        return al;
      },
      findMany: async () => [...store.auditLogs]
    },
    siteSetting: {
      findFirst: async () => store.siteSettings,
      update: async ({ data }) => {
        store.siteSettings = { ...store.siteSettings, ...data };
        return store.siteSettings;
      }
    }
  };
}

export const db = createStoreAdapter();
