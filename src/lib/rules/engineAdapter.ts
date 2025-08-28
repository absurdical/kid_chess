// src/lib/rules/engineAdapter.ts
import { Chess, type Square, type Move } from "chess.js";

export type Engine = {
  load: (fen?: string) => void;
  fen: () => string;
  turn: () => "w" | "b";
  pieceAt: (sq: Square) => { type: string; color: "w" | "b" } | null;
  legalMovesFrom: (sq: Square) => Square[];
  legalMovesVerboseFrom: (sq: Square) => Move[];
  allLegalVerbose: () => Move[];
  makeMove: (from: Square, to: Square, promotion?: "q" | "r" | "b" | "n") => boolean;
  undo: () => boolean;
  inCheck: () => boolean;
  gameOver: () => boolean;
};

export function createEngine(initialFen?: string): Engine {
  const game = new Chess(initialFen);

  return {
    load: (fen) => {
      if (fen) {
        game.load(fen);
      } else {
        game.reset(); // start position
      }
    },
    fen: () => game.fen(),
    turn: () => game.turn(),
    pieceAt: (sq) => {
      const p = game.get(sq);
      return p ? { type: p.type, color: p.color } : null;
    },
    legalMovesFrom: (sq) => {
      const ms = game.moves({ square: sq, verbose: true }) as Move[];
      return ms.map((m) => m.to as Square);
    },
    legalMovesVerboseFrom: (sq) => game.moves({ square: sq, verbose: true }) as Move[],
    allLegalVerbose: () => game.moves({ verbose: true }) as Move[],
    makeMove: (from, to, promotion) => !!game.move({ from, to, promotion }),
    undo: () => !!game.undo(),
    inCheck: () => game.inCheck(),
    gameOver: () => game.isGameOver(),
  };
}
