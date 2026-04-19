'use client';

export default function MessagingMockup() {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Container */}
            <div className="border border-[var(--card-border)] bg-[var(--background)] p-8">
                {/* Header */}
                <div className="text-xs tracking-[0.2em] uppercase text-muted mb-6">03 Messaging</div>

                {/* Positioning Statement */}
                <div className="mb-8">
                    <div className="mb-4">
                        <div className="text-lg font-bold leading-tight mb-2">
                            We help [audience]
                        </div>
                        <div className="text-lg font-bold leading-tight text-[var(--accent)] mb-2">
                            achieve [outcome]
                        </div>
                        <div className="text-lg font-bold leading-tight">
                            through [method].
                        </div>
                    </div>
                    <div className="text-xs text-muted">Positioning Framework</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Value Props */}
                <div className="mb-8">
                    <div className="space-y-3 mb-4">
                        <div className="flex items-start gap-3">
                            <div className="text-[var(--accent)] text-sm">01</div>
                            <div>
                                <div className="h-2 w-24 bg-[var(--foreground)] mb-1"></div>
                                <div className="h-1.5 w-32 bg-[var(--muted)] opacity-30"></div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-[var(--accent)] text-sm">02</div>
                            <div>
                                <div className="h-2 w-20 bg-[var(--foreground)] mb-1"></div>
                                <div className="h-1.5 w-28 bg-[var(--muted)] opacity-30"></div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="text-[var(--accent)] text-sm">03</div>
                            <div>
                                <div className="h-2 w-28 bg-[var(--foreground)] mb-1"></div>
                                <div className="h-1.5 w-24 bg-[var(--muted)] opacity-30"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Value Propositions</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Voice & Tone */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="text-center p-3 border border-[var(--accent)]">
                            <div className="text-xs text-[var(--accent)]">Direct</div>
                        </div>
                        <div className="text-center p-3 border border-[var(--card-border)]">
                            <div className="text-xs text-muted">Not Fluffy</div>
                        </div>
                        <div className="text-center p-3 border border-[var(--accent)]">
                            <div className="text-xs text-[var(--accent)]">Technical</div>
                        </div>
                        <div className="text-center p-3 border border-[var(--card-border)]">
                            <div className="text-xs text-muted">Not Vague</div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Voice & Tone</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Tagline */}
                <div>
                    <div className="text-center mb-4">
                        <div className="text-xs tracking-[0.2em] uppercase text-muted mb-2">Tagline</div>
                        <div className="text-xl font-bold">&ldquo;Ship it.&rdquo;</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
