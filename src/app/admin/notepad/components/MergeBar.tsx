"use client";
import { useRouter } from "next/navigation";

interface Props {
  count: number;
  sourceIds: string[];
  onCancel: () => void;
}

export function MergeBar({ count, sourceIds, onCancel }: Props) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white px-4 py-3 flex items-center gap-3 z-20">
      <button onClick={onCancel} className="text-xl leading-none">✕</button>
      <span className="font-semibold">{count} selected</span>
      <button
        onClick={() => {
          const params = new URLSearchParams({ ids: sourceIds.join(",") });
          router.push(`/admin/notepad/merge?${params}`);
        }}
        className="ml-auto bg-white text-blue-500 px-4 py-1.5 rounded font-semibold text-sm"
      >
        Merge →
      </button>
    </div>
  );
}
