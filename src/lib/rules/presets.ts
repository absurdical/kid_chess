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
  id: "rook-ladder",
  title: "Rook Ladder",
  description: "Climb the rook up to a8.",
  fen: "4k3/8/8/8/8/8/R6P/4K3 w - - 0 1",
  goal: { type: "reach", targets: ["a8"] },
},
{
  id: "knight-to-c3",
  title: "Knight to c3",
  description: "Hop the knight to the star!",
  fen: "4k3/8/8/8/8/8/8/RN2K3 w - - 0 1",
  goal: { type: "reach", targets: ["c3"] },
},
{
  id: "capture-d5",
  title: "Capture d5",
  description: "Take the pawn on d5.",
  fen: "4k3/8/8/3p4/2B5/8/8/4K3 w - - 0 1",
  goal: { type: "capture", targets: ["d5"] },
},
{
  id: "check-the-king",
  title: "Check the King",
  description: "Give check to the black king once.",
  fen: "4k3/8/8/8/8/8/8/3QK3 w - - 0 1",
  goal: { type: "check", side: "b" },
},
// New ones:
{
  id: "queen-path",
  title: "Queen Path",
  description: "Guide the queen to h5.",
  fen: "4k3/8/8/8/8/8/7P/3QK3 w - - 0 1",
  goal: { type: "reach", targets: ["h5"] },
},
{
  id: "two-captures",
  title: "Two Captures",
  description: "Clear both pawns on c6 and f6.",
  fen: "4k3/2p2p2/8/8/8/8/7P/3QK3 w - - 0 1",
  goal: { type: "capture", targets: ["c7","f7"] }, // note: squares must match where you placed pawns
},
{
  id: "promote-a-pawn",
  title: "Promote a Pawn",
  description: "March the pawn to become a queen!",
  fen: "4k3/8/8/8/8/8/P6P/4K3 w - - 0 1",
  goal: { type: "reach", targets: ["a8"] }, // reaching last rank will trigger your promotion dialog
},
{
  id: "deliver-check-using-bishop",
  title: "Bishop Check",
  description: "Use your bishop to give check.",
  fen: "4k3/8/8/8/8/8/7P/2B1K3 w - - 0 1",
  goal: { type: "check", side: "b" },
},
];
