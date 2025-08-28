// src/app/lessons/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/state/useGameStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LessonsPage() {
  const router = useRouter();
  const lessons = useGameStore((s) => s.lessons);
  const load = useGameStore((s) => s.loadLesson);

  const startLesson = (id: string) => {
    load(id);           // updates store + engine
    router.push("/");   // client-side nav (no full reload)
  };

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
            onClick={() => startLesson(l.id)}
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
