function configuredAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || process.env.BACKEND_JOB_TOKEN || '';
}

export function authorizedAdminRequest(request: Request): boolean {
  const password = configuredAdminPassword();
  if (!password) return false;
  const authHeader = request.headers.get('authorization') ?? '';
  const directHeader = request.headers.get('x-admin-password') ?? '';
  return authHeader === `Bearer ${password}` || directHeader === password;
}
