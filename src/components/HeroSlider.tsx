'use client';

import { useEffect, useRef, useState } from 'react';
import GridBackground from '@/components/hero-bg/GridBackground';
import TopoBackground from '@/components/hero-bg/TopoBackground';
import EyeBackground from '@/components/hero-bg/EyeBackground';

type SlideId = 'grid' | 'topo' | 'eye';

type Slide = {
    id: SlideId;
    headline: { line1: string; line2: string; line3: string; line3Mark: string };
    eyebrowRole: string;
    Background: React.ComponentType<{ active: boolean }>;
};

const SLIDES: Slide[] = [
    {
        id: 'grid',
        headline: { line1: 'FRAMEWORKS', line2: 'FOR', line3: 'PROPULSION', line3Mark: '.' },
        eyebrowRole: '10+ YEARS PRODUCT MARKETING EXPERIENCE',
        Background: GridBackground,
    },
    {
        id: 'topo',
        headline: { line1: 'ZERO-POINT', line2: 'WEB &', line3: 'TOKENS', line3Mark: '.' },
        eyebrowRole: 'FULL-STACK · DESIGN SYSTEMS · AI-NATIVE',
        Background: TopoBackground,
    },
    {
        id: 'eye',
        headline: { line1: 'SYNCHRONIZE', line2: 'THE', line3: 'OBSERVATION', line3Mark: '.' },
        eyebrowRole: 'PARTICLE · WAVE · ENTANGLEMENT',
        Background: EyeBackground,
    },
];

const SLIDE_DURATION_MS = 12000;
const FLIP_OUT_MS = 280;
const FLIP_IN_MS = 320;
const FLIP_STAGGER_MS = 12;

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
            <div className="hero-slider__eyebrow home-hero__eyebrow">
                <span className="home-hero__bracket">[ CAMPBELL, DOUGLAS SCOTT ]</span>
                <span className="home-hero__rule" aria-hidden />
                <EyebrowRole value={SLIDES[active].eyebrowRole} />
            </div>

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
                                Applied AI GTM pipelines, brand systems, and production code automation.
                                Designed universally. Built in Portland, OR.
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

type Phase = 'idle' | 'flipping-out' | 'flipping-in';

// Split-flap / solari-board style flip animation. Each character flips
// independently around its horizontal axis with a staggered delay across
// the line, like a mechanical rotary display.
function EyebrowRole({ value }: { value: string }) {
    const [displayed, setDisplayed] = useState(value);
    const [phase, setPhase] = useState<Phase>('idle');
    const timersRef = useRef<number[]>([]);

    useEffect(() => {
        if (value === displayed) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            setDisplayed(value);
            setPhase('idle');
            return;
        }

        timersRef.current.forEach((id) => window.clearTimeout(id));
        timersRef.current = [];

        // Stage 1: flip the existing chars out. Total length includes the
        // last char's stagger delay.
        setPhase('flipping-out');
        const outTotal = FLIP_OUT_MS + Math.max(displayed.length - 1, 0) * FLIP_STAGGER_MS;
        const swapId = window.setTimeout(() => {
            setDisplayed(value);
            setPhase('flipping-in');
            const inTotal = FLIP_IN_MS + Math.max(value.length - 1, 0) * FLIP_STAGGER_MS;
            const settleId = window.setTimeout(() => setPhase('idle'), inTotal);
            timersRef.current.push(settleId);
        }, outTotal);
        timersRef.current.push(swapId);

        return () => {
            timersRef.current.forEach((id) => window.clearTimeout(id));
            timersRef.current = [];
        };
    }, [value, displayed]);

    return (
        <span className={`home-hero__role hero-eyebrow-role-${phase}`}>
            {[...displayed].map((c, i) => (
                <span
                    key={i}
                    className="eyebrow-flap"
                    style={{ animationDelay: `${i * FLIP_STAGGER_MS}ms` }}
                >
                    {c === ' ' ? ' ' : c}
                </span>
            ))}
        </span>
    );
}
