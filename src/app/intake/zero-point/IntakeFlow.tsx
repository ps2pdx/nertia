"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BrandContext } from "@/lib/brandContext";
import type { EmergeVariant } from "@/lib/emerge";

type Step =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "emerge1"
  | "emerge2"
  | "submitting";

const STEPS: Step[] = ["q1", "q2", "q3", "q4", "q5", "emerge1", "emerge2"];

export function IntakeFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("q1");
  const [ctx, setCtx] = useState<BrandContext>({ adaptive: [] });
  const [adaptiveQs, setAdaptiveQs] = useState<string[] | null>(null);
  const [round1Variants, setRound1Variants] = useState<EmergeVariant[] | null>(null);
  const [round2Variants, setRound2Variants] = useState<EmergeVariant[] | null>(null);
  const [pickedRound1, setPickedRound1] = useState<EmergeVariant | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ───────── handlers ─────────

  async function handleQ1(value: string) {
    setCtx((p) => ({ ...p, purpose: value }));
    setStep("q2");
  }

  async function imagineBrand() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/intake/imagine", { method: "POST" });
      if (!res.ok) throw new Error("imagination failed");
      const data = (await res.json()) as { brandContext: BrandContext };
      setCtx(data.brandContext);
      const emergeRes = await fetch("/api/intake/emerge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brandContext: data.brandContext, round: 1 }),
      });
      if (!emergeRes.ok) throw new Error("failed to load variants");
      const emergeData = (await emergeRes.json()) as { variants: EmergeVariant[] };
      setRound1Variants(emergeData.variants);
      setStep("emerge1");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleQ2(value: string) {
    setCtx((p) => ({ ...p, audience: value }));
    setStep("q3");
  }

  async function handleQ3(value: string) {
    const words = value
      .split(/[,\s]+/)
      .map((w) => w.trim())
      .filter(Boolean)
      .slice(0, 3);
    const nextCtx = { ...ctx, vibeWords: words };
    setCtx(nextCtx);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/intake/next", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brandContext: nextCtx }),
      });
      if (!res.ok) throw new Error("failed to load next questions");
      const data = (await res.json()) as { questions: string[] };
      setAdaptiveQs(data.questions);
      setStep("q4");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  function handleAdaptive(value: string, index: 0 | 1) {
    if (!adaptiveQs) return;
    const question = adaptiveQs[index];
    setCtx((p) => ({
      ...p,
      adaptive: [...p.adaptive.filter((a) => a.question !== question), { question, answer: value }],
    }));
    if (index === 0) setStep("q5");
    else void loadEmergeRound1(value, question);
  }

  async function loadEmergeRound1(lastAnswer: string, lastQuestion: string) {
    const nextCtx = {
      ...ctx,
      adaptive: [
        ...ctx.adaptive.filter((a) => a.question !== lastQuestion),
        { question: lastQuestion, answer: lastAnswer },
      ],
    };
    setCtx(nextCtx);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/intake/emerge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ brandContext: nextCtx, round: 1 }),
      });
      if (!res.ok) throw new Error("failed to load variants");
      const data = (await res.json()) as { variants: EmergeVariant[] };
      setRound1Variants(data.variants);
      setStep("emerge1");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function pickRound1(variant: EmergeVariant) {
    setPickedRound1(variant);
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/intake/emerge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          brandContext: ctx,
          round: 2,
          pickedVariantId: variant.id,
          previous: round1Variants,
        }),
      });
      if (!res.ok) throw new Error("failed to narrow variants");
      const data = (await res.json()) as { variants: EmergeVariant[] };
      setRound2Variants(data.variants);
      setStep("emerge2");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function pickRound2(variant: EmergeVariant) {
    setStep("submitting");
    setError(null);
    try {
      const res = await fetch("/api/intake/finalize", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          brandContext: ctx,
          finalVariant: variant,
        }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "failed to finalize");
      }
      const data = (await res.json()) as { slug: string; url: string };
      router.push(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setStep("emerge2");
    }
  }

  // ───────── render ─────────

  return (
    <div className="min-h-[calc(100svh-var(--header-height))]">
      <ProgressDots step={step} />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        {error && (
          <div
            role="alert"
            className="mb-8 text-sm border px-4 py-3 border-red-500 text-red-600 dark:text-red-300"
          >
            {error}
          </div>
        )}

        {step === "q1" && (
          <>
            <QuestionCard
              eyebrow="Q1 · PURPOSE"
              question="What's this website for, in one sentence?"
              onSubmit={handleQ1}
              placeholder="e.g. A film-wedding photographer's portfolio."
              multiline
              busy={busy}
            />
            <div className="mt-8">
              <button
                type="button"
                onClick={imagineBrand}
                disabled={busy}
                className="text-xs uppercase tracking-[0.2em] border-b transition-colors hover:opacity-80 disabled:opacity-40"
                style={{
                  color: "var(--muted)",
                  borderColor: "var(--card-border)",
                  paddingBottom: 2,
                }}
              >
                {busy ? "imagining…" : "or ↯ imagine a brand to try"}
              </button>
            </div>
          </>
        )}

        {step === "q2" && (
          <QuestionCard
            eyebrow="Q2 · AUDIENCE"
            question="Who do you imagine scrolling through it?"
            onSubmit={handleQ2}
            placeholder="e.g. Couples planning destination weddings and art directors."
            multiline
          />
        )}

        {step === "q3" && (
          <QuestionCard
            eyebrow="Q3 · VIBE"
            question="Three words for the vibe."
            onSubmit={handleQ3}
            placeholder="comma or space separated — e.g. warm, unhurried, cinematic"
          />
        )}

        {step === "q4" && adaptiveQs && (
          <QuestionCard
            key="q4"
            eyebrow="Q4 · EMERGING"
            question={adaptiveQs[0]}
            onSubmit={(v) => handleAdaptive(v, 0)}
            placeholder="Write what comes to mind."
            multiline
            busy={busy}
          />
        )}

        {step === "q5" && adaptiveQs && (
          <QuestionCard
            key="q5"
            eyebrow="Q5 · EMERGING"
            question={adaptiveQs[1]}
            onSubmit={(v) => handleAdaptive(v, 1)}
            placeholder="Write what comes to mind."
            multiline
            busy={busy}
          />
        )}

        {step === "emerge1" && round1Variants && (
          <EmergeChoice
            eyebrow="EMERGE · ROUND 1"
            question="Pick the direction that feels right."
            variants={round1Variants}
            onPick={pickRound1}
            busy={busy}
          />
        )}

        {step === "emerge2" && round2Variants && (
          <EmergeChoice
            eyebrow="EMERGE · ROUND 2"
            question="Narrow it down."
            variants={round2Variants}
            onPick={pickRound2}
            busy={busy}
            subNote={
              pickedRound1
                ? `refining from “${pickedRound1.label}”`
                : undefined
            }
          />
        )}

        {step === "submitting" && (
          <div className="py-24 text-center">
            <div
              className="inline-block text-xs uppercase tracking-[0.3em]"
              style={{ color: "var(--accent)", animation: "pulse 1.4s ease-in-out infinite" }}
            >
              deploying your site…
            </div>
            <style>{`
              @keyframes pulse {
                0%,100% { opacity: 0.5; }
                50% { opacity: 1; }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}

// ───────── components ─────────

function ProgressDots({ step }: { step: Step }) {
  const activeIdx = STEPS.indexOf(step as (typeof STEPS)[number]);
  return (
    <div
      className="pt-6 pb-2 flex items-center justify-center gap-2"
      style={{ color: "var(--muted)" }}
    >
      {STEPS.map((s, i) => {
        const isEmerge = s === "emerge1" || s === "emerge2";
        const active = i <= activeIdx;
        return (
          <span
            key={s}
            style={{
              width: isEmerge ? 12 : 8,
              height: isEmerge ? 12 : 8,
              borderRadius: "50%",
              backgroundColor: active ? "var(--accent)" : "var(--card-border)",
              boxShadow: active ? "0 0 10px var(--accent)" : "none",
              transition: "all 400ms ease-out",
            }}
          />
        );
      })}
    </div>
  );
}

function QuestionCard({
  eyebrow,
  question,
  onSubmit,
  placeholder,
  multiline = false,
  busy = false,
}: {
  eyebrow: string;
  question: string;
  onSubmit: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  busy?: boolean;
}) {
  const [value, setValue] = useState("");

  function handle(e: FormEvent) {
    e.preventDefault();
    if (!value.trim() || busy) return;
    onSubmit(value.trim());
    setValue("");
  }

  return (
    <form onSubmit={handle} className="flex flex-col gap-8">
      <div>
        <p
          className="text-xs uppercase tracking-[0.3em] mb-6"
          style={{ color: "var(--accent)" }}
        >
          {eyebrow}
        </p>
        <h1
          className="text-3xl md:text-5xl tracking-tight max-w-2xl"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          {question}
        </h1>
      </div>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          rows={3}
          autoFocus
          className="w-full bg-transparent border px-4 py-3 text-base focus:outline-none"
          style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="w-full bg-transparent border px-4 py-3 text-base focus:outline-none"
          style={{ borderColor: "var(--card-border)", color: "var(--foreground)" }}
        />
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={!value.trim() || busy}
          className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[var(--accent)]/10 disabled:opacity-40"
          style={{
            borderColor: "var(--accent)",
            color: "var(--accent)",
          }}
        >
          {busy ? "thinking…" : "continue →"}
        </button>
      </div>
    </form>
  );
}

function EmergeChoice({
  eyebrow,
  question,
  variants,
  onPick,
  busy,
  subNote,
}: {
  eyebrow: string;
  question: string;
  variants: EmergeVariant[];
  onPick: (v: EmergeVariant) => void;
  busy: boolean;
  subNote?: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <p
          className="text-xs uppercase tracking-[0.3em] mb-4"
          style={{ color: "var(--accent)" }}
        >
          {eyebrow}
        </p>
        <h1
          className="text-3xl md:text-5xl tracking-tight max-w-2xl"
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 500,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
          }}
        >
          {question}
        </h1>
        {subNote && (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            {subNote}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:gap-6 md:grid-cols-3">
        {variants.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => !busy && onPick(v)}
            disabled={busy}
            className="group flex flex-col text-left transition-colors disabled:opacity-50"
            style={{
              backgroundColor: v.palette.bg,
              color: v.palette.fg,
              border: "1px solid var(--card-border)",
            }}
          >
            {/* Headline preview in the variant's type + palette */}
            <div
              className="p-6 pb-4 min-h-[160px] flex items-end"
              style={{
                backgroundColor: v.palette.bg,
                color: v.palette.fg,
              }}
            >
              <p
                className="text-lg leading-tight"
                style={{
                  fontFamily: v.fontPair.heading,
                  color: v.palette.headingStart,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                {v.previewHeadline || v.compositionLabel}
              </p>
            </div>

            {/* Metadata strip — palette swatches + composition label */}
            <div
              className="px-6 py-4 border-t flex items-center justify-between"
              style={{
                borderColor: v.palette.muted,
                backgroundColor: v.palette.bg,
              }}
            >
              <p
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: v.palette.muted, fontFamily: v.fontPair.body }}
              >
                {v.compositionLabel}
              </p>
              <div className="flex gap-1">
                {[v.palette.bg, v.palette.accent, v.palette.headingEnd].map(
                  (c, i) => (
                    <span
                      key={i}
                      className="w-3 h-3"
                      style={{
                        backgroundColor: c,
                        border: `1px solid ${v.palette.muted}`,
                      }}
                    />
                  ),
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {busy && (
        <p
          className="text-xs uppercase tracking-[0.2em]"
          style={{ color: "var(--accent)" }}
        >
          emerging…
        </p>
      )}
    </div>
  );
}
