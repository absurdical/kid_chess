"use client";
import { useGameStore } from "@/lib/state/useGameStore";

export default function LessonCompleteDialog() {
  const done = useGameStore((s) => s.lessonComplete);
  const exit = useGameStore((s) => s.exitLesson);
  const restart = useGameStore((s) => s.restartGame);
  const lesson = useGameStore((s) => s.currentLesson);

  if (!done || !lesson) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-xl font-semibold">Great job!</h3>
        <p className="mt-1 text-neutral-700">
          You finished “{lesson.title}”.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={restart}
            className="rounded-xl border px-4 py-2 text-sm hover:bg-neutral-50"
          >
            Repeat
          </button>
          <button
            onClick={exit}
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
          >
            Back to game
          </button>
        </div>
      </div>
    </div>
  );
}
