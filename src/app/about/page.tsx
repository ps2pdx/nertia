export default function AboutPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@nertia.ai";
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[36px] row-start-2 w-full max-w-3xl">
        {/* Concise Hero */}
        <section className="flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Our identity is communicating yours.
          </h1>
          <p className="text-base sm:text-lg text-black/70 dark:text-white/70">
            We build adaptive brand systems that move with culture and scale with ambition.
          </p>
          <div className="pt-1">
            <a
              href={`mailto:${contactEmail}?subject=Start%20my%20brand%E2%80%99s%20evolution`}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 h-12 text-base font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              <span role="img" aria-label="pointing right">👉</span>
              Start your brand’s evolution
            </a>
          </div>
        </section>

        {/* Compact Why */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Why Nertia</h2>
          <ul className="list-disc list-inside text-black/80 dark:text-white/80">
            <li><span className="font-medium">Clear:</span> Every element has purpose.</li>
            <li><span className="font-medium">Adaptive:</span> Designed to flex across contexts.</li>
            <li><span className="font-medium">Enduring:</span> Built to last—and evolve.</li>
          </ul>
        </section>

        {/* Quick CTA */}
        <section className="flex items-start">
          <a
            href={`mailto:${contactEmail}?subject=Start%20a%20Project`}
            className="inline-flex items-center gap-2 rounded-full border border-solid border-black/[.08] dark:border-white/[.145] px-5 h-12 text-base font-medium hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] transition-colors"
          >
            Start a Project →
          </a>
        </section>
      </main>
    </div>
  );
}
