# mitchellv.me

Mitchell Vizensky's portfolio. Plain HTML and CSS with no build step and no dependencies. What's in this folder is exactly what gets published.

## Files

| Path | What it is |
| --- | --- |
| `index.html` | Home page |
| `copy-of-store-revamp.html` | Pokémon TV case study (old Wix URL, kept so existing links work) |
| `store-update.html` | Big Fish Casino store revamp |
| `rtsstore.html` | ReelTown Slots store (not linked from home) |
| `resume.pdf` | Resume linked from the home page |
| `assets/site.css` | All styles. Colors and fonts are variables at the top. |
| `assets/site.js` | Pokémon TV hero slideshow and the "My Process" popup |
| `assets/img/`, `assets/video/` | Images (WebP) and videos (MP4, including former GIFs) |

The header and footer are copied into each page. If you change one, change it in all four.

## Preview locally

```bash
npx serve .
```

Then open http://localhost:3000. Any static server works. `serve` is used because it handles the extensionless URLs, like `/store-update`, the same way GitHub Pages does.

## Publish

Pushing to `main` publishes to GitHub Pages automatically, usually within a minute.

## Adding images and video

- Images: export as WebP, or as JPG/PNG at no more than about 2400px wide.
- Animations: use a muted, looping MP4 instead of a GIF, because GIFs are 10 to 50 times larger:
  `ffmpeg -i in.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 23 out.mp4`
  then `<video src="..." autoplay muted loop playsinline></video>`.

## Original Wix export

The full-resolution originals from the old Wix site (images, videos, fonts, raw page HTML) are archived outside this repo in `~/Desktop/mitchellv-wix-archive`. Back that folder up somewhere safe.
