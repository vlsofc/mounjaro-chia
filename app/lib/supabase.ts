import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Mismo proyecto Supabase compartido que usan los demás funnels.
// La anon key es una clave pública de cliente (protegida por RLS); se deja como
// fallback para que el tracking funcione en Vercel aunque no se definan envs.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://cojskzzwikksbxuwrnab.supabase.co";

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvanNrenp3aWtrc2J4dXdybmFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3NjM0MjksImV4cCI6MjA4NTMzOTQyOX0._vzbmH8AB6OVZLki1c9Tn8YGdn-QWfw3Y1aeyGMYr4E";

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// Nombres de las tablas dedicadas de este funnel (misma estructura que las
// tablas `sessions` / `funnel_events` del proyecto ayuno-metabolico).
export const TABLES = {
  sessions: "mounjaro_sessions",
  events: "mounjaro_funnel_events",
} as const;
