/* ============================================================
   TENTAZIONI ACCONCIATURE — Main JS
   ============================================================ */

// --- Sticky header ---
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// --- Mobile nav ---
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');
const navOverlay = document.getElementById('navOverlay');

function openNav() {
  navLinks.classList.add('open');
  navOverlay.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  navLinks.classList.remove('open');
  navOverlay.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

if (navToggle) navToggle.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeNav() : openNav();
});
if (navOverlay) navOverlay.addEventListener('click', closeNav);

// Close nav on ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });

// Close nav when a link is clicked
navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

// --- Highlight today in orari table ---
const today = new Date().getDay(); // 0=Sun, 1=Mon...
document.querySelectorAll('.orari-table tr[data-day]').forEach(row => {
  const day = parseInt(row.dataset.day, 10);
  if (day === today) row.classList.add('today');
  if (day === 0 || day === 1) row.classList.add('closed');
});

// --- Footer year ---
const yearEl = document.getElementById('footerYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();
const yearLegal = document.getElementById('footerYearLegal');
if (yearLegal) yearLegal.textContent = new Date().getFullYear();

// --- Smooth scroll for anchor links ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Intersection observer for fade-in animations ---
const fadeEls = document.querySelectorAll('.service-card, .review-card, .section-header');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
}
