import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const steps = defineCollection({
  loader: glob({ base: './src/content/steps', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    level: z.coerce.number().int().min(0).max(5),
    order: z.number().int().positive(),
    family: z.string(),
    origin: z.enum(['house', 'hip-hop', 'other']).default('house'),
    aliases: z.array(z.string()).default([]),
    prerequisites: z.array(z.string()).default([]),
    summary: z.string(),
    cues: z.array(z.string()).default([]),
    bpm: z.tuple([z.number(), z.number()]).optional(),
    verified: z.boolean().default(false),
    sparse: z.boolean().default(false),
    note: z.string().optional(),
    videos: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          start: z.number().default(0),
          kind: z.enum(['tutorial', 'slow', 'demo', 'inspiration']).default('tutorial'),
        }),
      )
      .default([]),
  }),
});

const levels = defineCollection({
  loader: glob({ base: './src/content/levels', pattern: '**/*.md' }),
  schema: z.object({
    level: z.coerce.number().int().min(0).max(5),
    title: z.string(),
    color: z.string(),
    goal: z.string(),
    graduation: z.string(),
  }),
});

const inspire = defineCollection({
  loader: glob({ base: './src/content/inspire', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    youtubeId: z.string(),
    category: z.enum(['legends', 'battle', 'performance', 'social']),
    dancer: z.string().default(''),
    event: z.string().default(''),
    uploadedYear: z.number().int(),
    views: z.number().int().nonnegative(),
    statsAsOf: z.coerce.date(),
    featured: z.boolean().default(false),
    steps: z.array(z.string()).default([]),
    blurb: z.string(),
  }),
});

export const collections = { steps, levels, inspire };
