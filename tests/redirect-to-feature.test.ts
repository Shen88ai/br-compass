import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('Solution 1: redirect_to frontmatter 功能', () => {
  describe('Schema 定義', () => {
    it('content.config.ts 應定義 redirect_to 欄位', () => {
      const configPath = join(srcDir, 'content.config.ts');
      const config = readFileSync(configPath, 'utf-8');
      expect(config).toMatch(/redirect_to\s*:\s*z\.string\(\)\.optional\(\)/);
    });
  });

  describe('頁面路由處理', () => {
    it('[...slug].astro 應處理 redirect_to 欄位', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/redirect_to/);
    });

    it('[...slug].astro 應使用 Astro.redirect() 進行重定向', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/Astro\.redirect/);
    });

    it('重定向應返回 301 狀態碼', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/redirect.*301/);
    });
  });

  describe('Frontmatter 驗證', () => {
    it('04-tax-declaration-comparison.md 應包含 redirect_to 欄位', () => {
      const mdPath = join(srcDir, 'content', 'handbook', '04-tax-declaration-comparison.md');
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/redirect_to:\s*\/handbook\/04a-tax-comparison-intro/);
    });
  });
});
