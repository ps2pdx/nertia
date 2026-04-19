'use client';

import { useState } from 'react';

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: 'What is a brand system?',
        answer: 'A brand system is a comprehensive framework that defines how a brand looks, sounds, and behaves across all touchpoints. Unlike a simple logo or style guide, a brand system includes modular components—typography scales, color tokens, spacing rules, voice guidelines, and UI patterns—that work together to create consistent, scalable brand experiences. Think of it as the operating system for your brand identity.',
    },
    {
        question: 'What is a tokenized design system?',
        answer: 'A tokenized design system uses design tokens—named variables that store visual design decisions like colors, spacing, and typography. Instead of hardcoding #22c55e everywhere, you use --color-accent. This abstraction layer means you can update your entire brand palette by changing a single variable. Tokens bridge design and development, enabling seamless handoffs and automated style updates across platforms.',
    },
    {
        question: 'Why are brand systems important?',
        answer: 'Brand systems eliminate inconsistency, reduce design debt, and accelerate execution. Without a system, every new project starts from scratch—designers reinvent components, developers guess at spacing, and marketing ships off-brand assets. A brand system provides guardrails that maintain quality while enabling speed. For growing companies, it\'s the difference between scaling chaos and scaling excellence.',
    },
    {
        question: 'What\'s the difference between a brand system and a template?',
        answer: 'Templates are rigid, one-size-fits-all solutions. Brand systems are flexible frameworks. A template gives you a pre-made slide deck; a brand system gives you the building blocks to create infinite slide decks that all feel cohesive. Templates break when you need something custom. Systems adapt because they\'re built on principles, not prescriptions.',
    },
    {
        question: 'What is technical product marketing?',
        answer: 'Technical product marketing bridges the gap between engineering and go-to-market. It\'s positioning and messaging for complex products—translating infrastructure capabilities, API features, or developer tools into value propositions that resonate with technical buyers. It requires fluency in both the technology and the business outcomes it enables.',
    },
    {
        question: 'How do brand systems integrate with development workflows?',
        answer: 'Modern brand systems are code-native. Design tokens export to CSS variables, Tailwind configs, or Figma variables. Component libraries ship as npm packages. Style guides live in version-controlled repositories. This integration means brand updates flow directly into production—no more "can you update the hex code in 47 places" requests.',
    },
    {
        question: 'What\'s the ROI of investing in a brand system?',
        answer: 'The ROI compounds over time. Initial investment pays back through: reduced design/dev cycles (teams stop recreating components), faster onboarding (new hires have clear documentation), fewer brand violations (guardrails prevent off-brand work), and increased velocity (decisions are pre-made). Companies with mature design systems report 20-50% faster time-to-market on new initiatives.',
    },
    {
        question: 'Do I need a brand system for my startup?',
        answer: 'If you\'re pre-seed with two founders, probably not—you need customers first. But once you have a team shipping work, brand debt accumulates fast. The earlier you establish foundations, the less painful migration becomes. A lightweight brand system (core tokens, key components, voice guidelines) can scale with you from Series A through IPO.',
    },
    {
        question: 'What\'s included in a typical brand system engagement?',
        answer: 'Engagements typically include: strategic positioning and messaging frameworks, visual identity system (logo, color, typography), design tokens and component specifications, brand voice and tone guidelines, and documentation. Technical engagements may also include Figma libraries, coded component libraries, and CI/CD integration for automated style deployment.',
    },
    {
        question: 'How long does it take to build a brand system?',
        answer: 'Timelines vary by scope. A foundational brand system (identity, tokens, core guidelines) typically takes 6-10 weeks. A comprehensive system with coded components and integration takes 12-16 weeks. Rushed timelines are possible but often create debt you\'ll pay back later. The goal is building something that lasts, not just ships.',
    },
    {
        question: 'What industries do you work with?',
        answer: 'Primary focus areas include AI/ML infrastructure, developer tools, B2B SaaS, and deep tech. These sectors require technical fluency to articulate complex value propositions. That said, brand system principles are universal—the methodology applies whether you\'re selling GPU compute or consumer goods.',
    },
    {
        question: 'Do you work with in-house teams or replace them?',
        answer: 'Complement, never replace. The best engagements are collaborative—I bring specialized brand systems expertise while your team brings institutional knowledge and context. Deliverables include documentation and training so your team can maintain and extend the system independently. The goal is building internal capability, not dependency.',
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="w-full border-t border-[var(--card-border)]">
            {/* Full-width grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12">
                
                {/* Left column - Section label */}
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 pt-24 lg:p-12 lg:pt-24">
                    <div className="lg:sticky lg:top-24">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted">FAQ</span>
                        <h2 className="text-2xl sm:text-3xl font-bold mt-4 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-muted text-sm leading-relaxed">
                            Common questions about brand systems, technical marketing, and working together.
                        </p>
                    </div>
                </div>

                {/* Right column - FAQ items */}
                <div className="lg:col-span-9">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className={`border-b border-[var(--card-border)] ${index === faqs.length - 1 ? 'border-b-0' : ''}`}
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full p-8 lg:p-12 flex items-start justify-between gap-4 text-left group"
                            >
                                <h3 className="text-lg font-semibold group-hover:text-[var(--accent)] transition-colors">
                                    {faq.question}
                                </h3>
                                <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center border border-[var(--card-border)] transition-all ${openIndex === index ? 'border-green-500 rotate-45' : 'group-hover:border-green-500'}`}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                </span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                                <p className="px-8 lg:px-12 pb-8 lg:pb-12 text-muted leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
