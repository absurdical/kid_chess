// src/components/chrome/StoreHydrator.tsx
"use client";

import { useEffect } from "react";
import { useGameStore } from "@/lib/state/useGameStore";

const KEY_BOT = "kidchess_bot_level";
const KEY_LESSON = "kidchess_current_lesson";

export default function StoreHydrator() {
  const setBotLevel = useGameStore((s) => s.setBotLevel);
  const botLevel = useGameStore((s) => s.botLevel);

  const loadLesson = useGameStore((s) => s.loadLesson);
  const exitLesson = useGameStore((s) => s.exitLesson);
  const currentLesson = useGameStore((s) => s.currentLesson);

  // 1) Hydrate once on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const lv = window.localStorage.getItem(KEY_BOT);
      if (lv) {
        const n = Number(lv);
        if ([1, 2, 3, 4, 5].includes(n)) setBotLevel(n as any);
      }
    } catch {}

    try {
      const lessonId = window.localStorage.getItem(KEY_LESSON);
      if (lessonId) {
        loadLesson(lessonId);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Persist whenever botLevel changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(KEY_BOT, String(botLevel));
    } catch {}
  }, [botLevel]);

  // 3) Persist current lesson id (or clear on exit)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const id = currentLesson?.id ?? "";
      if (id) {
        window.localStorage.setItem(KEY_LESSON, id);
      } else {
        window.localStorage.removeItem(KEY_LESSON);
      }
    } catch {}
  }, [currentLesson]);

  return null;
}
