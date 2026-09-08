export function SwanMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} width={28} height={28} fill="none" aria-hidden style={{ color: "var(--accent)" }}>
      <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.12" />
      <path
        d="M7 21c3.2 2.6 7.4 3.2 11.2 1.4 2.6-1.2 4.2-3.4 4.8-6.1.4-1.8-.2-3.2-1.8-3.8-1.4-.5-2.6.2-3.4 1.4-.3-3.6-2.6-6.4-6.2-7.2 2.8 1.6 4.4 4.4 4.2 7.6-2.6-1.2-5.8-.4-7.6 2.1-.9 1.3-1.2 2.8-1.2 4.6z"
        fill="currentColor"
      />
      <circle cx="22.6" cy="11.4" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-display)", fontSize: 18, letterSpacing: "-0.02em" }}>
      <SwanMark />
      SwanPay
    </span>
  );
}
