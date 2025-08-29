// src/components/board/HintArrow.tsx
"use client";

import { motion } from "framer-motion";
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

  // Logical square size for the SVG viewBox
  const S = 100;
  const fromX = (from.x + 0.5) * S;
  const fromY = (from.y + 0.5) * S;
  const toX = (to.x + 0.5) * S;
  const toY = (to.y + 0.5) * S;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-40"
      viewBox={`0 0 ${8 * S} ${8 * S}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="6" refY="5" orient="auto">
          <path d="M0,0 L0,10 L10,5 z" fill="#7A5CE6" />
        </marker>
      </defs>

      {/* Pulsing line */}
      <motion.line
        x1={fromX}
        y1={fromY}
        x2={toX}
        y2={toY}
        stroke="#7A5CE6"
        strokeWidth="8"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
        initial={{ opacity: 0.55 }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Destination pulse (ring) */}
      <motion.circle
        cx={toX}
        cy={toY}
        r={18}
        fill="none"
        stroke="#7A5CE6"
        strokeWidth="6"
        initial={{ opacity: 0.4, scale: 0.9 }}
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.05, 0.9] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}
