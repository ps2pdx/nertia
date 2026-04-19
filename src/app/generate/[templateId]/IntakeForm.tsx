"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { CopySchemaField } from "@/templates/types";

interface IntakeFormProps {
  templateId: string;
  templateName: string;
  copySchema: CopySchemaField[];
}

export function IntakeForm({ templateId, templateName, copySchema }: IntakeFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setField = (key: string, value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ templateId, copy: values }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({ error: "Something went wrong." }));
        throw new Error(payload.error ?? `request failed (${res.status})`);
      }
      const payload = (await res.json()) as { slug: string; url: string };
      router.push(payload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <section
      className="min-h-screen px-6 md:px-12 py-24"
      style={{
        backgroundColor: "var(--background, #0a0a0a)",
        color: "var(--foreground, #f5f5f5)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        <header className="mb-10">
          <p
            className="text-xs uppercase tracking-[0.3em] mb-3"
            style={{ color: "var(--accent, #00d4ff)" }}
          >
            {templateName}
          </p>
          <h1 className="text-3xl md:text-5xl tracking-tight">Fill in your copy.</h1>
          <p
            className="mt-3 text-sm md:text-base"
            style={{ color: "var(--muted, #9ca3af)" }}
          >
            Everything you type ships into your live site. You can edit later.
          </p>
        </header>

        <form
          data-testid="intake-form"
          onSubmit={onSubmit}
          className="flex flex-col gap-6"
          noValidate={false}
        >
          {copySchema.map((field) => (
            <FieldRow
              key={field.key}
              field={field}
              value={values[field.key] ?? ""}
              onChange={(v) => setField(field.key, v)}
            />
          ))}

          {error && (
            <p
              role="alert"
              className="text-sm"
              style={{ color: "#ef4444" }}
            >
              {error}
            </p>
          )}

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center border px-6 py-3 text-sm uppercase tracking-widest transition-colors hover:bg-white/5 disabled:opacity-50"
              style={{
                borderColor: "var(--accent, #00d4ff)",
                color: "var(--accent, #00d4ff)",
              }}
            >
              {submitting ? "deploying…" : "deploy site →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: CopySchemaField;
  value: string;
  onChange: (next: string) => void;
}) {
  const baseClasses =
    "w-full bg-transparent border px-3 py-2 text-sm focus:outline-none transition-colors";
  const style = {
    borderColor: "var(--border, #1f1f1f)",
    color: "var(--foreground, #f5f5f5)",
  };

  const inputProps = {
    id: field.key,
    value,
    onChange: (e: { target: { value: string } }) => onChange(e.target.value),
    placeholder: field.placeholder,
    required: field.required,
    maxLength: field.maxLength,
  };

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={field.key}
        className="text-xs uppercase tracking-[0.2em]"
        style={{ color: "var(--muted, #9ca3af)" }}
      >
        {field.label}
        {field.required && <span style={{ color: "var(--accent, #00d4ff)" }}> *</span>}
      </label>
      {field.type === "textarea" ? (
        <textarea
          {...inputProps}
          rows={3}
          className={baseClasses}
          style={style}
        />
      ) : (
        <input
          {...inputProps}
          type="text"
          className={baseClasses}
          style={style}
        />
      )}
    </div>
  );
}
