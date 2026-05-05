import type { Metadata } from "next";
import { Archivo, Geist, Space_Mono } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

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

const APEX_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";
const RESERVED_SUBDOMAINS = new Set(["www", "api", "admin", "app", "mail", "blog"]);

/**
 * Detects whether the current request is for a user-generated hosted site
 * (e.g. `scott.nertia.ai`). These sites go through middleware rewrites to
 * /hosted/{slug} server-side, but the browser URL stays on the subdomain,
 * so client-side usePathname() can't see the rewrite — we must check the
 * Host header here. This also covers local dev on `{slug}.localhost:3000`.
 */
function isHostedSubdomain(host: string): boolean {
  const hostname = host.toLowerCase().split(":")[0];
  if (!hostname) return false;

  if (hostname === APEX_DOMAIN || hostname === "localhost") return false;

  if (hostname.endsWith(`.${APEX_DOMAIN}`)) {
    const slug = hostname.slice(0, -1 * (APEX_DOMAIN.length + 1));
    return !RESERVED_SUBDOMAINS.has(slug);
  }

  if (hostname.endsWith(".localhost")) {
    return true;
  }

  return false;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const h = await headers();
  const host = h.get("host") ?? "";
  const onHostedSite = isHostedSubdomain(host);

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
      <body
        className={`${archivo.variable} ${geistSans.variable} ${spaceMono.variable} antialiased`}
        style={onHostedSite ? { paddingTop: 0 } : undefined}
      >
        <Providers>
          {!onHostedSite && <Header />}
          {children}
        </Providers>
      </body>
    </html>
  );
}
