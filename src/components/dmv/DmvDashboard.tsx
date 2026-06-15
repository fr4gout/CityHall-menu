import { DriverLicenseCard } from "@/components/cards/DriverLicenseCard";
import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { SegmentedProgressBar } from "@/components/ui/SegmentedProgressBar";
import { standingColor, standingLabel } from "@/lib/dmv";
import { usePlayerStore } from "@/store/usePlayerStore";
import { BookOpen, Car, ChevronRight, ClipboardList } from "lucide-react";
import { dmvActionRow, dmvSectionLabel, dmvTwoCol } from "./dmv-layout";

export type DmvView = "dashboard" | "record" | "theory" | "practical";

interface DmvDashboardProps {
  onNavigate: (view: DmvView) => void;
}

export function DmvDashboard({ onNavigate }: DmvDashboardProps) {
  const dmvRecord = usePlayerStore((s) => s.dmvRecord);
  const expungeViolation = usePlayerStore((s) => s.expungeViolation);
  const recent = dmvRecord.violations.slice(0, 3);
  const standingClr = standingColor(dmvRecord.standing);

  return (
    <div className={dmvTwoCol}>
      <div className="space-y-5">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--tx)]">
            Government Driver Certification Terminal
          </h2>
          <p className="mt-1 text-sm text-[var(--tx-2)]">
            Complete theory and practical evaluations, manage your license record, and track
            violation points.
          </p>
        </div>

        <DriverLicenseCard />

        <div className="grid gap-3">
          <GlassCard className={dmvActionRow}>
            <div className="flex min-w-0 items-start gap-3">
              <BookOpen className="mt-0.5 size-5 shrink-0 text-[var(--primary)]" />
              <div className="min-w-0">
                <div className="font-medium text-[var(--tx)]">Theory Examination</div>
                <p className="mt-0.5 text-xs text-[var(--tx-2)]">
                  Multi-format certification quiz with timer and live scoring.
                </p>
              </div>
            </div>
            <NeonButton size="sm" className="shrink-0" onClick={() => onNavigate("theory")}>
              Start Exam
            </NeonButton>
          </GlassCard>

          <GlassCard className={dmvActionRow}>
            <div className="flex min-w-0 items-start gap-3">
              <Car className="mt-0.5 size-5 shrink-0 text-[var(--c-orange)]" />
              <div className="min-w-0">
                <div className="font-medium text-[var(--tx)]">Practical Evaluation</div>
                <p className="mt-0.5 text-xs text-[var(--tx-2)]">
                  Live driving HUD: instructions, violations, route checkpoints.
                </p>
              </div>
            </div>
            <NeonButton
              size="sm"
              variant="secondary"
              className="shrink-0"
              onClick={() => onNavigate("practical")}
            >
              Start Test
            </NeonButton>
          </GlassCard>

          <GlassCard className={dmvActionRow}>
            <div className="flex min-w-0 items-start gap-3">
              <ClipboardList className="mt-0.5 size-5 shrink-0 text-[var(--tx-2)]" />
              <div className="min-w-0">
                <div className="font-medium text-[var(--tx)]">License Record</div>
                <p className="mt-0.5 text-xs text-[var(--tx-2)]">
                  View points, violations and renewal status.
                </p>
              </div>
            </div>
            <NeonButton
              size="sm"
              variant="ghost"
              className="shrink-0"
              onClick={() => onNavigate("record")}
            >
              View Record
            </NeonButton>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="space-y-5">
        <div>
          <div className={dmvSectionLabel}>License Standing</div>
          <div className="mt-1 font-display text-lg font-semibold" style={{ color: standingClr }}>
            {standingLabel(dmvRecord.standing)}
          </div>
        </div>

        <SegmentedProgressBar points={dmvRecord.points} />

        <div>
          <div className={`mb-3 ${dmvSectionLabel}`}>Recent Violations</div>
          {recent.length === 0 ? (
            <p className="text-sm text-[var(--tx-2)]">No active violations on record.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((v) => (
                <li
                  key={v.id}
                  className="flex items-start justify-between gap-2 border border-[var(--bd)] bg-[var(--bg-row)] p-3 control-radius"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase"
                        style={{
                          color: "var(--c-orange)",
                          backgroundColor: "color-mix(in srgb, var(--c-orange) 15%, transparent)",
                        }}
                      >
                        +{v.points} {v.name}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-[var(--tx-2)]">{v.date}</div>
                    <div className="text-xs text-[var(--tx-3)]">{v.location}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => expungeViolation(v.id)}
                    className="shrink-0 self-start text-[10px] font-semibold uppercase tracking-wider text-[var(--primary)] hover:text-[var(--tx)]"
                  >
                    Expunge
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <NeonButton
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2"
          onClick={() => onNavigate("record")}
        >
          Full Record
          <ChevronRight className="size-4" />
        </NeonButton>
      </GlassCard>
    </div>
  );
}
