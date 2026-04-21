import type { SolarLeadRow } from './db';
import { buildLeadTemplateVars, type LeadTemplateVars } from './template-vars.ts';

export interface LeadPageModel {
  lead: SolarLeadRow;
  proposalImageUrl: string | null;
  vars: LeadTemplateVars;
}

export async function loadLeadPageModel(
  id: string,
  deps: {
    findLeadById: (id: string) => Promise<SolarLeadRow | null>;
    appBaseUrl?: string;
  }
): Promise<LeadPageModel | null> {
  const lead = await deps.findLeadById(id);
  if (!lead) return null;
  const vars = buildLeadTemplateVars(lead, { appBaseUrl: deps.appBaseUrl ?? '' });
  return { lead, proposalImageUrl: vars.proposal_image_url, vars };
}
