// The curated case studies: what the home page leads with, the "Case studies" section on /work,
// and the "At a glance" summary at the top of each case study. Edit facts here, in one place.
// Order matters: it is the order on the home page and the "Next case study" order.

export interface Stat { value: string; label: string }

export interface CaseStudy {
  href: string;
  title: string;
  company: string;
  product: string;
  year: string;
  /** One or two sentences: the problem and what you did. Shown on cards. */
  summary: string;
  role: string;
  team: string;
  platforms: string;
  impact: Stat[];
  /** Cover image name (see Img.astro). */
  image: string;
  /** Optional image for the home page's Selected work, used instead of `image`. */
  homeImage?: string;
  /** The home image is a cutout on a transparent background: show it without a frame. */
  homeImageAlpha?: boolean;
  /**
   * Short loop that plays over the home image on hover (public/assets/hover/<name>.mp4).
   * `box` places it in % of the image (left, top, width, height), e.g. inside a device screen;
   * `fit: 'contain'` letterboxes it on the card's background instead of cropping.
   */
  hoverClip?: { name: string; box?: [number, number, number, number]; fit?: 'cover' | 'contain' };
  /** Shown in "Selected work" on the home page. */
  featured: boolean;
}

export const caseStudies: CaseStudy[] = [
  {
    href: '/work/card-dex',
    title: 'Card Dex & Research Missions',
    company: 'The Pokémon Company International',
    product: 'Pokémon TCG Live',
    year: '2025 - 2026',
    summary: 'Collecting a missing card took 14 steps across the shop and deck builder. I designed Card Dex, a home for every card you own, and Research Missions, which turns collecting into goals worth chasing.',
    role: 'Senior UX Designer, primary UX designer on the feature',
    team: 'Game designer, artist, contract UX designer, engineering, UX research',
    platforms: 'Desktop and mobile',
    impact: [
      { value: '14 → 5', label: 'steps to get a missing card' },
      { value: '61%', label: 'of card exchanges now happen in Card Dex' },
      { value: '+29%', label: 'card exchanges per player after launch' },
    ],
    image: 'work/card-dex/cover',
    homeImage: 'cases/card-dex-window',
    homeImageAlpha: true,
    hoverClip: { name: 'card-dex', box: [2.24, 5.32, 95.56, 89.11] },
    featured: true,
  },
  {
    href: '/work/build-battle',
    title: 'Build & Battle',
    company: 'The Pokémon Company International',
    product: 'Pokémon TCG Live',
    year: '2024',
    summary: 'A new game mode that brings the in-store prerelease tournament online, so newer players have a friendlier way to build a deck and battle than Ranked.',
    role: 'Senior UX Designer, UX for the whole mode',
    team: 'Game designer, art, engineering',
    platforms: 'Mobile and desktop',
    impact: [
      { value: '16%', label: 'of weekly players joined the launch event' },
      { value: '~80%', label: 'of started rounds finished' },
      { value: '40%', label: 'of rounds played across multiple sessions' },
    ],
    image: 'work/build-battle/cover',
    hoverClip: { name: 'build-battle', fit: 'contain' },
    featured: true,
  },
  {
    href: '/work/pokemon-tv',
    title: 'Pokémon TV on Nintendo Switch',
    company: 'The Pokémon Company International',
    product: 'Pokémon TV',
    year: '2021',
    summary: 'Pokémon TV was web-only, which left out kids on Nintendo Switch. I designed the Switch app, a free streaming service built for controllers, touch and young viewers.',
    role: 'UX/UI Designer, design through launch',
    team: 'R&D team with engineering, prototyped in Unity',
    platforms: 'Nintendo Switch',
    impact: [
      { value: '+33.5%', label: 'monthly active users across platforms' },
    ],
    image: 'cases/pokemon-tv',
    homeImage: 'cases/pokemon-tv-switch',
    homeImageAlpha: true,
    hoverClip: { name: 'pokemon-tv', box: [18.03, 8.05, 63.54, 85.09] },
    featured: true,
  },
  {
    href: '/work/bfc-store-revamp',
    title: 'Big Fish Casino Store Revamp',
    company: 'Big Fish Games',
    product: 'Big Fish Casino',
    year: '',
    summary: "Big Fish Casino is a top-30 grossing social casino app, but its store hadn't kept up. I redesigned the store's interaction and visual design from the ground up.",
    role: 'UX/UI Designer, research through production',
    team: 'Product managers, engineering, art, effects animation, marketing',
    platforms: 'iOS and Android',
    impact: [
      { value: '+38.4%', label: 'sales over the previous store' },
    ],
    image: 'cases/bfc',
    hoverClip: { name: 'bfc' },
    featured: true,
  },
  {
    href: '/work/reeltown-slots',
    title: 'ReelTown Slots Store Revamp',
    company: 'Big Fish Games',
    product: 'ReelTown Slots',
    year: '',
    summary: 'Brought in to improve usability, I started with the store: competitor research and rounds of wireframes that got a whole team to agree on one design.',
    role: 'UX Designer, wireframes and usability',
    team: 'Product team and stakeholders',
    platforms: 'iOS and Android',
    impact: [],
    image: 'cases/reeltown',
    featured: false,
  },
];

/** Builds: side projects I design and build myself, in the order shown. */
export const lab = ['/work/vitaos', '/work/hollowtide', '/work/classic-mac', '/work/mr2-dash', '/work/gameplay-spotlight', '/work/vita-agent-bridge', '/work/retro-tv'];

export const caseStudyFor = (path: string) => caseStudies.find(c => c.href === path.replace(/\/$/, ''));

/** The next featured case study, wrapping around. Non-featured case studies point to the first one. */
export function nextCaseStudy(path: string) {
  const featured = caseStudies.filter(c => c.featured);
  const here = path.replace(/\/$/, '');
  if (!caseStudies.some(c => c.href === here)) return undefined;
  const i = featured.findIndex(c => c.href === here);
  return featured[(i + 1) % featured.length];
}

/** Shared-element name so a project's title glides between its card and its page (see global.css). */
export const vtName = (href: string) => 'p-' + href.replace(/^\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-$/, '');
