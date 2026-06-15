import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { CredentialCardChrome } from "@/components/cards/credential-card-chrome";
import type { JobInfo } from "@/types";
import { fmtMoney } from "@/utils/format";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function JobCard({
  job,
  onApply,
}: {
  job: JobInfo;
  onApply: (j: JobInfo) => void;
}) {
  const Icon = ((Icons as unknown as Record<string, LucideIcon>)[job.icon] ?? Icons.Briefcase) as LucideIcon;
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px var(--primary-08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <CredentialCardChrome>
        <GlassCard interactive className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <Icon className="size-5 shrink-0 text-[var(--primary)]" />
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-[var(--tx-2)]">Salary</div>
              <div className="font-display text-sm font-semibold text-[var(--tx)]">
                {fmtMoney(job.salary[0])} – {fmtMoney(job.salary[1])}
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-[var(--tx)]">{job.name}</h3>
            <p className="mt-0.5 line-clamp-2 text-xs text-[var(--tx-2)]">{job.description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {job.requirements.map((r, i) => (
              <span
                key={r}
                className="control-radius border border-[var(--bd)] px-2 py-0.5 text-[10px] text-[var(--tx-2)]"
                style={{ background: i % 2 === 0 ? "var(--bg-row)" : "var(--bg-row-alt)" }}
              >
                {r}
              </span>
            ))}
          </div>
          <NeonButton size="sm" onClick={() => onApply(job)}>
            Apply
          </NeonButton>
        </GlassCard>
      </CredentialCardChrome>
    </motion.div>
  );
}
