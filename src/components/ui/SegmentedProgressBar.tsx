import { SEGMENT_THRESHOLDS } from "@/lib/dmv";

const SEGMENTS = [
  {
    label: "CLEAN",
    start: 0,
    end: 3,
    widthPct: (3 / 12) * 100,
    color: SEGMENT_THRESHOLDS[0].color,
  },
  {
    label: "WARNING",
    start: 3,
    end: 6,
    widthPct: (3 / 12) * 100,
    color: SEGMENT_THRESHOLDS[1].color,
  },
  {
    label: "RISK",
    start: 6,
    end: 11,
    widthPct: (5 / 12) * 100,
    color: SEGMENT_THRESHOLDS[2].color,
  },
  {
    label: "SUSPENDED",
    start: 11,
    end: 12,
    widthPct: (1 / 12) * 100,
    color: SEGMENT_THRESHOLDS[3].color,
  },
] as const;

function segmentFill(points: number, start: number, end: number): number {
  if (points <= start) return 0;
  if (points >= end) return 100;
  return ((points - start) / (end - start)) * 100;
}

export function SegmentedProgressBar({ points }: { points: number }) {
  const clamped = Math.min(Math.max(points, 0), 12);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="uppercase tracking-wider text-[var(--tx-2)]">Violation Points</span>
        <span className="font-mono text-[var(--tx)]">{clamped} / 12</span>
      </div>
      <div className="flex h-3 gap-0.5 overflow-hidden control-radius">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.label}
            className="relative h-full overflow-hidden bg-[var(--bg-row)]"
            style={{ width: `${seg.widthPct}%` }}
          >
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{
                width: `${segmentFill(clamped, seg.start, seg.end)}%`,
                backgroundColor: seg.color,
                boxShadow:
                  segmentFill(clamped, seg.start, seg.end) > 0 ? `0 0 8px ${seg.color}` : undefined,
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-0.5">
        {SEGMENTS.map((seg) => (
          <div
            key={seg.label}
            className="min-w-0 truncate text-center text-[9px] uppercase leading-tight tracking-wider"
            style={{ width: `${seg.widthPct}%`, color: seg.color }}
          >
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}
