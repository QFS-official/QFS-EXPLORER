"use client";

import * as React from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { launchProgress, RESERVE_LAUNCH, TOKENS, TokenStatic } from "@/lib/explorer";
import { useExplorer } from "./store";

/* ------------------------------- logos ------------------------------ */

const BRAND_SYMBOL = "/qfs-symbol.png";

function BrandMark({ size = 40, className, glow = "rgba(56,132,255,.45)" }: { size?: number; className?: string; glow?: string }) {
  return (
    <img
      src={BRAND_SYMBOL}
      alt=""
      width={size}
      height={size}
      draggable={false}
      className={cn("shrink-0 select-none object-contain", className)}
      style={{ width: size, height: size, filter: `drop-shadow(0 2px 8px ${glow})` }}
      aria-hidden
    />
  );
}

export function Coin({ size = 40, className }: { size?: number; className?: string }) {
  return <BrandMark size={size} className={className} />;
}

export function HexGlyph({ size = 36, className }: { size?: number; className?: string }) {
  return <BrandMark size={size} className={className} glow="rgba(56,132,255,.35)" />;
}

export function TokenIcon({ token, size = 28 }: { token: TokenStatic; size?: number }) {
  if (token.coin) return <Coin size={size} />;
  return (
    <div
      className="grid shrink-0 place-items-center rounded-full font-bold text-white select-none"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(145deg, ${token.color}, ${token.color}99)`,
        boxShadow: `0 2px 10px ${token.color}55, inset 0 1px 3px rgba(255,255,255,.45)`,
        fontSize: size * 0.44,
      }}
      aria-hidden
    >
      {token.symbol[0]}
    </div>
  );
}

export function tokenBySymbol(symbol: string): TokenStatic {
  return TOKENS.find((t) => t.symbol === symbol) ?? TOKENS[0];
}

/* ------------------------------- badges ----------------------------- */

export function OperativeDot({ className }: { className?: string }) {
  return <span className={cn("pulse-dot inline-block h-2 w-2 rounded-full bg-emerald-400", className)} />;
}

export function StatusBadge({ text }: { text?: string }) {
  const { t } = useExplorer();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
      <OperativeDot /> {text ?? t("Operational")}
    </span>
  );
}

export function DevDot({ className }: { className?: string }) {
  return <span className={cn("pulse-dot inline-block h-2 w-2 rounded-full bg-amber-400", className)} />;
}

export function DevBadge() {
  const { t } = useExplorer();
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400">
      <DevDot /> {t("In Development")}
    </span>
  );
}

export function LaunchProgress({ className }: { className?: string }) {
  const { pct, daysLeft } = launchProgress();
  const { t } = useExplorer();
  return (
    <div className={className}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">{t("Launch Progress")}</span>
        <span className="font-semibold text-amber-400">{pct.toFixed(1)}%</span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#0a1638] ring-1 ring-inset ring-[#22407f]/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-[width] duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
        <span>
          {t("Target")}: <span className="text-slate-300">{RESERVE_LAUNCH.targetLabel}</span>
        </span>
        <span>
          <span className="font-medium text-amber-400/90">{daysLeft}</span> {t("days left")}
        </span>
      </div>
    </div>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
      ✓ Verified
    </span>
  );
}

export function Delta({ value, className }: { value: number; className?: string }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        up ? "text-emerald-400" : "text-rose-400",
        className
      )}
    >
      {up ? "↑" : "↓"} {up ? "+" : ""}
      {value.toFixed(1)}%
    </span>
  );
}

/* ------------------------------ sparkline ---------------------------- */

export function Spark({
  data,
  color = "#34d399",
  width = 96,
  height = 38,
}: {
  data: { i: number; v: number }[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const id = React.useId().replace(/[:]/g, "");
  return (
    <div style={{ width, height }} className="shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`sp-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.6}
            fill={`url(#sp-${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ---------------------------- chart tooltip -------------------------- */

export function ChartTip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string; dataKey?: string }[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-[#26427f] bg-[#0a1430]/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      {label !== undefined && <div className="mb-1 font-medium text-slate-300">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-0.5">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-slate-400">{p.name}</span>
          <span className="ml-auto font-semibold text-white">
            {typeof p.value === "number" ? p.value.toLocaleString("en-US") : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- panel ------------------------------- */

export function Panel({
  title,
  icon,
  right,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("qfs-card overflow-hidden", className)}>
      {(title || right) && (
        <header className="flex items-center gap-2.5 border-b border-[#16295c]/70 px-4 py-3">
          {icon && <span className="text-blue-400">{icon}</span>}
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          <div className="ml-auto flex items-center gap-2">{right}</div>
        </header>
      )}
      <div className={cn("p-4", bodyClassName)}>{children}</div>
    </section>
  );
}

export function ViewAllBtn({ onClick }: { onClick: () => void }) {
  const { t } = useExplorer();
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
    >
      {t("View All")} <span aria-hidden>→</span>
    </button>
  );
}

export function IconBox({
  children,
  className,
  size = "md",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center rounded-lg border border-blue-500/25 bg-blue-500/10 text-blue-400",
        size === "sm" && "h-7 w-7",
        size === "md" && "h-10 w-10",
        size === "lg" && "h-12 w-12",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------ hash link ---------------------------- */

export function HashLink({
  value,
  onClick,
  icon,
  className,
}: {
  value: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={value}
      className={cn(
        "mono inline-flex max-w-full items-center gap-1.5 truncate text-left text-[13px] text-blue-400 transition-colors hover:text-blue-300 hover:underline",
        className
      )}
    >
      {icon}
      {value}
    </button>
  );
}
