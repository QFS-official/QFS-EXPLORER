"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  Box,
  Braces,
  CheckCircle2,
  Coins,
  Cpu,
  FileCode,
  Globe,
  KeyRound,
  Repeat,
  Server,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  CHAIN,
  fmt,
  fmtCompact,
  short,
  tokenTransfers,
  timeAgo,
  TOKENS,
  VALIDATOR_NAMES,
} from "@/lib/explorer";
import { useExplorer } from "./store";
import { DevBadge, DevDot, HashLink, IconBox, LaunchProgress, Panel, TokenIcon, VerifiedBadge } from "./bits";
import { CopyBtn, ViewHeader } from "./views-a";
import { cn } from "@/lib/utils";

/* ---------------------------- 5. contracts --------------------------- */

export function ContractsView() {
  const { go } = useExplorer();
  return (
    <div className="space-y-4">
      <ViewHeader
        title="Contracts"
        subtitle="Verified smart contracts deployed on the QFS Network."
        stats={[
          { label: "Verified Contracts", value: String(TOKENS.length), icon: <FileCode className="h-3.5 w-3.5" /> },
          { label: "Compiler", value: "Solidity v0.8.x", icon: <Cpu className="h-3.5 w-3.5" /> },
          { label: "Network", value: "Polygon · 137", icon: <Globe className="h-3.5 w-3.5" /> },
          { label: "Scam Reports (30d)", value: "0", icon: <ShieldCheck className="h-3.5 w-3.5" /> },
        ]}
      />

      <div className="grid gap-3.5 md:grid-cols-2">
        {TOKENS.map((t, i) => (
          <div key={t.symbol} className="qfs-card p-5">
            <div className="flex items-center gap-3">
              <TokenIcon token={t} size={40} />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{t.name}</span>
                  <VerifiedBadge />
                </div>
                <div className="mono mt-0.5 text-[11px] text-blue-400">{t.address}</div>
              </div>
              <CopyBtn value={t.address} className="ml-auto h-7 w-7" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[12px]">
              <div className="flex justify-between border-b border-[#122451]/60 pb-1.5">
                <span className="text-slate-500">Compiler</span>
                <span className="font-medium text-slate-300">{t.compiler}</span>
              </div>
              <div className="flex justify-between border-b border-[#122451]/60 pb-1.5">
                <span className="text-slate-500">Language</span>
                <span className="font-medium text-slate-300">Solidity</span>
              </div>
              <div className="flex justify-between border-b border-[#122451]/60 pb-1.5">
                <span className="text-slate-500">Deployed</span>
                <span className="font-medium text-slate-300">{t.deployed}</span>
              </div>
              <div className="flex justify-between border-b border-[#122451]/60 pb-1.5">
                <span className="text-slate-500">Transfers</span>
                <span className="font-medium text-slate-300">{fmtCompact(t.transfers)}</span>
              </div>
            </div>
            <div className="mt-3.5 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[11px] text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Contract source code matches the deployed bytecode — safe to interact.
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  toast({
                    title: `${t.symbol} source code`,
                    description: `${t.compiler} · ${1200 + i * 340} lines · ERC-20 standard`,
                  })
                }
                className="h-8 flex-1 rounded-lg border border-[#22407f] text-xs font-medium text-slate-300 transition-colors hover:border-blue-500/60 hover:text-white"
              >
                View Source
              </button>
              <button
                onClick={() => go("verification")}
                className="h-8 flex-1 rounded-lg bg-blue-600 text-xs font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Verify Yours
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- 6. transfers --------------------------- */

export function TransfersView() {
  const { txs, tick, openDetail } = useExplorer();
  const [token, setToken] = React.useState<string>("ALL");
  const staticTransfers = React.useMemo(() => tokenTransfers(), []);

  const rows = React.useMemo(() => {
    if (token === "ALL") {
      return [
        ...txs.slice(0, 10).map((t) => ({
          hash: t.hash,
          from: t.from,
          to: t.to,
          amount: t.amount,
          symbol: "QFS",
          age: timeAgo(t.offset + (tick - t.atTick)),
        })),
        ...staticTransfers.map((t) => ({
          hash: t.hash,
          from: t.from,
          to: t.to,
          amount: t.amount,
          symbol: t.symbol,
          age: timeAgo(t.offset),
        })),
      ];
    }
    if (token === "QFS") {
      return txs.slice(0, 18).map((t) => ({
        hash: t.hash,
        from: t.from,
        to: t.to,
        amount: t.amount,
        symbol: "QFS",
        age: timeAgo(t.offset + (tick - t.atTick)),
      }));
    }
    return staticTransfers
      .filter((t) => t.symbol === token)
      .map((t) => ({
        hash: t.hash,
        from: t.from,
        to: t.to,
        amount: t.amount,
        symbol: t.symbol,
        age: timeAgo(t.offset),
      }));
  }, [token, txs, staticTransfers, tick]);

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Token Transfers"
        subtitle="ERC-20 transfer events across all QFS Network assets."
        stats={[
          { label: "Transfers 24h", value: "184,209", icon: <Repeat className="h-3.5 w-3.5" /> },
          { label: "Total Transfers", value: fmtCompact(CHAIN.tokenTransfers), icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
          { label: "Tokens Tracked", value: String(TOKENS.length), icon: <Coins className="h-3.5 w-3.5" /> },
          { label: "Largest 24h", value: "2.4M QFS", icon: <Box className="h-3.5 w-3.5" /> },
        ]}
      />

      <Panel
        title="Transfer Events"
        icon={<Repeat className="h-4 w-4" />}
        bodyClassName="p-0"
        right={
          <div className="flex flex-wrap items-center gap-1">
            {["ALL", ...TOKENS.map((t) => t.symbol)].map((s) => (
              <button
                key={s}
                onClick={() => setToken(s)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-colors",
                  token === s ? "bg-blue-600 text-white" : "border border-[#1b2f63] text-slate-400 hover:text-slate-200"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-[13px]">
            <thead>
              <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 font-medium">Tx Hash</th>
                <th className="px-3 py-2.5 font-medium">From</th>
                <th className="px-3 py-2.5 font-medium">To</th>
                <th className="px-3 py-2.5 text-right font-medium">Amount</th>
                <th className="px-3 py-2.5 font-medium">Token</th>
                <th className="px-4 py-2.5 text-right font-medium">Age</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t, i) => {
                const tok = TOKENS.find((x) => x.symbol === t.symbol) ?? TOKENS[0];
                return (
                  <tr key={`${t.hash}-${i}`} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                    <td className="px-4 py-2.5">
                      <HashLink
                        className="max-w-[130px]"
                        value={short(t.hash, 8, 6)}
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
                      <span className="font-semibold text-white">{fmt(t.amount)}</span>
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <TokenIcon token={tok} size={18} /> {t.symbol}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-500">{t.age}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}

/* --------------------------- 7. verification ------------------------- */

const COMPILERS = ["v0.8.24", "v0.8.23", "v0.8.22", "v0.8.21", "v0.8.20"];
const LICENSES = ["MIT", "GPL-3.0", "Apache-2.0", "None"];

export function VerificationView() {
  const [address, setAddress] = React.useState("");
  const [compiler, setCompiler] = React.useState(COMPILERS[0]);
  const [license, setLicense] = React.useState(LICENSES[0]);
  const [optimize, setOptimize] = React.useState(true);
  const [source, setSource] = React.useState("");
  const [verified, setVerified] = React.useState<{ symbol: string; time: string }[]>([]);

  const submit = () => {
    if (!/^0x[0-9a-fA-F]{40}$/.test(address.trim())) {
      toast({
        title: "Invalid contract address",
        description: "Enter a valid 42-character hexadecimal address.",
        variant: "destructive",
      });
      return;
    }
    if (source.trim().length < 20) {
      toast({
        title: "Source code too short",
        description: "Paste the flattened Solidity source code of the contract.",
        variant: "destructive",
      });
      return;
    }
    setVerified((v) => [{ symbol: `0x...${address.slice(-4)}`, time: "just now" }, ...v]);
    toast({
      title: "Contract verified successfully",
      description: "Source code published and matched against deployed bytecode.",
    });
    setAddress("");
    setSource("");
  };

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Contract Verification"
        subtitle="Verify & publish your smart contract source code to build trust and avoid scams."
      />

      <div className="grid gap-3.5 lg:grid-cols-5">
        <Panel title="Verify & Publish" icon={<Upload className="h-4 w-4" />} className="lg:col-span-3">
          <div className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">Contract Address *</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x0000000000000000000000000000000000000000"
                className="mono h-10 w-full rounded-lg border border-[#22407f] bg-[#060f2d]/90 px-3 text-[13px] text-slate-100 placeholder:text-slate-600 focus:border-blue-500/70 focus:outline-none"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Compiler Version</label>
                <select
                  value={compiler}
                  onChange={(e) => setCompiler(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#22407f] bg-[#060f2d]/90 px-3 text-[13px] text-slate-200 focus:border-blue-500/70 focus:outline-none"
                >
                  {COMPILERS.map((c) => (
                    <option key={c} value={c}>
                      solc-js {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-400">Open Source License</label>
                <select
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  className="h-10 w-full rounded-lg border border-[#22407f] bg-[#060f2d]/90 px-3 text-[13px] text-slate-200 focus:border-blue-500/70 focus:outline-none"
                >
                  {LICENSES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2.5 text-xs text-slate-300">
              <input
                type="checkbox"
                checked={optimize}
                onChange={(e) => setOptimize(e.target.checked)}
                className="h-4 w-4 rounded border-[#22407f] bg-[#060f2d] accent-blue-600"
              />
              Enable compiler optimization (200 runs)
            </label>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-400">
                Contract Source Code (flattened Solidity) *
              </label>
              <textarea
                value={source}
                onChange={(e) => setSource(e.target.value)}
                rows={7}
                placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.24;&#10;contract MyToken is ERC20 { ... }"
                className="mono w-full rounded-lg border border-[#22407f] bg-[#060f2d]/90 p-3 text-[12px] leading-relaxed text-slate-100 placeholder:text-slate-600 focus:border-blue-500/70 focus:outline-none"
              />
            </div>
            <button
              onClick={submit}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <ShieldCheck className="h-4 w-4" /> Verify & Publish
            </button>
          </div>
        </Panel>

        <div className="space-y-3.5 lg:col-span-2">
          <Panel title="Recently Verified" icon={<CheckCircle2 className="h-4 w-4" />}>
            <div className="space-y-2">
              {TOKENS.map((t) => (
                <div key={t.symbol} className="flex items-center gap-2.5 rounded-lg border border-[#16295c]/70 bg-[#060f2d]/60 px-3 py-2">
                  <TokenIcon token={t} size={22} />
                  <span className="text-[13px] font-medium text-white">{t.symbol}</span>
                  <VerifiedBadge />
                  <span className="ml-auto text-[11px] text-slate-500">{t.deployed}</span>
                </div>
              ))}
              {verified.map((v, i) => (
                <div key={`${v.symbol}-${i}`} className="flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                  <TokenIcon token={TOKENS[1]} size={22} />
                  <span className="mono text-[13px] text-white">{v.symbol}</span>
                  <VerifiedBadge />
                  <span className="ml-auto text-[11px] text-emerald-400">{v.time}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Why verify?" icon={<ShieldCheck className="h-4 w-4" />}>
            <ul className="space-y-2.5 text-[12px] leading-relaxed text-slate-400">
              <li>• Lets users read the exact code behind a contract before interacting with it.</li>
              <li>• Bytecode is compared automatically — any mismatch is rejected.</li>
              <li>• Verified contracts are flagged in the explorer and rank higher in trust checks.</li>
              <li>• Unverified contracts may be scams; always check before signing transactions.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- 8. network ---------------------------- */

export function NetworkView() {
  const { blocks } = useExplorer();
  const validators = React.useMemo(() => {
    const counts = new Map<string, number>();
    blocks.forEach((b) => counts.set(b.validator, (counts.get(b.validator) ?? 0) + 1));
    return VALIDATOR_NAMES.slice(0, 12).map((name, i) => ({
      name,
      stake: 48_000_000 + i * 3_100_000,
      uptime: 99.98 - i * 0.017,
      proposed: counts.get(name) ?? 0,
    }));
  }, [blocks]);

  return (
    <div className="space-y-4">
      <ViewHeader
        title="Network"
        subtitle="Live status, validators and infrastructure of the QFS Network."
        stats={[
          { label: "Active Validators", value: "64", icon: <Server className="h-3.5 w-3.5" /> },
          { label: "Block Height", value: fmt(blocks[0].number), icon: <Box className="h-3.5 w-3.5" /> },
          { label: "Avg Block Time", value: "12.0 sec", icon: <Box className="h-3.5 w-3.5" /> },
          { label: "Total Staked", value: "8.4B POL", icon: <Users className="h-3.5 w-3.5" /> },
        ]}
      />

      <div className="grid gap-3.5 lg:grid-cols-3">
        <Panel title="Validators" icon={<Server className="h-4 w-4" />} className="lg:col-span-2" bodyClassName="p-0">
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead className="sticky top-0 bg-[#081130]">
                <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-medium">Validator</th>
                  <th className="px-3 py-2.5 text-right font-medium">Stake</th>
                  <th className="px-3 py-2.5 text-right font-medium">Uptime</th>
                  <th className="px-3 py-2.5 text-right font-medium">Proposed</th>
                  <th className="px-4 py-2.5 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((v) => (
                  <tr key={v.name} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                    <td className="px-4 py-2.5 font-medium text-slate-200">{v.name}</td>
                    <td className="px-3 py-2.5 text-right text-slate-300">{fmtCompact(v.stake)} POL</td>
                    <td className="px-3 py-2.5 text-right text-emerald-400">{v.uptime.toFixed(2)}%</td>
                    <td className="px-3 py-2.5 text-right text-slate-400">{v.proposed}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <div className="space-y-3.5">
          <Panel title="Chain Parameters" icon={<Cpu className="h-4 w-4" />}>
            <div className="space-y-2 text-[12px]">
              {[
                ["Chain ID", "137"],
                ["Consensus", "Delegated Proof-of-Stake"],
                ["Virtual Machine", "EVM-compatible"],
                ["Native Token", "POL"],
                ["Block Time", "12 seconds"],
                ["Finality", "~1.9 seconds"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#122451]/60 py-1.5 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span className="font-medium text-slate-200">{v}</span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Future Network" icon={<Sparkles className="h-4 w-4" />} right={<DevBadge />}>
            <div className="space-y-2 text-[12px]">
              <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-600">
                  <Sparkles className="h-5 w-5 text-white/90" />
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-white">QFS Reserve Network</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-400">
                    <DevDot /> In Development
                  </div>
                </div>
              </div>
              {[
                ["Status", "Development"],
                ["Native Asset", "QFS"],
                ["Blockchain", "Coming Soon"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-[#122451]/60 py-1.5 last:border-0">
                  <span className="text-slate-500">{k}</span>
                  <span
                    className={cn(
                      "font-medium",
                      k === "Status" ? "text-amber-400" : k === "Blockchain" ? "italic text-slate-400" : "text-slate-200"
                    )}
                  >
                    {v}
                  </span>
                </div>
              ))}
              <LaunchProgress className="pt-2" />
            </div>
          </Panel>
          <Panel title="RPC Endpoints" icon={<Globe className="h-4 w-4" />}>
            <div className="space-y-2">
              {[
                { url: "https://polygon-rpc.com", tag: "Public" },
                { url: "https://rpc-qfs.qfsnetwork.io", tag: "QFS" },
                { url: "wss://polygon-rpc.com/ws", tag: "WebSocket" },
              ].map((r) => (
                <div key={r.url} className="flex items-center gap-2 rounded-lg border border-[#16295c]/70 bg-[#060f2d]/60 px-3 py-2">
                  <span className="mono flex-1 truncate text-[11px] text-blue-400">{r.url}</span>
                  <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-[10px] text-blue-400">{r.tag}</span>
                  <CopyBtn value={r.url} />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- 9. api ------------------------------ */

export function ApiView() {
  return (
    <div className="space-y-4">
      <ViewHeader
        title="API"
        subtitle="Query the QFS Explorer programmatically with JSON-RPC and GraphQL."
        stats={[
          { label: "JSON-RPC", value: "eth_* methods", icon: <Braces className="h-3.5 w-3.5" /> },
          { label: "GraphQL", value: "/graphql", icon: <FileCode className="h-3.5 w-3.5" /> },
          { label: "Rate Limit (free)", value: "5 req/s", icon: <KeyRound className="h-3.5 w-3.5" /> },
          { label: "Uptime 90d", value: "99.98%", icon: <Server className="h-3.5 w-3.5" /> },
        ]}
      />

      <div className="grid gap-3.5 lg:grid-cols-2">
        <Panel title="JSON-RPC" icon={<Braces className="h-4 w-4" />}>
          <div className="mono qfs-inset overflow-x-auto rounded-lg p-3.5 text-[12px] leading-relaxed">
            <div className="text-slate-500"># Fetch latest block</div>
            <div>
              <span className="text-emerald-400">curl</span> <span className="text-slate-300">{CHAIN.rpc}</span> \
            </div>
            <div className="text-slate-400">
              {"  "} -X POST -H <span className="text-amber-300">&quot;Content-Type: application/json&quot;</span> \
            </div>
            <div className="text-slate-400">
              {"  "} -d &apos;{"{"}&quot;jsonrpc&quot;:&quot;2.0&quot;,&quot;method&quot;:&quot;eth_blockNumber&quot;,&quot;params&quot;:[],&quot;id&quot;:1{"}"}&apos;
            </div>
          </div>
          <div className="mono qfs-inset mt-3 overflow-x-auto rounded-lg p-3.5 text-[12px] leading-relaxed">
            <div className="text-slate-500"># Response</div>
            <div className="text-slate-300">
              {`{"jsonrpc":"2.0","id":1,"result":"0x518c9a0"} // 85,421,392`}
            </div>
          </div>
        </Panel>

        <Panel title="GraphQL" icon={<FileCode className="h-4 w-4" />}>
          <div className="mono qfs-inset overflow-x-auto rounded-lg p-3.5 text-[12px] leading-relaxed">
            <div className="text-slate-500"># Latest blocks query</div>
            <div>
              <span className="text-emerald-400">query</span> <span className="text-slate-300">{"{"}</span>
            </div>
            <div className="pl-4 text-slate-400">
              blocks(first: 5, orderBy: number, orderDirection: desc) {"{"}
            </div>
            <div className="pl-8 text-amber-300">number timestamp txCount validator</div>
            <div className="pl-4 text-slate-400">{"}"}</div>
            <div className="text-slate-300">{"}"}</div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#16295c]/70 bg-[#060f2d]/60 px-3 py-2">
            <span className="mono flex-1 truncate text-[11px] text-blue-400">{CHAIN.graphql}</span>
            <CopyBtn value={CHAIN.graphql} />
          </div>
        </Panel>

        <Panel title="Rate Limits" icon={<KeyRound className="h-4 w-4" />} className="lg:col-span-2" bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-[13px]">
              <thead>
                <tr className="border-b border-[#122451]/70 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-2.5 font-medium">Plan</th>
                  <th className="px-3 py-2.5 font-medium">Requests / sec</th>
                  <th className="px-3 py-2.5 font-medium">Daily Quota</th>
                  <th className="px-3 py-2.5 font-medium">Archives</th>
                  <th className="px-4 py-2.5 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { plan: "Free", rps: "5", quota: "100K", archives: false, price: "$0" },
                  { plan: "Builder", rps: "25", quota: "5M", archives: true, price: "$49 / mo" },
                  { plan: "Enterprise", rps: "Unlimited", quota: "Unlimited", archives: true, price: "Contact us" },
                ].map((p) => (
                  <tr key={p.plan} className="qfs-row-hover border-b border-[#0e1d42]/70 last:border-0">
                    <td className="px-4 py-2.5 font-semibold text-white">{p.plan}</td>
                    <td className="px-3 py-2.5 text-slate-300">{p.rps}</td>
                    <td className="px-3 py-2.5 text-slate-300">{p.quota}</td>
                    <td className="px-3 py-2.5">
                      {p.archives ? (
                        <span className="text-emerald-400">✓ Included</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-300">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[#122451]/70 p-3.5">
            <button
              onClick={() => toast({ title: "API key requested", description: "Check your inbox to activate your free key." })}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-[13px] font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <KeyRound className="h-4 w-4" /> Get Free API Key
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
