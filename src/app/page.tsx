"use client";

import { motion } from "framer-motion";
import { HexGlyph } from "@/components/explorer/bits";
import { SideNav, SiteHeader } from "@/components/explorer/chrome";
import { DetailDialog } from "@/components/explorer/details";
import { Overview } from "@/components/explorer/overview";
import { ExplorerProvider, useExplorer } from "@/components/explorer/store";
import {
  AddressesView,
  BlocksView,
  PortfolioView,
  TokensView,
  TransactionsView,
} from "@/components/explorer/views-a";
import {
  ApiView,
  ContractsView,
  NetworkView,
  TransfersView,
  VerificationView,
} from "@/components/explorer/views-b";

function CurrentView() {
  const { view } = useExplorer();
  return (
    <motion.div
      key={view}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {view === "overview" && <Overview />}
      {view === "portfolio" && <PortfolioView />}
      {view === "transactions" && <TransactionsView />}
      {view === "blocks" && <BlocksView />}
      {view === "addresses" && <AddressesView />}
      {view === "tokens" && <TokensView />}
      {view === "contracts" && <ContractsView />}
      {view === "transfers" && <TransfersView />}
      {view === "verification" && <VerificationView />}
      {view === "network" && <NetworkView />}
      {view === "api" && <ApiView />}
    </motion.div>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-[#0f1e46] bg-[#040a1c]/60">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-3 px-5 py-5 text-[12px] text-slate-500 sm:flex-row">
        <div className="flex items-center gap-2">
          <HexGlyph size={18} />
          <span>
            QFS Explorer <span className="text-slate-600">v1.0.0</span>
          </span>
        </div>
        <p className="text-center">
          Building a global financial network for a better future. © 2026 QFS Network · Chain ID
          137 · Powered by Polygon
        </p>
      </div>
    </footer>
  );
}

function Shell() {
  return (
    <div className="flex min-h-screen flex-col bg-[#030816]">
      <SiteHeader />
      <div className="flex flex-1">
        <SideNav />
        <main className="min-w-0 flex-1 px-3 py-4 lg:px-6 lg:py-6">
          <div className="mx-auto max-w-[1500px]">
            <CurrentView />
          </div>
        </main>
      </div>
      <SiteFooter />
      <DetailDialog />
    </div>
  );
}

export default function Page() {
  return (
    <ExplorerProvider>
      <Shell />
    </ExplorerProvider>
  );
}
