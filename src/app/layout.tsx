import type { Metadata } from "next";
import { Geist, Space_Mono } from "next/font/google";
import Header from "@/components/Header";
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
  title: "Nertia | Brand Systems Studio",
  description: "Technical product marketing and brand systems. Strategy, design, and code—built by Scott Campbell.",
  keywords: ["brand systems", "technical marketing", "web development", "product marketing", "AI infrastructure"],
  authors: [{ name: "Scott Campbell" }],
  openGraph: {
    title: "Nertia — Brand Systems Studio",
    description: "Positioning, identity systems, and production code for companies that refuse to stand still.",
    url: "https://nertia.ai",
    siteName: "Nertia",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nertia — Brand Systems Studio",
    description: "Positioning, identity systems, and production code for companies that refuse to stand still.",
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
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-Q8VLPZQSJ1"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-Q8VLPZQSJ1');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${spaceMono.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
