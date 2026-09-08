# SwanPay

Solana-native payment operating system — merchant dashboard, payment intents, Solana Pay checkout, sandbox verification, recovery states, webhooks, and invoices.

## Stack

- React 18 + TypeScript + Vite
- React Router v6
- Plain CSS (green fintech palette: `#071a12` / `#3ee08f`)
- Integer minor-unit money math (no floats)
- In-memory sandbox ledger for demo

## Quick start

```bash
npm install
npm run dev
```

Open:

- Landing: http://localhost:5173/
- Sandbox checkout: http://localhost:5173/pay/demo
- Merchant dashboard: http://localhost:5173/app

## Features

- **Payment intents** with accepted assets, settlement preference, and recovery (partial / overpaid)
- **Checkout** with Solana Pay style URL/QR surface and sandbox pay scenarios
- **Independent verification architecture** (demo simulates server-side confirm)
- **Merchant areas**: Payments, Intents, Links, Invoices, Customers, Wallets, Settlements, Automations, API, Webhooks, Sandbox, Analytics, Settings, Admin
- **Webhooks** with delivery log
- **Analytics** volume series and conversion

## Demo org

Northwind Labs (sandbox). Seeded intents include settled, partially paid, and awaiting payment examples.

## License

MIT
