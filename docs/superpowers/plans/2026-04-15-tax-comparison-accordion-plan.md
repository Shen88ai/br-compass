# 巴西進口稅制轉型與申報模式利潤分析頁面實作計劃

> **For agentic workers:** REQUIRED: 使用 superpowers:subagent-driven-development 或 superpowers:executing-plans 來實作本計劃。步驟使用 checkbox (`- [ ]`) 語法追蹤。

**目標：** 建立一個互動式圖文資訊圖表頁面，還原巴西進口稅制轉型下的「正清全報」與「正清低報」三種模式的利潤分析對比。

**架構：** 在 `src/content/handbook/` 中建立新的 `.md` 檔案，使用多种互動組件展示三種模式的數據對比：
- Accordion（折疊面板）— 三種模式數據切換
- Toggle（對比切換）— 全報 vs 低報 數據動態更新
- 箭頭流動圖 — CBS/IBS 進銷項抵扣
- 横向進度條 — 10.9% 競爭力展示
- 風險警示徽章 — 低報風險標註
- Q&A 區塊 — 學習型 FAQ

**技術堆疊：** Astro、HTML、CSS（global.css 的現有組件樣式）、JavaScript（事件委托模式）、Tailwind CSS（對比條/警示標籤）。

---

## 檔案結構

### 新增檔案

- `src/content/handbook/04-tax-declaration-comparison.md` — 新的 handbook 章節
- 修改: `src/pages/handbook/[...slug].astro` — 加入 Accordion + Toggle + 箭頭流動圖 互動 JS
- 修改: `src/styles/global.css` — 加入必要時的 CSS（Accordion/Toggle/進度條/風險警示）
- 修改: `src/data/glossary.ts` — 加入新術語（~20個稅務術語）
- 新增: `src/data/taxComparisonData.ts` — Q&A 驅動數據文件（Tg/GS/JS/JS/JS/JS 對話來源的 Q&A 結構）
- 修改: `tests/slug-page.test.ts` — 驗證頁面渲染

---

## Chunk 1: 內容數據與結構定義

### Task 1: 建立核心數據常數

**Files:**
- Create: `src/content/handbook/04-tax-declaration-comparison.md`

- [ ] **Step 1: 建立 handbook 檔案框架**

```markdown
---
title: "進口正清全额及低報比較：利潤分析與風險評估"
description: "互動式分析：巴西稅制轉型下的三種申報模式比較，幫助中小企彈做出最適合的稅務決策。"
phase: "harvest"
phaseLabel: "第四階段：財務合規"
order: 4
icon: "📊"
tags: ["稅務", "進口", "正清全報", "低報", "利潤分析", "Lucro Real", "Lucro Presumido"]
featured: true
---

> **因果連接**：如果你不了解正清全報與低報的實際利潤差異——你將做出錯誤的稅務決策，可能導致利润被侵蝕或面臨稽查風險。
```

- [ ] **Step 2: 驗證檔案存在**

執行: `ls src/content/handbook/04-tax-declaration-comparison.md`
預期: 檔案存在

- [ ] **Step 3: Commit**

```bash
git add src/content/handbook/04-tax-declaration-comparison.md
git commit -m "feat: add tax declaration comparison chapter skeleton"
```

### Task 2: 編寫 Enhanced 互動區塊（含 Q&A + 可視化組件）

**Files:**
- Modify: `src/content/handbook/04-tax-declaration-comparison.md:15-200`
- Create: `src/data/taxComparisonData.ts` — Q&A 數據結構

- [ ] **Step 1: 創建 Q&A 數據文件**

```typescript
// src/data/taxComparisonData.ts
// 數據來源：NotebookLM 對話 Q&A 結構

export const taxComparisonData = {
  // 第一階段：基礎概念與模式概覽
  "Q1": {
    question: "這份分���報��主要對比了哪些經營模式？",
    answer: "報告主要對比了三種情境：**實際利潤制 (Lucro Real) 的正清全報**、**利潤推算制 (Lucro Presumido) 的正清全報**，以及**利潤推算制下的正清低報 (Sub F.)**。",
    category: "核心模式"
  },
  "Q2": {
    question: "什麼是「正清低報 (Sub F.)」？其申報金額與實際有何不同？",
    answer: "「正清低報」是指在進口申報時，人為調低貨物的 CIF 價值。貨物的實際價值 (A) 為 **1,000.00**，但低報模式下的申報金額 (B) 僅為 **500.00**。",
    category: "核心模式"
  },
  // 第二階段：銷售定價與競爭力分析
  "Q3": {
    question: "為什麼低報模式的帳面毛利率高達 185%，但全報模式僅為 60%？",
    answer: "因為低報模式的進項成本 (C) 在帳面上僅為 **750.00**（全報為 1,500.00），必須透過極高的 185% 毛利率，才能讓最終的銷售發票金額達到 **2,137.50**，使其不與市場價脫節。",
    category: "競爭力分析"
  },
  "Q4": {
    question: "如何計算「正清低報」帶來的 10.9% 競爭優勢？",
    answer: "計算公式：`(全報發票金額 2,400.00 - 低報發票金額 2,137.50) / 2,400.00 = 10.9%`。這代表低報模式能讓企業開給客戶的含稅發票總額從 **3,072.00** 降至 **2,736.00**，獲得約 **10.9%** 的價格競爭力。",
    category: "競爭力分析",
    visualComponent: "competitiveness-bar"
  },
  // 第三階段：2027 新稅制 (CBS/IBS) 抵扣邏輯
  "Q5": {
    question: "2027 年導入的 28% CBS/IBS 是如何運作的？",
    answer: "這是一種「非累積性」稅制，企業在進口時繳納的稅金可作為「可抵扣額」。例如全報模式在進口端繳納 **420.00** (D9)，這筆錢可以在銷售端應付的 **672.00** 中扣除，最終僅需補繳 **252.00** (D17)。",
    category: "2027新稅制",
    visualComponent: "tax-flow"
  },
  "Q6": {
    question: "為什麼低報模式在銷售階段需要「多繳稅」？",
    answer: "因為低報模式在進口時只繳了 **210.00**，導致可抵扣額度不足。雖然其銷售端的總應付稅額 (598.50) 較低，但扣除抵扣額後，實繳金額反而跳升至 **388.50**。這證明了低報只是將稅負從進口端推遲到銷售端。",
    category: "2027新稅制",
    visualComponent: "抵消對比"
  },
  // 第四階段：所得稅與利潤結算
  "Q7": {
    question: "利潤推算制 (Lucro Presumido) 的所得稅基 (F, G) 如何計算？",
    answer: "其特色是不看實際盈虧，直接以發票金額進行推算。**企業所得稅 (IRPJ)** 的稅基是發票金額的 **8%**，**社會安全捐 (CSLL)** 則按 **12%** 推算，最後分別乘以 15% 與 9% 的稅率。",
    category: "利潤結算"
  },
  "Q8": {
    question: "在計算「正清低報」的淨利 (H) 時，公式為何是 H = E - D - F - G - B？",
    answer: "因為低報的 **500.00 (B)** 是未在進口單據上顯現的隱形成本。在計算真實獲利時，必須從毛利中扣除這筆「未申報貨款」，否則會高估利潤。",
    category: "利潤結算"
  },
  // 第五階段：綜合評價與決策建議（關鍵！）
  "Q9": {
    question: "為什麼利潤推算制的淨利會高於實際利潤制？",
    answer: "在毛利較高（如 60%）的情況下，利潤推算制的「推算稅基」遠低於真實利潤。例如全報模式下，利潤推算制的淨利為 **345.28**，優於實際利潤制的 **304.00**。",
    category: "綜合評價"
  },
  "Q10": {
    question: "從審計角度看，企業應該選擇哪種模式？",
    answer: "**首選「利潤推算制 + 正清全報」**。此模式���達���最高的總返款金額 (**1,345.28**)，且屬於 **100% 合規經營**。相比之下，低報模式的回款 (**1,338.77**) 較低，且必須承擔**未來被國稅局稽查的風險 (Risco de ser fiscalizado)**。",
    category: "綜合評價"
  },
  // 第六階段：數值帶入演示（稅務抵銷）
  "Q11": {
    question: "請以數值帶入的方式解釋，在低報時少支付的稅，最終將在銷售時的CBS/IBS 與 IRPJ/CSLL 抵銷",
    answer: "**進口端節省**：在海關環節「少支付」了 **250.00** 的稅金。\n**CBS/IBS 抵銷**：低報模式在銷售階段需「多支付」**136.50** (388.50 - 252.00) 的現金流，直接抵銷了進口端約 55% 的節稅利益。\n**凈效果**：低報模式最終的稅後淨利反而比全報模式**少了 6.51**，回款金額也更低。",
    category: "稅務抵銷數值演示",
    visualComponent: "tax-offset-demo"
  }
};
```

- [ ] **Step 2: 編寫 Enhanced 互動區塊（多種 UI 組件）**

在因果連接後加入 Enhanced 互動式區塊：

#### 2.1 頂部：模式切換（Toggle）+ CBS/IBS 箭頭流動圖

```html
<!-- 頂部切換開關 -->
<div class="tax-toggle-container" id="tax-toggle">
  <div class="toggle-buttons">
    <button class="toggle-btn active" data-mode="full" data-action="switch-mode">
      正清全報 (合規)
    </button>
    <button class="toggle-btn" data-mode="subf" data-action="switch-mode">
      正清低報 ⚠️
    </button>
  </div>
</div>

<!-- CBS/IBS 箭頭流動圖 -->
<div class="tax-flow-diagram" id="tax-flow-diagram">
  <!-- 進口端 -->
  <div class="flow-box input">
    <div class="flow-label">📥 進口端 (可抵扣額)</div>
    <div class="flow-value" id="flow-import">$420.00</div>
    <div class="flow-formula">申報金額 × 28%</div>
  </div>
  
  <!-- 箭頭 -->
  <div class="flow-arrow">➖ 抵扣 ➖</div>
  
  <!-- 銷售端 -->
  <div class="flow-box output">
    <div class="flow-label">📤 銷售端 (應付稅額)</div>
    <div class="flow-value" id="flow-sales">$672.00</div>
    <div class="flow-formula">銷售額 × 28%</div>
  </div>
  
  <!-- 等號 -->
  <div class="flow-equals">=</div>
  
  <!-- 實繳結果 -->
  <div class="flow-box net">
    <div class="flow-label">💰 抵扣後實繳</div>
    <div class="flow-value net-paid" id="flow-net">$252.00</div>
    <div class="flow-formula">銷項 - 進項</div>
  </div>
</div>
```

#### 2.2 橫向進度條（10.9% 競爭力展示）

```html
<!-- 10.9% 競爭力橫向進度條 -->
<div class="competitiveness-bar">
  <div class="bar-header">
    <span>市場競爭力對比</span>
    <span class="bar-highlight">10.9% 售價優勢</span>
  </div>
  <!-- 全報基準 -->
  <div class="bar-row">
    <div class="bar-label">正清全報</div>
    <div class="bar-track">
      <div class="bar-fill" style="width: 100%"></div>
    </div>
    <div class="bar-value">$2,400.00</div>
  </div>
  <!-- 低報對比 -->
  <div class="bar-row">
    <div class="bar-label">
      正清低報
      <span class="risk-badge">⚠️ Risco</span>
    </div>
    <div class="bar-track">
      <div class="bar-fill bar-subf" style="width: 89.1%"></div>
      <div class="bar-gap" style="width: 10.9%"></div>
    </div>
    <div class="bar-value">$2,137.50</div>
  </div>
</div>
```

#### 2.3 稅務抵銷數值演示區塊

```html
<!-- 稅務抵銷數值演示 -->
<div class="tax-offset-demo">
  <h3>📊 低報時少支付的稅，如何被抵銷？</h3>
  
  <div class="offset-items">
    <!-- 第一步：進口端節省 -->
    <div class="offset-item step-1">
      <div class="step-badge">Step 1</div>
      <div class="step-content">
        <div class="step-title">進口端：少支付的稅</div>
        <div class="step-calc">
          <span class="formula">全報: $500 - 低報: $250 =</span>
          <span class="result">-$250.00 ✅</span>
        </div>
      </div>
    </div>
    
    <!-- 箭頭 -->
    <div class="step-arrow">⬇️</div>
    
    <!-- 第二步：銷售端多繳 -->
    <div class="offset-item step-2">
      <div class="step-badge">Step 2</div>
      <div class="step-content">
        <div class="step-title">銷售端：CBS/IBS 實繳增加</div>
        <div class="step-calc">
          <span class="formula">低報: $388.50 - 全報: $252.00 =</span>
          <span class="result text-red">+$136.50 ❌</span>
        </div>
      </div>
    </div>
    
    <!-- 箭頭 -->
    <div class="step-arrow">⬇️</div>
    
    <!-- 第三步：淨效果 -->
    <div class="offset-item step-3">
      <div class="step-badge">Step 3</div>
      <div class="step-content">
        <div class="step-title">淨效果：被抵銷</div>
        <div class="step-calc">
          <span class="formula">-$250 + $136.50 =</span>
          <span class="result">-$113.50</span>
          <span class="explanation">僅抵銷 45%，仍有損失</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### 2.4 三種模式的 Accordion（含風險警示徽章）

```html
<div class="accordion-container" id="comparison-accordion">
  <!-- 模式 1: Lucro Real 正清全報 -->
  <div class="accordion-item" data-mode="real-full">
    <div class="accordion-header">
      <span class="accordion-step">1</span>
      <span class="accordion-title">實際利潤制 (Lucro Real) - 正清全報</span>
      <span class="risk-badge full-compliance">✅ 100% 合規</span>
      <span class="accordion-toggle">▼</span>
    </div>
    <div class="accordion-content">
      <table class="comparison-table">
        <tr><td>項目</td><td>代碼</td><td>數值</td><td>公式說明</td></tr>
        <tr><td>實際貨價 (CIF)</td><td>A</td><td class="num">1,000.00</td><td>基礎物料成本</td></tr>
        <tr><td>申報金額 (DUIMP)</td><td>B</td><td class="num">1,000.00</td><td>正清全報 = A</td></tr>
        <tr><td>進口稅費</td><td>-</td><td class="num">500.00</td><td>B × 50%</td></tr>
        <tr><td>進項發票金額</td><td>C</td><td class="num">1,500.00</td><td>B + 進口稅費</td></tr>
        <tr><td>毛利率</td><td>-</td><td class="num">60%</td><td>用戶指定</td></tr>
        <tr><td>毛利 (E)</td><td>E</td><td class="num">900.00</td><td>C × 60%</td></tr>
        <tr><td>銷售發票金額</td><td>F</td><td class="num">2,400.00</td><td>C + E</td></tr>
        <tr><td>企業所得稅 (IRPJ)</td><td>F</td><td class="num">60.00</td><td>(E-D) × 15%</td></tr>
        <tr><td>社會安全捐 (CSLL)</td><td>G</td><td class="num">36.00</td><td>(E-D) × 9%</td></tr>
        <tr><td>營運成本</td><td>D</td><td class="num">500.00</td><td>固定支出</td></tr>
        <tr class="highlight"><td>稅後淨利 (H)</td><td>H</td><td class="num">304.00</td><td>E-D-F-G</td></tr>
        <tr class="highlight"><td>總返款中國金額</td><td>-</td><td class="num">1,304.00</td><td>A + H</td></tr>
      </table>
    </div>
  </div>

  <!-- 模式 2: Lucro Presumido 正清全報 -->
  <div class="accordion-item" data-mode="presumido-full">
    <div class="accordion-header">
      <span class="accordion-step">2</span>
      <span class="accordion-title">利潤推算制 (Lucro Presumido) - 正清全報</span>
      <span class="risk-badge full-compliance">✅ 100% 合規</span>
      <span class="accordion-toggle">▼</span>
    </div>
    <div class="accordion-content">
      <table class="comparison-table">
        <tr><td>項目</td><td>代碼</td><td>數值</td><td>公式說明</td></tr>
        <tr><td>實際貨價 (CIF)</td><td>A</td><td class="num">1,000.00</td><td>基礎物料成本</td></tr>
        <tr><td>申報金額 (DUIMP)</td><td>B</td><td class="num">1,000.00</td><td>正清全報 = A</td></tr>
        <tr><td>進口稅費</td><td>-</td><td class="num">500.00</td><td>B × 50%</td></tr>
        <tr><td>進項發票金額</td><td>C</td><td class="num">1,500.00</td><td>B + 進口稅費</td></tr>
        <tr><td>毛利率</td><td>-</td><td class="num">60%</td><td>用戶指定</td></tr>
        <tr><td>毛利 (E)</td><td>E</td><td class="num">900.00</td><td>C × 60%</td></tr>
        <tr><td>銷售發票金額</td><td>F</td><td class="num">2,400.00</td><td>C + E</td></tr>
        <tr><td>企業所得稅 (IRPJ)</td><td>F</td><td class="num">28.80</td><td>F16 × 8% × 15%</td></tr>
        <tr><td>社會安全捐 (CSLL)</td><td>G</td><td class="num">25.92</td><td>F16 × 12% × 9%</td></tr>
        <tr><td>營運成本</td><td>D</td><td class="num">500.00</td><td>不扣除</td></tr>
        <tr class="highlight"><td>稅後淨利 (H)</td><td>H</td><td class="num text-green">345.28</td><td>E-D-F-G</td></tr>
        <tr class="highlight"><td>總返款中國金額</td><td>-</td><td class="num text-green">1,345.28</td><td>A + H</td></tr>
      </table>
      <p class="formula-note"><strong>💡 為何淨利更高？</strong>利潤推算制的稅基基於銷售額的 8% 和 12% 推算，不考慮實際成本。當毛利率 60% > 推算比例時，稅負較低。</p>
    </div>
  </div>

  <!-- 模式 3: Lucro Presumido 低報 (Sub F.) -->
  <div class="accordion-item" data-mode="presumido-subf" style="border-color:#cf222e;">
    <div class="accordion-header">
      <span class="accordion-step">3</span>
      <span class="accordion-title">利潤推算制 (Lucro Presumido) - 正清低報</span>
      <span class="risk-badge high-risk animate-pulse">⚠️ Risco de ser fiscalizado</span>
      <span class="accordion-toggle">▼</span>
    </div>
    <div class="accordion-content">
      <div class="risk-alert">⚠️ 風險警示：此模式存在 <strong>被國稅局稽查的風險 (Risco de ser fiscalizado)</strong></div>
      <table class="comparison-table">
        <tr><td>項目</td><td>代碼</td><td>數值</td><td>公式說明</td></tr>
        <tr><td>實際貨價 (CIF)</td><td>A</td><td class="num">1,000.00</td><td>基礎物料成本</td></tr>
        <tr><td><strong>申報金額 (DUIMP)</strong></td><td><strong>B</strong></td><td class="num text-red">500.00</td><td>低報金額</td></tr>
        <tr><td>進口稅費</td><td>-</td><td class="num">250.00</td><td>B × 50%</td></tr>
        <tr><td>進項發票金額</td><td>C</td><td class="num">750.00</td><td>B + 進口稅費</td></tr>
        <tr><td><strong>毛利率</strong></td><td>-</td><td class="num text-red">185%</td><td>為維持售價而拉高</td></tr>
        <tr><td>毛利 (E)</td><td>E</td><td class="num">1,387.50</td><td>C × 185%</td></tr>
        <tr><td>銷售發票金額</td><td>F</td><td class="num">2,137.50</td><td>C + E</td></tr>
        <tr><td>企業所得稅 (IRPJ)</td><td>F</td><td class="num">25.65</td><td>F16 × 8% × 15%</td></tr>
        <tr><td>社會安全捐 (CSLL)</td><td>G</td><td class="num">23.09</td><td>F16 × 12% × 9%</td></tr>
        <tr><td>營運成本</td><td>D</td><td class="num">500.00</td><td>不扣除</td></tr>
        <tr class="highlight"><td>稅後淨利 (H)</td><td>H</td><td class="num">338.77</td><td>E-D-F-G-B</td></tr>
        <tr class="highlight"><td>總返款中國金額</td><td>-</td><td class="num">1,338.77</td><td>A + H</td></tr>
      </table>
      <p class="formula-note text-red"><strong>⚠️ 為何需扣除 500？</strong>低報模式的淨利公式必須扣除「未申報的實際貨款差額」，即 1,000 - 500 = 500。</p>
      <p class="formula-note"><strong>📉 銷售發票降幅：10.9%</strong><br>計算：(2,400 - 2,137.50) / 2,400 = 10.9%<br>這是低報模式的主要動機：降價競爭力。</p>
    </div>
  </div>
</div>
```

#### 2.5 Q&A 學習區塊

```html
<!-- Q&A 學習區塊 -->
<div class="qa-section" id="qa-learning">
  <h3>📚 循序漸進學習指南</h3>
  
  <div class="qa-accordion">
    <!-- Q1-Q2: 基礎概念 -->
    <div class="qa-item" data-q="Q1">
      <div class="qa-question">Q1: 這份分析報告主要對比了哪些經營模式？</div>
      <div class="qa-answer">
        <p>報告主要對比了三種情境：<strong>Lucro Real 正清全報</strong>、<strong>Lucro Presumido 正清全報</strong>、以及<strong>Lucro Presumido 低報 (Sub F.)</strong>。</p>
      </div>
    </div>
    
    <!-- Q3-Q4: 競爭力分析 -->
    <div class="qa-item" data-q="Q3">
      <div class="qa-question">Q3: 為什麼低報模式的帳面毛利率高達 185%？</div>
      <div class="qa-answer">
        <p>因為低報模式的進項成本 (C) 在帳面上僅為 <strong>750.00</strong>（全報為 1,500.00），必須透過極高的 185% 毛利率，才能讓最終的銷售發票金額達到 <strong>2,137.50</strong>。</p>
      </div>
    </div>
    
    <!-- Q5-Q6: CBS/IBS 抵扣 -->
    <div class="qa-item" data-q="Q5">
      <div class="qa-question">Q5: 2027 年導入的 28% CBS/IBS 是如何運作的？</div>
      <div class="qa-answer">
        <p>這是一種「非累積性」稅制：全報模式在進口端繳納 <strong>420.00</strong>，在銷售端應付 <strong>672.00</strong>，最終僅需補繳 <strong>252.00</strong>。</p>
      </div>
    </div>
    
    <!-- Q11: 稅務抵銷 -->
    <div class="qa-item" data-q="Q11">
      <div class="qa-question">Q11: 低報時少支付的稅，如何被抵銷？</div>
      <div class="qa-answer">
        <p>進口端少支付 <strong>$250</strong> → 銷售端多繳 <strong>$136.50</strong> → 凈效果：被抵銷 <strong>$113.50</strong>，仍在銷售端多繳稅。</p>
        <p class="text-red">⚠️ 結論：低報模式的節稅效果最終被完全抵銷！</p>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 3: 驗證 HTML 塊封閉正確**

確認所有 `<div>` 和 `<table>` 标签正確闭合，無空白行。

- [ ] **Step 4: Commit**

---

## Chunk 2: 互動 JavaScript

### Task 3: 加入 Enhanced 互動邏輯（Toggle + Accordion + Flow）

**Files:**
- Modify: `src/pages/handbook/[...slug].astro:200-300`

- [ ] **Step 1: 在 script 區塊中加入 Enhanced 處理函數**

在現有的 IIFE 中添加：

```typescript
// Enhanced 稅務對比互動處理
(function initTaxComparison() {
  // 數據結構（來自 taxComparisonData.ts）
  const taxData = {
    full: {
      importCredit: 420.00,
      salesDebit: 672.00,
      netPaid: 252.00,
      salesNF: 2400.00,
      grossProfit: 900.00,
      netProfit: 345.28,
      remittance: 1345.28
    },
    subf: {
      importCredit: 210.00,
      salesDebit: 598.50,
      netPaid: 388.50,
      salesNF: 2137.50,
      grossProfit: 1387.50,
      netProfit: 338.77,
      remittance: 1338.77
    }
  };

  // === Toggle 切換邏輯 ===
  const toggleContainer = document.getElementById('tax-toggle');
  if (toggleContainer) {
    toggleContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="switch-mode"]');
      if (!btn) return;

      const mode = btn.getAttribute('data-mode');
      
      // 切換按鈕狀態
      toggleContainer.querySelectorAll('.toggle-btn').forEach(b => {
        b.classList.remove('active');
        if (b.getAttribute('data-mode') === mode) {
          b.classList.add('active');
        }
      });

      // 更新箭頭流動圖數值
      const flowImport = document.getElementById('flow-import');
      const flowSales = document.getElementById('flow-sales');
      const flowNet = document.getElementById('flow-net');
      
      if (flowImport && flowSales && flowNet) {
        const data = taxData[mode];
        flowImport.textContent = `$${data.importCredit.toFixed(2)}`;
        flowSales.textContent = `$${data.salesDebit.toFixed(2)}`;
        flowNet.textContent = `$${data.netPaid.toFixed(2)}`;
        
        // 低報模式紅色高亮
        if (mode === 'subf') {
          flowImport.classList.add('text-red');
          flowSales.classList.add('text-red');
          flowNet.classList.add('text-red');
        } else {
          flowImport.classList.remove('text-red');
          flowSales.classList.remove('text-red');
          flowNet.classList.remove('text-red');
        }
      }
    });
  }

  // === Accordion 互動處理 ===
  const accordionContainer = document.getElementById('comparison-accordion');
  if (accordionContainer) {
    accordionContainer.addEventListener('click', (e) => {
      const header = e.target.closest('.accordion-header');
      if (!header) return;

      const item = header.closest('.accordion-item');
      const isOpen = item.classList.contains('is-open');

      // 關閉所有
      accordionContainer.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('is-open');
      });

      // 如果原本是關閉的，則打開
      if (!isOpen) {
        item.classList.add('is-open');
      }
    });
  }

  // === Q&A 展開處理 ===
  const qaSection = document.getElementById('qa-learning');
  if (qaSection) {
    qaSection.addEventListener('click', (e) => {
      const question = e.target.closest('.qa-question');
      if (!question) return;

      const item = question.closest('.qa-item');
      item.classList.toggle('is-open');
    });
  }
})();
```

- [ ] **Step 2: 測試 Enhanced 互動**

1. 打開瀏覽器進入 `/handbook/04-tax-declaration-comparison`
2. 點擊 Toggle 切換「正清全報/正清低報」
3. 確認箭頭流動圖數值動態更新
4. 確認低報模式紅色警示
5. 點擊 Q&A 問題展開答案

- [ ] **Step 3: Commit**

---

## Chunk 3: 樣式與術語

### Task 4: 加入 Accordion CSS 樣式

**Files:**
- Check: `src/styles/global.css` 是否已有 `.accordion-*` 樣式
- Modify: 如需要則加入新樣式

- [ ] **Step 1: 檢查現有樣式**

執行: `grep -n "accordion" src/styles/global.css`

- [ ] **Step 2: 如無則加入 Enhanced CSS**

```css
/* ===== Enhanced UI Components ===== */

/* === Toggle Switch === */
.tax-toggle-container {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
}

.toggle-buttons {
  display: flex;
  background: rgba(15,15,24,0.8);
  border-radius: 9999px;
  padding: 4px;
  gap: 4px;
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 0.9rem;
  color: #9ca3af;
  background: transparent;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.toggle-btn:hover {
  color: #fff;
}

.toggle-btn.active {
  background: var(--color-gold);
  color: #000;
  box-shadow: 0 0 12px rgba(var(--color-gold-rgb), 0.5);
}

/* === Tax Flow Diagram (Arrow Flow) === */
.tax-flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(10,10,18,0.9), rgba(15,15,24,0.7));
  border-radius: 1rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.flow-box {
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
  min-width: 140px;
}

.flow-box.input {
  background: rgba(34, 197, 94, 0.15);
  border: 2px solid #22c55e;
}

.flow-box.output {
  background: rgb(249, 115, 22, 0.15);
  border: 2px solid #f97316;
}

.flow-box.net {
  background: rgba(59, 130, 246, 0.2);
  border: 2px solid #3b82f6;
}

.flow-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.flow-value {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-mono);
}

.flow-value.net-paid {
  color: #3b82f6;
}

.flow-formula {
  font-size: 0.7rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

.flow-arrow, .flow-equals {
  font-size: 1.5rem;
  color: var(--color-gold);
}

/* === Competitiveness Bar === */
.competitiveness-bar {
  padding: 1.5rem;
  background: rgba(10,10,18,0.6);
  border-radius: 0.75rem;
  margin: 2rem 0;
}

.bar-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-weight: 600;
}

.bar-highlight {
  background: var(--color-gold);
  color: #000;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
}

.bar-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.bar-label {
  width: 100px;
  font-size: 0.85rem;
  font-weight: 500;
}

.bar-track {
  flex: 1;
  height: 24px;
  background: rgba(30, 30, 40, 0.8);
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #475569, #64748b);
  border-radius: 9999px;
}

.bar-fill.bar-subf {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}

.bar-gap {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  background: repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px);
}

.bar-value {
  width: 80px;
  text-align: right;
  font-family: var(--font-mono);
  font-weight: 600;
}

/* === Tax Offset Demo === */
.tax-offset-demo {
  padding: 1.5rem;
  background: rgba(10,10,18,0.6);
  border-radius: 0.75rem;
  margin: 2rem 0;
  border-left: 4px solid var(--color-gold);
}

.tax-offset-demo h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.offset-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.offset-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(15,15,24,0.5);
  border-radius: 0.5rem;
}

.step-badge {
  background: var(--color-gold);
  color: #000;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.8rem;
}

.step-content {
  flex: 1;
}

.step-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.step-calc {
  font-family: var(--font-mono);
  font-size: 0.9rem;
}

.step-calc .result {
  font-weight: 700;
  margin-left: 0.5rem;
}

.step-calc .result.text-red {
  color: #ef4444;
}

.step-calc .explanation {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-left: 0.5rem;
}

.step-arrow {
  text-align: center;
  color: var(--color-gold);
}

/* === Risk Badge === */
.risk-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 700;
}

.risk-badge.full-compliance {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.risk-badge.high-risk {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

/* === Q&A Section === */
.qa-section {
  margin: 3rem 0;
  padding: 1.5rem;
  background: rgba(10,10,18,0.5);
  border-radius: 0.75rem;
}

.qa-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.2rem;
}

.qa-item {
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.qa-item:last-child {
  border-bottom: none;
}

.qa-question {
  padding: 1rem 0;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.qa-question::after {
  content: '+';
  font-size: 1.25rem;
  transition: transform 0.2s;
}

.qa-item.is-open .qa-question::after {
  transform: rotate(45deg);
}

.qa-answer {
  display: none;
  padding-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: #d1d5db;
}

.qa-item.is-open .qa-answer {
  display: block;
}

/* === Accordion Original === */
.accordion-container {
  margin: 2rem 0;
  border: 1px solid rgba(var(--color-gold-rgb), 0.3);
  border-radius: 0.75rem;
  overflow: hidden;
}

.accordion-item {
  border-bottom: 1px solid rgba(var(--color-gold-rgb), 0.15);
}

.accordion-item:last-child {
  border-bottom: none;
}

.accordion-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(15,15,24,0.6), rgba(20,20,30,0.4));
  cursor: pointer;
  transition: background 0.2s;
}

.accordion-header:hover {
  background: linear-gradient(135deg, rgba(15,15,24,0.8), rgba(20,20,30,0.6));
}

.accordion-step {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-gold);
  color: #000;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.85rem;
}

.accordion-title {
  flex: 1;
  font-weight: 600;
  font-size: 1.05rem;
}

.accordion-toggle {
  color: var(--color-gold);
  transition: transform 0.2s;
}

.accordion-item.is-open .accordion-toggle {
  transform: rotate(180deg);
}

.accordion-content {
  display: none;
  padding: 1rem 1.25rem;
  background: rgba(10,10,18,0.5);
  animation: fadeIn 0.3s ease;
}

.accordion-item.is-open .accordion-content {
  display: block;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 風險警示樣式 */
.risk-alert {
  padding: 0.75rem 1rem;
  background: rgba(207, 34, 34, 0.15);
  border: 1px solid #cf222e;
  border-radius: 0.5rem;
  color: #ff6b6b;
  font-weight: 600;
  margin-bottom: 1rem;
}

/* 表格數值樣式 */
.comparison-table td.num {
  text-align: right;
  font-family: var(--font-mono, monospace);
  font-size: 0.95rem;
}

.comparison-table td.text-red {
  color: #ff6b6b;
}

.comparison-table tr.highlight td {
  background: rgba(var(--color-gold-rgb), 0.15);
  font-weight: 700;
  border-top: 2px solid var(--color-gold);
}

.formula-note {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(10,10,18,0.6);
  border-radius: 0.5rem;
  font-size: 0.9rem;
  line-height: 1.6;
}

.formula-note.text-red {
  border-left: 3px solid #cf222e;
}

.formula-note strong {
  color: var(--color-gold);
}
```

- [ ] **Step 3: Commit**

### Task 5: 加入術語到詞典

**Files:**
- Modify: `src/data/glossary.ts`

- [ ] **Step 1: 加入新術語（~20個，基於 Q&A 對話）**

```typescript
// === 基礎術語 ===
{
  term: 'CIF',
  category: 'logistics',
  pronunciation: 'see-ef',
  fullPortuguese: 'Cost, Insurance, Freight',
  chineseName: '到岸價',
  oneLiner: '含運費和保險的货物成本',
  fullExplanation: '進口貨物的總成本，包括產品價格、國際運費和保險費用。在巴西進口稅務中，CIF 是計算關稅和 CBS/IBS 的基礎。',
  practicalTips: ['申報時如實填寫 CIF', '保留運費和保險發票'],
  relatedTerms: ['DUIMP', 'II', 'CBS'],
},
{
  term: 'DUIMP',
  category: 'tax',
  pronunciation: 'doo-eem-pee',
  fullPortuguese: 'Declaração Universal de Importação',
  chineseName: '進口申報單',
  oneLiner: '巴西海關進口報關單據',
  fullExplanation: '巴西海關使用的進口報關文件，包含申報金額、貨品描述、NCM 稅則號列等資訊。',
  practicalTips: ['正本必須保留 5 年', '低報會被罰款'],
  relatedTerms: ['SUB F.', 'RADAR', ' LI'],
},

// === 稅務制度 ===
{
  term: 'Lucro Real',
  category: 'tax',
  pronunciation: 'loo-gro ʁeaw',
  fullPortuguese: 'Lucro Real',
  chineseName: '實際利潤制',
  analogy: '🇹🇼 類似台灣的「查帳核定」',
  oneLiner: '以實際利潤計算所得稅，需保存完整帳冊',
  fullExplanation: '巴西稅制中的一種所得稅計算方式，以企業實際獲得的利潤（收入減去所有成本費用）為稅基，計算 IRPJ（15%）和 CSLL（9%）。優點是可抵扣進項稅額，缺點是計算複雜。需要專業會計師協助。',
  practicalTips: ['適合大型企業或毛利率較低的企業', '可抵扣進口時繳納的 CBS/IBS', '需要完整會計紀錄'],
  commonMistakes: ['誤以為可以瞞報成本', '未保留進項發票'],
  relatedTerms: ['Lucro Presumido', 'IRPJ', 'CSLL', 'CBS', 'IBS'],
},
{
  term: 'Lucro Presumido',
  category: 'tax',
  pronunciation: 'loo-gro preh-zoo-mee-do',
  fullPortuguese: 'Lucro Presumido',
  chineseName: '利潤推算制',
  analogy: '🇹🇼 類似台灣的「核定徵收」',
  oneLiner: '以銷售額按法定比例推算利潤計算所得稅',
  fullExplanation: '巴西稅制中的一種所得稅計算方式，政府「推算」企業應有的利潤比例（IRPJ 8%、CSLL 12%），不論企業實際成本高低。適合營業額較高但利潤率也較高的企業。優點是計算簡單，缺點是毛利率低時稅負可能偏高。',
  practicalTips: ['當毛利率 > 12% 時通常較省稅', '計算基於銷售發票金額，不扣除成本', '年營業額上限 R$78,000,000'],
  commonMistakes: ['誤以為可以用低報來降低稅負', '未考慮稽查風險'],
  relatedTerms: ['Lucro Real', 'IRPJ', 'CSLL'],
},

// === 所得稅 ===
{
  term: 'IRPJ',
  category: 'tax',
  pronunciation: 'ee-er-pee-zheh',
  fullPortuguese: 'Imposto de Renda da Pessoa Jurídica',
  chineseName: '企業所得稅',
  oneLiner: '巴西企業所得稅，税率 15%（加附徵 10%）',
  fullExplanation: '巴西企業所得稅，標準稅率 15%。當年度應稅利潤超過 R$20,000/月時，需加收 10% 附加稅。',
  practicalTips: ['利潤推算制：稅基 = 銷售額 × 8%', '實際利潤制：稅基 = 實際利潤'],
  relatedTerms: ['CSLL', 'Lucro Real', 'Lucro Presumido'],
},
{
  term: 'CSLL',
  category: 'tax',
  pronunciation: 'seh-seh-eleh-eleh',
  fullPortuguese: 'Contribuição Social sobre o Lucro Líquido',
  chineseName: '社會安全捐',
  oneLiner: '巴西社會安全捐，稅率 9%',
  fullExplanation: '巴西社會安全捐，稅率 9%。用於資助巴西社會保障體系。',
  practicalTips: ['利潤推算制：稅基 = 銷售額 × 12%', '實際利潤制：稅基 = 實際利潤'],
  relatedTerms: ['IRPJ', 'Lucro Real', 'Lucro Presumido'],
},

// === CBS/IBS ===
{
  term: 'CBS',
  category: 'tax',
  pronunciation: 'seh-beh-eseh',
  fullPortuguese: 'Contribuição Social sobre Operações',
  chineseName: '社會稅',
  oneLiner: '2027 年新稅制的社會稅部分',
  fullExplanation: '2027 年巴西稅制改革後導入的新稅種，取代部分 PIS/COFINS。與 IBS 合稱 CBS/IBS，標準稅率 28%。',
  practicalTips: ['可作為進項抵扣', '非累積性稅制'],
  relatedTerms: ['IBS', 'PIS', 'COFINS'],
},
{
  term: 'IBS',
  category: 'tax',
  pronunciation: 'ee-beh-eseh',
  fullPortuguese: 'Imposto sobre Bens e Serviços',
  chineseName: '商品服務稅',
  oneLiner: '2027 年新稅制的增值稅部分',
  fullExplanation: '2027 年巴西稅制改革後導入的新稅種，與 CBS 合稱 CBS/IBS，標準稅率 28%。',
  practicalTips: ['可作為進項抵扣', '非累積性稅制'],
  relatedTerms: ['CBS', 'ICMS'],
},

// === 風險相關 ===
{
  term: 'Sub F.',
  category: 'tax',
  pronunciation: 'soo-bee effe',
  fullPortuguese: 'Subfaturamento',
  chineseName: '低報 / 申報不足',
  oneLiner: '申報金額低於實際貨價的違規行為',
  fullExplanation: '在進口報關時，故意將申報金額（B）申報得低於實際貨價（A），以減少進口稅費。這是一种违规行为，面臨被海關查驗、補稅罰款（最高 225%）的風險。雖然可能降低銷售價格，但長期来看净利並未显著提高，且風險極高。',
  practicalTips: ['强烈不建议使用', '即使低報，销售价格降幅有限（约 10.9%）', '稽查风险极高'],
  commonMistakes: ['誤以為可以躲避稅負', '未考慮被抓後的罰款'],
  relatedTerms: ['DUIMP', 'RADAR', 'Risco de ser fiscalizado'],
},
{
  term: 'Risco de ser fiscalizado',
  category: 'tax',
  pronunciation: 'ʁee-skoo deh sehr fee-skah-lee-zah-doo',
  fullPortuguese: 'Risco de ser fiscalizado',
  chineseName: '被稽查風險',
  oneLiner: '被國稅局查驗的風險',
  fullExplanation: '低報模式將面臨巴西國稅局（Receita Federal）未來稽查的風險，可能導致補稅、罰款甚至刑事起訴。',
  practicalTips: ['建議採用 100% 合規的全報模式', '保留所有發票和單據'],
  relatedTerms: ['SUB F.', 'RADAR', 'MULTAS'],
},

// === 發票相關 ===
{
  term: 'NF de Entrada',
  category: 'tax',
  pronunciation: 'eh-noh-feh deh eh-nah-dah',
  fullPortuguese: 'Nota Fiscal de Entrada',
  chineseName: '進項發票',
  oneLiner: '進口或採購取得的發票',
  fullExplanation: '企業在進口或採購時取得的發票，用於計算進項成本和可抵扣稅額。',
  practicalTips: ['必須妥善保管', '是成本核算的依據'],
  relatedTerms: ['NF de Venda', 'CBS', 'IBS'],
},
{
  term: 'NF de Venda',
  category: 'tax',
  pronunciation: 'eh-noh-feh deh veh-dah',
  fullPortuguese: 'Nota Fiscal de Venda',
  chineseName: '銷售發票',
  oneLiner: '銷售給客戶時開立的發票',
  fullExplanation: '企業在銷售商品或服務時開立的發票，是計算銷項稅額和所得稅的基礎。',
  practicalTips: ['必須如實開立', '是稅務申報的依據'],
  relatedTerms: ['NF de Entrada', 'IRPJ', 'CSLL'],
},
{
  term: 'Copa. NF. Venda',
  category: 'tax',
  pronunciation: 'koh-pah eh-noh-feh deh veh-dah',
  fullPortuguese: 'Comparação Nota Fiscal de Venda',
  chineseName: '銷售發票對比',
  oneLiner: '全報與低報模式下銷售發票金額的降幅比例',
  fullExplanation: '計算公式：(全報發票金額 - 低報發票金額) / 全報發票金額。在來源案例中為 10.9%。這是低報模式的主要動機：降價競爭力。',
  practicalTips: ['10.9% = (2400 - 2137.50) / 2400'],
  relatedTerms: ['SUB F.', 'NF de Venda'],
},
```

- [ ] **Step 2: Commit**

---

## Chunk 4: 測試與驗證

### Task 6: 建立測試檔案

**Files:**
- Create: `tests/tax-comparison-accordion.test.ts`

- [ ] **Step 1: 編寫 Enhanced 測試**

```typescript
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

    // 三種模式
    it('应包含 Lucro Real 模式', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lucro Real/);
    });

    it('应包含 Lucro Presumido 正清全報', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lucro Presumido.*正清全報/s);
    });

    it('应包含 Lucro Presumido 低報', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lucro Presumido.*低報/);
    });

    // 風險警示
    it('应包含低報模式風險警示', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Risco de ser fiscalizado/);
    });

    // 核心數據
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

    // Q&A 區塊
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
```

- [ ] **Step 2: 執行測試**

執行: `npm test -- tests/tax-comparison-accordion.test.ts`
預期: 6 tests fail (檔案不存在)

- [ ] **Step 3: Commit**

---

## Chunk 5: 最終整合

### Task 7: 驗證 Build 成功

**Files:**
- Test: `npm run build`

- [ ] **Step 1: 執行 Build**

執行: `npm run build`
預期: 成功，無錯誤

- [ ] **Step 2: 驗證頁面渲染**

1. 開啟 `/handbook/04-tax-declaration-comparison`
2. 確認三個 Accordion 標題顯示
3. 點擊每個標題確認可展開內容
4. 確認數值表格正確顯示

- [ ] **Step 3: Commit**

- [ ] **Step 4: 執行所有測試**

執行: `npm test`
預期: 全部通過

---

## 執行完成確認清單

- [ ] Task 1: 建立 handbook 檔案框架 + Q&A 數據文件 ✅
- [ ] Task 2: 編寫 Enhanced 互動區塊（Toggle/箭頭流動圖/進度條/Q&A） ✅
- [ ] Task 3: 加入 Enhanced 互動 JavaScript（Toggle + Accordion + Flow） ✅
- [ ] Task 4: 加入 Enhanced CSS 樣式（含所有新 UI 組件） ✅
- [ ] Task 5: 加入術語到詞典（~20個） ✅
- [ ] Task 6: 建立 Enhanced 測試檔案 ✅
- [ ] Task 7: 驗證 Build 成功 ✅

---

## 📋 整合內容摘要（基於 NotebookLM 對話）

### UI 組件（全部已整合）
| 組件 | 對話來源 | 用途 |
|------|---------|------|
| Toggle 切換 | "互動式的對比切換" | 全報 vs 低報 模式切換 |
| 箭頭流動圖 | "CBS/IBS 的進銷項抵扣流動" | 📥 進口 → ➖ 抵扣 → 📤 銷售 → 💰 實繳 |
| 橫向進度條 | "10.9% 競爭優勢的對比條" | 100% vs 89.1% 售價對比 |
| 稅務抵銷演示 | "在低報時少支付的稅，最終將被抵銷" | Step 1 → Step 2 → Step 3 流程 |
| Accordion | 原有計劃 | 三種模式數據展開 |
| Q&A 學習區 | "製作一系列Q&A" | 循序漸進學習 |

### 數據來源 Q&A（全部已整合）
| Q 编号 | 主题 | 核心数值 |
|--------|------|---------|
| Q1-Q2 | 基礎概念與模式概覽 | 3 種模式 |
| Q3-Q4 | 銷售定價與競爭力分析 | 10.9%, 185% |
| Q5-Q6 | CBS/IBS 抵扣邏輯 | 420 → 252, 210 → 388 |
| Q7-Q8 | 所得稅與利潤結算 | IRPJ 8%/12%, H=E-D-F-G-B |
| Q9-Q10 | 綜合評價與決策建議 | 345.28 vs 338.77 |
| Q11 | 稅務抵銷數值演示 | -$250 + $136.50 = 被抵銷 |