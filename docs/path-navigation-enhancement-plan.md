---
📄 計劃文檔內容
建議保存位置：br-compass/docs/path-navigation-enhancement-plan.md
---
BR-COMPASS - 閱讀清單與羅盤銜接優化計劃
> 記錄時間：2026-04-05
> 狀態：Plan Mode（等待執行）
---
## 一、問題分析
### 用戶痛點
回答 Q1/Q2/Q3 之後出現的路徑能與後續的羅盤金黃色的按鈕（必須閱讀的網頁清單）有更好的銜接。
### 現有流程斷點
1. 首頁回答 Q1/Q2/Q3 → 顯示路徑 + 閱讀清單（文字列表）+ 「踏上征途」按鈕
2. 點擊後直接跳轉到第一篇文章
3. 通過 JourneyNav 底部的「繼續征途」按鈕逐篇前進
**問題**：閱讀清單是純文字，與後續的金色按鈕（JourneyNav、羅盤路徑標籤）缺乏視覺與功能上的銜接感。
---
二、提出的 3 個方案
方案一：路徑預覽頁面（Path Overview Page）
- 診斷完成後，先進入路徑預覽頁面再進入文章
- 在 /handbook#path-{letter} 顯示完整路徑卡片網格
- 優點：用戶可先鳥瞰全貌，再選擇從哪裡開始
方案二：診斷結果與 JourneyNav 串聯（Enhanced Checklist）【先執行】
- 將 result-checklist 改為可點擊的卡片網格
- 每個 checklist-item 加入：
  - 狀態圓點（已完成/未讀/當前）
  - 與羅盤路徑顏色一致的邊框
  - Hover 時顯示戰略揭示文字（strategy）
  - 點擊可直接跳轉該章節
- 優點：視覺與 JourneyNav 一致，降低認知負擔
方案三：羅盤路徑可點擊 + 3D 入口（Immersive Path Entry）【升級】
- 3D 羅盤診斷後顯示的路徑標籤可互動
- 點擊路徑標籤 → 彈出該路徑的「戰略揭示面板」：
  - 顯示完整 checkpoint 列表（strategy 字段）
  - 顯示預估時間與難度
  - 金色「開始征途」按鈕直接跳轉
- 優點：3D 羅盤成為真正的導航入口
---
三、決策記錄
- 優先執行：方案二（強化閱讀清單）
- 升級目標：方案三（羅盤路徑可點擊）
- 驗證節點：每個階段完成後運行 npm test 驗證
- Hover 行為：採用 hover 顯示 strategy 文字
- 面板行為：讓用戶選擇從哪篇開始閱讀
---
四、TDD 實施計劃
階段一：方案二（強化閱讀清單）
步驟	檔案
1.1	tests/diagnosis-enhancement.test.ts
1.2	src/styles/global.css
1.3	src/components/DiagnosisForm.astro
1.4	src/pages/handbook/[...slug].astro
1.5	npm test
測試項目（1.1）
// tests/diagnosis-enhancement.test.ts
- renders correct number of items (路徑 A=19, B=5, C=17, D=8, E=5, F=3, G=5)
- each item contains required elements (序號、圖標、標題、ETA)
- status dots reflect localStorage (completed=綠鉤, current=金色閃爍, pending=灰色)
- path color borders applied (A=淡藍#7DD3FC, B=金色#FFD700, C=箔金#D4A843, D=螢綠#00FF87, E=熒黃#E5FF00, F=紅#FF6B6B, G=銀灰#C0C0C0)
- click navigates to slug (href="/handbook/${slug}")
- strategy shows on hover (strategy 文字浮層顯示)
CSS 樣式（1.2）
/* 新增於 src/styles/global.css */
.checklist-item--card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(15,15,24,0.8), rgba(20,20,30,0.6));
  border-radius: 0.75rem;
  border-left: 3px solid var(--path-color);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}
.checklist-item--status-completed { /* 綠色鉤形 */ }
.checklist-item--status-current { /* 金色閃爍動畫 */ }
.checklist-item--status-pending { /* 灰色 */ }
.checklist-item--path-A { --path-color: #7DD3FC; }
.checklist-item--path-B { --path-color: #FFD700; }
.checklist-item--path-C { --path-color: #D4A843; }
.checklist-item--path-D { --path-color: #00FF87; }
.checklist-item--path-E { --path-color: #E5FF00; }
.checklist-item--path-F { --path-color: #FF6B6B; }
.checklist-item--path-G { --path-color: #C0C0C0; }
.checklist-item__strategy {
  position: absolute;
  left: 100%;
  top: 0;
  width: 280px;
  padding: 12px;
  background: rgba(10,10,18,0.95);
  border: 1px solid var(--path-color);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 100;
  margin-left: 8px;
}
.checklist-item:hover .checklist-item__strategy {
  opacity: 1;
  visibility: visible;
}
.checklist-item__strategy::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-width: 6px 6px 6px 0;
  border-style: solid;
  border-color: transparent var(--path-color) transparent transparent;
}
---
階段二：方案三（羅盤路徑可點擊）
步驟	檔案
2.1	tests/fate-wheel-click.test.ts
2.2	src/lib/fate-wheel/scene-manager.ts
2.3	src/components/FateWheel/FateWheelScene.astro
2.4	src/styles/fate-wheel.css
2.5	npm test
2.6	npm test
測試項目（2.1）
// tests/fate-wheel-click.test.ts
- creates 7 path label sprites (A-F + G)
- each label has correct userData (pathKey, strategy, orbitAngle)
- raycaster detects mouse clicks on path labels
- dispatches 'path-label-click' custom event with pathKey detail
- panel displays full checkpoint list for selection
- panel close button hides the overlay
- CTA button navigates to selected checkpoint
---
五、工作流程
[階段一]
[RED]   npm test → 測試失敗（預期）
[GREEN] 實現代碼 → npm test → 測試通過
[REFACTOR] 優化代碼 → npm test → 保持通過
[階段二]
[RED]   npm test → 測試失敗（預期）
[GREEN] 實現代碼 → npm test → 測試通過
[REFACTOR] 優化代碼 → npm test → 保持通過
[最終驗證]
npm test → 所有測試通過 ✅
---
六、相關檔案位置
核心檔案
檔案
src/data/path-mapping.ts
src/components/DiagnosisForm.astro
src/components/JourneyNav.astro
src/lib/fate-wheel/scene-manager.ts
src/components/FateWheel/FateWheelScene.astro
src/styles/global.css
src/styles/fate-wheel.css
測試檔案
檔案
tests/diagnosis-enhancement.test.ts
tests/fate-wheel-click.test.ts
---
七、路徑顏色對照表
路徑
A
B
C
D
E
F
G
---
八、Checkpoint 數量
路徑
A
B
C
D
E
F
G
---