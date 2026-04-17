# 巴西進口稅務互動式比較頁面實現文檔

> 用於日後參考的技術實現指南

## 一、實現概覽

### 目標
建立互動式圖文資訊圖表頁面，還原巴西進口稅制轉型下的「正清全報」與「正清低報」三種模式的利潤分析對比。

### 頁面路徑
```
/handbook/04-tax-declaration-comparison
```

### 數據來源
- NotebookLM 對話：`notebooklm-conversation-巴西進口稅制轉型與申報模式利潤分析-chat-2026-04-16.md`
- 進口正清 全額及低報比較.csv

---

## 二、UI 組件清單

| ID | 組件名稱 | HTML Class | 用途 |
|----|----------|------------|------|
| 1 | Toggle 切換 | `.tax-toggle-container` / `.toggle-buttons` / `.toggle-btn` | 切換全報/低報模式 |
| 2 | CBS/IBS 箭頭流動圖 | `.tax-flow-diagram` / `.flow-box` / `.flow-arrow` | 進銷項抵扣流動 |
| 3 | 10.9% 橫向進度條 | `.competitiveness-bar` / `.bar-row` / `.bar-fill` | 售價競爭力展示 |
| 4 | 稅務抵銷演示 | `.tax-offset-demo` / `.offset-item` / `.step-badge` | 數值帶入演示 |
| 5 | Accordion | `.accordion-container` / `.accordion-item` / `.accordion-header` | 三種模式數據 |
| 6 | Q&A 學習區 | `.qa-section` / `.qa-item` / `.qa-question` | 循序漸進學習 |
| 7 | 風險警示徽章 | `.risk-badge` / `.high-risk` / `.animate-pulse` | 低報風險標註 |

---

## 三、數據結構

### 三種模式核心數據

| 模式 | 稅後淨利 (H) | 總返款中國 | CBS/IBS 實繳 |
|------|--------------|------------|--------------|
| Lucro Real 正清全報 | 304.00 | 1,304.00 | 252.00 |
| Lucro Presumido 正清全報 | 345.28 | 1,345.28 | 252.00 |
| Lucro Presumido 低報 | 338.77 | 1,338.77 | 388.50 |

### 關鍵公式

- **毛利 E** = 進項發票 C × 毛利率
- **銷售發票 F** = 進項發票 C + 毛利 E
- **IRPJ**（利潤推算制）= 銷售發票 F × 8% × 15%
- **CSLL**（利潤推算制）= 銷售發票 F × 12% × 9%
- **淨利 H**（低報模式）= E - D - F - G - B（低報差額）
- **10.9% 競爭力** = (2400 - 2137.50) / 2400

---

## 四、CSS 樣式

### 1. Toggle 切換
```css
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
}

.toggle-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 600;
  color: #9ca3af;
  background: transparent;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.toggle-btn.active {
  background: var(--color-gold);
  color: #000;
  box-shadow: 0 0 12px rgba(var(--color-gold-rgb), 0.5);
}
```

### 2. 箭頭流動圖
```css
.tax-flow-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(10,10,18,0.9), rgba(15,15,24,0.7));
  border-radius: 1rem;
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
```

### 3. 風險警示徽章
```css
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

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

---

## 五、HTML 結構範例

### Toggle 切換 + 箭頭流動圖
```html
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

<div class="tax-flow-diagram" id="tax-flow-diagram">
  <div class="flow-box input">
    <div class="flow-label">📥 進口端 (可抵扣額)</div>
    <div class="flow-value" id="flow-import">$420.00</div>
  </div>
  <div class="flow-arrow">➖ 抵扣 ➖</div>
  <div class="flow-box output">
    <div class="flow-label">📤 銷售端 (應付稅額)</div>
    <div class="flow-value" id="flow-sales">$672.00</div>
  </div>
  <div class="flow-equals">=</div>
  <div class="flow-box net">
    <div class="flow-label">💰 抵扣後實繳</div>
    <div class="flow-value net-paid" id="flow-net">$252.00</div>
  </div>
</div>
```

### Accordion 模式區塊
```html
<div class="accordion-container" id="comparison-accordion">
  <div class="accordion-item" data-mode="presumido-full">
    <div class="accordion-header">
      <span class="accordion-step">2</span>
      <span class="accordion-title">利潤推算制 (Lucro Presumido) - 正清全報</span>
      <span class="risk-badge full-compliance">✅ 100% 合規</span>
    </div>
    <div class="accordion-content">
      <!-- 表格內容 -->
    </div>
  </div>
</div>
```

---

## 六、JavaScript 互動邏輯

### 事件委托模式（在 [...slug].astro 中）
```typescript
(function initTaxComparison() {
  const taxData = {
    full: {
      importCredit: 420.00,
      salesDebit: 672.00,
      netPaid: 252.00,
    },
    subf: {
      importCredit: 210.00,
      salesDebit: 598.50,
      netPaid: 388.50,
    }
  };

  // Toggle 切換
  const toggleContainer = document.getElementById('tax-toggle');
  if (toggleContainer) {
    toggleContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="switch-mode"]');
      if (!btn) return;
      
      const mode = btn.getAttribute('data-mode');
      // 更新數值...
    });
  }
})();
```

---

## 七、TDD 測試驗證

### 執行命令
```bash
npm test -- tests/tax-comparison-accordion.test.ts
```

### 結果
- RED 階段：17 failed ✅
- GREEN 階段：17 passed ✅

---

## 八、測試檔案位置

```
br-compass/
└── tests/
    └── tax-comparison-accordion.test.ts
```

---

## 九、章節檔案位置

```
br-compass/
└── src/
    └── content/
        └── handbook/
            └── 04-tax-declaration-comparison.md
```

---

## 十、踩過的坑

### 1. Cloudflare Adapter Build 問題
**現象**：`No build output found. Run 'npm run build' first.`
**原因**：wrangler.jsonc 指向的 dist/server/entry.mjs 不存在
**解決方案**：臨時切換為 @astrojs/node 進行 build 和 preview，完成後恢復

### 2. Astro HTML 塊中不能有空行
**現象**：HTML 塊中的空行會導致 Astro 解析為段落
**解決方案**：確保 HTML 塊內所有元素連續書寫，無空白行

### 3. 事件處理使用 onclick
**現象**：在 Markdown 中使用 onclick 會被 Astro 移除
**解決方案**：使用事件��托 + data-action 屬性

---

## 十一、相關檔案

- `docs/superpowers/plans/2026-04-15-tax-comparison-accordion-plan.md` - 實施計劃
- `20260415/notebooklm-conversation-巴西進口稅制轉型與申報模式利潤分析-chat-2026-04-16.md` - 來源數據
- `PROJECT_GUIDE.md` - 專案開發指引