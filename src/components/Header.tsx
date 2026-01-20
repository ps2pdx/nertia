'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { navItems } from '@/lib/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [showHeader, setShowHeader] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = pathname === '/';

  // Show header only after scrolling past hero section on home page
  useEffect(() => {
    if (!isHome) {
      setShowHeader(true);
      return;
    }

    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setShowHeader(window.scrollY > heroBottom - 100);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActiveItem = (href: string) => pathname === href;

  const shouldShowHeader = !isHome || showHeader;

  return (
    <>
      {/* Header - Desktop and Mobile */}
      {shouldShowHeader && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4 lg:py-6 bg-[var(--background)]/60 backdrop-blur-[36px] border-b border-[var(--card-border)] transition-opacity duration-300 ${
            showHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-light.svg"
              alt="nertia.ai"
              width={40}
              height={26}
              className="hidden dark:block lg:w-[50px] lg:h-[32px]"
            />
            <Image
              src="/logo-dark.svg"
              alt="nertia.ai"
              width={40}
              height={26}
              className="block dark:hidden lg:w-[50px] lg:h-[32px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActiveItem(item.href)
                    ? 'text-[var(--accent)]'
                    : 'text-muted hover:text-[var(--foreground)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Auth Section - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/generator"
                  className="text-sm font-medium text-muted hover:text-[var(--foreground)] transition-colors"
                >
                  Generator
                </Link>
                {user.photoURL && (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <button
                  onClick={signOut}
                  className="text-sm text-muted hover:text-[var(--foreground)] transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 bg-[var(--accent)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-[var(--foreground)] transition-transform duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[var(--foreground)] transition-opacity duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-[var(--foreground)] transition-transform duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </header>
      )}

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-[var(--background)] transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-2xl font-medium transition-colors ${
                isActiveItem(item.href)
                  ? 'text-[var(--accent)]'
                  : 'text-[var(--foreground)] hover:text-[var(--accent)]'
              }`}
            >
              {item.label}
            </Link>
          ))}

          {/* Mobile Auth Section */}
          <div className="mt-4 pt-4 border-t border-[var(--card-border)] flex flex-col items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-muted">{user.displayName || user.email}</span>
                </div>
                <Link
                  href="/generator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xl font-medium text-[var(--accent)]"
                >
                  Generator
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-lg text-muted hover:text-[var(--foreground)] transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-3 bg-[var(--accent)] text-white font-medium text-lg rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
