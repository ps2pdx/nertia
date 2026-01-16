'use client';

export default function Intro() {
    const scrollToWork = () => {
        document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="intro" className="section">
            <div className="container">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Tagline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-8">
                        Identity in Motion
                    </h1>

                    {/* Description */}
                    <p className="text-xl sm:text-2xl text-muted leading-relaxed mb-12">
                        Nertia builds modular, AI-powered identity systems for companies that refuse to stand still.
                        Strategy, design, and code—under one roof.
                    </p>

                    {/* CTA */}
                    <button onClick={scrollToWork} className="btn-primary text-lg">
                        View Work
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
