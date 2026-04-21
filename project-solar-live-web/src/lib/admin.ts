import { z } from 'zod';
import type {
  NeighborhoodCampaignResult,
  NeighborhoodCampaignStartResult
} from './backend-jobs';

const campaignFormSchema = z.object({
  address: z.string().min(3),
  radius_m: z.coerce.number().int().min(25).max(750).default(500),
  max_leads: z.coerce.number().int().min(1).max(100).optional()
});

const jobIdSchema = z.object({
  jobId: z.string().min(1)
});

export async function handleCampaignStart(
  input: unknown,
  deps: {
    startNeighborhoodCampaignJob: (
      address: string,
      radiusM: number,
      maxLeads?: number | null
    ) => Promise<NeighborhoodCampaignStartResult>;
  }
) {
  const parsed = campaignFormSchema.parse(input);
  const result = await deps.startNeighborhoodCampaignJob(
    parsed.address.trim(),
    parsed.radius_m,
    parsed.max_leads ?? null
  );
  return { ok: true, ...result };
}

export async function handleCampaignStatus(
  input: unknown,
  deps: { getNeighborhoodCampaignJobStatus: (jobId: string) => Promise<NeighborhoodCampaignResult> }
) {
  const parsed = jobIdSchema.parse(input);
  const result = await deps.getNeighborhoodCampaignJobStatus(parsed.jobId);
  return { ok: true, ...result };
}
