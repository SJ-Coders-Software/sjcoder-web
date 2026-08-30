// Shared behavior used across every page (index.html, careers.html, ...)

export function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 200) current = s.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });
}

export function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navLinks');
  if (!hamburger || !navMenu) return;

  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  function toggleMenu(show) {
    const isOpen = show !== undefined ? show : !navMenu.classList.contains('open');
    hamburger.classList.toggle('active', isOpen);
    navMenu.classList.toggle('open', isOpen);
    overlay.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  overlay.addEventListener('click', () => {
    toggleMenu(false);
  });

  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggleMenu(false);
    });
  });
}

export function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

export function initPage() {
  if (window.lucide) lucide.createIcons();
  initNavbar();
  initHamburger();
  initSmoothScroll();
}
