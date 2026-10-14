# mitchellv.me

Mitchell Vizensky's portfolio, built with [Astro](https://astro.build). Pushing to `main` builds the site and publishes it to GitHub Pages at https://www.mitchellv.me, usually within two minutes.

## Where things are

| To change… | Edit |
| --- | --- |
| Home page text, featured projects, project tiles | `src/data/home.ts` |
| The "My Process" popup | `src/data/process-details.html` |
| Email, social links, footer "Last updated" year | `src/data/site.ts` |
| A case study's text and images | `src/pages/pokemon-tv.mdx`, `bfc-store-revamp.mdx`, `reeltown-slots.mdx` |
| Work pages (Behance projects, VIP Revamp) | `src/content/work/*` |
| Colors, fonts, spacing for the whole site | `src/styles/global.css` (variables at the top) |
| Header, footer, phone bar | `src/components/Header.astro`, `Footer.astro`, `PhoneBar.astro` |
| Home page sections | `src/components/home/*.astro` |
| Case-study building blocks (steps, cards, slideshows, outcomes…) | `src/components/case/*.astro` |
| Animations, slideshows, popup behavior | `src/scripts/site.ts` |

Case studies are MDX: ordinary Markdown text plus a few components such as `<Card>`, `<Steps>` and `<Outcomes>`. Change the words directly; each component's options are described at the top of its file.

## Resume

`public/resume.pdf` is printed from `resume/resume.html`. Edit the text there, then run `npm run resume` (uses Google Chrome) to rebuild the PDF. Keep it to one page.

## Images and video

- **Images** go in `src/assets/img/` (or `src/assets/work/<project>/`). Refer to one by file name without the extension, for example `<Img name="c7fc5658" alt="…" />`. Astro makes smaller copies for phones automatically.
- **Video** goes in `public/assets/video/` as `<name>.mp4`, plus an optional `<name>.webp` poster frame. Use it with `<Video name="…" />`. Animations should be MP4 rather than GIF, because GIFs are 10 to 50 times larger:
  ```
  ffmpeg -i in.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 23 out.mp4
  ```

## Working on the site

```
npm install        # once
npm run dev        # live preview at http://localhost:4321
npm run build      # production build into dist/
```

Old Wix addresses (`/copy-of-store-revamp`, `/store-update`, `/rtsstore`) redirect to the new pages; see `astro.config.mjs`.

## History

The site was rebuilt from Wix in October 2026. The original Wix export and the tools used to measure it are archived in `~/Desktop/mitchellv-wix-archive`, and the Behance originals in `~/Desktop/mitchellv-behance-archive`.
