import { createFileRoute } from "@tanstack/react-router";
import { GlassCard } from "@/components/ui/glass-card";
import { fmtMoney } from "@/utils/format";

export const Route = createFileRoute("/government-info")({
  head: () => ({ meta: [{ title: "Government Info — City Hall" }] }),
  component: GovInfoPage,
});

const sections = [
  { id: "rules", label: "City Rules" },
  { id: "licenses", label: "License Requirements" },
  { id: "fees", label: "Fees" },
  { id: "announcements", label: "Announcements" },
];

const fees = [
  ["ID Card — New", 150],
  ["ID Card — Replacement", 75],
  ["Driving License", 250],
  ["Motorcycle License", 200],
  ["Firearms License", 750],
  ["Boat License", 180],
  ["Pilot License", 1500],
] as const;

function GovInfoPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <nav className="sticky top-0 self-start space-y-1 text-sm">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="block border border-transparent px-3 py-2 text-muted-foreground transition-colors hover:border-border/40 hover:bg-surface/60 hover:text-foreground"
          >
            {s.label}
          </a>
        ))}
      </nav>

      <div className="space-y-6">
        <GlassCard id="rules">
          <h3 className="font-display text-base font-semibold">City Rules</h3>
          <div className="mt-3 space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p>
              All citizens of Los Santos are bound by the San Andreas civic code. Roleplay in
              good faith, respect emergency services, and follow officer instructions.
            </p>
            <p>
              New Life Rule applies: if you are incapacitated and transported by EMS, you may
              not retain memory of the incident's perpetrators unless reported.
            </p>
            <p>
              Vehicles must comply with safety regulations. Driving without a license carries
              a $500 fine plus impound fees.
            </p>
          </div>
        </GlassCard>

        <GlassCard id="licenses">
          <h3 className="font-display text-base font-semibold">License Requirements</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>· Driving / Motorcycle: pass theory and practical exams at the DMV.</li>
            <li>· Firearms: background check by LSPD plus mandatory safety class.</li>
            <li>· Pilot: 100 hours logged flight time and medical clearance.</li>
            <li>· Boat: pass nautical exam at the marina.</li>
          </ul>
        </GlassCard>

        <GlassCard id="fees" className="p-0 overflow-hidden">
          <div className="px-5 pt-5">
            <h3 className="font-display text-base font-semibold">Fees</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Current processing fees for civic services.
            </p>
          </div>
          <table className="mt-3 w-full text-sm">
            <tbody>
              {fees.map(([name, amt]) => (
                <tr key={name} className="border-t border-border/60">
                  <td className="px-5 py-2.5">{name}</td>
                  <td className="px-5 py-2.5 text-right font-mono">{fmtMoney(amt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>

        <GlassCard id="announcements">
          <h3 className="font-display text-base font-semibold">Announcements</h3>
          <ul className="mt-3 space-y-3">
            <li className="border border-primary/30 bg-primary/5 p-3 text-sm">
              <div className="text-[10px] uppercase tracking-wider text-primary">Public Notice</div>
              <div className="mt-0.5">LSPD academy is accepting cadets through end of quarter.</div>
            </li>
            <li className="border border-border bg-background/40 p-3 text-sm">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Traffic</div>
              <div className="mt-0.5">Olympic Fwy closure for civic parade — expect delays.</div>
            </li>
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}
