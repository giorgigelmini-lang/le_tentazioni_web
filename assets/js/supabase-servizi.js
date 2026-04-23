(function () {
  'use strict';

  var SUPABASE_URL = 'https://ghreisfsrmhlkstnlwgv.supabase.co';
  var SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdocmVpc2Zzcm1obGtzdG5sd2d2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NjcyNzAsImV4cCI6MjA5MjQ0MzI3MH0.WPUL0pNKsBaF6ar15HM4LVb9q_sw62a4aX7LuNQLHp4';
  var WA_BASE      = 'https://wa.me/393492401944?text=';

  // Client-side category map — covers actual DB schema (nome, prezzo, durata only)
  var CATEGORIES = [
    {
      id: 'taglio',
      nome: 'Tagli',
      icona: 'fa-solid fa-scissors',
      pattern: /^taglio/i,
      waMsg: 'Ciao!%20Vorrei%20prenotare%20un%20taglio.',
      btnLabel: 'Prenota taglio'
    },
    {
      id: 'piega',
      nome: 'Piega & Styling',
      icona: 'fa-solid fa-wand-magic-sparkles',
      pattern: /^piega/i,
      waMsg: null,
      btnLabel: null
    },
    {
      id: 'colore',
      nome: 'Colore',
      icona: 'fa-solid fa-palette',
      pattern: /^(tinta|meches|balayage|ombre|tono)/i,
      waMsg: 'Ciao!%20Vorrei%20informazioni%20sul%20colore%20capelli.',
      btnLabel: 'Chiedi preventivo'
    },
    {
      id: 'trattamenti',
      nome: 'Trattamenti Capillari',
      icona: 'fa-solid fa-leaf',
      pattern: /^(cheratina|ricostruzione|maschera|trattamento)/i,
      waMsg: null,
      btnLabel: null
    },
    {
      id: 'acconciature',
      nome: 'Acconciature',
      icona: 'fa-solid fa-crown',
      pattern: /^(acconciatura|prova)/i,
      waMsg: "Ciao!%20Sono%20una%20sposa%20e%20vorrei%20informazioni%20sull'acconciatura.",
      btnLabel: 'Contattaci per il giorno speciale'
    }
  ];

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function formatPrezzo(p) {
    if (p === 0 || p === '0' || p == null) return 'su preventivo';
    return 'da ' + p + '€';
  }

  function fetchServizi() {
    return fetch(
      SUPABASE_URL + '/rest/v1/servizi?select=*&order=id.asc',
      { headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY } }
    ).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    });
  }

  // Groups flat rows into client-side categories
  function groupByCategory(rows) {
    var groups = CATEGORIES.map(function (cat) {
      return { cat: cat, items: [] };
    });
    var ungrouped = { cat: null, items: [] };

    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      var matched = false;
      for (var j = 0; j < CATEGORIES.length; j++) {
        if (CATEGORIES[j].pattern.test(row.nome)) {
          groups[j].items.push(row);
          matched = true;
          break;
        }
      }
      if (!matched) ungrouped.items.push(row);
    }

    // Only return categories that have items; append ungrouped at the end if any
    var result = groups.filter(function (g) { return g.items.length > 0; });
    if (ungrouped.items.length > 0) {
      result.push({
        cat: { id: 'altri', nome: 'Altri Servizi', icona: 'fa-solid fa-star', waMsg: null, btnLabel: null },
        items: ungrouped.items
      });
    }
    return result;
  }

  // ── Accordion (index.html #srv-grid) ─────────────────────

  function srvItemHtml(s) {
    return '<div class="srv-item">' +
      '<div class="srv-item-left"><h4>' + esc(s.nome) + '</h4></div>' +
      '<div class="srv-item-price">' + esc(formatPrezzo(s.prezzo)) + '</div>' +
      '</div>';
  }

  function srvCtaHtml(cat) {
    if (!cat || !cat.waMsg) return '';
    return '<div class="srv-cta">' +
      '<a href="' + WA_BASE + cat.waMsg + '" class="btn btn--whatsapp" target="_blank" rel="noopener">' +
      '<i class="fa-brands fa-whatsapp"></i> ' + esc(cat.btnLabel) + '</a>' +
      '</div>';
  }

  function renderAccordion(groups, container) {
    container.innerHTML = groups.map(function (g, i) {
      var cat = g.cat;
      var id  = 'scard-dyn-' + i;
      return '<div class="srv-card" id="' + id + '">' +
        '<div class="srv-card-header" onclick="srvCard(\'' + id + '\')" role="button" aria-expanded="false" tabindex="0">' +
        '<div class="srv-card-icon"><i class="' + esc(cat.icona) + '"></i></div>' +
        '<div class="srv-card-title"><h3>' + esc(cat.nome) + '</h3>' +
        '<span class="srv-card-label">Vedi Listino →</span></div>' +
        '<i class="fa-solid fa-chevron-down srv-card-chevron" aria-hidden="true"></i>' +
        '</div>' +
        '<div class="srv-card-body"><div class="srv-card-body-inner">' +
        '<div class="srv-item-list">' + g.items.map(srvItemHtml).join('') + '</div>' +
        srvCtaHtml(cat) +
        '</div></div></div>';
    }).join('');

    container.querySelectorAll('.srv-card-header').forEach(function (h) {
      h.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); h.click(); }
      });
    });
  }

  // ── Lista completa (pages/servizi.html #servizi-sections) ──

  function renderFull(groups, container) {
    container.innerHTML = groups.map(function (g) {
      var cat = g.cat;
      var ctaHtml = '';
      if (cat && cat.waMsg) {
        ctaHtml = '<div class="cta-strip">' +
          '<a href="' + WA_BASE + cat.waMsg + '" class="btn btn--whatsapp" target="_blank" rel="noopener">' +
          '<i class="fa-brands fa-whatsapp"></i> ' + esc(cat.btnLabel) + '</a></div>';
      }
      return '<div class="category-section">' +
        '<div class="category-header">' +
        '<div class="icon"><i class="' + esc(cat.icona) + '"></i></div>' +
        '<div><h2>' + esc(cat.nome) + '</h2></div></div>' +
        '<div class="service-list">' +
        g.items.map(function (s) {
          return '<div class="service-item">' +
            '<div class="service-item-left"><h4>' + esc(s.nome) + '</h4></div>' +
            '<div class="service-price">' + esc(formatPrezzo(s.prezzo)) + '</div>' +
            '</div>';
        }).join('') +
        '</div>' + ctaHtml + '</div>';
    }).join('');
  }

  // ── Init ─────────────────────────────────────────────────

  function init() {
    var grid = document.getElementById('srv-grid');
    var full = document.getElementById('servizi-sections');
    if (!grid && !full) return;

    fetchServizi().then(function (rows) {
      if (!rows || rows.length === 0) return; // keep static HTML
      var groups = groupByCategory(rows);
      if (groups.length === 0) return;        // keep static HTML
      if (grid) renderAccordion(groups, grid);
      if (full) renderFull(groups, full);
    }).catch(function (err) {
      console.warn('[Tentazioni] Supabase servizi non disponibile, uso contenuto statico:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
