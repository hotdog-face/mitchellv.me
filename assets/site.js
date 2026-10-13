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
