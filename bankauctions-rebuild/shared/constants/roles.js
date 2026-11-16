export const ROLES = {
  ADMIN: 'ADMIN',
  CHECKER: 'CHECKER',
  ENGINEER: 'ENGINEER',
  BUYER: 'BUYER'
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.CHECKER]: 'Quality Checker',
  [ROLES.ENGINEER]: 'Field Inspection Engineer',
  [ROLES.BUYER]: 'Property Buyer'
};

export const ROLE_HOMES = {
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.CHECKER]: '/checker/dashboard',
  [ROLES.ENGINEER]: '/engineer/dashboard',
  [ROLES.BUYER]: '/buyer/dashboard'
};
