export const CATEGORIES = {
  FLAT: 'flat',
  HOUSE: 'house',
  LAND: 'land',
  SHOP: 'shop',
  OFFICE: 'office',
  WAREHOUSE: 'warehouse',
  VEHICLE: 'vehicle'
};

export const CATEGORY_DETAILS = {
  [CATEGORIES.FLAT]: {
    name: 'Flats & Apartments',
    short: 'Flat',
    slug: 'flats',
    icon: 'Building2',
    description: 'Residential apartments, builder floors and gated community units sold under SARFAESI.',
    specificFields: ['bhk', 'floor_number', 'total_floors', 'built_up_area_sqft', 'society_name', 'possession']
  },
  [CATEGORIES.HOUSE]: {
    name: 'Houses & Villas',
    short: 'House',
    slug: 'houses',
    icon: 'Home',
    description: 'Independent villas, bungalows and individual houses with underlying land ownership.',
    specificFields: ['bedrooms', 'floors', 'built_up_area_sqft', 'plot_area_sqft', 'condition', 'possession']
  },
  [CATEGORIES.LAND]: {
    name: 'Plots & Land',
    short: 'Plot',
    slug: 'plots',
    icon: 'MapPin',
    description: 'Residential layouts, commercial development parcels and agricultural land.',
    specificFields: ['plot_number', 'survey_number', 'land_area_sqft', 'frontage_road_width_ft', 'zoning', 'boundaries']
  },
  [CATEGORIES.SHOP]: {
    name: 'Shops & Showrooms',
    short: 'Shop',
    slug: 'shops',
    icon: 'Store',
    description: 'High-street retail shops, commercial booths and mall showrooms.',
    specificFields: ['carpet_area_sqft', 'floor_level', 'frontage_ft', 'main_road_facing', 'commercial_score']
  },
  [CATEGORIES.OFFICE]: {
    name: 'Offices & Commercial Floors',
    short: 'Office',
    slug: 'offices',
    icon: 'Briefcase',
    description: 'IT park offices, corporate floors and business suite units.',
    specificFields: ['super_built_up_sqft', 'furnishing_status', 'parking_slots', 'it_corridor', 'lease_status']
  },
  [CATEGORIES.WAREHOUSE]: {
    name: 'Warehouses & Industrial',
    short: 'Warehouse',
    slug: 'warehouses',
    icon: 'Warehouse',
    description: 'Logistics parks, godowns, industrial sheds and manufacturing facilities.',
    specificFields: ['covered_area_sqft', 'land_area_acres', 'power_load_kva', 'highway_frontage', 'ceiling_height_ft']
  },
  [CATEGORIES.VEHICLE]: {
    name: 'Vehicles & Machinery',
    short: 'Vehicle',
    slug: 'vehicles',
    icon: 'Truck',
    description: 'Commercial trucks, tractors, heavy equipment and industrial machinery.',
    specificFields: ['make', 'model', 'manufacturing_year', 'registration_number', 'yard_location', 'running_condition']
  }
};

export const CITIES = {
  chennai: { name: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0827, 80.2707] },
  hyderabad: { name: 'Hyderabad', state: 'Telangana', coordinates: [17.3850, 78.4867] },
  bengaluru: { name: 'Bengaluru', state: 'Karnataka', coordinates: [12.9716, 77.5946] },
  coimbatore: { name: 'Coimbatore', state: 'Tamil Nadu', coordinates: [11.0168, 76.9558] },
  kerala: { name: 'Kerala', state: 'Kerala', coordinates: [9.9312, 76.2673] }
};
