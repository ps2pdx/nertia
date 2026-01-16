'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { navItems } from '@/lib/navigation';

export default function Header() {
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);

  // Check if we're on the home page
  const isHome = pathname === '/';

  // Show header only after scrolling past hero section on home page, always show on other pages
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

    handleScroll(); // Check initial position
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHome, pathname]);

  // Determine if a nav item is active based on current pathname
  const isActiveItem = (href: string) => {
    return pathname === href;
  };

  return (
    <>
      {/* Desktop Header - Unified sticky bar with logo and navigation */}
      {(!isHome || showHeader) && (
        <header
          className={`hidden lg:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-12 py-6 bg-[var(--background)]/60 backdrop-blur-[36px] border-b border-[var(--card-border)] transition-opacity duration-300 ${
            showHeader ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } lg:opacity-100 lg:pointer-events-auto`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* Dark mode logo (white fill) - hidden in light mode */}
            <Image
              src="/logo-light.svg"
              alt="nertia.ai"
              width={50}
              height={32}
              className="hidden dark:block"
              priority
            />
            {/* Light mode logo (black fill) - hidden in dark mode */}
            <Image
              src="/logo-dark.svg"
              alt="nertia.ai"
              width={50}
              height={32}
              className="block dark:hidden"
              priority
            />
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
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
        </header>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--background)]/90 backdrop-blur-lg border-t border-[var(--card-border)]">
        <div className="w-full">
          <div className="grid grid-cols-5">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-center py-4 text-xs font-medium transition-colors border-l border-[var(--card-border)] first:border-l-0 ${
                  isActiveItem(item.href)
                    ? 'text-[var(--accent)]'
                    : 'text-muted hover:text-[var(--foreground)]'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom bg-[var(--background)]/90" />
      </nav>
    </>
  );
}
