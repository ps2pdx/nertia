/**
 * Smoke test for the site-creation flow.
 *
 *   POST {baseUrl}/api/sites  → { slug, url }
 *   GET  {baseUrl}/hosted/{slug}  → 200 + contains the seeded headline
 *
 * Until wildcard DNS ships, the GET hits the local rewritten path
 * instead of the production {slug}.nertia.ai URL.
 *
 * Run:
 *   node --experimental-strip-types scripts/smoke-generate.ts
 *   node --experimental-strip-types scripts/smoke-generate.ts --base http://localhost:3000
 *   node --experimental-strip-types scripts/smoke-generate.ts --template portfolio
 */

export const SMOKE_HEADLINE = "smoke-test-precedent-headline";

const PRECEDENT_COPY = {
  "hero.pill": "smoke",
  "hero.headline": SMOKE_HEADLINE,
  "hero.sub": "Smoke run.",
  "hero.primaryCtaLabel": "Go",
  "hero.primaryCtaHref": "https://example.com",
};

const PORTFOLIO_COPY = {
  "hero.greeting": "Hi, I'm",
  "hero.name": SMOKE_HEADLINE,
  "hero.description": "Smoke-test portfolio run.",
  "hero.avatarInitials": "ST",
  "about.heading": "About",
  "about.body": "Smoke-test about section content.",
};

const COPY_FIXTURES: Record<string, Record<string, string>> = {
  precedent: PRECEDENT_COPY,
  portfolio: PORTFOLIO_COPY,
};

export type SmokeResult =
  | { ok: true; slug: string }
  | { ok: false; reason: string };

export type SmokeOptions = {
  baseUrl?: string;
  templateId?: string;
  fetchImpl?: typeof fetch;
};

export async function runSmoke(opts: SmokeOptions = {}): Promise<SmokeResult> {
  const baseUrl = (opts.baseUrl ?? "http://localhost:3000").replace(/\/+$/, "");
  const templateId = opts.templateId ?? "precedent";
  const fetchImpl = opts.fetchImpl ?? fetch;
  const copy = COPY_FIXTURES[templateId] ?? PRECEDENT_COPY;

  const createRes = await fetchImpl(`${baseUrl}/api/sites`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ templateId, copy }),
  });

  if (!createRes.ok) {
    return { ok: false, reason: `create ${createRes.status}` };
  }

  const created = (await createRes.json()) as { slug?: string; url?: string };
  if (!created.slug) {
    return { ok: false, reason: "create response missing slug" };
  }

  const renderRes = await fetchImpl(`${baseUrl}/hosted/${created.slug}`);
  if (!renderRes.ok) {
    return { ok: false, reason: `render ${renderRes.status}` };
  }

  const html = await renderRes.text();
  if (!html.includes(SMOKE_HEADLINE)) {
    return { ok: false, reason: "headline missing from rendered HTML" };
  }

  return { ok: true, slug: created.slug };
}

function parseArgs(argv: string[]): { baseUrl?: string; templateId?: string } {
  const out: { baseUrl?: string; templateId?: string } = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--base" && argv[i + 1]) out.baseUrl = argv[++i];
    else if (argv[i] === "--template" && argv[i + 1]) out.templateId = argv[++i];
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await runSmoke(args);
  if (result.ok) {
    console.log(`smoke ok · slug=${result.slug}`);
    process.exit(0);
  }
  console.error(`smoke fail · ${result.reason}`);
  process.exit(1);
}

const invokedDirectly =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/"));

if (invokedDirectly) {
  void main();
}
