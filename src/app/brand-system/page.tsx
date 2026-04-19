'use client';

import PageContent from '@/components/PageContent';
import Footer from '@/components/sections/Footer';
import BrandSystemFlow from '@/components/brand-system/BrandSystemFlow';
import { BasicStylesSVG, ComponentsSVG, MessagingSVG } from '@/components/brand-system';

export default function BrandSystemPage() {
    return (
        <main className="pb-24">
            <PageContent>
                {/* Hero */}
                <section className="py-24 border-b border-[var(--card-border)]">
                    <div className="max-w-3xl">
                        <div className="text-xs tracking-[0.2em] uppercase text-muted mb-4">Brand System</div>
                        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                            Three ingredients.<br />
                            <span className="text-[var(--accent)]">Infinite outputs.</span>
                        </h1>
                        <p className="text-muted text-lg leading-relaxed">
                            Every piece of marketing you&apos;ll ever need comes from the same three core elements:
                            basic styles, components, and messaging. Master these, and you can build anything.
                        </p>
                    </div>
                </section>

                {/* Brand System Flow Animation */}
                <section className="py-24 border-b border-[var(--card-border)]">
                    <div className="text-xs tracking-[0.2em] uppercase text-muted mb-4">How It Works</div>
                    <h2 className="text-2xl font-bold mb-8">Combine ingredients → Create anything</h2>
                    <BrandSystemFlow />
                </section>

                {/* Three Ingredients SVGs */}
                <section className="py-24 border-b border-[var(--card-border)]">
                    <div className="text-xs tracking-[0.2em] uppercase text-muted mb-8">The Three Ingredients</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center">
                        <BasicStylesSVG />
                        <ComponentsSVG />
                        <MessagingSVG />
                    </div>
                </section>

                <Footer />
            </PageContent>
        </main>
    );
}
