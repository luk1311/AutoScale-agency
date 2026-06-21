-- ============================================================================
-- AutoScale — Esquema, RLS y automatización de la tabla `leads`
-- Flujo único: Supabase es la fuente de verdad. El formulario inserta (anon),
-- el CRM lee/actualiza (solo autenticados) y un Database Webhook dispara n8n.
-- Ejecutar en: Supabase Dashboard → SQL Editor.
-- ============================================================================

-- 1. Tabla -------------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  nombre      text not null,
  whatsapp    text not null,
  correo      text not null,
  empresa     text,
  servicio    text,
  descripcion text,
  status      text not null default 'nuevo',
  origen      text,
  url         text
);

-- Solo permitir estados conocidos (coherente con el frontend).
alter table public.leads
  drop constraint if exists leads_status_check;
alter table public.leads
  add constraint leads_status_check
  check (status in ('nuevo', 'contactado', 'propuesta', 'ganado'));

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx     on public.leads (status);

-- 2. Row Level Security ------------------------------------------------------
alter table public.leads enable row level security;

-- El formulario público (rol anon) SOLO puede insertar. No puede leer ni editar.
drop policy if exists "form_can_insert" on public.leads;
create policy "form_can_insert"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- El CRM (usuarios autenticados vía Supabase Auth) puede leer.
drop policy if exists "authenticated_can_read" on public.leads;
create policy "authenticated_can_read"
  on public.leads
  for select
  to authenticated
  using (true);

-- El CRM puede actualizar el estado de los leads.
drop policy if exists "authenticated_can_update" on public.leads;
create policy "authenticated_can_update"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

-- (Deliberadamente NO se crea política de DELETE: nadie borra leads vía API.)

-- ============================================================================
-- 3. Disparo de automatizaciones (Database Webhook → n8n)
-- ----------------------------------------------------------------------------
-- En el Dashboard: Database → Webhooks → Create a new hook
--   • Tabla:    public.leads
--   • Eventos:  Insert
--   • Tipo:     HTTP Request (POST) a la URL de tu webhook de n8n
-- Supabase enviará un body con la forma:
--   { "type": "INSERT", "table": "leads", "record": { ...columnas... } }
-- n8n debe leer los campos como  {{$json.body.record.nombre}}  (ver n8n-template.json).
-- ============================================================================
