import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('TaxFunnel 垂直漏斗視覺化組件', () => {
  const componentPath = join(srcDir, 'components', 'TaxVisualization', 'TaxFunnel.astro');

  describe('組件存在性', () => {
    it('TaxFunnel.astro 組件應存在於 components 目錄', () => {
      expect(existsSync(componentPath)).toBe(true);
    });
  });

  describe('垂直漏斗結構', () => {
    it('組件應包含垂直漏斗佈局', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/funnel|漏斗/);
    });

    it('組件應有三個漏斗列代表三種模式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/funnel-column|funnel-col/);
    });

    it('組件應展示毛利層（收入）', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/毛利|revenue|income/);
    });

    it('組件應展示 IRPJ 扣除層', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/IRPJ|irpj/);
    });

    it('組件應展示 CSLL 扣除層', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/CSLL|csll/);
    });

    it('組件應展示運營成本層', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/運營成本|成本|operational|cost/);
    });

    it('組件應展示淨利結果', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/淨利|profit|net/);
    });
  });

  describe('三種稅務模式', () => {
    it('應包含 Lucro Real 模式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/lucro.?real|Lucro Real/i);
    });

    it('應包含 Lucro Presumido 模式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/lucro.?presumido|Lucro Presumido/i);
    });

    it('應包含低報模式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/低報|subf|sub.?f/i);
    });
  });

  describe('樣式定義', () => {
    it('組件應使用專案配色（gold, neon-green, neon-yellow）', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/color-gold|#D4A843|var\(--color-gold\)/);
      expect(component).toMatch(/neon-green|#00FF87|var\(--color-neon-green\)/);
      expect(component).toMatch(/neon-yellow|#E5FF00|var\(--color-neon-yellow\)/);
    });

    it('組件應有響應式樣式（桌面/移動端）', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/@media/);
      expect(component).toMatch(/max-width/);
    });

    it('組件應使用專案字體（Inter, Space Grotesk）', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/font-|font-family/);
    });
  });

  describe('Hover 動畫', () => {
    it('組件應有 hover 效果（替代旋轉動畫）', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/hover|transform|scale/);
    });

    it('hover 效果應使用 gsap 或 CSS transition', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/transition|gsap|animation/);
    });

    it('hover 效果應為放大（scale）而非旋轉', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/scale/);
      expect(component).not.toMatch(/rotation|rotate/);
    });
  });

  describe('Props 介面', () => {
    it('組件應定義 Props 介面', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/interface Props/);
    });

    it('組件應支持 class 屬性', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/class\??.*:/);
    });
  });

  describe('信息面板', () => {
    it('組件應有 insight 或 info 面板', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/insight|info|detail|panel/);
    });

    it('面板應顯示數值', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/\$\d+|value|amount/);
    });
  });

  describe('層次結構', () => {
    it('漏斗層次應從上到下排列', () => {
      const component = readFileSync(componentPath, 'utf-8');
      const content = readFileSync(componentPath, 'utf-8');
      const revenueIndex = content.search(/毛利|revenue|income/);
      const profitIndex = content.search(/淨利|profit|net/);
      expect(revenueIndex).toBeLessThan(profitIndex);
    });

    it('每層應有明確的視覺區分（顏色/邊框）', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/background|border|color/);
    });
  });
});
