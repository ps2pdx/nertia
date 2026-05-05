import Link from 'next/link';

interface IntentCard {
    num: string;
    label: string;
    price: string;
    title: string;
    desc: string;
    cta: string;
    href: string;
    hot?: boolean;
}

const CARDS: IntentCard[] = [
    {
        num: '01',
        label: 'CONSULT',
        price: 'FREE · 30M',
        title: 'Scope a build, audit your GTM, unstick a launch.',
        desc: 'A short call to figure out the shape of the work. No pitch — if it\'s not a fit you leave with a clearer plan anyway.',
        cta: 'BOOK CAL ↗',
        href: '/book?event=observation',
        hot: true,
    },
    {
        num: '02',
        label: 'CONTRACT',
        price: '$8 — 25K',
        title: 'Site builds, GTM pipelines, design-system resets.',
        desc: 'Fixed-scope or 4 — 6 week pushes. Particle / Wave / Entanglement scope tiers map to consult outcomes.',
        cta: 'INQUIRE →',
        href: '/book?event=particle',
    },
    {
        num: '03',
        label: 'FULL-TIME',
        price: 'OPEN',
        title: 'PMM lead · AI-GTM specialist.',
        desc: 'Ship product narrative, applied AI pipelines, and brand systems end-to-end. Full stack of marketing under one operator.',
        cta: 'RESUME ↗',
        href: '/resume',
    },
];

export default function ServicesIntentGrid() {
    return (
        <section className="services-intent" aria-label="Engagement tiers">
            <div className="services-intent__head">
                <div className="t-eyebrow">HIRE</div>
                <h1 className="services-intent__title">
                    WORK<br />WITH SCOTT<span style={{ color: 'var(--accent)' }}>.</span>
                </h1>
                <p className="services-intent__sub">
                    Three intents, three speeds. Start with a free consult; commit when the shape is clear.
                </p>
            </div>

            <div className="services-intent__grid">
                {CARDS.map((c) => (
                    <article key={c.num} className="services-intent__card" data-hot={c.hot ? 'true' : 'false'}>
                        <header className="services-intent__card-head">
                            <span className="tag-ds" data-tone={c.hot ? 'accent' : 'ink'}>{c.num} / {c.label}</span>
                            <span className="services-intent__price" data-hot={c.hot ? 'true' : 'false'}>{c.price}</span>
                        </header>
                        <h2 className="services-intent__card-title">{c.title}</h2>
                        <p className="services-intent__card-desc">{c.desc}</p>
                        <Link href={c.href} className="btn-ds" data-tone={c.hot ? 'accent' : 'ghost'}>
                            {c.cta}
                        </Link>
                    </article>
                ))}
            </div>

            <footer className="services-intent__foot">
                <span className="services-intent__foot-bracket">[ RECRUITERS ]</span>
                <span className="services-intent__foot-text">
                    FT inquiries → résumé · loom intro · linkedin
                </span>
                <Link href="/resume" className="btn-ds" data-size="sm" data-tone="ghost">
                    RESUME ↗
                </Link>
            </footer>
        </section>
    );
}
