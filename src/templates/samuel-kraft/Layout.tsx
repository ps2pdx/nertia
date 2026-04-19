import type { Site } from "@/templates/types";

const MAX_PROJECTS = 3;

type Project = { time?: string; title: string; description?: string };

function readProjects(copy: Record<string, string>): Project[] {
  const out: Project[] = [];
  for (let i = 1; i <= MAX_PROJECTS; i++) {
    const title = copy[`work.${i}.title`];
    if (!title) continue;
    out.push({
      title,
      time: copy[`work.${i}.time`],
      description: copy[`work.${i}.description`],
    });
  }
  return out;
}

/**
 * samuel-kraft — adapted from samuelkraft/samuelkraft-next (MIT, Samuel Kraft).
 * Motion-forward personal/portfolio: large name + tagline hero, then
 * a Selected Work list with time-stamped project rows. Each section
 * fades + slides in via a staggered CSS animation (--index custom prop).
 *
 * Distinct motion language from magicui-portfolio's blur-fade.
 *
 * Copy slots:
 * - hero.name              (required)
 * - hero.tagline           (required)
 * - work.heading           (optional, defaults to "Selected work")
 * - work.{1..3}.title      (each optional; project hidden if title absent)
 * - work.{1..3}.time       (optional)
 * - work.{1..3}.description (optional)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const workHeading = c["work.heading"] ?? "Selected work";
  const projects = readProjects(c);

  return (
    <div
      className="min-h-screen px-6 py-16 md:py-24"
      style={{
        backgroundColor: "#0c0c0d",
        color: "#fafafa",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-20 md:gap-28">
        <section className="flex flex-col gap-2 sk-stagger" style={{ ["--index" as string]: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{c["hero.name"]}</h1>
          <p className="text-lg text-neutral-400">{c["hero.tagline"]}</p>
        </section>

        {projects.length > 0 && (
          <section
            className="flex flex-col gap-6 sk-stagger"
            style={{ ["--index" as string]: 1 }}
          >
            <h2 className="text-xl md:text-2xl font-semibold">{workHeading}</h2>
            <ul className="flex flex-col gap-12">
              {projects.map((p, i) => (
                <li key={i} className="flex flex-col gap-1">
                  {p.time && (
                    <span className="text-sm text-neutral-500">{p.time}</span>
                  )}
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  {p.description && (
                    <p className="text-base text-neutral-400">{p.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <style>{`
        @keyframes sk-fade-up {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .sk-stagger {
          opacity: 0;
          animation: sk-fade-up 0.5s ease-out forwards;
          animation-delay: calc(var(--index, 0) * 0.12s);
        }
      `}</style>
    </div>
  );
}
