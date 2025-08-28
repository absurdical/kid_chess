// src/lib/rules/scoring.ts
import type { Engine } from "./engineAdapter";
import type { Lesson } from "./presets";

export function checkGoalMet(engine: Engine, lesson: Lesson): boolean {
  const sideToMove = engine.turn(); // after the move this will have toggled
  switch (lesson.goal.type) {
    case "reach": {
      // If any target square now has a piece of the *other* side (the mover), count as reached.
      const targets = lesson.goal.targets ?? [];
      for (const sq of targets) {
        const p = engine.pieceAt(sq as any);
        if (p && p.color !== sideToMove) return true; // the mover just placed a piece there
      }
      return false;
    }
    case "capture": {
      // Goal squares should now be empty (captured)
      const targets = lesson.goal.targets ?? [];
      return targets.every((sq) => !engine.pieceAt(sq as any));
    }
    case "check": {
      const side = lesson.goal.side ?? "b";
      // If the target side is in check, success.
      // Quick way: engine.inCheck() only tells if *side to move* is in check.
      // So: clone by fen and flip move side, or infer via turn.
      // Easier: we can check both: if it's black to move and inCheck -> success for checking black just happened.
      // Or: if it's white to move and inCheck -> success for checking white.
      const isInCheck = engine.inCheck();
      if (!isInCheck) return false;
      // inCheck refers to side to move. If sideToMove === 'b' and inCheck === true, black is in check now.
      return sideToMove === "b" ? side === "b" : side === "w";
    }
    default:
      return false;
  }
}
