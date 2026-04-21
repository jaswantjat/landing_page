import test from 'node:test';
import assert from 'node:assert/strict';
import { handleCampaignStart, handleCampaignStatus } from '../src/lib/admin.ts';

function fakeCampaignStart(overrides: Partial<{ jobId: string }> = {}) {
  return {
    jobId: overrides.jobId ?? 'job-99',
    seedAddress: '5 Test St, Barcelona',
    radiusM: 300,
    status: 'processing' as const
  };
}

test('handleCampaignStart returns ok result for valid input', async () => {
  const result = await handleCampaignStart(
    { address: '5 Test St, Barcelona', radius_m: 300 },
    { startNeighborhoodCampaignJob: async () => fakeCampaignStart() }
  );

  assert.equal(result.ok, true);
  assert.equal(result.jobId, 'job-99');
  assert.equal(result.status, 'processing');
});

test('handleCampaignStart passes trimmed address and radius to job', async () => {
  let seenAddress = '';
  let seenRadius = 0;
  let seenMaxLeads: number | null | undefined;

  await handleCampaignStart(
    { address: '  10 Main St, Springfield  ', radius_m: 400, max_leads: 5 },
    {
      startNeighborhoodCampaignJob: async (address, radius, maxLeads) => {
        seenAddress = address;
        seenRadius = radius;
        seenMaxLeads = maxLeads;
        return { jobId: 'j1', seedAddress: address, radiusM: radius, status: 'processing' };
      }
    }
  );

  assert.equal(seenAddress, '10 Main St, Springfield');
  assert.equal(seenRadius, 400);
  assert.equal(seenMaxLeads, 5);
});

test('handleCampaignStart uses default radius of 500 when not provided', async () => {
  let seenRadius = 0;

  await handleCampaignStart(
    { address: '5 Test St, Barcelona' },
    {
      startNeighborhoodCampaignJob: async (_address, radius) => {
        seenRadius = radius;
        return { jobId: 'j1', seedAddress: '', radiusM: radius, status: 'processing' };
      }
    }
  );

  assert.equal(seenRadius, 500);
});

test('handleCampaignStart throws when address is too short', async () => {
  await assert.rejects(() =>
    handleCampaignStart(
      { address: 'ab' },
      { startNeighborhoodCampaignJob: async () => ({ jobId: 'j', seedAddress: '', radiusM: 500, status: 'processing' }) }
    )
  );
});

test('handleCampaignStart throws when radius is below minimum', async () => {
  await assert.rejects(() =>
    handleCampaignStart(
      { address: '5 Test St', radius_m: 10 },
      { startNeighborhoodCampaignJob: async () => ({ jobId: 'j', seedAddress: '', radiusM: 500, status: 'processing' }) }
    )
  );
});

test('handleCampaignStart throws when radius exceeds maximum', async () => {
  await assert.rejects(() =>
    handleCampaignStart(
      { address: '5 Test St', radius_m: 1000 },
      { startNeighborhoodCampaignJob: async () => ({ jobId: 'j', seedAddress: '', radiusM: 500, status: 'processing' }) }
    )
  );
});

test('handleCampaignStatus validates job id and returns job details', async () => {
  const result = await handleCampaignStatus(
    { jobId: 'job-1' },
    {
      getNeighborhoodCampaignJobStatus: async (jobId) => ({
        jobId,
        seedAddress: '5 Test St, Barcelona',
        radiusM: 300,
        status: 'completed',
        errorMessage: null,
        candidateCount: 4,
        acceptedCount: 2,
        rejectedCount: 2,
        uploadedCount: 2,
        driveFolderName: 'folder',
        driveFolderUrl: 'https://drive.google.com/folder'
      })
    }
  );

  assert.equal(result.ok, true);
  assert.equal(result.status, 'completed');
  assert.equal(result.jobId, 'job-1');
});
