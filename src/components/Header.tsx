'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { getNavMode, getNavItems, type NavItem } from '@/lib/navigation';
import { BrandWordmark } from '@/components/Brand';

export default function Header() {
    const pathname = usePathname();
    const { user, signOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => { setMobileMenuOpen(false); }, [pathname]);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileMenuOpen]);

    // User-generated subdomain sites bring their own chrome.
    if (pathname.startsWith('/hosted/') || pathname.startsWith('/preview/')) {
        return null;
    }

    const mode = getNavMode(pathname, !!user);
    const items: NavItem[] = getNavItems(mode);
    const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

    return (
        <>
            <header className="ds-header">
                <Link href={mode === 'authed' ? '/zero-point' : '/'} className="ds-header__brand" aria-label="nertia home">
                    <BrandWordmark size={16} />
                </Link>

                {/* Desktop nav */}
                {mode !== 'in_tool' && (
                    <nav className="ds-header__nav" aria-label="Primary">
                        {items.map((item) => (
                            <Link
                                key={item.id}
                                href={item.href}
                                className="ds-header__link"
                                data-active={isActive(item.href) ? 'true' : 'false'}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* In-tool: show route as breadcrumb */}
                {mode === 'in_tool' && (
                    <div className="ds-header__crumb" aria-label="Current tool">
                        <span>{pathname.split('/').filter(Boolean).slice(0, 2).join(' / ').toUpperCase()}</span>
                    </div>
                )}

                <div className="ds-header__cta">
                    {user ? (
                        <>
                            {user.photoURL && (
                                <Image
                                    src={user.photoURL}
                                    alt={user.displayName || 'User'}
                                    width={28}
                                    height={28}
                                    className="ds-header__avatar"
                                />
                            )}
                            {mode === 'in_tool' ? (
                                <Link href="/" className="ds-header__btn" aria-label="Exit tool">
                                    EXIT ✕
                                </Link>
                            ) : (
                                <button onClick={signOut} className="ds-header__btn" type="button">
                                    SIGN OUT
                                </button>
                            )}
                        </>
                    ) : (
                        <Link href="/login" className="ds-header__btn" data-tone="accent">
                            LOG IN ↗
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="ds-header__hamburger"
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                    type="button"
                >
                    <span data-line="1" data-open={mobileMenuOpen} />
                    <span data-line="2" data-open={mobileMenuOpen} />
                    <span data-line="3" data-open={mobileMenuOpen} />
                </button>
            </header>

            {/* Mobile drawer */}
            <div className="ds-header__mobile" data-open={mobileMenuOpen}>
                <nav aria-label="Mobile primary">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="ds-header__mobile-link"
                            data-active={isActive(item.href) ? 'true' : 'false'}
                        >
                            <span className="ds-header__mobile-num">0{items.indexOf(item) + 1}</span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="ds-header__mobile-foot">
                    {user ? (
                        <button
                            onClick={() => { signOut(); setMobileMenuOpen(false); }}
                            className="ds-header__btn"
                            type="button"
                        >
                            SIGN OUT
                        </button>
                    ) : (
                        <Link
                            href="/login"
                            onClick={() => setMobileMenuOpen(false)}
                            className="ds-header__btn"
                            data-tone="accent"
                        >
                            LOG IN ↗
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
