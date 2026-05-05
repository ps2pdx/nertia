'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
    cmd: string;
}

const faqs: FAQItem[] = [
    {
        cmd: 'brand-system',
        question: 'What is a brand system?',
        answer: 'A comprehensive framework — typography, color tokens, spacing, voice, UI patterns — that defines how a brand looks, sounds, and behaves across every touchpoint. Operating system for identity, not a logo file.',
    },
    {
        cmd: 'tokens',
        question: 'What is a tokenized design system?',
        answer: 'Named variables (e.g. --color-accent) instead of hard-coded values. Update one variable, every surface follows. The abstraction layer between design decisions and rendered code.',
    },
    {
        cmd: 'why',
        question: 'Why are brand systems important?',
        answer: 'Eliminate inconsistency, kill design debt, accelerate execution. Without a system, every project restarts from zero. With one, decisions compound — speed and quality stop trading off.',
    },
    {
        cmd: 'system-vs-template',
        question: 'System vs template?',
        answer: 'Templates are rigid; systems are flexible. A template hands you a slide deck. A system hands you the building blocks for infinite decks that all feel cohesive.',
    },
    {
        cmd: 'tpmm',
        question: 'What is technical product marketing?',
        answer: 'Positioning and messaging for complex products — translating infrastructure capabilities, APIs, and developer tooling into value props that read true to technical buyers. Fluency in tech AND business outcomes.',
    },
    {
        cmd: 'integration',
        question: 'How do brand systems integrate with dev workflows?',
        answer: 'Tokens export to CSS vars, Tailwind configs, Figma variables. Components ship as npm packages. Style guides live in version-controlled repos. Brand updates flow into production — no more 47-place hex hunts.',
    },
    {
        cmd: 'roi',
        question: 'What is the ROI?',
        answer: 'Compounds over time. Reduced design/dev cycles, faster onboarding, fewer brand violations, increased velocity. Mature systems report 20–50% faster time-to-market on new initiatives.',
    },
    {
        cmd: 'startup',
        question: 'Do startups need this?',
        answer: 'Pre-seed with two founders? Get customers first. But once a team is shipping, brand debt accumulates fast. A lightweight system (core tokens, key components, voice) scales from Series A through IPO.',
    },
    {
        cmd: 'engagement',
        question: 'What is in a typical engagement?',
        answer: 'Strategic positioning, visual identity, design tokens, component specs, voice guidelines, documentation. Technical engagements add Figma libraries, coded component libraries, CI/CD integration for automated style deploys.',
    },
    {
        cmd: 'timeline',
        question: 'How long does it take?',
        answer: 'Foundational system (identity + tokens + guidelines): 6–10 weeks. Comprehensive system with coded components and integration: 12–16 weeks. Rushed builds create debt you pay back later.',
    },
    {
        cmd: 'industries',
        question: 'Which industries?',
        answer: 'AI/ML infrastructure, developer tools, B2B SaaS, deep tech. These need technical fluency to articulate complex value. The methodology applies broadly though — GPU compute or consumer goods.',
    },
    {
        cmd: 'in-house',
        question: 'In-house teams: replace or complement?',
        answer: 'Complement, never replace. I bring specialized brand-systems expertise; your team brings institutional knowledge. Deliverables include training and docs so your team owns and extends the system.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <main className="faq-root">
            <header className="faq-topbar">
                <div className="faq-topbar__crumbs">
                    <span>n.[ertia]</span>
                    <span>faq</span>
                    <span>v1</span>
                </div>
                <span className="faq-topbar__status">
                    <span className="faq-topbar__pulse" aria-hidden /> SHELL · LIVE
                </span>
            </header>

            <section className="faq-shell">
                <pre className="faq-prelude">
                    <span className="faq-prelude__line"><span className="faq-prelude__muted">$</span> welcome to <span className="faq-prelude__bright">n.[ertia]</span></span>
                    <span className="faq-prelude__line faq-prelude__muted"># a framework for ai-assisted gtm.</span>
                    <span className="faq-prelude__line"><span className="faq-prelude__muted">$</span> man frequently-asked</span>
                    <span className="faq-prelude__line faq-prelude__muted"># {faqs.length} entries · click any prompt to expand</span>
                </pre>

                <ol className="faq-list" role="list">
                    {faqs.map((faq, i) => {
                        const open = openIndex === i;
                        return (
                            <li key={faq.cmd} className="faq-row" data-open={open ? 'true' : 'false'}>
                                <button
                                    type="button"
                                    className="faq-row__prompt"
                                    aria-expanded={open}
                                    onClick={() => setOpenIndex(open ? null : i)}
                                >
                                    <span className="faq-row__chevron" aria-hidden>{open ? '▾' : '▸'}</span>
                                    <span className="faq-row__cmd">$ ask <span className="faq-row__cmd-name">{faq.cmd}</span></span>
                                    <span className="faq-row__q">— {faq.question}</span>
                                </button>
                                {open && (
                                    <div className="faq-row__output">
                                        <span className="faq-row__output-prefix" aria-hidden>#</span>
                                        <p>{faq.answer}</p>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </section>

            <footer className="faq-foot">
                <span className="faq-foot__cursor" aria-hidden>▌</span>
                <span className="faq-foot__line">$ still have questions —</span>
                <a href="/book?event=observation" className="faq-foot__cta">BOOK A 30-MIN CONSULT ↗</a>
            </footer>
        </main>
    );
}
