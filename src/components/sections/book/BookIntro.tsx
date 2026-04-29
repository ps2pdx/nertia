interface BookIntroProps {
    eventSlug: string;
}

const COPY: Record<string, { title: string; subtitle: string; bullets: string[] }> = {
    observation: {
        title: 'Book an Observation',
        subtitle: 'A 20-minute intro to figure out where we fit. Free.',
        bullets: [
            'Tell me what you\'re trying to ship.',
            'I\'ll tell you whether a Particle, Wave, or Entanglement is right.',
            'No pitch. If it\'s not a fit, you leave with a clearer plan anyway.',
        ],
    },
    particle: {
        title: 'Initiate a Particle',
        subtitle: '30 minutes to scope a single, fixed-scope deliverable.',
        bullets: [
            'Walk me through the one thing you need built.',
            'I\'ll quote a fixed price and timeline before we end.',
            'You leave the call ready to start (or with a referral elsewhere).',
        ],
    },
    wave: {
        title: 'Initiate a Wave',
        subtitle: '45 minutes to scope a 4–6 week coordinated push.',
        bullets: [
            'Map the multi-deliverable launch you\'re trying to land.',
            'We\'ll define the trajectory, the milestones, and the price.',
            'Statement of work follows within 48 hours of the call.',
        ],
    },
    entanglement: {
        title: 'Initiate an Entanglement',
        subtitle: '45 minutes to scope an embedded production partnership.',
        bullets: [
            'Talk through your ongoing production needs and team shape.',
            'We\'ll define what fractional retainer hours look like for you.',
            'Trial month proposal follows within 48 hours.',
        ],
    },
};

export default function BookIntro({ eventSlug }: BookIntroProps) {
    const copy = COPY[eventSlug] ?? COPY.observation;

    return (
        <section className="px-8 lg:px-12 pt-12 pb-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-4">
                Booking
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                {copy.title}
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8">
                {copy.subtitle}
            </p>
            <ul className="space-y-2">
                {copy.bullets.map((bullet) => (
                    <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm text-muted leading-relaxed"
                    >
                        <span
                            className="mt-1.5 w-1 h-1 rounded-full bg-[var(--accent)] flex-shrink-0"
                            aria-hidden
                        />
                        <span>{bullet}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
