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

// ---------- Contact form: check the fields, then send the message to me on WhatsApp ----------
// Clicking "Send on WhatsApp" opens a WhatsApp chat with me, with the visitor's message already typed in.
const WHATSAPP_NUMBER = '97517319436';   // Bhutan (+975) 17319436
const MY_EMAIL = 'chungkuwangmo6@gmail.com';

const form = document.getElementById('contactForm');
const sent = document.getElementById('sent');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter an email address like name@example.com.',
  message: v => v.trim().length >= 10 || 'Write a message of at least 10 characters.'
};

form.addEventListener('submit', e => {
  e.preventDefault();
  let allGood = true;
  for (const id in rules) {
    const field = document.getElementById(id);
    const result = rules[id](field.value);
    const ok = result === true;
    document.getElementById(id + '-err').textContent = ok ? '' : result;
    field.classList.toggle('invalid', !ok);
    field.setAttribute('aria-invalid', !ok);
    if (!ok) allGood = false;
  }
  if (!allGood) { sent.textContent = ''; return; }

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const text = `Hello Chungku!\n\n${message}\n\nFrom: ${name} (${email})\nSent from your portfolio website`;
  const encoded = encodeURIComponent(text);
  const isPhone = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const webUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

  sent.style.color = '';
  if (isPhone) {
    // phones: wa.me opens the WhatsApp app directly
    window.location.href = webUrl;
    sent.textContent = `Thanks, ${name}! WhatsApp is opening. Just press send there.`;
  } else {
    // computers: open the WhatsApp desktop app (the browser may ask "Open WhatsApp?", click Open)
    window.location.href = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encoded}`;
    sent.innerHTML = `Thanks, ${name}! Opening the WhatsApp app... Just press send there.<br>
      <small>No WhatsApp app? <a href="${webUrl}" target="_blank" rel="noopener" style="color:inherit;text-decoration:underline">Use WhatsApp Web instead</a></small>`;
  }
  form.reset();
});

// the WhatsApp contact card also opens the desktop app on computers
const waCard = document.getElementById('waCard');
if (waCard && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  waCard.addEventListener('click', e => {
    e.preventDefault();
    window.location.href = `whatsapp://send?phone=${WHATSAPP_NUMBER}`;
  });
}

// ---------- Email card: open Gmail in the browser on computers, the mail app on phones ----------
const emailCard = document.getElementById('emailCard');
if (emailCard && !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
  emailCard.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + MY_EMAIL +
    '&su=' + encodeURIComponent('Hello from your portfolio');
  emailCard.target = '_blank';
  emailCard.rel = 'noopener';
}
// copy button: copies my email address
const copyBtn = document.getElementById('copyEmail');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(MY_EMAIL); }
    catch (e) {
      const t = document.createElement('textarea'); t.value = MY_EMAIL; document.body.appendChild(t);
      t.select(); document.execCommand('copy'); t.remove();
    }
    copyBtn.textContent = 'Copied ✓';
    copyBtn.classList.add('done');
    setTimeout(() => { copyBtn.textContent = 'Copy'; copyBtn.classList.remove('done'); }, 1800);
  });
}

// ---------- Current year in the footer ----------
document.getElementById('year').textContent = new Date().getFullYear();
/* =========================================================
   CREATIVE ANIMATIONS
   ========================================================= */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Opening intro: type my name, then open the curtain ----------
const loader = document.getElementById('loader');
let introFinished = false;
const introDoneCallbacks = [];
function onIntroDone(fn) { introFinished ? fn() : introDoneCallbacks.push(fn); }
function openCurtain() {
  if (introFinished) return;
  introFinished = true;
  document.body.classList.add('ready');
  introDoneCallbacks.forEach(fn => fn());
  if (!loader) return;
  loader.classList.add('ripple-go');            // water ripples spread out
  setTimeout(() => loader.classList.add('open'), 120);   // and a hole opens to reveal the site
  setTimeout(() => loader.remove(), 1500);
}
(function runIntro() {
  const nameEl = document.getElementById('introName');
  if (!loader || !nameEl || reduceMotion) { if (loader) loader.remove(); openCurtain(); return; }
  // split my name into letters that each fade in from a blur
  let delay = 0.55;
  nameEl.innerHTML = [...nameEl.textContent].map(ch => {
    if (ch === ' ') return ' ';
    const span = `<span class="il" style="animation-delay:${delay.toFixed(2)}s">${ch}</span>`;
    delay += 0.06;
    return span;
  }).join('');
  setTimeout(openCurtain, 2500);
  setTimeout(openCurtain, 5000); // safety: never block the page
})();

// ---------- Split the name into letters so each one animates in ----------
document.querySelectorAll('.split').forEach(el => {
  let delay = 0.3;
  const parts = el.innerHTML.split(/<br\s*\/?>/i);
  el.innerHTML = parts.map((part, partIndex) =>
    part.trim().split(' ').map(word =>
      '<span class="word' + (partIndex > 0 ? ' grad' : '') + '" aria-hidden="true">' + [...word].map(ch => {
        const span = `<span class="char" style="animation-delay:${delay.toFixed(2)}s">${ch}</span>`;
        delay += 0.04;
        return span;
      }).join('') + '</span>'
    ).join(' ')
  ).join('<br>');
  // when the letters have arrived, turn the name into one flowing gradient
  onIntroDone(() => setTimeout(() => {
    el.querySelectorAll('.word.grad').forEach(word => {
      word.textContent = word.textContent;
      word.classList.add('done');
    });
  }, (delay + 0.7) * 1000));
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

// ---------- Count up numbers when they come into view ----------
const counter = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    counter.unobserve(entry.target);
    const el = entry.target, target = +el.dataset.count;
    let n = 0;
    onIntroDone(() => setTimeout(function step() {
      el.textContent = ++n;
      if (n < target) setTimeout(step, 160);
    }, reduceMotion ? 0 : 900));
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counter.observe(el));

// ---------- Mouse effects (only on computers, not phones) ----------
const hasMouse = window.matchMedia('(hover: hover)').matches && !reduceMotion;
if (hasMouse) {
  document.body.classList.add('has-mouse');

  // soft glow follows the mouse
  const glow = document.getElementById('cursorGlow');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    glow.style.transform = `translate(${mx}px, ${my}px)`;
  });
  // the ring follows the mouse smoothly, a little behind it
  (function followRing() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(followRing);
  })();
  // the ring grows over anything you can click
  document.querySelectorAll('a, button, .node, .tilt, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
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
  let nodes = [], packets = [], w, h, mouse = { x: -999, y: -999 };

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
    const css = getComputedStyle(document.documentElement);
    const lineRGB = css.getPropertyValue('--net-line').trim() || '249, 168, 212';
    const hotRGB = css.getPropertyValue('--net-hot').trim() || '246, 194, 122';
    const linkDist = 130;
    const links = [];
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      a.x += a.vx; a.y += a.vy;
      if (a.x < 0 || a.x > w) a.vx *= -1;
      if (a.y < 0 || a.y > h) a.vy *= -1;

      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < linkDist) {
          links.push([i, j]);
          ctx.strokeStyle = `rgba(${lineRGB},${0.3 * (1 - d / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
      const dm = Math.hypot(a.x - mouse.x, a.y - mouse.y);
      if (dm < 180) {
        ctx.strokeStyle = `rgba(${hotRGB},${0.6 * (1 - dm / 180)})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
      ctx.fillStyle = dm < 180 ? `rgba(${hotRGB},.95)` : `rgba(${lineRGB},.6)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }

    // data packets: small glowing dots that travel along the connections
    if (links.length && packets.length < 16 && Math.random() < 0.12) {
      const [from, to] = links[Math.floor(Math.random() * links.length)];
      packets.push(Math.random() < 0.5 ? { from, to, t: 0 } : { from: to, to: from, t: 0 });
    }
    packets = packets.filter(pk => {
      const a = nodes[pk.from], b = nodes[pk.to];
      if (!a || !b || Math.hypot(a.x - b.x, a.y - b.y) > linkDist) return false;
      pk.t += 0.02;
      if (pk.t >= 1) return false;
      const x = a.x + (b.x - a.x) * pk.t, y = a.y + (b.y - a.y) * pk.t;
      ctx.save();
      ctx.shadowColor = `rgba(${hotRGB},.9)`; ctx.shadowBlur = 10;
      ctx.fillStyle = `rgb(${hotRGB})`;
      ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      return true;
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
}

/* =========================================================
   INTERACTIVE LINUX TERMINAL
   A small simulated Linux shell. Visitors type commands to explore my portfolio.
   ========================================================= */
(function () {
  const body = document.getElementById('termBody');
  const out = document.getElementById('termOutput');
  const input = document.getElementById('termInput');
  const formEl = document.getElementById('termForm');
  const cwdEl = document.getElementById('termCwd');
  if (!body || !input) return;

  const USER = 'chungku', HOST = 'jnec';
  let cwd = '~';
  const history = [];
  let histIndex = 0;
  let busy = false;

  // ---------- a tiny pretend file system ----------
  const files = {
    '~': {
      'about.txt': `Name     : Chungku Wangmo
From     : Khameythang, Samdrup Jongkhar, Bhutan
Studying : Computer System and Network, JNEC (2024 - 2027)
Focus    : routing & switching, network security, Linux servers
Hobbies  : reading, sports, travelling, photography
Zodiac   : ♒ Aquarius`,
      'skills.txt': `[Networking]   routing & switching, ACLs, DHCP, subnetting, network security
[Programming]  HTML, CSS, JavaScript, Python, Tkinter, MySQL
[Tools]        Cisco Packet Tracer, Ubuntu Server, VirtualBox, Git, VS Code
[People]       teamwork, communication, accounting, digital marketing`,
      'education.txt': `2024 - 2027  Computer System and Network  - Jigme Namgyel Engineering College
2023         Class XII, BHSEC (Commerce)   - Desi High School        73.75%
2020         Class X, BCSE                 - Phuntshothang MSS       69%`,
      'goals.txt': `Become a network professional who builds reliable, secure systems
for organisations in Bhutan, and keep learning with a positive attitude.`,
      'contact.txt': `whatsapp : +975 17 31 94 36
email  : chungkuwangmo6@gmail.com
github : github.com/05240130jnec-ship-it
place  : Khameythang, Samdrup Jongkhar, Bhutan
tip    : run "sudo hire chungku" 😉`,
      '.secret': `You found the hidden file! 🎉
Fun fact: this whole terminal is written in plain JavaScript.`,
      'certificates/': null
    },
    '~/certificates': {
      'ccna1.jpg': 'media/certificates/ccna1.jpg',
      'ccna2.jpg': 'media/certificates/ccna2.jpg',
      'linux.jpg': 'media/certificates/linux.jpg',
      'web.jpg': 'media/certificates/web.jpg',
      'python.jpg': 'media/certificates/python.jpg'
    }
  };

  // ---------- helpers ----------
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const scroll = () => { body.scrollTop = body.scrollHeight; };
  function print(html, cls) {
    const pre = document.createElement('pre');
    if (cls) pre.className = cls;
    pre.innerHTML = html;
    out.appendChild(pre);
    scroll();
  }
  function promptHTML(cmd) {
    return `<span class="t-prompt"><b>${USER}@${HOST}</b>:<i>${esc(cwd)}</i>$</span> ${esc(cmd)}`;
  }
  function resolveFile(name) {
    if (!name) return null;
    const dir = files[cwd];
    if (dir && name in dir) return { dir: cwd, name };
    if (name.startsWith('certificates/')) {
      const f = name.slice(13);
      if (f in files['~/certificates']) return { dir: '~/certificates', name: f };
    }
    if (name.startsWith('~/')) {
      const f = name.slice(2);
      if (f in files['~']) return { dir: '~', name: f };
    }
    return null;
  }
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }

  // ---------- commands ----------
  const commands = {
    help() {
      return `<span class="t-white">Available commands</span>
  <span class="t-cyan">whoami</span>            who am I?
  <span class="t-cyan">neofetch</span>          system info about me
  <span class="t-cyan">ls</span> [-l | -a]       list files       <span class="t-cyan">cd</span> &lt;dir&gt;    change folder
  <span class="t-cyan">cat</span> &lt;file&gt;        read a file      <span class="t-cyan">pwd</span>         where am I
  <span class="t-cyan">open</span> &lt;cert&gt;       view a certificate, e.g. open ccna1.jpg
  <span class="t-cyan">ip a</span>              my network interfaces
  <span class="t-cyan">ping</span> &lt;host&gt;       test a connection
  <span class="t-cyan">traceroute future</span> the route of my journey
  <span class="t-cyan">nslookup</span> &lt;name&gt;   look up a name
  <span class="t-cyan">systemctl status portfolio</span>
  <span class="t-cyan">uname -a</span> · <span class="t-cyan">date</span> · <span class="t-cyan">echo</span> · <span class="t-cyan">history</span> · <span class="t-cyan">clear</span>
  <span class="t-cyan">theme</span> dark|light    switch the site theme
  <span class="t-cyan">goto</span> &lt;section&gt;     jump to about, skills, education, certificates, contact
  <span class="t-cyan">sudo hire chungku</span> 😉
<span class="t-dim">Tips: Tab completes commands and files · ↑ ↓ browse history · results are simulated</span>`;
    },
    whoami: () => `${USER} <span class="t-dim">(Chungku Wangmo, networking student at JNEC)</span>`,
    hostname: () => HOST,
    pwd: () => cwd.replace('~', '/home/chungku'),
    date: () => new Date().toString(),
    'uname': args => args.includes('-a')
      ? 'Linux jnec 6.8.0-chungku #2026 SMP x86_64 GNU/Linux (Portfolio OS)'
      : 'Linux',
    echo: args => esc(args.join(' ')),
    clear() { out.innerHTML = ''; return null; },
    history: () => history.map((h, i) => `  ${String(i + 1).padStart(3)}  ${esc(h)}`).join('\n'),

    ls(args) {
      const all = args.includes('-a') || args.includes('-la') || args.includes('-al');
      const long = args.includes('-l') || args.includes('-la') || args.includes('-al');
      const target = args.find(a => !a.startsWith('-'));
      let dirKey = cwd;
      if (target) {
        const t = target.replace(/\/$/, '');
        if (t === 'certificates' || t === '~/certificates') dirKey = '~/certificates';
        else if (t === '~' || t === '..') dirKey = '~';
        else return `ls: cannot access '${esc(target)}': No such file or directory`;
      }
      let names = Object.keys(files[dirKey]).filter(n => all || !n.startsWith('.'));
      if (all) names = ['.', '..', ...names];
      const color = n => n.endsWith('/') || n === '.' || n === '..' ? `<span class="t-blue">${n}</span>`
        : n.endsWith('.jpg') ? `<span class="t-gold">${n}</span>` : n;
      if (!long) return names.map(color).join('   ');
      return `total ${names.length * 4}\n` + names.map(n => {
        const dir = n.endsWith('/') || n === '.' || n === '..';
        const size = dir ? 4096 : (files[dirKey][n] || '').length * 7 + 120;
        return `${dir ? 'drwxr-xr-x' : '-rw-r--r--'} 1 chungku jnec ${String(size).padStart(6)} Nov  6 21:41 ${color(n)}`;
      }).join('\n');
    },

    cd(args) {
      const t = (args[0] || '~').replace(/\/$/, '');
      if (t === '~' || t === '..' || t === '/home/chungku') { cwd = '~'; }
      else if ((t === 'certificates' || t === '~/certificates') ) { cwd = '~/certificates'; }
      else return `cd: ${esc(t)}: No such file or directory`;
      cwdEl.textContent = cwd;
      return null;
    },

    cat(args) {
      if (!args.length) return 'cat: missing file name. Try: cat about.txt';
      return args.map(a => {
        const f = resolveFile(a);
        if (!f) return `cat: ${esc(a)}: No such file or directory`;
        if (f.name.endsWith('/')) return `cat: ${esc(a)}: Is a directory`;
        if (f.name.endsWith('.jpg')) return `cat: ${esc(a)}: binary image file. Try: open ${esc(f.name)}`;
        return esc(files[f.dir][f.name]);
      }).join('\n');
    },

    open(args) {
      const f = resolveFile(args[0]) || resolveFile('certificates/' + (args[0] || ''));
      if (!f || !f.name.endsWith('.jpg')) return 'open: give a certificate name, e.g. <span class="t-cyan">open ccna1.jpg</span>';
      window.open(files['~/certificates'][f.name], '_blank', 'noopener');
      return `<span class="t-green">Opening</span> ${esc(f.name)} in a new tab...`;
    },

    neofetch() {
      const logo = [
        '   <span class="t-cyan">  ▄▄▄▄▄▄▄  </span>',
        '   <span class="t-cyan"> ██</span><span class="t-gold">  ♒  </span><span class="t-cyan">██ </span>',
        '   <span class="t-cyan"> ██</span><span class="t-white"> C W </span><span class="t-cyan">██ </span>',
        '   <span class="t-cyan"> ██</span><span class="t-gold">  ≈  </span><span class="t-cyan">██ </span>',
        '   <span class="t-cyan">  ▀▀▀▀▀▀▀  </span>',
      ];
      const info = [
        `<span class="t-cyan">chungku</span>@<span class="t-cyan">jnec</span>`,
        '-------------',
        `<span class="t-gold">OS</span>: Portfolio OS (Bhutan edition)`,
        `<span class="t-gold">Host</span>: Jigme Namgyel Engineering College`,
        `<span class="t-gold">Kernel</span>: CCNA ITN + SRWE`,
        `<span class="t-gold">Uptime</span>: since 2024 at JNEC`,
        `<span class="t-gold">Shell</span>: bash (curious mode)`,
        `<span class="t-gold">Packages</span>: 5 certificates`,
        `<span class="t-gold">Languages</span>: English, Dzongkha, Sharchop, Lhotsham`,
        `<span class="t-gold">Zodiac</span>: ♒ Aquarius`
      ];
      const blank = ' '.repeat(14);
      return info.map((l, i) => (logo[i] || blank) + '   ' + l).join('\n');
    },

    ip(args) {
      if (args[0] !== 'a' && args[0] !== 'addr') return 'Usage: ip a';
      return `1: <span class="t-white">lo</span>: &lt;LOOPBACK,UP,LOWER_UP&gt; mtu 65536
    inet <span class="t-cyan">127.0.0.1/8</span> scope host lo
2: <span class="t-white">eth0</span>: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500
    link/ether 0c:4a:71:c4:00:01
    inet <span class="t-cyan">192.168.10.25/24</span> brd 192.168.10.255 scope global eth0   <span class="t-dim"># learning</span>
3: <span class="t-white">ccna0</span>: &lt;UP,ROUTING,SWITCHING&gt; mtu 1500
    inet <span class="t-cyan">10.20.26.1/30</span> scope global ccna0   <span class="t-dim"># certified courses</span>
4: <span class="t-white">future0</span>: &lt;UP,DREAMING&gt; mtu 9000
    inet <span class="t-gold">172.16.0.1/16</span> scope global future0   <span class="t-dim"># network engineer</span>`;
    },
    ifconfig() { return commands.ip(['a']); },

    async ping(args) {
      const host = args.find(a => !a.startsWith('-')) || '';
      if (!host) return 'ping: usage error: Destination address required';
      const ip = host === 'chungku' || host === 'localhost' ? '127.0.0.1' : `192.0.2.${(host.length * 17) % 250 + 2}`;
      print(`PING ${esc(host)} (${ip}) 56(84) bytes of data.`);
      const times = [];
      for (let i = 1; i <= 4; i++) {
        await sleep(550);
        const t = (8 + Math.random() * 14).toFixed(1);
        times.push(+t);
        print(`64 bytes from ${esc(host)} (${ip}): icmp_seq=${i} ttl=64 time=<span class="t-green">${t} ms</span>`);
      }
      const min = Math.min(...times).toFixed(1), max = Math.max(...times).toFixed(1);
      const avg = (times.reduce((a, b) => a + b, 0) / times.length).toFixed(1);
      return `\n--- ${esc(host)} ping statistics ---
4 packets transmitted, 4 received, <span class="t-green">0% packet loss</span>
rtt min/avg/max = ${min}/${avg}/${max} ms`;
    },

    async traceroute(args) {
      const target = args[0] || '';
      if (target !== 'future') return `traceroute: try <span class="t-cyan">traceroute future</span>`;
      print('traceroute to future (network-engineer), 30 hops max');
      const hops = [
        ['Phuntshothang MSS', 'Class X, 2020'],
        ['Karmaling HSS', 'Class XI, 3rd place'],
        ['Desi High School', 'Class XII, 2023'],
        ['JNEC', 'Computer System and Network, 2024'],
        ['Cisco NetAcad', 'CCNA ITN + SRWE, 2026'],
        ['Coursera', 'Linux, Python, Web, 2026'],
        ['future', '<span class="t-gold">Network Engineer ... loading</span>']
      ];
      for (let i = 0; i < hops.length; i++) {
        await sleep(500);
        const t = (3 + i * 4 + Math.random() * 3).toFixed(1);
        print(` ${i + 1}  <span class="t-white">${hops[i][0]}</span>  (${hops[i][1]})  ${t} ms`);
      }
      return null;
    },

    nslookup(args) {
      const name = args[0];
      if (!name) return 'Usage: nslookup &lt;name&gt;';
      if (/chungku/i.test(name)) return `Server:   127.0.0.53
Address:  127.0.0.53#53

Name:    ${esc(name)}
Address: <span class="t-gold">Khameythang, Samdrup Jongkhar, Bhutan</span>`;
      return `Server:   127.0.0.53
Address:  127.0.0.53#53

Non-authoritative answer:
Name:    ${esc(name)}
Address: 192.0.2.${(name.length * 13) % 250 + 2}   <span class="t-dim">(simulated)</span>`;
    },
    dig(args) { return commands.nslookup(args); },

    systemctl(args) {
      if (args[0] === 'status' && (args[1] || '').startsWith('portfolio')) {
        return `<span class="t-green">●</span> portfolio.service - Chungku Wangmo's Portfolio
     Loaded: loaded (/etc/systemd/system/portfolio.service; <span class="t-green">enabled</span>)
     Active: <span class="t-green">active (running)</span> since 2024; learning every day
   Main PID: 2026 (curiosity)
      Tasks: 5 certificates, 4 languages, ∞ ideas
     Memory: CCNA, Linux, Python, Web`;
      }
      return 'Usage: systemctl status portfolio';
    },

    theme(args) {
      const t = args[0];
      if (t !== 'dark' && t !== 'light') return 'Usage: theme dark | theme light';
      applyTheme(t);
      return `Theme switched to <span class="t-gold">${t}</span>.`;
    },

    goto(args) {
      const map = { home: 'home', about: 'about', skills: 'skills', education: 'education', certificates: 'certificates', contact: 'contact' };
      const id = map[(args[0] || '').toLowerCase()];
      if (!id) return 'Usage: goto about | skills | education | certificates | contact';
      setTimeout(() => scrollToSection(id), 300);
      return `Jumping to <span class="t-cyan">${id}</span>...`;
    },

    async sudo(args) {
      if (args.join(' ') === 'hire chungku') {
        print('[sudo] password for visitor: ********');
        await sleep(600);
        const steps = ['Checking skills', 'Verifying certificates', 'Loading positive attitude'];
        for (const s of steps) { await sleep(450); print(`${s}... <span class="t-green">OK</span>`); }
        await sleep(400);
        setTimeout(() => scrollToSection('contact'), 1200);
        return `<span class="t-gold">✔ Great choice!</span> Taking you to the contact form...`;
      }
      if (args[0] === 'rm') return '<span class="t-red">Nice try 😄 Permission denied.</span>';
      return `<span class="t-red">visitor is not in the sudoers file. This incident will be reported.</span>`;
    },
    rm: () => '<span class="t-red">rm: permission denied. My portfolio is staying right here 😄</span>',
    exit() { setTimeout(() => scrollToSection('home'), 300); return 'logout. Bye! 👋'; },
    man: args => args[0] ? `No manual entry for ${esc(args[0])}. Try <span class="t-cyan">help</span>.` : 'What manual page do you want?'
  };

  const commandNames = [...Object.keys(commands), 'ip a', 'traceroute future', 'sudo hire chungku', 'systemctl status portfolio'];

  // ---------- run a command ----------
  async function run(raw) {
    const cmdLine = raw.trim();
    print(promptHTML(cmdLine));
    if (!cmdLine) return;
    history.push(cmdLine);
    histIndex = history.length;
    const [name, ...args] = cmdLine.split(/\s+/);
    const fn = commands[name.toLowerCase()];
    if (!fn) {
      print(`<span class="t-red">${esc(name)}: command not found</span>. Type <span class="t-cyan">help</span> to see what I understand.`);
      return;
    }
    busy = true;
    input.disabled = true;
    try {
      const result = await fn(args);
      if (result) print(result);
    } finally {
      busy = false;
      input.disabled = false;
      input.focus({ preventScroll: true });
      scroll();
    }
  }

  // ---------- typing, history and Tab completion ----------
  formEl.addEventListener('submit', e => {
    e.preventDefault();
    if (busy) return;
    const value = input.value;
    input.value = '';
    run(value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault();
      histIndex = Math.max(0, histIndex - 1);
      input.value = history[histIndex];
    } else if (e.key === 'ArrowDown' && history.length) {
      e.preventDefault();
      histIndex = Math.min(history.length, histIndex + 1);
      input.value = history[histIndex] || '';
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.value.split(' ');
      const last = parts[parts.length - 1];
      const pool = parts.length === 1
        ? commandNames
        : [...Object.keys(files[cwd]), ...Object.keys(files['~/certificates']).map(f => (cwd === '~' ? 'certificates/' : '') + f)];
      const matches = pool.filter(p => p.startsWith(last));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        input.value = parts.join(' ') + (matches[0].endsWith('/') ? '' : ' ');
      } else if (matches.length > 1) {
        // fill in the part all matches share, then list them
        let common = matches[0];
        matches.forEach(m => { while (!m.startsWith(common)) common = common.slice(0, -1); });
        if (common.length > last.length) {
          parts[parts.length - 1] = common;
          input.value = parts.join(' ');
        } else {
          print(promptHTML(input.value));
          print(matches.join('   '));
        }
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      out.innerHTML = '';
    }
  });

  // clicking anywhere in the terminal focuses the input
  body.addEventListener('click', () => { if (!window.getSelection().toString()) input.focus({ preventScroll: true }); });

  // quick command buttons
  document.querySelectorAll('.term-chips button').forEach(btn => {
    btn.addEventListener('click', () => { if (!busy) run(btn.dataset.cmd); });
  });

  // welcome message, typed in when the terminal first appears
  let welcomed = false;
  new IntersectionObserver(async ([entry], obs) => {
    if (!entry.isIntersecting || welcomed) return;
    welcomed = true;
    obs.disconnect();
    print(`<span class="t-dim">Last login: ${new Date().toDateString()} from visitor</span>`);
    print(`Welcome to <span class="t-cyan">Chungku's Portfolio OS</span> ♒  (bash, simulated)
Type <span class="t-cyan">help</span> to see all commands, or click a button below.\n`);
  }, { threshold: 0.3 }).observe(body);
})();


/* =========================================================
   v7: SCROLL EFFECTS, JOURNEY MAP AND CERTIFICATE CAROUSEL
   ========================================================= */

// ---------- Stagger the bento tiles so they arrive one after another ----------
document.querySelectorAll('.bento .tile').forEach((tile, i) => {
  tile.style.transitionDelay = (i % 4) * 0.08 + 's';
  tile.addEventListener('transitionend', () => { tile.style.transitionDelay = ''; }, { once: true });
});

// ---------- Education journey map: a path that draws itself as you scroll ----------
const journey = document.getElementById('journey');
const jPath = document.getElementById('journeyPath');
const jTrack = document.getElementById('journeyTrack');
const jStops = journey ? [...journey.querySelectorAll('.j-stop')] : [];
let jLength = 0, jPoints = [];

function buildJourney() {
  if (!journey) return;
  const box = journey.getBoundingClientRect();
  const mobile = window.innerWidth <= 760;
  jPoints = jStops.map(stop => {
    const r = stop.querySelector('.j-dot').getBoundingClientRect();
    return { x: r.left + r.width / 2 - box.left, y: r.top + r.height / 2 - box.top };
  });
  const amp = mobile ? 14 : box.width * 0.09;
  let d = `M ${jPoints[0].x} 0 L ${jPoints[0].x} ${jPoints[0].y}`;
  for (let i = 0; i < jPoints.length - 1; i++) {
    const a = jPoints[i], b = jPoints[i + 1], dy = b.y - a.y, s = i % 2 ? -1 : 1;
    d += ` C ${a.x + s * amp} ${a.y + dy / 3}, ${b.x + s * amp} ${b.y - dy / 3}, ${b.x} ${b.y}`;
  }
  jPath.setAttribute('d', d);
  jTrack.setAttribute('d', d);
  jLength = jPath.getTotalLength();
  jPath.style.strokeDasharray = jLength;
  updateJourney();
}

function updateJourney() {
  if (!journey || !jLength) return;
  const box = journey.getBoundingClientRect();
  let progress = (window.innerHeight * 0.72 - box.top) / box.height;
  progress = Math.min(1, Math.max(0, progress));
  if (reduceMotion) progress = 1;
  jPath.style.strokeDashoffset = jLength * (1 - progress);
  const reachedY = progress * box.height;
  jStops.forEach((stop, i) => stop.classList.toggle('lit', jPoints[i] && jPoints[i].y <= reachedY + 10));
}

// ---------- One scroll handler for all scroll effects (runs once per frame) ----------
const heroText = document.querySelector('.hero-text');
const heroPhoto = document.querySelector('.hero-photo');
const aquarius = document.querySelector('.aquarius');
const bgWords = [...document.querySelectorAll('.bg-word')];
let ticking = false;

function scrollEffects() {
  ticking = false;
  const y = window.scrollY, vh = window.innerHeight;
  if (!reduceMotion && y < vh * 1.2) {
    if (heroText) { heroText.style.translate = `0 ${y * 0.22}px`; heroText.style.opacity = Math.max(0, 1 - y / (vh * 0.8)); }
    if (heroPhoto) heroPhoto.style.translate = `0 ${y * 0.1}px`;
    if (aquarius) aquarius.style.translate = `0 ${y * 0.4}px`;
  }
  if (!reduceMotion) {
    bgWords.forEach(word => {
      const r = word.parentElement.getBoundingClientRect();
      word.style.setProperty('--shift', ((r.top + r.height / 2 - vh / 2) * -0.35).toFixed(1) + 'px');
    });
  }
  updateJourney();
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(scrollEffects); }
}, { passive: true });
window.addEventListener('resize', buildJourney);
window.addEventListener('load', buildJourney);
document.fonts && document.fonts.ready.then(buildJourney);
buildJourney();
scrollEffects();

// ---------- 3D certificate carousel ----------
(function () {
  const stage = document.getElementById('carouselStage');
  if (!stage) return;
  const cards = [...stage.querySelectorAll('.cert-card')];
  const dotsBox = document.getElementById('carDots');
  const n = cards.length;
  let current = 0, timer = null;

  const dots = cards.map((card, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', 'Show certificate ' + (i + 1));
    dot.addEventListener('click', () => { goTo(i); restart(); });
    dotsBox.appendChild(dot);
    return dot;
  });

  function layout() {
    const gap = window.innerWidth < 600 ? 120 : 270;
    cards.forEach((card, i) => {
      let off = i - current;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      const abs = Math.abs(off);
      card.style.zIndex = 10 - abs;
      card.style.opacity = abs > 2 ? 0 : abs === 2 ? 0.45 : 1;
      card.style.pointerEvents = abs > 2 ? 'none' : 'auto';
      card.style.transform = `translateX(${off * gap * (abs === 2 ? 0.9 : 1)}px) translateZ(${-abs * 170}px) rotateY(${-off * 32}deg)`;
      card.classList.toggle('active', off === 0);
      card.classList.toggle('side', off !== 0);
      card.setAttribute('aria-hidden', off !== 0);
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === current));
  }
  function goTo(i) { current = (i + n) % n; layout(); }
  function restart() {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => goTo(current + 1), 4500);
  }

  document.getElementById('carPrev').addEventListener('click', () => { goTo(current - 1); restart(); });
  document.getElementById('carNext').addEventListener('click', () => { goTo(current + 1); restart(); });

  // clicking a side card brings it to the front instead of opening it
  let dragged = false;
  stage.addEventListener('click', e => {
    const card = e.target.closest('.cert-card');
    if (!card) return;
    if (dragged || !card.classList.contains('active')) {
      e.preventDefault();
      if (!dragged) { goTo(cards.indexOf(card)); restart(); }
    }
  });

  // swipe / drag to change certificate
  let startX = null;
  stage.addEventListener('pointerdown', e => { startX = e.clientX; dragged = false; });
  stage.addEventListener('pointermove', e => {
    if (startX !== null && Math.abs(e.clientX - startX) > 10) { dragged = true; stage.classList.add('dragging'); }
  });
  window.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 50) { goTo(current + (dx < 0 ? 1 : -1)); restart(); }
    startX = null;
    stage.classList.remove('dragging');
    setTimeout(() => { dragged = false; }, 0);
  });

  // pause while the mouse is over the carousel
  stage.addEventListener('mouseenter', () => clearInterval(timer));
  stage.addEventListener('mouseleave', restart);
  window.addEventListener('resize', layout);

  layout();
  restart();
})();