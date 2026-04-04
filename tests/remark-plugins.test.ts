import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const root = process.cwd();

describe('Phase 2: remark 插件與圖片同步管線', () => {
  describe('remark 插件應已安裝', () => {
    it('應安裝 remark-wiki-link 插件', () => {
      const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      expect(deps['remark-wiki-link']).toBeDefined();
    });

    it('應安裝 remark-callouts 或等效插件', () => {
      const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      const hasCallout = deps['remark-callouts'] || deps['remark-obsidian-callout'] || deps['remark-obsidian'];
      expect(hasCallout).toBeDefined();
    });

    it('應安裝 rehype-external-links 用於外部連結處理', () => {
      const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      expect(deps['rehype-external-links']).toBeDefined();
    });
  });

  describe('astro.config.mjs 應配置 remark 插件', () => {
    it('應引入 remark-wiki-link', () => {
      const config = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
      expect(config).toMatch(/remark-wiki-link|remarkWikiLink/);
    });

    it('應引入 callout 轉換插件', () => {
      const config = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
      expect(config).toMatch(/remark-callouts|remarkObsidianCallout|callout/);
    });

    it('應引入 rehype-external-links', () => {
      const config = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
      expect(config).toMatch(/rehype-external-links|rehypeExternalLinks/);
    });

    it('應在 markdown 配置中註冊 remarkPlugins', () => {
      const config = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
      expect(config).toMatch(/remarkPlugins/);
    });

    it('應在 markdown 配置中註冊 rehypePlugins', () => {
      const config = readFileSync(join(root, 'astro.config.mjs'), 'utf-8');
      expect(config).toMatch(/rehypePlugins/);
    });
  });

  describe('圖片同步腳本應存在', () => {
    it('應存在 scripts/sync-obsidian-images.ts 腳本', () => {
      const scriptPath = join(root, 'scripts', 'sync-obsidian-images.ts');
      expect(existsSync(scriptPath)).toBe(true);
    });

    it('腳本應包含 attachments → public/assets 同步邏輯', () => {
      const scriptPath = join(root, 'scripts', 'sync-obsidian-images.ts');
      const script = readFileSync(scriptPath, 'utf-8');
      expect(script).toMatch(/attachments/);
      expect(script).toMatch(/public\/assets|public\/assets/);
    });

    it('腳本應包含 Markdown 圖片路徑替換邏輯', () => {
      const scriptPath = join(root, 'scripts', 'sync-obsidian-images.ts');
      const script = readFileSync(scriptPath, 'utf-8');
      expect(script).toMatch(/!\[\[|attachments\//);
      expect(script).toMatch(/\/assets\//);
    });
  });
});
