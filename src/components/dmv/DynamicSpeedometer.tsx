import { motion, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { telemetrySpring } from "./dmv-motion";

interface DynamicSpeedometerProps {
  speed: number;
  limit: number;
}

const SIZE = 128;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 54;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * R;
const ARC_LENGTH = CIRCUMFERENCE * (270 / 360);

function arcColor(speed: number, limit: number): string {
  if (speed > limit) return "var(--c-red)";
  if (speed >= limit * 0.9) return "var(--c-orange)";
  return "var(--c-green)";
}

function fillRatio(speed: number, limit: number): number {
  const max = limit * 1.15;
  if (max <= 0) return 0;
  return Math.min(speed / max, 1);
}

export function DynamicSpeedometer({ speed, limit }: DynamicSpeedometerProps) {
  const springSpeed = useSpring(speed, telemetrySpring);
  const speedRef = useRef<HTMLSpanElement>(null);

  const strokeOffset = useTransform(springSpeed, (v) => ARC_LENGTH * (1 - fillRatio(v, limit)));
  const strokeColor = useTransform(springSpeed, (v) => arcColor(v, limit));

  useEffect(() => {
    springSpeed.set(speed);
  }, [speed, springSpeed]);

  useMotionValueEvent(springSpeed, "change", (v) => {
    if (speedRef.current) {
      speedRef.current.textContent = String(Math.round(v));
    }
  });

  const overLimit = speed > limit;

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative size-32"
        animate={{ opacity: overLimit ? [1, 0.55, 1] : 1 }}
        transition={{ repeat: overLimit ? Infinity : 0, duration: 0.9, ease: "easeInOut" }}
        style={{ filter: overLimit ? "drop-shadow(0 0 6px var(--c-red))" : undefined }}
      >
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="size-full" aria-hidden>
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="var(--bg-row)"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(135 ${CX} ${CY})`}
          />
          <motion.circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            strokeWidth={STROKE}
            strokeDasharray={`${ARC_LENGTH} ${CIRCUMFERENCE}`}
            strokeLinecap="round"
            transform={`rotate(135 ${CX} ${CY})`}
            style={{ strokeDashoffset: strokeOffset, stroke: strokeColor }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-wider text-[var(--tx-3)]">Speed</span>
          <span
            ref={speedRef}
            className="font-mono text-3xl font-semibold leading-none text-[var(--tx)]"
          >
            {speed}
          </span>
        </div>
      </motion.div>
      <span className="mt-1 text-[10px] text-[var(--tx-2)]">Limit: {limit} mph</span>
    </div>
  );
}
