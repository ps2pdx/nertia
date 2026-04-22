import Link from 'next/link';
import ButterflyRingParticles from '@/components/ButterflyRingParticles';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main className="pt-[var(--header-height)]">
      <section id="hero" className="min-h-[calc(88svh-var(--header-height))] relative overflow-hidden">
        <ButterflyRingParticles />
        <div className="absolute top-0 left-0 pl-6 z-10 pointer-events-none">
          <div className="max-w-md pt-6">
            <h1 className="text-sm font-medium mb-2">Butterfly Ring</h1>
            <p className="text-xs text-muted mb-3">
              A particle visualization of a plastic butterfly ring.
              The butterfly represents transformation, Nertia&apos;s core ethos. The ring symbolizes the cyclical,
              never-ending pursuit of evolution.
            </p>
            <p className="text-xs text-muted mb-3">
              3D model generated with Hyper3D Rodin, exported from Blender, rendered as 19,000+ particles in Three.js.
            </p>
            <p className="text-xs text-muted/60 mb-4">
              Hover to disturb • Drag to rotate • Scroll to zoom
            </p>
            <Link
              href="https://particles.casberry.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent)] hover:underline pointer-events-auto"
            >
              Built with AI Particle Simulator →
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
