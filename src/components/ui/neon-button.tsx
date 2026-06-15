import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "success";
type Size = "sm" | "md" | "lg";

export interface NeonButtonProps extends Omit<HTMLMotionProps<"button">, "ref" | "children"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--primary-15)] text-[var(--primary)] border border-[var(--bd-primary)] hover:border-[var(--primary-30)] hover:shadow-[0_0_20px_var(--primary-08)]",
  secondary:
    "bg-[var(--bg-row)] text-[var(--tx)] border border-[var(--bd)] hover:border-[var(--bd-strong)] hover:bg-[var(--bg-row-alt)]",
  ghost:
    "text-[var(--tx-2)] hover:text-[var(--tx)] hover:bg-[var(--bg-row)] border border-transparent",
  danger:
    "bg-[var(--c-red)]/15 text-[var(--c-red)] border border-[var(--c-red)]/40 hover:bg-[var(--c-red)]/25",
  success:
    "bg-[var(--c-green)]/15 text-[var(--c-green)] border border-[var(--c-green)]/40 hover:bg-[var(--c-green)]/25",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 control-radius",
  md: "h-10 px-4 text-sm gap-2 control-radius",
  lg: "h-12 px-6 text-base gap-2.5 control-radius",
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className, variant = "primary", size = "md", loading, icon, children, disabled, ...rest }, ref) => (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: variant === "primary" ? 1.02 : 1 }}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium tracking-tight transition-all select-none",
        "disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--bd-primary)]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span className="size-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : (
        icon
      )}
      {children}
    </motion.button>
  ),
);
NeonButton.displayName = "NeonButton";
