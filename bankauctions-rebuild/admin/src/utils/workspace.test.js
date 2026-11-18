import { describe, expect, it } from 'vitest';
import { loginDestination, workspacePath } from './workspace';

describe('shared sign-in routing', () => {
  it.each([['BUYER', '/buyer/dashboard'], ['ADMIN', '/admin'], ['ENGINEER', '/engineer'], ['CHECKER', '/checker']])('sends %s to its workspace', (role, path) => {
    expect(workspacePath(role)).toBe(path);
    expect(loginDestination(role)).toBe(path);
  });
  it('restores a permitted deep link including filters', () => {
    expect(loginDestination('ENGINEER', { pathname: '/engineer/assignments', search: '?status=pending', hash: '#next' })).toBe('/engineer/assignments?status=pending#next');
  });
  it('ignores a destination in another role and external destinations', () => {
    for (const pathname of ['/admin', '/engineer/assignments', '//example.com', 'https://example.com', '/buyer-other']) {
      expect(loginDestination('BUYER', { pathname })).toBe('/buyer/dashboard');
    }
  });
});
