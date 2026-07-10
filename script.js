/* ============================================================
   VELORA VISUALS — script.js
   By Tuhin Nayak
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── LOADER ─────────────────────────────────────────────────
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loader-progress');

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroReveal();
      }, 400);
    }
    loaderProgress.style.width = progress + '%';
  }, 80);

  document.body.style.overflow = 'hidden';

  function triggerHeroReveal() {
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 120);
    });
  }


  // ── CUSTOM CURSOR ───────────────────────────────────────────
  const cursor = document.getElementById('cursor');
  const cursorDot = document.getElementById('cursor-dot');
  let mouseX = 0, mouseY = 0;
  let curX = 0, curY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animateCursor() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    cursor.style.left = curX + 'px';
    cursor.style.top = curY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Delegated so it still works on portfolio cards/items rendered dynamically after this runs
  const hoverTargets = 'a, button, .portfolio-item, .category-card, .service-card, input, select, textarea';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.add('hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) cursor.classList.remove('hover');
  });


  // ── NAVBAR SCROLL ───────────────────────────────────────────
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });


  // ── MOBILE MENU ─────────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navLinkItems = navLinks.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });


  // ── SCROLL REVEAL ───────────────────────────────────────────
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => {
    // Skip hero reveals (handled separately)
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });


  // ── PORTFOLIO: "ALL" CATEGORY CARDS + PER-CATEGORY GALLERY ──
  //
  // HOW TO ADD PHOTOS (no code editing needed for the images themselves):
  //   1. Put photos inside: assets/portfolio/<folder>/
  //   2. Name ONE photo "cover" (cover.jpg / cover.png / cover.jpeg — any of
  //      these extensions work) → that one automatically becomes the preview
  //      photo shown on the "All" tab and at the top of that category's gallery.
  //   3. Name the rest simply 1, 2, 3, 4 ... (1.jpg, 2.jpg, 3.png, etc. — mixed
  //      extensions are fine, the site auto-detects each one).
  //   4. Update the "count" number below to match how many numbered photos
  //      (NOT counting cover) you placed in that folder. That's the only
  //      code change needed when you add more photos.
  const portfolioConfig = {
    wedding:       { label: 'Wedding',        folder: 'wedding',       count: 10 },
    prewedding:    { label: 'Pre Wedding',    folder: 'prewedding',    count: 16 },
    postwedding:   { label: 'Post Wedding',   folder: 'postwedding',   count: 3 },
    anniversary:   { label: 'Anniversary',    folder: 'anniversary',   count: 2 },
    newbornbaby:   { label: 'New Born Baby',  folder: 'newbornbaby',  count: 2 },
    babyshower:    { label: 'Baby Shower',    folder: 'babyshower',   count: 2 },
    corporate:     { label: 'Corporate',      folder: 'corporate',    count: 2 },
    birthday:      { label: 'Birthday',       folder: 'birthday',     count: 2 },
    upanayan:      { label: 'Upanayan',       folder: 'upanayan',     count: 3 },
    advertisement: { label: 'Advertisement',  folder: 'advertisement',count: 2 },
  };

  // Extensions tried in this order for every photo (cover + numbered).
  const PHOTO_EXTENSIONS = ['jpg', 'jpeg', 'png', 'JPG', 'PNG'];

  function buildPortfolioData(config) {
    const data = {};
    Object.keys(config).forEach(key => {
      const { label, folder, count } = config[key];
      const items = [
        { base: `assets/portfolio/${folder}/cover`, alt: `${label} Cover`, caption: label, featured: true }
      ];
      for (let i = 1; i <= count; i++) {
        items.push({ base: `assets/portfolio/${folder}/${i}`, alt: `${label} Photo ${i}`, caption: label });
      }
      data[key] = { label, items };
    });
    return data;
  }

  const portfolioData = buildPortfolioData(portfolioConfig);

  // Tries cover/1/2.. as .jpg, then .jpeg, then .png, etc. If every extension
  // fails (photo not uploaded yet), the <img> quietly removes itself so the
  // card just shows the dark placeholder background instead of a broken icon.
  window.handlePortfolioImgError = function (img) {
    const tried = img.dataset.tried ? parseInt(img.dataset.tried, 10) : 0;
    if (tried < PHOTO_EXTENSIONS.length) {
      img.dataset.tried = tried + 1;
      img.src = `${img.dataset.base}.${PHOTO_EXTENSIONS[tried]}`;
    } else {
      const item = img.closest('.portfolio-item, .category-card');
      img.remove();
      // No real photo uploaded yet for this slot — the CSS default
      // (260px square placeholder box) already looks fine, nothing to do.
    }
  };

  function imgTag(item, altText) {
    return `<img data-base="${item.base}" src="${item.base}.${PHOTO_EXTENSIONS[0]}" alt="${altText}" loading="lazy" onerror="handlePortfolioImgError(this)" />`;
  }

  const filterBtns = document.querySelectorAll('.filter-btn');
  const categoriesWrap = document.getElementById('portfolio-categories');
  const galleryWrap = document.getElementById('portfolio-gallery');
  const galleryScroll = document.querySelector('.portfolio-grid-scroll');
  const galleryGrid = document.getElementById('portfolio-grid');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryBack = document.getElementById('gallery-back');

  function getFeatured(key) {
    const cat = portfolioData[key];
    return cat.items.find(i => i.featured) || cat.items[0];
  }

  function renderCategories() {
    categoriesWrap.innerHTML = Object.keys(portfolioData).map(key => {
      const cat = portfolioData[key];
      const feat = getFeatured(key);
      return `
        <div class="category-card" data-category="${key}" tabindex="0" role="button" aria-label="View ${cat.label} gallery">
          ${imgTag(feat, cat.label)}
          <div class="category-overlay">
            <h3>${cat.label}</h3>
            <span class="category-cta">View Gallery →</span>
          </div>
        </div>`;
    }).join('');
  }

  function renderGallery(key) {
    const cat = portfolioData[key];
    galleryTitle.textContent = cat.label;
    galleryGrid.innerHTML = cat.items.map(item => `
      <div class="portfolio-item">
        ${imgTag(item, item.alt)}
        <div class="portfolio-overlay"><span>${item.caption}</span></div>
      </div>`).join('');
  }

  function setActiveFilter(filter) {
    filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  }

  function showAll() {
    categoriesWrap.hidden = false;
    galleryWrap.hidden = true;
    setActiveFilter('all');
    document.body.classList.remove('gallery-open');
    document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showCategory(key) {
    if (!portfolioData[key]) return;
    categoriesWrap.hidden = true;
    galleryWrap.hidden = false;
    renderGallery(key);
    setActiveFilter(key);
    document.body.classList.add('gallery-open');
    if (galleryScroll) galleryScroll.scrollTop = 0;
  }

  renderCategories();

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      if (filter === 'all') showAll();
      else showCategory(filter);
    });
  });

  categoriesWrap.addEventListener('click', (e) => {
    const card = e.target.closest('.category-card');
    if (card) showCategory(card.dataset.category);
  });

  categoriesWrap.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.category-card');
    if (card) {
      e.preventDefault();
      showCategory(card.dataset.category);
    }
  });

  galleryBack.addEventListener('click', showAll);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !galleryWrap.hidden) showAll();
  });


  // ── BOOKING FORM ────────────────────────────────────────────
  // Paste the Google Apps Script "Web app URL" here after deploying
  // google-apps-script/Code.gs (see the setup steps inside that file).
  // Until you do, the form will still show a success message to the
  // visitor, but nothing will actually be sent anywhere.
  const GAS_ENDPOINT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';

  const bookingForm = document.getElementById('booking-form');
  const formSuccess = document.getElementById('form-success');

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = bookingForm.querySelector('[name="name"]').value.trim();
    const phone = bookingForm.querySelector('[name="phone"]').value.trim();
    const service = bookingForm.querySelector('[name="service"]').value;
    const date = bookingForm.querySelector('[name="date"]').value;

    if (!name || !phone || !service || !date) {
      shakeForm();
      return;
    }

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').textContent = 'Sending...';

    const formData = new FormData(bookingForm);

    const finishUp = () => {
      bookingForm.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').textContent = 'Send Booking Request';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    };

    if (!GAS_ENDPOINT_URL || GAS_ENDPOINT_URL.includes('PASTE_YOUR')) {
      // Not wired up yet — just simulate so the site still feels complete
      // during development. Replace GAS_ENDPOINT_URL above to go live.
      setTimeout(finishUp, 1200);
      return;
    }

    // Google Apps Script Web Apps don't send CORS headers back, so the
    // browser can't read the response — but the request itself still
    // reaches the script and gets processed (row added + email sent).
    // 'no-cors' mode is the standard way to call this kind of endpoint.
    fetch(GAS_ENDPOINT_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData
    })
      .then(finishUp)
      .catch(finishUp); // still confirm to the visitor; the request was sent either way
  });

  function shakeForm() {
    const wrap = document.querySelector('.booking-form-wrap');
    wrap.style.animation = 'none';
    wrap.offsetHeight; // reflow
    wrap.style.animation = 'shake 0.4s ease';
  }


  // ── SMOOTH ACTIVE NAV ───────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));


  // ── PARALLAX HERO ───────────────────────────────────────────
  const heroImg = document.querySelector('.hero-img');

  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
      }
    }, { passive: true });
  }


  // ── ADD SHAKE KEYFRAMES ─────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100%{transform:translateX(0)}
      20%{transform:translateX(-6px)}
      40%{transform:translateX(6px)}
      60%{transform:translateX(-4px)}
      80%{transform:translateX(4px)}
    }
    @keyframes fadeIn {
      from{opacity:0;transform:scale(0.97)}
      to{opacity:1;transform:scale(1)}
    }
    .active-link {
      color: var(--gold) !important;
    }
    .active-link::after {
      transform: scaleX(1) !important;
      background: var(--gold) !important;
    }
  `;
  document.head.appendChild(style);


  // ── TESTIMONIALS AUTO-SCROLL (mobile) ───────────────────────
  let testimonialIdx = 0;
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  function isMobile() { return window.innerWidth < 768; }

  function autoScrollTestimonials() {
    if (!isMobile() || testimonialCards.length === 0) return;
    testimonialCards.forEach((c, i) => {
      c.style.display = i === testimonialIdx ? 'block' : 'none';
    });
    testimonialIdx = (testimonialIdx + 1) % testimonialCards.length;
  }

  // Only activate on mobile after resize check
  window.addEventListener('resize', () => {
    if (!isMobile()) {
      testimonialCards.forEach(c => c.style.display = '');
    }
  });

  if (isMobile()) {
    setInterval(autoScrollTestimonials, 4000);
    autoScrollTestimonials();
  }

});
