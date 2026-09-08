import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ensureDemoCheckout,
  getIntent,
  getOrg,
  getTimeline,
  sandboxPay,
  tokenAmountFor,
  type PayScenario,
} from "../data/store";
import { formatDisplay } from "../lib/money";
import { StatusBadge } from "../components/StatusBadge";
import { Wordmark } from "../components/Mark";

export function Checkout() {
  const { id: rawId } = useParams();
  const [intentId, setIntentId] = useState<string | null>(null);
  const [asset, setAsset] = useState("USDC");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!rawId || rawId === "demo") {
      setIntentId(ensureDemoCheckout().id);
    } else {
      setIntentId(rawId);
    }
  }, [rawId]);

  const intent = intentId ? getIntent(intentId) : null;
  const org = getOrg();
  const timeline = intentId ? getTimeline(intentId) : [];

  useEffect(() => {
    if (intent?.acceptedAssets?.length) {
      setAsset(intent.acceptedAssets[0]);
    }
  }, [intent?.id]);

  const quote = useMemo(() => {
    if (!intent) return null;
    try {
      return tokenAmountFor(intent.amountMinor, intent.currency, asset);
    } catch {
      return null;
    }
  }, [intent, asset]);

  async function pay(scenario: PayScenario) {
    if (!intent) return;
    setBusy(true);
    try {
      sandboxPay(intent.id, asset, scenario);
      setTick((t) => t + 1);
    } finally {
      setBusy(false);
    }
  }

  function copyUrl() {
    if (!intent) return;
    const url = window.location.origin + intent.checkoutUrl;
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (!intent) {
    return (
      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}>
        <p className="muted">Loading checkout…</p>
      </div>
    );
  }

  const settled = ["settled", "confirmed", "overpaid"].includes(intent.status);

  return (
    <div style={{ minHeight: "100dvh" }}>
      <header className="site-header">
        <div className="site-header-inner">
          <Wordmark />
          <StatusBadge status={intent.status} />
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px 64px" }} className="space-y">
        <div>
          <p className="subtle" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {org.name} · {intent.network}
          </p>
          <h1 className="page-title" style={{ marginTop: 8 }}>{intent.description}</h1>
          <p className="font-display tabular" style={{ fontSize: 40, marginTop: 12 }}>
            {formatDisplay(BigInt(intent.amountMinor), intent.currency)}
          </p>
          {intent.customerName ? <p className="muted" style={{ marginTop: 4 }}>For {intent.customerName}</p> : null}
        </div>

        {settled ? (
          <div className="card" style={{ textAlign: "center", padding: 32 }}>
            <p style={{ fontSize: 32 }}>✓</p>
            <p className="font-display" style={{ fontSize: 24, marginTop: 8 }}>Payment confirmed</p>
            <p className="muted" style={{ marginTop: 8 }}>
              {intent.paidAsset} · {intent.signature?.slice(0, 24)}…
            </p>
            <Link to={`/app/payments/${intent.id}`} className="btn btn-primary" style={{ marginTop: 20 }}>
              View in dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="card stack">
              <p style={{ fontWeight: 500 }}>Pay with</p>
              <div className="row">
                {intent.acceptedAssets.map((a) => (
                  <button
                    key={a}
                    type="button"
                    className={`btn btn-sm ${asset === a ? "btn-primary" : "btn-ghost"}`}
                    onClick={() => setAsset(a)}
                  >
                    {a}
                  </button>
                ))}
              </div>
              {quote ? (
                <p className="mono">
                  Send exactly {quote.formatted} {quote.asset}
                </p>
              ) : null}
              <div className="qr-box">
                Solana Pay QR
                <br />
                <span className="mono" style={{ fontSize: 10 }}>{intent.reference.slice(0, 16)}…</span>
              </div>
              <p className="muted" style={{ fontSize: 13 }}>
                Recipient <span className="mono">{intent.recipient.slice(0, 12)}…</span>
              </p>
            </div>

            <div className="card stack">
              <p style={{ fontWeight: 500 }}>Sandbox simulation</p>
              <p className="muted" style={{ fontSize: 13 }}>
                No real chain tx — exercises verification + recovery states.
              </p>
              <div className="row">
                <button type="button" className="btn btn-primary" disabled={busy} onClick={() => pay("full")}>
                  Pay full
                </button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => pay("partial")}>
                  Partial
                </button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => pay("overpay")}>
                  Overpay
                </button>
                <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => pay("wrong_token")}>
                  Wrong token
                </button>
              </div>
            </div>
          </>
        )}

        {intent.recovery ? (
          <div className="recovery">
            <p style={{ fontWeight: 600 }}>Needs attention · {intent.recovery.kind}</p>
            <p style={{ marginTop: 8 }}>{intent.recovery.message}</p>
            <p className="mono" style={{ marginTop: 8, fontSize: 13 }}>
              {intent.recovery.receivedDisplay} of {intent.recovery.requiredDisplay}
              {intent.recovery.remainingDisplay ? ` · remaining ${intent.recovery.remainingDisplay}` : ""}
            </p>
          </div>
        ) : null}

        <div className="card">
          <p style={{ fontWeight: 500, marginBottom: 12 }}>Timeline</p>
          <div className="timeline">
            {timeline.map((ev) => (
              <div key={ev.id} className="timeline-item">
                <p style={{ fontWeight: 500 }}>{ev.title}</p>
                {ev.detail ? <p className="muted" style={{ fontSize: 13 }}>{ev.detail}</p> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="row">
          <button type="button" className="btn btn-ghost btn-sm" onClick={copyUrl}>
            {copied ? "Copied" : "Copy payment URL"}
          </button>
          <Link to="/app" className="btn btn-ghost btn-sm">Merchant dashboard</Link>
        </div>
      </div>
    </div>
  );
}
