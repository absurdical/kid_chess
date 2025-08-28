"use client";
import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useGameStore } from "@/lib/state/useGameStore";

export default function ConfettiBurst() {
  const stickers = useGameStore((s) => s.stickers);
  const prev = useRef(stickers);

  useEffect(() => {
    if (stickers > prev.current) {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.35 },
        scalar: 0.8,
      });
    }
    prev.current = stickers;
  }, [stickers]);

  return null;
}
