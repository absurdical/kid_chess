// src/components/chrome/AppLayout.tsx
import * as React from "react";
import Link from "next/link";
import OnboardingTip from "./OnboardingTip";
import StoreHydrator from "./StoreHydrator"; // <-- add

type AppLayoutProps = { children: React.ReactNode };

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh bg-[rgb(252,252,250)] text-neutral-800">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold">Kid Chess ♟️</h1>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/lessons" className="text-purple-600 hover:underline">Lessons</Link>
            <span className="opacity-70">playful • gentle • simple</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid gap-6 md:grid-cols-[1fr_minmax(260px,320px)]">{children}</div>
      </main>

      {/* overlays & helpers */}
      <OnboardingTip />
      <StoreHydrator /> {/* <-- add */}
    </div>
  );
}
