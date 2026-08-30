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
    }, { threshold: 0.25 });

    observer.observe(mockupEl);

    // Initial state setup
    applyStep(1);
  }

  // Init Homepage AI Scribe Demo
  initWorkflowController({
    mockupEl: document.getElementById('homeAIScribeMockup'),
    workflowEl: document.getElementById('scribeWorkflowSteps'),
    statusTextEl: document.getElementById('homeScribeStatusText'),
    progressFillEl: document.getElementById('homeGenProgress')
  });

  // Init Homepage AapliPuja Demo
  initWorkflowController({
    mockupEl: document.getElementById('homeAapliPujaMockup'),
    workflowEl: document.getElementById('pujaWorkflowSteps'),
    isPuja: true
  });

  // Init Product Detail Page AI Scribe Demo
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
});


