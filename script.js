/* ============================================================
   ECX PAY — Landing Page • script.js
   ============================================================ */

(() => {
  'use strict';

  /* ---------- 1) Personalização por prefeitura (URL params) ---------- */
  const params = new URLSearchParams(window.location.search);
  const prefeituraRaw = params.get('prefeitura');
  const estadoRaw = params.get('estado');

  const prefeitura = prefeituraRaw ? decodeURIComponent(prefeituraRaw).trim() : 'sua prefeitura';
  const estado = estadoRaw ? decodeURIComponent(estadoRaw).trim().toUpperCase() : '';

  const prefeituraDisplay = prefeitura
    + (estado && prefeituraRaw ? ` (${estado})` : '');

  document.querySelectorAll('[data-prefeitura]').forEach(el => {
    el.textContent = prefeituraDisplay;
  });

  // Atualiza title se prefeitura customizada
  if (prefeituraRaw) {
    document.title = `ECX Pay — Cartão de benefícios para servidores de ${prefeitura}`;
  }

  /* ---------- 2) Reveal on scroll (IntersectionObserver) ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // pequeno stagger entre elementos visíveis ao mesmo tempo
          setTimeout(() => entry.target.classList.add('is-visible'), idx * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- 3) CountUp animation (vanilla, requestAnimationFrame) ---------- */
  function formatNumber(n) {
    return Math.round(n).toLocaleString('pt-BR');
  }

  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10) || 0;
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);
      const value = target * eased;
      el.textContent = prefix + formatNumber(value) + suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const countEls = document.querySelectorAll('[data-countup]');
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countEls.forEach(el => cio.observe(el));
  } else {
    countEls.forEach(animateCount);
  }

  /* ---------- 4) Tabs do app demo ---------- */
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  const screens = document.querySelectorAll('.app-screen');

  function activateTab(target) {
    tabs.forEach(t => {
      const active = t.dataset.tab === target;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    panels.forEach(p => p.classList.toggle('is-active', p.dataset.panel === target));
    screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === target));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  });

  // Auto-rotate as tabs while user idles in section
  let autoTabTimer = null;
  let autoTabIndex = 0;
  const tabOrder = Array.from(tabs).map(t => t.dataset.tab);

  function startAutoTab() {
    stopAutoTab();
    autoTabTimer = setInterval(() => {
      autoTabIndex = (autoTabIndex + 1) % tabOrder.length;
      activateTab(tabOrder[autoTabIndex]);
    }, 4000);
  }
  function stopAutoTab() {
    if (autoTabTimer) clearInterval(autoTabTimer);
    autoTabTimer = null;
  }

  tabs.forEach(t => t.addEventListener('click', stopAutoTab));

  const appDemo = document.getElementById('app-demo');
  if (appDemo && 'IntersectionObserver' in window) {
    const aio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) startAutoTab();
        else stopAutoTab();
      });
    }, { threshold: 0.4 });
    aio.observe(appDemo);
  }

  /* ---------- 5) Animar ring AnteciPay quando visível ---------- */
  const rings = document.querySelectorAll('.ring__fg');
  if ('IntersectionObserver' in window) {
    const rio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-anim');
      });
    }, { threshold: 0.4 });
    rings.forEach(r => rio.observe(r));
  } else {
    rings.forEach(r => r.classList.add('is-anim'));
  }

  /* ---------- 6) Vídeo YouTube — lazy load (click-to-play) ---------- */
  const videoThumb = document.getElementById('video-thumb');
  const videoWrap = document.getElementById('video-wrap');
  if (videoThumb && videoWrap) {
    videoThumb.addEventListener('click', () => {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('src', 'https://www.youtube.com/embed/cxlMMSJ4cUQ?autoplay=1&rel=0');
      iframe.setAttribute('title', 'ECX Pay — vídeo institucional');
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'lazy');
      videoWrap.replaceChild(iframe, videoThumb);
    });
  }

  /* ---------- 7) Tabela comparativa: data-label para mobile ---------- */
  const compareRows = document.querySelectorAll('.compare-row:not(.compare-row--head)');
  const headLabels = ['Recurso', 'ECX Pay', 'Tradicionais', 'Flexíveis'];
  compareRows.forEach(row => {
    row.querySelectorAll('.compare-cell').forEach((cell, i) => {
      cell.setAttribute('data-label', headLabels[i] || '');
    });
  });

  /* ---------- 8) Cartão 3D: tilt no mouse ---------- */
  const card3dStage = document.querySelector('.card-3d-stage');
  const card3d = document.querySelector('.card-3d');
  if (card3dStage && card3d && window.matchMedia('(hover: hover)').matches) {
    card3dStage.addEventListener('mousemove', (e) => {
      const rect = card3dStage.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card3d.style.animation = 'none';
      card3d.style.transform = `rotateY(${dx * -22}deg) rotateX(${dy * 14}deg)`;
    });
    card3dStage.addEventListener('mouseleave', () => {
      card3d.style.animation = '';
      card3d.style.transform = '';
    });
  }

  /* ---------- 9) Smooth scroll para âncoras (com offset da barra sticky) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const barH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--bar-h'), 10) || 44;
      const top = target.getBoundingClientRect().top + window.pageYOffset - barH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
