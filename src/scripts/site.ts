// Site-wide behavior. Each block is independent and does nothing if its markup isn't on the page.

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------------------------------------------------------------------------
// Scroll-in animations: [data-anim] elements appear the first time they enter the screen.
// Elements inside a slideshow are revealed together with the slideshow, so slides
// that aren't showing yet never stay hidden.
function initReveal() {
  const els = document.querySelectorAll<HTMLElement>('[data-anim]');
  if (!els.length) return;
  const show = (e: Element) => e.classList.add('anim-in');
  if (!('IntersectionObserver' in window) || reducedMotion) { els.forEach(show); return; }
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      if (!en.isIntersecting) continue;
      const t = en.target;
      if (t.matches('[data-slideshow]')) t.querySelectorAll('[data-anim]').forEach(show);
      else show(t);
      io.unobserve(t);
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  const shows = new Set<Element>();
  els.forEach(e => { const ss = e.closest('[data-slideshow]'); if (ss) shows.add(ss); else io.observe(e); });
  shows.forEach(ss => io.observe(ss));
}

// ---------------------------------------------------------------------------
// Slideshows: <div data-slideshow data-autoplay="3" data-transition="vertical|horizontal|fade">
// containing .slide children, optional .ss-prev / .ss-next buttons and .ss-dots buttons.
function initSlideshows() {
  document.querySelectorAll<HTMLElement>('[data-slideshow]').forEach(ss => {
    const slides = Array.from(ss.querySelectorAll<HTMLElement>(':scope > .slides > .slide'));
    const dots = Array.from(ss.querySelectorAll<HTMLButtonElement>('.ss-dots button'));
    if (slides.length < 2) return;
    const mode = ss.dataset.transition || 'fade';
    const axis = mode === 'vertical' ? 'Y' : 'X';
    let i = 0, timer = 0;

    const move = (el: HTMLElement, pct: number, animate: boolean) => {
      if (mode === 'fade') return;
      el.style.transition = animate ? 'transform var(--slide-dur, 1s) ease-in-out' : 'none';
      el.style.transform = `translate${axis}(${pct}%)`;
    };
    const go = (n: number, dir = 1) => {
      n = (n + slides.length) % slides.length;
      if (n === i) return;
      const from = slides[i], to = slides[n];
      move(to, 100 * dir, false);
      to.getBoundingClientRect();
      to.classList.add('on');
      move(to, 0, true);
      move(from, -100 * dir, true);
      if (mode === 'fade') from.classList.remove('on');
      else setTimeout(() => { if (slides[i] !== from) from.classList.remove('on'); }, 1100);
      dots[i]?.classList.remove('on'); dots[n]?.classList.add('on');
      i = n; schedule();
    };
    const schedule = () => {
      clearTimeout(timer);
      const s = Number(ss.dataset.autoplay);
      if (s && !reducedMotion) timer = window.setTimeout(() => go(i + 1), s * 1000);
    };
    ss.querySelector('.ss-prev')?.addEventListener('click', () => go(i - 1, -1));
    ss.querySelector('.ss-next')?.addEventListener('click', () => go(i + 1));
    dots.forEach((d, n) => d.addEventListener('click', () => go(n, n > i ? 1 : -1)));
    schedule();
  });
}

// ---------------------------------------------------------------------------
// Crossfading media gallery (Pokémon TV hero): videos play through, images show 4s.
function initGalleries() {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(g => {
    const items = Array.from(g.querySelectorAll<HTMLElement>(':scope > img, :scope > video, :scope > picture'));
    if (!items.length) return;
    let i = 0, timer = 0;
    const show = (n: number) => {
      clearTimeout(timer);
      const prev = items[i];
      prev.classList.remove('on');
      if (prev instanceof HTMLVideoElement) prev.pause();
      i = (n + items.length) % items.length;
      const cur = items[i];
      cur.classList.add('on');
      if (cur instanceof HTMLVideoElement) {
        cur.currentTime = 0;
        cur.play().catch(() => {});
        cur.onended = () => show(i + 1);
      } else timer = window.setTimeout(() => show(i + 1), 4000);
    };
    g.querySelector('.gallery-next')?.addEventListener('click', () => show(i + 1));
    show(0);
  });
}

// ---------------------------------------------------------------------------
// Popups: <button data-open="id"> opens <dialog id="id">; backdrop click or [data-close] closes it.
function initPopups() {
  document.querySelectorAll<HTMLElement>('[data-open]').forEach(btn => {
    const dlg = document.getElementById(btn.dataset.open!) as HTMLDialogElement | null;
    if (!dlg) return;
    btn.addEventListener('click', () => dlg.showModal());
    dlg.addEventListener('click', e => {
      const t = e.target as HTMLElement;
      if (t === dlg || t.hasAttribute('data-close')) dlg.close();
    });
  });
}

// ---------------------------------------------------------------------------
// Transparent animations ship as VP9 WebM (Chrome, Firefox, Edge) and HEVC (Safari).
function initAlphaVideo() {
  const ua = navigator.userAgent;
  const safari = /Safari\//.test(ua) && !/Chrome|Chromium|CriOS|Edg|Firefox|FxiOS/.test(ua);
  if (!safari) return;
  document.querySelectorAll<HTMLVideoElement>('video[data-hevc]').forEach(v => {
    v.innerHTML = ''; v.src = v.dataset.hevc!; v.load(); v.play().catch(() => {});
  });
}

// ---------------------------------------------------------------------------
// Section dots on the home page: highlight the section that's on screen.
function initDotNav() {
  const dots = Array.from(document.querySelectorAll<HTMLAnchorElement>('.dot-nav a'));
  if (!dots.length) return;
  const update = () => {
    let cur = 0;
    dots.forEach((d, i) => {
      const t = d.hash === '#top' ? document.body : document.getElementById(d.hash.slice(1));
      if (t && t.getBoundingClientRect().top < innerHeight / 2) cur = i;
    });
    dots.forEach((d, i) => d.classList.toggle('on', i === cur));
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

initReveal();
initSlideshows();
initGalleries();
initPopups();
initAlphaVideo();
initDotNav();
