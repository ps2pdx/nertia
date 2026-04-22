// src/app/api/admin/notepad/merge/route.ts
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost, putPost, patchPost } from "@/lib/notepad-admin";
import { concatCompose, mergeTags, type Post } from "@/lib/notepad";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BodySchema = z
  .object({
    sourceIds: z.array(z.string().min(1)).min(2),
    composeMethod: z.enum(["ai", "concat"]),
  })
  .strict();

const COMPOSE_SYSTEM = `You are weaving multiple session-captured drafts into a single cohesive blog post.
Rules:
- Preserve every concrete fact, name, and decision from each source.
- Organize into a natural narrative — use h2 subheadings where the sources shift topic.
- Keep the author's first-person voice, direct and unembellished.
- Return only the final markdown body. No preamble.`;

export async function POST(req: Request): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const raw = await req.json().catch(() => null);
  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) return NextResponse.json({ error: "invalid body" }, { status: 422 });

  const sources = [] as Post[];
  for (const id of parsed.data.sourceIds) {
    const p = await getPost(id);
    if (!p) return NextResponse.json({ error: `source not found: ${id}` }, { status: 404 });
    sources.push(p);
  }

  let body: string;
  let title: string;
  if (parsed.data.composeMethod === "ai") {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const prompt = sources.map((s) => `# ${s.title}\n\n${s.body}`).join("\n\n---\n\n");
    const result = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      system: COMPOSE_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    });
    const block = result.content[0];
    body = block && block.type === "text" ? block.text : "";
    title = sources[0].title;
  } else {
    body = concatCompose(sources);
    title = sources[0].title;
  }

  const now = Date.now();
  const newId = randomUUID();
  const newPost: Post = {
    id: newId,
    title,
    slug: null,
    body,
    excerpt: sources[0].excerpt,
    tags: mergeTags(sources),
    hero: null,
    date: new Date().toISOString().slice(0, 10),
    status: "draft",
    source: "merge",
    source_session_id: null,
    authored: false,
    merged_from: parsed.data.sourceIds,
    merged_into: null,
    cwd: null,
    created_at: now,
    updated_at: now,
    published_at: null,
  };

  await putPost(newPost);
  for (const id of parsed.data.sourceIds) {
    await patchPost(id, { status: "merged", merged_into: newId });
  }

  return NextResponse.json({ post: newPost });
}
