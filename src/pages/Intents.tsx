import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createIntent, listIntents } from "../data/store";
import { formatDisplay } from "../lib/money";
import { StatusBadge } from "../components/StatusBadge";

export function Intents() {
  const navigate = useNavigate();
  const intents = listIntents();
  const [amount, setAmount] = useState("25.00");
  const [description, setDescription] = useState("Payment");
  const [customerName, setCustomerName] = useState("");
  const [assets, setAssets] = useState("USDC,SOL");
  const [settlement, setSettlement] = useState("USDC");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const acceptedAssets = assets.split(",").map((s) => s.trim()).filter(Boolean);
    const pi = createIntent({
      amount,
      currency: "USD",
      acceptedAssets,
      settlementAsset: settlement,
      description,
      customerName: customerName || undefined,
    });
    navigate(`/pay/${pi.id}`);
  }

  return (
    <div className="space-y">
      <div>
        <h1 className="page-title">Payment intents</h1>
        <p className="page-sub">Create a new intent and open the sandbox checkout</p>
      </div>

      <form className="card stack" onSubmit={onSubmit}>
        <div className="row">
          <div className="field" style={{ flex: 1, minWidth: 140 }}>
            <label>Amount (USD)</label>
            <input value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>
          <div className="field" style={{ flex: 1, minWidth: 140 }}>
            <label>Settlement asset</label>
            <select value={settlement} onChange={(e) => setSettlement(e.target.value)}>
              <option>USDC</option>
              <option>SOL</option>
              <option>JUP</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Accepted assets (comma-separated)</label>
          <input value={assets} onChange={(e) => setAssets(e.target.value)} />
        </div>
        <div className="field">
          <label>Description</label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="field">
          <label>Customer name (optional)</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Create & open checkout</button>
      </form>

      <div className="card" style={{ padding: 0, overflow: "auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Intent</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {intents.map((i) => (
              <tr key={i.id}>
                <td className="mono">{i.id}</td>
                <td className="muted">{i.description}</td>
                <td className="tabular">{formatDisplay(BigInt(i.amountMinor), i.currency)}</td>
                <td><StatusBadge status={i.status} /></td>
                <td>
                  <Link to={`/pay/${i.id}`} className="muted">Checkout</Link>
                  {" · "}
                  <Link to={`/app/payments/${i.id}`} className="muted">Detail</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
