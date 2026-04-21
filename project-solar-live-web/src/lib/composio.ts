import type { SolarLeadRow } from './db';

const DEFAULT_GOOGLE_SHEET_RANGE = 'Sheet1!A:J';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
}

function parseMcpEnvelope(responseText: string) {
  const dataLines = responseText
    .split('\n')
    .filter((line) => line.startsWith('data: '))
    .map((line) => line.slice(6).trim())
    .filter(Boolean);

  const payloadText = dataLines.length ? dataLines[dataLines.length - 1] : responseText;
  const payload = JSON.parse(payloadText);
  if (payload.error) throw new Error(payload.error.message || 'Composio MCP error');
  return payload.result;
}

function parseToolResult(result: { content?: Array<{ type?: string; text?: string }> }) {
  const toolText = result.content?.find((item) => item.type === 'text')?.text;
  if (!toolText) throw new Error('Composio MCP returned no tool payload');
  return JSON.parse(toolText);
}

async function callMcpTool(name: string, args: Record<string, unknown>) {
  const response = await fetch(requiredEnv('COMPOSIO_MCP_URL'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      'x-consumer-api-key': requiredEnv('COMPOSIO_CONSUMER_API_KEY')
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method: 'tools/call',
      params: { name, arguments: args }
    })
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(`Composio MCP request failed (${response.status}): ${responseText}`);
  }

  return parseMcpEnvelope(responseText);
}

async function discoverAppendTool(range: string) {
  const result = await callMcpTool('COMPOSIO_SEARCH_TOOLS', {
    queries: [{ use_case: 'append a row to a google sheet', known_fields: `range: ${range}` }],
    session: { generate_id: true },
    model: 'gpt-5.2'
  });

  const payload = parseToolResult(result);
  const discovered = payload?.data?.results?.[0];
  const toolSlug = discovered?.primary_tool_slugs?.[0];
  const sessionId = payload?.data?.session?.id;

  if (!toolSlug || !sessionId) throw new Error('Composio MCP did not return a Google Sheets append tool');
  return { toolSlug, sessionId };
}

export async function appendCapturedLeadRow(
  lead: SolarLeadRow,
  capture: { leadName: string | null; leadPhone: string; priorityChoice: string | null; monthlyBillBracket: string | null }
) {
  const spreadsheetId = requiredEnv('GOOGLE_SHEET_ID');
  const range = process.env.GOOGLE_SHEET_RANGE || DEFAULT_GOOGLE_SHEET_RANGE;
  const { toolSlug, sessionId } = await discoverAppendTool(range);

  const result = await callMcpTool('COMPOSIO_MULTI_EXECUTE_TOOL', {
    tools: [{
      tool_slug: toolSlug,
      arguments: {
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        insertDataOption: 'INSERT_ROWS',
        values: [[
          lead.id,
          lead.address,
          capture.leadName,
          capture.leadPhone,
          capture.priorityChoice,
          capture.monthlyBillBracket,
          String(lead.savings_eur),
          String(lead.panels_rec),
          'captured',
          new Date().toISOString()
        ]]
      }
    }],
    sync_response_to_workbench: false,
    session_id: sessionId,
    current_step: 'APPEND_CAPTURE_ROW',
    current_step_metric: '1/1'
  });

  return parseToolResult(result);
}
