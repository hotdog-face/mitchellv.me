import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Image and video names are relative to the project's folder:
// images  → src/assets/work/<slug>/<name>.webp (rendered with <Img>)
// videos  → public/assets/work/<slug>/<name>.mp4 + <name>.webp poster
const image = z.object({
  name: z.string(),
  width: z.number(),   // display size on the old site (capped at the 1400px canvas)
  height: z.number(),
  alt: z.string(),
});
const video = z.object({
  name: z.string(),
  width: z.number().optional(),
  height: z.number().optional(),
  label: z.string().optional(),
});

const module = z.discriminatedUnion('type', [
  image.extend({
    type: z.literal('image'),
    maxWidth: z.number().optional(),
    // looping clip laid over part of the image; position/size in % of the image
    overlay: z.object({ name: z.string(), left: z.number(), top: z.number(), width: z.number() }).optional(),
  }),
  video.extend({ type: z.literal('video') }),
  z.object({
    type: z.literal('grid'),
    // justified row: each item grows in proportion to its aspect ratio
    items: z.array(z.union([
      image.extend({ kind: z.literal('image'), ratio: z.number() }),
      video.extend({ kind: z.literal('video'), ratio: z.number() }),
    ])),
  }),
  z.object({ type: z.literal('text'), html: z.string() }),
  z.object({ type: z.literal('embed'), src: z.string().url(), title: z.string(), width: z.number(), height: z.number() }),
]);

const work = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    pageTitle: z.string(),
    slug: z.string(),
    order: z.number(),          // position on /work and in prev/next
    description: z.string().optional(), // HTML
    meta: z.object({ date: z.string().optional(), fields: z.array(z.string()) }),
    card: z.object({ image: z.string(), line: z.string() }),
    background: z.string(),
    dark: z.boolean(),
    modules: z.array(module),
    behance: z.object({
      id: z.number(),
      url: z.string().url(),
      publishedOn: z.string(),
      fields: z.array(z.string()),
      tools: z.array(z.string()),
      tags: z.array(z.string()),
    }).optional(),
  }),
});

export const collections = { work };
