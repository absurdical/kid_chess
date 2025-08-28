// src/lib/rules/bot.ts
import type { Move, Square } from "chess.js";
import type { Engine } from "./engineAdapter";

export type BotLevel = 1 | 2 | 3 | 4 | 5;

/** Piece values for a simple evaluation (centipawns). */
const VAL: Record<string, number> = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 0, // King value handled implicitly (checkmates not evaluated here)
};

/** Evaluate current position from White's perspective (positive = good for White). */
function evalMaterial(engine: Engine): number {
  // brute force: scan board via FEN parts
  const fen = engine.fen();
  const board = fen.split(" ")[0]; // piece placement
  let score = 0;
  for (const ch of board) {
    if (ch === "/") continue;
    if (/\d/.test(ch)) continue;
    const isWhite = ch === ch.toUpperCase();
    const type = ch.toLowerCase();
    const val = VAL[type] ?? 0;
    score += isWhite ? val : -val;
  }
  return score;
}

/** Do a move, run a callback, then revert via FEN restore. */
function withMove<T>(engine: Engine, mv: Move, fn: () => T): T {
  const fenBefore = engine.fen();
  // @ts-ignore promotion may be optional on Move
  engine.makeMove(mv.from as Square, mv.to as Square, (mv as any).promotion);
  const out = fn();
  engine.load(fenBefore);
  return out;
}

/** 1-ply lookahead evaluation */
function evalAfterMove(engine: Engine, mv: Move): number {
  return withMove(engine, mv, () => evalMaterial(engine));
}

/** Minimax with alpha-beta (very small depth, with node budget). */
function minimax(
  engine: Engine,
  depth: number,
  maximizingFor: "w" | "b",
  alpha: number,
  beta: number,
  nodeBudget: { left: number }
): number {
  if (depth === 0 || nodeBudget.left <= 0) {
    nodeBudget.left--;
    return evalMaterial(engine) * (maximizingFor === "w" ? 1 : -1);
  }

  const moves = engine.allLegalVerbose();
  if (!moves.length) {
    nodeBudget.left--;
    // stalemate or checkmate; rough heuristic:
    return 0;
  }

  if (engine.turn() === maximizingFor) {
    let best = -Infinity;
    for (const mv of moves) {
      if (nodeBudget.left <= 0) break;
      const score = withMove(engine, mv, () =>
        minimax(engine, depth - 1, maximizingFor, alpha, beta, nodeBudget)
      );
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const mv of moves) {
      if (nodeBudget.left <= 0) break;
      const score = withMove(engine, mv, () =>
        minimax(engine, depth - 1, maximizingFor, alpha, beta, nodeBudget)
      );
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

/** Choose a move according to difficulty level. */
export function chooseBotMove(engine: Engine, level: BotLevel): Move | undefined {
  const moves = engine.allLegalVerbose();
  if (!moves.length) return;

  // Level 1 — Beginner: totally random
  if (level === 1) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Level 2 — Casual: prefer captures & checks, else random
  if (level === 2) {
    const captures = moves.filter((m: any) => !!m.captured);
    if (captures.length) return captures[Math.floor(Math.random() * captures.length)];
    const checks = moves.filter((m: any) => (m as any).flags?.includes("+"));
    if (checks.length) return checks[Math.floor(Math.random() * checks.length)];
    return moves[Math.floor(Math.random() * moves.length)];
  }

  // Level 3 — Good: 1-ply evaluation (greedy)
  if (level === 3) {
    let best: Move | undefined;
    let bestScore = -Infinity;
    const sign = engine.turn() === "w" ? 1 : -1;
    for (const m of moves) {
      const score = evalAfterMove(engine, m) * sign;
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
    }
    return best ?? moves[0];
  }

  // Level 4 — Really good: 2-ply minimax with small node budget
  if (level === 4) {
    let best: Move | undefined;
    let bestScore = -Infinity;
    const maximizingFor = engine.turn(); // bot color
    const budget = { left: 1500 }; // small budget to keep it snappy
    for (const m of moves) {
      const score = withMove(engine, m, () =>
        minimax(engine, 1, maximizingFor, -Infinity, Infinity, budget) // depth=1 here gives 2-ply total (this move + one reply)
      );
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
      if (budget.left <= 0) break;
    }
    return best ?? moves[0];
  }

  // Level 5 — “Magnus” (fun label): 3-ply minimax with a tighter budget
  // Note: still lightweight, not a real engine — just stronger than 4.
  {
    let best: Move | undefined;
    let bestScore = -Infinity;
    const maximizingFor = engine.turn();
    const budget = { left: 2500 }; // careful: higher may feel laggy on phones
    for (const m of moves) {
      const score = withMove(engine, m, () =>
        minimax(engine, 2, maximizingFor, -Infinity, Infinity, budget) // ~3-ply total
      );
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
      if (budget.left <= 0) break;
    }
    return best ?? moves[0];
  }
}
