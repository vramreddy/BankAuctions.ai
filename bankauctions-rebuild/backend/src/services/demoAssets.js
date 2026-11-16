// Illustrative inventory for the existing in-memory development adapter only.
// Never import this catalog into the production database seed.
export function createDemoAssets(now = new Date()) {
  const cities = {
    chennai: ['Tambaram', 'Ambattur', 'Porur'],
    bengaluru: ['Whitefield', 'Yelahanka', 'Electronic City'],
    hyderabad: ['Kukatpally', 'Miyapur', 'Gachibowli'],
    coimbatore: ['Peelamedu', 'Saravanampatti', 'Singanallur'],
    kerala: ['Kakkanad', 'Aluva', 'Edappally']
  };
  const types = [
    ['flat', '2BHK apartment, 1,180 sq ft', 4850000, { bhk: '2BHK', built_up_area_sqft: 1180 }],
    ['house', 'Independent house, 2,100 sq ft', 9200000, { bedrooms: 3, built_up_area_sqft: 2100 }],
    ['land', 'Residential plot, 2,400 sq ft', 3600000, { land_area_sqft: 2400, zoning: 'Residential' }],
    ['shop', 'Retail shop, 650 sq ft', 2850000, { carpet_area_sqft: 650, floor_level: 'Ground floor' }],
    ['office', 'Office suite, 1,500 sq ft', 7400000, { super_built_up_sqft: 1500, furnishing_status: 'Unfurnished' }],
    ['warehouse', 'Warehouse, 6,000 sq ft', 12500000, { covered_area_sqft: 6000 }],
    ['vehicle', '2021 compact sedan', 425000, { manufacturing_year: 2021, asset_type: 'Car' }, 'car'],
    ['vehicle', '2022 commuter motorcycle', 65000, { manufacturing_year: 2022, asset_type: 'Motorcycle' }, 'bike'],
    ['vehicle', 'Commercial goods truck', 1150000, { asset_type: 'Truck', manufacturing_year: 2020 }]
  ];
  return Object.entries(cities).flatMap(([city, localities], cityIndex) => types.map(([category, title, price, attributes, illustration], index) => {
    const locality = localities[index % localities.length];
    const image = illustration ? `/images/demo-${illustration}.svg` : `/images/${city}-${category}-1.jpg`;
    return {
      id: `demo-${city}-${index + 1}`, sourceRef: `DEMO-${city.toUpperCase()}-${index + 1}`,
      title: `Demo: ${title} - ${locality}`, shortTitle: `Demo: ${title}`,
      city, locality, address: `Illustrative asset in ${locality}; not an actual auction address`,
      bankId: ['bnk-sbi', 'bnk-canara', 'bnk-bob'][index % 3], categoryId: `cat-${category}`,
      reservePrice: price + cityIndex * (category === 'vehicle' ? 5000 : 100000),
      emdAmount: (price + cityIndex * (category === 'vehicle' ? 5000 : 100000)) / 10,
      bidIncrement: category === 'vehicle' ? 1000 : 10000,
      auctionStartDate: new Date(now.getTime() + (index + 7) * 86400000),
      noticeDate: now, createdAt: now, updatedAt: now,
      possession: 'Demo only - not verified', encumbrances: 'Demo only - not assessed',
      inspectionDate: 'Illustrative listing; no inspection available',
      aiScore: 0, aiRank: index + 1, isPremium: false, hasBankPhotos: false,
      featured: false, status: 'PUBLISHED', isDemo: true,
      primaryImageUrl: image, additionalImages: [image],
      attributes: { ...attributes, demo: true, image_note: 'Illustrative image, not an actual auction asset' }
    };
  }));
}
