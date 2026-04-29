interface MenuItem {
    name: string;
    oneliner: string;
    priceLabel: string;
    anchorTier: string;
}

const ITEMS: MenuItem[] = [
    {
        name: 'Positioning audit',
        oneliner: 'Pin down who you are and what you sell.',
        priceLabel: 'from $1,200',
        anchorTier: 'Particle',
    },
    {
        name: 'Brand system',
        oneliner: 'Logo, palette, type, tokens, guidelines.',
        priceLabel: 'from $2,500',
        anchorTier: 'Particle / Wave',
    },
    {
        name: 'GTM plan',
        oneliner: 'Launch sequence, channels, content calendar.',
        priceLabel: 'from $3,000',
        anchorTier: 'Wave',
    },
    {
        name: 'Content sprint',
        oneliner: 'Two-week burst — blog, video, social.',
        priceLabel: 'from $4,000',
        anchorTier: 'Particle / Wave',
    },
    {
        name: 'Web build',
        oneliner: 'Marketing site or app surface, production-ready.',
        priceLabel: 'from $5,000',
        anchorTier: 'Particle / Wave',
    },
    {
        name: 'Advisory hour',
        oneliner: '1:1 strategy session.',
        priceLabel: '$300/hr',
        anchorTier: 'Particle',
    },
    {
        name: 'Dashboard',
        oneliner: 'KPI / metrics surface, ongoing.',
        priceLabel: 'from $4,500',
        anchorTier: 'Entanglement',
    },
];

export default function ServicesMenu() {
    return (
        <section
            id="quanta"
            className="px-8 lg:px-12 py-16 border-t border-[var(--card-border)]"
        >
            <div className="max-w-3xl mb-12">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
                    Quanta
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                    À la carte.
                </h2>
                <p className="text-muted leading-relaxed">
                    Individual services that anchor a Particle or augment a
                    Wave or Entanglement. Mix and match — we&apos;ll quote
                    accordingly on the call.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {ITEMS.map((item) => (
                    <div
                        key={item.name}
                        className="flex flex-col gap-2 py-5 border-t border-[var(--card-border)]"
                    >
                        <div className="flex items-baseline justify-between gap-4">
                            <h3 className="text-lg font-semibold">
                                {item.name}
                            </h3>
                            <span className="text-sm font-medium text-[var(--foreground)] whitespace-nowrap">
                                {item.priceLabel}
                            </span>
                        </div>
                        <p className="text-sm text-muted leading-relaxed">
                            {item.oneliner}
                        </p>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
                            Anchor: {item.anchorTier}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
