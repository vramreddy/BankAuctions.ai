export function workspacePath(role) {
  return { ADMIN: '/admin', CHECKER: '/checker', ENGINEER: '/engineer', MARKETING: '/marketing', BUYER: '/buyer/dashboard' }[role] || '/buyer/dashboard';
}

export function loginDestination(role, from) {
  const home = workspacePath(role);
  const prefix = home.split('/')[1];
  if (from?.pathname && (from.pathname === `/${prefix}` || from.pathname.startsWith(`/${prefix}/`))) {
    return from.pathname + (from.search || '') + (from.hash || '');
  }
  return home;
}
