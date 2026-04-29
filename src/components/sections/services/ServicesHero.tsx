export default function ServicesHero() {
    return (
        <section
            id="hero"
            className="px-8 lg:px-12 pt-16 pb-12 max-w-4xl"
        >
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
                Services
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                You bring the product.
                <br />
                We build the production.
            </h1>
            <p className="text-lg text-muted leading-relaxed max-w-2xl">
                A production engineering studio for founders shipping the next
                thing. Three commitment tiers, plus à la carte. Pick a
                Particle, Wave, or Entanglement — or book an Observation if
                you&apos;re not sure where you fit yet.
            </p>
        </section>
    );
}
