"use client";

import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export const CHART_COLORS = [
  "#059669", // emerald-600
  "#0ea5e9", // sky-500
  "#f59e0b", // amber-500
  "#8b5cf6", // violet-500
  "#f43f5e", // rose-500
  "#14b8a6", // teal-500
];

/* ------------------------------------------------------------------ */
/* Line / area chart                                                  */
/* ------------------------------------------------------------------ */

export function LineChart({
  series,
  labels,
  height = 240,
  yFormatter = (n: number) => String(n),
  className,
}: {
  series: { name: string; color: string; data: number[] }[];
  labels: string[];
  height?: number;
  yFormatter?: (n: number) => string;
  className?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);

  const W = 720;
  const H = height;
  const padL = 46;
  const padR = 14;
  const padT = 16;
  const padB = 26;

  const { min, max } = useMemo(() => {
    let lo = Infinity;
    let hi = -Infinity;
    series.forEach((s) =>
      s.data.forEach((v) => {
        lo = Math.min(lo, v);
        hi = Math.max(hi, v);
      })
    );
    const span = hi - lo || 1;
    return { min: lo - span * 0.15, max: hi + span * 0.15 };
  }, [series]);

  const x = (i: number) => padL + (i * (W - padL - padR)) / Math.max(1, labels.length - 1);
  const y = (v: number) => padT + (1 - (v - min) / (max - min)) * (H - padT - padB);

  const gridLines = 4;
  const gridVals = Array.from({ length: gridLines + 1 }, (_, i) => min + ((max - min) * i) / gridLines);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const vx = ((e.clientX - rect.left) / rect.width) * W;
    const idx = Math.round(((vx - padL) / (W - padL - padR)) * (labels.length - 1));
    setHover(Math.min(labels.length - 1, Math.max(0, idx)));
  };

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: "auto" }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          {series.map((s, si) => (
            <linearGradient key={si} id={`area-${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {/* gridlines + y labels */}
        {gridVals.map((gv, i) => (
          <g key={i}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(gv)}
              y2={y(gv)}
              stroke="currentColor"
              className="text-stone-200 dark:text-stone-800"
              strokeDasharray="3 4"
              strokeWidth="1"
            />
            <text
              x={padL - 8}
              y={y(gv) + 3.5}
              textAnchor="end"
              fontSize="10"
              className="fill-stone-400 dark:fill-stone-500"
            >
              {yFormatter(gv)}
            </text>
          </g>
        ))}
        {/* x labels */}
        {labels.map((l, i) => (
          <text
            key={i}
            x={x(i)}
            y={H - 6}
            textAnchor="middle"
            fontSize="10"
            className={cn(
              "fill-stone-400 dark:fill-stone-500",
              hover === i && "fill-stone-700 dark:fill-stone-200"
            )}
          >
            {l}
          </text>
        ))}
        {/* areas + lines */}
        {series.map((s, si) => (
          <g key={si}>
            <path
              d={`M ${x(0)} ${y(s.data[0]!)} ${s.data
                .slice(1)
                .map((v, i) => `L ${x(i + 1)} ${y(v)}`)
                .join(" ")} L ${x(s.data.length - 1)} ${H - padB} L ${x(0)} ${H - padB} Z`}
              fill={`url(#area-${si})`}
            />
            <path
              d={`M ${x(0)} ${y(s.data[0]!)} ${s.data
                .slice(1)
                .map((v, i) => `L ${x(i + 1)} ${y(v)}`)
                .join(" ")}`}
              fill="none"
              stroke={s.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </g>
        ))}
        {/* hover crosshair + dots */}
        {hover !== null && (
          <g>
            <line
              x1={x(hover)}
              x2={x(hover)}
              y1={padT}
              y2={H - padB}
              stroke="currentColor"
              className="text-stone-300 dark:text-stone-700"
              strokeDasharray="3 3"
            />
            {series.map((s, si) => (
              <circle key={si} cx={x(hover)} cy={y(s.data[hover]!)} r="4.5" fill={s.color} stroke="white" strokeWidth="2" />
            ))}
          </g>
        )}
      </svg>
      {/* tooltip */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs shadow-lg dark:border-stone-700 dark:bg-stone-800"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="mb-1 font-semibold text-stone-900 dark:text-stone-50">{labels[hover]}</p>
          {series.map((s, si) => (
            <p key={si} className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
              <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
              {s.name}: <span className="font-semibold tabular-nums">{yFormatter(s.data[hover]!)}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Vertical bar chart                                                 */
/* ------------------------------------------------------------------ */

export function BarChart({
  data,
  height = 220,
  valueFormatter = (n: number) => String(n),
  target,
  max,
  className,
}: {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  valueFormatter?: (n: number) => string;
  target?: number;
  max?: number;
  className?: string;
}) {
  const W = 720;
  const H = height;
  const padL = 40;
  const padR = 10;
  const padT = 26;
  const padB = 26;
  const top = max ?? Math.max(...data.map((d) => d.value)) * 1.15;
  const innerW = W - padL - padR;
  const slot = innerW / data.length;
  const barW = Math.min(46, slot * 0.55);
  const y = (v: number) => padT + (1 - v / top) * (H - padT - padB);

  return (
    <div className={cn("relative", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: "auto" }}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <g key={f}>
            <line
              x1={padL}
              x2={W - padR}
              y1={y(top * f)}
              y2={y(top * f)}
              stroke="currentColor"
              className="text-stone-200 dark:text-stone-800"
              strokeDasharray="3 4"
            />
            <text x={padL - 8} y={y(top * f) + 3.5} textAnchor="end" fontSize="10" className="fill-stone-400 dark:fill-stone-500">
              {valueFormatter(top * f)}
            </text>
          </g>
        ))}
        {target !== undefined && (
          <line
            x1={padL}
            x2={W - padR}
            y1={y(target)}
            y2={y(target)}
            stroke="#f59e0b"
            strokeDasharray="6 4"
            strokeWidth="1.5"
          />
        )}
        {data.map((d, i) => (
          <g key={i}>
            <rect
              x={padL + i * slot + (slot - barW) / 2}
              y={y(d.value)}
              width={barW}
              height={H - padB - y(d.value)}
              rx="5"
              fill={d.color ?? CHART_COLORS[i % CHART_COLORS.length]}
            />
            <text
              x={padL + i * slot + slot / 2}
              y={y(d.value) - 7}
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="600"
              className="fill-stone-600 dark:fill-stone-300"
            >
              {valueFormatter(d.value)}
            </text>
            <text
              x={padL + i * slot + slot / 2}
              y={H - 8}
              textAnchor="middle"
              fontSize="10.5"
              className="fill-stone-500 dark:fill-stone-400"
            >
              {d.label}
            </text>
          </g>
        ))}
      </svg>
      {target !== undefined && (
        <p className="mt-1 text-right text-[10px] text-amber-600 dark:text-amber-400">
          ─ target: {valueFormatter(target)}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Donut chart                                                        */
/* ------------------------------------------------------------------ */

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  size = 170,
  thickness = 22,
  className,
}: {
  data: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
  thickness?: number;
  className?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={cn("flex items-center gap-5", className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          className="stroke-stone-100 dark:stroke-stone-800"
        />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * C;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${C - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-700"
            />
          );
          offset += dash;
          return el;
        })}
        {centerValue && (
          <text
            x="50%"
            y="47%"
            textAnchor="middle"
            fontSize={size * 0.16}
            fontWeight="700"
            className="fill-stone-900 dark:fill-stone-50"
          >
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text
            x="50%"
            y="60%"
            textAnchor="middle"
            fontSize={size * 0.07}
            className="fill-stone-500 dark:fill-stone-400"
          >
            {centerLabel}
          </text>
        )}
      </svg>
      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((d, i) => (
          <li key={i} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-2 text-stone-600 dark:text-stone-300">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: d.color }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="shrink-0 font-semibold tabular-nums text-stone-800 dark:text-stone-100">
              {Math.round((d.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                          */
/* ------------------------------------------------------------------ */

export function Sparkline({
  data,
  color = "#059669",
  width = 120,
  height = 36,
  className,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - 4 - ((v - min) / span) * (height - 8)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Risk matrix (5×5)                                                  */
/* ------------------------------------------------------------------ */

export type MatrixRisk = {
  id: string;
  title: string;
  p: number; // 1-5
  i: number; // 1-5
  score: number;
  color: string;
};

export function RiskMatrix({
  risks,
  onSelect,
  className,
}: {
  risks: MatrixRisk[];
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const zone = (p: number, i: number) => {
    const s = p * i;
    if (s >= 15) return "bg-rose-500/10 dark:bg-rose-500/15";
    if (s >= 8) return "bg-amber-500/10 dark:bg-amber-500/15";
    return "bg-emerald-500/10 dark:bg-emerald-500/15";
  };
  const dotColor = (score: number) => {
    if (score >= 15) return "bg-rose-500";
    if (score >= 8) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const yLabels = ["Almost certain", "Likely", "Possible", "Unlikely", "Rare"];
  const xLabels = ["Negligible", "Minor", "Moderate", "Major", "Severe"];

  return (
    <div className={className}>
      <div className="relative ml-6">
        <div className="grid grid-cols-5 gap-1">
          {Array.from({ length: 25 }, (_, idx) => {
            const p = Math.floor(idx / 5) + 1; // 1..5
            const i = (idx % 5) + 1; // 1..5
            return <div key={idx} className={cn("h-14 rounded-md", zone(p, i))} />;
          })}
        </div>
        {/* risk dots */}
        {risks.map((r) => (
          <button
            key={r.id}
            title={`${r.title} (score ${r.score})`}
            onClick={() => onSelect?.(r.id)}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-white shadow transition-transform hover:scale-125 dark:ring-stone-900",
              dotColor(r.score)
            )}
            style={{
              left: `${8 + ((r.p - 1) / 4) * 84}%`,
              top: `${8 + ((r.i - 1) / 4) * 84}%`,
              width: r.score >= 15 ? 15 : 12,
              height: r.score >= 15 ? 15 : 12,
            }}
          />
        ))}
        {/* axis labels */}
        <p className="mt-2 text-center text-[10px] font-medium text-stone-400">
          Impact → <span className="hidden sm:inline">(severity of consequence)</span>
        </p>
        <div className="absolute -left-6 top-0 h-full -translate-x-full">
          <p className="mt-1 rotate-180 text-[10px] font-medium text-stone-400 [writing-mode:vertical-rl]">
            Probability →
          </p>
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-stone-400">
          {xLabels.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-stone-500 dark:text-stone-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Low (1–7)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500" /> Medium (8–14)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> High (15–25)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-stone-300 dark:bg-stone-600" /> Hover a dot for details
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Gauge (strategy health)                                            */
/* ------------------------------------------------------------------ */

export function Gauge({
  value,
  label,
  size = 190,
  color = "#059669",
  className,
}: {
  value: number;
  label?: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const r = size / 2 - 14;
  const C = Math.PI * r; // semicircle length
  const frac = Math.min(100, Math.max(0, value)) / 100;
  const cx = size / 2;
  const cy = size / 2;
  const start = `${cx - r},${cy}`;
  const end = `${cx + r},${cy}`;
  const color2 = value >= 70 ? "#059669" : value >= 50 ? "#f59e0b" : "#f43f5e";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg width={size} height={size / 2 + 26} viewBox={`0 0 ${size} ${size / 2 + 26}`}>
        <path
          d={`M ${start} A ${r} ${r} 0 0 1 ${end}`}
          fill="none"
          strokeWidth="13"
          strokeLinecap="round"
          className="stroke-stone-100 dark:stroke-stone-800"
        />
        <path
          d={`M ${start} A ${r} ${r} 0 0 1 ${end}`}
          fill="none"
          stroke={color2}
          strokeWidth="13"
          strokeLinecap="round"
          strokeDasharray={`${frac * C} ${C}`}
          className="transition-all duration-700"
        />
        <text x={cx} y={cy + 4} textAnchor="middle" fontSize={size * 0.16} fontWeight="700" className="fill-stone-900 dark:fill-stone-50">
          {Math.round(value)}
        </text>
        <text x={cx} y={cy + 22} textAnchor="middle" fontSize="11" className="fill-stone-500 dark:fill-stone-400">
          {label ?? "/ 100"}
        </text>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart legend                                                       */
/* ------------------------------------------------------------------ */

export function Legend({
  items,
  className,
}: {
  items: { label: string; color: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-1.5", className)}>
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <span className="h-2 w-2 rounded-full" style={{ background: it.color }} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
