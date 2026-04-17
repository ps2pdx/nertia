import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CANDIDATES_DIR = path.join(process.cwd(), 'src/content/blog-candidates');
const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface CandidatePost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  hero?: string;
  content: string;
  source?: string;
  source_session_id?: string;
  authored?: boolean;
  filename: string;
}

function readPost(filePath: string): CandidatePost | null {
  try {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(raw);
    if (!data.title) return null;
    const filename = path.basename(filePath);
    return {
      slug: data.slug || filename.replace(/\.md$/, ''),
      title: data.title,
      date: data.date || '',
      excerpt: data.excerpt || '',
      tags: data.tags || [],
      hero: data.hero,
      content,
      source: data.source,
      source_session_id: data.source_session_id,
      authored: data.authored,
      filename,
    };
  } catch {
    return null;
  }
}

export function getAllCandidates(): CandidatePost[] {
  if (!fs.existsSync(CANDIDATES_DIR)) return [];
  const files = fs
    .readdirSync(CANDIDATES_DIR)
    .filter((f) => f.endsWith('.md'));
  const posts = files
    .map((f) => readPost(path.join(CANDIDATES_DIR, f)))
    .filter((p): p is CandidatePost => p !== null);
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCandidateBySlug(slug: string): CandidatePost | null {
  return (
    getAllCandidates().find(
      (p) => p.slug === slug || p.filename === `${slug}.md`
    ) ?? null
  );
}

export function saveCandidate(
  filename: string,
  frontmatter: Record<string, unknown>,
  content: string
): void {
  if (!fs.existsSync(CANDIDATES_DIR)) {
    fs.mkdirSync(CANDIDATES_DIR, { recursive: true });
  }
  const file = matter.stringify(content, frontmatter);
  fs.writeFileSync(path.join(CANDIDATES_DIR, filename), file, 'utf-8');
}

export function publishCandidate(slug: string): { ok: boolean; movedTo?: string; error?: string } {
  const post = getCandidateBySlug(slug);
  if (!post) return { ok: false, error: 'candidate not found' };
  if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });
  const target = path.join(BLOG_DIR, `${post.slug}.md`);
  if (fs.existsSync(target)) {
    return { ok: false, error: `target already exists in blog/: ${post.slug}.md` };
  }
  const src = path.join(CANDIDATES_DIR, post.filename);
  fs.renameSync(src, target);
  return { ok: true, movedTo: target };
}

export function deleteCandidate(slug: string): { ok: boolean; error?: string } {
  const post = getCandidateBySlug(slug);
  if (!post) return { ok: false, error: 'candidate not found' };
  fs.unlinkSync(path.join(CANDIDATES_DIR, post.filename));
  return { ok: true };
}
