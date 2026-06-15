import { GlassCard } from "@/components/ui/glass-card";
import { standingColor, standingLabel } from "@/lib/dmv";
import { usePlayerStore } from "@/store/usePlayerStore";
import { fmtDate } from "@/utils/format";
import { Car } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

function BiometricProfile() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 80 100"
        className="h-[85%] w-[85%] animate-pulse text-[var(--primary)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        aria-hidden
      >
        <ellipse cx="40" cy="28" rx="18" ry="22" opacity="0.7" />
        <path d="M22 55 Q40 48 58 55" opacity="0.6" />
        <path d="M28 70 Q40 62 52 70" opacity="0.5" />
        <path d="M32 85 Q40 78 48 85" opacity="0.4" />
        <circle cx="40" cy="28" r="8" strokeDasharray="2 3" opacity="0.5" />
        <path d="M15 35 L25 30 M65 35 L55 30" opacity="0.4" />
      </svg>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--primary-08) 1px, transparent 1px), linear-gradient(to bottom, var(--primary-08) 1px, transparent 1px)",
          backgroundSize: "8px 8px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--primary-30)] animate-pulse" />
    </div>
  );
}

function Field({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--tx-2)]">{k}</div>
      <div
        className={
          mono ? "font-mono text-sm text-[var(--tx)]" : "text-sm font-medium text-[var(--tx)]"
        }
      >
        {v}
      </div>
    </div>
  );
}

function StandingBadge({
  standing,
}: {
  standing: ReturnType<typeof usePlayerStore.getState>["dmvRecord"]["standing"];
}) {
  const color = standingColor(standing);
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] leading-none whitespace-nowrap"
      style={{
        color,
        borderColor: `color-mix(in srgb, ${color} 40%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
      }}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {standingLabel(standing)}
    </span>
  );
}

export function DriverLicenseCard() {
  const player = usePlayerStore((s) => s.player);
  const dmvRecord = usePlayerStore((s) => s.dmvRecord);
  const drivingLicense = usePlayerStore((s) => s.licenses.find((l) => l.type === "driving"));
  const cardRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });
  const shimmerX = useTransform(mouseX, [-0.5, 0.5], [20, 80]);
  const shimmerY = useTransform(mouseY, [-0.5, 0.5], [20, 80]);
  const shimmerBg = useMotionTemplate`linear-gradient(115deg, transparent 30%, var(--primary-15) 45%, var(--primary-30) 50%, var(--primary-15) 55%, transparent 70%)`;
  const shimmerPosition = useMotionTemplate`${shimmerX}% ${shimmerY}%`;

  if (!player) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const issued = drivingLicense?.issuedAt ?? player.idCard.issuedAt;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800, transformStyle: "preserve-3d" }}
      className="w-full max-w-md"
    >
      <GlassCard className="relative w-full overflow-hidden p-0 glow-primary">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 opacity-60 mix-blend-screen"
          style={{
            background: shimmerBg,
            backgroundSize: "200% 200%",
            backgroundPosition: shimmerPosition,
          }}
        />

        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-b border-[var(--bd)] bg-[var(--bg-row)] px-5 py-3">
          <div className="flex min-w-0 items-center gap-2 text-[10px] uppercase leading-tight tracking-[0.22em] text-[var(--primary)] text-glow">
            <Car className="size-3.5 shrink-0" />
            <span className="truncate">San Andreas — Driver License</span>
          </div>
          <StandingBadge standing={dmvRecord.standing} />
        </div>

        <div className="grid grid-cols-[112px_1fr] gap-4 p-5">
          <div className="aspect-[3/4] control-radius overflow-hidden border border-[var(--bd-primary)] bg-gradient-to-br from-[var(--primary-15)] to-[var(--primary-08)]">
            <BiometricProfile />
          </div>
          <div className="space-y-2.5 text-sm">
            <Field k="Full Name" v={`${player.firstName} ${player.lastName}`} />
            <Field k="Citizen ID" v={player.citizenId} mono />
            <Field k="License Class" v="Class C" />
            <Field k="Issue Date" v={fmtDate(issued)} />
            <Field k="Expiry Date" v={fmtDate(dmvRecord.expiryDate)} />
          </div>
        </div>

        <div className="flex items-end justify-between border-t border-[var(--bd)] px-5 py-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--tx-2)]">Signature</div>
            <div className="font-display text-base italic text-[var(--primary)] text-glow">
              {player.idCard.signature ?? "—"}
            </div>
          </div>
          <div className="text-[10px] tracking-wider text-[var(--tx-3)]">SA-DMV / DRV-LIC</div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--primary) 1px, transparent 1px), linear-gradient(to bottom, var(--primary) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </GlassCard>
    </motion.div>
  );
}
