import test from 'node:test';
import assert from 'node:assert/strict';
import { authorizedAdminRequest } from '../src/lib/admin-auth.ts';

function withEnv(value: string | undefined, run: () => void) {
  const originalAdmin = process.env.ADMIN_PASSWORD;
  const originalJobToken = process.env.BACKEND_JOB_TOKEN;
  process.env.ADMIN_PASSWORD = value;
  process.env.BACKEND_JOB_TOKEN = value;
  try {
    run();
  } finally {
    process.env.ADMIN_PASSWORD = originalAdmin;
    process.env.BACKEND_JOB_TOKEN = originalJobToken;
  }
}

test('authorizedAdminRequest accepts the authorization bearer token', () => {
  withEnv('secret-1', () => {
    const request = new Request('https://example.com', {
      headers: { Authorization: 'Bearer secret-1' }
    });
    assert.equal(authorizedAdminRequest(request), true);
  });
});

test('authorizedAdminRequest accepts the x-admin-password header', () => {
  withEnv('secret-2', () => {
    const request = new Request('https://example.com', {
      headers: { 'x-admin-password': 'secret-2' }
    });
    assert.equal(authorizedAdminRequest(request), true);
  });
});

test('authorizedAdminRequest rejects a mismatched password', () => {
  withEnv('secret-3', () => {
    const request = new Request('https://example.com', {
      headers: { Authorization: 'Bearer nope' }
    });
    assert.equal(authorizedAdminRequest(request), false);
  });
});
