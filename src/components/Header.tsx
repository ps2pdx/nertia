'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname();
  const isBattlezone = pathname === '/battlezone';

  // Hide header completely on battlezone page
  if (isBattlezone) {
    return null;
  }

  return (
    <header 
      className="w-full sticky top-0 z-50 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b border-black/[.08] dark:border-white/[.145]"
    >
      <div className="mx-auto max-w-5xl flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="font-semibold tracking-tight text-lg sm:text-xl">
          nertia.ai
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
          <Link className="hover:underline hover:underline-offset-4" href="/">Home</Link>
        </nav>
      </div>
    </header>
  );
}
