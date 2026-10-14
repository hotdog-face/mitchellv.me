// Renders public/assets/og/<slug>.jpg for every work page: title, line or headline stat, and the cover.
const fs = require('fs'), path = require('path');
// Run: npm run og (needs Google Chrome and puppeteer-core: npm i -D puppeteer-core)
const p = require('puppeteer-core');
const sharp = require('sharp');
const ROOT = path.resolve(__dirname, '..');
const cs = fs.readFileSync(ROOT + '/src/data/caseStudies.ts', 'utf8');
const caseInfo = href => {
  const i = cs.indexOf(`href: '${href}'`); if (i < 0) return null;
  const block = cs.slice(i, cs.indexOf('featured:', i));
  const v = block.match(/impact: \[\s*\{ value: '([^']+)', label: '([^']+)'/);
  const eyebrow = (block.match(/product: '([^']+)'/) || [])[1];
  const year = (block.match(/year: '([^']*)'/) || [])[1];
  const home = (block.match(/homeImage: '([^']+)'/) || [])[1];
  return { stat: v ? [v[1], v[2]] : null, eyebrow: [eyebrow, year].filter(Boolean).join(' · '), home };
};
const findImg = name => { const dir = path.join(ROOT, 'src/assets', path.dirname(name)); const f = fs.readdirSync(dir).find(x => x.split('.')[0] === path.basename(name)); return path.join(dir, f); };
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
(async () => {
  const b = await p.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-proxy-server'] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1200, height: 630 });
  for (const f of fs.readdirSync(ROOT + '/src/content/work')) {
    const d = JSON.parse(fs.readFileSync(ROOT + '/src/content/work/' + f, 'utf8'));
    const info = caseInfo('/work/' + d.slug);
    const imgName = info?.home ?? `work/${d.slug}/${d.card.image}`;
    const alpha = !!info?.home;
    const buf = await sharp(findImg(imgName)).resize(alpha ? 700 : 760, alpha ? 560 : 600, { fit: alpha ? 'inside' : 'cover' }).png().toBuffer();
    const img = 'data:image/png;base64,' + buf.toString('base64');
    const title = d.title.replace(/ - .*$/, '');
    const eyebrow = info?.eyebrow || d.card.line.split(' · ').slice(0, 2).join(' · ');
    const stat = info?.stat;
    const html = `<html><body style="margin:0;width:1200px;height:630px;background:#121214;font-family:Helvetica,Arial,sans-serif;color:#fff;display:grid;grid-template-columns:520px 1fr;overflow:hidden">
<div style="padding:64px 0 56px 64px;display:flex;flex-direction:column">
<div style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#ff6fae;font-weight:700">${esc(eyebrow)}</div>
<div style="margin-top:18px;font-size:${title.length > 30 ? 46 : 56}px;font-weight:700;line-height:1.05;letter-spacing:-.01em">${esc(title)}</div>
${stat ? `<div style="margin-top:30px;display:flex;flex-direction:column;gap:6px"><span style="font-size:64px;font-weight:700;color:#ff6fae;line-height:1">${esc(stat[0])}</span><span style="font-size:22px;color:#c6c6cc">${esc(stat[1])}</span></div>` : `<div style="margin-top:24px;font-size:22px;color:#c6c6cc;line-height:1.4">${esc(d.card.line)}</div>`}
<div style="margin-top:auto;display:flex;align-items:center;gap:14px;font-size:20px;color:#c6c6cc"><span style="width:28px;height:4px;border-radius:2px;background:#cb2872"></span>Mitchell Vizensky · mitchellv.me</div></div>
<div style="position:relative;display:grid;place-items:center;${alpha ? '' : 'padding:0'}"><img src="${img}" style="${alpha ? 'max-width:640px;max-height:520px;filter:drop-shadow(0 20px 40px rgba(0,0,0,.5))' : 'position:absolute;inset:36px 0 36px 0;width:100%;height:calc(100% - 72px);object-fit:cover;border-radius:16px 0 0 16px'}"></div>
</body></html>`;
    await pg.setContent(html);
    const png = await pg.screenshot();
    await sharp(png).jpeg({ quality: 84 }).toFile(`${ROOT}/public/assets/og/${d.slug}.jpg`);
    console.log('og', d.slug);
  }
  await b.close();
})();
