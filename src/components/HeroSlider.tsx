'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import GridBackground from '@/components/hero-bg/GridBackground';
import TopoBackground from '@/components/hero-bg/TopoBackground';
import EyeBackground from '@/components/hero-bg/EyeBackground';

type SlideId = 'grid' | 'topo' | 'eye';

type Slide = {
    id: SlideId;
    eyebrowBracket: string;
    eyebrowRole: string;
    headline: { line1: string; line2: string; line3: string; line3Mark: string };
    caption: string;
    cta: { label: string; href: string };
    Background: React.ComponentType<{ active: boolean }>;
};

const SLIDES: Slide[] = [
    {
        id: 'grid',
        eyebrowBracket: '[ NERTIA ]',
        eyebrowRole: '10+ YEARS · PMM × AI-GTM × FULL-STACK',
        headline: { line1: 'CAMPBELL,', line2: 'DOUGLAS', line3: 'SCOTT', line3Mark: '.' },
        caption:
            'Applied AI GTM pipelines, brand systems, production code. Built in Portland. Available for senior IC, lead, and contract work.',
        cta: { label: '→ SEE THE RESUME', href: '/resume' },
        Background: GridBackground,
    },
    {
        id: 'topo',
        eyebrowBracket: '[ FREE ENERGY TOOLING ]',
        eyebrowRole: 'WEBSITES & TOKENIZED DESIGN SYSTEMS',
        headline: { line1: 'ZERO-POINT', line2: 'WEB &', line3: 'TOKENS', line3Mark: '.' },
        caption:
            'AI-FREE, AI-generated. Zero API calls, zero token costs at runtime — sites stay free because nothing’s running. Hosted at {slug}.nertia.ai.',
        cta: { label: '→ TRY ZERO-POINT', href: '/zero-point' },
        Background: TopoBackground,
    },
    {
        id: 'eye',
        eyebrowBracket: '[ CAMPBELL, DOUGLAS SCOTT ]',
        eyebrowRole: 'PARTICLE · WAVE · ENTANGLEMENT',
        headline: { line1: 'SYNCHRONIZE', line2: 'THE', line3: 'OBSERVATION', line3Mark: '.' },
        caption:
            'Brand physics for the AI-native era. Zero-point as starting position. Particles of attention, observed into shape.',
        cta: { label: '→ READ THE THESIS', href: '/blog' },
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

    const slide = SLIDES[active];

    return (
        <section className="hero-slider" aria-label="Featured">
            <div className="hero-slider__eyebrow home-hero__eyebrow">
                <FlapText value={slide.eyebrowBracket} className="home-hero__bracket" />
                <span className="home-hero__rule" aria-hidden />
                <FlapText value={slide.eyebrowRole} className="home-hero__role" />
            </div>

            {SLIDES.map((s, i) => {
                const isActive = i === active;
                const { Background } = s;
                return (
                    <article
                        key={s.id}
                        className={`hero-slide ${isActive ? 'is-active' : ''}`}
                        data-slide={s.id}
                        aria-hidden={!isActive}
                    >
                        <div className="hero-slide__bg">
                            <Background active={isActive} />
                        </div>
                        <div className="hero-slide__content">
                            <h1 className="home-hero__title">
                                {s.headline.line1}
                                <br />
                                <span className="home-hero__title-muted">{s.headline.line2} </span>
                                <br />
                                <span className="home-hero__title-mark">
                                    {s.headline.line3}
                                    <span className="home-hero__title-dot">{s.headline.line3Mark}</span>
                                </span>
                            </h1>

                            <p className="home-hero__sub">{s.caption}</p>

                            <Link href={s.cta.href} className="hero-slide__cta">
                                {s.cta.label}
                            </Link>
                        </div>
                    </article>
                );
            })}

            <div className="hero-slider__dots" aria-hidden>
                {SLIDES.map((s, i) => (
                    <button
                        key={s.id}
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
// the line. Used for both the bracket and the role text in the eyebrow,
// so both flip together when the active slide changes.
function FlapText({ value, className = '' }: { value: string; className?: string }) {
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
        <span className={`${className} hero-eyebrow-role-${phase}`}>
            {[...displayed].map((c, i) => (
                <span
                    key={i}
                    className="eyebrow-flap"
                    style={{ animationDelay: `${i * FLIP_STAGGER_MS}ms` }}
                >
                    {c === ' ' ? ' ' : c}
                </span>
            ))}
        </span>
    );
}
