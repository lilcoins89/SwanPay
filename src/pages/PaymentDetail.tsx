import { Link, useParams } from "react-router-dom";
import { getIntent, getTimeline } from "../data/store";
import { formatDisplay } from "../lib/money";
import { StatusBadge } from "../components/StatusBadge";

export function PaymentDetail() {
  const { id } = useParams();
  const intent = id ? getIntent(id) : null;
  const timeline = id ? getTimeline(id) : [];

  if (!intent) {
    return (
      <div className="space-y">
        <h1 className="page-title">Payment not found</h1>
        <Link to="/app/payments" className="btn btn-ghost">Back to payments</Link>
      </div>
    );
  }

  return (
    <div className="space-y">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <div>
          <p className="subtle mono" style={{ fontSize: 12 }}>{intent.id}</p>
          <h1 className="page-title">{intent.description}</h1>
          <p className="page-sub">{intent.customerName ?? "No customer"} · {intent.network}</p>
        </div>
        <StatusBadge status={intent.status} />
      </div>

      <div className="grid-4">
        <div className="card">
          <p className="stat-label">Amount</p>
          <p className="stat-value tabular">{formatDisplay(BigInt(intent.amountMinor), intent.currency)}</p>
        </div>
        <div className="card">
          <p className="stat-label">Paid asset</p>
          <p className="stat-value">{intent.paidAsset ?? "—"}</p>
        </div>
        <div className="card">
          <p className="stat-label">Settlement</p>
          <p className="stat-value">{intent.settlementAsset}</p>
        </div>
        <div className="card">
          <p className="stat-label">Reference</p>
          <p className="mono" style={{ marginTop: 8, fontSize: 12, wordBreak: "break-all" }}>{intent.reference}</p>
        </div>
      </div>

      {intent.recovery ? (
        <div className="recovery">
          <p style={{ fontWeight: 600 }}>Recovery · {intent.recovery.kind}</p>
          <p className="muted" style={{ marginTop: 8 }}>{intent.recovery.message}</p>
          <p className="mono" style={{ marginTop: 8 }}>
            Received {intent.recovery.receivedDisplay} · Required {intent.recovery.requiredDisplay}
            {intent.recovery.remainingDisplay ? ` · Remaining ${intent.recovery.remainingDisplay}` : ""}
          </p>
        </div>
      ) : null}

      {intent.signature ? (
        <div className="card">
          <p className="stat-label">Signature</p>
          <p className="mono" style={{ marginTop: 8, wordBreak: "break-all" }}>{intent.signature}</p>
        </div>
      ) : null}

      <div className="card">
        <p style={{ fontWeight: 500, marginBottom: 16 }}>Timeline</p>
        <div className="timeline">
          {timeline.map((ev) => (
            <div key={ev.id} className="timeline-item">
              <p style={{ fontWeight: 500 }}>{ev.title}</p>
              {ev.detail ? <p className="muted" style={{ fontSize: 13 }}>{ev.detail}</p> : null}
              <p className="subtle" style={{ fontSize: 11 }}>{new Date(ev.at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        <Link to={`/pay/${intent.id}`} className="btn btn-primary">Open checkout</Link>
        <Link to="/app/payments" className="btn btn-ghost">All payments</Link>
      </div>
    </div>
  );
}
