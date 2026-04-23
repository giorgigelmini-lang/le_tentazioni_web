-- ============================================================
-- Tentazioni Acconciature — Migrazione promemoria WhatsApp
-- Incolla nel Supabase SQL Editor e clicca Run
-- ============================================================

-- 1. Aggiunge le due nuove colonne alla tabella appuntamenti
ALTER TABLE public.appuntamenti
  ADD COLUMN IF NOT EXISTS cliente_telefono   TEXT,
  ADD COLUMN IF NOT EXISTS promemoria_inviato BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Indice per velocizzare la query oraria del cron job
--    (trova appuntamenti non notificati in un certo intervallo)
CREATE INDEX IF NOT EXISTS idx_app_promemoria
  ON public.appuntamenti (data_ora, promemoria_inviato)
  WHERE promemoria_inviato = FALSE;

-- 3. (Opzionale — solo se usi pg_cron + pg_net invece di Make.com)
--    Attiva le estensioni nel Supabase Dashboard prima di eseguire questo blocco:
--    Dashboard → Database → Extensions → cerca "pg_cron" e "pg_net" → Enable

-- SELECT cron.schedule(
--   'promemoria-appuntamenti-hourly',
--   '0 * * * *',
--   $$
--   SELECT net.http_post(
--     url     := 'https://ghreisfsrmhlkstnlwgv.supabase.co/functions/v1/promemoria-appuntamenti',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer <INCOLLA_QUI_SERVICE_ROLE_KEY>',
--       'Content-Type',  'application/json'
--     ),
--     body    := '{}'::jsonb
--   );
--   $$
-- );

-- ============================================================
-- Verifica:
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'appuntamenti'
-- ORDER BY ordinal_position;
-- ============================================================
