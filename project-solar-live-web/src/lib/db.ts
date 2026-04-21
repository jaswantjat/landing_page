import { Pool } from 'pg';

export interface SolarLeadRow {
  id: string;
  address: string;
  lat: number;
  lon: number;
  solar_data: Record<string, unknown>;
  panels_rec: number;
  savings_eur: number;
  lead_name: string | null;
  lead_phone: string | null;
  priority_choice: string | null;
  monthly_bill_bracket: string | null;
  status: string;
  proposal_image_base64: string | null;
  proposal_image_mime_type: string | null;
  proposal_image_render_method: string | null;
}

let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  return pool;
}

export async function findLeadById(id: string): Promise<SolarLeadRow | null> {
  const result = await getPool().query<SolarLeadRow>(
    `SELECT id, address, lat, lon, solar_data, panels_rec, savings_eur, lead_name, lead_phone,
            priority_choice, monthly_bill_bracket, status,
            proposal_image_base64, proposal_image_mime_type, proposal_image_render_method
     FROM solar_leads WHERE id = $1 LIMIT 1`,
    [id]
  );
  return result.rows[0] || null;
}

export async function updateCapturedLead(
  id: string,
  leadName: string | null,
  leadPhone: string,
  priorityChoice: string | null,
  monthlyBillBracket: string | null
): Promise<void> {
  await getPool().query(
    `UPDATE solar_leads
     SET lead_name = $2, lead_phone = $3, priority_choice = $4, monthly_bill_bracket = $5, status = 'captured'
     WHERE id = $1`,
    [id, leadName, leadPhone, priorityChoice, monthlyBillBracket]
  );
}
