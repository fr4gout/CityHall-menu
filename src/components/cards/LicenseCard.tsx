import { GlassCard } from "@/components/ui/glass-card";
import { NeonButton } from "@/components/ui/neon-button";
import { StatusBadge } from "@/components/ui/status-badge";
import { CredentialCardChrome } from "@/components/cards/credential-card-chrome";
import { fmtDate, fmtMoney } from "@/utils/format";
import type { License } from "@/types";
import { Bike, Car, Plane, Sailboat, Crosshair } from "lucide-react";
import { motion } from "framer-motion";

const ICONS = {
  driving: Car,
  motorcycle: Bike,
  gun: Crosshair,
  boat: Sailboat,
  pilot: Plane,
} as const;

export function LicenseCard({
  license,
  onApply,
}: {
  license: License;
  onApply: (l: License) => void;
}) {
  const Icon = ICONS[license.type];
  const canApply = license.status === "none" || license.status === "expired";
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px var(--primary-08)" }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
    >
      <CredentialCardChrome>
        <GlassCard interactive className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            <Icon className="size-5 shrink-0 text-[var(--primary)]" />
            <StatusBadge status={license.status} />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-[var(--tx)]">{license.name}</h3>
            <p className="mt-0.5 text-xs text-[var(--tx-2)]">
              Fee {fmtMoney(license.fee)} · Expires {fmtDate(license.expiresAt)}
            </p>
          </div>
          <NeonButton
            size="sm"
            variant={canApply ? "primary" : "secondary"}
            onClick={() => onApply(license)}
          >
            {canApply ? "Apply" : license.status === "pending" ? "View Status" : "Renew"}
          </NeonButton>
        </GlassCard>
      </CredentialCardChrome>
    </motion.div>
  );
}
