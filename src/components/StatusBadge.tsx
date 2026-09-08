import type { IntentStatus } from "../lib/types";

const styles: Record<string, string> = {
  settled: "pill pill-ok",
  confirmed: "pill pill-ok",
  awaiting_payment: "pill pill-muted",
  pending: "pill pill-muted",
  created: "pill pill-muted",
  partially_paid: "pill pill-warn",
  overpaid: "pill pill-warn",
  payment_detected: "pill pill-warn",
  verifying: "pill pill-warn",
  failed: "pill pill-danger",
  expired: "pill pill-muted",
  cancelled: "pill pill-muted",
  refunded: "pill pill-muted",
  open: "pill pill-muted",
  paid: "pill pill-ok",
  draft: "pill pill-muted",
};

export function StatusBadge({ status }: { status: IntentStatus | string }) {
  const cls = styles[status] ?? "pill pill-muted";
  return <span className={cls}>{status.replace(/_/g, " ")}</span>;
}
