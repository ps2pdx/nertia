import Image from 'next/image';
import Link from 'next/link';
import { footerNavItems } from '@/lib/navigation';

export default function Footer() {
    return (
        <footer className="w-full border-t border-[var(--card-border)]">
            {/* Full-width grid layout - 3/9 to match other sections */}
            <div className="grid grid-cols-1 lg:grid-cols-12">

                {/* Left column - Brand */}
                <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[var(--card-border)] p-8 pt-24 lg:p-12 lg:pt-24">
                    <div className="lg:sticky lg:top-24">
                        {/* Wordmark */}
                        <div className="mb-8">
                            <Image
                                src="/wordmark-light.svg"
                                alt="nertia.ai"
                                width={90}
                                height={18}
                                className="hidden dark:block"
                            />
                            <Image
                                src="/wordmark-dark.svg"
                                alt="nertia.ai"
                                width={90}
                                height={18}
                                className="block dark:hidden"
                            />
                        </div>

                        {/* Tagline */}
                        <p className="text-xs tracking-[0.2em] uppercase text-muted">
                            Identity in Motion
                        </p>
                    </div>
                </div>

                {/* Right column - Content */}
                <div className="lg:col-span-9">

                    {/* Navigation row */}
                    <div className="border-b border-[var(--card-border)] p-8 lg:p-12">
                        <span className="text-xs tracking-[0.2em] uppercase text-muted mb-6 block">Navigation</span>
                        <nav className="flex flex-wrap gap-x-12 gap-y-4">
                            {footerNavItems.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="text-sm tracking-wide transition-colors hover:text-muted"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact & Social row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2">
                        {/* Contact */}
                        <div className="border-b sm:border-b-0 sm:border-r border-[var(--card-border)] p-8 lg:p-12">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted mb-6 block">Contact</span>
                            <a
                                href="mailto:ps2pdx@gmail.com"
                                className="text-sm hover:text-muted transition-colors"
                            >
                                ps2pdx@gmail.com
                            </a>
                        </div>

                        {/* Social & Copyright */}
                        <div className="p-8 lg:p-12">
                            <span className="text-xs tracking-[0.2em] uppercase text-muted mb-6 block">Connect</span>
                            <div className="flex items-center justify-between">
                                <a
                                    href="https://linkedin.com/in/scottsuper"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm hover:text-muted transition-colors"
                                >
                                    LinkedIn ↗
                                </a>
                                <span className="text-xs text-muted">© 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
