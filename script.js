window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('preloader').classList.add('hidden');
  }, 1200);
});

function updateClock() {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  document.getElementById('live-date').textContent = dateStr;
  document.getElementById('live-time').textContent =
    (h < 10 ? '0'+h : h) + ':' + (m < 10 ? '0'+m : m) + ':' + (s < 10 ? '0'+s : s) + ' ' + ampm;
}
setInterval(updateClock, 1000);
updateClock();

const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
document.querySelectorAll('.nav-links a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('active'))
);

const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️ Light';
}
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const dark = document.body.classList.contains('dark-mode');
  themeToggle.textContent = dark ? '☀️ Light' : '🌙 Dark';
  localStorage.setItem('theme', dark ? 'dark' : 'light');
});

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  const btn = document.getElementById('scrollTopBtn');
  if (btn) btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  const bar = document.getElementById('progressBar');
  if (bar) {
    const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = pct + '%';
  }
});

document.querySelectorAll('.fade-in').forEach(el => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.15 }).observe(el);
});

let counted = false;
const statsEl = document.querySelector('.about-stats');
if (statsEl) {
  new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !counted) {
      counted = true;
      [['count-clients', 250], ['count-projects', 180], ['count-years', 8]].forEach(([id, target]) => {
        let n = 0;
        const t = setInterval(() => {
          n += Math.ceil(target / 50);
          if (n >= target) {
            document.getElementById(id).textContent = target + '+';
            clearInterval(t);
          } else {
            document.getElementById(id).textContent = n;
          }
        }, 30);
      });
    }
  }, { threshold: 0.5 }).observe(statsEl);
}

const typingTexts = ['Web Design Solutions','App Development','Digital Marketing','SEO Optimization','Cloud Hosting'];
let typeIndex = 0, charIndex = 0, isDeleting = false;
function typeWriter() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const current = typingTexts[typeIndex];
  el.textContent = isDeleting ? current.substring(0, charIndex--) : current.substring(0, charIndex++);
  if (!isDeleting && charIndex === current.length + 1) {
    setTimeout(() => { isDeleting = true; typeWriter(); }, 1800);
    return;
  }
  if (isDeleting && charIndex === -1) {
    isDeleting = false;
    typeIndex = (typeIndex + 1) % typingTexts.length;
  }
  setTimeout(typeWriter, isDeleting ? 60 : 100);
}
typeWriter();

const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
if (slides.length > 0) {
  slides[0].classList.add('active');
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 4000);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-item').forEach(item => {
      item.classList.toggle('hidden', filter !== 'all' && item.dataset.category !== filter);
    });
  });
});

document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-question').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

function showToast(message, type = 'success', duration = 3500) {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span class="toast-icon">' + icons[type] + '</span><span>' + message + '</span><span class="toast-close">✕</span>';
  const container = document.getElementById('toast-container');
  if (container) container.appendChild(toast);
  toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
  setTimeout(() => removeToast(toast), duration);
}

function removeToast(toast) {
  toast.classList.add('hide');
  setTimeout(() => toast.remove(), 300);
}

const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;

    const getValue = id => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const setError = (errId, msg) => {
      const el = document.getElementById(errId);
      if (el) el.textContent = msg;
    };

    const setInputError = (id, hasError) => {
      const el = document.getElementById(id);
      if (el) el.classList.toggle('input-error', hasError);
    };

    const rules = [
      { id: 'fullname', err: 'nameError', test: v => v.length >= 3, msg: 'Name must be at least 3 characters.' },
      { id: 'email', err: 'emailError', test: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Enter a valid email address.' },
      { id: 'phone', err: 'phoneError', test: v => /^[0-9]{10,15}$/.test(v), msg: 'Enter a valid phone number (10-15 digits).' },
      { id: 'country', err: 'countryError', test: v => v !== '', msg: 'Please select a country.' },
      { id: 'service', err: 'serviceError', test: v => v !== '', msg: 'Please select a service.' },
      { id: 'message', err: 'messageError', test: v => v.length >= 10, msg: 'Message must be at least 10 characters.' }
    ];

    rules.forEach(r => {
      const val = getValue(r.id);
      if (!r.test(val)) {
        setError(r.err, r.msg);
        setInputError(r.id, true);
        valid = false;
      } else {
        setError(r.err, '');
        setInputError(r.id, false);
      }
    });

    const genderChecked = document.querySelector('#contactForm input[name="gender"]:checked');
    if (!genderChecked) {
      setError('genderError', 'Please select your gender.');
      valid = false;
    } else {
      setError('genderError', '');
    }

    const checkboxChecked = document.querySelectorAll('#contactForm input[type="checkbox"]:checked');
    if (checkboxChecked.length === 0) {
      setError('interestError', 'Please select at least one interest.');
      valid = false;
    } else {
      setError('interestError', '');
    }

    if (valid) {
      const name = getValue('fullname');
      const service = document.getElementById('service').value;
      saveSubmission(name, service);
      clearFormAutoSave();
      const modal = document.getElementById('successModal');
      if (modal) modal.classList.add('show');
      form.reset();
      document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
      showToast('Message sent successfully! We will contact you soon. ✅', 'success');
    } else {
      showToast('Please fill all required fields correctly.', 'error');
    }
  });

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => {
      el.classList.remove('input-error');
      const errEl = document.getElementById(el.id + 'Error');
      if (errEl) errEl.textContent = '';
    });
  });

  form.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => {
    el.addEventListener('change', () => {
      if (el.name === 'gender') {
        const err = document.getElementById('genderError');
        if (err) err.textContent = '';
      } else {
        const err = document.getElementById('interestError');
        if (err) err.textContent = '';
      }
    });
  });
}

function closeModal() {
  const modal = document.getElementById('successModal');
  if (modal) modal.classList.remove('show');
}

const modal = document.getElementById('successModal');
if (modal) {
  modal.addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
}

function initVisitCounter() {
  let visits = parseInt(localStorage.getItem('ls_visits') || '0') + 1;
  localStorage.setItem('ls_visits', visits);
  const counter = document.createElement('span');
  counter.className = 'visit-counter-box';
  counter.innerHTML = '👁️ Visit #' + visits;
  const navRight = document.querySelector('.nav-right');
  if (navRight) navRight.insertBefore(counter, navRight.firstChild);
}
initVisitCounter();

function initWelcomeBanner() {
  const name = localStorage.getItem('ls_username');
  const lastVisit = localStorage.getItem('ls_last_visit');
  const banner = document.getElementById('welcomeBanner');
  const msg = document.getElementById('welcomeMsg');
  if (!banner || !msg) return;
  const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  if (name) {
    msg.textContent = '👋 Welcome back, ' + name + '! Last visit: ' + (lastVisit || 'Today');
  } else {
    msg.textContent = '👋 Welcome to LiveSphere! Fill the form below to get started.';
  }
  localStorage.setItem('ls_last_visit', now);
  if (localStorage.getItem('ls_banner_closed') === 'true') {
    banner.classList.add('hidden');
  }
}
initWelcomeBanner();

function closeWelcomeBanner() {
  const banner = document.getElementById('welcomeBanner');
  if (banner) banner.classList.add('hidden');
  localStorage.setItem('ls_banner_closed', 'true');
}

function initFormAutoSave() {
  const fields = ['fullname', 'email', 'phone', 'country', 'service', 'message'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const saved = localStorage.getItem('ls_form_' + id);
    if (saved) el.value = saved;
    el.addEventListener('input', () => localStorage.setItem('ls_form_' + id, el.value));
  });
}
initFormAutoSave();

function clearFormAutoSave() {
  ['fullname','email','phone','country','service','message'].forEach(id =>
    localStorage.removeItem('ls_form_' + id)
  );
}

function saveSubmission(name, service) {
  const history = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  history.unshift({
    name, service,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  });
  localStorage.setItem('ls_submissions', JSON.stringify(history.slice(0, 5)));
  localStorage.setItem('ls_username', name);
  localStorage.setItem('ls_banner_closed', 'false');
  renderSubmissionHistory();
  initWelcomeBanner();
}

function renderSubmissionHistory() {
  const history = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  const container = document.getElementById('submissionHistory');
  if (!container || history.length === 0) return;
  container.innerHTML = `
    <div class="history-box">
      <h4>📋 Your Previous Submissions (${history.length})</h4>
      ${history.map(h => `
        <div class="history-item">
          <span>✉️ ${h.name} — ${h.service}</span>
          <span>${h.date} ${h.time}</span>
        </div>`).join('')}
    </div>`;
}
renderSubmissionHistory();

function toggleFavorite(btn) {
  const service = btn.dataset.service;
  let favs = JSON.parse(localStorage.getItem('ls_favorites') || '[]');
  if (favs.includes(service)) {
    favs = favs.filter(f => f !== service);
    btn.textContent = '🤍 Save';
    btn.classList.remove('favorited');
    showToast(service + ' removed from favorites!', 'info');
  } else {
    favs.push(service);
    btn.textContent = '❤️ Saved';
    btn.classList.add('favorited');
    showToast(service + ' saved to favorites!', 'success');
  }
  localStorage.setItem('ls_favorites', JSON.stringify(favs));
  renderFavoritesPanel();
}

function initFavoriteButtons() {
  const favs = JSON.parse(localStorage.getItem('ls_favorites') || '[]');
  document.querySelectorAll('.fav-btn').forEach(btn => {
    if (favs.includes(btn.dataset.service)) {
      btn.textContent = '❤️ Saved';
      btn.classList.add('favorited');
    }
  });
  renderFavoritesPanel();
}

function renderFavoritesPanel() {
  const favs = JSON.parse(localStorage.getItem('ls_favorites') || '[]');
  const toggleBtn = document.getElementById('favToggleBtn');
  const panel = document.getElementById('favPanel');
  if (!toggleBtn || !panel) return;
  if (favs.length === 0) {
    toggleBtn.style.display = 'none';
    panel.classList.remove('show');
    return;
  }
  toggleBtn.style.display = 'flex';
  toggleBtn.innerHTML = '❤️ Favorites (' + favs.length + ')';
  document.getElementById('favItems').innerHTML = favs.map(f =>
    '<div class="fav-panel-item">' + f + '</div>'
  ).join('');
}

function toggleFavPanel() {
  document.getElementById('favPanel').classList.toggle('show');
}

function subscribeNewsletter() {
  const emailEl = document.getElementById('newsletterEmail');
  const noteEl = document.getElementById('newsletterNote');
  if (!emailEl || !noteEl) return;
  const email = emailEl.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    noteEl.textContent = '❌ Please enter a valid email address.';
    noteEl.className = 'newsletter-note error';
    return;
  }
  const existing = localStorage.getItem('ls_newsletter');
  if (existing) {
    noteEl.textContent = '✅ Already subscribed with: ' + existing;
    noteEl.className = 'newsletter-note success';
    return;
  }
  localStorage.setItem('ls_newsletter', email);
  localStorage.setItem('ls_newsletter_date', new Date().toLocaleDateString());
  noteEl.textContent = '🎉 Successfully subscribed! Thank you for joining.';
  noteEl.className = 'newsletter-note success';
  emailEl.value = '';
  emailEl.disabled = true;
  showToast('Newsletter subscription successful!', 'success');
}

function initNewsletter() {
  const subscribed = localStorage.getItem('ls_newsletter');
  const emailEl = document.getElementById('newsletterEmail');
  const noteEl = document.getElementById('newsletterNote');
  if (subscribed && emailEl) {
    emailEl.value = subscribed;
    emailEl.disabled = true;
    if (noteEl) {
      noteEl.textContent = '✅ Subscribed since ' + localStorage.getItem('ls_newsletter_date');
      noteEl.className = 'newsletter-note success';
    }
  }
}
initNewsletter();
initFavoriteButtons();

const ADMIN_CREDENTIALS = { user: 'admin', pass: 'livesphere2025' };
let adminAttempts = 0;
let footerClickCount = 0;
let footerClickTimer = null;

document.getElementById('footerCopy').addEventListener('click', () => {
  footerClickCount++;
  clearTimeout(footerClickTimer);
  footerClickTimer = setTimeout(() => { footerClickCount = 0; }, 2000);
  if (footerClickCount >= 5) {
    footerClickCount = 0;
    openAdminLogin();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === 'A') {
    e.preventDefault();
    openAdminLogin();
  }
});

function openAdminLogin() {
  const session = localStorage.getItem('ls_admin_session');
  if (session && Date.now() - parseInt(session) < 3600000) {
    showAdminPanel();
    return;
  }
  document.getElementById('adminOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  setTimeout(() => document.getElementById('adminUser').focus(), 300);
}

function closeAdminPanel() {
  document.getElementById('adminOverlay').classList.remove('show');
  document.body.style.overflow = '';
  document.getElementById('adminLoginError').textContent = '';
  document.getElementById('adminUser').value = '';
  document.getElementById('adminPass').value = '';
  adminAttempts = 0;
}

document.getElementById('adminPass').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doAdminLogin();
});

function doAdminLogin() {
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();
  const errEl = document.getElementById('adminLoginError');

  if (adminAttempts >= 3) {
    errEl.textContent = '🔒 Too many attempts! Refresh and try again.';
    return;
  }

  if (user === ADMIN_CREDENTIALS.user && pass === ADMIN_CREDENTIALS.pass) {
    localStorage.setItem('ls_admin_session', Date.now());
    document.getElementById('adminOverlay').classList.remove('show');
    document.body.style.overflow = '';
    showAdminPanel();
    adminAttempts = 0;
  } else {
    adminAttempts++;
    errEl.textContent = '❌ Wrong credentials! ' + (3 - adminAttempts) + ' attempts left.';
    document.getElementById('adminPass').value = '';
  }
}

function showAdminPanel() {
  const panel = document.getElementById('adminPanelSection');
  panel.classList.add('show');
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  loadAdminDashboard();
  startAdminPanelClock();
  showToast('Admin panel opened!', 'success');
}

function doAdminLogout() {
  localStorage.removeItem('ls_admin_session');
  document.getElementById('adminPanelSection').classList.remove('show');
  showToast('Logged out successfully!', 'info');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleAdminPass() {
  const el = document.getElementById('adminPass');
  el.type = el.type === 'password' ? 'text' : 'password';
}

function startAdminPanelClock() {
  function update() {
    const el = document.getElementById('adminPanelTime');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' +
      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  update();
  setInterval(update, 1000);
}

function switchAdminTab(tabName, el) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('atab-' + tabName).classList.add('active');
  if (el) el.classList.add('active');
  loadAdminTabData(tabName);
}

function loadAdminTabData(tab) {
  if (tab === 'dashboard') loadAdminDashboard();
  if (tab === 'submissions') aRenderSubs();
  if (tab === 'subscribers') aRenderSubscribers();
  if (tab === 'favorites') aRenderFavorites();
  if (tab === 'analytics') aRenderAnalytics();
}

function aAnimateNum(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let n = 0;
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    n += step;
    if (n >= target) { el.textContent = target; clearInterval(t); }
    else el.textContent = n;
  }, 30);
}

function loadAdminDashboard() {
  const subs = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  const newsletter = localStorage.getItem('ls_newsletter') ? 1 : 0;
  const visits = parseInt(localStorage.getItem('ls_visits') || '0');
  const favs = JSON.parse(localStorage.getItem('ls_favorites') || '[]');

  aAnimateNum('aTotalSub', subs.length);
  aAnimateNum('aTotalNews', newsletter);
  aAnimateNum('aTotalVisits', visits);
  aAnimateNum('aTotalFavs', favs.length);

  const recentEl = document.getElementById('aRecentSubs');
  if (recentEl) {
    if (subs.length === 0) {
      recentEl.innerHTML = '<p style="color:rgba(255,255,255,0.3);padding:16px 0;">No submissions yet.</p>';
    } else {
      recentEl.innerHTML = subs.slice(0, 4).map(s => `
        <div class="a-recent-item">
          <div>
            <div class="a-recent-name">${s.name}</div>
            <div class="a-recent-service">${s.service}</div>
          </div>
          <div class="a-recent-date">${s.date}</div>
        </div>`).join('');
    }
  }

  const serviceCounts = {};
  subs.forEach(s => { serviceCounts[s.service] = (serviceCounts[s.service] || 0) + 1; });
  favs.forEach(f => { serviceCounts[f] = (serviceCounts[f] || 0) + 1; });
  const sorted = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = sorted[0]?.[1] || 1;
  const popEl = document.getElementById('aPopularServices');
  if (popEl) {
    if (sorted.length === 0) {
      popEl.innerHTML = '<p style="color:rgba(255,255,255,0.3);padding:16px 0;">No data yet.</p>';
    } else {
      popEl.innerHTML = sorted.map(([name, count]) => `
        <div class="a-service-bar">
          <div class="a-bar-label">${name}</div>
          <div class="a-bar-track">
            <div class="a-bar-fill" style="width:${(count/max)*100}%"></div>
          </div>
          <div class="a-bar-count">${count}</div>
        </div>`).join('');
    }
  }
}

let aAllSubs = [];

function aRenderSubs() {
  aAllSubs = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  aRenderSubsTable(aAllSubs);
}

function aRenderSubsTable(data) {
  const tbody = document.getElementById('aSubsBody');
  const noMsg = document.getElementById('aNoSubs');
  if (!tbody) return;
  if (data.length === 0) {
    tbody.innerHTML = '';
    if (noMsg) noMsg.style.display = 'block';
    return;
  }
  if (noMsg) noMsg.style.display = 'none';
  tbody.innerHTML = data.map((s, i) => `
    <tr>
      <td><b style="color:#e94560">${i+1}</b></td>
      <td>${s.name}</td>
      <td><span style="background:rgba(233,69,96,0.15);color:#e94560;padding:3px 10px;border-radius:10px;font-size:12px;">${s.service}</span></td>
      <td>${s.date}</td>
      <td>${s.time}</td>
      <td><button class="a-del-btn" onclick="aDeleteSub(${i})">🗑️</button></td>
    </tr>`).join('');
}

function aFilterSubs() {
  const q = document.getElementById('aSearchInput').value.toLowerCase();
  aRenderSubsTable(aAllSubs.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.service.toLowerCase().includes(q) ||
    s.date.toLowerCase().includes(q)
  ));
}

function aDeleteSub(index) {
  const subs = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  subs.splice(index, 1);
  localStorage.setItem('ls_submissions', JSON.stringify(subs));
  aRenderSubs();
  loadAdminDashboard();
  showToast('Submission deleted!', 'success');
}

function aClearSubs() {
  if (confirm('Clear ALL submissions?')) {
    localStorage.removeItem('ls_submissions');
    aRenderSubs();
    loadAdminDashboard();
    showToast('All submissions cleared!', 'success');
  }
}

function aExportCSV() {
  const subs = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  if (subs.length === 0) { showToast('No data to export!', 'error'); return; }
  const csv = ['#,Name,Service,Date,Time',
    ...subs.map((s, i) => `${i+1},${s.name},${s.service},${s.date},${s.time}`)
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'livesphere_submissions.csv';
  a.click();
  showToast('CSV exported!', 'success');
}

function aRenderSubscribers() {
  const email = localStorage.getItem('ls_newsletter');
  const date = localStorage.getItem('ls_newsletter_date');
  const container = document.getElementById('aSubscribersList');
  if (!container) return;
  if (!email) {
    container.innerHTML = '<p class="a-empty">No subscribers yet.</p>';
    return;
  }
  container.innerHTML = `
    <div class="a-sub-item">
      <div class="a-sub-email">
        <div class="a-sub-avatar">${email[0].toUpperCase()}</div>
        <div class="a-sub-info">
          <h4>${email}</h4>
          <p>Subscribed on ${date || 'N/A'}</p>
        </div>
      </div>
      <span style="background:rgba(16,185,129,0.1);color:#34d399;padding:4px 14px;border-radius:15px;font-size:12px;font-weight:600;">✅ Active</span>
    </div>`;
}

function aClearSubscribers() {
  if (confirm('Remove subscriber?')) {
    localStorage.removeItem('ls_newsletter');
    localStorage.removeItem('ls_newsletter_date');
    aRenderSubscribers();
    loadAdminDashboard();
    showToast('Subscriber removed!', 'success');
  }
}

function aExportSubscribers() {
  const email = localStorage.getItem('ls_newsletter');
  if (!email) { showToast('No subscribers!', 'error'); return; }
  const csv = 'Email,Date\n' + email + ',' + (localStorage.getItem('ls_newsletter_date') || '');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'livesphere_subscribers.csv';
  a.click();
  showToast('Exported!', 'success');
}

function aRenderFavorites() {
  const favs = JSON.parse(localStorage.getItem('ls_favorites') || '[]');
  const container = document.getElementById('aFavoritesList');
  if (!container) return;
  if (favs.length === 0) {
    container.innerHTML = '<p class="a-empty">No saved services yet.</p>';
    return;
  }
  const counts = {};
  favs.forEach(f => counts[f] = (counts[f] || 0) + 1);
  container.innerHTML = Object.entries(counts).map(([name, count]) => `
    <div class="a-fav-item">
      <span class="a-fav-name">❤️ ${name}</span>
      <span class="a-fav-count">${count} save${count > 1 ? 's' : ''}</span>
    </div>`).join('');
}

function aRenderAnalytics() {
  const visits = parseInt(localStorage.getItem('ls_visits') || '0');
  const subs = JSON.parse(localStorage.getItem('ls_submissions') || '[]');
  const newsletter = localStorage.getItem('ls_newsletter') ? 1 : 0;

  aAnimateNum('aVisitCount', visits);
  aAnimateNum('aSubCount', newsletter);
  aAnimateNum('aFormCount', subs.length);

  const serviceCounts = {};
  subs.forEach(s => { serviceCounts[s.service] = (serviceCounts[s.service] || 0) + 1; });
  JSON.parse(localStorage.getItem('ls_favorites') || '[]').forEach(f => {
    serviceCounts[f] = (serviceCounts[f] || 0) + 1;
  });

  const sorted = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const chart = document.getElementById('aServiceChart');
  if (!chart) return;

  if (sorted.length === 0) {
    chart.innerHTML = '<p style="color:rgba(255,255,255,0.3);">No data yet.</p>';
    return;
  }

  chart.innerHTML = sorted.map(([name, count]) => `
    <div class="a-service-bar">
      <div class="a-bar-label">${name}</div>
      <div class="a-bar-track">
        <div class="a-bar-fill" style="width:${(count/max)*100}%"></div>
      </div>
      <div class="a-bar-count">${count}</div>
    </div>`).join('');
}

function aClearVisits() {
  if (confirm('Reset visit counter?')) {
    localStorage.removeItem('ls_visits');
    aRenderAnalytics();
    showToast('Visit counter reset!', 'success');
  }
}

const adminSession = localStorage.getItem('ls_admin_session');
if (adminSession && Date.now() - parseInt(adminSession) < 3600000) {
  document.getElementById('adminPanelSection').classList.add('show');
  loadAdminDashboard();
  startAdminPanelClock();
}

