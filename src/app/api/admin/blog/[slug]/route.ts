import { NextResponse } from 'next/server';
import {
  getCandidateBySlug,
  saveCandidate,
  publishCandidate,
  deleteCandidate,
} from '@/lib/blog-candidates';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getCandidateBySlug(slug);
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = getCandidateBySlug(slug);
  if (!post) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const body = await req.json();
  const frontmatter = {
    title: body.title ?? post.title,
    slug: body.slug ?? post.slug,
    date: body.date ?? post.date,
    excerpt: body.excerpt ?? post.excerpt,
    hero: body.hero ?? post.hero,
    tags: body.tags ?? post.tags,
    source: post.source,
    source_session_id: post.source_session_id,
    authored: post.authored,
  };
  saveCandidate(post.filename, frontmatter, body.content ?? post.content);
  return NextResponse.json({ ok: true });
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  // POST = publish (move from candidates → blog)
  const { slug } = await params;
  const result = publishCandidate(slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ ok: true, movedTo: result.movedTo });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const result = deleteCandidate(slug);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
