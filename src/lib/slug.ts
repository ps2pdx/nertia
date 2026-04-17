const MAX_LEN = 40;

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const trimmed = base.slice(0, MAX_LEN);
  return trimmed || randomSlug();
}

function randomSlug(): string {
  return "site-" + Math.random().toString(36).slice(2, 8);
}

function shortHash(): string {
  return Math.random().toString(36).slice(2, 8);
}

export async function uniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>,
  maxAttempts = 5,
): Promise<string> {
  const candidate = slugify(base);
  if (!(await isTaken(candidate))) return candidate;
  for (let i = 0; i < maxAttempts; i++) {
    const next = `${candidate}-${shortHash()}`.slice(0, MAX_LEN);
    if (!(await isTaken(next))) return next;
  }
  throw new Error("could not find a unique slug after retries");
}
