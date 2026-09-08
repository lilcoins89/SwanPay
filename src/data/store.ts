import { displayToToken, formatAmount, formatDisplay, parseDecimal } from "../lib/money";
import type {
  Analytics, Customer, Invoice, Organization, PaymentIntent, PaymentLink,
  TimelineEvent, WebhookDelivery, WebhookEndpoint,
} from "../lib/types";

const PRICES: Record<string, string> = { SOL: "148.50", USDC: "1.00", JUP: "0.82", BONK: "0.0000214", PYTH: "0.37" };
const DECIMALS: Record<string, number> = { SOL: 9, USDC: 6, JUP: 6, BONK: 5, PYTH: 6 };

function id(prefix: string) {
  const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
  let s = prefix + "_";
  for (let i = 0; i < 16; i++) s += alphabet[Math.floor(Math.random() * alphabet.length)];
  return s;
}
function hoursAgo(n: number) { return new Date(Date.now() - n * 3600000).toISOString(); }
function daysAgo(n: number) { return new Date(Date.now() - n * 86400000).toISOString(); }

const MERCHANT_WALLET = "SwanMerch7xKXtg2CW87d97TXJSDpbD5jBkheTq1zuo";

export const org: Organization = {
  id: "org_demo", name: "Northwind Labs", displayCurrency: "USD", settlementAsset: "USDC",
  settlementWallet: MERCHANT_WALLET, acceptedAssets: ["SOL", "USDC", "JUP"], environment: "sandbox",
};

let intents: PaymentIntent[] = [
  {
    id: "pi_website50", status: "settled", amount: "50.00", amountMinor: "5000", currency: "USD",
    acceptedAssets: ["SOL", "USDC"], settlementAsset: "USDC", description: "Website development",
    customerName: "Helios Design", customerEmail: "ap@helios.design",
    reference: "Ref7xKXtg2CW87d97TXJSDpbD5jBkheTq1zu", recipient: MERCHANT_WALLET, network: "sandbox",
    paidAsset: "USDC", paidRaw: "50000000", signature: "5xKXtg2CW87d97TXJSDpbD5jBkheTq1zuoABCDEF123456",
    recovery: null, createdAt: hoursAgo(6), confirmedAt: hoursAgo(5.9), checkoutUrl: "/pay/pi_website50",
  },
  {
    id: "pi_retainer240", status: "partially_paid", amount: "240.00", amountMinor: "24000", currency: "USD",
    acceptedAssets: ["USDC"], settlementAsset: "USDC", description: "Monthly retainers",
    customerName: "Orbit Freight", customerEmail: "finance@orbitfreight.io",
    reference: "RefOrbitFreightPaymentRef0012345", recipient: MERCHANT_WALLET, network: "sandbox",
    paidAsset: "USDC", paidRaw: "226560000", signature: "4yPartialSigOrbitFreightDemo000001",
    recovery: {
      kind: "partial", receivedDisplay: "226.56 USDC", requiredDisplay: "$240.00",
      remainingDisplay: "13.44 USDC", message: "Payment needs attention. A remaining balance is still due.",
    },
    createdAt: hoursAgo(3), confirmedAt: null, checkoutUrl: "/pay/pi_retainer240",
  },
  {
    id: "pi_api12", status: "awaiting_payment", amount: "12.00", amountMinor: "1200", currency: "USD",
    acceptedAssets: ["SOL", "USDC", "JUP"], settlementAsset: "SOL", description: "API usage — March",
    customerName: null, customerEmail: null, reference: "RefApiUsageMarchDemoRef0001234",
    recipient: MERCHANT_WALLET, network: "sandbox", paidAsset: null, paidRaw: null, signature: null,
    recovery: null, createdAt: hoursAgo(1), confirmedAt: null, checkoutUrl: "/pay/pi_api12",
  },
];

const timelines: Record<string, TimelineEvent[]> = {
  pi_website50: [
    { id: "tl1", at: hoursAgo(6), title: "Payment created", detail: "Website development" },
    { id: "tl2", at: hoursAgo(5.95), title: "Checkout opened", detail: null },
    { id: "tl3", at: hoursAgo(5.92), title: "Wallet connected", detail: null },
    { id: "tl4", at: hoursAgo(5.91), title: "Transaction detected", detail: null },
    { id: "tl5", at: hoursAgo(5.9), title: "Transaction verified", detail: "Independent server verification" },
    { id: "tl6", at: hoursAgo(5.9), title: "Payment confirmed", detail: "USDC received" },
    { id: "tl7", at: hoursAgo(5.89), title: "USDC settled", detail: "Merchant received 50.00 USDC" },
  ],
  pi_retainer240: [
    { id: "tl8", at: hoursAgo(3), title: "Payment created", detail: "Monthly retainers" },
    { id: "tl9", at: hoursAgo(2.8), title: "Partial payment received", detail: "226.56 USDC of $240.00" },
  ],
  pi_api12: [{ id: "tl10", at: hoursAgo(1), title: "Payment created", detail: "API usage — March" }],
};

let invoices: Invoice[] = [{
  id: "in_001", number: "INV-0001", status: "open", customerName: "Helios Design", currency: "USD",
  totalMinor: "600000", dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
  paymentIntentId: null,
  items: [
    { description: "Product design sprint", quantity: "1", amountMinor: "420000" },
    { description: "Design system tokens", quantity: "1", amountMinor: "180000" },
  ],
}];

let links: PaymentLink[] = [{
  id: "pl_office", amount: "25.00", amountMinor: "2500", currency: "USD", description: "Office hours",
  acceptedAssets: ["USDC", "SOL"], active: true, intentId: "pi_api12", createdAt: daysAgo(2),
}];

let customers: Customer[] = [
  { id: "cus_helios", name: "Helios Design", email: "ap@helios.design", totalPaidMinor: "5000", paymentCount: 1, lastPaymentAt: hoursAgo(5.9) },
  { id: "cus_orbit", name: "Orbit Freight", email: "finance@orbitfreight.io", totalPaidMinor: "0", paymentCount: 0, lastPaymentAt: null },
];

let webhooks: WebhookEndpoint[] = [{
  id: "we_1", url: "https://example.com/webhooks/swanpay", secret: "whsec_demo_secret_northwind",
  events: ["payment.confirmed", "payment.settled", "invoice.paid"], enabled: true,
}];

let deliveries: WebhookDelivery[] = [
  { id: "whd_1", eventType: "payment.confirmed", success: true, statusCode: 200, createdAt: hoursAgo(5.9) },
  { id: "whd_2", eventType: "payment.settled", success: true, statusCode: 200, createdAt: hoursAgo(5.89) },
];

export const walletBalances: Record<string, string> = {
  SOL: "12500000000", USDC: "240000000", JUP: "85000000", BONK: "150000000000", PYTH: "400000000",
};

export function getOrg() { return org; }
export function listIntents() { return [...intents].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
export function getIntent(intentId: string) { return intents.find((i) => i.id === intentId) ?? null; }
export function getTimeline(intentId: string) { return timelines[intentId] ?? []; }
export function listInvoices() { return invoices; }
export function listLinks() { return links; }
export function listCustomers() { return customers; }
export function listWebhooks() { return { endpoints: webhooks, deliveries }; }

export function getAnalytics(): Analytics {
  const list = listIntents();
  const successful = list.filter((i) => ["confirmed", "settled", "overpaid"].includes(i.status)).length;
  const failed = list.filter((i) => ["failed", "expired", "cancelled"].includes(i.status)).length;
  const pending = list.filter((i) =>
    ["awaiting_payment", "pending", "created", "partially_paid", "verifying", "payment_detected"].includes(i.status),
  ).length;
  const volume = list.filter((i) => ["confirmed", "settled", "overpaid"].includes(i.status))
    .reduce((a, i) => a + BigInt(i.amountMinor), 0n);
  const byAssetMap = new Map<string, { volume: bigint; count: number }>();
  for (const i of list) {
    const asset = i.paidAsset ?? i.settlementAsset;
    const cur = byAssetMap.get(asset) ?? { volume: 0n, count: 0 };
    cur.count += 1; cur.volume += BigInt(i.amountMinor); byAssetMap.set(asset, cur);
  }
  const seriesMap = new Map<string, { volume: bigint; count: number }>();
  for (let d = 6; d >= 0; d--) {
    const day = new Date(Date.now() - d * 86400000).toISOString().slice(0, 10);
    seriesMap.set(day, { volume: 0n, count: 0 });
  }
  for (const i of list) {
    const day = i.createdAt.slice(0, 10);
    const cur = seriesMap.get(day) ?? { volume: 0n, count: 0 };
    cur.count += 1; cur.volume += BigInt(i.amountMinor); seriesMap.set(day, cur);
  }
  return {
    totalVolumeMinor: volume.toString(), successful, failed, pending, paymentCount: list.length,
    conversionRate: list.length ? successful / list.length : 0,
    byAsset: [...byAssetMap.entries()].map(([asset, v]) => ({ asset, volumeMinor: v.volume.toString(), count: v.count })),
    series: [...seriesMap.entries()].map(([day, v]) => ({ day, volumeMinor: v.volume.toString(), count: v.count })),
  };
}

export function createIntent(input: {
  amount: string; currency: "USD" | "EUR" | "NGN"; acceptedAssets: string[];
  settlementAsset: string; description?: string; customerName?: string;
}): PaymentIntent {
  const amountMinor = parseDecimal(input.amount, 2);
  const pi: PaymentIntent = {
    id: id("pi"), status: "awaiting_payment", amount: input.amount, amountMinor: amountMinor.toString(),
    currency: input.currency, acceptedAssets: input.acceptedAssets, settlementAsset: input.settlementAsset,
    description: input.description ?? "Payment", customerName: input.customerName ?? null, customerEmail: null,
    reference: id("Ref").slice(0, 32), recipient: MERCHANT_WALLET, network: "sandbox",
    paidAsset: null, paidRaw: null, signature: null, recovery: null,
    createdAt: new Date().toISOString(), confirmedAt: null, checkoutUrl: "",
  };
  pi.checkoutUrl = `/pay/${pi.id}`;
  intents = [pi, ...intents];
  timelines[pi.id] = [{ id: id("tl"), at: pi.createdAt, title: "Payment created", detail: pi.description }];
  return pi;
}

export function tokenAmountFor(amountMinor: string, currency: string, asset: string) {
  const price = PRICES[asset] ?? "1.00";
  const tokenDecimals = DECIMALS[asset] ?? 6;
  const raw = displayToToken({
    displayRaw: BigInt(amountMinor), displayDecimals: 2, price, priceScale: 2, tokenDecimals,
  });
  return {
    asset, raw: raw.toString(), formatted: formatAmount(raw, tokenDecimals, 2),
    display: formatDisplay(BigInt(amountMinor), currency, 2), decimals: tokenDecimals,
  };
}

export type PayScenario = "full" | "partial" | "overpay" | "wrong_token";

export function sandboxPay(intentId: string, asset: string, scenario: PayScenario = "full") {
  const intent = intents.find((i) => i.id === intentId);
  if (!intent) throw new Error("Payment not found");
  if (intent.network !== "sandbox") throw new Error("Sandbox only");
  const expected = tokenAmountFor(intent.amountMinor, intent.currency, asset);
  let amountRaw = BigInt(expected.raw);
  let paidAsset = asset;
  if (scenario === "partial") amountRaw = (amountRaw * 944n) / 1000n;
  if (scenario === "overpay") amountRaw = (amountRaw * 110n) / 100n;
  if (scenario === "wrong_token") {
    paidAsset = asset === "USDC" ? "SOL" : "USDC";
    amountRaw = BigInt(tokenAmountFor(intent.amountMinor, intent.currency, paidAsset).raw);
  }
  const signature = id("sig");
  const now = new Date().toISOString();
  const events = timelines[intentId] ?? [];
  events.push(
    { id: id("tl"), at: now, title: "Wallet connected", detail: null },
    { id: id("tl"), at: now, title: "Transaction signed", detail: signature },
    { id: id("tl"), at: now, title: "Transaction detected", detail: null },
    { id: id("tl"), at: now, title: "Transaction verified", detail: "Independent server verification" },
  );
  const expectedRaw = BigInt(expected.raw);
  if (scenario === "wrong_token") {
    intent.status = "failed";
    intent.recovery = {
      kind: "wrong_token",
      receivedDisplay: `${formatAmount(amountRaw, DECIMALS[paidAsset] ?? 6, 2)} ${paidAsset}`,
      requiredDisplay: formatDisplay(BigInt(intent.amountMinor), intent.currency, 2),
      remainingDisplay: formatDisplay(BigInt(intent.amountMinor), intent.currency, 2),
      message: "A different token was received. The original amount is still due.",
    };
    events.push({ id: id("tl"), at: now, title: "Payment failed verification", detail: "Wrong mint" });
  } else if (amountRaw < expectedRaw) {
    intent.status = "partially_paid";
    const remaining = expectedRaw - amountRaw;
    intent.recovery = {
      kind: "partial",
      receivedDisplay: `${formatAmount(amountRaw, DECIMALS[asset] ?? 6, 2)} ${asset}`,
      requiredDisplay: formatDisplay(BigInt(intent.amountMinor), intent.currency, 2),
      remainingDisplay: `${formatAmount(remaining, DECIMALS[asset] ?? 6, 2)} ${asset}`,
      message: "Payment needs attention. A remaining balance is still due.",
    };
    events.push({ id: id("tl"), at: now, title: "Partial payment received", detail: intent.recovery.message });
  } else if (amountRaw > expectedRaw) {
    intent.status = "overpaid";
    intent.recovery = {
      kind: "overpaid",
      receivedDisplay: `${formatAmount(amountRaw, DECIMALS[asset] ?? 6, 2)} ${asset}`,
      requiredDisplay: formatDisplay(BigInt(intent.amountMinor), intent.currency, 2),
      remainingDisplay: null,
      message: "Overpayment detected. Funds are held pending merchant action.",
    };
    intent.confirmedAt = now;
    events.push({ id: id("tl"), at: now, title: "Overpayment detected", detail: intent.recovery.message });
  } else {
    intent.status = "settled";
    intent.recovery = null;
    intent.confirmedAt = now;
    events.push(
      { id: id("tl"), at: now, title: "Payment confirmed", detail: `${asset} received` },
      { id: id("tl"), at: now, title: `${intent.settlementAsset} settled`, detail: `Merchant received settlement in ${intent.settlementAsset}` },
    );
    deliveries = [
      { id: id("whd"), eventType: "payment.confirmed", success: true, statusCode: 204, createdAt: now },
      { id: id("whd"), eventType: "payment.settled", success: true, statusCode: 204, createdAt: now },
      ...deliveries,
    ];
  }
  intent.paidAsset = paidAsset;
  intent.paidRaw = amountRaw.toString();
  intent.signature = signature;
  timelines[intentId] = events;
  return intent;
}

export function ensureDemoCheckout(): PaymentIntent {
  const open = intents.find((i) =>
    ["awaiting_payment", "created", "pending", "partially_paid"].includes(i.status),
  );
  if (open) return open;
  return createIntent({
    amount: "50.00", currency: "USD", acceptedAssets: ["SOL", "USDC", "JUP"],
    settlementAsset: "USDC", description: "Website development", customerName: "Helios Design",
  });
}
