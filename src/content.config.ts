import { z, defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';

const handbookCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/handbook' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    phase: z.enum(['preparation', 'foundation', 'operations', 'harvest', 'insights', 'media']),
    phaseLabel: z.string(),
    order: z.number(),
    icon: z.string().default('📄'),
    tags: z.array(z.string()).optional().default([]),
    coverImage: z.string().optional(),
    publishDate: z.coerce.date().optional(),
    featured: z.boolean().optional().default(false),
    images: z.object({
      cover: z.string().optional(),
      diagram: z.string().optional(),
      flowchart: z.string().optional(),
      comparison: z.string().optional(),
      warning: z.string().optional(),
      example: z.string().optional(),
    }).optional(),
    /* media-specific fields */
    embedType: z.enum(['youtube', 'image', 'link']).optional(),
    youtubeId: z.string().optional(),
    mediaUrl: z.string().optional(),
    thumbnail: z.string().optional(),
    mediaCategory: z.enum(['youtube', 'xiaohongshu', 'douyin', 'ai-video', 'other']).optional(),
  }),
});

export const collections = {
  'handbook': handbookCollection,
};
