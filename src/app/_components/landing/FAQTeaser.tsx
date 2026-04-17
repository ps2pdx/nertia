import Link from "next/link";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQTeaserProps {
  items: FAQItem[];
  fullFaqHref?: string;
}

export function FAQTeaser({ items, fullFaqHref }: FAQTeaserProps) {
  return (
    <section
      className="px-6 md:px-12 py-24 md:py-32"
      style={{
        backgroundColor: "var(--faq-bg, #0a0a0a)",
        color: "var(--faq-fg, #f5f5f5)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        <p
          className="text-xs uppercase tracking-[0.3em] mb-10"
          style={{ color: "var(--faq-accent, #00d4ff)" }}
        >
          questions
        </p>
        <dl className="flex flex-col gap-8">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col gap-2">
              <dt
                className="text-xl md:text-2xl"
                style={{ fontFamily: "var(--faq-font-heading, 'Inter', ui-sans-serif)" }}
              >
                {item.question}
              </dt>
              <dd className="text-base" style={{ color: "var(--faq-muted, #9ca3af)" }}>
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
        {fullFaqHref && (
          <div className="mt-12">
            <Link
              href={fullFaqHref}
              className="inline-flex items-center text-xs uppercase tracking-[0.2em] border-b transition-colors"
              style={{
                borderColor: "var(--faq-accent, #00d4ff)",
                color: "var(--faq-accent, #00d4ff)",
              }}
            >
              all faqs →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
