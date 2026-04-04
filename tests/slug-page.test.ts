import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案二：視覺層級重構 — 文章內頁', () => {
  describe('handbook/[...slug].astro 消除 inline styles', () => {
    it('應使用 .article-layout class 定義文章整體佈局', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*article-layout/);
    });

    it('應使用 .article-main 或類似 class 定義文章主體', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*article-main|class=["'][^"']*article-body/);
    });

    it('應使用 .article-sidebar 或類似 class 定義側邊欄', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*article-sidebar|class=["'][^"']*sidebar/);
    });

    it('應使用 .breadcrumb 或類似 class 定義麵包屑導航', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*breadcrumb/);
    });

    it('應使用 .phase-badge 或類似 class 定義階段徽章', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*phase-badge/);
    });

    it('應使用 .article-cover 或類似 class 定義封面佔位區', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*article-cover/);
    });

    it('應使用 .tags-container 或類似 class 定義標籤容器', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*tags-container|class=["'][^"']*article-tags/);
    });

    it('應使用 .article-nav 或類似 class 定義上下篇導航', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*article-nav|class=["'][^"']*prev-next/);
    });

    it('應使用 .toc-card 或類似 class 定義目錄卡片', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*toc-card|class=["'][^"']*toc-container/);
    });

    it('應使用 .cta-card 或類似 class 定義側邊欄 CTA', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/class=["'][^"']*cta-card|class=["'][^"']*sidebar-cta/);
    });

    it('文章標題應使用 text-gradient-hope class', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/text-gradient-hope/);
    });
  });

  describe('global.css 應定義文章內頁相關 class', () => {
    it('應定義 .article-layout 佈局樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.article-layout/);
    });

    it('應定義 .breadcrumb 麵包屑樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.breadcrumb/);
    });

    it('應定義 .article-cover 封面樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.article-cover/);
    });

    it('應定義 .article-nav 導航樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.article-nav/);
    });

    it('應定義 .toc-card 目錄卡片樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.toc-card/);
    });
  });
});
