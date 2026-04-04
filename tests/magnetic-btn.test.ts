import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案一：奢華級微交互 — 磁吸按鈕 + 邊框光暈', () => {
  describe('global.css 應定義磁吸按鈕樣式', () => {
    it('應定義 .magnetic-btn 磁吸效果容器', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.magnetic-btn|\.btn-magnetic/);
    });

    it('應定義 .btn-border-glow 邊框光暈追蹤效果', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      // conic-gradient for border glow effect on magnetic buttons
      const hasConicGlow = css.includes('conic-gradient') && css.includes('magnetic-btn');
      const hasExplicitClass = css.includes('btn-border-glow') || css.includes('border-glow');
      expect(hasConicGlow || hasExplicitClass).toBe(true);
    });
  });

  describe('Layout.astro 應包含磁吸按鈕腳本', () => {
    it('應包含 magnetic button mousemove 腳本', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/magnetic|btn-magnetic|mousemove.*btn|translate.*mouse/);
    });
  });

  describe('index.astro 應使用磁吸按鈕 class', () => {
    it('CTA 按鈕應使用 magnetic-btn 或 btn-magnetic class', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/magnetic-btn|btn-magnetic/);
    });
  });
});
