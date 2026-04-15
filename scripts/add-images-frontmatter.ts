/**
 * Auto-add images frontmatter to markdown files
 * 
 * Scans resources/Image/ for cover images and adds them to the corresponding
 * markdown files in src/content/handbook/
 * 
 * Usage: npx tsx scripts/add-images-frontmatter.ts
 */

import { readdirSync, readFileSync, writeFileSync, statSync, existsSync, mkdirSync } from 'fs';
import { join, extname, basename } from 'path';

const ROOT = process.cwd();
const RESOURCES_IMAGE_DIR = join(ROOT, '..', 'resources', 'Image');
const CONTENT_DIR = join(ROOT, 'src', 'content', 'handbook');

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.bmp']);

function parseFilename(filename: string): { slug: string; usage: string; ext: string } | null {
  const match = filename.match(/^([\w-]+)-([a-z]+)\.(png|jpg|jpeg|gif|webp|svg)$/i);
  if (!match) return null;
  return {
    slug: match[1],
    usage: match[2],
    ext: match[3].toLowerCase()
  };
}

function addImagesToMarkdown(): number {
  if (!existsSync(RESOURCES_IMAGE_DIR)) {
    console.error(`❌ resources/Image/ not found at ${RESOURCES_IMAGE_DIR}`);
    return 0;
  }

  if (!existsSync(CONTENT_DIR)) {
    console.error(`❌ Content directory not found at ${CONTENT_DIR}`);
    return 0;
  }

  // Scan resources/Image/ for images
  const resourceFiles = readdirSync(RESOURCES_IMAGE_DIR);
  const imageMap: Record<string, string> = {}; // slug -> filename

  for (const file of resourceFiles) {
    const srcPath = join(RESOURCES_IMAGE_DIR, file);
    if (!statSync(srcPath).isFile()) continue;
    if (!IMAGE_EXTENSIONS.has(extname(file).toLowerCase())) continue;

    const parsed = parseFilename(file);
    if (!parsed) continue;

    // Store cover images
    if (parsed.usage === 'cover') {
      imageMap[parsed.slug] = file;
      console.log(`📸 Found: ${file} -> slug: ${parsed.slug}`);
    }
  }

  // Process markdown files
  const mdFiles = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  let modified = 0;

  for (const mdFile of mdFiles) {
    const slug = mdFile.replace(/\.md$/, '');
    const coverImage = imageMap[slug];

    if (!coverImage) {
      console.log(`⚠️  No cover image for: ${slug}`);
      continue;
    }

    const mdPath = join(CONTENT_DIR, mdFile);
    let content = readFileSync(mdPath, 'utf-8');

    // Check if images field already exists
    if (/^images:/m.test(content)) {
      console.log(`⏭️  Skipped (images already exists): ${mdFile}`);
      continue;
    }

    // Find the position to insert images (after tags or after icon)
    let insertPos = -1;
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Find the end of frontmatter (after ---)
      if (line.startsWith('---') && i > 0) {
        insertPos = i;
        break;
      }
    }

    if (insertPos === -1) {
      console.log(`❌ Could not find frontmatter end in: ${mdFile}`);
      continue;
    }

    // Insert images field
    const imagesBlock = `\nimages:\n  cover: ${coverImage}`;
    lines.splice(insertPos, 0, imagesBlock);
    content = lines.join('\n');

    writeFileSync(mdPath, content, 'utf-8');
    console.log(`✏️  Added images to: ${mdFile} (cover: ${coverImage})`);
    modified++;
  }

  console.log(`\n✅ Complete: Added images to ${modified} file(s)`);
  return modified;
}

console.log('🚀 Adding images frontmatter to markdown files...\n');
addImagesToMarkdown();
