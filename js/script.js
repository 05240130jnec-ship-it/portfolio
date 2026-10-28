// ---------- Dark / light theme ----------
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');
const moon = '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>';
const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>';

function applyTheme(theme) {
  root.setAttribute('data-theme', theme);
  themeIcon.innerHTML = theme === 'dark' ? sun : moon;
  themeBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  try { localStorage.setItem('theme', theme); } catch (e) {}
}

let savedTheme = 'light';
try { savedTheme = localStorage.getItem('theme') || 'light'; } catch (e) {}
applyTheme(savedTheme);
themeBtn.addEventListener('click', () => applyTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

// ---------- Header changes colour after scrolling + back-to-top button ----------
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 60);
  toTop.classList.toggle('show', window.scrollY > 600);
}
window.addEventListener('scroll', onScroll);
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0 }));

// ---------- Mobile menu ----------
const menu = document.getElementById('menu');
const burger = document.getElementById('burger');
burger.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
}));

// ---------- Highlight the section ----------
const sections = document.querySelectorAll('main section');
const navLinks = menu.querySelectorAll('a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// ---------- Typing effect in the home section ----------
const words = ['Networking Student', 'Web Developer', 'Linux Learner', 'Future Network Engineer'];
const typing = document.getElementById('typing');
let wordIndex = 0, letterIndex = 0, deleting = false;
function type() {
  const word = words[wordIndex];
  typing.textContent = word.slice(0, letterIndex);
  if (!deleting && letterIndex < word.length) letterIndex++;
  else if (deleting && letterIndex > 0) letterIndex--;
  else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
  }
  const delay = deleting ? 50 : (letterIndex === word.length ? 1500 : 100);
  setTimeout(type, delay);
}
type();

// ---------- Fade sections scroll ----------
const revealer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      revealer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealer.observe(el));

// ---------- Skill filters ----------
const filters = document.querySelectorAll('.filter');
filters.forEach(btn => btn.addEventListener('click', () => {
  filters.forEach(b => b.setAttribute('aria-pressed', b === btn));
  const show = btn.dataset.show;
  document.querySelectorAll('.skill-group').forEach(group => {
    group.hidden = show !== 'all' && group.dataset.group !== show;
  });
}));

// ---------- Contact form checks ----------
const form = document.getElementById('contactForm');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter an email address like name@example.com.',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};
form.addEventListener('submit', e => {
  e.preventDefault();
  let allGood = true;
  for (const id in rules) {
    const input = document.getElementById(id);
    const result = rules[id](input.value);
    const ok = result === true;
    document.getElementById(id + '-err').textContent = ok ? '' : result;
    input.classList.toggle('invalid', !ok);
    input.setAttribute('aria-invalid', !ok);
    if (!ok) allGood = false;
  }
  const sent = document.getElementById('sent');
  if (allGood) {
    sent.textContent = 'Message sent. Thank you, ' + document.getElementById('name').value.trim() + '!';
    form.reset();
  } else {
    sent.textContent = '';
  }
});

// ---------- Current year in the footer ----------
document.getElementById('year').textContent = new Date().getFullYear();