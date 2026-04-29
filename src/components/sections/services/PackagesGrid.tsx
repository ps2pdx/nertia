import PackageCard, { type PackageCardProps } from './PackageCard';

const PACKAGES: PackageCardProps[] = [
    {
        name: 'Particle',
        price: '$2,500',
        audience: 'I need one specific thing built well.',
        timeline: '1–2 weeks',
        deliverables: [
            'Pick one: site, brand, video reel, content sprint, GTM plan, dashboard, or advisory pack',
            'Fixed scope, fixed price, fixed timeline',
            'One discovery call, one delivery call',
            'Own deliverable outright on completion',
        ],
        eventSlug: 'particle',
        ctaLabel: 'Initiate Particle',
    },
    {
        name: 'Wave',
        price: '$10,000',
        audience: 'We need to ship a coordinated launch in 6 weeks.',
        timeline: '4–6 weeks',
        deliverables: [
            'Multi-deliverable bundle (e.g. brand + site + launch content)',
            'Weekly check-ins through the burn',
            'Defined milestones, locked trajectory',
            'SOW within 48 hours of the scoping call',
        ],
        eventSlug: 'wave',
        ctaLabel: 'Initiate Wave',
        accentTone: 'highlight',
    },
    {
        name: 'Entanglement',
        price: '$6,000/mo',
        audience: 'Be our embedded studio.',
        timeline: 'Ongoing',
        deliverables: [
            'Fractional production engineer, embedded with your team',
            'Web, brand, content, and motion delivered as one engine',
            'Monthly retainer hours; rolling roadmap',
            '3-month minimum, then month-to-month',
        ],
        eventSlug: 'entanglement',
        ctaLabel: 'Initiate Entanglement',
    },
];

export default function PackagesGrid() {
    return (
        <section
            id="packages"
            className="px-8 lg:px-12 py-16 border-t border-[var(--card-border)]"
        >
            <div className="max-w-3xl mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
                    Packages
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    Three modes of production.
                </h2>
                <p className="text-muted leading-relaxed">
                    Tier names borrowed from quantum mechanics — each describes
                    a different scale of energetic event. Pick the one that
                    matches the work.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PACKAGES.map((pkg) => (
                    <PackageCard key={pkg.eventSlug} {...pkg} />
                ))}
            </div>
        </section>
    );
}
