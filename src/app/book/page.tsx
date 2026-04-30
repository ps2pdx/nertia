import { Suspense } from 'react';
import PageTemplate from '@/components/PageTemplate';
import BookIntro from '@/components/sections/book/BookIntro';
import CalEmbed from '@/components/sections/book/CalEmbed';

const VALID_EVENTS = new Set(['observation', 'particle', 'wave', 'entanglement']);

interface BookPageProps {
    searchParams: Promise<{ event?: string }>;
}

export default async function BookPage({ searchParams }: BookPageProps) {
    const { event } = await searchParams;
    const eventSlug =
        event && VALID_EVENTS.has(event) ? event : 'observation';

    return (
        <PageTemplate>
            <BookIntro eventSlug={eventSlug} />
            <Suspense fallback={null}>
                <CalEmbed eventSlug={eventSlug} />
            </Suspense>
        </PageTemplate>
    );
}
