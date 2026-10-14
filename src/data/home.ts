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
    "With 11 years of gaming experience and 7 of those years specializing in UX/UI design, I bring a strong foundation in art and animation to my passion for visual and interaction design. Currently contributing to The Pokémon Trading Card Game Live at The Pokémon Company International, I previously honed my skills at Amazon's Mobile Games Experience Team. Grounded in user-centric principles, I craft designs that not only delight but also align with company objectives, leveraging data-driven methodologies.",
    'You have just under 15 seconds to surprise and delight your users before the cognitive load becomes too much and they close your software. This is why, in today’s tech-filled world, user experience (UX) is critical to the success of your company. Your users are most likely moving a mile-a-minute and doing multiple things at once. Creating a simplistic, streamlined experience will keep your multitasking audience engaged and interested in what your company has to say.',
    "I'm focused on creating meaningful experiences through design that will hold your users’ attention and keep them on their path to purchase. I’ve built my career in UX with the principles of user-centered design and design thinking at the core of my process and execution. Let’s work together to create a user experience that is intuitive and keeps your users around for longer than 15 seconds.",
  ],
  services: 'Product Strategy / UX Prototyping / Wireframing / Branding / Visual Design / Interaction Design / Motion Graphics / User Research / Data Visualization / Design Systems / Accessibility Design / Creative Direction / Concept Art / Team Leadership / Storytelling / Feedback and Critique / Project Management',
  resume: '/resume.pdf',
};

// The three featured projects, in order. `media` describes the artwork beside the text.
export const featured = [
  {
    title: 'Pokémon TV',
    href: '/pokemon-tv',
    text: 'In March of 2021, young Pokémon fans could exclusively access Pokémon TV (PTV) via web; the streaming service needed to be ported to the Nintendo Switch™ to increase accessibility for its most important audience. TPCI created this streaming service with the intent of influencing sales of Pokémon Trading Cards - making the bold choice to exclude monetization. The streaming service needed to be easy for young viewers to navigate while offering a vast library of Pokémon’s entertainment content.',
    media: 'switch',
  },
  {
    title: 'BFC Store Revamp',
    href: '/bfc-store-revamp',
    text: "Big Fish Casino is a top-30 highest grossing social casino mobile app. Despite the app's success, its age had begun to show with the outdated store design. This redesign completely re-imagined the store's interaction and visual design, ultimately improving the company's bottom line and making purchasing a more intuitive and rewarding process.",
    media: 'phone-video',
  },
  {
    title: 'Bug Brite',
    href: '/work/bug-brite',
    text: "After leaving Big Fish Games I was finally freed up to make a product that aligns with my own product vision and strategies. I teamed up with two of my skilled friends, and we have set our sights on the hyper casual mobile game market. Bug Brite is the first product we've completed together and are currently refining features to improve retention metrics.",
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

export const clients = {
  image: '9b965350',
  alt: 'Clients: Shaq, Cirque du Soleil, MGM Grand, Konami, Big Fish, Plarium, Virgin, Adobe, Amazon, MTV, The Pokémon Company International',
};

export const quote = {
  text: "User centered design is the idea that the work I do isn't about me or my portfolio. It is about the people I'm designing for and how the work I produce might help them live better lives.",
  video: '07b58ef8',
};

export const contact = {
  lead: "Let's talk about how I can help you on your next project!",
};
