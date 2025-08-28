// src/components/rewards/RewardsPanel.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameStore } from "@/lib/state/useGameStore";
import ConfettiBurst from "./ConfettiBurst";
import { motion } from "framer-motion";

export default function RewardsPanel() {
  const stickers = useGameStore((s) => s.stickers);
  const max = useGameStore((s) => s.maxStickers);
  const slots = Array.from({ length: max }, (_, i) => i);

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">⭐ Sticker Rewards</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((i) => {
            const filled = i < stickers;
            const isNewest = i === stickers - 1; // the star just earned

            return (
              <motion.div
                key={i}
                className="flex aspect-square items-center justify-center rounded-xl border bg-neutral-50"
                initial={false}
                animate={isNewest ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <span className={`text-3xl ${filled ? "opacity-100" : "opacity-30"}`} aria-hidden>
                  ⭐
                </span>
              </motion.div>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          Earn a star every 5 actions. Restart resets your chart.
        </p>
      </CardContent>

      {/* confetti when stickers increase */}
      <ConfettiBurst />
    </Card>
  );
}
