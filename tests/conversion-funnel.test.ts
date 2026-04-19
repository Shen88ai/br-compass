import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

const srcDir = join(process.cwd(), 'src');

describe('方案三：轉換漏斗優化 - Exit Intent & Progress Milestones', () => {
  describe('Exit Intent Popup', () => {
    it('Layout.astro 應包含 exit-intent 檢測脚本', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/exit-intent|mouseout|mouseleave/);
    });

    it('Layout.astro 應包含 exit-popup HTML 结构', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/exit-popup|exit-modal|popup-cta/);
    });

    it('應該有關閉按钮功能', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/popup-close|close-popup|popup-hide/);
    });
  });

  describe('Reading Progress Milestones', () => {
    it('handbook/[...slug].astro 應包含進度檢測脚本', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/reading-progress|scroll-progress|progress-milestone/);
    });

    it('應在 30% 進度顯示 CTA', () => {
      const pagePath = join(srcDir, 'pages', 'handbook', '[...slug].astro');
      const page = readFileSync(pagePath, 'utf-8');
      expect(page).toMatch(/30%|milestone|progress-cta/);
    });
  });

  describe('WhatsApp/TG 浮動按钮', () => {
    it('Layout.astro 應包含浮動客服按钮', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/floating-contact|contact-float|t\.me|wa\.me/);
    });

    it('按钮應連結到 WhatsApp 或 TG', () => {
      const layoutPath = join(srcDir, 'layouts', 'Layout.astro');
      const layout = readFileSync(layoutPath, 'utf-8');
      expect(layout).toMatch(/wa\.me|t\.me|whatsapp|telegram/);
    });
  });
});