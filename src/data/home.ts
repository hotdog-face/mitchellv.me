// Everything the home page says and shows. Edit text, links and images here;
// the layout lives in src/components/home/*.astro.

export const hero = {
  name: "I'm Mitchell",
  role: 'Senior UX/UI Designer at The Pokémon Company International',
  background: 'bff7d9c7',
};

export const about = {
  process: ['EMPATHIZE', 'DEFINE', 'IDEATE', 'PROTOTYPE', 'TEST'],
  bio: [
    "I'm a senior UX/UI designer with 10 years in the craft and 14 in games. At The Pokémon Company International, I designed Card Dex and Research Missions, the systems Pokémon TCG Live players use to collect cards, and launched Pokémon TV on Nintendo Switch. Before that, I designed for Amazon's Mobile Games Experience team and Big Fish Games.",
    "I start with the people I'm designing for: research, quick prototypes, and testing early and often. Then I use data to make sure the work moves the business too. Card Dex helped the game reach its 2025 retention goal, and my Big Fish Casino store redesign lifted sales 38.4%. With a background in art and animation, I care about craft, and I prototype in code to test ideas for real.",
  ],
  services: 'Product Strategy / UX Research / Prototyping / Interaction Design / Visual Design / Design Systems / Motion / Art Direction',
  resume: '/resume.pdf',
};

// The three featured projects, in order. `media` describes the artwork beside the text.
export const featured = [
  {
    title: 'Pokémon TV',
    href: '/pokemon-tv',
    text: "Pokémon TV was web-only, which left out a big part of its audience: kids on Nintendo Switch. I designed the Switch app, a free streaming service with no purchases. It had to be easy for young viewers to navigate while surfacing a huge library of Pokémon shows and movies. After launch, monthly active users across all platforms grew 33.5%.",
    media: 'switch',
  },
  {
    title: 'BFC Store Revamp',
    href: '/bfc-store-revamp',
    text: "Big Fish Casino is a top-30 grossing social casino app, but its store hadn't kept up. I redesigned the store's interaction and visual design from the ground up, making purchasing more intuitive and rewarding. Sales went up 38.4% over the previous store.",
    media: 'phone-video',
  },
  {
    title: 'Bug Brite',
    href: '/work/bug-brite',
    text: "After Big Fish Games, I teamed up with two friends to build games around our own product vision. Bug Brite, a hyper-casual mobile game, was our first release.",
    media: 'phone-image',
  },
] as const;

// Project tiles: `image` is the normal state, `hover` shows the label, `pressed` the click state.
// An entry with `video` plays a looping clip in place of the image.
export const tiles = [
  { href: '/work/amazon-game-on', label: 'Amazon Game On', image: 'c78ea328', hover: 'b9a73926', pressed: '85374a10' },
  { href: '/bfc-store-revamp', label: 'Neon Store', video: 'f4d04afa', hover: '74e95b3b' },
  { href: '/work/vip-revamp', label: 'VIP Revamp', image: '6fb9c652', hover: 'bb2aaab0' },
  { href: '/work/logo-collection', label: 'Branding', image: 'e13a6b12', hover: 'a7f43057' },
  { href: '/work/sunset-riches-map', label: 'SSR Saga Map', video: '43b93ad8', hover: 'b3d96165' },
  { href: '/work/dragons-wealth', label: 'Dragons Wealth', image: 'c3766fa6', hover: '5aa9153f' },
];

// Hover labels for the project tiles added after the original six (keyed by link).
// Projects not listed use their title up to the first dash.
export const tileLabels: Record<string, string> = {
  '/work/card-dex': 'Card Dex',
  '/work/build-battle': 'Build & Battle',
  '/work/vitaos': 'VitaOS',
  '/reeltown-slots': 'ReelTown Store',
  '/work/character-illustration': 'Character Art',
  '/work/leagues': 'Leagues',
  '/work/sunset-riches-parallax': 'SSR Parallax',
  '/work/card-battler': 'Card Battler',
  '/work/my-konami-slots': 'My Konami Slots',
};

export const clients = {
  image: '9b965350',
  alt: 'Clients: Shaq, Cirque du Soleil, MGM Grand, Konami, Big Fish, Plarium, Virgin, Adobe, Amazon, MTV, The Pokémon Company International',
};

export const quote = {
  text: "User centered design is the idea that the work I do isn't about me or my portfolio. It is about the people I'm designing for and how the work I produce might help them live better lives.",
  video: '07b58ef8',
};

export const contact = {
  lead: 'Want to work together? Say hello.',
};
