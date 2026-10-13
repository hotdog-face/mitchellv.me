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
