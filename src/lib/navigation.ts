export interface NavItem {
    label: string;
    href: string;
    id: string;
}

export const navItems: NavItem[] = [
    { label: 'Home', href: '/', id: 'home' },
    { label: 'About', href: '/about', id: 'about' },
    { label: 'Services', href: '/services', id: 'services' },
    { label: 'Work', href: '/work', id: 'work' },
    { label: 'FAQ', href: '/faq', id: 'faq' },
    { label: 'Design System', href: '/design-system', id: 'design-system' },
];

// Footer uses all items
export const footerNavItems = navItems;
