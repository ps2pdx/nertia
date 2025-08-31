export default function AboutPage() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "info@nertia.ai";
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[48px] row-start-2 w-full max-w-3xl">
        {/* Hero */}
        <section className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Our identity is communicating yours.
          </h1>
          <p className="text-base sm:text-lg text-black/70 dark:text-white/70 leading-relaxed">
            Nertia builds adaptive brand systems — frameworks that flex with culture, scale with ambition, and give your vision momentum.
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${contactEmail}?subject=Start%20my%20brand%E2%80%99s%20evolution`}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 h-12 text-base font-medium hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              <span role="img" aria-label="pointing right">👉</span>
              Start your brand’s evolution
            </a>
          </div>
        </section>

        <div className="select-none text-center text-black/20 dark:text-white/20">⸻</div>

        {/* Why Nertia */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">Why Nertia</h2>
          <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
            The world moves. So should your brand. Most identities are rigid. They break under pressure, or feel dated overnight. We design brands that breathe — systems built to shift, expand, and adapt without losing their essence.
          </p>
          <ul className="list-disc list-inside text-base text-black/80 dark:text-white/80 leading-relaxed">
            <li><span className="font-medium">Clear.</span> Every element has purpose, every detail a reason.</li>
            <li><span className="font-medium">Adaptive.</span> Logos, layouts, and language that flex across platforms and contexts.</li>
            <li><span className="font-medium">Enduring.</span> A foundation strong enough to last, yet fluid enough to evolve.</li>
          </ul>
        </section>

        <div className="select-none text-center text-black/20 dark:text-white/20">⸻</div>

        {/* How We Work */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">How We Work</h2>
          <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
            We think of identity in three layers:
          </p>
          <ul className="list-disc list-inside text-base text-black/80 dark:text-white/80 leading-relaxed">
            <li>
              <span className="font-medium">The Architect (Structure):</span> A modular grid that holds everything together.
            </li>
            <li>
              <span className="font-medium">The Ghost (Mark):</span> An evolving face — a living symbol, always present, always in motion.
            </li>
            <li>
              <span className="font-medium">The Spirit (Signal):</span> Language and visuals that adapt to the moment, amplifying your story.
            </li>
          </ul>
          <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
            Together, they create brands that feel alive.
          </p>
        </section>

        <div className="select-none text-center text-black/20 dark:text-white/20">⸻</div>

        {/* Final CTA */}
        <section className="flex flex-col gap-3 items-start">
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight">Ready to move?</h3>
          <p className="text-base text-black/70 dark:text-white/70 leading-relaxed">
            Let’s design an identity that grows with you.
          </p>
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

