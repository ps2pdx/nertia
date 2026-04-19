import { NextResponse } from "next/server";
import { z } from "zod";
import { putSite, slugIsTaken } from "@/lib/siteStore";
import { getTemplate } from "@/templates";
import { slugify, uniqueSlug } from "@/lib/slug";
import type { Site } from "@/templates/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";

const BodySchema = z.object({
  templateId: z.string().min(1),
  copy: z.record(z.string(), z.string()),
  slug: z.string().optional(),
});

export async function POST(req: Request): Promise<Response> {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const parsed = BodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { templateId, copy, slug: requestedSlug } = parsed.data;

  if (!getTemplate(templateId)) {
    return NextResponse.json({ error: `template not found: ${templateId}` }, { status: 400 });
  }

  let slug: string;
  if (requestedSlug) {
    slug = slugify(requestedSlug);
    if (await slugIsTaken(slug)) {
      return NextResponse.json({ error: "slug taken" }, { status: 409 });
    }
  } else {
    try {
      slug = await uniqueSlug(templateId, slugIsTaken);
    } catch {
      return NextResponse.json({ error: "could not allocate slug" }, { status: 409 });
    }
  }

  const site: Site = { slug, templateId, copy };
  await putSite(site);

  return NextResponse.json({
    slug,
    url: `https://${slug}.${BASE_DOMAIN}`,
  });
}
