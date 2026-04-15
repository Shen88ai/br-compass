# 圖片管理流程優化實施計劃（修訂版）

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立從 resources/Image 到 Astro 的圖片發布流程，並支援 Obsidian frontmatter images 欄位

**Architecture:** 
- 圖片來源：`resources/Image/`（AI 生成的圖片）
- 同步腳本將圖片複製到 `public/images/handbook/{slug}/`
- Astro 組件讀取 frontmatter `images.*` 渲染封面圖

**Tech Stack:**
- Node.js 腳本（同步 + 路徑處理）
- Astro（frontmatter 解析 + 圖片渲染）

---

## 圖片來源與命名

### resources/Image/ 目錄結構
```
resources/Image/
├── 01-0-pre-entry-checklist-cover.png
├── 01-tax-system-cover.png
├── 01-1-tax-timeline-cover.png
├── 01-2-visa-golden-cover.png
├── 01-3-visa-digital-nomad-cover.png
├── 01-4-visa-executive-cover.png
├── 02-visa-strategy-cover.png
├── 03-local-team-cover.png
├── 04-company-setup-cover.png
├── 05-bacen-capital-cover.png
├── 06-ecommerce-platforms-cover.png
├── 07-radar-import-cover.png
├── 08-3pl-warehouse-cover.png
├── 08-1-3pl-contract-cover.png
├── 09-erp-payment-cover.png
├── 09-1-split-payment-cover.png
├── 10-after-sales-service-cover.png
├── 11-tax-compliance-cover.png
└── 12-profit-remittance-cover.png
```

### 檔名解析規則
- 格式：`{slug}-{用途}.{副檔名}`
- 例如：`01-tax-system-cover.png` → slug=`01-tax-system`, 用途=`cover`

### Obsidian frontmatter 格式
```yaml
---
title: "破譯巴西複雜稅制"
images:
  cover: 01-tax-system-cover.png
  diagram: 01-tax-system-diagram.png
  flowchart: 01-tax-system-flowchart.png
---
```

---

## Chunk 1: 修改同步腳本

### 任務 1.1：更新 sync-images.ts

**Files:**
- Modify: `scripts/sync-images.ts`

- [ ] **Step 1: Create updated sync script**

```typescript
// scripts/sync-images.ts
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, renameSync } from 'fs';
import { join, relative, dirname } from 'path';

const RESOURCES_IMAGE = 'C:\\Users\\YANG\\Antigravity\\20260331\\resources\\Image';
const ASTRO_PUBLIC = 'C:\\Users\\YANG\\Antigravity\\20260331\\br-compass\\public\\images\\handbook';

function parseFilename(filename: string): { slug: string; usage: string } | null {
  // 例如：01-tax-system-cover.png -> slug: 01-tax-system, usage: cover
  const match = filename.match(/^([\w-]+)-([a-z]+)\.(png|jpg|jpeg|gif|webp|svg)$/i);
  if (!match) return null;
  return {
    slug: match[1],
    usage: match[2]
  };
}

function syncImages(): void {
  if (!existsSync(RESOURCES_IMAGE)) {
    console.error(`Source directory not found: ${RESOURCES_IMAGE}`);
    return;
  }

  if (!existsSync(ASTRO_PUBLIC)) {
    mkdirSync(ASTRO_PUBLIC, { recursive: true });
  }

  const files = readdirSync(RESOURCES_IMAGE);
  let syncedCount = 0;

  for (const file of files) {
    const srcPath = join(RESOURCES_IMAGE, file);
    const stat = statSync(srcPath);

    if (!stat.isFile()) continue;
    if (!/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(file)) continue;

    const parsed = parseFilename(file);
    if (!parsed) {
      console.warn(`Skipped (unrecognized format): ${file}`);
      continue;
    }

    const { slug, usage } = parsed;
    const destDir = join(ASTRO_PUBLIC, slug);
    
    if (!existsSync(destDir)) {
      mkdirSync(destDir, { recursive: true });
    }

    const destPath = join(destDir, `${usage}.${file.split('.').pop()}`);
    copyFileSync(srcPath, destPath);
    console.log(`Synced: ${file} -> /images/handbook/${slug}/${usage}.*`);
    syncedCount++;
  }

  console.log(`=== Image sync complete: ${syncedCount} files ===`);
}

syncImages();
```

- [ ] **Step 2: Test script with existing images**

Run: `npx tsx scripts/sync-images.ts`
Expected: 顯示同步結果，例如 "Synced: 01-tax-system-cover.png -> /images/handbook/01-tax-system/cover.*"

- [ ] **Step 3: Verify images synced**

Run: `ls "C:\Users\YANG\Antigravity\20260331\br-compass\public\images\handbook\01-tax-system"`
Expected: 包含 cover.png

- [ ] **Step 4: Commit**

```bash
git add scripts/sync-images.ts
git commit -m "feat: update sync-images to read from resources/Image"
```

---

## Chunk 2: 更新路徑處理腳本

### 任務 2.1：更新 fix-image-paths.ts

**Files:**
- Modify: `scripts/fix-image-paths.ts`

- [ ] **Step 1: Update path fix script to handle frontmatter**

```typescript
// scripts/fix-image-paths.ts
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const CONTENT_DIR = 'C:\\Users\\YANG\\Antigravity\\20260331\\br-compass\\src\\content\\handbook';
const ASTRO_PUBLIC = 'C:\\Users\\YANG\\Antigravity\\20260331\\br-compass\\public\\images\\handbook';

function processMarkdownFile(filePath: string): void {
  let content = readFileSync(filePath, 'utf-8');
  const filename = filePath.split(/[/\\]/).pop()?.replace('.md', '') || '';
  let modified = false;

  // 1. 處理內文中的相對路徑：./images/handbook/... -> /images/handbook/...
  const newContent = content.replace(
    /!\[([^\]]*)\]\(\.\/images\/handbook\/([^\)]+)\)/g,
    '![$1](/images/handbook/$2)'
  );
  if (newContent !== content) {
    content = newContent;
    modified = true;
    console.log(`Fixed inline paths in: ${filename}`);
  }

  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
  }
}

function processDirectory(dir: string): void {
  const items = readdirSync(dir);
  
  for (const item of items) {
    const itemPath = join(dir, item);
    const stat = statSync(itemPath);
    
    if (stat.isDirectory()) {
      processDirectory(itemPath);
    } else if (stat.isFile() && /\.md$/.test(item)) {
      processMarkdownFile(itemPath);
    }
  }
}

console.log('=== Fixing image paths ===');
processDirectory(CONTENT_DIR);
console.log('=== Complete ===');
```

- [ ] **Step 2: Test script**

Run: `npx tsx scripts/fix-image-paths.ts`
Expected: 顯示處理的檔案

- [ ] **Step 3: Commit**

```bash
git add scripts/fix-image-paths.ts
git commit -m "feat: update fix-image-paths for frontmatter support"
```

---

## Chunk 3: Astro 封面圖渲染

### 任務 3.1：更新文章頁範本

**Files:**
- Modify: `src/pages/handbook/[...slug].astro`

- [ ] **Step 1: Add cover image rendering**

在 `[...slug].astro` 的 frontmatter 和 script 中添加：

```typescript
// 讀取 frontmatter 中的 images
const { entry } = props;
const images = entry.data.images || {};
const coverImage = images.cover 
  ? `/images/handbook/${entry.slug}/${images.cover.replace(/\.[^.]+$/, '')}.*` 
  : null;

// 注意：實際路徑需要在 build 時處理或使用 import
```

在模板中添加：
```astro
{coverImage && (
  <div class="article-cover">
    <img src={coverImage} alt={entry.data.title} />
  </div>
)}
```

- [ ] **Step 2: Add CSS for cover image**

在 `global.css` 中添加：
```css
.article-cover {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: var(--radius-card);
  margin-bottom: var(--space-4);
}
.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

- [ ] **Step 3: Update content collection schema**

修改 `src/content/config.ts` 添加 images 欄位：
```typescript
const handbook = defineCollection({
  schema: z.object({
    // ... existing fields
    images: z.object({
      cover: z.string().optional(),
      diagram: z.string().optional(),
      flowchart: z.string().optional(),
      comparison: z.string().optional(),
      warning: z.string().optional(),
      example: z.string().optional(),
    }).optional(),
  }),
});
```

- [ ] **Step 4: Test build**

Run: `npm run build`
Expected: Build 成功

- [ ] **Step 5: Commit**

```bash
git add src/pages/handbook/\[...slug\].astro src/styles/global.css src/content/config.ts
git commit -m "feat: add cover image rendering from frontmatter"
```

---

## Chunk 4: 完整流程測試

### 任務 4.1：端到端測試

- [ ] **Step 1: Verify images in resources/Image**

Run: `ls "C:\Users\YANG\Antigravity\20260331\resources\Image" | wc -l`
Expected: 19+ files

- [ ] **Step 2: Sync all images**

Run: `npm run sync-images`

- [ ] **Step 3: Verify synced images**

Run: `ls "C:\Users\YANG\Antigravity\20260331\br-compass\public\images\handbook"`
Expected: 19 directories

- [ ] **Step 4: Build**

Run: `npm run build`

- [ ] **Step 5: Verify build output**

Run: `ls "C:\Users\YANG\Antigravity\20260331\br-compass\dist\images\handbook\01-tax-system"`
Expected: cover image exists

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "test: verify complete image sync and build workflow"
```

---

## 最終驗證

- [ ] `npm test` → 所有測試通過 ✅
- [ ] `npm run build` → Build 成功 ✅
- [ ] 圖片從 resources/Image 同步到 public/images/handbook/ ✅
- [ ] 封面圖在 build 輸出中正確顯示 ✅
