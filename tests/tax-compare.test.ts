import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案三：沉浸式內容體驗 — 稅制對比互動工具', () => {
  describe('global.css 應定義對比工具樣式', () => {
    it('應定義 .compare-container 對比容器', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.compare-container|\.tax-compare/);
    });

    it('應定義 .compare-card 對比卡片', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.compare-card|\.compare-panel/);
    });

    it('應定義 .compare-input 輸入框樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.compare-input|\.tax-input/);
    });

    it('應定義 .compare-highlight 高亮推薦方案', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.compare-highlight|\.compare-recommended/);
    });
  });

  describe('01-tax-system.md 應包含稅制對比工具', () => {
    it('應包含 compare-container 或 tax-compare 標記', () => {
      const mdPath = join(srcDir, 'content', 'handbook', '01-tax-system.md');
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/compare-container|tax-compare|稅制對比|互動對比/);
    });

    it('應包含 Lucro Real 和 Lucro Presumido 的稅額計算展示', () => {
      const mdPath = join(srcDir, 'content', 'handbook', '01-tax-system.md');
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/compare-real|compare-presumido|real-tax|presumido-tax/);
    });
  });
});
