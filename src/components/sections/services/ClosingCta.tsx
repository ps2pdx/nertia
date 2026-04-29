import Link from 'next/link';

export default function ClosingCta() {
    return (
        <section
            id="observe"
            className="px-8 lg:px-12 py-20 border-t border-[var(--card-border)]"
        >
            <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
                    Observation
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Not sure where you fit?
                </h2>
                <p className="text-muted leading-relaxed mb-8">
                    Book a free 20-minute Observation. Tell me what
                    you&apos;re trying to ship; I&apos;ll tell you whether a
                    Particle, Wave, or Entanglement is right — or refer you
                    elsewhere if it&apos;s not a fit.
                </p>
                <Link
                    href="/book?event=observation"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
                >
                    Book an Observation
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                    </svg>
                </Link>
            </div>
        </section>
    );
}
