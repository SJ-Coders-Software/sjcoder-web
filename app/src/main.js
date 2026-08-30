import './style.css';
import { initPage, initReveal } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  initPage();
  initReveal();

  // ===== ANIMATED COUNTERS =====
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target).toLocaleString() + (target >= 100 ? '+' : '+');
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

  // ===== PORTFOLIO FILTER =====
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.display = match ? '' : 'none';
        if (match) { item.style.opacity = '0'; setTimeout(() => item.style.opacity = '1', 50); }
      });
    });
  });

  // ===== CONTACT FORM =====
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const organization = form.querySelector('#organization').value.trim();
      const serviceSelect = form.querySelector('#service');
      const service = serviceSelect.options[serviceSelect.selectedIndex]?.text || '';
      const message = form.querySelector('#message').value.trim();

      const subject = `Website Enquiry – ${name}${organization ? ' (' + organization + ')' : ''}`;
      const body = `Hi SJ Coders Team,

Name: ${name}
Email: ${email}
Organization: ${organization || 'N/A'}
Service Interest: ${service || 'N/A'}

Message:
${message}`;

      window.location.href = `mailto:info@sjcoders.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Opening Email App...';
      btn.style.background = 'linear-gradient(135deg, #14b8a6, #06b6d4)';
      setTimeout(() => { btn.innerHTML = 'Send Message <i data-lucide="send"></i>'; btn.style.background = ''; if (window.lucide) lucide.createIcons(); }, 3000);
      form.reset();
    });
  }
  // ===== PRODUCT SHOWCASE DEMO CONTROLLERS =====
  function initWorkflowController({ mockupEl, workflowEl, statusTextEl, progressFillEl, isPuja = false }) {
    if (!mockupEl) return;

    const totalSteps = 5;
    let currentStep = 1;
    let timerId = null;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const stepStatuses = isPuja
      ? ['Find Pooja', 'Select Package', 'Select Muhurat', 'Booking Summary', 'Guruji Assigned']
      : ['Ready', 'Recording Live...', 'Generating Note...', 'Clinician Review Required', 'Approved & Sent to EHR'];

    function applyStep(step) {
      currentStep = step;

      // Update step views inside mockup
      const views = mockupEl.querySelectorAll('.scribe-step-view, .puja-step-view');
      views.forEach(v => {
        v.classList.toggle('active', parseInt(v.dataset.step) === step);
      });

      // Update horizontal workflow step highlights
      if (workflowEl) {
        const steps = workflowEl.querySelectorAll('.workflow-step');
        steps.forEach(s => {
          s.classList.toggle('active', parseInt(s.dataset.step) === step);
        });
      }

      // Update status text pill if available
      if (statusTextEl && stepStatuses[step - 1]) {
        statusTextEl.textContent = stepStatuses[step - 1];
      }

      // Handle progress bar animation on Step 3 (Generating Note)
      if (progressFillEl) {
        if (step === 3) {
          progressFillEl.style.width = '0%';
          setTimeout(() => { progressFillEl.style.width = '100%'; }, 50);
        } else {
          progressFillEl.style.width = '0%';
        }
      }
    }

    function advance() {
      const next = currentStep >= totalSteps ? 1 : currentStep + 1;
      applyStep(next);
    }

    function start() {
      if (prefersReduced) {
        applyStep(5);
        return;
      }
      if (!timerId) {
        timerId = setInterval(advance, 2400);
      }
    }

    function stop() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    // Allow clicking "Start AI Scribe" button inside mockup
    const startBtn = mockupEl.querySelector('.btn-start-scribe');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        stop();
        advance();
      });
    }

    // Allow clicking individual step buttons
    if (workflowEl) {
      const stepEls = workflowEl.querySelectorAll('.workflow-step');
      stepEls.forEach(stepEl => {
        stepEl.addEventListener('click', () => {
          const stepNum = parseInt(stepEl.dataset.step);
          if (stepNum) {
            stop();
            applyStep(stepNum);
          }
        });
      });
    }

    // Viewport IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) start();
        else stop();
      });
    }, { threshold: 0.15 });

    observer.observe(mockupEl);

    // Initial state setup
    applyStep(1);
  }

  // ===== COMPANY CAPABILITY ECOSYSTEM CONTROLLER =====
  function initEcosystemController() {
    const ecosystemEl = document.getElementById('companyEcosystem');
    if (!ecosystemEl) return;

    const nodes = ecosystemEl.querySelectorAll('.capability-node');
    if (nodes.length === 0) return;

    let step = 1;
    let timerId = null;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function applyState(s) {
      step = s;
      if (s <= 4) {
        nodes.forEach(n => {
          n.classList.toggle('active', parseInt(n.dataset.node) === s);
        });
      } else {
        // Step 5: Settle into all active
        nodes.forEach(n => n.classList.add('active'));
      }
    }

    function advance() {
      const next = step >= 5 ? 1 : step + 1;
      applyState(next);
    }

    function start() {
      if (prefersReduced) {
        applyState(5);
        return;
      }
      if (!timerId) {
        timerId = setInterval(advance, 1800);
      }
    }

    function stop() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) start();
        else stop();
      });
    }, { threshold: 0.2 });

    observer.observe(ecosystemEl);
    applyState(1);
  }

  initEcosystemController();

  // ===== RE-INIT PRODUCT SHOWCASE DEMOS =====
  initWorkflowController({
    mockupEl: document.getElementById('homeAIScribeMockup'),
    workflowEl: document.getElementById('scribeWorkflowSteps'),
    statusTextEl: document.getElementById('homeScribeStatusText'),
    progressFillEl: document.getElementById('homeGenProgress')
  });

  initWorkflowController({
    mockupEl: document.getElementById('homeAapliPujaMockup'),
    workflowEl: document.getElementById('pujaWorkflowSteps'),
    isPuja: true
  });

  initWorkflowController({
    mockupEl: document.getElementById('aiScribeDetailMockup'),
    workflowEl: document.getElementById('detailAIScribeWorkflow'),
    statusTextEl: document.getElementById('scribeDetailStatusText'),
    progressFillEl: document.getElementById('detailGenProgress')
  });

  // ===== HERO CAROUSEL CONTROLLER =====
  function initHeroCarousel() {
    const wrapper = document.getElementById('heroSlidesWrapper');
    if (!wrapper) return;

    const slides = wrapper.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#heroCarouselDots .dot');
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');
    if (slides.length === 0) return;

    let currentIndex = 0;
    let carouselTimer = null;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentIndex = index;

      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });

      const heroSec = document.getElementById('hero');
      if (heroSec) {
        heroSec.setAttribute('data-theme', index === 0 ? 'amber' : (index === 1 ? 'violet' : 'cyan'));
      }
    }

    function startAutoPlay() {
      if (!carouselTimer) {
        carouselTimer = setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 6000);
      }
    }

    function stopAutoPlay() {
      if (carouselTimer) {
        clearInterval(carouselTimer);
        carouselTimer = null;
      }
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(currentIndex - 1);
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(currentIndex + 1);
        startAutoPlay();
      });
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoPlay();
        goToSlide(i);
        startAutoPlay();
      });
    });

    // Touch Swipe Support for Mobile Devices
    let touchStartX = 0;
    let touchEndX = 0;
    wrapper.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 40) {
        stopAutoPlay();
        if (diff > 0) goToSlide(currentIndex + 1);
        else goToSlide(currentIndex - 1);
        startAutoPlay();
      }
    }, { passive: true });

    startAutoPlay();
  }

  // ===== AAPLIPUJA LIGHTBOX CONTROLLER =====
  function initPoojaLightbox() {
    const cards = document.querySelectorAll('.photo-card[data-lightbox-src], .pooja-card[data-lightbox-src]');
    if (cards.length === 0) return;

    let lightboxEl = document.getElementById('poojaLightbox');
    if (!lightboxEl) {
      lightboxEl = document.createElement('div');
      lightboxEl.id = 'poojaLightbox';
      lightboxEl.className = 'pooja-lightbox';
      lightboxEl.setAttribute('role', 'dialog');
      lightboxEl.setAttribute('aria-label', 'Image preview');
      lightboxEl.innerHTML = `
        <div class="lightbox-content">
          <button class="lightbox-close" id="lightboxClose" aria-label="Close image preview">&times;</button>
          <button class="lightbox-nav lightbox-prev" id="lightboxPrev" aria-label="Previous image">&#10094;</button>
          <button class="lightbox-nav lightbox-next" id="lightboxNext" aria-label="Next image">&#10095;</button>
          <img id="lightboxImg" src="" alt="Enlarged Pooja Experience">
          <div class="lightbox-caption" id="lightboxCaption"></div>
        </div>
      `;
      document.body.appendChild(lightboxEl);
    }

    const imgEl = lightboxEl.querySelector('#lightboxImg');
    const captionEl = lightboxEl.querySelector('#lightboxCaption');
    const closeBtn = lightboxEl.querySelector('#lightboxClose');
    const prevBtn = lightboxEl.querySelector('#lightboxPrev');
    const nextBtn = lightboxEl.querySelector('#lightboxNext');

    let items = Array.from(cards).map(card => ({
      src: card.dataset.lightboxSrc,
      caption: card.dataset.caption || card.querySelector('.photo-caption strong')?.textContent || ''
    }));
    let currentIndex = 0;

    function openAt(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      currentIndex = index;

      imgEl.src = items[currentIndex].src;
      captionEl.textContent = items[currentIndex].caption;
      lightboxEl.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function close() {
      lightboxEl.classList.remove('active');
      document.body.style.overflow = '';
    }

    cards.forEach((card, idx) => {
      card.style.cursor = 'pointer';
      card.addEventListener('click', (e) => {
        e.preventDefault();
        openAt(idx);
      });
    });

    window.openLightbox = openAt;

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); openAt(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); openAt(currentIndex + 1); });

    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightboxEl.classList.contains('active')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') openAt(currentIndex - 1);
      if (e.key === 'ArrowRight') openAt(currentIndex + 1);
    });
  }

  initPoojaLightbox();

  initHeroCarousel();

  // ===== INTERACTIVE ROI CALCULATOR =====
  function initRoiCalculator() {
    const doctorsSlider = document.getElementById('calcDoctors');
    const patientsSlider = document.getElementById('calcPatients');
    const docVal = document.getElementById('calcDoctorsVal');
    const patVal = document.getElementById('calcPatientsVal');
    const hoursSavedEl = document.getElementById('calcHoursSaved');
    const moneySavedEl = document.getElementById('calcMoneySaved');

    if (!doctorsSlider || !patientsSlider) return;

    function updateCalculations() {
      const docs = parseInt(doctorsSlider.value, 10);
      const pats = parseInt(patientsSlider.value, 10);

      if (docVal) docVal.textContent = docs;
      if (patVal) patVal.textContent = pats;

      // 4.5 minutes saved per patient encounter, 5 days/week
      const totalMinutesSaved = docs * pats * 4.5 * 5;
      const hoursSavedPerWeek = Math.round(totalMinutesSaved / 60);
      const annualSavings = Math.round(hoursSavedPerWeek * 52 * 55);

      if (hoursSavedEl) hoursSavedEl.textContent = `${hoursSavedPerWeek} hrs/wk`;
      if (moneySavedEl) moneySavedEl.textContent = `$${annualSavings.toLocaleString()}/yr`;
    }

    doctorsSlider.addEventListener('input', updateCalculations);
    patientsSlider.addEventListener('input', updateCalculations);
    updateCalculations();
  }

  initRoiCalculator();

  // ===== AAPLIPUJA MOBILE DEMO 6-STEP CONTROLLER =====
  function initPujaMobileDemo() {
    const screensContainer = document.getElementById('pujaDemoScreens');
    const dotsContainer = document.getElementById('pujaDemoProgress');
    if (!screensContainer || !dotsContainer) return;

    const totalSteps = 6;
    let currentStep = 1;
    let timerId = null;

    function setStep(step) {
      currentStep = step;
      const screens = screensContainer.querySelectorAll('.demo-screen');
      const dots = dotsContainer.querySelectorAll('.step-dot');

      screens.forEach(s => s.classList.toggle('active', parseInt(s.dataset.step) === step));
      dots.forEach(d => d.classList.toggle('active', parseInt(d.dataset.step) === step));
    }

    function advance() {
      const next = currentStep >= totalSteps ? 1 : currentStep + 1;
      setStep(next);
    }

    function startAuto() {
      if (!timerId) {
        timerId = setInterval(advance, 2200);
      }
    }

    function stopAuto() {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    const dots = dotsContainer.querySelectorAll('.step-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const step = parseInt(dot.dataset.step);
        if (step) {
          stopAuto();
          setStep(step);
        }
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) startAuto();
        else stopAuto();
      });
    }, { threshold: 0.2 });

    observer.observe(screensContainer);
    setStep(1);
  }

  initPujaMobileDemo();

  // ===== FAQ ACCORDION CONTROLLER =====
  function initFaqAccordion() {
    const triggers = document.querySelectorAll('.faq-trigger');
    triggers.forEach(trig => {
      trig.addEventListener('click', () => {
        const item = trig.closest('.faq-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach(openItem => {
          if (openItem !== item) openItem.classList.remove('open');
        });

        item.classList.toggle('open', !isOpen);
      });
    });
  }

  initFaqAccordion();

  // ===== MOBILE STICKY CTA SHOW/HIDE =====
  function initStickyCta() {
    const stickyCta = document.getElementById('mobileStickyCta');
    if (!stickyCta) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        stickyCta.style.display = 'block';
      } else {
        stickyCta.style.display = 'none';
      }
    }, { passive: true });
  }

  initStickyCta();
});



