// src/components/board/ChessBoard.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import Square from "./Square";
import Piece from "./Piece";
import PromotionDialog from "./PromotionDialog";
import LessonCompleteDialog from "./LessonCompleteDialog";
import { defaultBoardPair } from "@/lib/theme/colors";
import { useGameStore } from "@/lib/state/useGameStore";
import type { Square as Sq } from "chess.js";
import HintArrow from "./HintArrow";
import GameOverDialog from "./GameOverDialog";

export default function ChessBoard() {
  const { light, dark } = defaultBoardPair;

  const fen = useGameStore((s) => s.fen);
  const selectSquare = useGameStore((s) => s.selectSquare);
  const tryMove = useGameStore((s) => s.tryMove);
  const selected = useGameStore((s) => s.selected);
  const legalTargets = useGameStore((s) => s.legalTargets);
  const engine = useGameStore((s) => s.engine);
  const lastMove = useGameStore((s) => s.lastMove);
  const currentLesson = useGameStore((s) => s.currentLesson);
  const hintArrow = useGameStore((s) => s.hintArrow);

  // Lesson target stars (reach/capture)
  const lessonTargets =
    currentLesson && (currentLesson.goal.type === "reach" || currentLesson.goal.type === "capture")
      ? (currentLesson.goal.targets ?? [])
      : [];
  const isLessonTarget = (sq: Sq) => lessonTargets.includes(sq as string);

  // 0..63 → a8..h1 (UI shows rank 8 at top)
  const indexToSquare = (i: number): Sq => {
    const file = i % 8;
    const rank = Math.floor(i / 8);
    const files = "abcdefgh";
    const uiRank = 7 - rank;
    return `${files[file]}${uiRank + 1}` as Sq;
  };

  // recompute keys when FEN changes (helps framer-motion layout)
  const squares = React.useMemo(() => Array.from({ length: 64 }, (_, i) => i), [fen]);

  const isTarget = (sq: Sq) => legalTargets.includes(sq);
  const isSelectedSq = (sq: Sq) => selected === sq;

  const handleClick = (i: number) => {
    const sq = indexToSquare(i);
    if (selected && isTarget(sq)) {
      tryMove(sq);
    } else {
      selectSquare(sq);
    }
  };

  // Glow if this square is the source of the hinted move
  const isHintSource = (sq: Sq) => (hintArrow ? hintArrow.from === sq : false);

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[min(88vw,680px)]">
        <div className="relative rounded-2xl p-2 bg-white shadow-md">
          <motion.div
            className="grid grid-cols-8 gap-2 rounded-xl"
            layout
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            {squares.map((i) => {
              const sq = indexToSquare(i);
              const piece = engine.pieceAt(sq);
              const arriving = lastMove?.to === sq;
              const glowHint = isHintSource(sq);

              return (
                <Square
                  key={i}
                  index={i}
                  lightColor={light}
                  darkColor={dark}
                  isSelected={isSelectedSq(sq)}
                  isHint={isTarget(sq)}
                  onClick={handleClick}
                >
                  {/* lesson star target (behind piece) */}
                  {currentLesson && isLessonTarget(sq) && (
                    <span className="pointer-events-none absolute inset-0 grid place-items-center">
                      <span className="text-2xl opacity-65">⭐</span>
                    </span>
                  )}

                  {/* glow ring for hinted piece source */}
                  {glowHint && (
                    <span className="pointer-events-none absolute inset-0 rounded-[14px] ring-4 ring-purple-400/80" />
                  )}

                  {piece && (
                    <motion.div
                      layout
                      key={`${fen}-${sq}`} // remount on change for arrival pop
                      initial={arriving ? { scale: 0.9 } : { scale: 1 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="grid place-items-center"
                    >
                      <Piece type={piece.type} color={piece.color} />
                    </motion.div>
                  )}
                </Square>
              );
            })}
          </motion.div>

          {/* Overlays */}
          <GameOverDialog />
          <HintArrow />
          <PromotionDialog />
          <LessonCompleteDialog />
        </div>

        <p className="mt-3 text-center text-sm text-neutral-500">
          Tap a piece to see legal moves. Tap a dot to move. Use Hint for a suggested move.
        </p>
      </div>
    </div>
  );
}
