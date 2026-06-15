import { DriverLicenseCard } from "@/components/cards/DriverLicenseCard";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { SegmentedProgressBar } from "@/components/ui/SegmentedProgressBar";
import { standingColor, standingLabel } from "@/lib/dmv";
import { usePlayerStore } from "@/store/usePlayerStore";
import { ArrowLeft } from "lucide-react";
import { dmvBackBtn, dmvSectionLabel, dmvTwoCol } from "./dmv-layout";
import type { DmvView } from "./DmvDashboard";

interface DmvRecordViewProps {
  onNavigate: (view: DmvView) => void;
}

const CITATION_PRESETS = [
  { name: "Speeding", points: 2, location: "MIRROR PARK BLVD" },
  { name: "Ran Red Light", points: 3, location: "VINEWOOD BLVD" },
  { name: "Reckless Driving", points: 4, location: "DEL PERRO FWY" },
  { name: "Vehicle Collision", points: 3, location: "STRAWBERRY AVE" },
  { name: "Flying Violation", points: 3, location: "LSIA AIRSPACE" },
  { name: "Police Citation", points: 2, location: "MISSION ROW" },
  { name: "Harsh Braking", points: 1, location: "ROCKFORD HILLS" },
] as const;

export function DmvRecordView({ onNavigate }: DmvRecordViewProps) {
  const dmvRecord = usePlayerStore((s) => s.dmvRecord);
  const addViolation = usePlayerStore((s) => s.addViolation);
  const expungeViolation = usePlayerStore((s) => s.expungeViolation);
  const clearRecord = usePlayerStore((s) => s.clearRecord);
  const renewLicense = usePlayerStore((s) => s.renewLicense);
  const standingClr = standingColor(dmvRecord.standing);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="space-y-5">
      <button type="button" onClick={() => onNavigate("dashboard")} className={dmvBackBtn}>
        <ArrowLeft className="size-4" />
        Back to Dashboard
      </button>

      <div className={dmvTwoCol}>
        <div className="space-y-5">
          <div>
            <h2 className="font-display text-xl font-semibold text-[var(--tx)]">
              Driver Profile / License Record
            </h2>
          </div>

          <DriverLicenseCard />

          <GlassCard className="p-0">
            <div className={`border-b border-[var(--bd)] px-5 py-3 ${dmvSectionLabel}`}>
              Violation History
            </div>
            {dmvRecord.violations.length === 0 ? (
              <p className="px-5 py-8 text-sm text-[var(--tx-2)]">
                No active violations on record.
              </p>
            ) : (
              <ul>
                {dmvRecord.violations.map((v) => (
                  <li
                    key={v.id}
                    className="flex items-start justify-between gap-3 border-b border-[var(--bd)] px-5 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-[var(--tx)]">{v.name}</div>
                      <div className="text-xs text-[var(--tx-2)]">
                        {v.date} · {v.location}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-start gap-3">
                      <span className="font-mono text-sm text-[var(--c-orange)]">+{v.points}</span>
                      <button
                        type="button"
                        onClick={() => expungeViolation(v.id)}
                        className="text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] hover:text-[var(--tx)]"
                      >
                        Expunge
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>

        <div className="space-y-5">
          <GlassCard className="space-y-4">
            <div>
              <div className={dmvSectionLabel}>Standing</div>
              <div className="font-display text-lg font-semibold" style={{ color: standingClr }}>
                {standingLabel(dmvRecord.standing)}
              </div>
            </div>
            <SegmentedProgressBar points={dmvRecord.points} />
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className={dmvSectionLabel}>Renewal Status</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--tx-3)]">
                  Days Until Expiry
                </div>
                <div className="font-mono text-[var(--tx)]">{dmvRecord.expiryDays}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--tx-3)]">
                  Expiry Date
                </div>
                <div className="font-mono text-[var(--tx)]">{dmvRecord.expiryDate}</div>
              </div>
            </div>
            <NeonButton className="w-full" onClick={renewLicense}>
              Schedule Renewal
            </NeonButton>
          </GlassCard>

          <GlassCard className="space-y-4">
            <div className={dmvSectionLabel}>Simulate Citation</div>
            <div className="grid grid-cols-1 gap-2">
              {CITATION_PRESETS.map((c) => (
                <NeonButton
                  key={c.name}
                  size="sm"
                  variant="secondary"
                  className="h-auto min-h-8 whitespace-normal py-2 text-center text-xs"
                  onClick={() =>
                    addViolation({
                      name: c.name,
                      points: c.points,
                      date: today,
                      location: c.location,
                    })
                  }
                >
                  +{c.points} {c.name.toUpperCase()}
                </NeonButton>
              ))}
            </div>
            <NeonButton variant="danger" className="w-full" onClick={clearRecord}>
              Clear Record
            </NeonButton>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
