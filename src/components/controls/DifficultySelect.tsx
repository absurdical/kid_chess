// src/components/controls/DifficultySelect.tsx
"use client";

import { useGameStore } from "@/lib/state/useGameStore";

const LABELS: Record<number, string> = {
  1: "Beginner",
  2: "Casual",
  3: "Good",
  4: "Really good",
  5: "“Magnus”",
};

export default function DifficultySelect() {
  const botLevel = useGameStore((s) => s.botLevel);
  const setBotLevel = useGameStore((s) => s.setBotLevel);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold">Bot Difficulty</h2>
      <div className="mt-3 grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5].map((lvl) => (
          <button
            key={lvl}
            onClick={() => setBotLevel(lvl as any)}
            className={`h-10 rounded-xl text-sm font-medium ${
              botLevel === lvl
                ? "bg-purple-600 text-white"
                : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
            }`}
            title={LABELS[lvl]}
          >
            {lvl}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-neutral-500">{LABELS[botLevel]}</p>
    </div>
  );
}
