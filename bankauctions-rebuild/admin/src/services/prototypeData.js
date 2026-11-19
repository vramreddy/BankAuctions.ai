// Prototype Data Service: encapsulates data, staff, customers, payments, listings, and audit operations

export const CITIES = {
  chennai: { label: 'Chennai', live: '1,528' },
  hyderabad: { label: 'Hyderabad', live: '833' },
  bengaluru: { label: 'Bengaluru', live: '2,004' },
  coimbatore: { label: 'Coimbatore', live: '511' },
  kerala: { label: 'Kerala', live: '4,860' },
};

export const STATES = ['Tamil Nadu', 'Karnataka', 'Telangana', 'Kerala'];

export const ROLES_CONFIG = {
  field: 'Field engineer',
  lawyer: 'Advocate',
  checker: 'Checker',
  marketing: 'Marketing',
  admin: 'Admin',
  leadership: 'Leadership',
};

const SEED_STAFF = [
  { id: 'S1001', role: 'admin', name: 'Rahul D.', phone: '9840112345', email: 'rahul.d@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai'], manager: '' },
  { id: 'S1002', role: 'checker', name: 'Latha M.', phone: '9840223456', email: 'latha.m@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai'], manager: '' },
  { id: 'S1003', role: 'marketing', name: 'Meera N.', phone: '9840334567', email: 'meera.n@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai', 'coimbatore'], manager: '' },
  { id: 'S1004', role: 'marketing', name: 'Pooja V.', phone: '9840334588', email: 'pooja.v@bankauctions.ai', status: 'active', state: 'Karnataka', cities: ['bengaluru'], manager: '' },
  { id: 'S1005', role: 'field', name: 'Karthik S.', phone: '9840445678', email: 'karthik.s@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai'], manager: 'S1003' },
  { id: 'S1006', role: 'field', name: 'Vignesh R.', phone: '9840556789', email: 'vignesh.r@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai', 'coimbatore'], manager: 'S1003' },
  { id: 'S1007', role: 'field', name: 'Siddharth M.', phone: '9840667890', email: 'siddharth.m@bankauctions.ai', status: 'active', state: 'Karnataka', cities: ['bengaluru'], manager: 'S1004' },
  { id: 'S1008', role: 'lawyer', name: 'Adv. K. Ramesh', phone: '9840778901', email: 'k.ramesh@bar.bankauctions.ai', status: 'active', state: 'Tamil Nadu', advocate: 'Adv. K. Ramesh · Madras High Court', cities: [], manager: '' },
  { id: 'S1009', role: 'leadership', name: 'Sanjay K.', phone: '9840889012', email: 'sanjay.k@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: [], manager: '' },
];

export const RAW_PROPERTIES = [
  { id: 'CHN-10241', city: 'chennai', cat: 'flat', title: '2BHK flat, 1,040 sq ft · Velachery', short: '2BHK flat', loc: 'Velachery', bank: 'Canara Bank', reserve: 6100000, emd: 610000, disc: 21, poss: 'Physical possession', premium: false, days: 3, exception: false },
  { id: 'CHN-10283', city: 'chennai', cat: 'flat', title: '3BHK flat, 1,320 sq ft · Pallikaranai', short: '3BHK flat', loc: 'Pallikaranai', bank: 'Indian Bank', reserve: 6850000, emd: 685000, disc: 22, poss: 'Physical possession', premium: false, days: 5, exception: true },
  { id: 'CHN-10311', city: 'chennai', cat: 'flat', title: '2BHK flat, 860 sq ft · Kolathur', short: '2BHK flat', loc: 'Kolathur', bank: 'Indian Overseas Bank', reserve: 3420000, emd: 342000, disc: 27, poss: 'Symbolic possession', premium: false, days: 34, exception: false },
  { id: 'CHN-10355', city: 'chennai', cat: 'flat', title: '2BHK flat, 940 sq ft · Medavakkam', short: '2BHK flat', loc: 'Medavakkam', bank: 'State Bank of India', reserve: 4490000, emd: 449000, disc: 23, poss: 'Physical possession', premium: false, days: 6, exception: false },
  { id: 'CHN-10389', city: 'chennai', cat: 'flat', title: '3BHK corner flat, main-road facing · Sholinganallur', short: '3BHK corner flat', loc: 'Sholinganallur', bank: 'Repco Home Finance', reserve: 8940000, emd: 894000, disc: 23, poss: 'Physical possession', premium: true, days: 9, exception: false },
  { id: 'CHN-10430', city: 'chennai', cat: 'house', title: 'Independent house, 1,860 sq ft · Anna Nagar', short: 'Independent house', loc: 'Anna Nagar', bank: 'TN State Apex Co-op Bank', reserve: 17360000, emd: 1736000, disc: 20, poss: 'Symbolic possession', premium: true, days: 12, exception: true },
  { id: 'HYD-10214', city: 'hyderabad', cat: 'flat', title: '3BHK gated flat, 1,650 sq ft · Gachibowli', short: '3BHK gated flat', loc: 'Gachibowli', bank: 'HDFC Bank', reserve: 9800000, emd: 980000, disc: 25, poss: 'Physical possession', premium: true, days: 7, exception: false },
  { id: 'HYD-10290', city: 'hyderabad', cat: 'house', title: 'Villa, 2,800 sq ft · Kondapur', short: 'Independent Villa', loc: 'Kondapur', bank: 'Axis Bank', reserve: 24500000, emd: 2450000, disc: 28, poss: 'Physical possession', premium: true, days: 14, exception: false },
  { id: 'BLR-10115', city: 'bengaluru', cat: 'flat', title: '3BHK flat, 1,540 sq ft · Whitefield', short: '3BHK luxury flat', loc: 'Whitefield', bank: 'ICICI Bank', reserve: 11200000, emd: 1120000, disc: 24, poss: 'Physical possession', premium: true, days: 4, exception: false },
  { id: 'BLR-10204', city: 'bengaluru', cat: 'house', title: '4BHK Villa · HSR Layout', short: '4BHK Villa', loc: 'HSR Layout', bank: 'State Bank of India', reserve: 38000000, emd: 3800000, disc: 19, poss: 'Symbolic possession', premium: true, days: 18, exception: true },
  { id: 'CBE-10102', city: 'coimbatore', cat: 'land', title: 'Residential plot 4.2 cents · Saravanampatti', short: 'Plot 4.2 cents', loc: 'Saravanampatti', bank: 'Canara Bank', reserve: 3200000, emd: 320000, disc: 26, poss: 'Physical possession', premium: false, days: 8, exception: false },
  { id: 'KER-10150', city: 'kerala', cat: 'house', title: 'Waterfront Villa · Aluva, Kochi', short: 'Waterfront Villa', loc: 'Aluva', bank: 'Federal Bank', reserve: 16500000, emd: 1650000, disc: 30, poss: 'Physical possession', premium: true, days: 11, exception: false },
];

export const INITIAL_AUDIT_LOGS = [
  { at: Date.now() - 1000 * 60 * 8, who: 'Rahul D.', role: 'Admin', what: 'Granted 5 unlocks to Vikram Shah' },
  { at: Date.now() - 1000 * 60 * 25, who: 'Latha M.', role: 'Checker', what: 'Approved and published CHN-10283' },
  { at: Date.now() - 1000 * 60 * 55, who: 'Rahul D.', role: 'Admin', what: 'Signed in' },
  { at: Date.now() - 1000 * 60 * 120, who: 'Rahul D.', role: 'Admin', what: 'Assigned 5 properties in Chennai to Karthik S.' },
  { at: Date.now() - 1000 * 60 * 240, who: 'System', role: 'Maker', what: 'Ingested 48 auction lots from e-auctions portal' },
  { at: Date.now() - 1000 * 60 * 360, who: 'Rahul D.', role: 'Admin', what: 'Approved advocate application A1' },
];

export function getLocalItem(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setLocalItem(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

export function logAudit(what, staffName = 'Rahul D.', role = 'Admin') {
  const audits = getLocalItem('ba3_audit', INITIAL_AUDIT_LOGS);
  audits.unshift({
    who: staffName,
    role: role,
    what: what,
    at: Date.now(),
  });
  setLocalItem('ba3_audit', audits);
}

export function formatINR(num) {
  if (num === null || num === undefined) return '—';
  const val = Number(num);
  if (isNaN(val)) return '—';
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(2)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)} L`;
  }
  return `₹${val.toLocaleString('en-IN')}`;
}

export function timeAgo(ts) {
  if (!ts) return 'just now';
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m} min ago`;
  if (m < 1440) return `${Math.round(m / 60)} h ago`;
  return `${Math.round(m / 1440)} d ago`;
}
