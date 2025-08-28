"use client";
import { useGameStore } from "@/lib/state/useGameStore";

export default function PromotionDialog() {
  const pending = useGameStore((s) => s.pendingPromotion);
  const confirm = useGameStore((s) => s.confirmPromotion);
  const cancel = useGameStore((s) => s.cancelSelection);
  if (!pending) return null;

  const OptionBtn = ({ label, value }: { label: string; value: "q"|"r"|"b"|"n" }) => (
    <button
      onClick={() => confirm(value)}
      className="px-4 py-3 rounded-xl border bg-white hover:bg-neutral-50 text-base font-medium"
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold">Choose a piece</h3>
        <p className="mt-1 text-sm text-neutral-600">
          Your pawn reached the end! Pick a new piece:
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <OptionBtn label="👑 Queen" value="q" />
          <OptionBtn label="🏰 Rook" value="r" />
          <OptionBtn label="🐴 Knight" value="n" />
          <OptionBtn label="⛪ Bishop" value="b" />
        </div>
        <div className="mt-4 text-right">
          <button onClick={cancel} className="text-sm text-neutral-500 hover:underline">Cancel</button>
        </div>
      </div>
    </div>
  );
}
