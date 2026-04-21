type SearchParams = Record<string, string | string[] | undefined>;

function normalizeHost(value: string | null | undefined): string {
  const first = String(value || '')
    .split(',')[0]
    .trim()
    .toLowerCase();

  return first.replace(/:\d+$/, '');
}

export function getPublicRootRedirectTarget(options: {
  host?: string | null;
  searchParams?: SearchParams;
}): string | null {
  const host = normalizeHost(options.host);
  const hasQuery = Object.keys(options.searchParams || {}).length > 0;

  if (host === 'solar.eltex.es' && !hasQuery) {
    return 'https://eltex.es';
  }

  return null;
}
