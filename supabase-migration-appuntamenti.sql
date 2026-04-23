-- ============================================================
-- Tentazioni Acconciature — Migrazione tabella appuntamenti
-- Incolla nel Supabase SQL Editor e clicca Run
-- ============================================================

-- 1. Crea la tabella
CREATE TABLE IF NOT EXISTS public.appuntamenti (
  id         BIGSERIAL    PRIMARY KEY,
  nome       TEXT         NOT NULL,
  telefono   TEXT,
  servizio   TEXT         NOT NULL,
  data       DATE         NOT NULL,
  ora        TIME         NOT NULL,
  note       TEXT,
  origine    TEXT         NOT NULL DEFAULT 'Manuale',
  stato      TEXT         NOT NULL DEFAULT 'confermato',
  created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 2. Abilita RLS
ALTER TABLE public.appuntamenti ENABLE ROW LEVEL SECURITY;

-- 3. Policy unica: anon può leggere e scrivere tutto
--    (la protezione è garantita dal password gate in admin.html)
DROP POLICY IF EXISTS "allow_all_anon" ON public.appuntamenti;
CREATE POLICY "allow_all_anon" ON public.appuntamenti
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 4. Permessi a anon e authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appuntamenti TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.appuntamenti TO authenticated;
GRANT USAGE ON SEQUENCE public.appuntamenti_id_seq TO anon;
GRANT USAGE ON SEQUENCE public.appuntamenti_id_seq TO authenticated;

-- 5. Ricarica lo schema cache di PostgREST
NOTIFY pgrst, 'reload schema';

-- ============================================================
-- Verifica:
-- SELECT * FROM public.appuntamenti LIMIT 5;
-- ============================================================
