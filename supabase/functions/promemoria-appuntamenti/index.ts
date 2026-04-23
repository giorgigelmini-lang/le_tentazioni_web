// supabase/functions/promemoria-appuntamenti/index.ts
// Edge Function — Promemoria WhatsApp 24h prima dell'appuntamento
//
// Deploy:
//   supabase functions deploy promemoria-appuntamenti --no-verify-jwt
//
// Secrets da configurare (una sola volta):
//   supabase secrets set TWILIO_ACCOUNT_SID=ACxxx
//   supabase secrets set TWILIO_AUTH_TOKEN=xxx
//   supabase secrets set TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const TWILIO_SID    = Deno.env.get('TWILIO_ACCOUNT_SID')!;
const TWILIO_TOKEN  = Deno.env.get('TWILIO_AUTH_TOKEN')!;
const TWILIO_FROM   = Deno.env.get('TWILIO_WHATSAPP_FROM')!;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// Normalizza un numero italiano in formato internazionale +39XXXXXXXXXX
function normalizzaTelefono(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (digits.length < 9) return null;
  if (digits.startsWith('0039')) return '+' + digits.slice(4);
  if (digits.startsWith('39') && digits.length >= 11) return '+' + digits;
  return '+39' + digits;
}

async function inviaSMS(to: string, testo: string): Promise<boolean> {
  const formData = new URLSearchParams({
    From: TWILIO_FROM,
    To:   `whatsapp:${to}`,
    Body: testo
  });

  const res = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        Authorization:  'Basic ' + btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`),
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    }
  );

  if (!res.ok) {
    const err = await res.json();
    console.error('[Promemoria] Twilio error:', err);
    return false;
  }
  return true;
}

Deno.serve(async (_req) => {
  const now  = new Date();

  // Finestra: appuntamenti tra 23h e 25h da adesso
  // (2h di margine garantisce che ogni job orario copra l'intera fascia)
  const da = new Date(now.getTime() + 23 * 60 * 60 * 1000).toISOString();
  const a  = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

  const { data: appuntamenti, error } = await supabase
    .from('appuntamenti')
    .select('id, cliente_nome, cliente_telefono, data_ora, servizi(nome)')
    .eq('promemoria_inviato', false)
    .gte('data_ora', da)
    .lte('data_ora', a);

  if (error) {
    console.error('[Promemoria] Fetch error:', error);
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  const log: object[] = [];

  for (const appt of appuntamenti ?? []) {
    if (!appt.cliente_telefono) {
      log.push({ id: appt.id, status: 'skip', reason: 'nessun telefono' });
      continue;
    }

    const tel = normalizzaTelefono(appt.cliente_telefono);
    if (!tel) {
      log.push({ id: appt.id, status: 'skip', reason: 'telefono non valido' });
      continue;
    }

    const ora  = appt.data_ora.slice(11, 16); // HH:MM
    const nome = appt.cliente_nome;
    const testo =
      `Ciao ${nome}, ti ricordiamo il tuo appuntamento da Le Tentazioni domani alle ${ora}. ` +
      `Se non riesci a venire, avvisaci il prima possibile! 🌸`;

    const inviato = await inviaSMS(tel, testo);

    if (inviato) {
      await supabase
        .from('appuntamenti')
        .update({ promemoria_inviato: true })
        .eq('id', appt.id);
      log.push({ id: appt.id, status: 'inviato', a: tel });
    } else {
      log.push({ id: appt.id, status: 'errore_invio', a: tel });
    }
  }

  console.log(`[Promemoria] ${now.toISOString()} — elaborati: ${log.length}`);
  return new Response(
    JSON.stringify({ eseguito: now.toISOString(), elaborati: log.length, log }),
    { headers: { 'Content-Type': 'application/json' } }
  );
});
