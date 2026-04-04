/**
 * Search Index Generator
 *
 * Purpose:
 * Extracts metadata from all handbook articles and generates a lightweight
 * JSON index for client-side fuzzy search via Fuse.js.
 *
 * Usage:
 *   npx tsx scripts/generate-search-index.ts
 *   Or automatically via astro.config.mjs hooks:afterBuild
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const CONTENT_DIR = join(ROOT, 'src', 'content', 'handbook');
const OUTPUT_PATH = join(ROOT, 'public', 'search-index.json');

/**
 * Parse YAML frontmatter from a Markdown file
 */
function parseFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const yaml = match[1];
  const data: Record<string, any> = {};
  yaml.split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    let value = line.slice(colonIdx + 1).trim();
    // Remove quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Parse arrays like ["tag1", "tag2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      try {
        value = JSON.parse(value);
      } catch {
        value = value.slice(1, -1).split(',').map(s => s.trim().replace(/["']/g, ''));
      }
    }
    // Parse booleans
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    // Parse numbers
    if (!isNaN(Number(value)) && value !== '') value = Number(value);
    data[key] = value;
  });
  return data;
}

export async function generateSearchIndex() {
  try {
    if (!existsSync(CONTENT_DIR)) {
      console.warn('⚠️  Content directory not found:', CONTENT_DIR);
      return [];
    }

    const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    const index = files.map(file => {
      const content = readFileSync(join(CONTENT_DIR, file), 'utf-8');
      const data = parseFrontmatter(content);
      const slug = file.replace(/\.(md|mdx)$/, '');
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        excerpt: data.description || '',
        tags: data.tags || [],
        phase: data.phase || '',
        phaseLabel: data.phaseLabel || '',
        order: data.order || 0,
        icon: data.icon || '📄',
        featured: data.featured || false,
      };
    });

    // Sort by order
    index.sort((a, b) => a.order - b.order);

    // Ensure output directory exists
    const outputDir = join(ROOT, 'public');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    writeFileSync(OUTPUT_PATH, JSON.stringify(index, null, 2), 'utf-8');
    console.log(`🔍 Search index generated: ${index.length} articles indexed at public/search-index.json`);
    return index;
  } catch (error) {
    console.error('❌ Failed to generate search index:', error);
    throw error;
  }
}

// Run standalone if executed directly
if (process.argv[1] && process.argv[1].includes('generate-search-index')) {
  generateSearchIndex();
}
