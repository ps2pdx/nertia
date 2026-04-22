import { z } from "zod";

export const STATUSES = ["draft", "ready", "published", "merged", "archived"] as const;
export type Status = (typeof STATUSES)[number];

export const SOURCES = ["notepad-session", "manual", "merge"] as const;
export type Source = (typeof SOURCES)[number];

export const PostSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  slug: z.string().nullable().optional(),
  body: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  hero: z.string().nullable().optional(),
  date: z.string(),
  status: z.enum(STATUSES),
  source: z.enum(SOURCES),
  source_session_id: z.string().nullable().optional(),
  authored: z.boolean(),
  merged_from: z.array(z.string()).nullable().optional(),
  merged_into: z.string().nullable().optional(),
  cwd: z.string().nullable().optional(),
  created_at: z.number(),
  updated_at: z.number(),
  published_at: z.number().nullable().optional(),
});

export type Post = z.infer<typeof PostSchema>;

export function canTransition(from: Status, to: Status): boolean {
  if (from === to) return true;
  if (to === "archived") return true;
  if (from === "merged") return false;
  const graph: Record<Status, Status[]> = {
    draft: ["ready", "published", "merged"],
    ready: ["draft", "published", "merged"],
    published: ["ready", "draft"],
    merged: [],
    archived: ["draft", "ready", "published"],
  };
  return graph[from]?.includes(to) ?? false;
}
