// src/components/chrome/OnboardingTip.tsx
"use client";

import { useEffect, useState } from "react";

const KEY = "kidchess_onboarding_seen";

export default function OnboardingTip() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Guard for SSR + only show once
    if (typeof window === "undefined") return;
    const seen = window.localStorage.getItem(KEY);
    if (!seen) setShow(true);
  }, []);

  const dismiss = () => {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="How to play"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-semibold">How to play</h2>
        <ul className="mt-3 space-y-2 text-[15px] text-neutral-700">
          <li>• Tap a piece → <span className="font-medium">purple dots</span> show moves.</li>
          <li>• Tap a dot to <span className="font-medium">move</span>.</li>
          <li>• Press <span className="font-medium">Hint</span> for a coach arrow + glow.</li>
          <li>• Earn ⭐ stickers as you play!</li>
        </ul>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={dismiss}
            className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
