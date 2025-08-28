// src/lib/state/useGameStore.ts
import { create } from "zustand";
import type { Square } from "chess.js";
import { createEngine, type Engine } from "@/lib/rules/engineAdapter";
import { LESSONS, type Lesson } from "@/lib/rules/presets";
import { checkGoalMet } from "@/lib/rules/scoring";

type Turn = "child" | "bot";
type PendingPromotion = {
  from: Square;
  to: Square;
  options: Array<"q" | "r" | "b" | "n">;
} | null;

type GameState = {
  // engine + board
  engine: Engine;
  fen: string;

  // ui state
  selected?: Square;
  legalTargets: Square[];
  pendingPromotion: PendingPromotion;
  lastMove?: { from: Square; to: Square } | null;

  // lessons
  lessons: Lesson[];
  currentLesson?: Lesson | null;
  lessonComplete: boolean;
  loadLesson: (id: string) => void;
  exitLesson: () => void;

  // meta / kid delight
  moves: number;
  stickers: number;
  turn: Turn;
  stickerEvery: number;
  maxStickers: number;

  // actions
  selectSquare: (sq: Square) => void;
  tryMove: (to: Square) => void;
  confirmPromotion: (p: "q" | "r" | "b" | "n") => void;
  cancelSelection: () => void;

  undoMove: () => void;
  restartGame: () => void;
  hint: () => void;
  setTurn: (t: Turn) => void;

  // bot
  botMove: () => void;
};

export const useGameStore = create<GameState>((set, get) => {
  const engine = createEngine();

  const awardIfNeeded = (nextMoves: number) => {
    const { stickers, stickerEvery, maxStickers } = get();
    const award = nextMoves % stickerEvery === 0 && stickers < maxStickers;
    return award ? stickers + 1 : stickers;
  };

  const scheduleBotIfNeeded = () => {
    setTimeout(() => {
      const { turn, pendingPromotion, currentLesson } = get();
      // In lessons, keep it single-player (no bot) to reduce chaos:
      if (currentLesson) return;
      if (turn === "bot" && !pendingPromotion) {
        get().botMove();
      }
    }, 450);
  };

  const reloadFen = () => set({ fen: get().engine.fen() });

  return {
    engine,
    fen: engine.fen(),

    selected: undefined,
    legalTargets: [],
    pendingPromotion: null,
    lastMove: null,

    // lessons
    lessons: LESSONS,
    currentLesson: null,
    lessonComplete: false,

    moves: 0,
    stickers: 0,
    turn: "child",
    stickerEvery: 5,
    maxStickers: 4,

    loadLesson: (id) => {
      const lesson = get().lessons.find((l) => l.id === id) ?? null;
      if (!lesson) return;
      // load its FEN and reset meta state
      get().engine.load(lesson.fen);
      set({
        currentLesson: lesson,
        lessonComplete: false,
        selected: undefined,
        legalTargets: [],
        moves: 0,
        turn: "child",
        stickers: 0,
        pendingPromotion: null,
        lastMove: null,
      });
      reloadFen();
    },

    exitLesson: () => {
      // Return to a normal game start
      get().engine.load();
      set({
        currentLesson: null,
        lessonComplete: false,
        selected: undefined,
        legalTargets: [],
        moves: 0,
        stickers: 0,
        turn: "child",
        pendingPromotion: null,
        lastMove: null,
      });
      reloadFen();
    },

    selectSquare: (sq) => {
      const piece = get().engine.pieceAt(sq);
      if (!piece) {
        return set({
          selected: undefined,
          legalTargets: [],
          pendingPromotion: null,
        });
      }
      if (piece.color !== get().engine.turn()) {
        return set({
          selected: undefined,
          legalTargets: [],
          pendingPromotion: null,
        });
      }
      const legalTargets = get().engine.legalMovesFrom(sq);
      set({ selected: sq, legalTargets, pendingPromotion: null });
    },

    tryMove: (to) => {
      const { engine, selected, moves, turn, currentLesson } = get();
      if (!selected) return;

      // Check if promotion is required
      const verbose = engine.legalMovesVerboseFrom(selected);
      const candidate = verbose.find((m: any) => m.to === to);
      if (!candidate) return;

      if ((candidate as any).promotion) {
        return set({
          pendingPromotion: { from: selected, to, options: ["q", "r", "b", "n"] },
        });
      }

      const ok = engine.makeMove(selected, to);
      if (!ok) return;

      const nextMoves = moves + 1;

      // After a successful move, check lesson goal
      let lessonComplete = false;
      if (currentLesson) {
        lessonComplete = checkGoalMet(engine, currentLesson);
      }

      set({
        fen: engine.fen(),
        selected: undefined,
        legalTargets: [],
        moves: nextMoves,
        stickers: awardIfNeeded(nextMoves),
        turn: turn === "child" ? "bot" : "child",
        pendingPromotion: null,
        lastMove: { from: selected, to },
        lessonComplete,
      });

      // In lesson mode, don't trigger bot
      if (!currentLesson) scheduleBotIfNeeded();
    },

    confirmPromotion: (p) => {
      const { engine, pendingPromotion, moves, turn, currentLesson } = get();
      if (!pendingPromotion) return;

      const ok = engine.makeMove(pendingPromotion.from, pendingPromotion.to, p);
      if (!ok) return;

      const nextMoves = moves + 1;

      let lessonComplete = false;
      if (currentLesson) {
        lessonComplete = checkGoalMet(engine, currentLesson);
      }

      set({
        fen: engine.fen(),
        selected: undefined,
        legalTargets: [],
        moves: nextMoves,
        stickers: awardIfNeeded(nextMoves),
        turn: turn === "child" ? "bot" : "child",
        pendingPromotion: null,
        lastMove: { from: pendingPromotion.from, to: pendingPromotion.to },
        lessonComplete,
      });

      if (!currentLesson) scheduleBotIfNeeded();
    },

    cancelSelection: () =>
      set({ selected: undefined, legalTargets: [], pendingPromotion: null }),

    undoMove: () => {
      const { engine, moves, stickers, stickerEvery, turn } = get();
      const undone = engine.undo();
      if (!undone) return;

      const newMoves = Math.max(0, moves - 1);
      const lostSticker = moves % stickerEvery === 0 && stickers > 0;
      set({
        fen: engine.fen(),
        selected: undefined,
        legalTargets: [],
        moves: newMoves,
        stickers: lostSticker ? stickers - 1 : stickers,
        turn: turn === "child" ? "bot" : "child",
        pendingPromotion: null,
        lastMove: null,
      });
    },

    restartGame: () => {
      const { engine, currentLesson } = get();
      if (currentLesson) {
        engine.load(currentLesson.fen);
      } else {
        engine.load();
      }
      set({
        fen: engine.fen(),
        selected: undefined,
        legalTargets: [],
        moves: 0,
        stickers: 0,
        turn: "child",
        pendingPromotion: null,
        lastMove: null,
        lessonComplete: false,
      });
    },

    hint: () => {
      // If nothing selected, auto-select a movable piece (same as before)
      const { engine, selected } = get();
      if (selected) return;
      const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
      const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"] as const;
      for (const r of ranks) {
        for (const f of files) {
          const sq = (f + r) as Square;
          const p = engine.pieceAt(sq);
          if (p && p.color === engine.turn()) {
            const targets = engine.legalMovesFrom(sq);
            if (targets.length) {
              return set({ selected: sq, legalTargets: targets });
            }
          }
        }
      }
    },

    setTurn: (t) => set({ turn: t }),

    botMove: () => {
      const { engine, moves, turn } = get();
      const list = engine.allLegalVerbose();
      if (!list.length) return;

      const pick = list[Math.floor(Math.random() * list.length)];
      // @ts-ignore optional promotion field
      engine.makeMove(pick.from, pick.to, (pick as any).promotion);

      const nextMoves = moves + 1;
      set({
        fen: engine.fen(),
        selected: undefined,
        legalTargets: [],
        moves: nextMoves,
        stickers: awardIfNeeded(nextMoves),
        turn: turn === "child" ? "bot" : "child",
        pendingPromotion: null,
        lastMove: { from: pick.from, to: pick.to },
      });
    },
  };
});
