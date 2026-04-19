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
  title: "Nertia — A zero-point website generator",
  description: "Brief in, website out. Free, hosted, live in under a minute.",
  keywords: ["ai website generator", "website builder", "zero-point", "free website", "instant website"],
  openGraph: {
    title: "Nertia — A zero-point website generator",
    description: "Brief in, website out. Free, hosted, live in under a minute.",
    url: "https://nertia.ai",
    siteName: "Nertia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nertia — A zero-point website generator",
    description: "Brief in, website out. Free, hosted, live in under a minute.",
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
