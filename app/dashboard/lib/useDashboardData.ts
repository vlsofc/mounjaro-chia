"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase, TABLES } from "../../lib/supabase";

export interface SessionRow {
  id: string;
  created_at: string;
  max_step: number | null;
  reached_sales: boolean | null;
  clicked_cta: boolean | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  device: string | null;
  user_agent: string | null;
}

const SESSION_COLS =
  "id,created_at,max_step,reached_sales,clicked_cta,utm_source,utm_medium,utm_campaign,utm_content,device,user_agent";

export interface EventRow {
  session_id: string;
  step: number;
  step_type: string | null;
  event_type: string;
  duration_ms: number | null;
}

export type Preset = "today" | "yesterday" | "7d" | "30d" | "all";

export function computeRange(preset: Preset): { from: string | null; to: string | null } {
  if (preset === "all") return { from: null, to: null };
  const now = new Date();
  if (preset === "yesterday") {
    const s = new Date(now); s.setDate(s.getDate() - 1); s.setHours(0, 0, 0, 0);
    const e = new Date(now); e.setDate(e.getDate() - 1); e.setHours(23, 59, 59, 999);
    return { from: s.toISOString(), to: e.toISOString() };
  }
  if (preset === "today") now.setHours(0, 0, 0, 0);
  else if (preset === "7d") now.setDate(now.getDate() - 7);
  else if (preset === "30d") now.setDate(now.getDate() - 30);
  return { from: now.toISOString(), to: null };
}

async function fetchAll<T>(build: (from: number, to: number) => Promise<{ data: T[] | null; error: unknown }>) {
  const PAGE = 1000;
  let all: T[] = [];
  let from = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error } = await build(from, from + PAGE - 1);
    if (error) throw error;
    all = all.concat(data || []);
    if (!data || data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export function useDashboardData(preset: Preset) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);

  const load = useCallback(async () => {
    if (!supabase) {
      setError("Supabase no configurado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { from, to } = computeRange(preset);

      const s = await fetchAll<SessionRow>(async (a, b) => {
        let q = supabase!
          .from(TABLES.sessions)
          .select(SESSION_COLS)
          .order("created_at", { ascending: false })
          .range(a, b);
        if (from) q = q.gte("created_at", from);
        if (to) q = q.lte("created_at", to);
        const { data, error } = await q;
        return { data: data as SessionRow[] | null, error };
      });

      const e = await fetchAll<EventRow>(async (a, b) => {
        let q = supabase!
          .from(TABLES.events)
          .select("session_id,step,step_type,event_type,duration_ms")
          .range(a, b);
        if (from) q = q.gte("created_at", from);
        if (to) q = q.lte("created_at", to);
        const { data, error } = await q;
        return { data: data as EventRow[] | null, error };
      });

      setSessions(s);
      setEvents(e);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar datos.");
    } finally {
      setLoading(false);
    }
  }, [preset]);

  useEffect(() => { load(); }, [load]);

  // Apaga sessões (e seus eventos, via cascade) por um campo específico.
  // value === null => apaga onde a coluna está nula (ex.: "(directo)"/"(sem X)").
  const removeBy = useCallback(
    async (field: "utm_campaign" | "utm_medium" | "utm_content" | "device", value: string | null) => {
      if (!supabase) return { ok: false, error: "Supabase no configurado." };
      try {
        let q = supabase.from(TABLES.sessions).delete();
        q = value === null ? q.is(field, null) : q.eq(field, value);
        const { error } = await q;
        if (error) return { ok: false, error: error.message };
        await load();
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Error al borrar." };
      }
    },
    [load]
  );

  return { loading, error, sessions, events, reload: load, removeBy };
}
