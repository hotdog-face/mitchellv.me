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
    '/copy-of-store-revamp': '/pokemon-tv',
    '/store-update': '/bfc-store-revamp',
    '/rtsstore': '/reeltown-slots',
  },
  image: { responsiveStyles: false },
});
