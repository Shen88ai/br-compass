import { describe, it, expect, beforeAll } from 'vitest';
import { load } from 'cheerio';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const distDir = join(process.cwd(), 'dist');
const srcStylesDir = join(process.cwd(), 'src', 'styles');

function readHtml(path: string) {
  const htmlPath = join(distDir, path, 'index.html');
  if (!existsSync(htmlPath)) {
    throw new Error(`Built HTML not found at ${htmlPath}. Run 'npm run build' first.`);
  }
  return readFileSync(htmlPath, 'utf-8');
}

function readCss(filename: string) {
  const cssPath = join(srcStylesDir, filename);
  if (!existsSync(cssPath)) {
    throw new Error(`CSS file not found at ${cssPath}`);
  }
  return readFileSync(cssPath, 'utf-8');
}

describe('方案一：空間層次感優化 (Spatial Hierarchy)', () => {
  describe('字體系統 — 標題使用第二字體', () => {
    it('global.css 應導入 Space Grotesk 字體', () => {
      const css = readCss('global.css');
      expect(css).toContain('Space Grotesk');
    });

    it('Layout.astro 應引入 Space Grotesk 字體連結', () => {
      const layoutPath = join(process.cwd(), 'src', 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/Space\+?Grotesk/);
    });

    it('h1, h2, h3 應使用 Space Grotesk 字體族', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/['"]?Space Grotesk['"]?/);
    });
  });

  describe('Hero 背景光暈 — Radial Gradient', () => {
    it('global.css 應定義 hero-glow 或 radial-gradient 背景樣式', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/radial-gradient/);
    });

    it('根首頁 Hero 區域應使用 hero-glow 背景效果', () => {
      const html = readHtml('');
      const $ = load(html);
      const heroSection = $('section').first();
      const heroClass = heroSection.attr('class') || '';
      const heroStyle = heroSection.attr('style') || '';
      expect(heroClass + heroStyle).toMatch(/hero-glow|radial-gradient|hero-section|advisor-section/);
    });
  });

  describe('Bento Grid 佈局 — Phase Cards 視覺層次', () => {
    it('global.css 應定義 bento-grid 相關樣式', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/bento-grid|bento-card|featured-card/);
    });

    it('根首頁 Phase Cards 應使用 bento-grid 佈局', () => {
      const html = readHtml('');
      const $ = load(html);
      const grids = $('section').find('[class*="bento"], [class*="phase-grid"]');
      expect(grids.length).toBeGreaterThan(0);
    });

    it('首張 Phase Card 應有 featured 樣式（佔更大空間）', () => {
      const html = readHtml('');
      const $ = load(html);
      const featuredCards = $('[class*="featured"], [class*="bento-featured"], [class*="col-span"]');
      expect(featuredCards.length).toBeGreaterThan(0);
    });
  });

  describe('CSS Utility Classes — 提取內聯樣式', () => {
    it('global.css 應定義 section-pad 工具類', () => {
      const css = readCss('global.css');
      expect(css).toContain('.section-pad');
    });

    it('global.css 應定義 phase-card 工具類', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/\.phase-card|\.card-phase/);
    });

    it('global.css 應定義 section-rhythm 或不同 padding 的 section 變體', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/section-compact|section-lg|section-xl|section-rhythm/);
    });
  });

  describe('手冊首頁視覺層次', () => {
    it('手冊首頁 Phase Cards 應有 featured card（首篇放大）', () => {
      const html = readHtml('handbook');
      const $ = load(html);
      const articles = $('article');
      expect(articles.length).toBeGreaterThan(0);
      const featuredArticles = $('article[class*="featured"], article[class*="bento-featured"]');
      expect(featuredArticles.length).toBeGreaterThan(0);
    });

    it('手冊首頁應使用 bento-grid 佈局', () => {
      const html = readHtml('handbook');
      const $ = load(html);
      const bentoGrids = $('[class*="bento-grid"]');
      expect(bentoGrids.length).toBeGreaterThan(0);
    });
  });
});
