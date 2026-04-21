import { deriveProjectedBillFromAnnualSavings } from '@project-solar/shared-solar-core';
import type { SolarLeadRow } from './db';

type LeadEconomicsRow = Pick<SolarLeadRow, 'solar_data' | 'savings_eur'>;

function storedEligibility(lead: LeadEconomicsRow): Record<string, unknown> {
  return ((lead.solar_data as Record<string, unknown>)?.pipeline as Record<string, unknown> | undefined)?.eligibility as Record<string, unknown> || {};
}

export function projectedMonthlyBill(lead: LeadEconomicsRow): number {
  const stored = Number(storedEligibility(lead).projectedMonthlyBill);
  if (Number.isFinite(stored) && stored >= 0) return stored;
  return deriveProjectedBillFromAnnualSavings(lead.savings_eur).projectedMonthlyBill;
}

export function currentMonthlyBill(lead: LeadEconomicsRow): number {
  const stored = Number(storedEligibility(lead).annualBillBeforeSolar);
  if (Number.isFinite(stored) && stored > 0) return Math.round((stored / 12) * 100) / 100;
  // Fallback: standard Spanish household baseline (4,200 kWh/yr × €0.25 / 12)
  return 87.5;
}
