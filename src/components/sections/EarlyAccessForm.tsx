'use client';

import { useState, type FormEvent } from 'react';

interface EarlyAccessFormProps {
    source?: string;
}

type State = 'idle' | 'submitting' | 'success' | 'error';

export default function EarlyAccessForm({ source = 'zero-point' }: EarlyAccessFormProps) {
    const [email, setEmail] = useState('');
    const [state, setState] = useState<State>('idle');
    const [error, setError] = useState<string | null>(null);
    const [alreadyOnList, setAlreadyOnList] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!email || state === 'submitting') return;
        if (!/.+@.+\..+/.test(email)) {
            setError("That doesn't look like a valid email.");
            setState('error');
            return;
        }
        setState('submitting');
        setError(null);
        try {
            const res = await fetch('/api/waitlist', {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email, source }),
            });
            if (!res.ok) {
                const data = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(data.error ?? 'Something went wrong.');
            }
            const data = (await res.json()) as { ok: boolean; alreadyOnList?: boolean };
            setAlreadyOnList(Boolean(data.alreadyOnList));
            setState('success');
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setState('error');
        }
    }

    if (state === 'success') {
        return (
            <div className="flex items-center justify-center gap-3 text-[var(--accent)]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm">
                    {alreadyOnList
                        ? "You're already on the list — we'll email when it launches."
                        : "You're on the list. We'll email when it launches."}
                </span>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3 justify-center">
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
                    aria-label="Email for early access"
                    className="w-full md:w-80 px-4 py-3 bg-transparent border border-[var(--card-border)] text-[var(--foreground)] placeholder:text-muted focus:border-[var(--accent)] focus:outline-none transition-colors disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={state === 'submitting' || !email}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-medium text-sm tracking-wide hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                    {state === 'submitting' ? 'sending…' : 'Get early access →'}
                </button>
            </div>
            {state === 'error' && error && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-300 text-center">
                    {error}
                </p>
            )}
        </form>
    );
}
