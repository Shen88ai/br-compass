# 稅制對比工具基礎完善方案 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將現有的 TaxFactory.astro 從簡單的雙模式對比工具，升級為符合巴西 2026 年實際稅制的專業稅務計算工具

**Architecture:** 在現有 TaxFactory 基礎上，新增：(1)進口稅(II/IPI/PIS/COFINS/ICMS)計算模組 (2)Adicional IRPJ 10% 檢查 (3)營業額門檻檢查 (4)2026 稅改過渡期 CBS/IBS 提示 (5)Lucro Real 累積制/非累積制選項

**Tech Stack:** Astro + TypeScript + GSAP

---

## Chunk 1: 稅制選擇流程與邊界檢查

### Task 1.1: 新增稅制選擇下拉選單

**Files:**
- Modify: `src/components/TaxFactory/TaxFactory.astro:82-92`

- [ ] **Step 1: 讀取現有 TaxFactory.astro 結構**

```astro
<!-- 替換現有的模式切換按鈕為下拉選單 -->
<div class="factory-controls">
  <div class="tax-regime-selector">
    <label for="tax-regime">稅制選擇:</label>
    <select id="tax-regime" class="tax-select">
      <option value="simples">Simples Nacional (單一稅)</option>
      <option value="presumido-cumulativo">Lucro Presumido (累積制)</option>
      <option value="presumido-nao-cumulativo">Lucro Presumido (非累積制)</option>
      <option value="real-cumulativo">Lucro Real (累積制-特定行業)</option>
      <option value="real-nao-cumulativo">Lucro Real (非累積制-一般行業)</option>
    </select>
  </div>
</div>
```

- [ ] **Step 2: 新增 CSS 樣式**

```css
.tax-regime-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tax-select {
  background: #1a1a24;
  border: 1px solid #333;
  color: #f5f5f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  cursor: pointer;
}

.tax-select:focus {
  outline: none;
  border-color: #D4A843;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/TaxFactory/TaxFactory.astro
git commit -feat: add tax regime dropdown selector
```

---

### Task 1.2: 新增營業額門檻檢查

**Files:**
- Modify: `src/components/TaxFactory/TaxFactory.astro`

- [ ] **Step 1: 新增營業額輸入欄位**

```astro
<div class="threshold-check">
  <label for="annual-revenue">年度營業額 (R$/年):</label>
  <input type="text" id="annual-revenue" class="revenue-input" placeholder="例如: 5000000" />
  <div class="threshold-warning" id="threshold-warning"></div>
</div>
```

- [ ] **Step 2: 新增門檻檢查邏輯**

```typescript
function checkThreshold(revenue: number): { regime: string; warning: string } {
  if (revenue > 4800000) {
    return { regime: 'simples', warning: '⚠️ 超過 R$4.8M/年，Simples必須退出，強制使用 Lucro Presumido 或 Lucro Real' };
  }
  if (revenue > 78000000) {
    return { regime: 'presumido', warning: '⚠️ 超過 R$78M/年，必須使用 Lucro Real' };
  }
  return { regime: '', warning: '' };
}
```

- [ ] **Step 3: 新增門檻 CSS**

```css
.threshold-warning {
  font-size: 0.75rem;
  color: #E5FF00;
  margin-top: 0.25rem;
  min-height: 1rem;
}
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add annual revenue threshold check"
```

---

### Task 1.3: 新增 PIS/COFINS 稅率設定

**Files:**
- Modify: `src/components/TaxFactory/TaxFactory.astro`

- [ ] **Step 1: 新增 PIS/COFINS 税率常量**

```typescript
const PIS_RATES = {
  'simples': 0,                    // 含於 DAS
  'presumido-cumulativo': 0.0065,   // 累積制 0.65%
  'presumido-nao-cumulativo': 0.0165, // 非累積制 1.65%
  'real-cumulativo': 0.0365,          // 特定行業 3.65%
  'real-nao-cumulativo': 0.0165      // 一般行業 1.65%
};

const COFINS_RATES = {
  'simples': 0,
  'presumido-cumulativo': 0.03,     // 累積制 3%
  'presumido-nao-cumulativo': 0.076, // 非累積制 7.6%
  'real-cumulativo': 0.0365,        // 特定行業無抵扣 3.65%
  'real-nao-cumulativo': 0.076       // 一般行業 7.6%
};
```

- [ ] **Step 2: 新增 UI 顯示當前稅率**

```html
<div class="rate-display">
  <span class="rate-badge">PIS: <span id="pis-rate">0%</span></span>
  <span class="rate-badge">COFINS: <span id="cofins-rate">0%</span></span>
</div>
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add PIS/COFINS rates for different regimes"
```

---

## Chunk 2: 進口稅計算模組

### Task 2.1: 新增進口稅計算面板

**Files:**
- Modify: `src/components/TaxFactory/TaxFactory.astro`

- [ ] **Step 1: 新增進口稅輸入區塊**

```html
<div class="import-tax-panel" id="import-tax-panel">
  <h4>🛃 進口稅計算 (Tributos na Importação)</h4>
  <div class="import-inputs">
    <div class="input-group">
      <label>CIF (Valor Aduaneiro):</label>
      <input type="number" id="cif-value" value="1000" />
    </div>
    <div class="input-group">
      <label>NCM 稅率 (%):</label>
      <input type="number" id="ncm-rate" value="10" />
    </div>
    <div class="input-group">
      <label>IPI 稅率 (%):</label>
      <input type="number" id="ipi-rate" value="10" />
    </div>
    <div class="input-group">
      <label>ICMS 稅率 (%):</label>
      <input type="number" id="icms-rate" value="18" />
    </div>
  </div>
  <div class="import-results">
    <div class="tax-line">II (關稅): <span id="tax-ii">100</span></div>
    <div class="tax-line">IPI: <span id="tax-ipi">110</span></div>
    <div class="tax-line">PIS Importação: <span id="tax-pis">21</span></div>
    <div class="tax-line">COFINS Importação: <span id="tax-cofins">96.5</span></div>
    <div class="tax-line">ICMS: <span id="tax-icms">299.41</span></div>
    <div class="tax-line total">進口稅合計: <span id="tax-total">626.91</span></div>
  </div>
</div>
```

- [ ] **Step 2: 新增計算函數**

```typescript
function calculateImportTax(cif: number, ncmRate: number, ipiRate: number, icmsRate: number) {
  const ii = cif * (ncmRate / 100);
  const baseIpi = cif + ii;
  const ipi = baseIpi * (ipiRate / 100);
  const pis = cif * 0.021;  // 2.1% 固定
  const cofins = cif * 0.0965; // 9.65% 固定
  const baseIcms = cif + ii + ipi + pis + cofins;
  const icms = baseIcms / (1 - icmsRate / 100) * (icmsRate / 100);
  
  return { ii, ipi, pis, cofins, icms, total: ii + ipi + pis + cofins + icms };
}
```

- [ ] **Step 3: 新增 CSS 樣式**

```css
.import-tax-panel {
  background: #1a1a24;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0;
}

.import-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tax-line {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid #222;
  font-size: 0.85rem;
}

.tax-line.total {
  font-weight: 700;
  color: #D4A843;
  border-top: 1px solid #D4A843;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add import tax calculation panel"
```

---

## Chunk 3: Adicional IRPJ 與 2026 稅改過渡

### Task 3.1: 新增 Adicional IRPJ 計算

**Files:**
- Modify: `src/components/TaxFactory/TaxFactory.astro`

- [ ] **Step 1: 新增 Adicional 檢查**

```typescript
function calculateAdicional(profit: number): number {
  // 年化利潤超 R$240,000 (月均 R$20,000) 時加徵 10%
  if (profit > 240000) {
    return profit * 0.10;
  }
  return 0;
}
```

- [ ] **Step 2: 新增至結果顯示**

```html
<div class="adicional-result">
  <span>Adicional IRPJ (10%):</span>
  <span id="adicional-value">R$ 0</span>
</div>
```

- [ ] **Step 3: Commit**

```bash
git commit -m "feat: add Adicional IRPJ calculation"
```

---

### Task 3.2: 新增 2026 稅改過渡期提示

**Files:**
- Modify: `src/components/TaxFactory/TaxFactory.astro`

- [ ] **Step 1: 新增 CBS/IBS 資訊面板**

```html
<div class="tax-reform-notice">
  <h4>📅 2026 稅改過渡期提醒</h4>
  <p>自 2026 年 1 月 1 日起，PIS/COFINS 將逐步被 CBS (0.9%) + IBS (0.1%) 取代</p>
  <label>
    <input type="checkbox" id="enable-2026-reform" />
    啟用 2026 稅改模擬 (Reforma Tributária)
  </label>
</div>
```

- [ ] **Step 2: 新增 CBS/IBS 計算邏輯**

```typescript
const CBS_RATE = 0.009;  // 0.9%
const IBS_RATE = 0.001;  // 0.1%

function calculateCBS_IBS(revenue: number): { cbs: number; ibs: number } {
  return {
    cbs: revenue * CBS_RATE,
    ibs: revenue * IBS_RATE
  };
}
```

- [ ] **Step 3: 新增 CSS**

```css
.tax-reform-notice {
  background: rgba(125, 211, 252, 0.1);
  border: 1px solid #7DD3FC;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
}

.tax-reform-notice h4 {
  color: #7DD3FC;
  margin: 0 0 0.5rem 0;
}
```

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add 2026 tax reform transition notice"
```

---

## Chunk 4: 整合測試與部署

### Task 4.1: 完整整合與測試

**Files:**
- Test: 瀏覽器手動測試

- [ ] **Step 1: Build 測試**

```bash
cd br-compass && npm run build
```

- [ ] **Step 2: 本地開發伺服器測試**

```bash
npm run dev
# 訪問 http://localhost:4321/handbook/04b-tax-comparison-modes
```

- [ ] **Step 3: 提交並 deploy**

```bash
git add -A && git commit -m "feat: enhance tax comparison tool with 2026 tax rules"
git push
npm run build && npx wrangler deploy
```

---

## Expected Output

完成後的 TaxFactory 將具備：

1. **稅制下拉選擇** - 5 種選項 (Simples, Presumido 累積/非累積, Real 累積/非累積)
2. **營業額門檻檢查** - 超過門檻時顯示警告
3. **PIS/COFINS 稅率顯示** - 根據稅制顯示正確稅率
4. **進口稅計算面板** - II/IPI/PIS/COFINS/ICMS 個別計算
5. **Adicional IRPJ** - 超過 R$240k/年自動加徵 10%
6. **2026 稅改提示** - CBS/IBS 資訊與模擬選項