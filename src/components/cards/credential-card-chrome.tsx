function MiniBarcode() {
  return (
    <svg viewBox="0 0 48 24" className="h-6 w-12 opacity-40" aria-hidden>
      {[2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35, 38, 41, 44].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={2}
          width={i % 3 === 0 ? 2 : 1}
          height={20}
          fill="currentColor"
          className="text-[var(--tx-2)]"
        />
      ))}
    </svg>
  );
}

export function CredentialCardChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden control-radius opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      >
        <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[var(--primary-30)] to-transparent laser-sweep" />
      </div>
      <div className="absolute right-3 top-3 z-10">
        <MiniBarcode />
      </div>
      {children}
    </div>
  );
}
