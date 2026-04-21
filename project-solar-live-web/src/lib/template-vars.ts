import { currentMonthlyBill, projectedMonthlyBill } from './lead-economics.ts';
import type { SolarLeadRow } from './db.ts';

export interface LeadTemplateVars {
  lead_id: string;
  lead_url: string;
  address_full: string;
  address_line_1: string;
  address_line_2: string;
  location_label: string;
  current_monthly_bill: number;
  projected_monthly_bill: number;
  annual_savings_eur: number;
  panels_recommended: number;
  proposal_image_url: string | null;
  reference_code: string;
  valid_until: string;
  qr_data_url: string | null;
  lead_name: string | null;
  lead_phone: string | null;
  priority_choice: string | null;
  monthly_bill_bracket: string | null;
}

function parseAddressLines(address: string): { line1: string; line2: string } {
  const parts = String(address || '').split(',').map(p => p.trim()).filter(Boolean);
  if (parts.length >= 3) {
    const numberLike = /^\d{1,4}([A-Za-z]|-\d{1,4}[A-Za-z]?)?$/;
    if (numberLike.test(parts[1])) return { line1: `${parts[0]}, ${parts[1]}`, line2: parts[2] };
    return { line1: parts[0], line2: parts[1] };
  }
  if (parts.length === 2) return { line1: parts[0], line2: parts[1] };
  return { line1: parts[0] || '', line2: '' };
}

function locationLabel(address: string): string {
  const parts = String(address || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !['spain', 'españa', 'espana'].includes(part.toLowerCase()));

  for (let index = parts.length - 1; index >= 0; index -= 1) {
    if (!/\d/.test(parts[index])) return parts[index];
  }

  const fallback = parts[parts.length - 1] || '';
  const withoutPostalCode = fallback.replace(/^\d{4,5}\s+/, '').trim();
  return withoutPostalCode || fallback || 'Barcelona';
}

function slugify(value: string): string {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function referenceCode(lead: Pick<SolarLeadRow, 'id' | 'address'>): string {
  const city = String(lead.address || '').slice(0, 3).toUpperCase().replace(/[^A-Z0-9]/g, '');
  return `${city || 'ELX'}-${slugify(lead.id).slice(0, 8).toUpperCase()}`;
}

function validityDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function buildLeadTemplateVars(
  lead: SolarLeadRow,
  options: { appBaseUrl: string; qrDataUrl?: string | null }
): LeadTemplateVars {
  const { line1, line2 } = parseAddressLines(lead.address);
  const proposalImageUrl =
    lead.proposal_image_base64 && lead.proposal_image_mime_type
      ? `/api/image/${lead.id}`
      : null;

  return {
    lead_id: lead.id,
    lead_url: `${options.appBaseUrl.replace(/\/$/, '')}/p/${lead.id}`,
    address_full: lead.address,
    address_line_1: line1,
    address_line_2: line2,
    location_label: locationLabel(lead.address),
    current_monthly_bill: currentMonthlyBill(lead),
    projected_monthly_bill: projectedMonthlyBill(lead),
    annual_savings_eur: lead.savings_eur,
    panels_recommended: lead.panels_rec,
    proposal_image_url: proposalImageUrl,
    reference_code: referenceCode(lead),
    valid_until: validityDate(),
    qr_data_url: options.qrDataUrl ?? null,
    lead_name: lead.lead_name,
    lead_phone: lead.lead_phone,
    priority_choice: lead.priority_choice ?? null,
    monthly_bill_bracket: lead.monthly_bill_bracket ?? null,
  };
}
