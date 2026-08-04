"use client";
import { useMemo, useState } from "react";
import {
  STEP_META,
  PHASE_LABELS,
  PHASE_COLORS,
  StepPhase,
} from "../lib/content";
import {
  useDashboardData,
  Preset,
  SessionRow,
  EventRow,
} from "./lib/useDashboardData";

const PRESETS: { value: Preset; label: string }[] = [
  { value: "today", label: "Hoy" },
  { value: "yesterday", label: "Ayer" },
  { value: "7d", label: "7 días" },
  { value: "30d", label: "30 días" },
  { value: "all", label: "Todo" },
];

const N = STEP_META.length;
const pct = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);
const fmtPct = (v: number) => `${v.toFixed(1)}%`;

function fmtTime(ms: number) {
  if (!ms || ms < 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${String(s % 60).padStart(2, "0")}s`;
}

// ── métricas derivadas ──────────────────────────────────────────────────────
function useMetrics(sessions: SessionRow[], events: EventRow[]) {
  return useMemo(() => {
    const total = sessions.length;
    const reached = new Array(N).fill(0);
    for (const s of sessions) {
      const m = s.max_step ?? 0;
      for (let i = 0; i < N; i++) if (m >= i) reached[i]++;
    }

    // tiempo medio por paso (eventos step_view con duration_ms)
    const timeSum = new Array(N).fill(0);
    const timeCnt = new Array(N).fill(0);
    for (const e of events) {
      if (e.event_type === "step_view" && e.duration_ms != null && e.step >= 0 && e.step < N) {
        timeSum[e.step] += e.duration_ms;
        timeCnt[e.step]++;
      }
    }
    const avgTime = timeSum.map((sum, i) => (timeCnt[i] ? sum / timeCnt[i] : 0));

    const reachedSales = sessions.filter((s) => s.reached_sales).length;
    const clickedCta = sessions.filter((s) => s.clicked_cta).length;

    return { total, reached, avgTime, reachedSales, clickedCta };
  }, [sessions, events]);
}

function useUtmBreakdown(sessions: SessionRow[]) {
  return useMemo(() => {
    const map = new Map<string, { source: string; sessions: number; sales: number; cta: number }>();
    for (const s of sessions) {
      const key = s.utm_source || "(directo)";
      const row = map.get(key) || { source: key, sessions: 0, sales: 0, cta: 0 };
      row.sessions++;
      if (s.reached_sales) row.sales++;
      if (s.clicked_cta) row.cta++;
      map.set(key, row);
    }
    return Array.from(map.values()).sort((a, b) => b.sessions - a.sessions);
  }, [sessions]);
}

// ── UI ──────────────────────────────────────────────────────────────────────
function Kpi({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</div>
      <div className="mt-1 text-3xl font-black" style={{ color: accent || "#14532d" }}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-gray-500">{sub}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [preset, setPreset] = useState<Preset>("today");
  const { loading, error, sessions, events, reload } = useDashboardData(preset);
  const m = useMetrics(sessions, events);
  const utm = useUtmBreakdown(sessions);

  const base = m.reached[0] || 0;
  const salesIdx = N - 1;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-chia-deep">Dashboard — Mounjaro de Chía</h1>
            <p className="text-sm text-gray-500">Passagem por etapa do funil de quiz</p>
          </div>
          <button
            onClick={reload}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            ↻ Actualizar
          </button>
        </div>

        {/* Filtros de fecha */}
        <div className="mt-4 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPreset(p.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                preset === p.value
                  ? "bg-chia text-white shadow"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error} — ¿ya corriste la migración <code>supabase-mounjaro-tracking.sql</code> en Supabase?
          </div>
        )}

        {loading ? (
          <div className="mt-10 text-center text-gray-400">Cargando datos…</div>
        ) : (
          <>
            {/* KPIs */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <Kpi label="Sesiones" value={String(m.total)} sub="visitantes únicos" />
              <Kpi
                label="Llegó a VSL 1"
                value={String(m.reached[5] || 0)}
                sub={fmtPct(pct(m.reached[5] || 0, base)) + " del inicio"}
                accent={PHASE_COLORS.vsl1}
              />
              <Kpi
                label="Entró al Quiz 2"
                value={String(m.reached[6] || 0)}
                sub={fmtPct(pct(m.reached[6] || 0, base)) + " del inicio"}
                accent={PHASE_COLORS.quiz2}
              />
              <Kpi
                label="Llegó a Ventas"
                value={String(m.reached[salesIdx] || 0)}
                sub={fmtPct(pct(m.reached[salesIdx] || 0, base)) + " del inicio"}
                accent={PHASE_COLORS.sales}
              />
              <Kpi
                label="Clic en Checkout"
                value={String(m.clickedCta)}
                sub={fmtPct(pct(m.clickedCta, base)) + " del inicio"}
                accent="#dc2626"
              />
            </div>

            {/* Funil por etapa */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-extrabold text-chia-deep">Retención por etapa</h2>
                <div className="flex flex-wrap gap-3 text-xs">
                  {(Object.keys(PHASE_LABELS) as StepPhase[]).map((ph) => (
                    <span key={ph} className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: PHASE_COLORS[ph] }} />
                      {PHASE_LABELS[ph]}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                {STEP_META.map((meta, i) => {
                  const count = m.reached[i] || 0;
                  const retention = pct(count, base);
                  const prev = i > 0 ? m.reached[i - 1] || 0 : count;
                  const dropAbs = prev - count;
                  const dropRel = i > 0 ? pct(dropAbs, prev) : 0;
                  const color = PHASE_COLORS[meta.phase];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 shrink-0 text-right text-xs font-bold text-gray-400">{i}</div>
                      <div className="w-40 shrink-0 truncate text-sm font-semibold text-gray-700" title={meta.label}>
                        {meta.label}
                      </div>
                      <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-gray-100">
                        <div
                          className="flex h-full items-center rounded-md pl-2 text-xs font-bold text-white transition-all"
                          style={{ width: `${Math.max(retention, 3)}%`, background: color }}
                        >
                          {count}
                        </div>
                      </div>
                      <div className="w-14 shrink-0 text-right text-sm font-bold text-gray-700">
                        {fmtPct(retention)}
                      </div>
                      <div className="hidden w-20 shrink-0 text-right text-xs text-gray-400 sm:block">
                        {fmtTime(m.avgTime[i])}
                      </div>
                      <div className="w-16 shrink-0 text-right text-xs font-semibold">
                        {i > 0 && dropAbs > 0 ? (
                          <span className="text-red-500">-{fmtPct(dropRel)}</span>
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-end gap-6 pr-2 text-[10px] uppercase tracking-wide text-gray-400">
                <span className="w-14 text-right">% inicio</span>
                <span className="hidden w-20 text-right sm:block">t. medio</span>
                <span className="w-16 text-right">abandono</span>
              </div>
            </section>

            {/* Fuentes de tráfico */}
            <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-lg font-extrabold text-chia-deep">Fuentes de tráfico (UTM source)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400">
                      <th className="py-2 pr-3 font-semibold">Fuente</th>
                      <th className="py-2 px-3 text-right font-semibold">Sesiones</th>
                      <th className="py-2 px-3 text-right font-semibold">Ventas</th>
                      <th className="py-2 px-3 text-right font-semibold">Checkout</th>
                      <th className="py-2 pl-3 text-right font-semibold">Conv.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {utm.map((r) => (
                      <tr key={r.source} className="border-b border-gray-100 last:border-0">
                        <td className="py-2 pr-3 font-semibold text-gray-700">{r.source}</td>
                        <td className="py-2 px-3 text-right">{r.sessions}</td>
                        <td className="py-2 px-3 text-right">{r.sales}</td>
                        <td className="py-2 px-3 text-right">{r.cta}</td>
                        <td className="py-2 pl-3 text-right font-bold text-chia-dark">
                          {fmtPct(pct(r.cta, r.sessions))}
                        </td>
                      </tr>
                    ))}
                    {utm.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-gray-400">
                          Sin datos en este período.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <p className="mt-4 text-center text-xs text-gray-400">
              {m.total} sesiones · {events.length} eventos en el período seleccionado
            </p>
          </>
        )}
      </div>
    </main>
  );
}
