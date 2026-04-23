-- ============================================================
-- Tentazioni Acconciature — Seed tabella servizi
-- Colonne effettive: nome (text), prezzo (bigint), durata (int)
-- ============================================================

INSERT INTO public.servizi (nome, prezzo, durata) VALUES
  ('Taglio Donna',                  25,   45),
  ('Taglio Bambina (fino 10 anni)', 15,   30),
  ('Taglio Uomo',                   18,   30),
  ('Piega & Messa in piega',        20,   30),
  ('Tinta intera',                  45,   90),
  ('Meches & Schiariture',          50,   90),
  ('Balayage & Shatush',            80,  120),
  ('Ombre Hair / Color Melt',       90,  120),
  ('Tono su tono',                  35,   60),
  ('Cheratina',                    120,  180),
  ('Ricostruzione Capillare',       60,   60),
  ('Maschera Idratante',            25,   30),
  ('Trattamento Anti-caduta',       40,   45),
  ('Acconciatura Sposa',             0,  120),
  ('Acconciatura Cerimonia',        60,   90),
  ('Prova Acconciatura',            40,   60);

-- prezzo = 0 significa "su preventivo" (gestito dal frontend)
-- durata in minuti
