import { Link } from "react-router-dom";
import { getAnalytics, getOrg, listIntents } from "../data/store";
import { formatDisplay } from "../lib/money";
import { StatusBadge } from "../components/StatusBadge";

export function Dashboard() {
  const org = getOrg();
  const stats = getAnalytics();
  const intents = listIntents().slice(0, 8);
  const maxVol = Math.max(...stats.series.map((s) => Number(s.volumeMinor)), 1);

  return (
    <div className="space-y">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <p className="subtle" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em" }}>{org.name}</p>
          <h1 className="page-title">Overview</h1>
          <p className="page-sub">Sandbox merchant workspace · Solana payments</p>
        </div>
        <div className="row">
          <Link to="/app/intents" className="btn btn-primary">+ Create payment</Link>
          <Link to="/pay/demo" className="btn btn-ghost">Open checkout →</Link>
        </div>
      </div>

      <div className="grid-4">
        {[
          { label: "Volume", value: formatDisplay(BigInt(stats.totalVolumeMinor), "USD") },
          { label: "Successful", value: String(stats.successful) },
          { label: "Pending", value: String(stats.pending) },
          { label: "Conversion", value: `${Math.round(stats.conversionRate * 100)}%` },
        ].map((c) => (
          <div key={c.label} className="card">
            <p className="stat-label">{c.label}</p>
            <p className="stat-value tabular">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p style={{ fontWeight: 500 }}>Volume (7 days)</p>
        <div className="bar-chart">
          {stats.series.map((s) => (
            <div key={s.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                className="bar"
                style={{ height: `${Math.max(4, (Number(s.volumeMinor) / maxVol) * 100)}%`, width: "100%" }}
                title={`${s.day}: ${formatDisplay(BigInt(s.volumeMinor), "USD")}`}
              />
              <span className="bar-label">{s.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
          <p style={{ fontWeight: 500, margin: 0 }}>Recent payments</p>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Intent</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {intents.map((i) => (
              <tr key={i.id}>
                <td className="mono">{i.id}</td>
                <td>{i.customerName ?? "—"}</td>
                <td className="tabular">{formatDisplay(BigInt(i.amountMinor), i.currency)}</td>
                <td><StatusBadge status={i.status} /></td>
                <td><Link to={`/app/payments/${i.id}`} className="muted">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
