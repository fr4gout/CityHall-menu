export const telemetrySpring = { stiffness: 90, damping: 22, mass: 0.85 };

export const scoreSpring = { stiffness: 110, damping: 24 };

export const hudStagger = { staggerChildren: 0.08, delayChildren: 0.05 };

export const hudItem = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] as const },
  },
};
