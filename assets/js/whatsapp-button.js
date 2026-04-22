/* ============================================================
   TENTAZIONI ACCONCIATURE — WhatsApp Floating Button
   Number: +39 349 240 1944
   ============================================================ */

(function () {
  const WA_URL = 'https://wa.me/393492401944?text=Ciao!%20Vorrei%20prenotare%20un%20appuntamento.';

  const container = document.getElementById('whatsappBtn');
  if (!container) return;

  container.innerHTML = `
    <a href="${WA_URL}" target="_blank" rel="noopener noreferrer"
       class="wa-float" aria-label="Prenota su WhatsApp al numero +39 349 240 1944">
      <svg class="wa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.553 4.112 1.52 5.84L.057 23.885a.5.5 0 0 0 .606.606l6.044-1.463A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.878 0-3.645-.495-5.178-1.362l-.37-.213-3.827.927.943-3.826-.23-.38A9.956 9.956 0 0 1 2 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/>
      </svg>
      <span class="wa-tooltip">Prenota su WhatsApp</span>
    </a>
  `;

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    .wa-float {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 60px;
      height: 60px;
      background: #25D366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 4px 20px rgba(37,211,102,.45);
      z-index: 8000;
      transition: transform .25s ease, box-shadow .25s ease;
      text-decoration: none;
    }
    .wa-float::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: rgba(37,211,102,.25);
      animation: wa-pulse 2.2s ease-out infinite;
    }
    @keyframes wa-pulse {
      0%   { transform: scale(.85); opacity: .8; }
      70%  { transform: scale(1.4);  opacity: 0;  }
      100% { transform: scale(.85); opacity: 0;  }
    }
    .wa-float:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(37,211,102,.6);
    }
    .wa-float:hover .wa-tooltip { opacity: 1; transform: translateX(0); pointer-events: auto; }
    .wa-icon { width: 30px; height: 30px; }
    .wa-tooltip {
      position: absolute;
      right: 72px;
      background: #1A1A1A;
      color: #FDFAF6;
      font-size: .8rem;
      font-weight: 700;
      white-space: nowrap;
      padding: 7px 14px;
      border-radius: 9999px;
      opacity: 0;
      transform: translateX(8px);
      transition: opacity .2s, transform .2s;
      pointer-events: none;
      font-family: 'Lato', sans-serif;
    }
    .wa-tooltip::after {
      content: '';
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 6px solid transparent;
      border-left-color: #1A1A1A;
    }
    /* Hide on very small scrolled-down mobile */
    @media (max-width: 480px) {
      .wa-float { bottom: 16px; right: 16px; width: 54px; height: 54px; }
      .wa-icon  { width: 26px; height: 26px; }
      .wa-tooltip { display: none; }
    }
  `;
  document.head.appendChild(style);

  // Hide button when scroll is near footer
  let lastScroll = 0;
  const floatBtn = container.querySelector('.wa-float');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const nearBottom = (docHeight - scrollY) < 200;
    const scrollingDown = scrollY > lastScroll;
    lastScroll = scrollY;
    if (nearBottom || (scrollingDown && scrollY > 400)) {
      floatBtn.style.opacity = '0';
      floatBtn.style.pointerEvents = 'none';
    } else {
      floatBtn.style.opacity = '1';
      floatBtn.style.pointerEvents = 'auto';
    }
  }, { passive: true });
})();
