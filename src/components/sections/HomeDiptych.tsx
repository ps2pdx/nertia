'use client';

import Link from 'next/link';
import DoubleSlitField from '@/components/DoubleSlitField';

export default function HomeDiptych() {
    return (
        <main className="home-root">
            <DoubleSlitField />
            <section className="home-hero">
                <div className="home-hero__eyebrow">
                    <span className="home-hero__bracket">[ SCOTT CAMPBELL ]</span>
                    <span className="home-hero__rule" aria-hidden />
                    <span className="home-hero__role">PMM × AI-GTM × FULL-STACK</span>
                </div>

                <h1 className="home-hero__title">
                    FRAMEWORKS<br />
                    <span className="home-hero__title-muted">FOR </span>
                    <span className="home-hero__title-mark">PROPULSION<span className="home-hero__title-dot">.</span></span>
                </h1>

                <p className="home-hero__sub">
                    Applied AI GTM pipelines, brand systems, and production code — built in Portland.
                    Two clear paths from here.
                </p>
            </section>

            <section className="home-fork" aria-label="Pick a path">
                <Link href="/blog" className="home-fork__card" data-tone="ink">
                    <div className="home-fork__head">
                        <span className="home-fork__num">01 / READ</span>
                        <span className="home-fork__route">/blog ↗</span>
                    </div>
                    <div className="home-fork__title">
                        BLOG &amp;<br />RESOURCES
                    </div>
                    <div className="home-fork__foot">
                        <span>essays · case studies · process</span>
                        <span className="home-fork__arrow" aria-hidden>→</span>
                    </div>
                </Link>

                <Link href="/zero-point" className="home-fork__card" data-tone="accent">
                    <div className="home-fork__head">
                        <span className="home-fork__num">02 / BUILD</span>
                        <span className="home-fork__route">/zero-point ↗</span>
                    </div>
                    <div className="home-fork__title">
                        USE THE<br />TOOLS
                    </div>
                    <div className="home-fork__foot">
                        <span>zero·point · design·sys · lab</span>
                        <span className="home-fork__arrow" aria-hidden>↗</span>
                    </div>
                </Link>
            </section>

        </main>
    );
}
