import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案二：視覺層級重構 — Layout 組件', () => {
  describe('Layout.astro 消除 inline styles', () => {
    it('應使用 CSS class 而非 inline style 定義 nav 容器佈局', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      // Should not have inline style with display:flex on nav inner container
      const navInnerStyle = layout.match(/<div\s+style="[^"]*display:flex[^"]*"[^>]*>/g);
      expect(navInnerStyle).toBeNull();
    });

    it('應使用 nav-container 或類似 class 定義導航內部佈局', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/class=["'][^"']*nav-container|class=["'][^"']*nav-inner|class=["'][^"']*container/);
    });

    it('應使用 nav-links 或類似 class 定義導航連結組', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/class=["'][^"']*nav-links|class=["'][^"']*nav-items/);
    });

    it('應使用 nav-actions 或類似 class 定義導航按鈕組', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/class=["'][^"']*nav-actions|class=["'][^"']*nav-buttons/);
    });

    it('應使用 footer class 而非 inline style', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      const footerStyle = layout.match(/<footer\s+style=/);
      expect(footerStyle).toBeNull();
    });

    it('應使用 brand 或 logo class 定義品牌名稱', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/class=["'][^"']*brand|class=["'][^"']*logo/);
    });

    it('應使用 nav-link class 定義導航連結', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      const navLinkClasses = layout.match(/class=["'][^"']*nav-link/g);
      expect(navLinkClasses?.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('global.css 應定義新增的 Layout 相關 class', () => {
    it('應定義 .nav-container 佈局樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.nav-container/);
    });

    it('應定義 .nav-links 佈局樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.nav-links/);
    });

    it('應定義 .nav-actions 佈局樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.nav-actions/);
    });

    it('應定義 .brand 品牌樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.brand/);
    });

    it('應定義 .nav-link 導航連結樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.nav-link/);
    });
  });
});
