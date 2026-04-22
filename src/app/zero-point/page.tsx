import { Hero } from "@/app/_components/landing/Hero";
import PageTemplate from "@/components/PageTemplate";
import ComingSoonBanner from "@/components/sections/ComingSoonBanner";

export default function Home() {
  return (
    <PageTemplate>
      <ComingSoonBanner />
      <Hero
        eyebrow="ZERO-POINT"
        headline="A website emerges from your brief."
        sub="Free. Hosted. Live in under a minute."
        ctaLabel="Begin"
        ctaHref="/intake/zero-point"
      />
    </PageTemplate>
  );
}
