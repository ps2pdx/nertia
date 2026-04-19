'use client';

export default function BasicStylesMockup() {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Container */}
            <div className="border border-[var(--card-border)] bg-[var(--background)] p-8">
                {/* Header */}
                <div className="text-xs tracking-[0.2em] uppercase text-muted mb-6">01 Basic Styles</div>

                {/* Logo Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-6 mb-4">
                        {/* Triangle Logo */}
                        <div className="w-16 h-16 flex items-center justify-center">
                            <svg viewBox="0 0 64 64" className="w-full h-full">
                                <polygon
                                    points="32,8 56,56 8,56"
                                    fill="none"
                                    stroke="var(--accent)"
                                    strokeWidth="2"
                                />
                            </svg>
                        </div>
                        {/* Wordmark Placeholder */}
                        <div className="flex-1">
                            <div className="h-3 w-24 bg-[var(--foreground)] mb-2"></div>
                            <div className="h-2 w-16 bg-[var(--muted)] opacity-50"></div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Logo + Wordmark</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Colors Section */}
                <div className="mb-8">
                    <div className="flex gap-3 mb-4">
                        {/* Primary */}
                        <div className="flex-1">
                            <div className="aspect-square bg-[var(--foreground)] mb-2"></div>
                            <div className="text-xs text-muted">Primary</div>
                        </div>
                        {/* Accent */}
                        <div className="flex-1">
                            <div className="aspect-square bg-[var(--accent)] mb-2"></div>
                            <div className="text-xs text-muted">Accent</div>
                        </div>
                        {/* Muted */}
                        <div className="flex-1">
                            <div className="aspect-square bg-[var(--muted)] mb-2"></div>
                            <div className="text-xs text-muted">Muted</div>
                        </div>
                        {/* Background */}
                        <div className="flex-1">
                            <div className="aspect-square bg-[var(--card-bg)] border border-[var(--card-border)] mb-2"></div>
                            <div className="text-xs text-muted">Surface</div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Color Palette</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Typography Section */}
                <div>
                    <div className="space-y-3 mb-4">
                        <div>
                            <div className="text-2xl font-bold leading-none">Aa</div>
                            <div className="text-xs text-muted mt-1">Display</div>
                        </div>
                        <div className="flex gap-6">
                            <div>
                                <div className="text-base leading-none">Aa</div>
                                <div className="text-xs text-muted mt-1">Body</div>
                            </div>
                            <div>
                                <div className="text-xs tracking-[0.15em] uppercase leading-none">LABEL</div>
                                <div className="text-xs text-muted mt-1">Micro</div>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Typography Scale</div>
                </div>
            </div>
        </div>
    );
}
