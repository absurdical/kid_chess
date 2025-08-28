// src/app/page.tsx
import AppLayout from "@/components/chrome/AppLayout";
import ChessBoard from "@/components/board/ChessBoard";
import GameControls from "@/components/controls/GameControls";
import RewardsPanel from "@/components/rewards/RewardsPanel";
import TurnBadge from "@/components/controls/TurnBadge";

export default function Page() {
  return (
    <AppLayout>
      {/* LEFT: Board */}
      <section>
        <ChessBoard />
      </section>

      {/* RIGHT: Controls + Turn + Rewards */}
      <aside className="space-y-4">
        <TurnBadge />
        <GameControls />
        <RewardsPanel />
      </aside>
    </AppLayout>
  );
}
