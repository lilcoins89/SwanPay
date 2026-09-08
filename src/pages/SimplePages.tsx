import { Link } from "react-router-dom";
import {
  getAnalytics, getOrg, listCustomers, listInvoices, listLinks, listWebhooks, walletBalances,
} from "../data/store";
import { formatAmount, formatDisplay } from "../lib/money";
import { StatusBadge } from "../components/StatusBadge";

const DEC: Record<string, number> = { SOL: 9, USDC: 6, JUP: 6, BONK: 5, PYTH: 6 };

export function LinksPage() {
  const links = listLinks();
  return (
    <div className="space-y">
      <h1 className="page-title">Payment links</h1>
      <div className="stack">
        {links.map((l) => (
          <div key={l.id} className="card row" style={{ justifyContent: "space-between" }}>
            <div>
              <p style={{ fontWeight: 500 }}>{l.description}</p>
              <p className="muted mono" style={{ fontSize: 12 }}>{l.id}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p className="tabular">{formatDisplay(BigInt(l.amountMinor), l.currency)}</p>
              <Link to={`/pay/${l.intentId}`} className="muted" style={{ fontSize: 13 }}>Open →</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InvoicesPage() {
  const invoices = listInvoices();
  return (
    <div className="space-y">
      <h1 className="page-title">Invoices</h1>
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="table">
          <thead><tr><th>Number</th><th>Customer</th><th>Total</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="mono">{inv.number}</td>
                <td>{inv.customerName}</td>
                <td className="tabular">{formatDisplay(BigInt(inv.totalMinor), inv.currency)}</td>
                <td>{inv.dueDate}</td>
                <td><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CustomersPage() {
  const customers = listCustomers();
  return (
    <div className="space-y">
      <h1 className="page-title">Customers</h1>
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="table">
          <thead><tr><th>Name</th><th>Email</th><th>Payments</th><th>Volume</th></tr></thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td className="muted">{c.email ?? "—"}</td>
                <td>{c.paymentCount}</td>
                <td className="tabular">{formatDisplay(BigInt(c.totalPaidMinor), "USD")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function WalletsPage() {
  return (
    <div className="space-y">
      <h1 className="page-title">Wallets</h1>
      <p className="page-sub">Sandbox balances for demo settlement wallet</p>
      <div className="grid-4">
        {Object.entries(walletBalances).map(([asset, raw]) => (
          <div key={asset} className="card">
            <p className="stat-label">{asset}</p>
            <p className="stat-value tabular">{formatAmount(BigInt(raw), DEC[asset] ?? 6, 2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettlementsPage() {
  const org = getOrg();
  return (
    <div className="space-y">
      <h1 className="page-title">Settlements</h1>
      <div className="card stack">
        <p>Settlement asset: <strong>{org.settlementAsset}</strong></p>
        <p className="mono" style={{ fontSize: 13 }}>Wallet: {org.settlementWallet}</p>
        <p className="muted">Sandbox settlements credit the merchant ledger after independent verification.</p>
      </div>
    </div>
  );
}

export function AutomationsPage() {
  return (
    <div className="space-y">
      <h1 className="page-title">Automations</h1>
      <div className="card">
        <p style={{ fontWeight: 500 }}>Payment → invoice mark paid</p>
        <p className="muted" style={{ marginTop: 8 }}>When a payment settles, update matching open invoices and fire webhooks.</p>
      </div>
    </div>
  );
}

export function ApiPage() {
  return (
    <div className="space-y">
      <h1 className="page-title">API</h1>
      <div className="card stack">
        <p className="muted">REST surface (demo keys)</p>
        <p className="mono">pk_test_swan_northwind_demo</p>
        <p className="mono">sk_test_swan_northwind_demo</p>
        <p className="muted" style={{ fontSize: 13 }}>POST /v1/payment_intents · GET /v1/payment_intents/:id · POST /v1/webhooks</p>
      </div>
    </div>
  );
}

export function WebhooksPage() {
  const { endpoints, deliveries } = listWebhooks();
  return (
    <div className="space-y">
      <h1 className="page-title">Webhooks</h1>
      {endpoints.map((e) => (
        <div key={e.id} className="card stack">
          <p className="mono" style={{ fontSize: 13 }}>{e.url}</p>
          <p className="muted">{e.events.join(", ")}</p>
          <p className="subtle">Secret: {e.secret}</p>
        </div>
      ))}
      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="table">
          <thead><tr><th>Event</th><th>Status</th><th>When</th></tr></thead>
          <tbody>
            {deliveries.map((d) => (
              <tr key={d.id}>
                <td className="mono">{d.eventType}</td>
                <td>{d.success ? <span className="pill pill-ok">{d.statusCode}</span> : <span className="pill pill-danger">fail</span>}</td>
                <td className="muted">{new Date(d.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SandboxPage() {
  return (
    <div className="space-y">
      <h1 className="page-title">Sandbox</h1>
      <div className="card stack">
        <p>Environment is locked to <strong>sandbox</strong> for this demo org.</p>
        <p className="muted">Use checkout scenarios (full / partial / overpay / wrong token) to exercise recovery states without chain risk.</p>
        <Link to="/pay/demo" className="btn btn-primary">Open demo checkout</Link>
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const stats = getAnalytics();
  const maxVol = Math.max(...stats.series.map((s) => Number(s.volumeMinor)), 1);
  return (
    <div className="space-y">
      <h1 className="page-title">Analytics</h1>
      <div className="grid-4">
        <div className="card"><p className="stat-label">Volume</p><p className="stat-value tabular">{formatDisplay(BigInt(stats.totalVolumeMinor), "USD")}</p></div>
        <div className="card"><p className="stat-label">Successful</p><p className="stat-value">{stats.successful}</p></div>
        <div className="card"><p className="stat-label">Pending</p><p className="stat-value">{stats.pending}</p></div>
        <div className="card"><p className="stat-label">Conversion</p><p className="stat-value">{Math.round(stats.conversionRate * 100)}%</p></div>
      </div>
      <div className="card">
        <p style={{ fontWeight: 500 }}>7-day volume</p>
        <div className="bar-chart">
          {stats.series.map((s) => (
            <div key={s.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div className="bar" style={{ height: `${Math.max(4, (Number(s.volumeMinor) / maxVol) * 100)}%`, width: "100%" }} />
              <span className="bar-label">{s.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <p style={{ fontWeight: 500, marginBottom: 12 }}>By asset</p>
        {stats.byAsset.map((a) => (
          <div key={a.asset} className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
            <span>{a.asset}</span>
            <span className="tabular muted">{formatDisplay(BigInt(a.volumeMinor), "USD")} · {a.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SettingsPage() {
  const org = getOrg();
  return (
    <div className="space-y">
      <h1 className="page-title">Settings</h1>
      <div className="card stack">
        <p><strong>{org.name}</strong></p>
        <p className="muted">Display currency: {org.displayCurrency}</p>
        <p className="muted">Settlement: {org.settlementAsset}</p>
        <p className="muted">Accepted: {org.acceptedAssets.join(", ")}</p>
        <p className="muted">Environment: {org.environment}</p>
      </div>
    </div>
  );
}

export function QrPage() {
  return (
    <div className="space-y">
      <h1 className="page-title">QR codes</h1>
      <div className="card row">
        <div className="qr-box">Static QR<br />Office hours</div>
        <div>
          <p style={{ fontWeight: 500 }}>Office hours link</p>
          <p className="muted">$25.00 · USDC / SOL</p>
          <Link to="/pay/demo" className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>Preview</Link>
        </div>
      </div>
    </div>
  );
}

export function AdminPage() {
  return (
    <div className="space-y">
      <h1 className="page-title">Admin</h1>
      <div className="card"><p>Platform admin surface — orgs, rate limits, and network status (demo placeholder).</p></div>
    </div>
  );
}

export function DocsPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 16px" }} className="space-y">
      <h1 className="page-title">Docs</h1>
      <div className="card stack">
        <p style={{ fontWeight: 500 }}>Payment intents</p>
        <p className="muted">Create an intent with amount, accepted assets, and settlement preference. Share the checkout URL or QR.</p>
        <p style={{ fontWeight: 500 }}>Verification</p>
        <p className="muted">SwanPay never trusts the client alone. Sandbox simulates independent server confirmation before settlement.</p>
        <p style={{ fontWeight: 500 }}>Recovery</p>
        <p className="muted">Partial, overpaid, and wrong-token states surface remaining balance and hold funds until resolved.</p>
        <Link to="/app" className="btn btn-primary">Open dashboard</Link>
      </div>
    </div>
  );
}

export function PricingPage() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 16px" }} className="space-y">
      <h1 className="page-title">Pricing</h1>
      <div className="grid-4">
        <div className="card"><p style={{ fontWeight: 600 }}>Sandbox</p><p className="font-display" style={{ fontSize: 28 }}>Free</p><p className="muted">Full API + dashboard</p></div>
        <div className="card"><p style={{ fontWeight: 600 }}>Live</p><p className="font-display" style={{ fontSize: 28 }}>0.5%</p><p className="muted">Per settled payment</p></div>
      </div>
      <Link to="/app" className="btn btn-primary">Start in sandbox</Link>
    </div>
  );
}

export function ReceiptPage() {
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "48px 16px" }} className="card stack">
      <h1 className="page-title">Receipt</h1>
      <p className="muted">Payment receipt surface for settled intents.</p>
      <Link to="/app/payments" className="btn btn-ghost">Back</Link>
    </div>
  );
}

export function InvoicePublicPage() {
  const inv = listInvoices()[0];
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "48px 16px" }} className="card stack">
      <h1 className="page-title">{inv?.number ?? "Invoice"}</h1>
      <p className="muted">{inv?.customerName}</p>
      <p className="font-display tabular" style={{ fontSize: 32 }}>
        {inv ? formatDisplay(BigInt(inv.totalMinor), inv.currency) : "—"}
      </p>
      <StatusBadge status={inv?.status ?? "open"} />
      <Link to="/pay/demo" className="btn btn-primary">Pay invoice</Link>
    </div>
  );
}
