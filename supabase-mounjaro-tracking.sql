-- =============================================================================
--  Tracking do funnel "Mounjaro de Chía" (ES)
--  Rodar UMA vez no SQL Editor do Supabase (projeto cojskzzwikksbxuwrnab).
--
--  Mesma ESTRUTURA das tabelas sessions / funnel_events do projeto
--  ayuno-metabolico, porém em tabelas DEDICADAS para não misturar os dados
--  dos dois funis (nem poluir o dashboard do ayuno).
-- =============================================================================

-- 1 linha por visitante/sessão -------------------------------------------------
create table if not exists mounjaro_sessions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),
  anonymous_id    text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_content     text,
  utm_term        text,
  fbclid          text,
  user_agent      text,
  referrer        text,
  screen_width    integer,
  device          text,            -- 'mobile' | 'tablet' | 'desktop'
  ab_variant      text,
  funnel_version  text,
  max_step        integer default 0,
  reached_sales   boolean default false,
  clicked_cta     boolean default false
);

-- 1 linha por evento de etapa --------------------------------------------------
create table if not exists mounjaro_funnel_events (
  id           bigserial primary key,
  session_id   uuid references mounjaro_sessions(id) on delete cascade,
  step         integer not null,
  step_type    text,
  event_type   text not null default 'step_view',
  duration_ms  integer,
  created_at   timestamptz not null default now()
);

-- Colunas idempotentes (caso a tabela já tenha sido criada numa execução
-- anterior sem essas colunas — evita "column does not exist") ------------------
alter table mounjaro_sessions add column if not exists device         text;
alter table mounjaro_sessions add column if not exists utm_medium     text;
alter table mounjaro_sessions add column if not exists utm_content    text;
alter table mounjaro_sessions add column if not exists utm_term       text;
alter table mounjaro_sessions add column if not exists ab_variant     text;
alter table mounjaro_sessions add column if not exists funnel_version text;

-- Índices ----------------------------------------------------------------------
create index if not exists idx_mounjaro_events_session on mounjaro_funnel_events(session_id);
create index if not exists idx_mounjaro_events_step    on mounjaro_funnel_events(step);
create index if not exists idx_mounjaro_sessions_created on mounjaro_sessions(created_at desc);
create index if not exists idx_mounjaro_sessions_utm_source on mounjaro_sessions(utm_source);
create index if not exists idx_mounjaro_sessions_utm_campaign on mounjaro_sessions(utm_campaign);
create index if not exists idx_mounjaro_sessions_device on mounjaro_sessions(device);

-- RLS: permitir insert/select anônimo (mesmo padrão dos outros funis) ----------
alter table mounjaro_sessions enable row level security;
alter table mounjaro_funnel_events enable row level security;

drop policy if exists "mounjaro sessions anon insert" on mounjaro_sessions;
create policy "mounjaro sessions anon insert" on mounjaro_sessions
  for insert to anon with check (true);
drop policy if exists "mounjaro sessions anon select" on mounjaro_sessions;
create policy "mounjaro sessions anon select" on mounjaro_sessions
  for select to anon using (true);
drop policy if exists "mounjaro sessions anon update" on mounjaro_sessions;
create policy "mounjaro sessions anon update" on mounjaro_sessions
  for update to anon using (true) with check (true);
drop policy if exists "mounjaro sessions anon delete" on mounjaro_sessions;
create policy "mounjaro sessions anon delete" on mounjaro_sessions
  for delete to anon using (true);

drop policy if exists "mounjaro events anon insert" on mounjaro_funnel_events;
create policy "mounjaro events anon insert" on mounjaro_funnel_events
  for insert to anon with check (true);
drop policy if exists "mounjaro events anon select" on mounjaro_funnel_events;
create policy "mounjaro events anon select" on mounjaro_funnel_events
  for select to anon using (true);
drop policy if exists "mounjaro events anon delete" on mounjaro_funnel_events;
create policy "mounjaro events anon delete" on mounjaro_funnel_events
  for delete to anon using (true);
