import { Hero } from "@/app/_components/landing/Hero";

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow="ZERO-POINT"
        headline="Real Next.js. Real Vercel. Deployed in seconds."
        sub="Pick an open-source template. We assemble it with your copy and ship it live. Nothing proprietary, nothing to configure."
        ctaLabel="Pick a template"
        ctaHref="/templates"
      />
    </main>
  );
}
