'use client';

export default function ComponentsMockup() {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Container */}
            <div className="border border-[var(--card-border)] bg-[var(--background)] p-8">
                {/* Header */}
                <div className="text-xs tracking-[0.2em] uppercase text-muted mb-6">02 Components</div>

                {/* Button Components */}
                <div className="mb-8">
                    <div className="flex gap-3 mb-4">
                        {/* Primary Button */}
                        <div className="px-4 py-2 bg-[var(--accent)] text-xs text-white">
                            Primary
                        </div>
                        {/* Secondary Button */}
                        <div className="px-4 py-2 border border-[var(--card-border)] text-xs">
                            Secondary
                        </div>
                        {/* Text Link */}
                        <div className="px-2 py-2 text-xs text-muted">
                            Link →
                        </div>
                    </div>
                    <div className="text-xs text-muted">Buttons</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Card Component */}
                <div className="mb-8">
                    <div className="border border-[var(--card-border)] p-4 mb-4">
                        <div className="flex gap-3 items-start">
                            {/* Icon placeholder */}
                            <div className="w-8 h-8 border border-[var(--card-border)] flex items-center justify-center">
                                <div className="w-3 h-3 bg-[var(--muted)]"></div>
                            </div>
                            <div className="flex-1">
                                <div className="h-2 w-20 bg-[var(--foreground)] mb-2"></div>
                                <div className="h-1.5 w-full bg-[var(--muted)] opacity-30 mb-1"></div>
                                <div className="h-1.5 w-3/4 bg-[var(--muted)] opacity-30"></div>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Cards</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Form Elements */}
                <div className="mb-8">
                    <div className="space-y-3 mb-4">
                        {/* Input */}
                        <div className="border border-[var(--card-border)] px-3 py-2">
                            <div className="text-xs text-muted">Input field...</div>
                        </div>
                        {/* Tags */}
                        <div className="flex gap-2">
                            <div className="px-2 py-1 border border-[var(--card-border)] text-xs text-muted">Tag</div>
                            <div className="px-2 py-1 border border-[var(--card-border)] text-xs text-muted">Tag</div>
                            <div className="px-2 py-1 border border-[var(--accent)] text-xs text-[var(--accent)]">Active</div>
                        </div>
                    </div>
                    <div className="text-xs text-muted">Form Elements</div>
                </div>

                {/* Divider */}
                <div className="border-t border-[var(--card-border)] my-6"></div>

                {/* Navigation */}
                <div>
                    <div className="flex gap-4 mb-4">
                        <div className="text-xs text-[var(--accent)]">Active</div>
                        <div className="text-xs text-muted">Link</div>
                        <div className="text-xs text-muted">Link</div>
                    </div>
                    <div className="text-xs text-muted">Navigation</div>
                </div>
            </div>
        </div>
    );
}
