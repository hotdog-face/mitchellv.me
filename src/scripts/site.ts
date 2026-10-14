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
    if (items.length) items.forEach((el, n) => el.classList.toggle('on', n === 0));
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
        if (!cur.src && cur.dataset.lazySrc) { cur.src = cur.dataset.lazySrc; cur.load(); }
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

// ---------------------------------------------------------------------------
// Process steps: move the highlight (and its number badge) to the next step every N seconds.
function initSteps() {
  document.querySelectorAll<HTMLElement>('[data-steps]').forEach(el => {
    const items = Array.from(el.querySelectorAll<HTMLElement>('li'));
    const marker = el.querySelector<HTMLElement>('.marker');
    const num = el.querySelector<HTMLElement>('.num');
    if (!items.length || !marker) return;
    const block = el.closest('[data-steps-block]') ?? el;
    const dots = Array.from(block.querySelectorAll<HTMLElement>('.dots span'));
    let i = 0, timer = 0;
    const place = () => {
      const li = items[i];
      marker.style.setProperty('--y', li.offsetTop + 'px');
      marker.style.setProperty('--hgt', li.offsetHeight + 'px');
      if (num) num.textContent = String(i + 1);
      dots.forEach((d, n) => d.classList.toggle('on', n === i));
    };
    const s = Number(el.dataset.steps);
    const go = (n: number) => { i = (n + items.length) % items.length; place(); schedule(); };
    const schedule = () => { clearTimeout(timer); if (s && !reducedMotion) timer = window.setTimeout(() => go(i + 1), s * 1000); };
    block.querySelectorAll<HTMLElement>('[data-step]').forEach(b => b.addEventListener('click', () => go(i + Number(b.dataset.step))));
    place(); schedule();
    addEventListener('resize', place);
  });
}

// ---------------------------------------------------------------------------
// Looping videos: <video data-lazy-src="…" data-autoplay> loads and plays only when it comes
// near the screen, and pauses when it leaves, so long pages stay light.
function initLazyVideo() {
  const vids = Array.from(document.querySelectorAll<HTMLVideoElement>('video[data-lazy-src]'));
  if (!vids.length) return;
  const start = (v: HTMLVideoElement) => {
    if (!v.src) { v.src = v.dataset.lazySrc!; v.load(); }
    if (v.hasAttribute('data-autoplay') && !reducedMotion) v.play().catch(() => {});
  };
  if (!('IntersectionObserver' in window)) { vids.forEach(start); return; }
  const io = new IntersectionObserver(entries => {
    for (const en of entries) {
      const v = en.target as HTMLVideoElement;
      if (en.isIntersecting) start(v); else if (v.src) v.pause();
    }
  }, { rootMargin: '300px 0px' });
  vids.forEach(v => io.observe(v));
}

// ---------------------------------------------------------------------------
// Compare sliders: the range input drives --pos, which clips the "before" image.
function initCompare() {
  document.querySelectorAll<HTMLElement>('[data-compare]').forEach(el => {
    const range = el.querySelector<HTMLInputElement>('.cmp-range');
    if (!range) return;
    const set = () => el.style.setProperty('--pos', range.value + '%');
    range.addEventListener('input', set);
    set();
  });
}

// ---------------------------------------------------------------------------
// Count-up stats: <strong data-count>+29%</strong> counts up from zero the first time it
// comes into view. Values that aren't a single number (like "14 → 5") are left alone.
function initCountUp() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-count]'));
  if (!els.length || reducedMotion || !('IntersectionObserver' in window)) return;
  const pattern = /^([+~]?)(\d+(?:\.\d+)?)(%?)$/;
  const run = (el: HTMLElement) => {
    const m = el.textContent!.trim().match(pattern);
    if (!m) return;
    const [, pre, num, post] = m;
    const target = parseFloat(num), decimals = (num.split('.')[1] || '').length, t0 = performance.now(), dur = 1100;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = pre + (target * eased).toFixed(decimals) + post;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(entries => {
    for (const en of entries) if (en.isIntersecting) { run(en.target as HTMLElement); io.unobserve(en.target); }
  }, { threshold: 0.6 });
  els.forEach(el => io.observe(el));
}

// ---------------------------------------------------------------------------
// Email menus (EmailMenu.astro): the button opens a small menu instead of a bare mailto link.
function initEmailMenus() {
  const menus = Array.from(document.querySelectorAll<HTMLElement>('[data-email-menu]'));
  if (!menus.length) return;
  const closeAll = (except?: HTMLElement) => menus.forEach(m => {
    if (m === except) return;
    m.querySelector<HTMLElement>('.em-pop')!.hidden = true;
    m.querySelector('[data-email-toggle]')!.setAttribute('aria-expanded', 'false');
  });
  menus.forEach(m => {
    const toggle = m.querySelector<HTMLElement>('[data-email-toggle]')!;
    const pop = m.querySelector<HTMLElement>('.em-pop')!;
    toggle.addEventListener('click', e => {
      e.preventDefault();
      const open = pop.hidden;
      closeAll(m);
      pop.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) pop.querySelector<HTMLElement>('button, a')?.focus();
    });
    const copy = m.querySelector<HTMLButtonElement>('[data-email-copy]');
    copy?.addEventListener('click', async () => {
      const label = copy.querySelector('span')!;
      try { await navigator.clipboard.writeText(copy.dataset.emailCopy!); }
      catch { const r = document.createRange(); r.selectNodeContents(m.querySelector('.em-addr')!); getSelection()?.removeAllRanges(); getSelection()?.addRange(r); }
      label.textContent = 'Copied!'; copy.classList.add('ok');
      setTimeout(() => { label.textContent = 'Copy address'; copy.classList.remove('ok'); }, 1600);
    });
  });
  document.addEventListener('click', e => { if (!(e.target as Element).closest('[data-email-menu]')) closeAll(); });
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = menus.find(m => !m.querySelector<HTMLElement>('.em-pop')!.hidden);
    if (open) { closeAll(); open.querySelector<HTMLElement>('[data-email-toggle]')!.focus(); }
  });
}

// ---------------------------------------------------------------------------
// Hover clips (Selected work): a short loop fades in over the cover while the pointer is on the
// card. Mouse and trackpad only; touch devices and reduced-motion visitors keep the still image.
function initHoverClips() {
  if (reducedMotion || !matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll<HTMLVideoElement>('video[data-hover-src]').forEach(v => {
    const card = v.closest<HTMLElement>('.case') ?? v.parentElement!;
    v.addEventListener('playing', () => v.classList.add('playing'));
    card.addEventListener('pointerenter', () => {
      if (!v.src) { v.src = v.dataset.hoverSrc!; v.load(); }
      v.play().catch(() => {});
    });
    card.addEventListener('pointerleave', () => { v.classList.remove('playing'); v.pause(); });
  });
}

// ---------------------------------------------------------------------------
// Click-to-zoom (work pages): images open full screen at their largest size. Arrow keys move
// between the page's images; Escape, the close button or a click on the backdrop closes it.
function initZoom() {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('.work-body .m-img img, .work-body .m-grid img'));
  if (!imgs.length) return;
  const largest = (img: HTMLImageElement) => {
    const set = img.getAttribute('srcset');
    if (!set) return img.currentSrc || img.src;
    return set.split(',').map(p => p.trim().split(/\s+/)).sort((a, b) => parseInt(b[1]) - parseInt(a[1]))[0][0];
  };
  const dlg = document.createElement('dialog');
  dlg.className = 'zoom';
  dlg.innerHTML = '<img alt=""><p class="zoom-cap"></p><button type="button" class="zoom-close" aria-label="Close">&times;</button>' +
    '<button type="button" class="zoom-prev" aria-label="Previous image">&lsaquo;</button><button type="button" class="zoom-next" aria-label="Next image">&rsaquo;</button>';
  document.body.append(dlg);
  const big = dlg.querySelector('img')!, cap = dlg.querySelector<HTMLElement>('.zoom-cap')!;
  let i = 0;
  const show = (n: number) => {
    i = (n + imgs.length) % imgs.length;
    big.src = largest(imgs[i]); big.alt = imgs[i].alt; cap.textContent = imgs[i].alt;
    dlg.classList.toggle('single', imgs.length < 2);
  };
  imgs.forEach((img, n) => {
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', (img.alt ? img.alt + '. ' : '') + 'Open full size');
    const open = () => { show(n); dlg.showModal(); };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  dlg.querySelector('.zoom-prev')!.addEventListener('click', () => show(i - 1));
  dlg.querySelector('.zoom-next')!.addEventListener('click', () => show(i + 1));
  dlg.querySelector('.zoom-close')!.addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg || e.target === big) dlg.close(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'ArrowRight') show(i + 1); if (e.key === 'ArrowLeft') show(i - 1); });
}

// ---------------------------------------------------------------------------
// Case study section menu: built from the page's section headings (key ones only), highlights the
// section on screen, and a thin bar shows how far through the case study the reader is.
function initSectionNav() {
  const nav = document.querySelector<HTMLElement>('[data-sect-nav]');
  const body = document.querySelector<HTMLElement>('.work-body');
  if (!nav || !body) return;
  const key = /problem|overview|brief|what i did|competit|iteration|prototyp|grey box|mapping|testing|research|shaped|map for|celebrat|final layout|purchase flow|live in|launch|ship it|results|learned/i;
  const heads = Array.from(body.querySelectorAll<HTMLHeadingElement>('.m-text h3')).filter(h => key.test(h.textContent!)).slice(0, 10);
  if (heads.length < 3) { nav.hidden = true; return; }
  const inner = nav.querySelector('.sect-inner')!;
  const links = heads.map(h => {
    h.id ||= 's-' + h.textContent!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent!.replace(/^Chapter two:\s*/i, '').replace(/:.*$/, '');
    inner.append(a);
    return a;
  });
  const bar = nav.querySelector<HTMLElement>('.read-progress')!;
  const update = () => {
    const r = body.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.4 - r.top) / r.height));
    bar.style.setProperty('--p', p.toFixed(4));
    let cur = -1;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top < innerHeight * 0.35) cur = i; });
    links.forEach((a, i) => a.classList.toggle('on', i === cur));
    if (cur >= 0) { const a = links[cur]; const box = inner as HTMLElement; if (a.offsetLeft < box.scrollLeft || a.offsetLeft + a.offsetWidth > box.scrollLeft + box.clientWidth) box.scrollTo({ left: a.offsetLeft - 16, behavior: 'smooth' }); }
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  update();
}

initReveal();
initLazyVideo();
initEmailMenus();
initHoverClips();
initZoom();
initSectionNav();
initCompare();
initCountUp();
initSteps();
initSlideshows();
initGalleries();
initPopups();
initAlphaVideo();
initDotNav();
