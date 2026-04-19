import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案一：SEO 優化 - Structured Data 與 Meta 標籤', () => {
  describe('Layout.astro 應包含完整的 SEO meta 標籤', () => {
    it('應包含 Canonical URL', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/canonical/i);
    });

    it('應包含 Open Graph meta 標籤', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/og:title|og:description/);
    });

    it('應包含 Twitter Card meta 標籤', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/twitter:card|twitter:site/);
    });
  });

  describe('handbook/[...slug].astro 應包含 JSON-LD Structured Data', () => {
    it('應包含 Article schema.org', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/"@type":\s*"Article"/);
    });

    it('應包含 script type="application/ld+json"', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/application\/ld\+json/);
    });

    it('Article schema 應包含 headline', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/headline/);
    });

    it('Article schema 應包含 description', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/"description"/);
    });
  });

  describe('index.astro 首頁應包含 WebSite schema', () => {
    it('首頁應包含 WebSite 或 WebPage schema', () => {
      const indexPath = join(srcDir, 'pages', 'index.astro');
      const index = readFileSync(indexPath, 'utf-8');
      expect(index).toMatch(/"@type":\s*"WebSite"|"@type":\s*"WebPage"/);
    });
  });

  describe('public/robots.txt 應存在', () => {
    const publicDir = join(process.cwd(), 'public');
    it('應存在 robots.txt', () => {
      expect(existsSync(join(publicDir, 'robots.txt'))).toBe(true);
    });
  });

  describe('public/sitemap.xml 應存在', () => {
    const publicDir = join(process.cwd(), 'public');
    it('應存在 sitemap.xml', () => {
      expect(existsSync(join(publicDir, 'sitemap.xml'))).toBe(true);
    });
  });
});