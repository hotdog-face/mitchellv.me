// Crossfading slideshow for any element with [data-gallery].
// Videos play through before advancing; images show for 4 seconds.
document.querySelectorAll('[data-gallery]').forEach(function (g) {
  var slides = Array.prototype.slice.call(g.children);
  var i = 0;
  function show(n) {
    slides[i].classList.remove('on');
    i = n % slides.length;
    var s = slides[i];
    s.classList.add('on');
    if (s.tagName === 'VIDEO') {
      s.currentTime = 0;
      s.play().catch(function () {});
      s.onended = function () { show(i + 1); };
    } else {
      setTimeout(function () { show(i + 1); }, 4000);
    }
  }
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

// Slideshows from the original Wix layouts: arrows and dots switch slides.
document.querySelectorAll('[data-slideshow]').forEach(function (ss) {
  var slides = ss.querySelectorAll('.wx-slide'), dots = ss.querySelectorAll('.wx-dots button'), i = 0;
  if (slides.length < 2) return;
  function go(n) {
    slides[i].classList.remove('on'); if (dots[i]) dots[i].classList.remove('on');
    i = (n + slides.length) % slides.length;
    slides[i].classList.add('on'); if (dots[i]) dots[i].classList.add('on');
  }
  ss.querySelector('.wx-prev').addEventListener('click', function () { go(i - 1); });
  ss.querySelector('.wx-next').addEventListener('click', function () { go(i + 1); });
  dots.forEach(function (d, n) { d.addEventListener('click', function () { go(n); }); });
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
