"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { BrandContext, Handle } from "@/lib/brandContext";
import type { EmergeVariant } from "@/lib/emerge";
import { detectPlatform } from "@/lib/detectPlatform";
import { getThumbnail } from "@/compositions/thumbnails";

type Step = "form" | "emerge" | "submitting";

type HandleRow = { raw: string; detected: Handle | null };

function emptyRow(): HandleRow {
    return { raw: "", detected: null };
}

const DEFAULT_BRAND_COLOR = "#22c55e";

export function IntakeFlow() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("form");
    const [handleRows, setHandleRows] = useState<HandleRow[]>([emptyRow(), emptyRow()]);
    const [purpose, setPurpose] = useState("");
    const [brandColor, setBrandColor] = useState<string>(DEFAULT_BRAND_COLOR);
    const [variants, setVariants] = useState<EmergeVariant[] | null>(null);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function buildCtx(): BrandContext {
        const handles = handleRows
            .map((r) => r.detected)
            .filter((h): h is Handle => h !== null);
        return {
            purpose: purpose.trim() || undefined,
            brandColor,
            handles: handles.length > 0 ? handles : undefined,
        };
    }

    function updateHandleRow(idx: number, raw: string) {
        setHandleRows((prev) => {
            const next = [...prev];
            next[idx] = { raw, detected: detectPlatform(raw) };
            return next;
        });
    }

    function addHandleRow() {
        setHandleRows((prev) => [...prev, emptyRow()]);
    }

    function removeHandleRow(idx: number) {
        setHandleRows((prev) => prev.filter((_, i) => i !== idx));
    }

    async function submitForm(e: FormEvent) {
        e.preventDefault();
        if (!purpose.trim()) {
            setError("Tell me what this site is for.");
            return;
        }
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/intake/emerge", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ brandContext: buildCtx() }),
            });
            if (!res.ok) throw new Error("emerge failed");
            const data = (await res.json()) as { variants: EmergeVariant[] };
            setVariants(data.variants);
            setStep("emerge");
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setBusy(false);
        }
    }

    async function imagine() {
        setBusy(true);
        setError(null);
        try {
            const res = await fetch("/api/intake/imagine", { method: "POST" });
            if (!res.ok) throw new Error("imagine failed");
            const data = (await res.json()) as { brandContext: BrandContext };
            const ctx = data.brandContext;
            setPurpose(ctx.purpose ?? "");
            setBrandColor(ctx.brandColor ?? DEFAULT_BRAND_COLOR);
            setHandleRows(
                (ctx.handles ?? []).length > 0
                    ? (ctx.handles ?? []).map((h) => ({ raw: h.url, detected: h }))
                    : [emptyRow(), emptyRow()],
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setBusy(false);
        }
    }

    async function pickVariant(variant: EmergeVariant) {
        setStep("submitting");
        setError(null);
        try {
            const res = await fetch("/api/intake/finalize", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ brandContext: buildCtx(), finalVariant: variant }),
            });
            if (!res.ok) {
                const payload = (await res.json().catch(() => ({}))) as { error?: string };
                throw new Error(payload.error ?? "failed to finalize");
            }
            const data = (await res.json()) as { slug: string; url: string };
            router.push(data.url);
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
            setStep("emerge");
        }
    }

    return (
        <div className="min-h-[calc(100svh-var(--header-height))]">
            <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
                {error && (
                    <div
                        role="alert"
                        className="mb-8 text-sm border px-4 py-3 border-red-500 text-red-600 dark:text-red-300"
                    >
                        {error}
                    </div>
                )}

                {step === "form" && (
                    <form onSubmit={submitForm} className="flex flex-col gap-10">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">
                                Tell me about this.
                            </h1>
                        </div>

                        <HandleRepeater
                            rows={handleRows}
                            onChange={updateHandleRow}
                            onAdd={addHandleRow}
                            onRemove={removeHandleRow}
                        />

                        <PurposeField value={purpose} onChange={setPurpose} />

                        <BrandColorField value={brandColor} onChange={setBrandColor} />

                        <div className="flex items-center gap-4 flex-wrap">
                            <button
                                type="submit"
                                disabled={!purpose.trim() || busy}
                                className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-[var(--accent)]/10 disabled:opacity-40"
                                style={{
                                    borderColor: "var(--accent)",
                                    color: "var(--accent)",
                                }}
                            >
                                {busy ? "thinking…" : "Emerge →"}
                            </button>
                            <button
                                type="button"
                                onClick={imagine}
                                disabled={busy}
                                className="text-xs uppercase tracking-[0.2em] border-b transition-colors hover:opacity-80 disabled:opacity-40"
                                style={{
                                    color: "var(--muted)",
                                    borderColor: "var(--card-border)",
                                    paddingBottom: 2,
                                }}
                            >
                                ↯ imagine something to try
                            </button>
                        </div>
                    </form>
                )}

                {step === "emerge" && variants && (
                    <EmergeChoice
                        variants={variants}
                        onPick={pickVariant}
                        busy={busy}
                    />
                )}

                {step === "submitting" && (
                    <div className="py-24 text-center">
                        <div
                            className="inline-block text-xs uppercase tracking-[0.3em]"
                            style={{
                                color: "var(--accent)",
                                animation: "pulse 1.4s ease-in-out infinite",
                            }}
                        >
                            deploying your site…
                        </div>
                        <style>{`@keyframes pulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }`}</style>
                    </div>
                )}
            </div>
        </div>
    );
}

function HandleRepeater({
    rows,
    onChange,
    onAdd,
    onRemove,
}: {
    rows: HandleRow[];
    onChange: (idx: number, raw: string) => void;
    onAdd: () => void;
    onRemove: (idx: number) => void;
}) {
    return (
        <section className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">
                Where are you online? <span className="opacity-60">(optional)</span>
            </label>
            {rows.map((row, idx) => (
                <div key={idx} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={row.raw}
                        onChange={(e) => onChange(idx, e.target.value)}
                        placeholder="@handle or URL"
                        className="flex-1 bg-transparent border px-4 py-3 text-base focus:outline-none"
                        style={{
                            borderColor: "var(--card-border)",
                            color: "var(--foreground)",
                        }}
                    />
                    <span
                        className="text-xs tracking-wide uppercase min-w-[80px]"
                        style={{
                            color: row.detected ? "var(--accent)" : "var(--muted)",
                        }}
                    >
                        {row.detected ? `✓ ${row.detected.platform}` : ""}
                    </span>
                    {rows.length > 1 && (
                        <button
                            type="button"
                            onClick={() => onRemove(idx)}
                            className="text-xs text-muted hover:text-[var(--foreground)]"
                            aria-label="Remove handle"
                        >
                            ×
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                onClick={onAdd}
                className="text-xs uppercase tracking-[0.2em] text-muted hover:text-[var(--foreground)] self-start"
            >
                + add another
            </button>
        </section>
    );
}

function PurposeField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <section className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">
                What&apos;s this site for?
            </label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="e.g. A film-wedding photographer's portfolio."
                rows={3}
                className="bg-transparent border px-4 py-3 text-base focus:outline-none"
                style={{
                    borderColor: "var(--card-border)",
                    color: "var(--foreground)",
                }}
            />
        </section>
    );
}

function BrandColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <section className="flex flex-col gap-3">
            <label className="text-xs uppercase tracking-[0.3em] text-muted">
                Brand color
            </label>
            <div className="flex items-center gap-4">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 h-12 border cursor-pointer"
                    style={{ borderColor: "var(--card-border)" }}
                    aria-label="Pick brand color"
                />
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="#22c55e"
                    className="flex-1 bg-transparent border px-4 py-3 text-base focus:outline-none font-mono"
                    style={{
                        borderColor: "var(--card-border)",
                        color: "var(--foreground)",
                    }}
                />
                <span
                    className="w-12 h-12 border"
                    style={{ backgroundColor: value, borderColor: "var(--card-border)" }}
                />
            </div>
        </section>
    );
}

function EmergeChoice({
    variants,
    onPick,
    busy,
}: {
    variants: EmergeVariant[];
    onPick: (v: EmergeVariant) => void;
    busy: boolean;
}) {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <p
                    className="text-xs uppercase tracking-[0.3em] mb-4"
                    style={{ color: "var(--accent)" }}
                >
                    Pick a structure
                </p>
                <h1 className="text-3xl md:text-5xl tracking-tight max-w-2xl font-bold">
                    Which layout feels right?
                </h1>
            </div>

            <div className="grid gap-4 md:gap-6 md:grid-cols-3">
                {variants.map((v) => {
                    const Thumb = getThumbnail(v.compositionId);
                    return (
                        <button
                            key={v.id}
                            type="button"
                            onClick={() => !busy && onPick(v)}
                            disabled={busy}
                            className="group flex flex-col text-left transition-colors bg-[var(--card-bg)] border hover:border-[var(--accent)] disabled:opacity-50"
                            style={{ borderColor: "var(--card-border)" }}
                        >
                            <div
                                className="aspect-[3/4] overflow-hidden border-b"
                                style={{ borderColor: "var(--card-border)" }}
                            >
                                {Thumb && <Thumb brandColor={v.brandColor} />}
                            </div>
                            <div className="px-4 py-3 flex items-center justify-between">
                                <p
                                    className="text-xs uppercase tracking-[0.2em]"
                                    style={{ color: v.brandColor }}
                                >
                                    {v.compositionLabel}
                                </p>
                                <span
                                    className="w-3 h-3"
                                    style={{ backgroundColor: v.brandColor }}
                                />
                            </div>
                        </button>
                    );
                })}
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
