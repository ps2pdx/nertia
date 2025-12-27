import type { Metadata } from "next";
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
  title: "Letter to Vercel",
  description: "A 3D cover letter experience built with React Three Fiber.",
  applicationName: "Letter to Vercel",
  authors: [{ name: "Scott Campbell" }],
  creator: "Scott Campbell",
  keywords: ["Vercel", "React Three Fiber", "three.js", "Next.js", "Cover Letter"],
  openGraph: {
    title: "Letter to Vercel",
    description: "A 3D cover letter experience with space background and lighting.",
    type: "website",
    url: "https://vercel.nertia.ai",
    siteName: "Letter to Vercel",
  },
  twitter: {
    card: "summary",
    title: "Letter to Vercel",
    description: "A 3D cover letter experience with space background and lighting.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
        {children}
      </body>
    </html>
  );
}
