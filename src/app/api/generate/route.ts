import { NextResponse } from "next/server";
import { z } from "zod";
import { generate } from "@/lib/generator/pipeline";
import { putSite, slugIsTaken } from "@/lib/siteStore";
import { uniqueSlug, slugify } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BriefSchema = z.object({
  businessName: z.string().min(1).max(100),
  oneLiner: z.string().min(1).max(280),
  audience: z.string().min(1).max(200),
  vibe: z.string().min(1).max(100),
  tone: z.string().min(1).max(100),
  preferredSlug: z.string().optional(),
  email: z.string().email().optional(),
});

const BASE_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = BriefSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;
  const base = slugify(input.preferredSlug ?? input.businessName);
  const slug = await uniqueSlug(base, slugIsTaken);

  const config = await generate({
    slug,
    businessName: input.businessName,
    oneLiner: input.oneLiner,
    audience: input.audience,
    vibe: input.vibe,
    tone: input.tone,
    tier: "free",
    owner: null,
  });

  await putSite(config);

  return NextResponse.json({
    slug,
    url: `https://${slug}.${BASE_DOMAIN}`,
    direction: config.direction,
  });
}
