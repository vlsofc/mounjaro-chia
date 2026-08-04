import { supabase, TABLES } from "./supabase";

// Tracking del funnel — misma lógica que ayuno-metabolico (sessions + eventos),
// escribiendo en las tablas dedicadas mounjaro_sessions / mounjaro_funnel_events.
//
// Modelo:
//  - initSession(): crea 1 fila en mounjaro_sessions (UTMs, user agent, etc.).
//  - bumpProgress(step): sube sessions.max_step (monotónico) => retención exacta.
//  - logStepEvent(step, type, durMs): 1 fila por paso con el tiempo que estuvo.
//  - trackCtaClick(): marca clicked_cta y registra el clic en checkout.

const ANON_ID_KEY = "mounjaro_anonymous_id";
const SESSION_ID_KEY = "mounjaro_session_id";

// Versión del funnel grabada en cada sesión nueva. Incrementa a 'v2', 'v3'...
// cuando hagas cambios estructurales para comparar antes/después.
export const FUNNEL_VERSION = "v1";

let sessionPromise: Promise<string | null> | null = null;
let initCalled = false;
let maxStepSent = -1;

function generateAnonymousId() {
  return "anon_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function getOrCreateAnonymousId() {
  let anonId = localStorage.getItem(ANON_ID_KEY);
  if (!anonId) {
    anonId = generateAnonymousId();
    localStorage.setItem(ANON_ID_KEY, anonId);
  }
  return anonId;
}

function getUtmParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    fbclid: params.get("fbclid"),
  };
}

export async function initSession(): Promise<string | null> {
  if (initCalled) return sessionPromise;
  initCalled = true;

  if (!supabase || typeof window === "undefined") return null;

  const existing = sessionStorage.getItem(SESSION_ID_KEY);
  if (existing) {
    sessionPromise = Promise.resolve(existing);
    return sessionPromise;
  }

  sessionPromise = (async () => {
    try {
      const utm = getUtmParams();
      const payload = {
        anonymous_id: getOrCreateAnonymousId(),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
        utm_content: utm.utm_content,
        utm_term: utm.utm_term,
        fbclid: utm.fbclid,
        user_agent: navigator.userAgent,
        referrer: document.referrer || null,
        screen_width: window.innerWidth,
        funnel_version: FUNNEL_VERSION,
      };

      const { data, error } = await supabase
        .from(TABLES.sessions)
        .insert(payload)
        .select("id")
        .single();

      if (error || !data) return null;
      sessionStorage.setItem(SESSION_ID_KEY, data.id);
      return data.id as string;
    } catch {
      return null;
    }
  })();

  return sessionPromise;
}

// Actualiza el progreso máximo de la sesión (retención). Monotónico: nunca baja.
export async function bumpProgress(step: number, stepType: string) {
  if (!supabase) return;
  try {
    if (!initCalled) await initSession();
    const sessionId = await sessionPromise;
    if (!sessionId) return;
    if (step <= maxStepSent) return;
    maxStepSent = step;

    const updates: Record<string, unknown> = { max_step: step };
    if (stepType === "sales-page") updates.reached_sales = true;

    await supabase.from(TABLES.sessions).update(updates).eq("id", sessionId);
  } catch {
    // silencioso
  }
}

// Registra 1 evento de paso con el tiempo que el usuario pasó en él.
export async function logStepEvent(
  step: number,
  stepType: string,
  durationMs: number | null = null
) {
  if (!supabase) return;
  try {
    const sessionId = await sessionPromise;
    if (!sessionId) return;
    await supabase.from(TABLES.events).insert({
      session_id: sessionId,
      step,
      step_type: stepType,
      event_type: "step_view",
      duration_ms: durationMs,
    });
  } catch {
    // silencioso
  }
}

export async function trackCtaClick(label = "checkout") {
  if (!supabase) return;
  try {
    const sessionId = await sessionPromise;
    if (!sessionId) return;

    await supabase.from(TABLES.events).insert({
      session_id: sessionId,
      step: -1,
      step_type: `cta:${label}`,
      event_type: "cta_click",
    });

    await supabase
      .from(TABLES.sessions)
      .update({ clicked_cta: true })
      .eq("id", sessionId);
  } catch {
    // silencioso
  }
}
