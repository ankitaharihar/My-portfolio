const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;

function setTheme(theme) {
  root.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(saved || (prefersDark ? 'dark' : 'light'));
})();

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
});

// ===================== MOBILE NAV =====================
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !expanded);
  navMenu.classList.toggle('open');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===================== ACTIVE LINK HIGHLIGHT =====================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
    }
  });
}, { root: null, threshold: 0.5 });

sections.forEach(section => observer.observe(section));

// ===================== SCROLL REVEAL =====================
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObserver.observe(el));

// ===================== CONTACT FORM (CLIENT-SIDE) =====================
const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

form.addEventListener('submit', e => {
  e.preventDefault();

  // basic validation
  let valid = true;
  statusEl.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  clearErrors();

  if (!name) setError('name', 'Name is required');
  if (!email) setError('email', 'Email is required');
  else if (!emailRegex.test(email)) setError('email', 'Enter a valid email');
  if (!message) setError('message', 'Message is required');

  valid = !document.querySelector('.form-group .error:not(:empty)');

  if (!valid) return;

  // simulate success (replace with fetch to your backend/EmailJS/etc.)
  statusEl.textContent = 'Thanks! Your message has been sent (simulated).';
  form.reset();
});

function setError(field, msg) {
  const el = form.querySelector(`#${field} ~ .error`);
  if (el) el.textContent = msg;
}

function clearErrors() {
  form.querySelectorAll('.error').forEach(e => e.textContent = '');
}
