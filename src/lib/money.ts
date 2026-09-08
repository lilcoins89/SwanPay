/** Decimal-safe money helpers — never use floating point for token amounts. */

export function parseDecimal(input: string, decimals: number): bigint {
  const text = String(input).trim();
  if (!/^\d+(\.\d+)?$/.test(text)) throw new Error(`Invalid amount: ${input}`);
  const [whole, frac = ""] = text.split(".");
  if (frac.length > decimals) throw new Error(`Too many decimal places`);
  const padded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(padded || "0");
}

export function formatAmount(raw: bigint, decimals: number, minFrac = 0): string {
  const neg = raw < 0n;
  const abs = neg ? -raw : raw;
  const scale = 10n ** BigInt(decimals);
  const whole = abs / scale;
  let frac = (abs % scale).toString().padStart(decimals, "0");
  if (minFrac < decimals) {
    frac = frac.replace(/0+$/, "");
    if (frac.length < minFrac) frac = frac.padEnd(minFrac, "0");
  }
  const body = frac ? `${whole}.${frac}` : whole.toString();
  return neg ? `-${body}` : body;
}

export function formatDisplay(raw: bigint, currency: string, decimals = 2): string {
  const n = formatAmount(raw, decimals, 2);
  if (currency === "USD") return `$${n}`;
  if (currency === "EUR") return `€${n}`;
  if (currency === "NGN") return `₦${n}`;
  return `${n} ${currency}`;
}

export function displayToToken(args: {
  displayRaw: bigint;
  displayDecimals: number;
  price: string;
  priceScale: number;
  tokenDecimals: number;
}): bigint {
  const priceMinor = parseDecimal(args.price, args.priceScale);
  if (priceMinor <= 0n) throw new Error("Price must be positive");
  const numer = args.displayRaw * 10n ** BigInt(args.tokenDecimals) * 10n ** BigInt(args.priceScale);
  const denom = priceMinor * 10n ** BigInt(args.displayDecimals);
  return numer / denom;
}
