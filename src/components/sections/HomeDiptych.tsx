'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import SplashHero from '@/components/SplashHero';

const SPLASH_KEY = 'nertia.splashShown';

export default function HomeDiptych() {
    // Default to true so the splash shows on cold visit. The useEffect below
    // hides it on subsequent same-session navigation.
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        try {
            if (sessionStorage.getItem(SPLASH_KEY)) {
                setShowSplash(false);
            }
        } catch {
            // sessionStorage may be unavailable (private mode etc) — just show splash
        }
    }, []);

    const dismissSplash = () => {
        try {
            sessionStorage.setItem(SPLASH_KEY, '1');
        } catch {
            // ignore
        }
        setShowSplash(false);
    };

    return (
        <>
            {showSplash && <SplashHero onDismiss={dismissSplash} />}
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
        </>
    );
}
