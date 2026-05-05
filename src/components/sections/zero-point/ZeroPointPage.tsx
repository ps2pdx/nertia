'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { BrandWordmark } from '@/components/Brand';

type State = 'idle' | 'submitting' | 'success' | 'error';

interface ToolEntry {
    num: string;
    name: string;
    note: string;
    href?: string;
    status: 'live' | 'queued';
    accent?: boolean;
}

const TOOLS: ToolEntry[] = [
    { num: '01', name: 'ZERO·POINT GEN',  note: 'sites that emerge from a brief',   status: 'queued', accent: true },
    { num: '02', name: 'DESIGN·SYS GEN',  note: 'industrial token systems',          status: 'live', href: '/design-system' },
    { num: '03', name: 'LAB',             note: 'snippets + WIP',                    status: 'live', href: '/lab' },
    { num: '04', name: 'BRAND VAULT',     note: 'mark · wordmark · color treatments', status: 'queued' },
];

export default function ZeroPointPage() {
    const [email, setEmail] = useState('');
    const [state, setState] = useState<State>('idle');
    const [error, setError] = useState<string | null>(null);
    const [alreadyOnList, setAlreadyOnList] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email || state === 'submitting') return;
        if (!/.+@.+\..+/.test(email)) {
            setError("doesn't parse as email.");
            setState('error');
            return;
        }
        setState('submitting');
        setError(null);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, source: 'zero-point' }),
            });
            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(data.error ?? 'something went wrong.');
            }
            const data = (await res.json()) as { ok: boolean; alreadyOnList?: boolean };
            setAlreadyOnList(Boolean(data.alreadyOnList));
            setState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setState('error');
        }
    }

    const liveCount = TOOLS.filter((t) => t.status === 'live').length;

    return (
        <main className="zp-root">
            <header className="zp-topbar">
                <div className="zp-topbar__brand">
                    <BrandWordmark size={14} />
                </div>
                <span className="t-mono fg-quiet">
                    ZERO·POINT · {liveCount} OF {TOOLS.length} LIVE · {TOOLS.length - liveCount} QUEUED
                </span>
            </header>

            {/* Email prompt — terminal-style, at the top of the page */}
            <section className="zp-prompt" aria-label="Join the launch list">
                <div className="zp-prompt__intro">
                    <span className="zp-prompt__caret" aria-hidden>$</span>
                    <span className="zp-prompt__text">join launch-list</span>
                    <span className="zp-prompt__rule" aria-hidden />
                    <span className="t-mono fg-quiet zp-prompt__meta">email-only · no spam · launch ping</span>
                </div>
                <form onSubmit={handleSubmit} className="zp-prompt__form">
                    <div className="zp-prompt__row">
                        <span className="zp-prompt__caret" aria-hidden>›</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (state === 'error') {
                                    setState('idle');
                                    setError(null);
                                }
                            }}
                            placeholder="you@domain.com"
                            required
                            disabled={state === 'submitting' || state === 'success'}
                            aria-label="Email for launch list"
                            className="zp-prompt__input"
                        />
                        <button
                            type="submit"
                            disabled={state === 'submitting' || state === 'success' || !email}
                            className="zp-prompt__submit"
                        >
                            {state === 'submitting' ? 'TRANSMITTING…' : state === 'success' ? 'ON THE LIST ✓' : 'JOIN ↗'}
                        </button>
                    </div>
                    {state === 'success' && (
                        <p role="status" className="zp-prompt__msg" data-tone="ok">
                            <span className="zp-prompt__caret" aria-hidden>#</span>
                            {alreadyOnList
                                ? 'already on the list. we will email when zero·point ships.'
                                : 'logged. we will email when zero·point ships.'}
                        </p>
                    )}
                    {state === 'error' && error && (
                        <p role="alert" className="zp-prompt__msg" data-tone="err">
                            <span className="zp-prompt__caret" aria-hidden>!</span>
                            {error}
                        </p>
                    )}
                </form>
            </section>

            <section className="zp-hero">
                <div className="t-eyebrow zp-hero__eyebrow">ZERO·POINT · WEBSITE GENERATOR</div>
                <h1 className="zp-hero__title">
                    FREE.<br />HOSTED.<br />A&nbsp;MINUTE<br />AWAY<span style={{ color: 'var(--accent)' }}>.</span>
                </h1>
                <p className="zp-hero__sub">
                    A site emerges from your brief. Hosted at <span className="zp-hero__sub-mark">{'{slug}.nertia.ai'}</span> for free.
                    Upgrade to a custom domain when it earns one.
                </p>
            </section>

            <section className="zp-grid" aria-label="Tools">
                {TOOLS.map((t) => {
                    const cardInner = (
                        <>
                            <div className="zp-card__head">
                                <span className="t-mono zp-card__num">{t.num}</span>
                                <span className="tag-ds" data-tone={t.status === 'live' ? 'success' : t.accent ? 'accent' : undefined}>
                                    {t.status === 'live' ? '● LIVE' : '◌ QUEUED'}
                                </span>
                            </div>
                            <div className="zp-card__body">
                                <div className="zp-card__name">{t.name}</div>
                                <div className="zp-card__note">{t.note}</div>
                            </div>
                            <div className="zp-card__foot">
                                <span className="zp-card__route">
                                    {t.href ? <span>{t.href}</span> : <span className="fg-quiet">{'// not yet'}</span>}
                                </span>
                                <span className="zp-card__arrow" aria-hidden>{t.href ? '↗' : '·'}</span>
                            </div>
                        </>
                    );
                    return t.href ? (
                        <Link key={t.num} href={t.href} className="zp-card" data-status={t.status} data-accent={t.accent ? 'true' : 'false'}>
                            {cardInner}
                        </Link>
                    ) : (
                        <div key={t.num} className="zp-card" data-status={t.status} data-accent={t.accent ? 'true' : 'false'}>
                            {cardInner}
                        </div>
                    );
                })}
            </section>

            <footer className="zp-foot">
                <span className="t-mono fg-quiet">
                    {'// zero·point name from physics — the vacuum state still full of latent potential.'}
                </span>
                <Link href="/design-system" className="t-mono zp-foot__link">
                    PEEK THE DESIGN-SYS GENERATOR ↗
                </Link>
            </footer>
        </main>
    );
}
