'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { BrandWordmark } from '@/components/Brand';

const ButterflyRing = dynamic(() => import('@/components/ButterflyRingParticles'), {
    ssr: false,
    loading: () => (
        <div className="lab-card__loading">
            <span className="t-mono fg-quiet">LOADING · 19,000 PTS</span>
        </div>
    ),
});

interface Experiment {
    id: string;
    name: string;
    note: string;
    hot?: boolean;
    href?: string;
    extHref?: string;
}

const EXPERIMENTS: Experiment[] = [
    { id: '01', name: 'BUTTERFLY RING',  note: 'particle / 3D · 19,000 pts', hot: true },
    { id: '02', name: 'ZERO-POINT FIELD', note: 'shader · void aesthetic'             },
    { id: '03', name: 'TYPE METRICS',     note: 'scale tester'                         },
    { id: '04', name: 'EMERGE TIMING',    note: 'loading rhythm study'                 },
];

export default function LabPage() {
    return (
        <main className="lab-root">
            <div className="lab-topbar">
                <div className="lab-topbar__brand">
                    <BrandWordmark size={14} />
                </div>
                <span className="t-mono fg-quiet">LAB · {EXPERIMENTS.length} EXPERIMENTS · UNSTABLE</span>
            </div>

            <section className="lab-hero">
                <div className="t-eyebrow lab-hero__eyebrow">WORK IN PROGRESS</div>
                <h1 className="lab-hero__title">
                    NOTHING<br />HERE SHIPS<span style={{ color: 'var(--accent)' }}>.</span>
                </h1>
                <p className="lab-hero__sub">
                    Snippets, prototypes, asset starters. Raw material for future builds.
                </p>
            </section>

            <section className="lab-grid">
                {EXPERIMENTS.map((e, i) => (
                    <article key={e.id} className="lab-card" data-hot={e.hot ? 'true' : 'false'}>
                        <div className="lab-card__stage">
                            {i === 0 ? (
                                <ButterflyRing />
                            ) : (
                                <div className="lab-card__placeholder">
                                    <span className="t-mono fg-quiet">{e.name}</span>
                                </div>
                            )}
                        </div>
                        <div className="lab-card__foot">
                            <div className="lab-card__line">
                                <span className="t-mono" data-tone={e.hot ? 'accent' : 'fg'}>{e.id} {e.name}</span>
                                {e.hot && <span className="tag-ds" data-tone="accent">LIVE</span>}
                            </div>
                            <span className="t-mono fg-quiet lab-card__note">{e.note}</span>
                        </div>
                    </article>
                ))}
            </section>

            <section className="lab-foot">
                <span className="t-mono fg-quiet">
                    butterfly originally lived on the homepage. moved here so
                    <Link href="/" className="lab-foot__link"> the home</Link>
                    {' '}can do its actual job.
                </span>
                <Link
                    href="https://particles.casberry.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="t-mono lab-foot__link"
                >
                    BUILT WITH AI PARTICLE SIMULATOR ↗
                </Link>
            </section>
        </main>
    );
}
