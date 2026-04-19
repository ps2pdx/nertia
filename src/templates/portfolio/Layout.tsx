import type { Site } from "@/templates/types";

/**
 * Portfolio — adapted from magicui-portfolio (MIT, Dillion Verma).
 * Personal/creator portfolio layout with hero (name + avatar + description)
 * and an optional about section. Blur-fade motion via CSS.
 *
 * Copy slots:
 * - hero.greeting            (required, e.g. "Hi, I'm")
 * - hero.name                (required)
 * - hero.description         (required)
 * - hero.avatarInitials      (required, 1–3 chars)
 * - about.heading            (optional, defaults to "About")
 * - about.body               (optional — if absent, section omitted)
 */
export function Layout({ site }: { site: Site }) {
  const c = site.copy;
  const aboutHeading = c["about.heading"] ?? "About";
  const aboutBody = c["about.body"];

  return (
    <div
      className="min-h-screen px-6 py-16 md:py-24"
      style={{
        backgroundColor: "#fafafa",
        color: "#111",
        fontFamily:
          "var(--font-geist-sans), ui-sans-serif, system-ui, -apple-system",
      }}
    >
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-14">
        <section className="flex flex-col md:flex-row gap-6 md:gap-2 md:justify-between items-start md:items-center">
          <div
            className="flex flex-col gap-2 order-2 md:order-1 portfolio-blur-fade"
            style={{ animationDelay: "0.04s" }}
          >
            <p className="text-sm md:text-base text-neutral-500">
              {c["hero.greeting"]}
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter">
              {c["hero.name"]}
            </h1>
            {c["hero.description"] && (
              <p className="mt-2 max-w-[600px] text-base md:text-lg text-neutral-600">
                {c["hero.description"]}
              </p>
            )}
          </div>
          <div
            className="order-1 md:order-2 portfolio-blur-fade"
            style={{ animationDelay: "0.04s" }}
          >
            <div
              aria-label="avatar"
              className="size-24 md:size-32 rounded-full flex items-center justify-center text-2xl md:text-3xl font-semibold ring-4 ring-neutral-100 shadow-sm bg-neutral-200"
            >
              {c["hero.avatarInitials"]}
            </div>
          </div>
        </section>
        {aboutBody && (
          <section
            className="flex flex-col gap-4 portfolio-blur-fade"
            style={{ animationDelay: "0.12s" }}
          >
            <h2 className="text-xl font-bold">{aboutHeading}</h2>
            <p className="text-pretty leading-relaxed text-neutral-600 whitespace-pre-line">
              {aboutBody}
            </p>
          </section>
        )}
      </div>
      <style>{`
        @keyframes portfolio-blur-fade {
          0% { opacity: 0; filter: blur(6px); transform: translateY(8px); }
          100% { opacity: 1; filter: blur(0); transform: translateY(0); }
        }
        .portfolio-blur-fade {
          opacity: 0;
          animation: portfolio-blur-fade 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
