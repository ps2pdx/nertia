import Link from 'next/link';
import type { QuickLink } from './data';

interface QuickLinksProps {
    links: QuickLink[];
}

export default function QuickLinks({ links }: QuickLinksProps) {
    return (
        <section
            id="links"
            className="px-8 lg:px-12 py-12 border-t border-[var(--card-border)]"
        >
            <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-2">
                    Quick links
                </p>
                <h2 className="text-2xl font-bold">
                    Shortcuts.
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {links.map((link) => (
                    <Link
                        key={link.href + link.title}
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener' : undefined}
                        className="flex flex-col gap-1 p-4 border border-[var(--card-border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                    >
                        <span className="text-sm font-medium">{link.title}</span>
                        {link.note && (
                            <span className="text-xs text-muted leading-relaxed">
                                {link.note}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </section>
    );
}
