/* =========================================================
   GACHA99 — Home Away From Home
   Interactions: mobile nav, sticky header, scroll reveal,
   scroll-spy, back-to-top, footer year.
   ========================================================= */
(function () {
  'use strict';

  var doc = document;

  /* ---------- Mobile navigation ---------- */
  var burger = doc.getElementById('burger');
  var nav = doc.getElementById('nav');

  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Buka menu navigasi');
    doc.body.classList.remove('nav-open');
  }

  function toggleNav() {
    if (!nav || !burger) return;
    var open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    doc.body.classList.toggle('nav-open', open);
  }

  if (burger) burger.addEventListener('click', toggleNav);

  if (nav) {
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
  }

  doc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  doc.addEventListener('click', function (e) {
    if (!nav || !nav.classList.contains('is-open')) return;
    if (nav.contains(e.target) || (burger && burger.contains(e.target))) return;
    closeNav();
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 860) closeNav();
  });

  /* ---------- Sticky header state + back to top ---------- */
  var header = doc.getElementById('header');
  var toTop = doc.getElementById('totop');

  function onScroll() {
    var y = window.pageYOffset || doc.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 10);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
    spy(y);
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll spy ---------- */
  var links = Array.prototype.slice.call(doc.querySelectorAll('.nav__link[href^="#"]'));
  var sections = links
    .map(function (l) { return doc.querySelector(l.getAttribute('href')); })
    .filter(Boolean);

  function spy(y) {
    if (!sections.length) return;
    var offset = y + 140;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= offset) current = sections[i];
    }
    links.forEach(function (l) {
      l.classList.toggle('is-active', l.getAttribute('href') === '#' + current.id);
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScroll();
      ticking = false;
    });
  }, { passive: true });

  /* ---------- Scroll reveal ---------- */
  var revealables = Array.prototype.slice.call(doc.querySelectorAll('.reveal'));

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 6, 5) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Smooth anchor scroll with header offset ---------- */
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#') return;
    var target = doc.querySelector(id);
    if (!target) return;
    e.preventDefault();
    var top = target.getBoundingClientRect().top + window.pageYOffset - 78;
    window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
    if (history.replaceState) history.replaceState(null, '', id);
  });

  /* ---------- Footer year ---------- */
  var year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Graceful image fallback ---------- */
  Array.prototype.slice.call(doc.images).forEach(function (img) {
    img.addEventListener('error', function () {
      img.style.display = 'none';
    }, { once: true });
  });

  onScroll();
})();
