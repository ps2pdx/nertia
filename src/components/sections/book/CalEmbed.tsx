'use client';

import Cal from '@calcom/embed-react';

interface CalEmbedProps {
    eventSlug: string;
}

export default function CalEmbed({ eventSlug }: CalEmbedProps) {
    const username = process.env.NEXT_PUBLIC_CAL_USERNAME;

    if (!username) {
        return null;
    }

    return (
        <section className="px-8 lg:px-12 pb-12">
            <div className="border border-[var(--card-border)] rounded-lg overflow-hidden bg-[var(--card-bg)] max-w-4xl mx-auto">
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
