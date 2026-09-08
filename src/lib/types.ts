export type IntentStatus =
  | "created"
  | "pending"
  | "awaiting_payment"
  | "payment_detected"
  | "verifying"
  | "confirmed"
  | "settled"
  | "partially_paid"
  | "overpaid"
  | "expired"
  | "failed"
  | "cancelled"
  | "refunded";

export type DisplayCurrency = "USD" | "EUR" | "NGN";

export type PaymentIntent = {
  id: string;
  status: IntentStatus;
  amount: string;
  amountMinor: string;
  currency: DisplayCurrency;
  acceptedAssets: string[];
  settlementAsset: string;
  description: string;
  customerName: string | null;
  customerEmail: string | null;
  reference: string;
  recipient: string;
  network: "sandbox" | "devnet" | "mainnet-beta";
  paidAsset: string | null;
  paidRaw: string | null;
  signature: string | null;
  recovery: {
    kind: string;
    receivedDisplay: string;
    requiredDisplay: string;
    remainingDisplay: string | null;
    message: string;
  } | null;
  createdAt: string;
  confirmedAt: string | null;
  checkoutUrl: string;
};

export type TimelineEvent = {
  id: string;
  at: string;
  title: string;
  detail: string | null;
};

export type Invoice = {
  id: string;
  number: string;
  status: "draft" | "open" | "partially_paid" | "paid" | "overdue" | "cancelled";
  customerName: string;
  currency: DisplayCurrency;
  totalMinor: string;
  dueDate: string;
  paymentIntentId: string | null;
  items: { description: string; quantity: string; amountMinor: string }[];
};

export type PaymentLink = {
  id: string;
  amount: string;
  amountMinor: string;
  currency: DisplayCurrency;
  description: string;
  acceptedAssets: string[];
  active: boolean;
  intentId: string;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string | null;
  totalPaidMinor: string;
  paymentCount: number;
  lastPaymentAt: string | null;
};

export type WebhookEndpoint = {
  id: string;
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
};

export type WebhookDelivery = {
  id: string;
  eventType: string;
  success: boolean;
  statusCode: number | null;
  createdAt: string;
};

export type Organization = {
  id: string;
  name: string;
  displayCurrency: DisplayCurrency;
  settlementAsset: string;
  settlementWallet: string;
  acceptedAssets: string[];
  environment: "sandbox" | "live";
};

export type Analytics = {
  totalVolumeMinor: string;
  successful: number;
  failed: number;
  pending: number;
  paymentCount: number;
  conversionRate: number;
  byAsset: { asset: string; volumeMinor: string; count: number }[];
  series: { day: string; volumeMinor: string; count: number }[];
};
