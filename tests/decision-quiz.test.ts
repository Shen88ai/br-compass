import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案三：沉浸式內容體驗 — 互動式決策問卷', () => {
  describe('global.css 應定義問卷組件樣式', () => {
    it('應定義 .quiz-container 問卷容器', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.quiz-container|\.decision-quiz/);
    });

    it('應定義 .quiz-option 選項按鈕樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.quiz-option|\.quiz-choice/);
    });

    it('應定義 .quiz-result 結果展示樣式', () => {
      const cssPath = join(srcDir, 'styles', 'global.css');
      const css = readFileSync(cssPath, 'utf-8');
      expect(css).toMatch(/\.quiz-result|\.quiz-recommendation/);
    });
  });

  describe('01-tax-system.md 應包含決策問卷', () => {
    it('應包含 quiz-container 或 decision-quiz 標記', () => {
      const mdPath = join(srcDir, 'content', 'handbook', '01-tax-system.md');
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/quiz-container|decision-quiz|互動問卷|決策問卷/);
    });

    it('應包含 Lucro Real vs Presumido 的選擇邏輯', () => {
      const mdPath = join(srcDir, 'content', 'handbook', '01-tax-system.md');
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lucro Real|Lucro Presumido|推薦方案|questionnaire/);
    });
  });
});
