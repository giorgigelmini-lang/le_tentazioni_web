/* ============================================================
   TENTAZIONI ACCONCIATURE — Cookie Banner (GDPR)
   ============================================================ */

const CONSENT_KEY = 'ta_cookie_consent';

function renderBanner() {
  const banner = document.getElementById('cookieBanner');
  if (!banner) return;

  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-text">
        <p>
          Questo sito utilizza <strong>cookie tecnici</strong> necessari al funzionamento e, previo consenso,
          <strong>cookie analitici</strong> (Google Analytics 4) per migliorare l'esperienza di navigazione.
          <a href="pages/privacy-policy.html#cookie" class="cookie-link">Cookie Policy</a>
        </p>
      </div>
      <div class="cookie-actions">
        <button id="cookieReject"  class="cookie-btn cookie-btn--outline">Solo necessari</button>
        <button id="cookieAccept"  class="cookie-btn cookie-btn--primary">Accetta tutto</button>
      </div>
    </div>
  `;

  banner.classList.add('cookie-visible');

  document.getElementById('cookieAccept').addEventListener('click', () => {
    saveConsent('all');
    hideBanner();
    loadAnalytics();
  });

  document.getElementById('cookieReject').addEventListener('click', () => {
    saveConsent('necessary');
    hideBanner();
  });
}

function saveConsent(level) {
  localStorage.setItem(CONSENT_KEY, JSON.stringify({ level, date: new Date().toISOString() }));
}

function hideBanner() {
  const banner = document.getElementById('cookieBanner');
  if (banner) {
    banner.classList.remove('cookie-visible');
    banner.classList.add('cookie-hidden');
  }
}

function loadAnalytics() {
  // Replace G-XXXXXXXXXX with the real GA4 Measurement ID before going live
  const GA_ID = 'G-XXXXXXXXXX';
  if (document.querySelector(`script[src*="${GA_ID}"]`)) return;
  const s = document.createElement('script');
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  s.async = true;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

// Init
(function init() {
  const saved = localStorage.getItem(CONSENT_KEY);
  if (saved) {
    const { level } = JSON.parse(saved);
    if (level === 'all') loadAnalytics();
    return;
  }
  // Small delay so the page loads first
  setTimeout(renderBanner, 800);
})();
