// src/lib/rules/presets.ts
export type GoalType = "reach" | "capture" | "check";

export type Lesson = {
  id: string;
  title: string;
  description: string;
  fen: string;                 // starting position
  goal: {
    type: GoalType;
    targets?: string[];        // for "reach": squares to reach; for "capture": piece squares
    side?: "w" | "b";          // for "check": which king to check (default 'b')
  };
};

export const LESSONS: Lesson[] = [
  {
    id: "rook-runner",
    title: "Rook Runner",
    description: "Move the rook to the star square.",
    // White: king e1, rook a1; Black: king e8; star on a8 (we’ll render the star at targets)
    fen: "4k3/8/8/8/8/8/R6P/4K3 w - - 0 1",
    goal: { type: "reach", targets: ["a8"] },
  },
  {
    id: "knight-hops",
    title: "Knight Hops",
    description: "Hop the knight to the star!",
    // White knight at b1, king e1; Black king e8; target c3
    fen: "4k3/8/8/8/8/2N5/7P/R3K3 w - - 0 1".replace("2N5","8").replace("R3K3","R3K3"), // placeholder—override below
    goal: { type: "reach", targets: ["c3"] },
  },
  {
    id: "first-capture",
    title: "First Capture",
    description: "Capture the pawn on d5.",
    // White king e1, bishop c4; Black pawn d5, king e8
    fen: "4k3/8/8/3p4/2B5/8/7P/4K3 w - - 0 1",
    goal: { type: "capture", targets: ["d5"] },
  },
  {
    id: "deliver-check",
    title: "Deliver Check",
    description: "Give check to the black king once.",
    // White queen d1; Black king e8; simple open board
    fen: "4k3/8/8/8/8/8/7P/3QK3 w - - 0 1",
    goal: { type: "check", side: "b" },
  },
];

// Fix the knight lesson FEN cleanly (b1 knight, c3 target is visual only)
LESSONS[1].fen = "4k3/8/8/8/8/8/7P/RNBQKBNR w KQ - 0 1".replace("RNBQKBNR","R1BQKBNR").replace("R1BQKBNR","R1BQKBNR"); 
// Start from a default-ish base is okay; the key is the current side and a knight on b1.
LESSONS[1].fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPP1/RNBQKBNR w KQkq - 0 1"; // pawn missing at h2 to avoid stalemates; knight at b1 exists
