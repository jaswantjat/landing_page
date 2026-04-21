import { z } from 'zod';
import type { SolarLeadRow } from './db';

export const captureSchema = z.object({
  id: z.string().min(1),
  lead_name: z.string().trim().optional().default(''),
  lead_phone: z.string().trim().min(6),
  priority_choice: z.string().trim().optional().default(''),
  monthly_bill_bracket: z.string().trim().optional().default('')
});

export async function captureLeadSubmission(
  input: unknown,
  deps: {
    findLeadById: (id: string) => Promise<SolarLeadRow | null>;
    updateCapturedLead: (id: string, leadName: string | null, leadPhone: string, priorityChoice: string | null, monthlyBillBracket: string | null) => Promise<void>;
    appendCapturedLeadRow: (lead: SolarLeadRow, capture: { leadName: string | null; leadPhone: string; priorityChoice: string | null; monthlyBillBracket: string | null }) => Promise<unknown>;
  }
) {
  const parsed = captureSchema.parse(input);
  const lead = await deps.findLeadById(parsed.id);
  if (!lead) throw new Error('Lead not found');
  const leadName = parsed.lead_name || null;
  const priorityChoice = parsed.priority_choice || null;
  const monthlyBillBracket = parsed.monthly_bill_bracket || null;

  await deps.appendCapturedLeadRow(lead, {
    leadName,
    leadPhone: parsed.lead_phone,
    priorityChoice,
    monthlyBillBracket
  });
  await deps.updateCapturedLead(parsed.id, leadName, parsed.lead_phone, priorityChoice, monthlyBillBracket);

  return { ok: true, id: parsed.id };
}
