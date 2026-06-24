/* =========================================
   ARTICLE.JS — Article page interactions
   Reading progress, TOC, share, animations
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. READING PROGRESS BAR
  // ============================================
  const progressBar    = document.getElementById('progress-bar');
  const progressTrack  = document.getElementById('reading-progress');
  const articleContent = document.getElementById('article-content');

  const updateProgress = () => {
    if (!articleContent || !progressBar) return;

    const contentTop    = articleContent.getBoundingClientRect().top + window.scrollY;
    const contentHeight = articleContent.offsetHeight;
    const windowHeight  = window.innerHeight;
    const scrolled      = window.scrollY + windowHeight - contentTop;
    const pct           = Math.min(Math.max((scrolled / contentHeight) * 100, 0), 100);

    progressBar.style.width = pct + '%';
    progressTrack?.setAttribute('aria-valuenow', Math.round(pct));
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // ============================================
  // 2. TABLE OF CONTENTS — Active Link Highlight
  // ============================================
  const sections  = document.querySelectorAll('.article-section[id]');
  const tocLinks  = document.querySelectorAll('.toc-link');

  const tocObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tocLinks.forEach((l) => l.classList.remove('active'));
          const active = document.querySelector(`.toc-link[href="#${entry.target.id}"]`);
          active?.classList.add('active');
        }
      });
    },
    { threshold: 0.40, rootMargin: '-80px 0px -55% 0px' }
  );

  sections.forEach((s) => tocObserver.observe(s));

  // Smooth scroll for TOC links
  tocLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (target) {
        const offset = 80 + 16;
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ============================================
  // 3. SHARE BUTTONS
  // ============================================
  const shareCopyBtn = document.getElementById('share-copy');
  const shareWaBtn   = document.getElementById('share-wa');

  shareCopyBtn?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      shareCopyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="#27AE60" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      shareCopyBtn.style.color = '#27AE60';
      shareCopyBtn.style.borderColor = '#27AE60';
      setTimeout(() => {
        shareCopyBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 10L10 6M7 4H4a2 2 0 000 4h1M9 12h3a2 2 0 000-4h-1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
        shareCopyBtn.style.color = '';
        shareCopyBtn.style.borderColor = '';
      }, 2500);
    });
  });

  shareWaBtn?.addEventListener('click', () => {
    const text = encodeURIComponent(document.title + ' — ' + window.location.href);
    window.open('https://wa.me/?text=' + text, '_blank', 'noopener,noreferrer');
  });

  // ============================================
  // 4. SCROLL-TRIGGERED ANIMATIONS
  // ============================================
  const animatedEls = document.querySelectorAll('[data-animate]');

  const animObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('animate-in'), delay);
          animObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -30px 0px' }
  );

  animatedEls.forEach((el) => animObserver.observe(el));

  // ============================================
  // 5. SYMPTOM CARD — subtle entry animation
  // ============================================
  const symptomCards = document.querySelectorAll('.symptom-card');
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, idx * 80);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  symptomCards.forEach((card) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });

  // ============================================
  // 6. SCROLL TO TOP
  // ============================================
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTopBtn?.removeAttribute('hidden');
    else scrollTopBtn?.setAttribute('hidden', '');
  }, { passive: true });
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
