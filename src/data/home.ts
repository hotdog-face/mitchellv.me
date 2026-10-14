// Everything the home page says and shows. Edit text, links and images here;
// the layout lives in src/components/home/*.astro.

export const hero = {
  name: "I'm Mitchell Vizensky",
  headline: 'Senior game UX designer. I take features from idea to playable.',
  pitch: 'I design the systems players come back for (collecting, progression, live events and stores) and build playable prototypes to prove them early. Right now that means Pokémon TCG Live at The Pokémon Company International.',
  previously: 'Previously at Amazon, Big Fish Games and PLAYSTUDIOS',
  background: 'bff7d9c7',
};

// Quick proof points under the hero.
export const proof = [
  { value: '14', label: 'years in games' },
  { value: '30+', label: 'games shipped' },
  { value: 'Millions', label: 'of players reached' },
  { value: '4', label: 'platforms: console, mobile, desktop, web' },
];

// What I bring, framed around what games studios hire senior UX designers for.
// `href` points to the case study that proves it.
export const strengths = [
  { title: 'Playable prototypes', text: 'I build working prototypes in code, often with AI coding tools, so a team can play an idea before committing to it.', proof: 'Builds', href: '/#builds' },
  { title: 'Collection & progression', text: 'Systems that give players long-term goals and a reason to return: collections, missions, stats and rewards.', proof: 'Card Dex & Research Missions', href: '/work/card-dex' },
  { title: 'Game modes & live events', text: 'New ways to play, designed end to end from flow and grey box to the live event players see.', proof: 'Build & Battle', href: '/work/build-battle' },
  { title: 'Stores & monetization', text: 'Store and offer experiences that feel rewarding to players and measurably move revenue.', proof: 'Big Fish Casino Store, +38.4% sales', href: '/bfc-store-revamp' },
];

export const about = {
  process: ['EMPATHIZE', 'DEFINE', 'IDEATE', 'PROTOTYPE', 'TEST'],
  bio: [
    "I came to UX from art and animation: a BFA in motion graphics, a mentorship with Pixar artists, and four years directing art on mobile games at PLAYSTUDIOS. Over the last 10 years I've designed for Big Fish Games, Amazon's Mobile Games Experience team and now The Pokémon Company International, where I work on Pokémon TCG Live.",
    "I start with the people I'm designing for: research, quick prototypes, and testing early and often. Then I use data to make sure the work moves the business too. At TPCI I set up the user research process for our Game Studio team, and outside work I design and build my own software, like VitaOS.",
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
  text: "The work isn't about me or my portfolio. It's about the players: what they came to do, what delights them, and what brings them back.",
  video: '07b58ef8',
};

export const contact = {
  lead: 'Want to work together? Say hello.',
};
