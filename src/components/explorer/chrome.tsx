"use client";

import * as React from "react";
import {
  ArrowLeftRight,
  Box,
  Braces,
  ChartPie,
  Coins,
  Copy,
  FileCode,
  LayoutDashboard,
  LogOut,
  Menu,
  Network,
  Repeat,
  ShieldCheck,
  Sun,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useExplorer, View } from "./store";
import { Coin, HexGlyph, OperativeDot } from "./bits";

interface NavItem {
  id: View;
  nav: string;
  side: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresWallet?: boolean;
}

export const NAV: NavItem[] = [
  { id: "overview", nav: "Explorer", side: "Overview", icon: LayoutDashboard },
  { id: "portfolio", nav: "Portfolio", side: "Portfolio", icon: ChartPie, requiresWallet: true },
  { id: "transactions", nav: "Transactions", side: "Transactions", icon: ArrowLeftRight },
  { id: "blocks", nav: "Blocks", side: "Blocks", icon: Box },
  { id: "addresses", nav: "Addresses", side: "Addresses", icon: Users },
  { id: "tokens", nav: "Tokens", side: "Tokens", icon: Coins },
  { id: "contracts", nav: "Contracts", side: "Contracts", icon: FileCode },
  { id: "transfers", nav: "Transfers", side: "Transfers", icon: Repeat },
  { id: "verification", nav: "Verification", side: "Verification", icon: ShieldCheck },
  { id: "network", nav: "Network", side: "Network", icon: Network },
  { id: "api", nav: "API", side: "API", icon: Braces },
];

/* ------------------------------- header ----------------------------- */

export function SiteHeader() {
  const { view, go, wallet, toggleWallet, watchlist } = useExplorer();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const items = NAV.filter((i) => !i.requiresWallet || wallet);

  const copyAddress = () => {
    if (!wallet) return;
    navigator.clipboard?.writeText(wallet).catch(() => {});
    toast({ title: "Address copied", description: `${wallet.slice(0, 6)}...${wallet.slice(-4)} · QFS Polygon` });
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#101f47] bg-[#040a1c]/95 backdrop-blur">
      <div className="flex h-16 items-center gap-3 px-3 lg:px-5">
        {/* mobile menu */}
        <button
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#1b2f63] text-slate-300 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        <button className="flex shrink-0 items-center gap-2.5 text-left" onClick={() => go("overview")}>
          <Coin size={38} />
          <span className="leading-tight">
            <span className="block whitespace-nowrap text-[17px] font-bold text-white">QFS Explorer</span>
            <span className="hidden whitespace-nowrap text-[11px] text-cyan-400/90 sm:block">Explore the QFS Network</span>
          </span>
        </button>

        <nav className="ml-4 hidden flex-1 items-center gap-1 xl:flex" aria-label="Primary">
          {items.map((item) => {
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => go(item.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors",
                  active
                    ? "border border-blue-500/40 bg-blue-600/20 font-medium text-white"
                    : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
                )}
              >
                <item.icon className="h-3.5 w-3.5" />
                {item.nav}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <div className="hidden items-center gap-2.5 rounded-lg border border-[#1b2f63] bg-[#071132] py-1.5 pl-2.5 pr-3.5 md:flex">
            <HexGlyph size={26} />
            <span className="leading-tight">
              <span className="block text-[13px] font-semibold text-white">QFS Polygon</span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                <OperativeDot /> Operational
              </span>
            </span>
          </div>

          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-[#1b2f63] text-slate-300 transition-colors hover:bg-white/5"
            onClick={() =>
              toast({ title: "Dark theme locked", description: "QFS Explorer is optimized for a dark trading environment." })
            }
            aria-label="Theme"
          >
            <Sun className="h-4 w-4" />
          </button>

          {wallet ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3.5 text-[13px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  <span className="mono hidden sm:inline">{`${wallet.slice(0, 6)}...${wallet.slice(-4)}`}</span>
                  <span className="sm:hidden">Connected</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="border-[#1b2f63] bg-[#071132] text-slate-200">
                <div className="px-2.5 py-2">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Connected · QFS Polygon</div>
                  <div className="mono mt-0.5 text-[11px] text-emerald-400">{`${wallet.slice(0, 10)}...${wallet.slice(-6)}`}</div>
                </div>
                <DropdownMenuSeparator className="bg-[#1b2f63]" />
                <DropdownMenuItem onClick={() => go("portfolio")} className="gap-2 focus:bg-blue-600/20 focus:text-white">
                  <ChartPie className="h-4 w-4" /> Portfolio
                  <span className="ml-auto text-[10px] text-slate-500">balances</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => go("tokens")} className="gap-2 focus:bg-blue-600/20 focus:text-white">
                  <Wallet className="h-4 w-4" /> Watchlist
                  <span className="ml-auto rounded bg-amber-500/15 px-1.5 text-[10px] font-semibold text-amber-400">{watchlist.length}</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={copyAddress} className="gap-2 focus:bg-blue-600/20 focus:text-white">
                  <Copy className="h-4 w-4" /> Copy address
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#1b2f63]" />
                <DropdownMenuItem
                  onClick={toggleWallet}
                  className="gap-2 text-rose-400 focus:bg-rose-600/20 focus:text-rose-300"
                >
                  <LogOut className="h-4 w-4" /> Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button
              onClick={toggleWallet}
              className="inline-flex h-9 shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-blue-600 px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-blue-500"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </button>
          )}
        </div>
      </div>

      </header>

      {/* mobile drawer — outside <header> so backdrop-blur cannot become its containing block */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/70" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[270px] border-r border-[#16295c] bg-[#050d24] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coin size={30} />
                <span className="text-sm font-bold text-white">QFS Explorer</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#1b2f63] text-slate-300"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    go(item.id);
                    setMobileOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm",
                    view === item.id
                      ? "bg-blue-600/25 font-medium text-white"
                      : "text-slate-400 hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.side}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------ sidebar ------------------------------ */

export function SideNav() {
  const { view, go, wallet } = useExplorer();
  const items = NAV.filter((i) => !i.requiresWallet || wallet);
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-[228px] shrink-0 flex-col border-r border-[#0f1e46] bg-[#050d24] lg:flex">
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Sidebar">
        {items.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors",
                active
                  ? "border border-blue-500/30 bg-gradient-to-r from-blue-600/25 to-blue-500/5 font-medium text-white"
                  : "border border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <item.icon className={cn("h-4 w-4", active && "text-blue-400")} />
              {item.side}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400" />}
            </button>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="qfs-card relative overflow-hidden p-4 text-center">
          <Coin size={54} className="mx-auto" />
          <div className="mt-3 text-[13px] font-bold text-white">The Future of Digital Finance</div>
          <div className="mt-1 text-[10px] tracking-wide text-slate-500">
            Fast • Secure • Decentralized
          </div>
          <div className="relative mt-3 flex justify-center">
            <div className="globe-sm h-20 w-20" />
            <div className="starfield absolute inset-0" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-[#0f1e46] px-4 py-3">
        <HexGlyph size={20} />
        <span className="text-[11px] text-slate-500">
          QFS Explorer <span className="text-slate-600">v1.0.0</span>
        </span>
      </div>
    </aside>
  );
}
