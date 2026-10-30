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

// ---------- Contact form: check the fields, then send the message to my email ----------
// Messages are delivered by FormSubmit (formsubmit.co), a free service for static sites.
const MY_EMAIL = 'chungkuwangmo6@gmail.com';
const form = document.getElementById('contactForm');
const sendBtn = document.getElementById('sendBtn');
const sent = document.getElementById('sent');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter an email address like name@example.com.',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};

form.addEventListener('submit', async e => {
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
  if (!allGood) { sent.textContent = ''; return; }

  const name = document.getElementById('name').value.trim();
  sendBtn.disabled = true;
  sendBtn.textContent = 'Sending...';
  sent.style.color = '';
  sent.textContent = '';

  try {
    const response = await fetch('https://formsubmit.co/ajax/' + MY_EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name: name,
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim(),
        _subject: 'New message from your portfolio',
        _template: 'table'
      })
    });
    const data = await response.json();
    if (!response.ok || data.success === 'false' || data.success === false) throw new Error(data.message);
    sent.textContent = 'Message sent. Thank you, ' + name + '!';
    form.reset();
  } catch (err) {
    sent.style.color = '#e11d48';
    sent.textContent = 'Your message could not be sent. Please email me directly at ' + MY_EMAIL + '.';
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = 'Send message';
  }
});

// ---------- Current year in the footer ----------
document.getElementById('year').textContent = new Date().getFullYear();
/* =========================================================
   CREATIVE ANIMATIONS
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Hide the loading screen once the page is ready ----------
const loader = document.getElementById('loader');
window.addEventListener('load', () => setTimeout(() => loader.classList.add('done'), reduceMotion ? 0 : 1200));
setTimeout(() => loader.classList.add('done'), 4000); // safety: never block the page

// ---------- Split the name into letters so each one animates in ----------
document.querySelectorAll('.split').forEach(el => {
  let delay = 0.3;
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = parts.map(part =>
    part.trim().split(' ').map(word =>
      '<span class="word" aria-hidden="true">' + [...word].map(ch => {
        const span = `<span class="char" style="animation-delay:${delay.toFixed(2)}s">${ch}</span>`;
        delay += 0.04;
        return span;
      }).join('') + '</span>'
    ).join(' ')
  ).join('<br>');
});

// ---------- Scroll progress bar + timeline line drawing ----------
const progress = document.getElementById('progress');
const timeline = document.querySelector('.timeline');
function onScrollAnim() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
  if (timeline) {
    const r = timeline.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - r.top) / r.height));
    timeline.style.setProperty('--line-progress', p);
  }
}
window.addEventListener('scroll', onScrollAnim, { passive: true });
onScrollAnim();

// ---------- Skill chips pop in one by one (stagger) ----------
document.querySelectorAll('.skill-group .chips').forEach(list => {
  [...list.children].forEach((li, i) => li.style.transitionDelay = (0.2 + i * 0.07) + 's');
});

// ---------- Count up the numbers on the floating cards ----------
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count;
  let n = 0;
  setTimeout(function step() {
    el.textContent = ++n;
    if (n < target) setTimeout(step, 180);
  }, reduceMotion ? 0 : 2600);
});

// ---------- Mouse effects (only on computers, not phones) ----------
const hasMouse = window.matchMedia('(hover: hover)').matches && !reduceMotion;
if (hasMouse) {
  document.body.classList.add('has-mouse');

  // soft glow follows the mouse
  const glow = document.getElementById('cursorGlow');
  window.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  });

  // 3D tilt on skill and certificate cards
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.transform = `perspective(800px) rotateX(${(0.5 - y) * 10}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-6px)`;
      card.style.setProperty('--mx', x * 100 + '%');
      card.style.setProperty('--my', y * 100 + '%');
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // buttons gently follow the mouse (magnetic effect)
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => btn.style.transform = '');
  });
}

// ---------- Live network animation in the home section ----------
// Dots (devices) drift around; lines (connections) appear when they are close,
// and the mouse acts like a router that connects to nearby devices.
const canvas = document.getElementById('netCanvas');
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let nodes = [], w, h, mouse = { x: -999, y: -999 };

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    w = hero.offsetWidth; h = hero.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.min(80, Math.floor(w * h / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1.5
    }));
  }

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -999; });

  let running = true;
  new IntersectionObserver(([entry]) => {
    running = entry.isIntersecting;
    if (running) requestAnimationFrame(draw);
  }).observe(hero);

  function draw() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const linkDist = 130;
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist) {
          ctx.strokeStyle = `rgba(255,255,255,${0.22 * (1 - d / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < 180) {
        ctx.strokeStyle = `rgba(253,230,138,${0.6 * (1 - dm / 180)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = dm < 180 ? 'rgba(253,230,138,.95)' : 'rgba(255,255,255,.7)';
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
}