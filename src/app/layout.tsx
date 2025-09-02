import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "nertia",
  description: "nertia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full sticky top-0 z-50 bg-background/80 supports-[backdrop-filter]:bg-background/60 backdrop-blur border-b border-black/[.08] dark:border-white/[.145]">
          <div className="mx-auto max-w-5xl flex items-center justify-between p-4 sm:p-6">
            <Link href="/" className="font-semibold tracking-tight text-lg sm:text-xl">
              nertia
            </Link>
            <nav className="flex items-center gap-4 sm:gap-6 text-sm sm:text-base">
              <Link className="hover:underline hover:underline-offset-4" href="/">Home</Link>
              <Link className="hover:underline hover:underline-offset-4" href="/about">About</Link>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
