import PageTemplate from "@/components/PageTemplate";
import EarlyAccessForm from "@/components/sections/EarlyAccessForm";

export const metadata = {
  title: "Zero-Point · nertia",
  description: "Zero-point websites — coming soon. Get early access.",
};

export default function ZeroPointPage() {
  return (
    <PageTemplate>
      <section className="min-h-[calc(100svh-var(--header-height)-120px)] flex flex-col items-center justify-center px-6 text-center py-16">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--accent)] mb-6">
          Zero-Point · Coming Soon
        </p>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight max-w-4xl"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          Your website, emerged from a brief.
        </h1>
        <p
          className="mt-6 text-2xl md:text-3xl tracking-tight text-muted max-w-3xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Free. Hosted. A minute away.
        </p>
        <p className="mt-10 max-w-xl text-base md:text-lg text-muted">
          A few questions, a visual funnel, a live site on nertia.ai. Shipping soon — drop your email for early access.
        </p>
        <div className="mt-10 w-full max-w-2xl">
          <EarlyAccessForm source="zero-point" />
        </div>
        <p className="mt-4 text-xs text-muted">
          Your email is only used for launch. No spam.
        </p>
      </section>
    </PageTemplate>
  );
}
