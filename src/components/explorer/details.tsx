"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  Box,
  Coins,
  FileCode,
  Users,
  Wallet,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { absTime, CHAIN, fmt, fmtCompact, mulberry32, seedFrom, short, TOKENS, timeAgo } from "@/lib/explorer";
import { useExplorer } from "./store";
import { HashLink, StatusBadge, TokenIcon, VerifiedBadge } from "./bits";
import { CopyBtn } from "./views-a";
import { cn } from "@/lib/utils";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[#122451]/60 py-2.5 text-[13px] last:border-0">
      <span className="min-w-[130px] text-slate-500">{label}</span>
      <span className="ml-auto text-right font-medium text-slate-200 break-all">{children}</span>
    </div>
  );
}

function BlockDetail({ number }: { number: number }) {
  const { blocks, tick, openDetail } = useExplorer();
  const b =
    blocks.find((x) => x.number === number) ??
    // synthesized detail for indexed blocks outside the live window
    (() => {
      const rng = mulberry32(seedFrom(String(number)));
      return {
        number,
        offset: (blocks[0].number - number) * 12,
        atTick: tick,
        txCount: 1800 + Math.floor(rng() * 1500),
        validator: "Polygon Validator " + String(1 + Math.floor(rng() * 64)).padStart(2, "0"),
        gasUsed: 12_000_000 + Math.floor(rng() * 5_000_000),
        gasLimit: 30_000_000,
        size: 30_000 + Math.floor(rng() * 40_000),
        hash: "0x" + Array.from({ length: 64 }, () => "0123456789abcdef"[Math.floor(rng() * 16)]).join(""),
        parentHash: "",
        reward: 1200 + Math.floor(rng() * 800),
      };
    })();
  const pct = (b.gasUsed / b.gasLimit) * 100;

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400">
          <Box className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">Block #{fmt(b.number)}</div>
          <div className="text-[11px] text-emerald-400">✓ Finalized</div>
        </div>
        <span className="ml-auto"><StatusBadge /></span>
      </div>
      <Row label="Timestamp">{timeAgo(b.offset + (tick - b.atTick))} <span className="ml-2 text-[11px] text-slate-500">({absTime(b.offset + (tick - b.atTick))})</span></Row>
      <Row label="Transactions">
        <HashLink value={`${fmt(b.txCount)} transactions`} onClick={() => openDetail({ kind: "block", number: b.number })} />
      </Row>
      <Row label="Validator">{b.validator}</Row>
      <Row label="Reward">{fmt(b.reward)} QFS</Row>
      <Row label="Gas Used">
        <span className="flex items-center gap-2">
          {fmtCompact(b.gasUsed)}
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-[#122450]">
            <span
              className={cn("block h-full rounded-full", pct > 80 ? "bg-amber-400" : "bg-blue-500")}
              style={{ width: `${Math.min(100, pct)}%` }}
            />
          </span>
          {pct.toFixed(1)}%
        </span>
      </Row>
      <Row label="Gas Limit">{fmt(b.gasLimit)}</Row>
      <Row label="Size">{fmt(b.size)} bytes</Row>
      <Row label="Hash">
        <span className="mono text-[11px] text-slate-300">{b.hash}</span>
        <CopyBtn value={b.hash} className="ml-2" />
      </Row>
      {b.parentHash && (
        <Row label="Parent Hash">
          <span className="mono text-[11px] text-blue-400">{b.parentHash}</span>
          <CopyBtn value={b.parentHash} className="ml-2" />
        </Row>
      )}
    </div>
  );
}

function TxDetail({ hash }: { hash: string }) {
  const { txs, tick, openDetail } = useExplorer();
  const t = txs.find((x) => x.hash === hash);
  const age = t ? timeAgo(t.offset + (tick - t.atTick)) : "just now";

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400">
          <ArrowLeftRight className="h-5 w-5" />
        </div>
        <div>
          <div className="text-lg font-bold text-white">Transaction Details</div>
          <div className="mono text-[11px] text-slate-500">{short(hash, 12, 10)}</div>
        </div>
        <span className="ml-auto">
          <span
            className={cn(
              "rounded-md px-2.5 py-1 text-[11px] font-medium",
              t?.status === "pending" ? "bg-amber-500/10 text-amber-400" : "bg-emerald-500/10 text-emerald-400"
            )}
          >
            {t?.status === "pending" ? "◌ Pending" : "✓ Success"}
          </span>
        </span>
      </div>
      <Row label="Tx Hash">
        <span className="mono text-[11px] text-slate-300">{hash}</span>
        <CopyBtn value={hash} className="ml-2" />
      </Row>
      <Row label="Status">{t?.status === "pending" ? "Pending in mempool" : "Confirmed by network"}</Row>
      <Row label="Block">
        {t ? (
          <HashLink value={`#${fmt(t.block)}`} onClick={() => openDetail({ kind: "block", number: t.block })} />
        ) : (
          `#${fmt(txs[0].block)}`
        )}
      </Row>
      <Row label="Timestamp">{age}</Row>
      <Row label="From">
        {t && (
          <span className="flex items-center gap-2">
            <HashLink className="mono text-[12px]" value={short(t.from, 10, 8)} onClick={() => openDetail({ kind: "address", address: t.from })} />
            <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
            <HashLink className="mono text-[12px]" value={short(t.to, 10, 8)} onClick={() => openDetail({ kind: "address", address: t.to })} />
          </span>
        )}
      </Row>
      <Row label="Value">
        <span className="font-bold text-white">{t ? fmt(t.amount) : "—"} QFS</span>
        <span className="ml-2 text-[11px] text-slate-500">
          ≈ ${t ? (t.amount * TOKENS[0].price).toFixed(2) : "—"}
        </span>
      </Row>
      <Row label="Transaction Fee">
        {t ? `${t.fee.toFixed(6)} POL` : "—"} <span className="ml-2 text-[11px] text-slate-500">(≈ $0.0001)</span>
      </Row>
      <Row label="Gas Price">{CHAIN.gas} POL</Row>
      <Row label="Token">
        <span className="flex items-center gap-1.5">
          <TokenIcon token={TOKENS[0]} size={18} /> QFS (Quantum Financial System)
        </span>
      </Row>
    </div>
  );
}

function AddressDetail({ address }: { address: string }) {
  const { txs, openDetail } = useExplorer();
  const rng = React.useMemo(() => mulberry32(seedFrom(address)), [address]);
  const [balance] = React.useState(() => 1_000 + Math.floor(rng() * 9_900_000_000));
  const isContract = React.useMemo(() => rng() > 0.5, [rng]);
  const token = TOKENS.find((t) => t.address.toLowerCase() === address.toLowerCase());
  const related = txs.filter((t) => t.from === address || t.to === address).slice(0, 5);

  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-blue-500/25 bg-blue-500/10 text-blue-400">
          {isContract ? <FileCode className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <div className="text-lg font-bold text-white">
            {token ? `${token.symbol} Token Contract` : isContract ? "Smart Contract" : "Wallet Address"}
          </div>
          <div className="mono truncate text-[11px] text-slate-500">{address}</div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {token && <VerifiedBadge />}
          <CopyBtn value={address} className="h-7 w-7" />
        </div>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <div className="qfs-inset rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500">
            <Coins className="h-3 w-3" /> QFS Balance
          </div>
          <div className="mt-1 text-sm font-bold text-white">{fmt(balance)}</div>
          <div className="text-[10px] text-slate-500">≈ ${(balance * TOKENS[0].price).toFixed(2)}</div>
        </div>
        <div className="qfs-inset rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500">
            <ArrowLeftRight className="h-3 w-3" /> Transactions
          </div>
          <div className="mt-1 text-sm font-bold text-white">{fmt(40 + rng() * 120_000)}</div>
        </div>
        <div className="qfs-inset col-span-2 rounded-lg p-3 sm:col-span-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500">
            <Users className="h-3 w-3" /> Type
          </div>
          <div className="mt-1 text-sm font-bold text-white">{isContract ? "Contract" : "EOA"}</div>
        </div>
      </div>

      {token && (
        <div className="mb-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-[12px]">
          <div className="flex items-center gap-2 font-semibold text-white">
            <TokenIcon token={token} size={20} /> {token.name} ({token.symbol})
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-slate-500">Holders</div>
              <div className="font-semibold text-slate-200">{fmt(token.holders)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Transfers</div>
              <div className="font-semibold text-slate-200">{fmtCompact(token.transfers)}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500">Price</div>
              <div className="font-semibold text-slate-200">${token.price.toFixed(6)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="text-[11px] uppercase tracking-wide text-slate-500">Latest Transfers</div>
      <div className="mt-1.5">
        {related.length > 0 ? (
          related.map((t) => (
            <div key={t.hash} className="flex items-center gap-2 border-b border-[#122451]/60 py-2 text-[12px] last:border-0">
              <HashLink
                className="max-w-[110px]"
                value={short(t.hash, 8, 6)}
                onClick={() => openDetail({ kind: "tx", hash: t.hash })}
              />
              <span className="text-slate-400">{t.from === address ? "→ OUT" : "← IN"}</span>
              <span className="ml-auto font-semibold text-white">{fmt(t.amount)} QFS</span>
            </div>
          ))
        ) : (
          <div className="py-3 text-center text-[12px] text-slate-500">
            No recent transfers involving this address in the live window.
          </div>
        )}
      </div>
    </div>
  );
}

export function DetailDialog() {
  const { detail, closeDetail } = useExplorer();
  const title =
    detail?.kind === "block" ? "Block Details" : detail?.kind === "tx" ? "Transaction Details" : "Address Details";

  return (
    <Dialog open={!!detail} onOpenChange={(o) => !o && closeDetail()}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto border-[#1c376e] bg-[#081130] text-slate-200">
        <DialogHeader>
          <DialogTitle className="sr-only">{title}</DialogTitle>
          <DialogDescription className="sr-only">{title} on the QFS Network</DialogDescription>
        </DialogHeader>
        {detail?.kind === "block" && <BlockDetail number={detail.number} />}
        {detail?.kind === "tx" && <TxDetail hash={detail.hash} />}
        {detail?.kind === "address" && <AddressDetail address={detail.address} />}
      </DialogContent>
    </Dialog>
  );
}
