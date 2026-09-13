"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Block,
  CHAIN,
  INITIAL_BLOCKS,
  INITIAL_TXS,
  makeBlock,
  makeTx,
  mulberry32,
  parseSearch,
  Tx,
} from "@/lib/explorer";

export type View =
  | "overview"
  | "portfolio"
  | "transactions"
  | "blocks"
  | "addresses"
  | "tokens"
  | "contracts"
  | "transfers"
  | "verification"
  | "network"
  | "api";

export type Detail =
  | { kind: "block"; number: number }
  | { kind: "tx"; hash: string }
  | { kind: "address"; address: string }
  | null;

const USER_WALLET = "0x71C47c3F8A21b5D9e0F2a4B6c8D1E3f5A9B2C4D6";

interface ExplorerCtx {
  view: View;
  go: (v: View) => void;
  detail: Detail;
  openDetail: (d: NonNullable<Detail>) => void;
  closeDetail: () => void;
  tick: number;
  blocks: Block[];
  txs: Tx[];
  totalTx: number;
  wallet: string | null;
  toggleWallet: () => void;
  watchlist: string[];
  toggleWatch: (symbol: string) => void;
  search: (q: string) => void;
}

const Ctx = React.createContext<ExplorerCtx | null>(null);

export function useExplorer() {
  const v = React.useContext(Ctx);
  if (!v) throw new Error("useExplorer must be used within ExplorerProvider");
  return v;
}

const BLOCK_TIME = 12; // seconds

export function ExplorerProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [view, setView] = React.useState<View>("overview");
  const [detail, setDetail] = React.useState<Detail>(null);
  const [tick, setTick] = React.useState(0);
  const [blocks, setBlocks] = React.useState<Block[]>(INITIAL_BLOCKS);
  const [txs, setTxs] = React.useState<Tx[]>(INITIAL_TXS);
  const [totalTx, setTotalTx] = React.useState(CHAIN.totalTxStart);
  const [wallet, setWallet] = React.useState<string | null>(null);
  const [watchlist, setWatchlist] = React.useState<string[]>([]);

  // Load persisted watchlist after mount (avoids SSR hydration mismatch)
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem("qfs-watchlist");
      if (raw) setWatchlist(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  // 1s heartbeat — ages labels; every BLOCK_TIME seconds mines a new block
  React.useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => {
        const next = t + 1;
        if (next % BLOCK_TIME === 0) {
          const rng = mulberry32((Date.now() ^ (next * 2654435761)) >>> 0);
          setBlocks((prev) => {
            const nb = makeBlock(prev[0].number, next, rng);
            nb.parentHash = prev[0].hash;
            return [nb, ...prev].slice(0, 40);
          });
          setTxs((prev) => {
            const top = prev[0].block;
            const batch = Array.from(
              { length: 3 + Math.floor(rng() * 3) },
              () => makeTx(rng, top + 1, next)
            );
            return [...batch, ...prev].slice(0, 60);
          });
          setTotalTx((v) => v + 1900 + Math.floor(rng() * 1500));
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const go = React.useCallback((v: View) => setView(v), []);
  const openDetail = React.useCallback((d: NonNullable<Detail>) => setDetail(d), []);
  const closeDetail = React.useCallback(() => setDetail(null), []);

  const toggleWallet = React.useCallback(() => {
    setWallet((w) => {
      if (w) {
        toast({ title: "Wallet disconnected", description: "Your session has been closed." });
        return null;
      }
      toast({
        title: "Wallet connected",
        description: "QFS Polygon · Chain ID 137 — Portfolio and watchlist unlocked.",
      });
      return USER_WALLET;
    });
  }, [toast]);

  const toggleWatch = React.useCallback(
    (symbol: string) => {
      setWatchlist((prev) => {
        const next = prev.includes(symbol)
          ? prev.filter((s) => s !== symbol)
          : [...prev, symbol];
        try {
          window.localStorage.setItem("qfs-watchlist", JSON.stringify(next));
        } catch {
          /* ignore storage errors */
        }
        toast({
          title: prev.includes(symbol) ? "Removed from watchlist" : "Added to watchlist",
          description: `${symbol} · QFS Polygon`,
        });
        return next;
      });
    },
    [toast]
  );

  const search = React.useCallback(
    (q: string) => {
      const hit = parseSearch(q);
      switch (hit.kind) {
        case "address":
          setDetail({ kind: "address", address: hit.value });
          break;
        case "tx": {
          setTxs((prev) => {
            const found = prev.find((t) => t.hash.toLowerCase() === hit.value.toLowerCase());
            if (!found) {
              const synthetic: Tx = {
                hash: hit.value,
                from: "0x82d1a76ef33b0c94a5d21e7b8c4f6012a9d3e5b7",
                to: "0x44a72c9e1d5b8f30a6c2e94d7b105f83a2c6e9d0",
                amount: 10_000,
                offset: 0,
                atTick: tick,
                block: blocks[0].number,
                fee: 0.000084,
                status: "success",
              };
              return [synthetic, ...prev].slice(0, 60);
            }
            return prev;
          });
          setDetail({ kind: "tx", hash: hit.value });
          break;
        }
        case "block":
          if (hit.value > blocks[0].number || hit.value < blocks[0].number - 500_000) {
            toast({
              title: "Block not found",
              description: `Block #${hit.value} is outside the indexed range.`,
              variant: "destructive",
            });
          } else {
            setDetail({ kind: "block", number: hit.value });
          }
          break;
        case "token":
          setView("tokens");
          toast({ title: `${hit.value} token`, description: "Opening token details." });
          break;
        default:
          toast({
            title: "No results found",
            description: `"${hit.value}" does not match any address, hash, block or token.`,
            variant: "destructive",
          });
      }
    },
    [blocks, tick, toast]
  );

  const value = React.useMemo<ExplorerCtx>(
    () => ({
      view,
      go,
      detail,
      openDetail,
      closeDetail,
      tick,
      blocks,
      txs,
      totalTx,
      wallet,
      toggleWallet,
      watchlist,
      toggleWatch,
      search,
    }),
    [view, go, detail, openDetail, closeDetail, tick, blocks, txs, totalTx, wallet, toggleWallet, watchlist, toggleWatch, search]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
