import { cn } from "@/lib/utils";

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  count?: number;
}

export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: {
  items: TabItem<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-1 border border-border bg-surface/40 p-1 control-radius", className)}>
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            key={it.value}
            onClick={() => onChange(it.value)}
            className={cn(
              "relative inline-flex items-center gap-2 control-radius px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {it.label}
            {typeof it.count === "number" && (
              <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full border border-border/60 bg-background/60 text-[11px] leading-none tabular-nums">
                {it.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
