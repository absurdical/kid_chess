// src/components/controls/GameControls.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/lib/state/useGameStore";

export default function GameControls() {
  const undoMove = useGameStore((s) => s.undoMove);
  const hint = useGameStore((s) => s.hint);
  const restartGame = useGameStore((s) => s.restartGame);
  const moves = useGameStore((s) => s.moves);

  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <h2 className="text-base font-semibold">Controls</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Big, friendly buttons for tiny hands.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Button className="h-12 rounded-xl text-base" onClick={undoMove}>
          ⤺ Undo
        </Button>
        <Button variant="secondary" className="h-12 rounded-xl text-base" onClick={hint}>
          💡 Hint
        </Button>
        <Button variant="destructive" className="h-12 rounded-xl text-base" onClick={restartGame}>
          ↻ Restart
        </Button>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        Moves so far: <span className="font-medium">{moves}</span>
      </p>
    </div>
  );
}
