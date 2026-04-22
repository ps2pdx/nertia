// src/app/api/admin/notepad/[id]/polish/route.ts
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { verifyAdminToken } from "@/lib/auth-admin";
import { getPost } from "@/lib/notepad-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POLISH_SYSTEM = `You are polishing a session-captured draft into a blog post.
Rules:
- Preserve every concrete fact, specific name, and decision in the source.
- Tighten prose; remove filler.
- Keep the author's voice — first-person, direct, no corporate tone.
- Return only the polished markdown body. No preamble, no explanation.`;

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: Request, ctx: Ctx): Promise<Response> {
  const auth = await verifyAdminToken(req);
  if (!auth.ok) return NextResponse.json({ error: auth.message }, { status: auth.status });

  const { id } = await ctx.params;
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "not found" }, { status: 404 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const result = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: POLISH_SYSTEM,
    messages: [{ role: "user", content: `Title: ${post.title}\n\nBody:\n${post.body}` }],
  });
  const block = result.content[0];
  const polished = block && block.type === "text" ? block.text : "";
  return NextResponse.json({ polished });
}
