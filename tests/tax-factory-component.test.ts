import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('Solution 2: TaxFactory Astro 組件重構', () => {
  describe('組件存在性', () => {
    it('TaxFactory.astro 組件應存在於 components 目錄', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      expect(existsSync(componentPath)).toBe(true);
    });

    it('組件應包含工廠流水線結構', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/factory-pipeline/);
      expect(component).toMatch(/factory-station/);
    });

    it('組件應包含傳送帶動畫結構', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/conveyor-belt/);
      expect(component).toMatch(/belt-segment/);
      expect(component).toMatch(/belt-arrow/);
    });

    it('組件應包含控制面板', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/factory-controls/);
      expect(component).toMatch(/factory-btn/);
    });

    it('組件應包含儀表板', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/factory-dashboard/);
      expect(component).toMatch(/dashboard-card/);
    });
  });

  describe('組件 Props 介面', () => {
    it('組件應定義 Props 介面', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/interface Props/);
    });

    it('組件應支持 fullMode 屬性', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/fullMode\??/);
    });

    it('組件應支持 subfMode 屬性', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/subfMode\??/);
    });
  });

  describe('樣式定義', () => {
    it('組件應包含 scoped 樣式', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/<style/);
      expect(component).toMatch(/tax-factory/);
    });

    it('工廠站點應有動畫樣式', () => {
      const componentPath = join(srcDir, 'components', 'TaxFactory', 'TaxFactory.astro');
      const component = readFileSync(componentPath, 'utf-8');
      expect(component).toMatch(/@keyframes/);
    });
  });

  describe('MDX 整合（可選）', () => {
    it('04a-tax-comparison-intro.md 可以是 .mdx 格式以支持組件導入', () => {
      const mdxPath = join(srcDir, 'content', 'handbook', '04a-tax-comparison-intro.mdx');
      const mdPath = join(srcDir, 'content', 'handbook', '04a-tax-comparison-intro.md');
      const mdxExists = existsSync(mdxPath);
      const mdExists = existsSync(mdPath);
      expect(mdxExists || mdExists).toBe(true);
      
      if (mdxExists) {
        const mdx = readFileSync(mdxPath, 'utf-8');
        expect(mdx).toMatch(/TaxFactory/);
      }
    });
  });
});
