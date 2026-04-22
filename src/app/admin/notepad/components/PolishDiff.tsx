"use client";

interface Props {
  original: string;
  suggestion: string;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
}

export function PolishDiff({ original, suggestion, onAccept, onReject, onRegenerate }: Props) {
  const originalLines = original.split(/\r?\n/);
  const suggestionLines = suggestion.split(/\r?\n/);
  const originalSet = new Set(originalLines);
  const suggestionSet = new Set(suggestionLines);

  return (
    <div className="border border-purple-500 bg-purple-950/10 rounded p-2 space-y-0.5 font-mono text-xs">
      {originalLines
        .filter((l) => !suggestionSet.has(l))
        .map((l, i) => (
          <div key={`o${i}`} className="line-through text-red-400/70">
            − {l}
          </div>
        ))}
      {suggestionLines
        .filter((l) => !originalSet.has(l))
        .map((l, i) => (
          <div key={`n${i}`} className="text-purple-300">
            + {l}
          </div>
        ))}
      <div className="flex gap-2 pt-3 border-t border-[var(--card-border)] mt-3">
        <button onClick={onReject} className="px-3 py-1 border border-[var(--card-border)] rounded text-[11px]">
          Revert
        </button>
        <button onClick={onRegenerate} className="px-3 py-1 border border-[var(--card-border)] rounded text-[11px]">
          Regenerate
        </button>
        <button onClick={onAccept} className="px-3 py-1 bg-purple-500 text-black rounded text-[11px] font-semibold">
          Keep changes
        </button>
      </div>
    </div>
  );
}
