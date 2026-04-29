'use client';

import PageSidebar, { SidebarSection } from '@/components/PageSidebar';
import ServicesHero from '@/components/sections/services/ServicesHero';
import PackagesGrid from '@/components/sections/services/PackagesGrid';
import ServicesMenu from '@/components/sections/services/ServicesMenu';
import ClosingCta from '@/components/sections/services/ClosingCta';

const sections: SidebarSection[] = [
    { id: 'hero', label: 'Overview' },
    { id: 'packages', label: 'Packages' },
    { id: 'quanta', label: 'Quanta' },
    { id: 'observe', label: 'Observation' },
];

export default function Services() {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12">
                <PageSidebar
                    sections={sections}
                    title="Services"
                    description="Three commitment tiers, plus à la carte."
                />

                <div className="lg:col-span-9">
                    <ServicesHero />
                    <PackagesGrid />
                    <ServicesMenu />
                    <ClosingCta />
                </div>
            </div>
        </div>
    );
}
