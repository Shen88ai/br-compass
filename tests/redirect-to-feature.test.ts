import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('Solution 1: redirect_to frontmatter 功能（已棄用，內容已拆分到子頁面）', () => {
  describe('Schema 定義', () => {
    it('content.config.ts 仍支援 redirect_to（向後兼容）', () => {
      const configPath = join(srcDir, 'content.config.ts');
      const config = readFileSync(configPath, 'utf-8');
      expect(config).toMatch(/redirect_to/);
    });
  });

  describe('頁面路由處理', () => {
    it('[...slug].astro 仍處理 redirect_to（向後兼容）', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/redirect_to/);
    });
  });

  describe('新架構：子頁面替代方案', () => {
    it('04a-tax-comparison-intro.md 子頁面存在', () => {
      const subPath = join(srcDir, 'content', 'handbook', '04a-tax-comparison-intro.md');
      expect(existsSync(subPath)).toBe(true);
    });
  });
});

import { existsSync } from 'fs';