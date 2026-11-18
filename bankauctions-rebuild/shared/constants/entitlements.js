export const PLAN_CAPABILITIES = {
  FREE: {
    bankFilters: false,
    dateFilters: false,
    possessionFilters: false,
    valueFilters: false,
    prioritySupport: false,
    export: false,
  },
  PRO: {
    bankFilters: true,
    dateFilters: true,
    possessionFilters: false,
    valueFilters: false,
    prioritySupport: false,
    export: false,
  },
  PREMIUM: {
    bankFilters: true,
    dateFilters: true,
    possessionFilters: true,
    valueFilters: true,
    prioritySupport: true,
    export: false,
  },
  PRO_PREMIUM: {
    bankFilters: true,
    dateFilters: true,
    possessionFilters: true,
    valueFilters: true,
    prioritySupport: true,
    export: true,
  },
};
export function capabilities(user) {
  if (["ADMIN", "CHECKER", "ENGINEER"].includes(user?.role))
    return PLAN_CAPABILITIES.PRO_PREMIUM;
  return PLAN_CAPABILITIES[user?.planTier] || PLAN_CAPABILITIES.FREE;
}
