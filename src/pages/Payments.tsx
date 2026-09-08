import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listIntents } from "../data/store";
import { formatDisplay } from "../lib/money";
import { StatusBadge } from "../components/StatusBadge";

export function Payments() {
  const [q, setQ] = useState("");
  const all = listIntents();
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return all;
    return all.filter(
      (p) =>
        p.id.toLowerCase().includes(needle) ||
        p.status.includes(needle) ||
        (p.customerName ?? "").toLowerCase().includes(needle) ||
        (p.signature ?? "").toLowerCase().includes(needle) ||
        (p.paidAsset ?? "").toLowerCase().includes(needle) ||
        p.amount.includes(needle),
    );
  }, [all, q]);

  return (
    <div className="space-y">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-sub">Search by ID, signature, customer, asset, or status</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search payments…"
          className="field"
          style={{ height: 44, maxWidth: 320, background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: 8, padding: "0 12px" }}
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Payment</th>
              <th>Description</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Asset</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link to={`/app/payments/${p.id}`} className="mono" style={{ color: "var(--accent)" }}>
                    {p.id}
                  </Link>
                </td>
                <td className="muted">{p.description}</td>
                <td>{p.customerName ?? "—"}</td>
                <td className="tabular">{formatDisplay(BigInt(p.amountMinor), p.currency)}</td>
                <td>{p.paidAsset ?? p.acceptedAssets.join(", ")}</td>
                <td><StatusBadge status={p.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
