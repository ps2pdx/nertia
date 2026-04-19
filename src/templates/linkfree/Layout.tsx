import type { Site } from "@/templates/types";

const MAX_LINKS = 8;

/**
 * linkfree — adapted from EddieJaoudeCommunity/linkfree (BioDrop, MIT).
 * Single-page bio + link list. Centered avatar, name, tagline, optional
 * bio, then a stack of pill-style link buttons.
 *
 * Copy slots:
 * - profile.name             (required)
 * - profile.tagline          (required)
 * - profile.avatarInitials   (required, 1–3 chars)
 * - profile.bio              (optional)
 * - link.{1..8}.label + .href (each pair optional; both required to render)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const bio = c["profile.bio"];

  const links: Array<{ label: string; href: string }> = [];
  for (let i = 1; i <= MAX_LINKS; i++) {
    const label = c[`link.${i}.label`];
    const href = c[`link.${i}.href`];
    if (label && href) links.push({ label, href });
  }

  return (
    <div
      className="min-h-screen flex items-start justify-center px-6 py-16 md:py-24"
      style={{
        backgroundColor: "#0c0d10",
        color: "#f5f5f7",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <div className="w-full max-w-md flex flex-col items-center gap-6 text-center">
        <div
          aria-label="avatar"
          className="size-24 rounded-full flex items-center justify-center text-2xl font-semibold ring-4 ring-white/5"
          style={{ backgroundColor: "#1a1c22", color: "#f5f5f7" }}
        >
          {c["profile.avatarInitials"]}
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">{c["profile.name"]}</h1>
          <p className="text-sm text-neutral-400">{c["profile.tagline"]}</p>
        </div>
        {bio && (
          <p className="text-base leading-relaxed text-neutral-300 max-w-sm">{bio}</p>
        )}
        {links.length > 0 && (
          <ul className="w-full flex flex-col gap-3 mt-2">
            {links.map((link) => (
              <li key={`${link.label}|${link.href}`}>
                <a
                  href={link.href}
                  rel="noreferrer noopener"
                  target="_blank"
                  className="block w-full rounded-xl border px-5 py-3 text-base font-medium transition hover:bg-white/5"
                  style={{ borderColor: "#23262d", color: "#f5f5f7" }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
