// assets/js/supabase.js
// Client REST Supabase condiviso — Tentazioni Acconciature

var Supabase = (function () {
  var BASE = 'https://ghreisfsrmhlkstnlwgv.supabase.co/rest/v1';
  var KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdocmVpc2Zzcm1obGtzdG5sd2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjcyNzAsImV4cCI6MjA5MjQ0MzI3MH0.WPUL0pNKsBaF6ar15HM4LVb9q_sw62a4aX7LuNQLHp4';

  function req(path, opts) {
    var method  = (opts && opts.method) || 'GET';
    var headers = {
      apikey:          KEY,
      Authorization:   'Bearer ' + KEY,
      'Content-Type':  'application/json'
    };
    if (opts && opts.prefer) headers['Prefer'] = opts.prefer;

    return fetch(BASE + path, {
      method:  method,
      headers: headers,
      body:    (opts && opts.body != null) ? JSON.stringify(opts.body) : undefined
    }).then(function (r) {
      if (r.status === 204) return null;
      return r.json().then(function (data) {
        if (!r.ok) throw data;
        return data;
      });
    });
  }

  // ── SERVIZI ──────────────────────────────────────────────

  function fetchServizi() {
    return req('/servizi?select=*');
  }

  // ── APPUNTAMENTI ─────────────────────────────────────────

  /**
   * Recupera gli appuntamenti in un intervallo di date.
   * @param {string} dataInizio  YYYY-MM-DD
   * @param {string} dataFine    YYYY-MM-DD
   */
  function fetchAppuntamenti(dataInizio, dataFine) {
    var qs = '/appuntamenti?select=id,cliente_nome,cliente_telefono,data_ora,servizio_id,origine,promemoria_inviato,servizi(nome)&order=data_ora.asc';
    if (dataInizio) qs += '&data_ora=gte.' + dataInizio + 'T00:00:00';
    if (dataFine)   qs += '&data_ora=lte.' + dataFine   + 'T23:59:59';
    return req(qs);
  }

  /**
   * Inserisce un nuovo appuntamento.
   * Il campo `origine` viene salvato come 'Manuale' di default.
   *
   * @param {Object} dati
   * @param {string} dati.cliente_nome  - Nome cliente (obbligatorio)
   * @param {string} dati.data_ora      - Timestamp ISO 'YYYY-MM-DDTHH:MM:00' (obbligatorio)
   * @param {string} [dati.servizio_id] - ID del servizio dalla tabella servizi
   * @param {string} [dati.origine]     - 'Manuale' | 'WhatsApp' | 'Sito' (default 'Manuale')
   * @returns {Promise<Object[]>}       - Array con il record inserito
   */
  function inserisciAppuntamento(dati) {
    var body = {
      cliente_nome: dati.cliente_nome,
      data_ora:     dati.data_ora,
      origine:      dati.origine || 'Manuale'
    };
    if (dati.servizio_id != null && dati.servizio_id !== '') {
      body.servizio_id = dati.servizio_id;
    }
    if (dati.cliente_telefono) {
      body.cliente_telefono = dati.cliente_telefono;
    }
    return req('/appuntamenti', {
      method: 'POST',
      prefer: 'return=representation',
      body:   body
    });
  }

  /**
   * Elimina definitivamente un appuntamento.
   * @param {number} id
   */
  function cancellaAppuntamento(id) {
    return req('/appuntamenti?id=eq.' + id, { method: 'DELETE' });
  }

  return {
    fetchServizi:          fetchServizi,
    fetchAppuntamenti:     fetchAppuntamenti,
    inserisciAppuntamento: inserisciAppuntamento,
    cancellaAppuntamento:  cancellaAppuntamento
  };
})();
