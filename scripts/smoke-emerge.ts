/**
 * Smoke test for the /intake/zero-point end-to-end flow.
 * Walks: next → emerge(round 1) → emerge(round 2) → finalize
 * All against a running server. Requires USE_DEMO_MODE=true unless you
 * want to burn real tokens.
 *
 * Run:
 *   USE_DEMO_MODE=true npm run dev &
 *   node --experimental-strip-types scripts/smoke-emerge.ts
 *   node --experimental-strip-types scripts/smoke-emerge.ts --base https://www.nertia.ai
 */

export const SMOKE_PURPOSE = "Smoke-test site for emerge flow.";
export const SMOKE_AUDIENCE = "The smoke-test inspector.";

export type EmergeSmokeResult =
  | { ok: true; slug: string; url: string }
  | { ok: false; reason: string };

export type EmergeSmokeOptions = {
  baseUrl?: string;
  templateId?: string;
  fetchImpl?: typeof fetch;
};

export async function runEmergeSmoke(
  opts: EmergeSmokeOptions = {},
): Promise<EmergeSmokeResult> {
  const baseUrl = (opts.baseUrl ?? "http://localhost:3000").replace(/\/+$/, "");
  const templateId = opts.templateId ?? "precedent";
  const f = opts.fetchImpl ?? fetch;

  const brandContext = {
    purpose: SMOKE_PURPOSE,
    audience: SMOKE_AUDIENCE,
    vibeWords: ["quiet", "rigorous", "warm"],
    adaptive: [] as Array<{ question: string; answer: string }>,
  };

  // 1. next — adaptive questions
  const nextRes = await f(`${baseUrl}/api/intake/next`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ brandContext }),
  });
  if (!nextRes.ok) return { ok: false, reason: `next ${nextRes.status}` };
  const { questions } = (await nextRes.json()) as { questions: string[] };
  brandContext.adaptive.push(
    { question: questions[0], answer: "smoke answer one" },
    { question: questions[1], answer: "smoke answer two" },
  );

  // 2. emerge round 1
  const round1Res = await f(`${baseUrl}/api/intake/emerge`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ brandContext, round: 1 }),
  });
  if (!round1Res.ok) return { ok: false, reason: `emerge1 ${round1Res.status}` };
  const { variants: round1 } = (await round1Res.json()) as {
    variants: Array<{ id: string }>;
  };
  if (round1.length !== 3) {
    return { ok: false, reason: `emerge1 returned ${round1.length} variants` };
  }
  const picked1Id = round1[0].id;

  // 3. emerge round 2
  const round2Res = await f(`${baseUrl}/api/intake/emerge`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      brandContext,
      round: 2,
      pickedVariantId: picked1Id,
      previous: round1,
    }),
  });
  if (!round2Res.ok) return { ok: false, reason: `emerge2 ${round2Res.status}` };
  const { variants: round2 } = (await round2Res.json()) as {
    variants: Array<{
      id: string;
      palette: Record<string, string>;
      fontPair: Record<string, string>;
      label: string;
    }>;
  };
  if (round2.length !== 3) {
    return { ok: false, reason: `emerge2 returned ${round2.length} variants` };
  }
  const finalVariant = round2[0];

  // 4. finalize
  const slug = `smoke-emerge-${Date.now()}`;
  const finalizeRes = await f(`${baseUrl}/api/intake/finalize`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      templateId,
      brandContext,
      finalVariant,
      slug,
    }),
  });
  if (!finalizeRes.ok) {
    return { ok: false, reason: `finalize ${finalizeRes.status}` };
  }
  const { slug: returnedSlug, url } = (await finalizeRes.json()) as {
    slug: string;
    url: string;
  };
  return { ok: true, slug: returnedSlug, url };
}

// ───────── CLI ─────────

function parseArgs(argv: string[]): EmergeSmokeOptions {
  const out: EmergeSmokeOptions = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--base") out.baseUrl = argv[++i];
    else if (a === "--template") out.templateId = argv[++i];
  }
  return out;
}

const isMain =
  typeof process !== "undefined" &&
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;

if (isMain) {
  const opts = parseArgs(process.argv.slice(2));
  runEmergeSmoke(opts).then(
    (r) => {
      if (r.ok) {
        console.log(`smoke ok · slug=${r.slug} · url=${r.url}`);
        process.exit(0);
      } else {
        console.error(`smoke fail · ${r.reason}`);
        process.exit(1);
      }
    },
    (err) => {
      console.error("smoke error ·", err);
      process.exit(1);
    },
  );
}
