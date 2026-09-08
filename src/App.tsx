import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Dashboard } from "./pages/Dashboard";
import { Payments } from "./pages/Payments";
import { PaymentDetail } from "./pages/PaymentDetail";
import { Intents } from "./pages/Intents";
import { Checkout } from "./pages/Checkout";
import {
  AdminPage, AnalyticsPage, ApiPage, AutomationsPage, CustomersPage, DocsPage,
  InvoicePublicPage, InvoicesPage, LinksPage, PricingPage, QrPage, ReceiptPage,
  SandboxPage, SettingsPage, SettlementsPage, WalletsPage, WebhooksPage,
} from "./pages/SimplePages";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/pay/:id" element={<Checkout />} />
        <Route path="/p/:id" element={<Checkout />} />
        <Route path="/i/:id" element={<InvoicePublicPage />} />
        <Route path="/r/:id" element={<ReceiptPage />} />
        <Route path="/admin" element={<AppShell />}>
          <Route index element={<AdminPage />} />
        </Route>
        <Route path="/app" element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="payments" element={<Payments />} />
          <Route path="payments/:id" element={<PaymentDetail />} />
          <Route path="intents" element={<Intents />} />
          <Route path="links" element={<LinksPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="qr" element={<QrPage />} />
          <Route path="customers" element={<CustomersPage />} />
          <Route path="wallets" element={<WalletsPage />} />
          <Route path="settlements" element={<SettlementsPage />} />
          <Route path="automations" element={<AutomationsPage />} />
          <Route path="api" element={<ApiPage />} />
          <Route path="webhooks" element={<WebhooksPage />} />
          <Route path="sandbox" element={<SandboxPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
