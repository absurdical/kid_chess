"use client";
import { useGameStore } from "@/lib/state/useGameStore";

export default function GameOverDialog() {
  const gameOver = useGameStore((s) => s.gameOver);
  const kind = useGameStore((s) => s.gameOverKind);
  const winner = useGameStore((s) => s.winner);
  const restart = useGameStore((s) => s.restartGame);
  const dismiss = useGameStore((s) => s.dismissGameOver);

  if (!gameOver) return null;

  const title =
    kind === "checkmate"
      ? winner === "child"
        ? "Checkmate! You win! ⭐"
        : "Checkmate — Good game!"
      : kind === "stalemate"
      ? "Stalemate — It’s a tie!"
      : "Draw — It’s a tie!";

  return (
    <div className="fixed inset-0 z-[55] grid place-items-center bg-black/40 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-2 text-neutral-700">
          {kind === "checkmate"
            ? winner === "child"
              ? "Great job! Want to play again?"
              : "That was tricky! Want to try again?"
            : "Nice play! Want to try another game?"}
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={() => {
              dismiss();
              restart();
            }}
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
