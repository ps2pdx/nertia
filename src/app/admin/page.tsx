"use client";
import Link from "next/link";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/lib/auth-context";
import { isAdminEmail } from "@/lib/admin";

type Tool = {
  title: string;
  href: string;
  description: string;
  status: "current" | "legacy";
};

const TOOLS: Tool[] = [
  {
    title: "Notepad",
    href: "/admin/notepad",
    description: "Review, edit, merge, and publish session drafts from RTDB. Mobile-friendly.",
    status: "current",
  },
  {
    title: "Zero-point generator",
    href: "/admin/zero-point",
    description: "Intake + template picker for the main nertia.ai product.",
    status: "current",
  },
  {
    title: "Blog (file-based)",
    href: "/admin/blog",
    description: "Retired — posts now live in RTDB under /admin/notepad. Kept for reference.",
    status: "legacy",
  },
  {
    title: "Generations",
    href: "/admin/generations",
    description: "Pre-pivot brand-system output browser. Scheduled for deletion.",
    status: "legacy",
  },
  {
    title: "Golden examples",
    href: "/admin/golden-examples",
    description: "Pre-pivot curated brand examples. Scheduled for deletion.",
    status: "legacy",
  },
];

export default function AdminHubPage() {
  return (
    <AuthGuard>
      <Inner />
    </AuthGuard>
  );
}

function Inner() {
  const { user } = useAuth();

  if (!isAdminEmail(user?.email)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-sm text-muted">
          Signed in as <code>{user?.email}</code>. Not authorized.
        </p>
      </div>
    );
  }

  const current = TOOLS.filter((t) => t.status === "current");
  const legacy = TOOLS.filter((t) => t.status === "legacy");

  return (
    <main className="min-h-screen max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-xl font-bold">Admin</h1>
        <p className="text-sm text-muted mt-1">{user?.email}</p>
      </header>

      <section className="mb-10">
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Current tools</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {current.map((t) => (
            <ToolCard key={t.href} tool={t} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[10px] uppercase tracking-[0.2em] text-muted mb-3">Legacy (retiring)</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {legacy.map((t) => (
            <ToolCard key={t.href} tool={t} />
          ))}
        </div>
      </section>
    </main>
  );
}

function ToolCard({ tool }: { tool: Tool }) {
  const isLegacy = tool.status === "legacy";
  return (
    <Link
      href={tool.href}
      className={`block p-4 border transition-colors ${
        isLegacy
          ? "border-[var(--card-border)] opacity-60 hover:opacity-100 hover:border-[var(--foreground)]"
          : "border-[var(--card-border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-base">{tool.title}</h3>
        {isLegacy && (
          <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 border border-[var(--card-border)] text-muted">
            legacy
          </span>
        )}
      </div>
      <p className="text-sm text-muted mt-2 leading-relaxed">{tool.description}</p>
    </Link>
  );
}
