'use client';

import { useEffect, useState } from 'react';
import GridBackground from '@/components/hero-bg/GridBackground';
import TopoBackground from '@/components/hero-bg/TopoBackground';

type SlideId = 'grid' | 'topo';

type Slide = {
    id: SlideId;
    headline: { line1: string; line2: string; line3: string; line3Mark: string };
    Background: React.ComponentType<{ active: boolean }>;
};

const SLIDES: Slide[] = [
    {
        id: 'grid',
        headline: { line1: 'FRAMEWORKS', line2: 'FOR', line3: 'PROPULSION', line3Mark: '.' },
        Background: GridBackground,
    },
    {
        id: 'topo',
        headline: { line1: 'SIGNAL', line2: 'FROM THE', line3: 'VOID', line3Mark: '.' },
        Background: TopoBackground,
    },
];

const SLIDE_DURATION_MS = 12000;

export default function HeroSlider() {
    const [active, setActive] = useState(0);

    useEffect(() => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) return;
        const id = window.setInterval(() => {
            setActive((a) => (a + 1) % SLIDES.length);
        }, SLIDE_DURATION_MS);
        return () => window.clearInterval(id);
    }, []);

    return (
        <section className="hero-slider" aria-label="Featured">
            {SLIDES.map((slide, i) => {
                const isActive = i === active;
                const { Background } = slide;
                return (
                    <article
                        key={slide.id}
                        className={`hero-slide ${isActive ? 'is-active' : ''}`}
                        data-slide={slide.id}
                        aria-hidden={!isActive}
                    >
                        <div className="hero-slide__bg">
                            <Background active={isActive} />
                        </div>
                        <div className="hero-slide__content">
                            <div className="home-hero__eyebrow">
                                <span className="home-hero__bracket">[ SCOTT CAMPBELL ]</span>
                                <span className="home-hero__rule" aria-hidden />
                                <span className="home-hero__role">PMM × AI-GTM × FULL-STACK</span>
                            </div>

                            <h1 className="home-hero__title">
                                {slide.headline.line1}
                                <br />
                                <span className="home-hero__title-muted">{slide.headline.line2} </span>
                                <br />
                                <span className="home-hero__title-mark">
                                    {slide.headline.line3}
                                    <span className="home-hero__title-dot">{slide.headline.line3Mark}</span>
                                </span>
                            </h1>

                            <p className="home-hero__sub">
                                Applied AI GTM pipelines, brand systems, and production code — built in Portland.
                                Two clear paths from here.
                            </p>
                        </div>
                    </article>
                );
            })}

            <div className="hero-slider__dots" aria-hidden>
                {SLIDES.map((slide, i) => (
                    <button
                        key={slide.id}
                        type="button"
                        className={`hero-slider__dot ${i === active ? 'is-active' : ''}`}
                        onClick={() => setActive(i)}
                        aria-label={`Show slide ${i + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
