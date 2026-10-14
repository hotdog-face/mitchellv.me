// Helpers for the /work section (projects brought over from Behance).
import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'work'>['data'];

/** All projects in the order shown on /work (also the prev/next order). */
export async function getWork(): Promise<Project[]> {
  return (await getCollection('work')).map(e => e.data).sort((a, b) => a.order - b.order);
}

/** A project card: everything a grid needs to link to one project. */
export interface Card { href: string; title: string; line: string; image: string; note?: string }

// The case studies live in src/pages/*.mdx rather than the work collection.
// `after` places each one in the card order (between work projects of that order and the next).
const caseStudies: (Card & { after: number })[] = [
  { href: '/pokemon-tv', title: 'Pokémon TV for Nintendo Switch', line: '2021 · UX/UI · Case Study', image: 'cases/pokemon-tv', after: 0 },
  { href: '/bfc-store-revamp', title: 'Big Fish Casino Store Revamp', line: 'Big Fish Casino · UX/UI · Case Study', image: 'cases/bfc', after: 0 },
  { href: '/reeltown-slots', title: 'ReelTown Slots Store Revamp', line: 'ReelTown Slots · UX/UI · Case Study', image: 'cases/reeltown', after: 0 },
];

/** Every project on the site (case studies and work pages), newest first. Used by /work and the home page. */
export async function getCards(): Promise<Card[]> {
  const work = (await getWork()).map(p => ({ href: `/work/${p.slug}`, title: p.title, line: p.card.line, image: `work/${p.slug}/${p.card.image}`, order: p.order }));
  const cases = caseStudies.map(({ after, ...c }, i) => ({ ...c, order: after + 0.1 * (i + 1) }));
  return [...work, ...cases].sort((a, b) => a.order - b.order).map(({ order, ...c }) => c);
}

export const CANVAS = 1400; // max width of the module column (--canvas in work.css)

/** `sizes` for a single image that is shown at most `width` px wide inside the canvas. */
export function imageSizes(width: number) {
  const w = Math.min(width, CANVAS);
  return `(min-width: ${w}px) ${w}px, 100vw`;
}

/**
 * `sizes` for each item of a justified grid row. Mirrors work.css: items have
 * flex-basis ratio × row height and grow in proportion to their ratio, so each
 * item ends up lineWidth × ratio / (sum of ratios on its line).
 */
export function gridSizes(ratios: number[]): string[] {
  const share = (lineW: number, rowH: number) => {
    const out: number[] = [];
    let line: number[] = [];
    const flush = () => { const sum = line.reduce((s, i) => s + ratios[i], 0); line.forEach(i => (out[i] = ratios[i] / sum)); line = []; };
    let used = 0;
    ratios.forEach((r, i) => {
      if (line.length && used + r * rowH > lineW) { flush(); used = 0; }
      line.push(i); used += r * rowH;
    });
    flush();
    return out;
  };
  const vw = (f: number) => `${Math.ceil(f * 100)}vw`;
  // breakpoints and row heights from work.css; a typical width stands in for each range
  const phone = share(375, 110), tablet = share(768, 150), laptop = share(1100, 260), wide = share(CANVAS, 260);
  return ratios.map((_, i) =>
    `(max-width: 480px) ${vw(phone[i])}, (max-width: 820px) ${vw(tablet[i])}, (min-width: ${CANVAS}px) ${Math.ceil(wide[i] * CANVAS)}px, ${vw(laptop[i])}`);
}
