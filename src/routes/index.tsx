import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { HudRing } from "@/components/ui/hud-ring";
import { NeonButton } from "@/components/ui/neon-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { usePlayerStore } from "@/store/usePlayerStore";
import { fmtMoney, fmtRelative } from "@/utils/format";
import {
  Briefcase,
  CircleUserRound,
  FileBadge,
  IdCard,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Dashboard — City Hall" }],
  }),
  component: Dashboard,
});

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
};

function Dashboard() {
  const player = usePlayerStore((s) => s.player);
  const licenses = usePlayerStore((s) => s.licenses);
  const apps = usePlayerStore((s) => s.applications);

  if (!player) return <div className="text-[var(--tx-2)]">Loading…</div>;

  const activeLicenses = licenses.filter((l) => l.status === "active").length;
  const pendingApps = apps.filter((a) => a.status === "pending").length;
  const licenseRatio = licenses.length > 0 ? activeLicenses / licenses.length : 0;
  const totalWealth = player.cash + player.bank;
  const wealthRatio = Math.min(1, totalWealth / 500000);

  return (
    <motion.div className="space-y-6" variants={containerVariants} initial="hidden" animate="show">
      <motion.div variants={itemVariants} className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-[var(--primary)]">Welcome back</div>
          <h2 className="font-display text-2xl font-semibold text-[var(--tx)]">
            Good day, {player.firstName}
          </h2>
        </div>
        <div className="text-xs text-[var(--tx-2)]">
          Citizen ID · <span className="font-mono text-[var(--tx)]">{player.citizenId}</span>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<CircleUserRound className="size-4" />} label="Player" ringValue={1}>
          <div className="font-display text-lg font-semibold text-[var(--tx)]">
            {player.firstName} {player.lastName}
          </div>
          <div className="text-xs text-[var(--tx-2)]">Active citizen</div>
        </StatCard>
        <StatCard icon={<Briefcase className="size-4" />} label="Current Job" ringValue={0.75}>
          <div className="font-display text-lg font-semibold text-[var(--tx)]">{player.job.name}</div>
          <div className="text-xs text-[var(--tx-2)]">Grade {player.job.grade}</div>
        </StatCard>
        <StatCard icon={<Wallet className="size-4" />} label="Money" ringValue={wealthRatio}>
          <div className="font-display text-lg font-semibold text-[var(--tx)]">{fmtMoney(totalWealth)}</div>
          <div className="text-xs text-[var(--tx-2)]">
            {fmtMoney(player.cash)} cash · {fmtMoney(player.bank)} bank
          </div>
        </StatCard>
        <StatCard icon={<FileBadge className="size-4" />} label="Licenses" ringValue={licenseRatio}>
          <div className="font-display text-lg font-semibold text-[var(--tx)]">{activeLicenses} active</div>
          <div className="text-xs text-[var(--tx-2)]">
            {pendingApps} application{pendingApps === 1 ? "" : "s"} pending
          </div>
        </StatCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1">
          <div className="text-[10px] uppercase tracking-wider text-[var(--tx-2)]">Quick Actions</div>
          <div className="mt-3 grid gap-2">
            <Link to="/id-card">
              <NeonButton className="w-full justify-start" icon={<IdCard className="size-4" />}>
                Apply for ID Card
              </NeonButton>
            </Link>
            <Link to="/licenses">
              <NeonButton variant="secondary" className="w-full justify-start" icon={<FileBadge className="size-4" />}>
                Apply for Driving License
              </NeonButton>
            </Link>
            <Link to="/jobs">
              <NeonButton variant="secondary" className="w-full justify-start" icon={<Briefcase className="size-4" />}>
                Apply for a Job
              </NeonButton>
            </Link>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-[var(--tx-2)]">Recent Applications</div>
            <Link to="/applications" className="text-xs text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-[var(--bd)]">
            {apps.slice(0, 5).map((a, i) => (
              <li
                key={a.id}
                className={`flex items-center justify-between gap-3 py-2.5 ${i % 2 === 0 ? "bg-row control-radius px-2 -mx-2" : "bg-row-alt control-radius px-2 -mx-2"}`}
              >
                <div>
                  <div className="text-sm font-medium text-[var(--tx)]">{a.label}</div>
                  <div className="text-[11px] text-[var(--tx-2)]">
                    {a.kind.toUpperCase()} · {fmtRelative(a.createdAt)}
                  </div>
                </div>
                <StatusBadge status={a.status} className="shrink-0" />
              </li>
            ))}
            {apps.length === 0 && (
              <li className="py-4 text-sm text-[var(--tx-2)]">No applications yet.</li>
            )}
          </ul>
        </GlassCard>
      </motion.div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  ringValue,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  ringValue: number;
  children: React.ReactNode;
}) {
  return (
    <GlassCard interactive className="group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--tx-2)]">
          <span className="shrink-0 text-[var(--primary)] transition-shadow group-hover:drop-shadow-[0_0_6px_var(--primary-30)] [&_svg]:size-4">
            {icon}
          </span>
          {label}
        </div>
        <HudRing value={ringValue} />
      </div>
      <div className="mt-3">{children}</div>
    </GlassCard>
  );
}
