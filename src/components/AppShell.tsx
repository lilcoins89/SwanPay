import { Link, NavLink, Outlet } from "react-router-dom";
import { Wordmark } from "./Mark";
import { getOrg } from "../data/store";
import { useState } from "react";

const NAV = [
  { to: "/app", label: "Overview", end: true },
  { to: "/app/payments", label: "Payments" },
  { to: "/app/intents", label: "Intents" },
  { to: "/app/links", label: "Links" },
  { to: "/app/invoices", label: "Invoices" },
  { to: "/app/qr", label: "QR codes" },
  { to: "/app/customers", label: "Customers" },
  { to: "/app/wallets", label: "Wallets" },
  { to: "/app/settlements", label: "Settlements" },
  { to: "/app/automations", label: "Automations" },
  { to: "/app/api", label: "API" },
  { to: "/app/webhooks", label: "Webhooks" },
  { to: "/app/sandbox", label: "Sandbox" },
  { to: "/app/analytics", label: "Analytics" },
  { to: "/app/settings", label: "Settings" },
  { to: "/admin", label: "Admin" },
  { to: "/docs", label: "Docs" },
];

export function AppShell() {
  const org = getOrg();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="sidebar-nav">
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}
        >
          <span className="nav-dot" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Link to="/">
            <Wordmark />
          </Link>
        </div>
        {nav}
        <div className="sidebar-foot">
          <strong>{org.name}</strong>
          <span style={{ textTransform: "uppercase", letterSpacing: "0.06em" }}>{org.environment}</span>
        </div>
      </aside>
      <div className="main-col">
        <header className="topbar">
          <button type="button" className="menu-btn" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? "✕" : "☰"}
          </button>
          <p className="muted" style={{ display: "none" }}>
            Payments that understand the intent.
          </p>
          <div style={{ marginLeft: "auto" }}>
            <span className="badge-sandbox">Sandbox</span>
          </div>
        </header>
        {open ? <div className="mobile-nav">{nav}</div> : null}
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
