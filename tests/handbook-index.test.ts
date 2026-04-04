import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案二：視覺層級重構 — Handbook 首頁', () => {
  describe('handbook/index.astro 消除 inline styles', () => {
    it('Hero 標題應使用 text-gradient-hope 或 text-h1 class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/text-gradient-hope|text-h1|class=["'][^"']*hero-title/);
    });

    it('Hero 區域應使用 hero-section class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*hero-section/);
    });

    it('Phase 卡片應使用 tilt-card 或類似 class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/tilt-card|phase-card|bento-card/);
    });

    it('Phase 圖標容器應使用 phase-icon 或類似 class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*phase-icon|class=["'][^"']*phase-badge/);
    });

    it('Timeline 節點應使用 timeline-item 或類似 class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*timeline-item|class=["'][^"']*timeline-node/);
    });

    it('CTA 區域應使用 cta-section 或類似 class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*cta-section|class=["'][^"']*cta-container/);
    });

    it('減少模板區域 inline style 屬性數量（應少於 40 個，不含 script 內動態 HTML）', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      // Only count styles in the template portion (before <script>)
      const templatePart = page.split('<script>')[0];
      const styleMatches = templatePart.match(/style=/g);
      expect(styleMatches?.length || 0).toBeLessThan(40);
    });
  });

  describe('global.css 應定義 Handbook 相關 class', () => {
    it('應定義 .phase-icon 圖標容器樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.phase-icon|\.phase-badge/);
    });

    it('應定義 .phase-card 卡片容器樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.phase-card|\.bento-card/);
    });

    it('應定義 .timeline-item 時間軸項目樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.timeline-item/);
    });

    it('應定義 .cta-section CTA 區域樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.cta-section/);
    });

    it('應定義 .hero-content Hero 內容容器樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.hero-content/);
    });
  });
});
