import { createFileRoute } from "@tanstack/react-router";
import { DmvDashboard, type DmvView } from "@/components/dmv/DmvDashboard";
import { DmvPracticalEval } from "@/components/dmv/DmvPracticalEval";
import { DmvRecordView } from "@/components/dmv/DmvRecordView";
import { DmvTheoryExam } from "@/components/dmv/DmvTheoryExam";
import { usePlayerStore } from "@/store/usePlayerStore";
import { useState } from "react";

export const Route = createFileRoute("/dmv")({
  head: () => ({ meta: [{ title: "DMV Terminal — City Hall" }] }),
  component: DmvPage,
});

function DmvPage() {
  const player = usePlayerStore((s) => s.player);
  const [activeView, setActiveView] = useState<DmvView>("dashboard");

  if (!player) {
    return <div className="text-[var(--tx-2)]">Loading…</div>;
  }

  switch (activeView) {
    case "dashboard":
      return <DmvDashboard onNavigate={setActiveView} />;
    case "record":
      return <DmvRecordView onNavigate={setActiveView} />;
    case "theory":
      return <DmvTheoryExam onNavigate={setActiveView} />;
    case "practical":
      return <DmvPracticalEval onNavigate={setActiveView} />;
    default: {
      const _exhaustive: never = activeView;
      return _exhaustive;
    }
  }
}
