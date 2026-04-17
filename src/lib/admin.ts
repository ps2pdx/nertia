/**
 * Admin email allowlist. Set NEXT_PUBLIC_ADMIN_EMAILS in .env.local
 * (comma-separated). Defaults to ps2pdx@gmail.com if unset.
 */
const DEFAULT_ADMINS = ['ps2pdx@gmail.com'];

export function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS;
  if (!raw) return DEFAULT_ADMINS;
  return raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}
