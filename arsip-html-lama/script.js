/* =========================================
   AKUTEMANMU — JavaScript
   Interactions, animations & accessibility
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // =============================
  // 1. NAVBAR — Scroll behavior
  // =============================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  const handleNavbarScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  };

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll(); // run once on load

  // =============================
  // 2. MOBILE MENU — Hamburger
  // =============================
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu   = document.getElementById('mobile-menu');

  const toggleMobileMenu = () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburgerBtn?.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when a link is clicked
  mobileMenu?.querySelectorAll('.mobile-link, .mobile-btn').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && mobileMenu?.classList.contains('open')) {
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  });

  // =============================
  // 3. FAQ ACCORDION
  // =============================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    button?.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      faqItems.forEach((fi) => {
        fi.classList.remove('open');
        fi.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle this one
      if (!isOpen) {
        item.classList.add('open');
        button.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard: Enter/Space support (already handled by button, but let's be safe)
    button?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // =============================
  // 4. SCROLL-TRIGGERED ANIMATIONS
  // =============================
  const animatedEls = document.querySelectorAll('[data-animate]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => {
            el.classList.add('animate-in');
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animatedEls.forEach((el) => observer.observe(el));

  // =============================
  // 5. SCROLL TO TOP BUTTON
  // =============================
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn?.removeAttribute('hidden');
    } else {
      scrollTopBtn?.setAttribute('hidden', '');
    }
  }, { passive: true });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // =============================
  // 6. ACTIVE NAV LINK on SCROLL
  // =============================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -60% 0px' }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  // =============================
  // 7. SMOOTH COUNTER ANIMATION
  //    (Trust stats in hero)
  // =============================
  const counters = {
    'trust-1': { target: 50000, suffix: 'K+', divisor: 1000, label: 'Pengguna Aktif' },
    'trust-2': { target: 200, suffix: '+', divisor: 1, label: 'Psikolog Bersertifikat' },
  };

  const counterEls = {};
  Object.keys(counters).forEach((id) => {
    const el = document.getElementById(id);
    if (el) counterEls[id] = el.querySelector('.trust-num');
  });

  let countersStarted = false;

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
        }
      },
      { threshold: 0.3 }
    );
    heroObserver.observe(heroSection);
  }

  function animateCounters() {
    Object.entries(counters).forEach(([id, config]) => {
      const el = counterEls[id];
      if (!el) return;

      const duration = 1800;
      const startTime = performance.now();

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = Math.round(eased * config.target);

        if (config.divisor > 1) {
          el.textContent = Math.round(current / config.divisor) + config.suffix;
        } else {
          el.textContent = current + config.suffix;
        }

        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });
  }

  // =============================
  // 8. RIPPLE EFFECT on buttons
  // =============================
  const rippleButtons = document.querySelectorAll('.btn-primary, .btn-white');

  rippleButtons.forEach((btn) => {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height) * 2;

      Object.assign(ripple.style, {
        position: 'absolute',
        width: size + 'px',
        height: size + 'px',
        left: (x - size / 2) + 'px',
        top: (y - size / 2) + 'px',
        background: 'rgba(255,255,255,0.25)',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple-anim 0.5s ease-out forwards',
        pointerEvents: 'none',
        zIndex: '0',
      });

      // Ensure button text is above ripple
      btn.querySelectorAll(':not(span)').forEach((child) => {
        if (child.style) child.style.position = 'relative';
        if (child.style) child.style.zIndex = '1';
      });

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple keyframe dynamically
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(1); opacity: 0; }
      }
      .nav-link.active {
        color: var(--blue-500);
        background: var(--blue-50);
      }
    `;
    document.head.appendChild(style);
  }

  // =============================
  // 9. MARQUEE pause on hover
  // =============================
  const logoSlide = document.querySelector('.logos-slide');
  const logosTrack = document.querySelector('.logos-track');

  if (logoSlide && logosTrack) {
    logosTrack.addEventListener('mouseenter', () => {
      logoSlide.style.animationPlayState = 'paused';
    });
    logosTrack.addEventListener('mouseleave', () => {
      logoSlide.style.animationPlayState = 'running';
    });
  }

  // =============================
  // 10. SERVICE CARD subtle parallax glow
  // =============================
  const serviceCards = document.querySelectorAll('.service-card:not(.service-card--featured)');

  serviceCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 10;
      card.style.transform = `perspective(800px) rotateX(${-y * 0.5}deg) rotateY(${x * 0.5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease, box-shadow 0.3s ease, border-color 0.3s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });

});
