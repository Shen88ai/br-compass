import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案三：沉浸式內容體驗 — 專業術語 Tooltip', () => {
  describe('global.css 應定義 Tooltip 樣式', () => {
    it('應定義 .term-tooltip 浮動提示框', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.term-tooltip|\.glossary-tooltip/);
    });

    it('應定義 .term-trigger 觸發元素樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.term-trigger|\.term-link/);
    });
  });

  describe('handbook/[...slug].astro 應包含術語數據與腳本', () => {
    it('應包含術語詞典數據結構', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/glossary|termDict|術語詞典|termData/);
    });

    it('應包含 Tooltip 觸發腳本邏輯', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/term-tooltip|glossary-tooltip|term-trigger|term-link/);
    });
  });
});
