import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const handbookDir = join(process.cwd(), 'src', 'content', 'handbook');

describe('04-tax-declaration-comparison Chapter', () => {
  const mdPath = join(handbookDir, '04-tax-declaration-comparison.md');

  describe('File Existence', () => {
    it('檔案应存在', () => {
      expect(existsSync(mdPath)).toBe(true);
    });
  });

  describe('Frontmatter', () => {
    it('应有正确的 frontmatter 欄位', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/title:/);
      expect(md).toMatch(/phase: "D"/);
      expect(md).toMatch(/featured: true/);
    });
  });

  describe('Content Structure (子頁面包，含4個子頁面)', () => {
    it('应包含子頁面連結', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/04a-tax-comparison-intro|tax-comparison-intro/);
    });

    it('应以因果连結論开篇', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/因果連接/);
    });

    it('应包含目录导航', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/本章節已拆分|章節目錄/);
    });
  });

  describe('04a 子頁面内容', () => {
    const subPath = join(handbookDir, '04a-tax-comparison-intro.md');
    
    it('04a 子頁面应存在', () => {
      expect(existsSync(subPath)).toBe(true);
    });

    it('应包含 Lucro Real 模式', () => {
      const md = readFileSync(subPath, 'utf-8');
      expect(md).toMatch(/Lucro Real/);
    });

    it('应包含 Lucro Presumido', () => {
      const md = readFileSync(subPath, 'utf-8');
      expect(md).toMatch(/Lucro Presumido/);
      expect(md).toMatch(/正清全報/);
    });

    it('应包含低報风险警示', () => {
      const md = readFileSync(subPath, 'utf-8');
      expect(md).toMatch(/低報|風險/);
    });

    it('应包含决策检查清單', () => {
      const md = readFileSync(subPath, 'utf-8');
      expect(md).toMatch(/檢查清單|決策|checklist/i);
    });
  });
});