// src/lib/state/useGameStore.ts
import { create } from "zustand";
import type { Square } from "chess.js";
import { createEngine, type Engine } from "@/lib/rules/engineAdapter";
import { LESSONS, type Lesson } from "@/lib/rules/presets";
import { checkGoalMet } from "@/lib/rules/scoring";
import { chooseBotMove, type BotLevel } from "@/lib/rules/bot";

type Turn = "child" | "bot";
type PendingPromotion = {
  from: Square;
  to: Square;
  options: Array<"q" | "r" | "b" | "n">;
} | null;

type HintArrow = { from: Square; to: Square } | null;

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

  // hint
  hintArrow: HintArrow;
  hint: () => void;
  clearHint: () => void;

  // meta / kid delight
  moves: number;
  stickers: number;
  turn: Turn;
  stickerEvery: number;
  maxStickers: number;

  // bot difficulty
  botLevel: BotLevel;
  setBotLevel: (level: BotLevel) => void;

  // actions
  loadLesson: (id: string) => void;
  exitLesson: () => void;

  selectSquare: (sq: Square) => void;
  tryMove: (to: Square) => void;
  confirmPromotion: (p: "q" | "r" | "b" | "n") => void;
  cancelSelection: () => void;

  undoMove: () => void;
  restartGame: () => void;
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
      if (currentLesson) return; // no bot in lessons
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

    // hint
    hintArrow: null,
    clearHint: () => set({ hintArrow: null }),
    hint: () => {
      const { engine, currentLesson } = get();
      const all = engine.allLegalVerbose();
      if (!all.length) return;

      if (currentLesson && (currentLesson.goal.type === "reach" || currentLesson.goal.type === "capture")) {
        const targets = currentLesson.goal.targets ?? [];
        const targetMove = all.find((m: any) => targets.includes(m.to));
        if (targetMove) return set({ hintArrow: { from: targetMove.from, to: targetMove.to } });
      }

      const capture = all.find((m: any) => (m as any).captured);
      if (capture) return set({ hintArrow: { from: capture.from, to: capture.to } });

      const pick = all[Math.floor(Math.random() * all.length)];
      set({ hintArrow: { from: pick.from, to: pick.to } });
    },

    moves: 0,
    stickers: 0,
    turn: "child",
    stickerEvery: 5,
    maxStickers: 4,

    // bot difficulty
    botLevel: 1,
    setBotLevel: (level) => set({ botLevel: level }),

    loadLesson: (id) => {
      const lesson = get().lessons.find((l) => l.id === id) ?? null;
      if (!lesson) return;
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
        hintArrow: null,
      });
      reloadFen();
    },

    exitLesson: () => {
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
        hintArrow: null,
      });
      reloadFen();
    },

    selectSquare: (sq) => {
      const piece = get().engine.pieceAt(sq);
      if (!piece) {
        return set({ selected: undefined, legalTargets: [], pendingPromotion: null, hintArrow: null });
      }
      if (piece.color !== get().engine.turn()) {
        return set({ selected: undefined, legalTargets: [], pendingPromotion: null, hintArrow: null });
      }
      const legalTargets = get().engine.legalMovesFrom(sq);
      set({ selected: sq, legalTargets, pendingPromotion: null, hintArrow: null });
    },

    tryMove: (to) => {
      const { engine, selected, moves, turn, currentLesson } = get();
      if (!selected) return;

      const verbose = engine.legalMovesVerboseFrom(selected);
      const candidate = verbose.find((m: any) => m.to === to);
      if (!candidate) return;

      if ((candidate as any).promotion) {
        return set({
          pendingPromotion: { from: selected, to, options: ["q", "r", "b", "n"] },
          hintArrow: null,
        });
      }

      const ok = engine.makeMove(selected, to);
      if (!ok) return;

      const nextMoves = moves + 1;

      let lessonComplete = false;
      if (currentLesson) lessonComplete = checkGoalMet(engine, currentLesson);

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
        hintArrow: null,
      });

      if (!currentLesson) scheduleBotIfNeeded();
    },

    confirmPromotion: (p) => {
      const { engine, pendingPromotion, moves, turn, currentLesson } = get();
      if (!pendingPromotion) return;

      const ok = engine.makeMove(pendingPromotion.from, pendingPromotion.to, p);
      if (!ok) return;

      const nextMoves = moves + 1;

      let lessonComplete = false;
      if (currentLesson) lessonComplete = checkGoalMet(engine, currentLesson);

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
        hintArrow: null,
      });

      if (!currentLesson) scheduleBotIfNeeded();
    },

    cancelSelection: () =>
      set({ selected: undefined, legalTargets: [], pendingPromotion: null, hintArrow: null }),

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
        hintArrow: null,
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
        hintArrow: null,
      });
    },

    setTurn: (t) => set({ turn: t }),

    botMove: () => {
      const { engine, moves, turn, botLevel } = get();
      const pick = chooseBotMove(engine, botLevel);
      if (!pick) return;

      // @ts-ignore promotion optional
      engine.makeMove(pick.from as Square, pick.to as Square, (pick as any).promotion);

      const nextMoves = moves + 1;
      set({
        fen: engine.fen(),
        selected: undefined,
        legalTargets: [],
        moves: nextMoves,
        stickers: awardIfNeeded(nextMoves),
        turn: turn === "child" ? "bot" : "child",
        pendingPromotion: null,
        lastMove: { from: pick.from as Square, to: pick.to as Square },
        hintArrow: null,
      });
    },
  };
});
