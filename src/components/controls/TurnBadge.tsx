// src/components/controls/TurnBadge.tsx
"use client";

import { useGameStore } from "@/lib/state/useGameStore";

export default function TurnBadge() {
  const turn = useGameStore((s) => s.turn);
  const isChild = turn === "child";

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-neutral-100 text-xl">
          {isChild ? "🙂" : "🤖"}
        </div>
        <div>
          <div className="text-sm text-neutral-500">It’s</div>
          <div className="text-base font-semibold">
            {isChild ? "Your turn" : "Friendly Bot’s turn"}
          </div>
        </div>
      </div>
    </div>
  );
}
