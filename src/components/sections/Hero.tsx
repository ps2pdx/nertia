'use client';

import Image from 'next/image';
import Link from 'next/link';
import ButterflyRingParticles from '@/components/ButterflyRingParticles';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Butterfly Ring Particles Background */}
      <ButterflyRingParticles />

      {/* Hero Content */}
      <div className="container text-center relative z-10 flex flex-col items-center pt-16">
        {/* Icon logo above headline */}
        <span className="mb-6 block">
          {/* Dark mode icon - priority since dark is default */}
          <Image
            src="/logo-light.svg"
            alt="Nertia logo"
            width={64}
            height={64}
            className="mx-auto hidden dark:block"
            priority
          />
          {/* Light mode icon */}
          <Image
            src="/logo-dark.svg"
            alt="Nertia logo"
            width={64}
            height={64}
            className="mx-auto block dark:hidden"
          />
        </span>
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 max-w-3xl">
          Identity in motion.
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-muted mb-10 max-w-2xl leading-relaxed">
          Strategy, design, code. Brand systems built to ship.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--accent)] text-white font-medium text-sm rounded-lg hover:opacity-90 transition-opacity"
          >
            See services
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
          <Link
            href="/book?event=observation"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[var(--accent)] text-[var(--accent)] font-medium text-sm rounded-lg hover:bg-[var(--accent)] hover:text-white transition-colors"
          >
            Book a call
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
