// src/app/lessons/page.tsx
"use client";

import Link from "next/link";
import { useGameStore } from "@/lib/state/useGameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LessonsPage() {
  const lessons = useGameStore((s) => s.lessons);
  const load = useGameStore((s) => s.loadLesson);

  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Lessons</h1>
        <Link href="/" className="text-sm text-purple-600 hover:underline">← Back to game</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((l) => (
          <Card
            key={l.id}
            className="cursor-pointer rounded-2xl transition hover:shadow-md"
            onClick={() => {
              load(l.id);
              window.location.href = "/"; // simple redirect to the board
            }}
          >
            <CardHeader>
              <CardTitle className="text-base">{l.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">{l.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
