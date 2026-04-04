import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const handbookCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/handbook' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    phase: z.enum(['preparation', 'foundation', 'operations', 'harvest']),
    phaseLabel: z.string(),
    order: z.number(),
    icon: z.string().default('📄'),
    tags: z.array(z.string()).optional().default([]),
    coverImage: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().optional().default(false),
  }),
});

export const collections = {
  'handbook': handbookCollection,
};
