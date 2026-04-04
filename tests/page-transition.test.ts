import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案一：奢華級微交互 — 頁面過渡動畫', () => {
  describe('global.css 應定義頁面過渡動畫', () => {
    it('應定義 @keyframes fade-in-up 進場動畫', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/@keyframes\s+fade-in-up|@keyframes\s+fadeInUp/);
    });

    it('應定義 @keyframes fade-in 基礎淡入', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/@keyframes\s+fade-in|@keyframes\s+fadeIn[^U]/);
    });

    it('應定義 @keyframes slide-in-left 側滑進場', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/@keyframes\s+slide-in-left|@keyframes\s+slideInLeft/);
    });

    it('應定義 .animate-on-scroll 滾動觸發動畫 class', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.animate-on-scroll|\.animate-on-view/);
    });

    it('應定義 animation-delay 工具類 (.delay-100, .delay-200 等)', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.delay-100|\.delay-200|animation-delay/);
    });
  });

  describe('Layout.astro 應包含滾動動畫腳本', () => {
    it('應包含 IntersectionObserver 用於滾動動畫觸發', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/IntersectionObserver|animate-on-scroll|animate-on-view/);
    });
  });

  describe('index.astro 應使用動畫 class', () => {
    it('Hero 元素應使用動畫 class', () => {
      const pagePath = join(srcDir, 'pages', 'index.astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/animate-on-scroll|animate-on-view|fade-in-up/);
    });
  });
});
