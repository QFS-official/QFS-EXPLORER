"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  Box,
  Coins,
  Copy,
  Gauge,
  Star,
  Timer,
  Users,
  Wallet,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { toast } from "@/hooks/use-toast";
import {
  CHAIN,
  fmt,
  fmtCompact,
  fmtUsdTiny,
  short,
  timeAgo,
  TOKENS,
  topWallets,
  walletPortfolio,
} from "@/lib/explorer";
import { useExplorer } from "./store";
import { Delta, HashLink, IconBox, Panel, TokenIcon } from "./bits";
import { cn } from "@/lib/utils";

/* ------------------------------ shared ------------------------------- */

export function ViewHeader({
  title,
  subtitle,
  stats,
}: {
  title: string;
  subtitle: string;
  stats?: { label: string; value: string; icon: React.ReactNode }[];
}) {
  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-xl font-bold text-white sm:text-2xl">{title}</h1>
        <p className="mt-1 text-[13px] text-slate-400">{subtitle}</p>
      </div>
      {stats && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="qfs-card flex items-center gap-3 p-3.5">
              <IconBox size="sm" className="h-8 w-8">
                {s.icon}
              </IconBox>
              <div className="min-w-0">
                <div className="truncate text-[11px] text-slate-500">{s.label}</div>
                <div className="truncate text-sm font-bold text-white">{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function CopyBtn({ value, className }: { value: string; className?: string }) {
  return (
    <button
      title="Copy to clipboard"
      className={cn(
        "grid h-6 w-6 shrink-0 place-items-center rounded border border-[#22407f] text-slate-500 transition-colors hover:border-blue-500/60 hover:text-blue-400",
        className
      )}
      onClick={() => {
        window.navigator.clipboard?.writeText(value).catch(() => {});
        toast({ title: "Copied", description: short(value, 14, 10) });
      }}
    >
      <Copy className="h-3 w-3" />
    </button>
  );
}

/* --------------------------- 1. transactions -------------------------- */

export function TransactionsView() {
  const { txs, tick, totalTx, openDetail } = useExplorer();
  const [filter, setFilter] = React.useState<"all" | "pending">("all");
  const [limit, setLimit] = React.useState(15);
  const list = txs.filter((t) => (filter === "all" ? true : t.status === "pending")).slice(0, limit);

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Transactions"
        subtitle="The latest QFS transactions broadcast to the network, in real time."
        stats={[
          { label: "Total Transactions", value: fmtCompact(totalTx), icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
          { label: "Token Transfers", value: fmtCompact(CHAIN.tokenTransfers), icon: <Coins className="h-3.5 w-3.5" /> },
          { label: "Avg. Fee", value: "$0.000118", icon: <Gauge className="h-3.5 w-3.5" /> },
          { label: "Median Time", value: "2.0 sec", icon: <Timer className="h-3.5 w-3.5" /> },
        ]}
      />

      <Panel
        title="Latest Transactions"
        icon={<ArrowLeftRight className="h-4 w-4" />}
        bodyClassName="p-0"
        right={
          <div className="flex items-center gap-1 rounded-lg border border-[#1b2f63] bg-[#071132] p-0.5">
            {(["all", "pending"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "rounded-md px-3 py-1 text-[11px] font-medium capitalize transition-colors",
                  filter === f ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">Tx Hash</th>
                <th className="px-3 py-2.5 font-medium">Block</th>
                <th className="px-3 py-2.5 font-medium">From</th>
                <th className="px-3 py-2.5 font-medium">To</th>
                <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 text-right font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {list.map((t) => (
                <tr key={t.hash} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                  <td className="max-w-[150px] px-4 py-2.5">
                    <HashLink
                      className="max-w-[130px]"
                      value={short(t.hash, 8, 6)}
                      onClick={() => openDetail({ kind: "tx", hash: t.hash })}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <HashLink
                      value={`#${fmt(t.block)}`}
                      onClick={() => openDetail({ kind: "block", number: t.block })}
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
                  <td className="px-3 py-2.5">
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-[11px] font-medium",
                        t.status === "success"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      )}
                    >
                      {t.status === "success" ? "✓ Success" : "◌ Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-500">
                    {timeAgo(t.offset + (tick - t.atTick))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {limit < txs.length && (
          <div className="border-t border-[#122451]/70 p-3 text-center">
            <button
              onClick={() => setLimit((l) => l + 15)}
              className="rounded-lg border border-[#22407f] px-4 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:border-blue-500/60 hover:text-blue-300"
            >
              Load More
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ------------------------------ 2. blocks ---------------------------- */

export function BlocksView() {
  const { blocks, tick, openDetail } = useExplorer();
  const [limit, setLimit] = React.useState(15);
  const list = blocks.slice(0, limit);

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Blocks"
        subtitle="Recently mined blocks on the QFS Network (Polygon Chain ID 137)."
        stats={[
          { label: "Latest Block", value: fmt(blocks[0].number), icon: <Box className="h-3.5 w-3.5" /> },
          { label: "Avg Block Time", value: "12 sec", icon: <Timer className="h-3.5 w-3.5" /> },
          { label: "Gas Used (latest)", value: `${((blocks[0].gasUsed / blocks[0].gasLimit) * 100).toFixed(1)}%`, icon: <Gauge className="h-3.5 w-3.5" /> },
          { label: "Validators", value: "64 active", icon: <Users className="h-3.5 w-3.5" /> },
        ]}
      />

      <Panel title="Latest Blocks" icon={<Box className="h-4 w-4" />} bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">Block</th>
                <th className="px-3 py-2.5 font-medium">Age</th>
                <th className="px-3 py-2.5 text-right font-medium">Txns</th>
                <th className="px-3 py-2.5 font-medium">Validator</th>
                <th className="px-3 py-2.5 font-medium">Gas Used</th>
                <th className="px-3 py-2.5 font-medium">Gas Limit</th>
                <th className="px-4 py-2.5 text-right font-medium">Reward</th>
              </tr>
            </thead>
            <tbody>
              {list.map((b) => {
                const pct = (b.gasUsed / b.gasLimit) * 100;
                return (
                  <tr key={b.number} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-2">
                        <IconBox size="sm" className="h-7 w-7">
                          <Box className="h-3.5 w-3.5" />
                        </IconBox>
                        <HashLink
                          value={`#${fmt(b.number)}`}
                          onClick={() => openDetail({ kind: "block", number: b.number })}
                        />
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-400">{timeAgo(b.offset + (tick - b.atTick))}</td>
                    <td className="px-3 py-2.5 text-right text-slate-300">{fmt(b.txCount)}</td>
                    <td className="px-3 py-2.5 text-slate-400">{b.validator}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-12 text-slate-300">{fmtCompact(b.gasUsed)}</span>
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-[#122450]">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              pct > 80 ? "bg-amber-400" : "bg-blue-500"
                            )}
                            style={{ width: `${Math.min(100, pct)}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-slate-500">{pct.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-slate-500">{fmtCompact(b.gasLimit)}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-slate-300">
                      {fmt(b.reward)} QFS
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {limit < blocks.length && (
          <div className="border-t border-[#122451]/70 p-3 text-center">
            <button
              onClick={() => setLimit((l) => l + 10)}
              className="rounded-lg border border-[#22407f] px-4 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:border-blue-500/60 hover:text-blue-300"
            >
              Load More
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ---------------------------- 3. addresses --------------------------- */

export function AddressesView() {
  const { openDetail } = useExplorer();
  const wallets = React.useMemo(() => topWallets(), []);
  const [limit, setLimit] = React.useState(10);

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Top Wallets"
        subtitle="Ranking of the largest QFS holders on the network."
        stats={[
          { label: "Active Addresses", value: fmt(CHAIN.activeWallets), icon: <Users className="h-3.5 w-3.5" /> },
          { label: "Top 10 Holdings", value: "38.2%", icon: <Wallet className="h-3.5 w-3.5" /> },
          { label: "Total Supply", value: fmtCompact(CHAIN.supply), icon: <Coins className="h-3.5 w-3.5" /> },
          { label: "New Addresses 24h", value: "+4,318", icon: <Users className="h-3.5 w-3.5" /> },
        ]}
      />

      <Panel title="Top Accounts by Balance" icon={<Wallet className="h-4 w-4" />} bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">Rank</th>
                <th className="px-3 py-2.5 font-medium">Address</th>
                <th className="px-3 py-2.5 text-right font-medium">Balance</th>
                <th className="px-3 py-2.5 font-medium">Percentage</th>
                <th className="px-4 py-2.5 text-right font-medium">Txn Count</th>
              </tr>
            </thead>
            <tbody>
              {wallets.slice(0, limit).map((w) => (
                <tr key={w.address} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                  <td className="px-4 py-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-md border border-[#22407f] bg-[#0a1638] text-[11px] font-semibold text-slate-400">
                      {w.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <HashLink
                        className="max-w-[170px]"
                        value={short(w.address, 10, 8)}
                        onClick={() => openDetail({ kind: "address", address: w.address })}
                      />
                      <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400">
                        {w.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <span className="font-semibold text-white">{fmt(w.balance)}</span>
                    <span className="ml-1 text-[11px] text-slate-400">QFS</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#122450]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                          style={{ width: `${Math.max(2, (w.pct / 8) * 100)}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-slate-400">{w.pct.toFixed(2)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right text-slate-300">{fmt(w.txCount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {limit < wallets.length && (
          <div className="border-t border-[#122451]/70 p-3 text-center">
            <button
              onClick={() => setLimit((l) => l + 10)}
              className="rounded-lg border border-[#22407f] px-4 py-1.5 text-xs font-medium text-blue-400 transition-colors hover:border-blue-500/60 hover:text-blue-300"
            >
              Load More
            </button>
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ---------------------------- 3.5 portfolio -------------------------- */

const usd2 = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function PortfolioView() {
  const { wallet, toggleWallet, watchlist, toggleWatch } = useExplorer();
  const portfolio = React.useMemo(() => (wallet ? walletPortfolio(wallet) : null), [wallet]);

  if (!wallet || !portfolio) {
    return (
      <div className="space-y-4">
        <ViewHeader
          title="Portfolio"
          subtitle="Your balances, allocation and watchlist on the QFS Network."
        />
        <div className="qfs-card mx-auto max-w-md p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-600 shadow-lg shadow-blue-950/40">
            <Wallet className="h-6 w-6 text-white/90" />
          </div>
          <div className="mt-4 text-base font-bold text-white">Connect your wallet</div>
          <p className="mx-auto mt-2 max-w-[300px] text-[13px] leading-relaxed text-slate-400">
            Portfolio balances, USD allocation and your personal watchlist unlock right after
            connecting a wallet on QFS Polygon.
          </p>
          <button
            onClick={toggleWallet}
            className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            <Wallet className="h-4 w-4" /> Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  const { entries, totalUsd } = portfolio;
  const watched = TOKENS.filter((t) => watchlist.includes(t.symbol));
  const donut = entries.map((e) => ({ name: e.token.symbol, value: e.usd, color: e.token.color }));

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Portfolio"
        subtitle="Your balances, allocation and watchlist on the QFS Network."
        stats={[
          { label: "Total Balance", value: usd2(totalUsd), icon: <Gauge className="h-3.5 w-3.5" /> },
          { label: "Assets Held", value: String(entries.length), icon: <Coins className="h-3.5 w-3.5" /> },
          { label: "Watchlist", value: String(watched.length), icon: <Star className="h-3.5 w-3.5" /> },
          { label: "Address", value: short(wallet, 6, 4), icon: <Wallet className="h-3.5 w-3.5" /> },
        ]}
      />

      <div className="grid gap-3.5 lg:grid-cols-3">
        <Panel title="Assets" icon={<Coins className="h-4 w-4" />} className="lg:col-span-2" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-medium">Asset</th>
                  <th className="px-3 py-2.5 text-right font-medium">Balance</th>
                  <th className="px-3 py-2.5 text-right font-medium">Price</th>
                  <th className="px-3 py-2.5 text-right font-medium">Value</th>
                  <th className="px-4 py-2.5 text-right font-medium">Allocation</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e) => {
                  const pct = totalUsd > 0 ? (e.usd / totalUsd) * 100 : 0;
                  return (
                    <tr key={e.token.symbol} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <TokenIcon token={e.token} size={30} />
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-white">{e.token.symbol}</div>
                            <div className="truncate text-[10px] text-slate-500">{e.token.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right font-medium text-slate-200">{fmt(e.balance)}</td>
                      <td className="px-3 py-3 text-right text-slate-400">{fmtUsdTiny(e.token.price)}</td>
                      <td className="px-3 py-3 text-right font-semibold text-white">{usd2(e.usd)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-[#0a1638]">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${Math.max(2, pct)}%`, background: e.token.color }}
                            />
                          </div>
                          <span className="w-11 text-right text-[11px] text-slate-400">{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-3.5">
          <Panel title="Allocation" icon={<Gauge className="h-4 w-4" />}>
            <div className="relative mx-auto h-[150px] w-full max-w-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={donut}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {donut.map((d) => (
                      <Cell key={d.name} fill={d.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">Total</div>
                  <div className="text-sm font-bold text-white">{usd2(totalUsd)}</div>
                </div>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {entries.map((e) => (
                <div key={e.token.symbol} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: e.token.color }} />
                  <span className="font-medium text-slate-300">{e.token.symbol}</span>
                  <span className="ml-auto">{totalUsd > 0 ? ((e.usd / totalUsd) * 100).toFixed(1) : "0"}%</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Watchlist" icon={<Star className="h-4 w-4" />} right={
            <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">{watched.length}</span>
          }>
            {watched.length === 0 ? (
              <p className="py-3 text-center text-[12px] leading-relaxed text-slate-500">
                No starred tokens yet.
                <br />
                Tap the star on any token card to track it here.
              </p>
            ) : (
              <div className="space-y-1">
                {watched.map((t) => (
                  <div key={t.symbol} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
                    <TokenIcon token={t} size={26} />
                    <div className="min-w-0">
                      <div className="text-[12px] font-semibold text-white">{t.symbol}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-[12px] font-medium text-slate-200">{fmtUsdTiny(t.price)}</div>
                      <Delta value={t.change} className="text-[10px]" />
                    </div>
                    <button
                      onClick={() => toggleWatch(t.symbol)}
                      aria-label={`Remove ${t.symbol} from watchlist`}
                      className="ml-1 grid h-7 w-7 place-items-center rounded-lg border border-[#1b2f63] text-slate-500 transition-colors hover:border-rose-500/50 hover:text-rose-400"
                    >
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ 4. tokens ---------------------------- */

export function TokensView() {
  const { go, openDetail, watchlist, toggleWatch } = useExplorer();

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Tokens"
        subtitle="Native and issued assets on the QFS Network."
        stats={[
          { label: "Total Tokens", value: String(TOKENS.length), icon: <Coins className="h-3.5 w-3.5" /> },
          { label: "QFS Price", value: fmtUsdTiny(TOKENS[0].price), icon: <Gauge className="h-3.5 w-3.5" /> },
          { label: "Total Holders", value: fmtCompact(TOKENS.reduce((a, t) => a + t.holders, 0)), icon: <Users className="h-3.5 w-3.5" /> },
          { label: "Total Transfers", value: fmtCompact(TOKENS.reduce((a, t) => a + t.transfers, 0)), icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
        ]}
      />

      <div className="grid gap-3.5 md:grid-cols-2">
        {TOKENS.map((t) => {
          const starred = watchlist.includes(t.symbol);
          return (
          <div key={t.symbol} className="qfs-card relative p-5">
            <button
              onClick={() => toggleWatch(t.symbol)}
              aria-label={starred ? `Remove ${t.symbol} from watchlist` : `Add ${t.symbol} to watchlist`}
              title={starred ? "Remove from watchlist" : "Add to watchlist"}
              className={cn(
                "absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-lg border transition-colors",
                starred
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-[#1b2f63] text-slate-500 hover:border-amber-500/40 hover:text-amber-400"
              )}
            >
              <Star className={cn("h-4 w-4", starred && "fill-amber-400 text-amber-400")} />
            </button>
            <div className="flex items-start gap-3.5">
              <TokenIcon token={t} size={48} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-bold text-white">{t.name}</span>
                  <span className="rounded-md border border-[#22407f] bg-[#0a1638] px-1.5 py-0.5 text-[11px] font-semibold text-slate-300">
                    {t.symbol}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-200">{fmtUsdTiny(t.price)}</span>
                  <Delta value={t.change} />
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <div className="qfs-inset rounded-lg p-2.5">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Holders</div>
                <div className="mt-0.5 text-sm font-bold text-white">{fmt(t.holders)}</div>
              </div>
              <div className="qfs-inset rounded-lg p-2.5">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Transfers</div>
                <div className="mt-0.5 text-sm font-bold text-white">{fmt(t.transfers)}</div>
              </div>
              <div className="qfs-inset rounded-lg p-2.5">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">Supply Share</div>
                <div className="mt-0.5 text-sm font-bold text-white">{t.share}%</div>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <span className="mono flex-1 truncate text-[11px] text-blue-400">{short(t.address, 14, 10)}</span>
              <CopyBtn value={t.address} />
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => go("transfers")}
                className="h-8 flex-1 rounded-lg border border-[#22407f] text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/60 hover:text-white"
              >
                View Transfers
              </button>
              <button
                onClick={() => openDetail({ kind: "address", address: t.address })}
                className="h-8 flex-1 rounded-lg bg-blue-600 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Token Details
              </button>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
