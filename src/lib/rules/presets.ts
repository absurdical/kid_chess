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
    side?: "w" | "b";          // for "check": which king should be in check
  };
};

export const LESSONS: Lesson[] = [
  {
    id: "rook-runner",
    title: "Rook Runner",
    description: "Move the rook to the star square.",
    // White: K e1, R a1, (optional) pawn h2; Black: K e8. Target a8.
    fen: "4k3/8/8/8/8/8/R6P/4K3 w - - 0 1",
    goal: { type: "reach", targets: ["a8"] },
  },
  {
    id: "knight-hops",
    title: "Knight Hops",
    description: "Hop the knight to the star!",
    // White: K e1, N b1; Black: K e8. Target c3.
    fen: "4k3/8/8/8/8/8/8/RN2K3 w - - 0 1",
    goal: { type: "reach", targets: ["c3"] },
  },
  {
    id: "first-capture",
    title: "First Capture",
    description: "Capture the pawn on d5.",
    // White: K e1, B c4; Black: K e8, pawn d5. Target d5 (should become empty after capture).
    fen: "4k3/8/8/3p4/2B5/8/8/4K3 w - - 0 1",
    goal: { type: "capture", targets: ["d5"] },
  },
  {
    id: "deliver-check",
    title: "Deliver Check",
    description: "Give check to the black king once.",
    // White: K e1, Q d1; Black: K e8. Goal: black king in check.
    fen: "4k3/8/8/8/8/8/8/3QK3 w - - 0 1",
    goal: { type: "check", side: "b" },
  },
];
