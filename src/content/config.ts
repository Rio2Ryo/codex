import { defineCollection, z } from 'astro:content';

const hero = defineCollection({
  type: 'content',
  schema: z.object({
    eyebrow: z.string().optional(),
    title: z.string(),
    lead: z.string(),
    primaryCta: z.object({ label: z.string(), href: z.string() }),
    secondaryCta: z.object({ label: z.string(), href: z.string() }).optional(),
  }),
});

const features = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string().optional(),
  }),
});

export const collections = { hero, features };

