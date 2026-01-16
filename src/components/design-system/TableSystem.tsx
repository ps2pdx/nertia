export default function TableSystem() {
    const sampleData = [
        { service: 'Product Positioning', duration: '2-4 weeks', deliverables: 'Messaging framework, value props' },
        { service: 'Brand System', duration: '4-6 weeks', deliverables: 'Identity, tokens, guidelines' },
        { service: 'Web Development', duration: '4-8 weeks', deliverables: 'Production site, CMS' },
        { service: 'GTM Strategy', duration: '2-3 weeks', deliverables: 'Battlecards, one-pagers' },
    ];

    const comparisonData = [
        { feature: 'Technical Positioning', nertia: true, agency: false },
        { feature: 'Design System', nertia: true, agency: true },
        { feature: 'Production Code', nertia: true, agency: false },
        { feature: 'Direct Founder Access', nertia: true, agency: false },
        { feature: 'Scalable Pricing', nertia: true, agency: false },
    ];

    return (
        <section id="tables" className="p-8 lg:p-12 border-b border-[var(--card-border)] space-y-12">
                    <div>
                        <h2 className="text-xl font-bold mb-4">Tables</h2>
                        <p className="text-muted text-sm leading-relaxed mb-8">
                            Table styling patterns for displaying structured data.
                        </p>
                    </div>

                    {/* Basic Table */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Basic Table</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--card-border)]">
                                        <th className="text-left py-3 px-4 font-semibold">Service</th>
                                        <th className="text-left py-3 px-4 font-semibold">Duration</th>
                                        <th className="text-left py-3 px-4 font-semibold">Deliverables</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map((row, i) => (
                                        <tr key={i} className="border-b border-[var(--card-border)]">
                                            <td className="py-3 px-4">{row.service}</td>
                                            <td className="py-3 px-4 text-muted">{row.duration}</td>
                                            <td className="py-3 px-4 text-muted">{row.deliverables}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            <code>border-b border-[var(--card-border)]</code> for row separators
                        </p>
                    </div>

                    {/* Striped Table */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Striped Rows</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                                        <th className="text-left py-3 px-4 font-semibold">Service</th>
                                        <th className="text-left py-3 px-4 font-semibold">Duration</th>
                                        <th className="text-left py-3 px-4 font-semibold">Deliverables</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map((row, i) => (
                                        <tr
                                            key={i}
                                            className={`border-b border-[var(--card-border)] ${i % 2 === 0 ? '' : 'bg-[var(--card-bg)]'}`}
                                        >
                                            <td className="py-3 px-4">{row.service}</td>
                                            <td className="py-3 px-4 text-muted">{row.duration}</td>
                                            <td className="py-3 px-4 text-muted">{row.deliverables}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Alternating <code>bg-[var(--card-bg)]</code> for visual rhythm
                        </p>
                    </div>

                    {/* Hover State Table */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Hover State</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--card-border)]">
                                        <th className="text-left py-3 px-4 font-semibold">Service</th>
                                        <th className="text-left py-3 px-4 font-semibold">Duration</th>
                                        <th className="text-left py-3 px-4 font-semibold">Deliverables</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-[var(--card-border)] hover:bg-[var(--card-bg)] transition-colors cursor-pointer"
                                        >
                                            <td className="py-3 px-4">{row.service}</td>
                                            <td className="py-3 px-4 text-muted">{row.duration}</td>
                                            <td className="py-3 px-4 text-muted">{row.deliverables}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            <code>hover:bg-[var(--card-bg)] transition-colors</code> for interactive rows
                        </p>
                    </div>

                    {/* Comparison Table */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Comparison Table</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--card-border)]">
                                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                                        <th className="text-center py-3 px-4 font-semibold text-[var(--accent)]">Nertia</th>
                                        <th className="text-center py-3 px-4 font-semibold text-muted">Traditional Agency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-[var(--card-border)]">
                                            <td className="py-3 px-4">{row.feature}</td>
                                            <td className="py-3 px-4 text-center">
                                                {row.nertia ? (
                                                    <span className="text-[var(--accent)]">✓</span>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {row.agency ? (
                                                    <span className="text-[var(--foreground)]">✓</span>
                                                ) : (
                                                    <span className="text-muted">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Use <code>text-center</code> for boolean/comparison columns
                        </p>
                    </div>

                    {/* Bordered Table */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6">Bordered Table</h3>
                        <div className="overflow-x-auto border border-[var(--card-border)]">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
                                        <th className="text-left py-3 px-4 font-semibold border-r border-[var(--card-border)]">Service</th>
                                        <th className="text-left py-3 px-4 font-semibold border-r border-[var(--card-border)]">Duration</th>
                                        <th className="text-left py-3 px-4 font-semibold">Deliverables</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sampleData.map((row, i) => (
                                        <tr key={i} className="border-b border-[var(--card-border)] last:border-b-0">
                                            <td className="py-3 px-4 border-r border-[var(--card-border)]">{row.service}</td>
                                            <td className="py-3 px-4 text-muted border-r border-[var(--card-border)]">{row.duration}</td>
                                            <td className="py-3 px-4 text-muted">{row.deliverables}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-xs text-muted mt-4">
                            Full borders with <code>border-r border-[var(--card-border)]</code> on cells
                        </p>
                    </div>

                    {/* Responsive Note */}
                    <div className="p-6 border border-[var(--card-border)]">
                        <h3 className="text-lg font-semibold mb-4">Responsive Tables</h3>
                        <p className="text-sm text-muted leading-relaxed">
                            Wrap tables in <code>overflow-x-auto</code> to enable horizontal scrolling on mobile devices.
                            This preserves table structure while maintaining usability on smaller screens.
                        </p>
                    </div>
        </section>
    );
}
