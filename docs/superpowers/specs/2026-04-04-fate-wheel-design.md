# 命運之輪 (Fate Wheel) — 首頁 3D 互動羅盤設計規範

> **版本:** v1.0 | **日期:** 2026-04-04 | **狀態:** Approved

## 概述

將現有首頁的「羅盤 + 軍師診斷 + 四大階段」三個獨立區塊，融合為一個 **Three.js + GLSL + GSAP** 驅動的「命運之輪」3D 互動體驗。以「因果敘事流」為核心邏輯，打造沉浸式的英雄之旅起點。

## 核心概念

**「征途之心」** — 一個永遠固定在視窗中央、持續呼吸（循環變大變小）的 3D 羅盤核心。它是整個場景的生命源頭，不隨滾輪移動，始終在畫面中央跳動。

## 架構

三個同心環結構，由內而外：
1. **內環 (Compass Core)** — 3D 羅盤核心 + 4 方位晶體 + 征途之心呼吸動畫
2. **中環 (Orbit Questions)** — 軍師 3 問診斷，環形排列的命運節點
3. **外環 (Phase Planets)** — 四大實戰階段，沿軌道公轉的行星

## 技術棧

- **Three.js** — 3D 場景渲染
- **GLSL Shaders** — 液態金屬、能量橋、星雲背景
- **GSAP** — 動畫時間軸控制
- **Astro** — 框架基礎
- **Custom Events** — 組件間通信

## 設備分級

| 等級 | 條件 | 行為 |
|------|------|------|
| High | Desktop + WebGL | 完整 Three.js + GLSL + GSAP |
| Medium | Mobile 或低 GPU | 簡化 Three.js（減少幾何體、關後處理） |
| Low | `prefers-reduced-motion` 或無 WebGL | CSS 2D 同心環回退 |

## 互動流程

1. **初始** — 只有內環「征途之心」在呼吸，背景是 GLSL 星雲
2. **點擊方位** — 中環激活，3 問節點依次亮起
3. **回答問題** — HTML overlay 浮現選項，每答一題節點變金色
4. **診斷完成** — 外環點亮，四大行星開始公轉
5. **Hover 行星** — 暫停公轉、放大、顯示信息面板
6. **點擊行星** — 導航到對應階段頁面

## 狀態管理

狀態機驅動：`idle` → `compass-selected` → `answering` → `diagnosis-complete` → `planet-hover` → `navigating`

與現有 `persona-journey` localStorage 系統完全兼容，新增 `source: 'fate-wheel'` 標記。

## 檔案結構

```
src/
├── pages/index.astro                          # 首頁（承載 3D Canvas + HTML overlay）
├── components/FateWheel/
│   ├── FateWheelScene.astro                   # Three.js 場景容器
│   ├── DiagnosisOverlay.astro                 # HTML 診斷表單 overlay
│   └── PhaseInfoPanel.astro                   # HTML 行星信息面板
├── shaders/
│   ├── liquidMetal.vert                       # 液態金屬 vertex shader
│   ├── liquidMetal.frag                       # 液態金屬 fragment shader
│   ├── energyBridge.vert                      # 能量脈衝 vertex shader
│   ├── energyBridge.frag                      # 能量脈衝 fragment shader
│   └── nebula.frag                            # 星雲背景 fragment shader
├── lib/fate-wheel/
│   ├── device-tier.ts                         # 設備分級檢測
│   ├── types.ts                               # TypeScript 類型定義
│   ├── state-manager.ts                       # 狀態機管理
│   ├── scene-manager.ts                       # Three.js 場景管理器
│   ├── compass-core.ts                        # 羅盤核心（征途之心）
│   ├── orbit-questions.ts                     # 中環問答邏輯
│   ├── phase-planets.ts                       # 外環行星邏輯
│   ├── energy-bridges.ts                      # 能量橋動畫
│   ├── nebula-bg.ts                           # 星雲背景
│   └── gsap-timelines.ts                      # GSAP 動畫時間軸
├── styles/fate-wheel.css                      # 專屬樣式
└── fallback/
    └── fate-wheel-fallback.css                # Low tier CSS 回退樣式
tests/
├── fate-wheel/
│   ├── device-tier.test.ts                    # 設備分級測試
│   ├── state-manager.test.ts                  # 狀態機測試
│   ├── path-mapping-integration.test.ts       # 路徑映射整合測試
│   └── scene-structure.test.ts                # 場景結構測試
```

## 與現有系統整合

- **保留** 現有 `path-mapping.ts` 診斷映射表（48 種組合 → 6/7 條路徑）
- **保留** 現有 `glossary.ts` 詞彙系統
- **保留** 現有暗黑玻璃風格色板
- **升級** Canvas 粒子 → GLSL 星雲背景
- **升級** 2D 羅盤 → 3D 命運之輪
- **兼容** 現有 `index.astro` 中的 CTA buttons 和導航

## 效能目標

- 初始載入 < 3s（含 Three.js + GSAP CDN）
- High tier 維持 30fps+
- Medium tier 維持 24fps+
- 幀率持續 < 20fps 自動降級
- Tab 不可見時暫停渲染
