import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcStylesDir = join(process.cwd(), 'src', 'styles');

function readCss(filename: string) {
  const cssPath = join(srcStylesDir, filename);
  if (!existsSync(cssPath)) {
    throw new Error(`CSS file not found at ${cssPath}`);
  }
  return readFileSync(cssPath, 'utf-8');
}

describe('方案二：視覺層級重構 — 設計系統', () => {
  describe('黃金比例間距系統 (Fibonacci-based spacing)', () => {
    it('global.css 應定義黃金比例間距變數 (8/13/21/34/55/89px)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--space-\d+:\s*8px/);
      expect(css).toMatch(/--space-\d+:\s*13px/);
      expect(css).toMatch(/--space-\d+:\s*21px/);
      expect(css).toMatch(/--space-\d+:\s*34px/);
      expect(css).toMatch(/--space-\d+:\s*55px/);
      expect(css).toMatch(/--space-\d+:\s*89px/);
    });
  });

  describe('黃金雨林漸層色彩系統', () => {
    it('應定義漸層色階 (platinum/gold/neon-yellow/neon-green/sky-blue)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--color-platinum/);
      expect(css).toMatch(/--color-gold:/);
      expect(css).toMatch(/--color-neon-yellow/);
      expect(css).toMatch(/--color-neon-green/);
      expect(css).toMatch(/--color-sky-blue/);
    });

    it('應定義 RGB 變體用於透明度計算', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--color-gold-rgb/);
      expect(css).toMatch(/--color-neon-yellow-rgb/);
      expect(css).toMatch(/--color-neon-green-rgb/);
    });

    it('應定義漸層變數 (gradient-hope/gradient-text)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--gradient-hope/);
      expect(css).toMatch(/--gradient-text/);
    });

    it('應定義光暈系統 (glow-*)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--glow-gold/);
      expect(css).toMatch(/--glow-green/);
    });

    it('應定義深色背景色階 (bg-900 ~ bg-700)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--color-bg-900/);
      expect(css).toMatch(/--color-bg-800/);
      expect(css).toMatch(/--color-bg-700/);
    });

    it('應定義語義化色彩 (success/warning/error)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--color-success/);
      expect(css).toMatch(/--color-warning/);
      expect(css).toMatch(/--color-error/);
    });
  });

  describe('陰影系統 (Shadow scale)', () => {
    it('應定義多層級陰影變數 (shadow-sm ~ shadow-xl)', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--shadow-sm/);
      expect(css).toMatch(/--shadow-md/);
      expect(css).toMatch(/--shadow-lg/);
      expect(css).toMatch(/--shadow-xl/);
    });
  });

  describe('字體系統升級', () => {
    it('應定義 monospace 字體變數用於代碼/數據展示', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--font-mono/);
    });

    it('應定義漸變文字工具類 .text-gradient-gold', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/\.text-gradient-gold/);
      expect(css).toMatch(/background-image.*linear-gradient/);
      expect(css).toMatch(/background-clip:\s*text/);
    });
  });

  describe('排版層級系統', () => {
    it('應定義 display/heading/body 字體大小階梯', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/--text-display/);
      expect(css).toMatch(/--text-h1/);
      expect(css).toMatch(/--text-h2/);
      expect(css).toMatch(/--text-body/);
      expect(css).toMatch(/--text-small/);
    });
  });

  describe('內容節奏模組', () => {
    it('應定義 .section-divider 視覺分隔線樣式', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/\.section-divider/);
    });

    it('應定義 .content-rhythm 內容節奏容器樣式', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/\.content-rhythm/);
    });
  });

  describe('首字放大 (Drop cap)', () => {
    it('應定義 .drop-cap 首字放大樣式', () => {
      const css = readCss('global.css');
      expect(css).toMatch(/\.drop-cap/);
    });
  });
});
