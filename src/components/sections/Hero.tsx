'use client';

import Image from 'next/image';
import Link from 'next/link';
import WebGLBackground from '@/components/WebGLBackground';

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* WebGL Background */}
      <WebGLBackground />

      {/* Hero Content */}
      <div className="container text-center relative z-10 flex flex-col items-center pt-16">
        {/* Icon logo above headline */}
        <span className="mb-6 block">
          {/* Dark mode icon */}
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
            priority
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

        {/* CTA Link */}
        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-green-500 font-medium text-base tracking-wide hover:text-green-400 transition-colors underline underline-offset-4"
        >
          Begin
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
    </section>
  );
}
