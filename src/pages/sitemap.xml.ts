// /sitemap.xml: every page on the site, for search engines.
import type { APIRoute } from 'astro';
import { getWork } from '../data/work';

export const GET: APIRoute = async ({ site }) => {
  const paths = ['/', '/work/', '/pokemon-tv', '/bfc-store-revamp', '/reeltown-slots', ...(await getWork()).map(p => `/work/${p.slug}`)];
  const urls = paths.map(p => `  <url><loc>${new URL(p, site)}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml' } });
};
