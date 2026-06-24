/* =========================================
   BLOG.JS — Blog page interactions
   Filter, Search, Newsletter, Animations
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================
  // 1. CATEGORY FILTER TABS
  // ============================================
  const filterTabs = document.querySelectorAll('.filter-tab');
  const posts      = document.querySelectorAll('#posts-grid .blog-card');
  const postCount  = document.getElementById('post-count');
  const emptyState = document.getElementById('empty-state');
  let   activeFilter = 'all';

  function applyFilters() {
    const searchQuery = (document.getElementById('blog-search')?.value || '').toLowerCase().trim();
    let visible = 0;

    posts.forEach((post) => {
      const cat  = post.dataset.cat || '';
      const text = post.innerText.toLowerCase();

      const catMatch    = activeFilter === 'all' || cat === activeFilter;
      const searchMatch = searchQuery === '' || text.includes(searchQuery);
      const show        = catMatch && searchMatch;

      if (show) {
        post.classList.remove('hidden');
        post.classList.add('fade-enter');
        post.addEventListener('animationend', () => post.classList.remove('fade-enter'), { once: true });
        visible++;
      } else {
        post.classList.add('hidden');
        post.classList.remove('fade-enter');
      }
    });

    // Update count label
    if (postCount) {
      postCount.textContent = `Menampilkan ${visible} artikel`;
    }

    // Show/hide empty state
    if (emptyState) {
      emptyState.hidden = visible > 0;
    }
  }

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => {
        t.classList.remove('filter-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('filter-tab--active');
      tab.setAttribute('aria-selected', 'true');
      activeFilter = tab.dataset.cat || 'all';
      applyFilters();
    });
  });

  // ============================================
  // 2. SEARCH
  // ============================================
  const searchInput = document.getElementById('blog-search');
  let searchDebounce;

  searchInput?.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(applyFilters, 220);
  });

  // Empty state reset button
  document.getElementById('empty-reset-btn')?.addEventListener('click', () => {
    // Reset filter
    filterTabs.forEach((t) => {
      t.classList.remove('filter-tab--active');
      t.setAttribute('aria-selected', 'false');
    });
    document.getElementById('tab-all')?.classList.add('filter-tab--active');
    document.getElementById('tab-all')?.setAttribute('aria-selected', 'true');
    activeFilter = 'all';

    // Reset search
    if (searchInput) searchInput.value = '';

    applyFilters();
  });

  // ============================================
  // 3. NEWSLETTER FORM
  // ============================================
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterBtn  = document.getElementById('newsletter-submit-btn');

  newsletterForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput?.value.trim();

    if (!email || !email.includes('@')) {
      emailInput?.focus();
      emailInput?.classList.add('input-error');
      return;
    }

    emailInput?.classList.remove('input-error');

    // Simulate success
    if (newsletterBtn) {
      newsletterBtn.textContent = '✓ Berhasil!';
      newsletterBtn.style.background = '#27AE60';
      newsletterBtn.style.color = '#fff';
      newsletterBtn.disabled = true;
      if (emailInput) emailInput.value = '';

      setTimeout(() => {
        newsletterBtn.textContent = 'Berlangganan';
        newsletterBtn.style.background = '';
        newsletterBtn.style.color = '';
        newsletterBtn.disabled = false;
      }, 3500);
    }
  });

  // ============================================
  // 4. SMOOTH CARD HOVER PARALLAX (blog page)
  // ============================================
  const blogCards = document.querySelectorAll('.blog-card:not(.featured-post-card)');

  blogCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

  // ============================================
  // 5. SCROLL-TRIGGERED ANIMATIONS (blog page)
  // ============================================
  const animatedEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('animate-in'), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.10, rootMargin: '0px 0px -30px 0px' }
  );

  animatedEls.forEach((el) => observer.observe(el));

  // ============================================
  // 6. SCROLL TO TOP (shared via script.js too)
  // ============================================
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTopBtn?.removeAttribute('hidden');
    else scrollTopBtn?.setAttribute('hidden', '');
  }, { passive: true });
  scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

});
