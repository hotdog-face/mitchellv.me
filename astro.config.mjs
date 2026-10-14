// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://www.mitchellv.me',
  integrations: [mdx()],
  // pokemon-tv.astro → /pokemon-tv (as already shared); work/index.astro → /work/
  build: { format: 'preserve' },
  // addresses from the old Wix site keep working
  redirects: {
    '/copy-of-store-revamp': '/work/pokemon-tv',
    '/pokemon-tv': '/work/pokemon-tv',
    '/bfc-store-revamp': '/work/bfc-store-revamp',
    '/reeltown-slots': '/work/reeltown-slots',
    '/store-update': '/work/bfc-store-revamp',
    '/rtsstore': '/work/reeltown-slots',
  },
  image: { responsiveStyles: false },
});
