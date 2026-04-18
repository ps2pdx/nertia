import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import Script from "next/script";
import Providers from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Nertia — Real Next.js. Real Vercel. Deployed in seconds.",
  description:
    "A wrapper around the modern web stack. Pick an open-source template, we assemble it with your copy and ship it live. Next.js · React · Tailwind · Vercel — nothing proprietary, nothing to configure.",
  keywords: [
    "next.js deployment",
    "vercel templates",
    "react website",
    "open source templates",
    "instant deploy",
    "zero-point",
    "nertia",
  ],
  openGraph: {
    title: "Nertia — Real Next.js. Real Vercel. Deployed in seconds.",
    description:
      "A wrapper around the modern web stack. Pick a template, ship it live. Nothing proprietary, nothing to configure.",
    url: "https://nertia.ai",
    siteName: "Nertia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nertia — Real Next.js. Real Vercel. Deployed in seconds.",
    description:
      "A wrapper around the modern web stack. Pick a template, ship it live. Nothing proprietary, nothing to configure.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-Q8VLPZQSJ1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-Q8VLPZQSJ1');
          `}
        </Script>
      </head>
      <body className={`${geistSans.variable} ${spaceMono.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
