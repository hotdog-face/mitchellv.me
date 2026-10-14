// Builds a review copy of the site and publishes it to the preview repo's GitHub Pages
// (https://hotdog-face.github.io/mitchellv-preview/). The live site is untouched.
// The preview is marked noindex and blocked in robots.txt so search engines skip it.
//
//   npm run preview:deploy
//
// GitHub Pages serves the preview under /mitchellv-preview/, so root-relative links
// ("/work/", "/_astro/…") are rewritten to include that prefix after the build.
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const BASE = '/mitchellv-preview';
const REPO = 'https://github.com/hotdog-face/mitchellv-preview.git';
const OUT = 'dist-preview';
const run = (cmd, opts = {}) => execSync(cmd, { stdio: 'inherit', ...opts });

run(`npx astro build --outDir ${OUT}`, { env: { ...process.env, PUBLIC_PREVIEW: '1', PUBLIC_SHOW_SERVICES: '1' } });

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const prefix = url => url.startsWith('/') && !url.startsWith('//') ? BASE + url : url;
let files = 0;
for (const file of walk(OUT)) {
  if (file.endsWith('.html')) {
    let html = fs.readFileSync(file, 'utf8');
    html = html.replace(/(\s(?:href|src|poster|data-hevc|data-lazy-src|action)=")(\/(?!\/)[^"]*)"/g, (_, a, url) => `${a}${prefix(url)}"`);
    html = html.replace(/(\ssrcset=")([^"]*)"/g, (_, a, set) => `${a}${set.split(',').map(part => part.replace(/^(\s*)(\S+)/, (m, ws, url) => ws + prefix(url))).join(',')}"`);
    html = html.replace(/url\((\/(?!\/)[^)]*)\)/g, (_, url) => `url(${prefix(url)})`);
    fs.writeFileSync(file, html);
    files++;
  } else if (file.endsWith('.css')) {
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/url\((\/(?!\/)[^)]*)\)/g, (_, url) => `url(${prefix(url)})`));
  }
}
fs.rmSync(path.join(OUT, 'CNAME'), { force: true });   // the preview must not claim www.mitchellv.me
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');      // serve the _astro folder as-is
console.log(`rewrote ${files} pages for ${BASE}`);

if (process.argv.includes('--no-push')) process.exit(0);
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-preview-'));
fs.cpSync(OUT, tmp, { recursive: true });
const git = cmd => run(`git ${cmd}`, { cwd: tmp });
git('init -q -b gh-pages');
git('add -A');
git('-c user.name="Mitchell Vizensky" -c user.email="mail@mitchellv.me" commit -q -m "Preview build"');
git(`push -q -f ${REPO} gh-pages`);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`published: https://hotdog-face.github.io${BASE}/`);
