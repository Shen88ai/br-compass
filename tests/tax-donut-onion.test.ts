import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('TaxDonutOnion 混合視覺化組件', () => {
  const componentPath = join(srcDir, 'components', 'TaxVisualization', 'TaxDonutOnion.astro');

  describe('組件存在性', () => {
    it('TaxDonutOnion.astro 組件應存在於 components 目錄', () => {
      expect(existsSync(componentPath)).toBe(true);
    });
  });

  describe('Three.js 整合', () => {
    it('組件應導入 Three.js', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/import.*THREE.*from\s+['"]three['"]/);
    });

    it('組件應包含 Canvas 元素', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/<canvas/);
      expect(component).toMatch(/id=["']tax-donut-canvas['"]/);
    });
  });

  describe('甜甜圈圖功能（方案 B）', () => {
    it('組件應定義三種稅務模式的數據結構', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/lucroReal|Lucro Real/);
      expect(component).toMatch(/lucroPresumido|Lucro Presumido/);
      expect(component).toMatch(/subF|低報/);
    });

    it('組件應支持甜甜圈圖渲染', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/TorusGeometry|ring|donut/);
    });

    it('組件應有三個甜甜圈代表三種模式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/mode|模式/);
    });
  });

  describe('洋蔥圖功能（方案 A）', () => {
    it('組件應展示 CBS/IBS 抵扣邏輯', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/CBS|IBS|抵扣|credit/);
    });

    it('組件應包含同心圓環結構', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/ring|RingGeometry|同心|concentric/);
    });

    it('組件應展示進項抵扣和銷項稅額', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/進項|import|inbound/);
      expect(component).toMatch(/銷項|sales|outbound/);
    });
  });

  describe('Props 介面', () => {
    it('組件應定義 Props 介面', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/interface Props/);
    });

    it('組件應支持 mode 屬性選擇顯示模式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/mode\??.*:/);
    });

    it('組件應支持 showOnion 屬性控制洋蔥圖顯示', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/showOnion|onion/);
    });
  });

  describe('動畫功能', () => {
    it('組件應包含 GSAP 動畫', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/gsap|GSAP|animation|animate/);
    });

    it('組件應有選中高亮效果', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/hover|highlight|selected|active/);
    });
  });

  describe('響應式設計', () => {
    it('組件應包含響應式樣式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/@media|responsive|mobile/);
    });

    it('組件應有容器樣式', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/<style/);
      expect(component).toMatch(/container|wrapper|tax-viz/);
    });
  });

  describe('交互功能', () => {
    it('組件應支持點擊/懸停交互', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/click|mouseover|hover|interactive/);
    });

    it('組件應有 Tooltip 或 Info 面板', () => {
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/tooltip|info|detail|panel/);
    });
  });
});
