import { ReactNode } from 'react';

interface PageSectionProps {
    id: string;
    label: string;
    title: string;
    description?: string;
    children: ReactNode;
    minHeight?: string;
}

export default function PageSection({
    id,
    label,
    title,
    description,
    children,
    minHeight = 'min-h-[90vh]'
}: PageSectionProps) {
    return (
        <section id={id} className={`w-full border-t border-[var(--card-border)] ${minHeight}`}>
            <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Left column - Section label */}
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 lg:p-12">
                    <div className="lg:sticky lg:top-24">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted">{label}</span>
                        <h2 className="text-xl font-bold mt-2 mb-4">{title}</h2>
                        {description && (
                            <p className="text-muted text-sm leading-relaxed">{description}</p>
                        )}
                    </div>
                </div>

                {/* Right column - Content */}
                <div className="lg:col-span-9 p-8 lg:p-12">
                    {children}
                </div>
            </div>
        </section>
    );
}
