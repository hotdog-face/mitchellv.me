// /robots.txt: open to search engines on the live site, closed on the review preview.
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => new Response(
  import.meta.env.PUBLIC_PREVIEW
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site)}\n`,
  { headers: { 'Content-Type': 'text/plain' } },
);
