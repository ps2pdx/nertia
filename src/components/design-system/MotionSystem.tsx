'use client';

export default function MotionSystem() {

    const durations = [
        { name: 'Fast', value: 'duration-150', ms: '150ms', use: 'Micro-interactions, tooltips' },
        { name: 'Default', value: 'duration-300', ms: '300ms', use: 'Most transitions, hovers' },
        { name: 'Slow', value: 'duration-500', ms: '500ms', use: 'Page transitions, modals' },
    ];

    const easings = [
        { name: 'Ease Out', value: 'ease-out', use: 'Default for most interactions' },
        { name: 'Ease In Out', value: 'ease-in-out', use: 'Symmetrical animations' },
        { name: 'Linear', value: 'linear', use: 'Progress bars, loading' },
    ];

    return (
        <section id="motion" className="p-8 lg:p-12 border-b border-[var(--card-border)] space-y-12">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Motion System</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Animation guidelines for consistent, purposeful motion across the interface.
                        </p>
                    </div>

                    {/* Duration Scale */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Duration Scale</h3>
                        <div className="space-y-4">
                            {durations.map((d) => (
                                <div
                                    key={d.name}
                                    className="flex items-center gap-4 p-4 border border-[var(--card-border)]"
                                >
                                    <div className="w-24 font-medium">{d.name}</div>
                                    <div className="flex-1">
                                        <code className="text-sm text-muted">{d.value}</code>
                                        <span className="text-sm text-muted ml-2">({d.ms})</span>
                                    </div>
                                    <div className="text-sm text-muted hidden sm:block">{d.use}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Easing Functions */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Easing Functions</h3>
                        <div className="space-y-4">
                            {easings.map((e) => (
                                <div
                                    key={e.name}
                                    className="flex items-center gap-4 p-4 border border-[var(--card-border)]"
                                >
                                    <div className="w-24 font-medium">{e.name}</div>
                                    <div className="flex-1">
                                        <code className="text-sm text-muted">{e.value}</code>
                                    </div>
                                    <div className="text-sm text-muted hidden sm:block">{e.use}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Interactive Demos */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Interactive Demos</h3>
                        <p className="text-sm text-muted mb-6">Hover over the elements below to see animations in action.</p>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {/* Border Color Transition */}
                            <div className="space-y-2">
                                <div className="text-xs tracking-[0.2em] uppercase text-muted">Border Color</div>
                                <div className="p-6 border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors duration-300 cursor-pointer">
                                    <p className="text-sm">Hover me</p>
                                </div>
                                <code className="text-xs text-muted block">hover:border-[var(--accent)] transition-colors duration-300</code>
                            </div>

                            {/* Scale Transform */}
                            <div className="space-y-2">
                                <div className="text-xs tracking-[0.2em] uppercase text-muted">Scale</div>
                                <div className="p-6 border border-[var(--card-border)] hover:scale-[1.02] transition-transform duration-300 cursor-pointer">
                                    <p className="text-sm">Hover me</p>
                                </div>
                                <code className="text-xs text-muted block">hover:scale-[1.02] transition-transform duration-300</code>
                            </div>

                            {/* Lift Effect (translate + shadow) */}
                            <div className="space-y-2">
                                <div className="text-xs tracking-[0.2em] uppercase text-muted">Lift</div>
                                <div className="p-6 border border-[var(--card-border)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer">
                                    <p className="text-sm">Hover me</p>
                                </div>
                                <code className="text-xs text-muted block">hover:-translate-y-1 hover:shadow-lg transition-all</code>
                            </div>

                            {/* Background Fill */}
                            <div className="space-y-2">
                                <div className="text-xs tracking-[0.2em] uppercase text-muted">Background Fill</div>
                                <div className="p-6 border border-[var(--card-border)] hover:bg-[var(--card-bg)] transition-colors duration-300 cursor-pointer">
                                    <p className="text-sm">Hover me</p>
                                </div>
                                <code className="text-xs text-muted block">hover:bg-[var(--card-bg)] transition-colors</code>
                            </div>

                            {/* Text Color */}
                            <div className="space-y-2">
                                <div className="text-xs tracking-[0.2em] uppercase text-muted">Text Color</div>
                                <div className="p-6 border border-[var(--card-border)] cursor-pointer group">
                                    <p className="text-sm text-muted group-hover:text-[var(--accent)] transition-colors duration-300">Hover me</p>
                                </div>
                                <code className="text-xs text-muted block">group-hover:text-[var(--accent)] transition-colors</code>
                            </div>

                            {/* Combined Effect */}
                            <div className="space-y-2">
                                <div className="text-xs tracking-[0.2em] uppercase text-muted">Combined</div>
                                <div className="p-6 border border-[var(--card-border)] hover:border-[var(--accent)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                                    <p className="text-sm group-hover:text-[var(--accent)] transition-colors duration-300">Hover me</p>
                                </div>
                                <code className="text-xs text-muted block">All effects combined</code>
                            </div>
                        </div>
                    </div>

                    {/* Button Animations */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Button Animations</h3>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <button className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-medium text-sm tracking-wide hover:bg-green-400 active:scale-95 transition-all duration-150">
                                Primary Button
                            </button>
                            <button className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--card-border)] font-medium text-sm tracking-wide hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95 transition-all duration-150">
                                Secondary Button
                            </button>
                        </div>
                        <p className="text-sm text-muted">
                            <code>active:scale-95 transition-all duration-150</code> for click feedback
                        </p>
                    </div>

                    {/* Loading Animation */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Loading States</h3>
                        <div className="flex gap-8 items-center">
                            {/* Pulse */}
                            <div className="space-y-2 text-center">
                                <div className="w-12 h-12 rounded-full bg-[var(--accent)] animate-pulse"></div>
                                <code className="text-xs text-muted">animate-pulse</code>
                            </div>

                            {/* Spin */}
                            <div className="space-y-2 text-center">
                                <div className="w-12 h-12 border-2 border-[var(--card-border)] border-t-[var(--accent)] rounded-full animate-spin"></div>
                                <code className="text-xs text-muted">animate-spin</code>
                            </div>

                            {/* Bounce */}
                            <div className="space-y-2 text-center">
                                <div className="w-4 h-4 rounded-full bg-[var(--accent)] animate-bounce"></div>
                                <code className="text-xs text-muted">animate-bounce</code>
                            </div>
                        </div>
                    </div>

                    {/* Guidelines */}
                    <div className="p-6 border border-[var(--card-border)]">
                        <h3 className="text-lg font-semibold mb-4">Motion Guidelines</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <div className="text-xs tracking-[0.2em] uppercase text-[var(--accent)] mb-2">Do</div>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li>• Use motion to provide feedback</li>
                                    <li>• Keep animations under 500ms</li>
                                    <li>• Use ease-out for enter, ease-in for exit</li>
                                    <li>• Respect reduced-motion preferences</li>
                                </ul>
                            </div>
                            <div>
                                <div className="text-xs tracking-[0.2em] uppercase text-red-400 mb-2">Don&apos;t</div>
                                <ul className="space-y-2 text-sm text-muted">
                                    <li>• Animate for decoration only</li>
                                    <li>• Use bouncy/elastic easings</li>
                                    <li>• Delay essential interactions</li>
                                    <li>• Animate large layout shifts</li>
                                </ul>
                            </div>
                        </div>
                    </div>
        </section>
    );
}
