import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案三：沉浸式內容體驗 — 閱讀進度指示器', () => {
  describe('global.css 應定義進度條樣式', () => {
    it('應定義 .reading-progress 進度條容器', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.reading-progress/);
    });

    it('應定義 .reading-progress-bar 進度條填充', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.reading-progress-bar/);
    });
  });

  describe('handbook/[...slug].astro 應包含進度條元素', () => {
    it('應包含 reading-progress 進度條 DOM 元素', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/reading-progress/);
    });

    it('應包含進度條腳本邏輯 (scroll event)', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/scrollHeight|scrollTop|clientHeight|scroll.*progress/);
    });
  });
});
