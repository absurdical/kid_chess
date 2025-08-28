"use client";

import { useGameStore } from "@/lib/state/useGameStore";
import type { Square as Sq } from "chess.js";

const files = "abcdefgh";

function squareToCoords(sq: Sq) {
  const file = files.indexOf(sq[0]);
  const rank = parseInt(sq[1]) - 1;
  // UI renders rank 8 at top, so invert
  const x = file;
  const y = 7 - rank;
  return { x, y };
}

export default function HintArrow() {
  const arrow = useGameStore((s) => s.hintArrow);
  if (!arrow) return null;

  const from = squareToCoords(arrow.from);
  const to = squareToCoords(arrow.to);

  // size per square (we’ll overlay on the grid which is 8x8)
  const size = 100; // arbitrary scale for viewBox

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-40"
      viewBox={`0 0 ${8 * size} ${8 * size}`}
      preserveAspectRatio="none"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="2"
          orient="auto"
          fill="#7A5CE6"
        >
          <path d="M0,0 L0,4 L6,2 z" />
        </marker>
      </defs>
      <line
        x1={(from.x + 0.5) * size}
        y1={(from.y + 0.5) * size}
        x2={(to.x + 0.5) * size}
        y2={(to.y + 0.5) * size}
        stroke="#7A5CE6"
        strokeWidth="6"
        strokeOpacity="0.75"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
}
