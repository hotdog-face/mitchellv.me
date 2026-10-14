// Crossfading slideshow for any element with [data-gallery].
// Videos play through before advancing; images show for 4 seconds.
document.querySelectorAll('[data-gallery]').forEach(function (g) {
  var slides = Array.prototype.filter.call(g.children, function (el) { return el.tagName === 'IMG' || el.tagName === 'VIDEO'; });
  var i = 0, timer = null;
  function show(n) {
    clearTimeout(timer);
    slides[i].classList.remove('on'); if (slides[i].tagName === 'VIDEO') slides[i].pause();
    i = (n + slides.length) % slides.length;
    var s = slides[i];
    s.classList.add('on');
    if (s.tagName === 'VIDEO') {
      s.currentTime = 0;
      s.play().catch(function () {});
      s.onended = function () { show(i + 1); };
    } else {
      timer = setTimeout(function () { show(i + 1); }, 4000);
    }
  }
  var next = g.querySelector('.wx-gallery-next');
  if (next) next.addEventListener('click', function () { show(i + 1); });
  show(0);
});

// Popups: <button data-open="id"> opens <dialog id="id">; clicking the backdrop or [data-close] closes it.
document.querySelectorAll('[data-open]').forEach(function (btn) {
  var dlg = document.getElementById(btn.getAttribute('data-open'));
  if (!dlg) return;
  btn.addEventListener('click', function () { dlg.showModal(); });
  dlg.addEventListener('click', function (e) {
    if (e.target === dlg || e.target.hasAttribute('data-close')) dlg.close();
  });
});

// Slideshows from the original Wix layouts: auto-advance (data-autoplay seconds) with the
// original fade / vertical / horizontal slide transition; arrows and dots switch slides.
document.querySelectorAll('[data-slideshow]').forEach(function (ss) {
  var slides = ss.querySelectorAll('.wx-slide'), dots = ss.querySelectorAll('.wx-dots button'), i = 0, timer;
  if (slides.length < 2) return;
  var mode = ss.getAttribute('data-transition') || 'fade';
  var axis = mode === 'vertical' ? 'Y' : 'X';
  function place(el, pct, animate) {
    if (mode === 'fade') return;
    el.style.transition = animate ? 'transform var(--slide-dur, 1s) ease-in-out' : 'none';
    el.style.transform = 'translate' + axis + '(' + pct + '%)';
  }
  function go(n) {
    var from = slides[i], dir = n > i || (i === slides.length - 1 && n === 0) ? 1 : -1;
    if (n === slides.length && i === slides.length - 1) dir = 1;
    n = (n + slides.length) % slides.length; if (n === i) return;
    var to = slides[n];
    place(to, 100 * dir, false); to.getBoundingClientRect();
    to.classList.add('on'); place(to, 0, true); place(from, -100 * dir, true);
    if (mode === 'fade') from.classList.remove('on');
    else setTimeout(function () { if (slides[i] !== from) from.classList.remove('on'); }, 1100);
    if (dots[i]) dots[i].classList.remove('on'); if (dots[n]) dots[n].classList.add('on');
    i = n; schedule();
  }
  function schedule() {
    var s = +ss.getAttribute('data-autoplay'); clearTimeout(timer);
    if (s && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setTimeout(function () { go(i + 1); }, s * 1000);
  }
  var prev = ss.querySelector('.wx-prev'), next = ss.querySelector('.wx-next');
  if (prev) prev.addEventListener('click', function () { go(i - 1); });
  if (next) next.addEventListener('click', function () { go(i + 1); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); }); });
  schedule();
});

// Transparent animations ship as VP9 WebM (Chrome, Firefox, Edge) and HEVC (Safari).
// Safari can't show WebM transparency, so swap it to the HEVC file there.
(function () {
  var ua = navigator.userAgent;
  var isSafari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS/.test(ua);
  if (!isSafari) return;
  document.querySelectorAll('video[data-hevc]').forEach(function (v) {
    v.innerHTML = ''; v.src = v.getAttribute('data-hevc'); v.load(); v.play().catch(function () {});
  });
})();

// Section links (#about, #work, #contact): the phone layout has its own anchors
// with an "-m" suffix, so jump to whichever copy is actually visible.
(function () {
  function target(hash) {
    var el = document.getElementById(hash.slice(1));
    if (el && el.offsetParent === null) el = document.getElementById(hash.slice(1) + '-m') || el;
    return el;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a || a.pathname.replace(/index\.html$/, '') !== location.pathname.replace(/index\.html$/, '')) return;
    var el = target(a.hash); if (!el) return;
    e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', a.hash);
  });
  if (location.hash) { var el = target(location.hash); if (el) setTimeout(function () { el.scrollIntoView(); }, 50); }
})();

// Highlight the section dot for whatever is on screen.
(function () {
  var dots = document.querySelectorAll('.wx-dotnav a'); if (!dots.length) return;
  function update() {
    var cur = 0;
    dots.forEach(function (d, i) { var t = d.hash === '#top' ? document.body : document.getElementById(d.hash.slice(1)); if (t && t.getBoundingClientRect().top < innerHeight / 2) cur = i; });
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
  }
  addEventListener('scroll', update, { passive: true }); update();
})();

// Scroll-in animations: reveal each [data-anim] element the first time it enters the screen.
(function () {
  var els = document.querySelectorAll('[data-anim]'); if (!els.length) return;
  if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('anim-in'); }); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('anim-in'); io.unobserve(en.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  // elements inside a slideshow are revealed together when the slideshow scrolls into view,
  // so slides that are not showing yet don't stay hidden
  var shows = new Set();
  els.forEach(function (e) { var ss = e.closest('[data-slideshow]'); if (ss) shows.add(ss); else io.observe(e); });
  shows.forEach(function (ss) {
    var o = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { ss.querySelectorAll('[data-anim]').forEach(function (e) { e.classList.add('anim-in'); }); o.disconnect(); }
    }, { rootMargin: '0px 0px -8% 0px' });
    o.observe(ss);
  });
})();
