import { motion, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { memo, useEffect, useRef } from "react";
import { dmvSectionLabel } from "./dmv-layout";
import { scoreSpring, telemetrySpring } from "./dmv-motion";

export const AnimatedDamageBar = memo(function AnimatedDamageBar({ damage }: { damage: number }) {
  const springDamage = useSpring(damage, telemetrySpring);
  const width = useTransform(springDamage, (v) => `${v}%`);
  const fillColor = useTransform(springDamage, (v) =>
    v > 50 ? "var(--c-red)" : "var(--c-orange)",
  );
  const pctRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    springDamage.set(damage);
  }, [damage, springDamage]);

  useMotionValueEvent(springDamage, "change", (v) => {
    const rounded = Math.round(v);
    if (pctRef.current) pctRef.current.textContent = `${rounded}%`;
    if (statusRef.current) {
      const critical = rounded > 50;
      statusRef.current.textContent = critical ? "Critical" : "Nominal";
      statusRef.current.style.color = critical ? "var(--c-red)" : "var(--c-green)";
    }
  });

  return (
    <div className="flex min-w-0 flex-col justify-center gap-3 px-4">
      <div className={dmvSectionLabel}>Vehicle Damage</div>
      <div className="h-4 w-full overflow-hidden bg-[var(--bg-row)] control-radius">
        <motion.div className="h-full" style={{ width, backgroundColor: fillColor }} />
      </div>
      <div className="flex items-center justify-between text-sm">
        <span ref={pctRef} className="font-mono text-[var(--tx)]">
          {damage}%
        </span>
        <span
          ref={statusRef}
          className="text-[10px] uppercase tracking-wider"
          style={{ color: damage > 50 ? "var(--c-red)" : "var(--c-green)" }}
        >
          {damage > 50 ? "Critical" : "Nominal"}
        </span>
      </div>
    </div>
  );
});

export const AnimatedDrivingScore = memo(function AnimatedDrivingScore({
  score,
  mistakes,
  licensePointsAdded,
}: {
  score: number;
  mistakes: number;
  licensePointsAdded: number;
}) {
  const springScore = useSpring(score, scoreSpring);
  const scoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    springScore.set(score);
  }, [score, springScore]);

  useMotionValueEvent(springScore, "change", (v) => {
    if (scoreRef.current) scoreRef.current.textContent = String(Math.round(v));
  });

  return (
    <div className="flex flex-col items-center justify-center gap-1 text-center">
      <div className={dmvSectionLabel}>Driving Score</div>
      <div
        ref={scoreRef}
        className="font-mono text-4xl font-semibold leading-none text-[var(--tx)]"
      >
        {score}
      </div>
      <div className="text-[10px] text-[var(--tx-2)]">
        Mistakes: {mistakes} · License pts: +{licensePointsAdded}
      </div>
    </div>
  );
});
