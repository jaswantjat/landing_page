import test from 'node:test';
import assert from 'node:assert/strict';
import { getPublicRootRedirectTarget } from '../src/lib/root-redirect.ts';

test('redirects bare solar.eltex.es root traffic to eltex.es', () => {
  const target = getPublicRootRedirectTarget({
    host: 'solar.eltex.es',
    searchParams: {},
  });

  assert.equal(target, 'https://eltex.es');
});

test('redirects forwarded host values and strips ports', () => {
  const target = getPublicRootRedirectTarget({
    host: 'solar.eltex.es:443, solar-leads-web-production.up.railway.app',
    searchParams: {},
  });

  assert.equal(target, 'https://eltex.es');
});

test('does not redirect when query params are present', () => {
  const target = getPublicRootRedirectTarget({
    host: 'solar.eltex.es',
    searchParams: { preview: '1' },
  });

  assert.equal(target, null);
});

test('does not redirect non-public hosts', () => {
  const target = getPublicRootRedirectTarget({
    host: 'solar-leads-web-production.up.railway.app',
    searchParams: {},
  });

  assert.equal(target, null);
});
