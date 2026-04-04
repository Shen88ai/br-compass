// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Obsidian-compatible remark/rehype plugins
import remarkWikiLink from 'remark-wiki-link';
import remarkCallouts from 'remark-callouts';
import rehypeExternalLinks from 'rehype-external-links';

// Search index generation
import { generateSearchIndex } from './scripts/generate-search-index.ts';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },
  markdown: {
    remarkPlugins: [
      // Convert Obsidian [[wikilinks]] to standard Markdown links
      [remarkWikiLink, {
        markdownFolder: 'src/content/handbook',
        pathFormat: 'shortest',
      }],
      // Convert Obsidian > [!type] callouts to semantic HTML
      remarkCallouts,
    ],
    rehypePlugins: [
      // Open external links in new tab with security attrs
      [rehypeExternalLinks, {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
      }],
    ],
  },
  hooks: {
    'astro:server:start': async () => {
      // Generate search index during dev mode
      await generateSearchIndex();
    },
    'astro:build:done': async ({ dir }) => {
      // Generate search index after build completes
      await generateSearchIndex();
    },
  },
});
