function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function normalizeBaseUrl(value: string): string {
  return /^https?:\/\//.test(value) ? value : `https://${value}`;
}

export function getBackendJobBaseUrl(): string {
  const configured =
    process.env.BACKEND_JOB_BASE_URL ||
    process.env.RAILWAY_SERVICE_SOLAR_LEADS_BACKEND_URL;

  if (!configured) throw new Error('BACKEND_JOB_BASE_URL is required');
  return normalizeBaseUrl(configured).replace(/\/$/, '');
}

async function postBackendJob<T>(path: string, payload: Record<string, unknown>): Promise<T> {
  return requestBackendJob<T>(path, { method: 'POST', body: payload });
}

async function getBackendJob<T>(path: string): Promise<T> {
  return requestBackendJob<T>(path, { method: 'GET' });
}

async function requestBackendJob<T>(
  path: string,
  options: { method: 'GET' | 'POST'; body?: Record<string, unknown> }
): Promise<T> {
  const response = await fetch(`${getBackendJobBaseUrl()}${path}`, {
    method: options.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${requiredEnv('BACKEND_JOB_TOKEN')}`
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok || !body.ok) {
    const message = body?.error || `Backend job failed with status ${response.status}`;
    throw new Error(message);
  }

  return body.result as T;
}

export interface NeighborhoodCampaignStartResult {
  jobId: string;
  seedAddress: string;
  radiusM: number;
  status: 'processing';
}

export interface NeighborhoodCampaignResult {
  jobId: string;
  seedAddress: string;
  radiusM: number;
  status: 'processing' | 'completed' | 'failed';
  errorMessage: string | null;
  candidateCount: number;
  acceptedCount: number;
  rejectedCount: number;
  uploadedCount: number;
  driveFolderName: string | null;
  driveFolderUrl: string | null;
  completedAt?: string | null;
}

export function startNeighborhoodCampaignJob(address: string, radiusM: number, maxLeads?: number | null) {
  return postBackendJob<NeighborhoodCampaignStartResult>('/api/jobs/campaign', {
    address,
    radius_m: radiusM,
    max_leads: maxLeads ?? undefined
  });
}

export function getNeighborhoodCampaignJobStatus(jobId: string) {
  return getBackendJob<NeighborhoodCampaignResult>(`/api/jobs/campaign/${jobId}`);
}

export interface SingleLeadResult {
  jobId: string;
  leadId: string;
  address: string;
  landingPageUrl: string;
  driveFolderName: string;
  driveFolderUrl: string | null;
  driveFileUrl: string | null;
  uploadedCount: number;
}

export function submitSingleLeadJob(lat: number, lon: number) {
  return postBackendJob<SingleLeadResult>('/api/jobs/single', { lat, lon });
}
