// src/components/board/Piece.tsx
import { pieceSVG } from "./svgPieces";

export default function Piece({ type, color }: { type: string; color: "w" | "b" }) {
  return (
    <div className="pointer-events-none select-none text-center">
      {pieceSVG(type, color)}
    </div>
  );
}
