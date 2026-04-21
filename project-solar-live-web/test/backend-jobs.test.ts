import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getBackendJobBaseUrl,
  getNeighborhoodCampaignJobStatus,
  startNeighborhoodCampaignJob
} from '../src/lib/backend-jobs.ts';

test('getBackendJobBaseUrl normalizes Railway hostnames', () => {
  const originalEnv = { ...process.env };
  process.env.BACKEND_JOB_BASE_URL = '';
  process.env.RAILWAY_SERVICE_SOLAR_LEADS_BACKEND_URL = 'solar-leads-backend-production.up.railway.app';

  assert.equal(
    getBackendJobBaseUrl(),
    'https://solar-leads-backend-production.up.railway.app'
  );

  process.env = originalEnv;
});

test('startNeighborhoodCampaignJob sends address and radius_m to campaign endpoint', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;

  process.env.BACKEND_JOB_BASE_URL = 'https://backend.example.com';
  process.env.BACKEND_JOB_TOKEN = 'token-abc';

  let seenPath = '';
  let seenBody: Record<string, unknown> = {};
  let seenAuth = '';

  global.fetch = async (input, init) => {
    seenPath = String(input);
    seenBody = JSON.parse(String(init?.body));
    seenAuth = String((init?.headers as Record<string, string>).Authorization);
    return new Response(JSON.stringify({
      ok: true,
      result: {
        jobId: 'j1',
        seedAddress: '1 Main St',
        radiusM: 400,
        status: 'processing'
      }
    }), { status: 202, headers: { 'Content-Type': 'application/json' } });
  };

  const result = await startNeighborhoodCampaignJob('1 Main St', 400);

  assert.equal(seenAuth, 'Bearer token-abc');
  assert.match(seenPath, /\/api\/jobs\/campaign$/);
  assert.equal(seenBody.address, '1 Main St');
  assert.equal(seenBody.radius_m, 400);
  assert.equal(result.jobId, 'j1');
  assert.equal(result.status, 'processing');

  global.fetch = originalFetch;
  process.env = originalEnv;
});

test('getNeighborhoodCampaignJobStatus fetches persisted job state', async () => {
  const originalEnv = { ...process.env };
  const originalFetch = global.fetch;

  process.env.BACKEND_JOB_BASE_URL = 'https://backend.example.com';
  process.env.BACKEND_JOB_TOKEN = 'token-abc';

  let seenPath = '';
  let seenAuth = '';

  global.fetch = async (input, init) => {
    seenPath = String(input);
    seenAuth = String((init?.headers as Record<string, string>).Authorization);
    return new Response(JSON.stringify({
      ok: true,
      result: {
        jobId: 'j1',
        seedAddress: '1 Main St',
        radiusM: 400,
        status: 'completed',
        errorMessage: null,
        candidateCount: 3,
        acceptedCount: 2,
        rejectedCount: 1,
        uploadedCount: 2,
        driveFolderName: 'folder',
        driveFolderUrl: 'https://drive.google.com/folder'
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  };

  const result = await getNeighborhoodCampaignJobStatus('j1');

  assert.equal(seenAuth, 'Bearer token-abc');
  assert.match(seenPath, /\/api\/jobs\/campaign\/j1$/);
  assert.equal(result.status, 'completed');
  assert.equal(result.uploadedCount, 2);

  global.fetch = originalFetch;
  process.env = originalEnv;
});
