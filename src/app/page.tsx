import { Hero } from "@/app/_components/landing/Hero";

export default function Home() {
  return (
    <main>
      <Hero
        eyebrow="ZERO-POINT"
        headline="A website emerges from your brief."
        sub="Free. Hosted. Live in under a minute."
        ctaLabel="Start"
        ctaHref="/generate"
      />
    </main>
  );
}
