import { NextResponse, type NextRequest } from "next/server";

const APEX_DOMAIN = process.env.NEXT_PUBLIC_NERTIA_DOMAIN ?? "nertia.ai";
const RESERVED_SUBDOMAINS = new Set(["www", "api", "admin", "app", "mail", "blog"]);

export function middleware(req: NextRequest | Request) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (!host) return NextResponse.next();

  // Local dev — pass through
  if (host === "localhost" || host.endsWith(".localhost")) {
    return NextResponse.next();
  }

  // Apex — pass through
  if (host === APEX_DOMAIN) {
    return NextResponse.next();
  }

  // Subdomain of apex
  if (host.endsWith(`.${APEX_DOMAIN}`)) {
    const slug = host.slice(0, -1 * (APEX_DOMAIN.length + 1));
    if (RESERVED_SUBDOMAINS.has(slug)) return NextResponse.next();

    const url = new URL((req as NextRequest).url ?? `https://${host}/`);
    const rewriteUrl = new URL(url.toString());
    rewriteUrl.pathname = `/hosted/${slug}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Custom domain — deferred to later plan, pass through for now
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|icon.svg|robots.txt|sitemap.xml).*)"],
};
