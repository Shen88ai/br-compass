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
      expect(md).toMatch(/phase: "harvest"/);
      expect(md).toMatch(/featured: true/);
    });
  });

  describe('Enhanced UI Components', () => {
    it('应包含 Toggle 切换', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/tax-toggle/);
    });

    it('应包含 箭頭流動圖', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/tax-flow-diagram/);
    });

    it('应包含 10.9% 横向進度條', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/competitiveness-bar/);
    });

    it('应包含 稅務抵銷演示', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/tax-offset-demo/);
    });
  });

  describe('Content Structure (Q&A Sources)', () => {
    it('应以因果连結論开篇', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/因果連接/);
    });

    it('应包含 Accordion 互動區塊', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/accordion-container/);
    });

    it('应包含 Lucro Real 模式', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lucro Real/);
    });

    it('应包含 Lucro Presumido 正清全報', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lucro Presumido/);
      expect(md).toMatch(/正清全報/);
    });

    it('应包含 Lucro Presumido 低報', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/低報/);
    });

    it('应包含低報模式風險警示', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Risco de ser fiscalizado/);
    });

    it('应包含 10.9% 竞争分析', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/10\.9%/);
    });

    it('应包含 CBS/IBS 抵扣逻辑', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/28%/);
    });

    it('应包含淨利還原公式 (H = E - D - F - G - B)', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/E-D-F-G-B/);
    });

    it('应包含 Q&A 學習區塊', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/qa-section/);
    });
  });

  describe('Key Decision Checklist', () => {
    it('应包含关键决策检查清單', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/關鍵決策/);
    });
  });
});