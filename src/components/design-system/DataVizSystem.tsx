'use client';

export default function DataVizSystem() {
    const stats = [
        { value: '10+', label: 'Years Experience' },
        { value: '40+', label: 'Projects Shipped' },
        { value: '3', label: 'Active Clients' },
        { value: '100%', label: 'Direct Access' },
    ];

    const processSteps = [
        { title: 'Understand the story', description: 'Map product architecture, interview buyers, reverse-engineer competitors.' },
        { title: 'Shape the narrative', description: 'Craft positioning framework and messaging strategy.' },
        { title: 'Design the system', description: 'Build modular brand frameworks and visual languages.' },
        { title: 'Ship it', description: 'Architect and build. Website, enablement, components.' },
    ];

    return (
        <section id="data-viz" className="p-8 lg:p-12 border-b border-[var(--card-border)] space-y-12">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Data Visualization</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Patterns for displaying metrics, processes, and structured information with a technical, infographic aesthetic.
                        </p>
                    </div>

                    {/* Stat Cards */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Stat Cards</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="p-6 border border-[var(--card-border)] hover:border-[var(--accent)] transition-colors"
                                >
                                    <div className="text-3xl sm:text-4xl font-bold text-[var(--accent)] mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted">
                            Large accent-colored numbers with muted labels below
                        </p>
                    </div>

                    {/* Numbered Sections */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Numbered Section Labels</h3>
                        <div className="flex gap-8 mb-4">
                            {['01', '02', '03', '04', '05'].map((num) => (
                                <div key={num} className="text-center">
                                    <span className="text-xs tracking-[0.2em] uppercase text-muted">{num}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted mb-4">
                            <code>text-xs tracking-[0.2em] uppercase text-muted</code>
                        </p>
                        <p className="text-sm text-muted">
                            Use zero-padded numbers (01, 02, 03) for section labels to create visual rhythm and hierarchy.
                        </p>
                    </div>

                    {/* Timeline / Process Steps */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Process Timeline</h3>
                        <div className="space-y-0">
                            {processSteps.map((step, index) => (
                                <div
                                    key={index}
                                    className="flex gap-6 p-6 border-t border-[var(--card-border)] group hover:bg-[var(--card-bg)] transition-colors"
                                >
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-12 rounded-full border border-[var(--card-border)] group-hover:border-[var(--accent)] flex items-center justify-center transition-colors">
                                            <span className="text-lg font-bold">{index + 1}</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 pt-2">
                                        <h4 className="font-semibold mb-1">{step.title}</h4>
                                        <p className="text-sm text-muted">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Numbered circles with content to the right, border separators
                        </p>
                    </div>

                    {/* Progress Bars */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Progress Indicators</h3>
                        <div className="space-y-6">
                            {/* Bar Progress */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Project Progress</span>
                                    <span className="text-muted">75%</span>
                                </div>
                                <div className="h-2 bg-[var(--card-bg)] border border-[var(--card-border)]">
                                    <div className="h-full bg-[var(--accent)]" style={{ width: '75%' }}></div>
                                </div>
                            </div>

                            {/* Segmented Progress */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Phase Completion</span>
                                    <span className="text-muted">3 of 4</span>
                                </div>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 h-2 ${i <= 3 ? 'bg-[var(--accent)]' : 'bg-[var(--card-bg)] border border-[var(--card-border)]'}`}
                                        ></div>
                                    ))}
                                </div>
                            </div>

                            {/* Thin Progress */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Capacity</span>
                                    <span className="text-muted">40%</span>
                                </div>
                                <div className="h-1 bg-[var(--card-border)]">
                                    <div className="h-full bg-[var(--accent)]" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comparison Layout */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Comparison Layout</h3>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="p-6 border border-[var(--accent)]">
                                <h4 className="text-lg font-semibold mb-4 text-[var(--accent)]">Do</h4>
                                <ul className="space-y-3 text-sm text-muted">
                                    <li className="flex gap-2">
                                        <span className="text-[var(--accent)]">✓</span>
                                        <span>Direct, confident, no hedging</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[var(--accent)]">✓</span>
                                        <span>Technical specificity</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-[var(--accent)]">✓</span>
                                        <span>Let the work speak</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 border border-red-500/50">
                                <h4 className="text-lg font-semibold mb-4 text-red-400">Don&apos;t</h4>
                                <ul className="space-y-3 text-sm text-muted">
                                    <li className="flex gap-2">
                                        <span className="text-red-400">✗</span>
                                        <span>Corporate fluff</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-red-400">✗</span>
                                        <span>Vague claims</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <span className="text-red-400">✗</span>
                                        <span>Overselling</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Green accent border for positive, red for negative
                        </p>
                    </div>

                    {/* Metric Highlight */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Metric Highlight</h3>
                        <div className="p-8 border border-[var(--card-border)] text-center">
                            <div className="text-6xl sm:text-7xl font-bold text-[var(--accent)] mb-4">
                                $10M+
                            </div>
                            <div className="text-lg text-muted mb-2">Revenue Generated</div>
                            <div className="text-sm text-muted">Across client engagements (2020-2024)</div>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Hero-style metric for emphasis. Use sparingly.
                        </p>
                    </div>

                    {/* Code Block Style */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Code Blocks</h3>
                        <div className="bg-[#0a0a0a] border border-[var(--card-border)] p-6 overflow-x-auto">
                            <pre className="text-sm text-[#ededed]">
                                <code>{`// Design tokens
:root {
  --accent: #22c55e;
  --background: #ffffff;
  --foreground: #171717;
}`}</code>
                            </pre>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Dark background with monospace font for code samples
                        </p>
                    </div>

                    {/* Guidelines */}
                    <div className="p-6 border border-[var(--card-border)]">
                        <h3 className="text-lg font-semibold mb-4">Data Visualization Guidelines</h3>
                        <ul className="space-y-3 text-sm text-muted">
                            <li>• Use the accent color (#22c55e) for primary data points</li>
                            <li>• Keep numbers large and bold for impact</li>
                            <li>• Use muted gray for secondary labels and context</li>
                            <li>• Maintain consistent spacing with the 8px grid</li>
                            <li>• Zero-pad numbers (01, 02) for technical aesthetic</li>
                        </ul>
                    </div>
        </section>
    );
}
