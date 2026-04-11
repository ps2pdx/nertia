import ButterflyRingParticles from '@/components/ButterflyRingParticles';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <main>
      <section id="hero" className="min-h-screen relative">
        <ButterflyRingParticles />
        <div className="absolute top-6 left-6 z-10 pointer-events-none">
          <div className="max-w-md">
            <h1 className="text-sm font-medium mb-2">Butterfly Ring</h1>
            <p className="text-xs text-muted">
              A particle visualization of a plastic butterfly ring.
              The butterfly represents transformation, Nertia&apos;s core ethos. The ring symbolizes the cyclical,
              never-ending pursuit of evolution.
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
