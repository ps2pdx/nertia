'use client';

import Cal from '@calcom/embed-react';

interface CalEmbedProps {
    eventSlug: string;
}

export default function CalEmbed({ eventSlug }: CalEmbedProps) {
    const username = process.env.NEXT_PUBLIC_CAL_USERNAME;

    if (!username) {
        return (
            <section className="px-8 lg:px-12 py-12">
                <div className="border border-[var(--card-border)] bg-[var(--card-bg)] p-6 rounded-lg max-w-2xl">
                    <p className="text-sm text-muted leading-relaxed">
                        Booking calendar isn&apos;t configured yet. Use the inquiry form below
                        and I&apos;ll reach out to schedule directly.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="px-8 lg:px-12 pb-12">
            <div className="border border-[var(--card-border)] rounded-lg overflow-hidden bg-[var(--card-bg)]">
                <Cal
                    calLink={`${username}/${eventSlug}`}
                    style={{ width: '100%', height: '700px', minHeight: '600px' }}
                    config={{
                        layout: 'month_view',
                        theme: 'auto',
                    }}
                />
            </div>
        </section>
    );
}
