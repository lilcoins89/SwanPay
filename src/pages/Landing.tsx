import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Wordmark } from "../components/Mark";
import { formatAmount, parseDecimal, displayToToken } from "../lib/money";

const ASSETS = ["USDC", "SOL", "JUP"] as const;
const PRICES: Record<string, string> = { USDC: "1.00", SOL: "148.50", JUP: "0.82" };
const DEC: Record<string, number> = { USDC: 6, SOL: 9, JUP: 6 };

export function Landing() {
  const [asset, setAsset] = useState<(typeof ASSETS)[number]>("USDC");

  const tokenLine = useMemo(() => {
    try {
      const raw = displayToToken({
        displayRaw: parseDecimal("50.00", 2),
        displayDecimals: 2,
        price: PRICES[asset],
        priceScale: 2,
        tokenDecimals: DEC[asset],
      });
      return `${formatAmount(raw, DEC[asset], 2)} ${asset}`;
    } catch {
      return asset;
    }
  }, [asset]);

  return (
    <div>
      <header className="site-header">
        <div className="site-header-inner">
          <Wordmark />
          <nav className="site-nav">
            <Link to="/pricing">Pricing</Link>
            <Link to="/docs">Docs</Link>
            <Link to="/app">Dashboard</Link>
          </nav>
          <div className="row">
            <Link to="/app" className="btn btn-ghost btn-sm">Sign in</Link>
            <Link to="/app" className="btn btn-primary btn-sm">Open app</Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="hero-kicker">Solana-native payment OS</span>
          <h1>Payments that understand the intent.</h1>
          <p className="hero-lead">
            SwanPay is the merchant operating system for onchain commerce — payment intents,
            Solana Pay checkout, independent verification, recovery states, and webhooks.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="btn btn-primary">Start building →</Link>
            <Link to="/pay/demo" className="btn btn-ghost">Try checkout</Link>
          </div>
        </div>

        <div className="card" style={{ boxShadow: "0 18px 40px -28px rgb(5 46 26 / 0.8)" }}>
          <p className="subtle" style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Live quote
          </p>
          <p className="font-display" style={{ fontSize: 32, margin: "8px 0" }}>$50.00</p>
          <p className="muted" style={{ fontSize: 14 }}>Pay with any accepted asset</p>
          <div className="row" style={{ marginTop: 16 }}>
            {ASSETS.map((a) => (
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
          <p className="mono" style={{ marginTop: 16 }}>
            ≈ {tokenLine}
          </p>
          <Link to="/pay/demo" className="btn btn-primary" style={{ marginTop: 20, width: "100%" }}>
            Open sandbox checkout
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "0 16px 80px" }}>
        <div className="grid-4">
          {[
            { t: "Payment intents", d: "Stateful requests with accepted assets, settlement preference, and recovery." },
            { t: "Solana Pay", d: "URL + QR checkout with exact amounts in integer minor units." },
            { t: "Verification", d: "Server-side confirmation — never trust the client wallet alone." },
            { t: "Webhooks & SDK", d: "HMAC-signed events, invoices, and agent-ready payment surfaces." },
          ].map((f) => (
            <div key={f.t} className="card">
              <p style={{ fontWeight: 600 }}>{f.t}</p>
              <p className="muted" style={{ fontSize: 14, marginTop: 8 }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>
      <p className="footer-note">SwanPay · green background · sandbox first</p>
    </div>
  );
}
