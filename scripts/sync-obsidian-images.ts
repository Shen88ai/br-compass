/**
 * Obsidian Image Sync Pipeline
 *
 * Purpose:
 * 1. Copy images from attachments/ → public/assets/
 * 2. Rewrite Markdown image references:
 *    ![[filename.png]] → ![alt](/assets/filename.png)
 *    ![alt](attachments/filename.png) → ![alt](/assets/filename.png)
 * 3. Run during build or manually before commit
 *
 * Usage:
 *   npx tsx scripts/sync-obsidian-images.ts
 */

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, extname, basename } from 'path';

const ROOT = process.cwd();
const ATTACHMENTS_DIR = join(ROOT, 'attachments');
const PUBLIC_ASSETS_DIR = join(ROOT, 'public', 'assets');
const CONTENT_DIR = join(ROOT, 'src', 'content', 'handbook');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp']);

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

/**
 * Step 1: Sync images from attachments/ to public/assets/
 */
function syncImages() {
  if (!existsSync(ATTACHMENTS_DIR)) {
    console.log('⚠️  attachments/ directory not found, skipping image sync.');
    return [];
  }

  ensureDir(PUBLIC_ASSETS_DIR);

  const files = readdirSync(ATTACHMENTS_DIR);
  const synced: string[] = [];

  for (const file of files) {
    const srcPath = join(ATTACHMENTS_DIR, file);
    if (!statSync(srcPath).isFile()) continue;
    if (!IMAGE_EXTENSIONS.has(extname(file).toLowerCase())) continue;

    const destPath = join(PUBLIC_ASSETS_DIR, file);
    copyFileSync(srcPath, destPath);
    synced.push(file);
  }

  console.log(`📸 Synced ${synced.length} image(s) to public/assets/`);
  return synced;
}

/**
 * Step 2: Rewrite Markdown image references in content files
 */
function rewriteMarkdownImages() {
  if (!existsSync(CONTENT_DIR)) {
    console.log('⚠️  Content directory not found, skipping image rewrite.');
    return 0;
  }

  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let rewritten = 0;

  for (const file of files) {
    const filePath = join(CONTENT_DIR, file);
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Pattern 1: Obsidian embed syntax ![[filename.png]]
    const obsidianEmbedRegex = /!\[\[([^\]]+\.(?:png|jpg|jpeg|gif|svg|webp|bmp))\]\]/g;
    content = content.replace(obsidianEmbedRegex, (match, filename) => {
      modified = true;
      return `![${basename(filename, extname(filename))}](/assets/${filename})`;
    });

    // Pattern 2: Standard Markdown with attachments/ path
    const attachmentsPathRegex = /\]\(attachments\/([^\)]+)\)/g;
    content = content.replace(attachmentsPathRegex, (match, filename) => {
      modified = true;
      return `](/assets/${filename})`;
    });

    // Pattern 3: Relative path to attachments in same directory
    const relativePathRegex = /\]\(\.\/attachments\/([^\)]+)\)/g;
    content = content.replace(relativePathRegex, (match, filename) => {
      modified = true;
      return `](/assets/${filename})`;
    });

    if (modified) {
      writeFileSync(filePath, content, 'utf-8');
      rewritten++;
      console.log(`✏️  Rewrote image references in ${file}`);
    }
  }

  console.log(`📝 Rewrote image references in ${rewritten} file(s)`);
  return rewritten;
}

/**
 * Main pipeline
 */
function main() {
  console.log('🚀 Starting Obsidian Image Sync Pipeline...\n');

  const synced = syncImages();
  const rewritten = rewriteMarkdownImages();

  console.log(`\n✅ Pipeline complete: ${synced.length} images synced, ${rewritten} files rewritten.`);
}

main();
