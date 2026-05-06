'use client';

import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';

// SplashHero (the double-slit intro) is intentionally not rendered on
// the production homepage right now. The component still lives at
// src/components/SplashHero.tsx and can be moved into /lab or
// re-introduced here later. See chore/disable-splash-prod for the
// rationale.

export default function HomeDiptych() {
    return (
        <main className="home-root">
            <HeroSlider />

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
