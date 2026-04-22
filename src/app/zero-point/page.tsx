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
        <p className="text-xs tracking-[0.2em] uppercase text-muted mb-6">
          Zero-point · Coming soon
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold max-w-3xl">
          Free. Hosted. A minute away.
        </h1>
        <div className="mt-10 w-full max-w-2xl">
          <EarlyAccessForm source="zero-point" />
        </div>
        <p className="mt-4 text-sm text-muted">
          Email for launch only.
        </p>
      </section>
    </PageTemplate>
  );
}
