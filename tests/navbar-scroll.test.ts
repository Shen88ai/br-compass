import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案一：奢華級微交互系統 — 導航欄滾動收縮', () => {
  describe('global.css 應定義導航欄交互樣式', () => {
    it('應定義 .glass-nav.scrolled 收縮狀態樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.glass-nav\.scrolled|\.glass-nav\[data-scrolled\]/);
    });

    it('應定義 .nav-container 收縮時的高度變化', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.scrolled.*\.nav-container|\.nav-container.*transition.*height|glass-nav\.scrolled.*nav-container/);
    });

    it('應定義 .nav-container 高度過渡動畫', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.nav-container.*transition|transition.*height/);
    });

    it('應定義 .brand 品牌名稱收縮時的字體變化', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.brand.*transition|\.scrolled.*\.brand|\.brand.*font-size.*transition/);
    });

    it('應定義底部金線漸現效果', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      // Gold line via ::after pseudo-element or explicit class
      const hasGoldLine = css.includes('glass-nav::after') && css.includes('gold');
      const hasGoldBorder = css.includes('nav-border-line') || css.includes('nav-glow-line');
      expect(hasGoldLine || hasGoldBorder).toBe(true);
    });
  });

  describe('Layout.astro 應包含滾動交互腳本', () => {
    it('應包含 navbar scroll event listener 腳本', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/scroll.*nav|scroll.*glass|addEventListener.*scroll|IntersectionObserver/);
    });

    it('應在導航欄元素上添加 data 屬性或 class 切換邏輯', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/classList.*toggle|classList.*add.*scrolled|dataset\.scrolled|\.scrolled/);
    });

    it('應包含 navbar scroll 腳本切換 scrolled class', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/classList.*add.*scrolled|classList.*toggle.*scrolled|\.scrolled/);
    });
  });
});
