import { notFound } from 'next/navigation';
import { LeadProposalTemplate } from '../../../src/components/LeadProposalTemplate';
import { findLeadById } from '../../../src/lib/db';
import { loadLeadPageModel } from '../../../src/lib/leads';

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const model = await loadLeadPageModel(id, {
    findLeadById,
    appBaseUrl: process.env.APP_BASE_URL ?? '',
  });
  if (!model) notFound();

  return <LeadProposalTemplate vars={model.vars} />;
}
