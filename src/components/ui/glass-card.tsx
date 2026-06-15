import { cn } from "@/lib/utils";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import { forwardRef, useRef } from "react";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  glow?: boolean;
  interactive?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, glow, interactive, children, onMouseMove, onMouseLeave, ...rest }, ref) => {
    const innerRef = useRef<HTMLDivElement>(null);
    const glowX = useMotionValue(50);
    const glowY = useMotionValue(50);
    const springX = useSpring(glowX, { stiffness: 200, damping: 25 });
    const springY = useSpring(glowY, { stiffness: 200, damping: 25 });
    const glowBg = useMotionTemplate`radial-gradient(280px circle at ${springX}% ${springY}%, var(--primary-08), transparent 65%)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (interactive && innerRef.current) {
        const rect = innerRef.current.getBoundingClientRect();
        glowX.set(((e.clientX - rect.left) / rect.width) * 100);
        glowY.set(((e.clientY - rect.top) / rect.height) * 100);
      }
      onMouseMove?.(e);
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
      glowX.set(50);
      glowY.set(50);
      onMouseLeave?.(e);
    };

    return (
      <motion.div
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        whileHover={interactive ? { y: -2 } : undefined}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "panel-card relative overflow-hidden control-radius border border-[var(--bd)] p-5 transition-colors hover:border-[var(--bd-strong)]",
          glow && "glow-primary",
          interactive && "cursor-pointer",
          className,
        )}
        {...rest}
      >
        {interactive && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{ background: glowBg }}
          />
        )}
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  },
);
GlassCard.displayName = "GlassCard";
