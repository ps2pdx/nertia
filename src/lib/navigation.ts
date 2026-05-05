export interface NavItem {
    label: string;
    href: string;
    id: string;
}

/**
 * 3-state nav driven by auth + current route:
 * - PUBLIC   — signed out, anywhere
 * - AUTHED   — signed in, not inside a tool
 * - IN_TOOL  — inside /intake/*, /generator/*, /generate/*, /admin/*
 *
 * The header switches its label set + CTA based on which mode is active.
 * Items dropped from global chrome (Home, About, Work, FAQ, Design System)
 * still ship to the footer via `footerLinks`.
 */
export type NavMode = 'public' | 'authed' | 'in_tool';

export const publicNav: NavItem[] = [
    { label: 'Blog',     href: '/blog',     id: 'blog' },
    { label: 'Services', href: '/services', id: 'services' },
    { label: 'Resume',   href: '/resume',   id: 'resume' },
    { label: 'Lab',      href: '/lab',      id: 'lab' },
];

export const authedNav: NavItem[] = [
    { label: 'Zero·Point', href: '/zero-point',     id: 'zero-point' },
    { label: 'Design·Sys', href: '/design-system',  id: 'design-system' },
    { label: 'Lab',        href: '/lab',            id: 'lab' },
];

/**
 * Routes that count as "inside a tool" — header shrinks to step labels + EXIT ✕.
 */
export const inToolRoutes = [
    '/intake',
    '/generator',
    '/generate',
    '/admin',
];

/**
 * Footer links — items that used to live in the global nav but moved to the
 * footer when the public nav was reduced to 4.
 */
export const footerLinks: NavItem[] = [
    { label: 'About',         href: '/about',         id: 'about' },
    { label: 'FAQ',           href: '/faq',           id: 'faq' },
    { label: 'Work',          href: '/work',          id: 'work' },
    { label: 'Design System', href: '/design-system', id: 'design-system' },
    { label: 'Blog',          href: '/blog',          id: 'blog' },
];

export function getNavMode(pathname: string, isSignedIn: boolean): NavMode {
    if (inToolRoutes.some((p) => pathname.startsWith(p))) return 'in_tool';
    if (isSignedIn) return 'authed';
    return 'public';
}

export function getNavItems(mode: NavMode): NavItem[] {
    if (mode === 'authed') return authedNav;
    if (mode === 'in_tool') return [];
    return publicNav;
}

/* legacy aliases — kept so any unconverted import keeps compiling */
export const navItems = publicNav;
export const footerNavItems = footerLinks;
