'use client';

import { useState, type FormEvent } from 'react';

interface BookFallbackProps {
    eventSlug: string;
}

type State = 'idle' | 'submitting' | 'success' | 'error';

const PACKAGE_LABELS: Record<string, string> = {
    observation: 'Observation (20-min intro)',
    particle: 'Particle (one-shot)',
    wave: 'Wave (sprint)',
    entanglement: 'Entanglement (ongoing)',
};

export default function BookFallback({ eventSlug }: BookFallbackProps) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [state, setState] = useState<State>('idle');
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (state === 'submitting') return;
        if (!name.trim()) {
            setError('Name is required.');
            setState('error');
            return;
        }
        if (!/.+@.+\..+/.test(email)) {
            setError("That doesn't look like a valid email.");
            setState('error');
            return;
        }
        setState('submitting');
        setError(null);
        try {
            const res = await fetch('/api/book-inquiry', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim(),
                    message: message.trim() || undefined,
                    package: eventSlug,
                }),
            });
            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(data.error ?? 'Something went wrong.');
            }
            setState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setState('error');
        }
    }

    return (
        <section className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]">
            <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-muted mb-4">
                    Calendar not loading?
                </p>
                <h2 className="text-xl sm:text-2xl font-bold mb-4">
                    Send a direct inquiry
                </h2>
                <p className="text-sm text-muted leading-relaxed mb-8">
                    Or email{' '}
                    <a
                        href={`mailto:scott@nertia.ai?subject=${encodeURIComponent(`Booking inquiry — ${PACKAGE_LABELS[eventSlug] ?? eventSlug}`)}`}
                        className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80"
                    >
                        scott@nertia.ai
                    </a>{' '}
                    directly.
                </p>

                {state === 'success' ? (
                    <div className="flex items-center gap-3 text-[var(--accent)]">
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                        <span className="text-sm">
                            Got it. I&apos;ll reach out within a day to schedule.
                        </span>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                if (state === 'error') {
                                    setState('idle');
                                    setError(null);
                                }
                            }}
                            placeholder="Your name"
                            required
                            disabled={state === 'submitting'}
                            aria-label="Your name"
                            className="w-full px-4 py-3 bg-transparent border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-muted focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50"
                        />
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
                            disabled={state === 'submitting'}
                            aria-label="Your email"
                            className="w-full px-4 py-3 bg-transparent border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-muted focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50"
                        />
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={`What you're trying to ship (optional)`}
                            rows={4}
                            disabled={state === 'submitting'}
                            aria-label="What you're trying to ship"
                            className="w-full px-4 py-3 bg-transparent border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-muted focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50 resize-y"
                        />
                        <button
                            type="submit"
                            disabled={state === 'submitting' || !email || !name}
                            className="self-start inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-medium text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                            {state === 'submitting' ? 'Sending…' : 'Send inquiry →'}
                        </button>
                        {state === 'error' && error && (
                            <p
                                role="alert"
                                className="text-sm text-red-600 dark:text-red-300"
                            >
                                {error}
                            </p>
                        )}
                    </form>
                )}
            </div>
        </section>
    );
}
