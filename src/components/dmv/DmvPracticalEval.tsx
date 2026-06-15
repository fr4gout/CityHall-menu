import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { usePlayerStore } from "@/store/usePlayerStore";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { DmvView } from "./DmvDashboard";
import { DynamicSpeedometer } from "./DynamicSpeedometer";
import { dmvBackBtn, dmvHudRow, dmvSectionLabel, dmvTelemetryBar } from "./dmv-layout";
import { hudItem, hudStagger } from "./dmv-motion";
import { AnimatedDamageBar, AnimatedDrivingScore } from "./TelemetryHudMetrics";

type PracticalStep = "intro" | "active" | "result";

interface Checkpoint {
  instruction: string;
  examiner: string;
  speedLimit: number;
  remaining: number;
}

const CHECKPOINTS: Checkpoint[] = [
  {
    instruction: "Pull out of the DMV lot and merge with traffic.",
    examiner: "Examiner Hayes seated. Begin when ready.",
    speedLimit: 35,
    remaining: 4.2,
  },
  {
    instruction: "Turn right onto Vinewood Boulevard.",
    examiner: "Signal early and check your blind spot.",
    speedLimit: 40,
    remaining: 3.5,
  },
  {
    instruction: "Maintain safe distance behind the lead vehicle.",
    examiner: "Keep two-car lengths minimum.",
    speedLimit: 45,
    remaining: 2.8,
  },
  {
    instruction: "Speed restriction zone. Slow down for speed bump.",
    examiner: "Reduce speed — obstacle ahead.",
    speedLimit: 15,
    remaining: 1.9,
  },
  {
    instruction: "Enter the freeway and accelerate to match traffic speed.",
    examiner: "Merge smoothly into the right lane.",
    speedLimit: 65,
    remaining: 1.1,
  },
  {
    instruction: "Exit freeway and return to DMV parking lot.",
    examiner: "Decelerate and prepare to exit.",
    speedLimit: 35,
    remaining: 0.4,
  },
  {
    instruction: "Align vehicle in designated bay and turn off engine.",
    examiner: "Final checkpoint — park centered in the bay.",
    speedLimit: 15,
    remaining: 0.0,
  },
];

const CP_INTERVAL_MS = 5000;
const TICK_MS = 100;
const PASS_SCORE = 75;

interface DmvPracticalEvalProps {
  onNavigate: (view: DmvView) => void;
}

export function DmvPracticalEval({ onNavigate }: DmvPracticalEvalProps) {
  const addViolation = usePlayerStore((s) => s.addViolation);
  const setDrivingLicenseActive = usePlayerStore((s) => s.setDrivingLicenseActive);

  const [step, setStep] = useState<PracticalStep>("intro");
  const [cpIndex, setCpIndex] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [damage, setDamage] = useState(0);
  const [score, setScore] = useState(100);
  const [mistakes, setMistakes] = useState(0);
  const [licensePointsAdded, setLicensePointsAdded] = useState(0);
  const [cp3ViolationTriggered, setCp3ViolationTriggered] = useState(false);
  const [showCp3Alert, setShowCp3Alert] = useState(false);

  const cp3OverSpeedMs = useRef(0);
  const elapsedMs = useRef(0);
  const pointsApplied = useRef(false);
  const speedRef = useRef(0);
  const [tick, setTick] = useState(0);

  const cp = CHECKPOINTS[cpIndex] ?? CHECKPOINTS[CHECKPOINTS.length - 1];
  const progressPct = Math.round((cpIndex / (CHECKPOINTS.length - 1)) * 100);

  const endTest = useCallback(() => {
    setStep("result");
  }, []);

  const applyCp3Penalty = useCallback(() => {
    if (cp3ViolationTriggered) return;
    setCp3ViolationTriggered(true);
    setShowCp3Alert(true);
    setMistakes((m) => m + 1);
    setScore((s) => Math.max(0, s - 8));
    setLicensePointsAdded((p) => p + 2);
    addViolation({
      name: "Speed Bump Violation",
      points: 2,
      date: new Date().toISOString().slice(0, 10),
      location: "DMV TEST ROUTE CP3",
    });
    window.setTimeout(() => setShowCp3Alert(false), 2000);
  }, [addViolation, cp3ViolationTriggered]);

  const startTest = useCallback(() => {
    setCpIndex(0);
    setSpeed(0);
    setDamage(0);
    setScore(100);
    setMistakes(0);
    setLicensePointsAdded(0);
    setCp3ViolationTriggered(false);
    setShowCp3Alert(false);
    cp3OverSpeedMs.current = 0;
    elapsedMs.current = 0;
    pointsApplied.current = false;
    setStep("active");
  }, []);

  useEffect(() => {
    if (step !== "active") return;

    const id = window.setInterval(() => {
      elapsedMs.current += TICK_MS;

      if (elapsedMs.current % CP_INTERVAL_MS === 0 && cpIndex < CHECKPOINTS.length - 1) {
        setCpIndex((i) => Math.min(i + 1, CHECKPOINTS.length - 1));
      }

      setSpeed((prev) => {
        const target = cp.speedLimit;
        const noise = (Math.random() - 0.5) * 6;
        const next = Math.max(0, Math.round(prev + (target - prev) * 0.08 + noise));
        speedRef.current = next;

        if (cpIndex === 3 && !cp3ViolationTriggered && next > 15) {
          cp3OverSpeedMs.current += TICK_MS;
          if (cp3OverSpeedMs.current >= 4000) {
            applyCp3Penalty();
          }
        } else if (cpIndex !== 3 || next <= 15) {
          cp3OverSpeedMs.current = 0;
        }

        return next;
      });

      setDamage((d) => Math.min(100, d + (Math.random() > 0.97 ? 1 : 0)));
      setTick((t) => t + 1);

      if (
        cpIndex >= CHECKPOINTS.length - 1 &&
        elapsedMs.current > CP_INTERVAL_MS * CHECKPOINTS.length
      ) {
        endTest();
      }
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [step, cpIndex, cp.speedLimit, cp3ViolationTriggered, applyCp3Penalty, endTest]);

  useEffect(() => {
    if (step !== "result" || pointsApplied.current) return;
    pointsApplied.current = true;
    const passed = score >= PASS_SCORE;
    if (passed) {
      setDrivingLicenseActive();
    }
  }, [step, score, setDrivingLicenseActive]);

  const passed = score >= PASS_SCORE;

  if (step === "intro") {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <button type="button" onClick={() => onNavigate("dashboard")} className={dmvBackBtn}>
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </button>

        <GlassCard className="space-y-5">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--c-orange)]">
              Certification Module 02
            </div>
            <h2 className="font-display text-xl font-semibold text-[var(--tx)]">
              Practical Driving Evaluation
            </h2>
            <p className="mt-2 text-sm text-[var(--tx-2)]">
              A simulated road test with live HUD overlay. The examiner will issue instructions,
              monitor your speed and braking, and dock points for any traffic violations.
            </p>
          </div>

          <ul className="space-y-2 text-sm text-[var(--tx-2)]">
            {[
              "Real-time examiner instructions",
              "Six route checkpoints",
              "Speed limit and braking detection",
              "Live driving score and license points",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[var(--c-orange)]" />
                {item}
              </li>
            ))}
          </ul>

          <NeonButton
            className="w-full border-[var(--c-orange)]/50"
            style={{ boxShadow: "0 0 16px color-mix(in srgb, var(--c-orange) 25%, transparent)" }}
            onClick={startTest}
          >
            Start Practical
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  if (step === "result") {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <GlassCard className="space-y-5 text-center">
          <div
            className="mx-auto inline-block rounded-full border px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em]"
            style={{
              color: passed ? "var(--c-green)" : "var(--c-red)",
              borderColor: passed ? "var(--c-green)" : "var(--c-red)",
              boxShadow: passed
                ? "0 0 24px color-mix(in srgb, var(--c-green) 40%, transparent)"
                : "0 0 24px color-mix(in srgb, var(--c-red) 40%, transparent)",
            }}
          >
            {passed ? "License Issued" : "Test Failed"}
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Final Score", value: String(score) },
              { label: "Mistakes", value: String(mistakes) },
              {
                label: "Points Added",
                value: licensePointsAdded > 0 ? `+${licensePointsAdded}` : "0",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-[var(--bd)] bg-[var(--bg-row)] p-3 text-center control-radius"
              >
                <div className="text-[10px] uppercase tracking-wider text-[var(--tx-3)]">
                  {stat.label}
                </div>
                <div className="mt-1 font-mono text-[var(--tx)]">{stat.value}</div>
              </div>
            ))}
          </div>

          <p className="text-sm text-[var(--tx-2)]">
            {passed
              ? "Congratulations. Your practical certification has been added to your license record."
              : "Test not passed. Schedule a retake when ready."}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <NeonButton variant="secondary" onClick={startTest}>
              Retake
            </NeonButton>
            <NeonButton onClick={() => onNavigate("record")}>View Record</NeonButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={dmvHudRow}>
        <GlassCard className="flex min-h-[280px] flex-col space-y-2">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--c-orange)]">
            <span className="size-2 rounded-full bg-[var(--c-orange)] animate-pulse" />
            Examiner
          </div>
          <p className="text-sm font-medium leading-snug text-[var(--tx)]">{cp.instruction}</p>
          <p className="break-words font-mono text-xs text-[var(--tx-2)]">&gt; {cp.examiner}</p>
        </GlassCard>

        <GlassCard className="relative min-h-[280px] overflow-hidden p-0">
          <AnimatePresence>
            {showCp3Alert && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="absolute inset-x-0 top-0 z-10 px-4 py-2 text-center text-xs font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "var(--c-red)", color: "var(--tx)" }}
              >
                Speed violation — reduce speed immediately
              </motion.div>
            )}
          </AnimatePresence>

          <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden>
            <defs>
              <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--bg-surface)" />
                <stop offset="100%" stopColor="var(--bg-row)" />
              </linearGradient>
            </defs>
            <rect width="400" height="220" fill="url(#roadGrad)" />
            <polygon points="200,40 320,220 80,220" fill="var(--bg-row-alt)" stroke="var(--bd)" />
            <line
              x1="200"
              y1="40"
              x2="200"
              y2="220"
              stroke="var(--c-orange)"
              strokeWidth="2"
              strokeDasharray="12 8"
            />
            <line x1="130" y1="220" x2="200" y2="40" stroke="var(--c-orange)" strokeWidth="3" />
            <line x1="270" y1="220" x2="200" y2="40" stroke="var(--c-orange)" strokeWidth="3" />
          </svg>

          <div className="absolute inset-x-0 bottom-16 flex justify-center gap-0.5 px-8">
            {Array.from({ length: 32 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-[var(--tx-3)] transition-all duration-75"
                style={{
                  height: `${8 + Math.abs(Math.sin(tick / 3 + i)) * 24}px`,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--tx-2)]">
              Live Vehicle Telemetry
            </span>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col space-y-3">
          <div className={`text-xs ${dmvSectionLabel}`}>Route Progress: CP {cpIndex} / 6</div>
          <div className={`text-xs ${dmvSectionLabel}`}>
            Remaining: {cp.remaining.toFixed(1)} MI
          </div>
          <div className="flex h-2 gap-0.5">
            {CHECKPOINTS.map((_, i) => (
              <div
                key={i}
                className="flex-1 control-radius transition-colors"
                style={{
                  backgroundColor: i <= cpIndex ? "var(--primary)" : "var(--bg-row)",
                }}
              />
            ))}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[var(--tx-3)]">
            {progressPct}% Complete · Auto-tracked
          </div>
          <NeonButton variant="danger" size="sm" className="w-full" onClick={endTest}>
            End Test
          </NeonButton>
        </GlassCard>
      </div>

      <GlassCard className="p-0">
        <motion.div
          className={dmvTelemetryBar}
          initial="initial"
          animate="animate"
          variants={{ initial: {}, animate: { transition: hudStagger } }}
        >
          <motion.div variants={hudItem} className="flex justify-center">
            <DynamicSpeedometer speed={speed} limit={cp.speedLimit} />
          </motion.div>
          <motion.div variants={hudItem}>
            <AnimatedDamageBar damage={damage} />
          </motion.div>
          <motion.div variants={hudItem}>
            <AnimatedDrivingScore
              score={score}
              mistakes={mistakes}
              licensePointsAdded={licensePointsAdded}
            />
          </motion.div>
        </motion.div>
      </GlassCard>
    </div>
  );
}
