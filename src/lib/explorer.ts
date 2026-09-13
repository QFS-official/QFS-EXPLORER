// QFS Explorer – simulated network data layer (deterministic seeds + live tickers)

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HEX = "0123456789abcdef";
const HEX_UP = "0123456789ABCDEF";

export function genHex(rng: () => number, len: number, upper = false): string {
  let s = "";
  for (let i = 0; i < len; i++) s += (upper ? HEX_UP : HEX)[Math.floor(rng() * 16)];
  return s;
}
export function genAddress(rng: () => number) {
  return "0x" + genHex(rng, 40);
}
export function genHash(rng: () => number) {
  return "0x" + genHex(rng, 64);
}

export function short(a: string, l = 6, r = 4) {
  return a.length > l + r + 4 ? `${a.slice(0, l)}...${a.slice(-r)}` : a;
}

export const nf = new Intl.NumberFormat("en-US");
export const fmt = (n: number) => nf.format(Math.round(n));

export function fmtCompact(n: number) {
  if (n >= 1e9) return (n / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  return String(Math.round(n));
}

export function fmtUsdTiny(n: number) {
  return "$" + n.toFixed(6);
}

export function timeAgo(offsetSec: number) {
  const s = Math.max(0, Math.round(offsetSec));
  if (s < 60) return `${s} sec${s === 1 ? "" : ""} ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr${h > 1 ? "s" : ""} ago`;
  const d = Math.floor(h / 24);
  return `${d} day${d > 1 ? "s" : ""} ago`;
}

export function absTime(offsetSec: number) {
  const d = new Date(Date.now() - offsetSec * 1000);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ------------------------------ types ------------------------------ */

export interface Block {
  number: number;
  offset: number; // base age in seconds when created
  atTick: number; // tick (seconds) at creation
  txCount: number;
  validator: string;
  gasUsed: number;
  gasLimit: number;
  size: number;
  hash: string;
  parentHash: string;
  reward: number;
}

export interface Tx {
  hash: string;
  from: string;
  to: string;
  amount: number;
  offset: number;
  atTick: number;
  block: number;
  fee: number;
  status: "success" | "pending";
}

export interface TokenStatic {
  symbol: string;
  name: string;
  color: string;
  distColor: string;
  share: number;
  holders: number;
  transfers: number;
  price: number;
  change: number;
  address: string;
  coin: boolean;
  compiler: string;
  deployed: string;
}

/* --------------------------- static config -------------------------- */

export const CHAIN = {
  name: "QFS Polygon",
  chainId: 137,
  network: "Polygon",
  rpc: "https://polygon-rpc.com",
  ws: "wss://polygon-rpc.com/ws",
  graphql: "https://api-qfs.network/graphql",
  supply: 100_000_000_000,
  gas: "0.00000008",
  latestStart: 85_421_392,
  totalTxStart: 12_458_921,
  activeWallets: 184_520,
  tokenTransfers: 8_700_000,
};

export const TOKENS: TokenStatic[] = [
  {
    symbol: "QFS",
    name: "Quantum Financial System",
    color: "#f5b81c",
    distColor: "#3b82f6",
    share: 60,
    holders: 12_458,
    transfers: 845_201,
    price: 0.000025,
    change: 12.6,
    address: "0xb5787DA56A4eaF11864696d8B5C6671aDF3449E7",
    coin: true,
    compiler: "v0.8.24",
    deployed: "Jan 12, 2025",
  },
  {
    symbol: "GCRM",
    name: "Global Currency Restart Master",
    color: "#22c55e",
    distColor: "#22c55e",
    share: 14,
    holders: 3_921,
    transfers: 421_092,
    price: 0.00025,
    change: 6.2,
    address: "0x11175910c6F02913782777840ac008F30720046f",
    coin: false,
    compiler: "v0.8.22",
    deployed: "Mar 03, 2025",
  },
  {
    symbol: "AlArab",
    name: "AlArab Coin",
    color: "#ef4444",
    distColor: "#8b5cf6",
    share: 9,
    holders: 5_281,
    transfers: 180_422,
    price: 0.25,
    change: -2.4,
    address: "0xF5c068f28eBF91b22e52C2ecD230621879e914B8",
    coin: false,
    compiler: "v0.8.20",
    deployed: "Jun 18, 2025",
  },
  {
    symbol: "TRAEX",
    name: "TRAEX",
    color: "#3b82f6",
    distColor: "#f59e0b",
    share: 8,
    holders: 3_120,
    transfers: 94_812,
    price: 0.001,
    change: 4.1,
    address: "0xf343cD6836FD14bE86aAE0a2a76c8b0e73E89dD0",
    coin: false,
    compiler: "v0.8.24",
    deployed: "Sep 09, 2025",
  },
  {
    symbol: "NESG",
    name: "NESG Token",
    color: "#14b8a6",
    distColor: "#14b8a6",
    share: 9,
    holders: 2_140,
    transfers: 61_437,
    price: 0.10,
    change: 8.3,
    address: "0xE64ceD357672e70fA5cE1fCAEc52c8F690528bcC",
    coin: false,
    compiler: "v0.8.24",
    deployed: "Feb 14, 2026",
  },
];

export const VALIDATOR_NAMES = Array.from(
  { length: 64 },
  (_, i) => `Polygon Validator ${String(i + 1).padStart(2, "0")}`
);

/* ----------------------- reserve network launch --------------------- */

// QFS Reserve Network — development window
// start: QFS token deployment (Jan 12, 2025) · target launch: Apr 7, 2027
export const RESERVE_LAUNCH = {
  startISO: "2025-01-12T00:00:00Z",
  targetISO: "2027-04-07T00:00:00Z",
  targetLabel: "Apr 7, 2027",
};

export function launchProgress(now = Date.now()) {
  // Quantize to the current UTC day so SSR and client always agree (no hydration drift)
  const day = Math.floor(now / 86_400_000) * 86_400_000;
  const start = new Date(RESERVE_LAUNCH.startISO).getTime();
  const target = new Date(RESERVE_LAUNCH.targetISO).getTime();
  const total = target - start;
  const done = Math.min(Math.max(day - start, 0), total);
  const pct = Math.round((done / total) * 100_000) / 1_000; // 3 decimals, stable
  const daysLeft = Math.max(0, Math.round((target - day) / 86_400_000));
  const totalDays = Math.round(total / 86_400_000);
  const elapsedDays = Math.round(done / 86_400_000);
  return { pct, daysLeft, totalDays, elapsedDays };
}

/* ----------------------------- portfolio ---------------------------- */

export interface PortfolioEntry {
  token: TokenStatic;
  balance: number;
  usd: number;
}

// Deterministic demo balances derived from the connected address
export function walletPortfolio(address: string): { entries: PortfolioEntry[]; totalUsd: number } {
  const rng = mulberry32(seedFrom(address.toLowerCase()));
  const base: Record<string, number> = {
    QFS: 2_400_000,
    GCRM: 96_000,
    AlArab: 14_500,
    TRAEX: 380_000,
    NESG: 2_400,
  };
  const entries: PortfolioEntry[] = TOKENS.map((t) => {
    const balance = Math.round((base[t.symbol] ?? 100_000) * (0.6 + rng() * 0.8));
    return { token: t, balance, usd: balance * t.price };
  });
  const totalUsd = entries.reduce((a, e) => a + e.usd, 0);
  return { entries, totalUsd };
}

/* --------------------------- initial state -------------------------- */

const seedRng = mulberry32(20260913);

export const INITIAL_BLOCKS: Block[] = (() => {
  const defs = [
    { number: 85_421_392, offset: 2, txCount: 2485, validator: "Polygon Validator 12" },
    { number: 85_421_391, offset: 14, txCount: 3102, validator: "Polygon Validator 08" },
    { number: 85_421_390, offset: 26, txCount: 1982, validator: "Polygon Validator 21" },
    { number: 85_421_389, offset: 38, txCount: 2671, validator: "Polygon Validator 03" },
    { number: 85_421_388, offset: 50, txCount: 2317, validator: "Polygon Validator 17" },
  ];
  const base = defs.map((d) => ({
    ...d,
    atTick: 0,
    gasUsed: 12_000_000 + Math.round(seedRng() * 4_500_000),
    gasLimit: 30_000_000,
    size: 30_000 + Math.round(seedRng() * 42_000),
    hash: genHash(seedRng),
    parentHash: "",
    reward: 1200 + Math.round(seedRng() * 800),
  }));
  return base.map((b, i) => ({
    ...b,
    parentHash: base[i + 1] ? base[i + 1].hash : "0x" + genHex(seedRng, 64),
  }));
})();

export const INITIAL_TXS: Tx[] = (() => {
  const defs = [
    { amount: 25_000, offset: 12 },
    { amount: 5_000, offset: 24 },
    { amount: 12_500, offset: 36 },
    { amount: 8_000, offset: 48 },
    { amount: 15_000, offset: 60 },
  ];
  return defs.map((d, i) => ({
    hash: genHash(seedRng),
    from: genAddress(seedRng),
    to: genAddress(seedRng),
    amount: d.amount,
    offset: d.offset,
    atTick: 0,
    block: 85_421_392 - i,
    fee: 0.000042 + seedRng() * 0.0002,
    status: "success" as const,
  }));
})();

/* ----------------------------- factories ---------------------------- */

export function makeBlock(prev: number, tick: number, rng: () => number): Block {
  return {
    number: prev + 1,
    offset: 0,
    atTick: tick,
    txCount: 1800 + Math.round(rng() * 1500),
    validator: VALIDATOR_NAMES[Math.floor(rng() * VALIDATOR_NAMES.length)],
    gasUsed: 11_000_000 + Math.round(rng() * 6_500_000),
    gasLimit: 30_000_000,
    size: 28_000 + Math.round(rng() * 46_000),
    hash: genHash(rng),
    parentHash: "",
    reward: 1100 + Math.round(rng() * 900),
  };
}

const TX_STEPS = [100, 250, 500, 1_000, 2_500, 5_000, 7_500, 10_000, 12_500, 15_000, 25_000, 50_000];

export function makeTx(rng: () => number, block: number, tick: number): Tx {
  return {
    hash: genHash(rng),
    from: genAddress(rng),
    to: genAddress(rng),
    amount: TX_STEPS[Math.floor(rng() * TX_STEPS.length)],
    offset: 0,
    atTick: tick,
    block,
    fee: 0.000042 + rng() * 0.0002,
    status: rng() > 0.06 ? ("success" as const) : ("pending" as const),
  };
}

/* --------------------------- chart series --------------------------- */

export type Range = "1H" | "24H" | "7D" | "30D";

export function activitySeries(range: Range): { t: string; tx: number; addr: number }[] {
  const rng = mulberry32(range.charCodeAt(0) * 7777 + range.length * 913);
  if (range === "24H") {
    return Array.from({ length: 24 }, (_, i) => ({
      t: `${String(i).padStart(2, "0")}:00`,
      tx: Math.round(6.2e6 + rng() * 12.8e6),
      addr: Math.round(45_000 + rng() * 148_000),
    }));
  }
  if (range === "1H") {
    return Array.from({ length: 13 }, (_, i) => ({
      t: `:${String(i * 5).padStart(2, "0")}`,
      tx: Math.round(90_000 + rng() * 85_000),
      addr: Math.round(20_000 + rng() * 62_000),
    }));
  }
  if (range === "7D") {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      t: d,
      tx: Math.round(40e6 + rng() * 92e6),
      addr: Math.round(120_000 + rng() * 262_000),
    }));
  }
  return Array.from({ length: 30 }, (_, i) => ({
    t: String(i + 1),
    tx: Math.round(30e6 + rng() * 112e6),
    addr: Math.round(100_000 + rng() * 284_000),
  }));
}

export function sparkSeries(seed: number, n = 22, drift = 1): { i: number; v: number }[] {
  const rng = mulberry32(seed);
  let v = 46;
  return Array.from({ length: n }, (_, i) => {
    v += (rng() - 0.42) * 9 + drift * 1.5;
    return { i, v: Math.max(8, v) };
  });
}

/* ---------------------------- top wallets --------------------------- */

const WALLET_LABELS = [
  "QFS Treasury",
  "QFS Bridge",
  "Polygon Foundation",
  "Binance Hot Wallet",
  "Coinbase Custody",
  "QFS Staking Contract",
  "DEX Liquidity POL/QFS",
  "Kraken Cold Wallet",
  "QFS Reserve Vault",
  "Bybit Hot Wallet",
  "OKX Custody",
  "QFS Grant Program",
  "Gemini Cold Wallet",
  "QFS Liquidity Module",
  "MEV Bot Network",
  "QFS Ecosystem Fund",
  "Crypto.com Custody",
  "QFS Settlement Layer",
  "Ledger Live Aggregate",
  "QFS Team Vesting",
];

export interface Wallet {
  rank: number;
  label: string;
  address: string;
  balance: number;
  pct: number;
  txCount: number;
}

export function topWallets(): Wallet[] {
  const rng = mulberry32(4242);
  const weights = WALLET_LABELS.map((_, i) => 1 / Math.pow(i + 1, 1.42));
  const wsum = weights.reduce((a, b) => a + b, 0);
  return WALLET_LABELS.map((label, i) => {
    const balance = Math.round(CHAIN.supply * 0.42 * (weights[i] / wsum));
    return {
      rank: i + 1,
      label,
      address: genAddress(rng),
      balance,
      pct: (balance / CHAIN.supply) * 100,
      txCount: 12_000 + Math.round(rng() * 900_000),
    };
  });
}

/* ------------------------- token transfers -------------------------- */

export interface Transfer {
  hash: string;
  from: string;
  to: string;
  amount: number;
  symbol: string;
  offset: number;
}

export function tokenTransfers(): Transfer[] {
  const rng = mulberry32(90210);
  return Array.from({ length: 24 }, (_, i) => {
    const tok = TOKENS[Math.floor(rng() * TOKENS.length)];
    const steps = [500, 1_200, 4_000, 8_500, 12_000, 30_000, 75_000, 120_000, 400_000];
    return {
      hash: genHash(rng),
      from: genAddress(rng),
      to: genAddress(rng),
      amount: steps[Math.floor(rng() * steps.length)],
      symbol: tok.symbol,
      offset: 30 + i * 47 + Math.round(rng() * 30),
    };
  });
}

/* ------------------------------ search ------------------------------ */

export type SearchHit =
  | { kind: "address"; value: string }
  | { kind: "tx"; value: string }
  | { kind: "block"; value: number }
  | { kind: "token"; value: string }
  | { kind: "none"; value: string };

export function parseSearch(q: string): SearchHit {
  const s = q.trim();
  if (/^0x[0-9a-fA-F]{40}$/.test(s)) return { kind: "address", value: s };
  if (/^0x[0-9a-fA-F]{64}$/.test(s)) return { kind: "tx", value: s };
  if (/^\d+$/.test(s)) return { kind: "block", value: parseInt(s, 10) };
  const low = s.toLowerCase();
  const tok = TOKENS.find(
    (t) => t.symbol.toLowerCase() === low || (low.length > 2 && t.name.toLowerCase().includes(low))
  );
  if (tok) return { kind: "token", value: tok.symbol };
  return { kind: "none", value: s };
}

export function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
