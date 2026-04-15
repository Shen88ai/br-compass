/**
 * Image Sync Pipeline - resources/Image Edition
 *
 * Purpose:
 * 1. Copy images from resources/Image/ → public/images/handbook/{slug}/
 * 2. Parse filename to extract slug and usage (e.g., 01-tax-system-cover.png → slug: 01-tax-system, usage: cover)
 * 3. Rewrite Markdown image references:
 *    ![[filename.png]] → ![alt](/images/handbook/slug/usage.*)
 *    ![alt](attachments/filename.png) → ![alt](/images/handbook/slug/usage.*)
 *
 * Usage:
 *   npx tsx scripts/sync-images.ts
 */

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { join, extname, basename } from 'path';

const ROOT = process.cwd();
const RESOURCES_IMAGE_DIR = join(ROOT, '..', 'resources', 'Image');
const PUBLIC_IMAGES_DIR = join(ROOT, 'public', 'images', 'handbook');
const CONTENT_DIR = join(ROOT, 'src', 'content', 'handbook');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp']);

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function parseFilename(filename: string): { slug: string; usage: string; ext: string } | null {
  // 例如：01-tax-system-cover.png -> slug: 01-tax-system, usage: cover, ext: png
  const match = filename.match(/^([\w-]+)-([a-z]+)\.(png|jpg|jpeg|gif|webp|svg)$/i);
  if (!match) return null;
  return {
    slug: match[1],
    usage: match[2],
    ext: match[3].toLowerCase()
  };
}

/**
 * Step 1: Sync images from resources/Image/ to public/images/handbook/
 */
function syncImages(): { synced: number; skipped: number } {
  if (!existsSync(RESOURCES_IMAGE_DIR)) {
    console.log(`⚠️  resources/Image/ directory not found at ${RESOURCES_IMAGE_DIR}`);
    return { synced: 0, skipped: 0 };
  }

  ensureDir(PUBLIC_IMAGES_DIR);

  const files = readdirSync(RESOURCES_IMAGE_DIR);
  let synced = 0;
  let skipped = 0;

  for (const file of files) {
    const srcPath = join(RESOURCES_IMAGE_DIR, file);
    if (!statSync(srcPath).isFile()) continue;
    if (!IMAGE_EXTENSIONS.has(extname(file).toLowerCase())) {
      skipped++;
      continue;
    }

    const parsed = parseFilename(file);
    if (!parsed) {
      console.warn(`⚠️  Skipped (unrecognized format): ${file}`);
      skipped++;
      continue;
    }

    const { slug, usage, ext } = parsed;
    const destDir = join(PUBLIC_IMAGES_DIR, slug);
    ensureDir(destDir);

    // 目標檔名：保留原始檔名
    const destPath = join(destDir, file);
    copyFileSync(srcPath, destPath);
    console.log(`📸 Synced: ${file} → /images/handbook/${slug}/${file}`);
    synced++;
  }

  console.log(`\n✅ Image sync complete: ${synced} synced, ${skipped} skipped`);
  return { synced, skipped };
}

/**
 * Step 2: Rewrite Markdown image references in content files
 */
function rewriteMarkdownImages(): number {
  if (!existsSync(CONTENT_DIR)) {
    console.log('⚠️  Content directory not found, skipping image rewrite.');
    return 0;
  }

  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
  let rewritten = 0;

  for (const file of files) {
    const filePath = join(CONTENT_DIR, file);
    const slug = file.replace(/\.mdx?$/, '');
    let content = readFileSync(filePath, 'utf-8');
    let modified = false;

    // Pattern 1: Obsidian embed syntax ![[filename.png]]
    // 轉換為：![](/images/handbook/{slug}/{usage}.*)
    const obsidianEmbedRegex = /!\[\[([^\]]+\.(?:png|jpg|jpeg|gif|svg|webp|bmp))\]\]/g;
    content = content.replace(obsidianEmbedRegex, (match, filename) => {
      modified = true;
      const parsed = parseFilename(filename);
      if (parsed && parsed.slug === slug) {
        return `![${parsed.usage}](/images/handbook/${slug}/${parsed.usage}.${parsed.ext})`;
      }
      return `![${basename(filename, extname(filename))}](/images/handbook/${slug}/${filename})`;
    });

    // Pattern 2: attachments/ path
    const attachmentsPathRegex = /\]\(attachments\/([^\)]+)\)/g;
    content = content.replace(attachmentsPathRegex, (match, filename) => {
      modified = true;
      return `](/images/handbook/${slug}/${filename})`;
    });

    // Pattern 3: Relative path to attachments
    const relativePathRegex = /\]\(\.\/attachments\/([^\)]+)\)/g;
    content = content.replace(relativePathRegex, (match, filename) => {
      modified = true;
      return `](/images/handbook/${slug}/${filename})`;
    });

    // Pattern 4: Standard relative path ./images/handbook/...
    const standardRelativeRegex = /!\[[^\]]*\]\(\.\/images\/handbook\/([^\)]+)\)/g;
    content = content.replace(standardRelativeRegex, (match, rest) => {
      modified = true;
      return `![](/images/handbook/${rest})`;
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
  console.log('🚀 Starting Image Sync Pipeline...\n');

  const { synced, skipped } = syncImages();
  const rewritten = rewriteMarkdownImages();

  console.log(`\n✅ Pipeline complete: ${synced} images synced (${skipped} skipped), ${rewritten} files rewritten.`);
}

main();
