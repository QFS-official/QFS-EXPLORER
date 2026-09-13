"use client";

import * as React from "react";
import {
  Activity,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Box,
  CreditCard,
  ChartPie,
  CircleDollarSign,
  Fuel,
  Globe,
  Hash,
  Link2,
  RefreshCw,
  Repeat,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Users,
  Vault,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  activitySeries,
  CHAIN,
  fmt,
  fmtCompact,
  short,
  sparkSeries,
  TOKENS,
  timeAgo,
} from "@/lib/explorer";
import { useExplorer } from "./store";
import {
  ChartTip,
  Delta,
  DevDot,
  HashLink,
  HexGlyph,
  IconBox,
  LaunchProgress,
  OperativeDot,
  Panel,
  Spark,
  StatusBadge,
  TokenIcon,
  VerifiedBadge,
  ViewAllBtn,
} from "./bits";
import { cn } from "@/lib/utils";

/* -------------------------------- hero ------------------------------- */

const POPULAR = [
  { label: "QFS Token", q: "QFS" },
  { label: short(TOKENS[0].address, 14, 4) + "...", q: TOKENS[0].address },
  { label: "Latest Blocks", q: "" },
  { label: "Top Wallets", q: "" },
];

function HeroRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-400">
      {icon} {label}:
      <span className="ml-auto font-medium text-slate-200">{children}</span>
    </div>
  );
}

export function Hero() {
  const { search, go, openDetail } = useExplorer();
  const [q, setQ] = React.useState("");

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!q.trim()) return;
    search(q);
  };

  const onChip = (label: string) => {
    if (label === "Latest Blocks") return go("blocks");
    if (label === "Top Wallets") return go("addresses");
    if (label.startsWith("0x")) return openDetail({ kind: "address", address: TOKENS[0].address });
    search(label);
  };

  return (
    <section className="hero-space relative overflow-hidden rounded-2xl border border-[#1b3067]">
      <div className="starfield pointer-events-none absolute inset-0 opacity-70" />
      <div className="globe pointer-events-none absolute -right-20 -top-24 h-[300px] w-[300px] opacity-60" />

      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          {/* Accesos rápidos al ecosistema QFSPay */}
          <div className="mb-4 flex flex-wrap items-center gap-2.5">
            <a
              href="https://qfspay.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-blue-950/50 ring-1 ring-blue-400/30 transition-all hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-900/60"
            >
              <Wallet className="h-3.5 w-3.5" />
              Open QFSPay
              <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>
            <a
              href="https://dex.qfspay.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 transition-all hover:border-cyan-400/70 hover:bg-cyan-500/20 hover:text-cyan-200"
            >
              <ArrowLeftRight className="h-3.5 w-3.5" />
              QFS DEX
              <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>
            <a
              href="https://card.qfspay.org"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 transition-all hover:border-amber-400/70 hover:bg-amber-500/20 hover:text-amber-200"
            >
              <CreditCard className="h-3.5 w-3.5" />
              QFS Card
              <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>
            <a
              href="https://qfswallet.qfspay.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/10 px-4 py-2 text-xs font-semibold text-violet-300 transition-all hover:border-violet-400/70 hover:bg-violet-500/20 hover:text-violet-200"
            >
              <Vault className="h-3.5 w-3.5" />
              QFS Wallet
              <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
            </a>
          </div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold tracking-[0.32em] text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" /> QFS NETWORK <Sparkles className="h-3.5 w-3.5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            QFS Explorer
          </h1>
          <p className="mt-2.5 max-w-xl text-sm text-slate-400 sm:text-[15px]">
            Explore transactions, wallets, tokens, contracts and network activity on the QFS
            blockchain.
          </p>

          <form onSubmit={submit} className="mt-5 flex max-w-xl items-center gap-2" role="search">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by Address / Transaction Hash / Block / Token / Contract"
                className="h-11 w-full rounded-full border border-[#22407f] bg-[#060f2d]/90 pl-10 pr-4 text-[13px] text-slate-100 placeholder:text-slate-500 focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                aria-label="Search the QFS blockchain"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/50 transition-colors hover:bg-blue-500"
            >
              <Search className="h-4 w-4" /> Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500">Popular:</span>
            {POPULAR.map((p) => (
              <button
                key={p.label}
                onClick={() => onChip(p.label === "QFS Token" ? "QFS" : p.label)}
                className="rounded-full border border-[#22407f] bg-[#0a1638]/80 px-3 py-1 text-[11px] text-slate-300 transition-colors hover:border-blue-500/60 hover:text-white"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-7">
          <div className="hidden items-center gap-3 sm:flex">
            <HexGlyph size={64} />
            <span className="text-4xl font-black italic tracking-tight text-white">QFS</span>
          </div>

          <div className="flex w-full flex-col gap-3.5 lg:w-[272px]">
            {/* Red actual */}
            <div className="qfs-card w-full p-4">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Current Network
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-blue-950/40">
                  <HexGlyph size={26} className="[&_path]:!stroke-white/90" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">QFS Polygon</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <OperativeDot /> Operational
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-[12px]">
                <HeroRow icon={<Globe className="h-3.5 w-3.5 text-blue-400" />} label="Network">
                  Polygon PoS
                </HeroRow>
                <HeroRow icon={<Hash className="h-3.5 w-3.5 text-blue-400" />} label="Chain ID">
                  137
                </HeroRow>
                <HeroRow icon={<CircleDollarSign className="h-3.5 w-3.5 text-blue-400" />} label="Asset">
                  QFS
                </HeroRow>
                <HeroRow icon={<ShieldCheck className="h-3.5 w-3.5 text-blue-400" />} label="Standard">
                  ERC-20
                </HeroRow>
                <HeroRow icon={<Link2 className="h-3.5 w-3.5 text-blue-400" />} label="Contract">
                  <button
                    onClick={() => openDetail({ kind: "address", address: TOKENS[0].address })}
                    title={TOKENS[0].address}
                    className="mono text-[11px] text-blue-400 transition-colors hover:text-blue-300 hover:underline"
                  >
                    {short(TOKENS[0].address, 8, 6)}
                  </button>
                </HeroRow>
              </div>
            </div>

            {/* Red futura */}
            <div className="qfs-card w-full p-4" style={{ borderStyle: "dashed" }}>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-500/80">
                Future Network
              </div>
              <div className="mt-2 flex items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg shadow-amber-950/40">
                  <Sparkles className="h-5 w-5 text-white/90" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">QFS Reserve Network</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                    <DevDot /> In Development
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-2 text-[12px]">
                <HeroRow icon={<Activity className="h-3.5 w-3.5 text-amber-400" />} label="Status">
                  <span className="text-amber-400">Development</span>
                </HeroRow>
                <HeroRow icon={<CircleDollarSign className="h-3.5 w-3.5 text-amber-400" />} label="Native Asset">
                  QFS
                </HeroRow>
                <HeroRow icon={<Globe className="h-3.5 w-3.5 text-amber-400" />} label="Blockchain">
                  <span className="italic text-slate-400">Coming Soon</span>
                </HeroRow>
              </div>
              <LaunchProgress className="mt-3 border-t border-[#16295c]/70 pt-3" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ stats row ---------------------------- */

function StatCard({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="qfs-card qfs-card-hover p-4">
      <div className="flex items-center gap-2.5">
        <IconBox size="sm" className="h-8 w-8">
          {icon}
        </IconBox>
        <span className="text-xs font-medium text-slate-400">{label}</span>
      </div>
      {children}
    </div>
  );
}

function StatsRow() {
  const { blocks, tick, totalTx } = useExplorer();
  const latest = blocks[0];
  const gasSpark = React.useMemo(() => sparkSeries(7, 20, 0.6), []);
  const blockSpark = React.useMemo(() => sparkSeries(11, 20, 0.8), []);
  const txSpark = React.useMemo(() => sparkSeries(23, 20, 1.1), []);
  const walletSpark = React.useMemo(() => sparkSeries(31, 20, 0.9), []);

  return (
    <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 xl:grid-cols-5">
      <StatCard label="Latest Block" icon={<Box className="h-4 w-4" />}>
        <div className="mt-2.5 text-[19px] font-bold leading-tight text-white">
          {fmt(latest.number)}
        </div>
        <div className="mt-1 flex items-center justify-between gap-1">
          <div className="text-[11px] leading-tight">
            <div className="text-slate-500">{timeAgo(latest.offset + (tick - latest.atTick))}</div>
            <Delta value={2.4} />
          </div>
          <Spark data={blockSpark} width={72} height={34} />
        </div>
      </StatCard>

      <StatCard label="Total Transactions" icon={<ArrowLeftRight className="h-4 w-4" />}>
        <div className="mt-2.5 text-[19px] font-bold leading-tight text-white">{fmt(totalTx)}</div>
        <div className="mt-1 flex items-center justify-between gap-1">
          <Delta value={12.6} className="mt-0.5" />
          <Spark data={txSpark} width={72} height={34} color="#60a5fa" />
        </div>
      </StatCard>

      <StatCard label="Active Wallets" icon={<Users className="h-4 w-4" />}>
        <div className="mt-2.5 text-[19px] font-bold leading-tight text-white">
          {fmt(CHAIN.activeWallets)}
        </div>
        <div className="mt-1 flex items-center justify-between gap-1">
          <Delta value={8.3} className="mt-0.5" />
          <Spark data={walletSpark} width={72} height={34} color="#a78bfa" />
        </div>
      </StatCard>

      <StatCard label="QFS Supply" icon={<CircleDollarSign className="h-4 w-4" />}>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="truncate text-[16px] font-bold leading-tight text-white 2xl:text-[19px]">
            {fmt(CHAIN.supply)}
          </span>
          <span className="shrink-0 text-[11px] font-medium text-slate-400">QFS</span>
        </div>
        <div className="mt-2.5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#122450]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
              style={{ width: "65%" }}
            />
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500">65% circulating</div>
        </div>
      </StatCard>

      <StatCard label="Gas Price" icon={<Fuel className="h-4 w-4" />}>
        <div className="mt-2.5 flex items-baseline gap-1.5">
          <span className="text-[17px] font-bold leading-tight text-white">{CHAIN.gas}</span>
          <span className="text-[11px] font-medium text-slate-400">POL</span>
        </div>
        <div className="mt-1 flex items-center justify-between gap-1">
          <div className="text-[11px] leading-tight">
            <div className="text-slate-500">≈ $0.00</div>
            <Delta value={1.1} />
          </div>
          <Spark data={gasSpark} width={72} height={34} />
        </div>
      </StatCard>
    </div>
  );
}

/* --------------------------- activity chart -------------------------- */

const RANGES = ["1H", "24H", "7D", "30D"] as const;

function ActivityCard() {
  const [range, setRange] = React.useState<(typeof RANGES)[number]>("24H");
  const data = React.useMemo(() => activitySeries(range), [range]);

  return (
    <Panel
      title="Network Activity"
      icon={<Activity className="h-4 w-4" />}
      className="xl:col-span-6"
      bodyClassName="p-4 pt-2"
      right={
        <div className="flex items-center gap-1 rounded-lg border border-[#1b2f63] bg-[#071132] p-0.5">
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                range === r ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
              )}
            >
              {r}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-[248px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="gTx" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.42} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="gAddr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" stopOpacity={0.36} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(63,110,214,.14)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fill: "#5b6b93", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              minTickGap={18}
            />
            <YAxis
              yAxisId="l"
              tickFormatter={(v: number) => fmtCompact(v)}
              tick={{ fill: "#60a5fa", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <YAxis
              yAxisId="r"
              orientation="right"
              tickFormatter={(v: number) => fmtCompact(v)}
              tick={{ fill: "#c084fc", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              width={44}
            />
            <RTooltip content={<ChartTip />} cursor={{ stroke: "rgba(96,150,255,.3)" }} />
            <Area
              yAxisId="l"
              type="monotone"
              dataKey="tx"
              name="Transactions"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#gTx)"
            />
            <Area
              yAxisId="r"
              type="monotone"
              dataKey="addr"
              name="Active Addresses"
              stroke="#a855f7"
              strokeWidth={2}
              fill="url(#gAddr)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex items-center gap-4 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> Transactions
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-500" /> Active Addresses
        </span>
      </div>
    </Panel>
  );
}

/* ------------------------- token distribution ------------------------ */

function DistributionCard() {
  const data = TOKENS.map((t) => ({ name: t.symbol, value: t.share, color: t.distColor }));
  return (
    <Panel
      title="Token Distribution"
      icon={<ChartPie className="h-4 w-4" />}
      className="xl:col-span-3"
    >
      <div className="relative mx-auto h-[168px] w-full max-w-[210px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((d) => (
                <Cell key={d.name} fill={d.color} />
              ))}
            </Pie>
            <RTooltip content={<ChartTip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="text-base font-bold text-white">100B</div>
            <div className="text-[10px] text-slate-500">Total Supply</div>
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-1.5">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: d.color }} />
            <span className="font-medium text-slate-300">{d.name}</span>
            <span className="ml-auto font-semibold text-white">{d.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* --------------------------- network status -------------------------- */

function StatusRow({
  icon,
  label,
  value,
  valueNode,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2.5 border-b border-[#122451]/70 py-[7px] text-[12px] last:border-0">
      <span className="text-blue-400">{icon}</span>
      <span className="text-slate-400">{label}</span>
      <span className="ml-auto truncate font-medium text-slate-200">
        {valueNode ?? value}
      </span>
    </div>
  );
}

function NetworkStatusCard() {
  const { blocks, tick, totalTx } = useExplorer();
  const latest = blocks[0];
  return (
    <Panel
      title="Network Status"
      icon={<Server className="h-4 w-4" />}
      className="xl:col-span-3 xl:row-span-2"
      right={<StatusBadge />}
    >
      <div>
        <StatusRow
          icon={<Globe className="h-3.5 w-3.5" />}
          label="Network"
          valueNode={
            <span className="flex items-center gap-1.5 text-emerald-400">
              <OperativeDot /> Polygon PoS
            </span>
          }
        />
        <StatusRow icon={<Box className="h-3.5 w-3.5" />} label="Block Height" value={fmt(latest.number)} />
        <StatusRow
          icon={<RefreshCw className="h-3.5 w-3.5" />}
          label="Latest Block"
          value={timeAgo(latest.offset + (tick - latest.atTick))}
        />
        <StatusRow icon={<ArrowLeftRight className="h-3.5 w-3.5" />} label="Transactions" value={fmtCompact(totalTx)} />
        <StatusRow icon={<Users className="h-3.5 w-3.5" />} label="Active Addresses" value={fmtCompact(CHAIN.activeWallets)} />
        <StatusRow icon={<Repeat className="h-3.5 w-3.5" />} label="Token Transfers" value={fmtCompact(CHAIN.tokenTransfers)} />
        <StatusRow icon={<Hash className="h-3.5 w-3.5" />} label="Chain ID" value="137" />
        <StatusRow icon={<CircleDollarSign className="h-3.5 w-3.5" />} label="Asset" value="QFS" />
        <StatusRow icon={<ShieldCheck className="h-3.5 w-3.5" />} label="Standard" value="ERC-20" />
        <StatusRow
          icon={<Server className="h-3.5 w-3.5" />}
          label="RPC Endpoint"
          valueNode={<span className="mono text-[11px] text-blue-400">https://polygon-rpc.com</span>}
        />
      </div>
    </Panel>
  );
}

/* ---------------------------- latest blocks -------------------------- */

function LatestBlocks() {
  const { blocks, tick, openDetail, go } = useExplorer();
  return (
    <Panel
      title="Latest Blocks"
      icon={<Box className="h-4 w-4" />}
      className="xl:col-span-4"
      right={<ViewAllBtn onClick={() => go("blocks")} />}
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[440px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Block #</th>
              <th className="px-3 py-2 font-medium">Timestamp</th>
              <th className="px-3 py-2 font-medium">Transactions</th>
              <th className="px-4 py-2 font-medium">Mined By</th>
            </tr>
          </thead>
          <tbody>
            {blocks.slice(0, 5).map((b) => (
              <tr key={b.number} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                <td className="px-4 py-2.5">
                  <span className="flex items-center gap-2">
                    <IconBox size="sm" className="h-7 w-7">
                      <Box className="h-3.5 w-3.5" />
                    </IconBox>
                    <HashLink
                      value={fmt(b.number)}
                      onClick={() => openDetail({ kind: "block", number: b.number })}
                    />
                  </span>
                </td>
                <td className="px-3 py-2.5 text-slate-400">{timeAgo(b.offset + (tick - b.atTick))}</td>
                <td className="px-3 py-2.5 text-slate-300">{fmt(b.txCount)}</td>
                <td className="px-4 py-2.5 text-slate-400">{b.validator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* -------------------------- latest transactions ---------------------- */

function LatestTxs() {
  const { txs, tick, openDetail, go } = useExplorer();
  return (
    <Panel
      title="Latest Transactions"
      icon={<ArrowLeftRight className="h-4 w-4" />}
      className="xl:col-span-5"
      right={<ViewAllBtn onClick={() => go("transactions")} />}
      bodyClassName="p-0"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Tx Hash</th>
              <th className="px-3 py-2 font-medium">From</th>
              <th className="px-3 py-2 font-medium">To</th>
              <th className="px-3 py-2 text-right font-medium">Amount</th>
              <th className="px-4 py-2 text-right font-medium">Time</th>
            </tr>
          </thead>
          <tbody>
            {txs.slice(0, 5).map((t) => (
              <tr key={t.hash} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                <td className="px-4 py-2.5">
                  <HashLink
                    className="max-w-[130px]"
                    value={short(t.hash, 6, 4)}
                    icon={<span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-blue-500/15 text-[9px] text-blue-400">↗</span>}
                    onClick={() => openDetail({ kind: "tx", hash: t.hash })}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <HashLink
                    className="max-w-[110px]"
                    value={short(t.from, 6, 4)}
                    onClick={() => openDetail({ kind: "address", address: t.from })}
                  />
                </td>
                <td className="px-3 py-2.5">
                  <HashLink
                    className="max-w-[110px]"
                    value={short(t.to, 6, 4)}
                    onClick={() => openDetail({ kind: "address", address: t.to })}
                  />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <span className="font-semibold text-white">{fmt(t.amount)}</span>{" "}
                  <span className="text-[11px] text-slate-400">QFS</span>
                </td>
                <td className="px-4 py-2.5 text-right text-slate-500">
                  {timeAgo(t.offset + (tick - t.atTick))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ------------------------------ top tokens --------------------------- */

function TopTokens() {
  const { go, openDetail } = useExplorer();
  return (
    <Panel
      title="Top Tokens by Holders"
      icon={<ChartPie className="h-4 w-4" />}
      className="xl:col-span-9"
      bodyClassName="p-0"
      right={<ViewAllBtn onClick={() => go("tokens")} />}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2 font-medium">Token</th>
              <th className="px-3 py-2 font-medium">Price</th>
              <th className="px-3 py-2 font-medium">Holders</th>
              <th className="px-3 py-2 font-medium">Transfers</th>
              <th className="px-4 py-2 font-medium">Network</th>
            </tr>
          </thead>
          <tbody>
            {TOKENS.map((t) => (
              <tr key={t.symbol} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                <td className="px-4 py-2.5">
                  <button
                    className="flex items-center gap-2.5"
                    onClick={() => openDetail({ kind: "address", address: t.address })}
                  >
                    <TokenIcon token={t} size={26} />
                    <span className="font-semibold text-white">{t.symbol}</span>
                  </button>
                </td>
                <td className="px-3 py-2.5">
                  <div className="text-slate-200">${t.price.toFixed(6)}</div>
                  <Delta value={t.change} />
                </td>
                <td className="px-3 py-2.5 text-slate-300">{fmt(t.holders)}</td>
                <td className="px-3 py-2.5 text-slate-300">{fmt(t.transfers)}</td>
                <td className="px-4 py-2.5">
                  <span className="rounded-md border border-[#22407f] bg-[#0a1638] px-2 py-0.5 text-[11px] text-slate-300">
                    Polygon
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

/* ----------------------------- verify promo -------------------------- */

function VerifyPromo() {
  const { go } = useExplorer();
  return (
    <div className="qfs-card relative overflow-hidden p-4 xl:col-span-3">
      <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-blue-600/25 blur-2xl" />
      <div className="flex items-start gap-3">
        <IconBox size="lg" className="border-emerald-500/25 bg-emerald-500/10 text-emerald-400">
          <ShieldCheck className="h-5 w-5" />
        </IconBox>
        <div>
          <div className="text-sm font-semibold text-white">Verify Contracts</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Check official contracts and avoid scams.
          </p>
        </div>
      </div>
      <button
        onClick={() => go("verification")}
        className="mt-3.5 inline-flex h-9 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-[13px] font-semibold text-white transition-colors hover:bg-blue-500"
      >
        Go to Verification <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

/* -------------------------- verified contracts ----------------------- */

function VerifiedContractsRow() {
  const { openDetail } = useExplorer();
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 xl:grid-cols-12">
      <div className="qfs-card flex items-start gap-3 p-4 xl:col-span-4">
        <IconBox size="lg" className="border-blue-500/25 bg-blue-500/10 text-blue-400">
          <ShieldCheck className="h-5 w-5" />
        </IconBox>
        <div>
          <div className="text-sm font-semibold text-white">Verified Contracts</div>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            Make sure you&apos;re interacting with the official QFS contracts.
          </p>
        </div>
      </div>
      {TOKENS.map((t) => (
        <button
          key={t.symbol}
          onClick={() => openDetail({ kind: "address", address: t.address })}
          className="qfs-card qfs-card-hover p-4 text-left xl:col-span-2"
        >
          <div className="flex items-center gap-2">
            <TokenIcon token={t} size={24} />
            <span className="text-[13px] font-semibold text-white">{t.symbol}</span>
            <VerifiedBadge />
          </div>
          <div className="mt-1.5 text-[11px] text-slate-500">Polygon</div>
          <div className="mono mt-0.5 truncate text-[11px] text-blue-400">{short(t.address, 10, 6)}</div>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------- overview ---------------------------- */

export function Overview() {
  return (
    <div className="space-y-3.5">
      <Hero />
      <StatsRow />
      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 xl:grid-cols-12">
        <ActivityCard />
        <DistributionCard />
        <NetworkStatusCard />
        <LatestBlocks />
        <LatestTxs />
        <TopTokens />
        <VerifyPromo />
      </div>
      <VerifiedContractsRow />
    </div>
  );
}
