import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案二：視覺層級重構 — 根首頁', () => {
  describe('index.astro 消除 inline styles', () => {
    it('Hero 標題應使用 text-gradient-hope class', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/text-gradient-hope/);
    });

    it('Hero 區域應使用 fate-wheel-overlay class', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*fate-wheel-overlay/);
    });

    it('Phase Cards 應使用 bento-grid 佈局', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*bento-grid/);
    });

    it('Phase Cards 應使用 bento-card 或 phase-card class', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*(bento-card|phase-card)/);
    });

    it('CTA 區域應使用 cta-section class', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*cta-section/);
    });

    it('減少模板區域 inline style 數量（應少於 20 個）', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      const templatePart = page.split('<script>')[0];
      const styleMatches = templatePart.match(/style=/g);
      expect(styleMatches?.length || 0).toBeLessThan(20);
    });
  });
});
