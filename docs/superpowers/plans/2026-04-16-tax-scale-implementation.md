# TaxScale 組件實作計劃

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立互動式天秤對比圖，直覺展示三種巴西稅務模式的「總返款中國金額」(A + H)，並支援點擊展開查看完整公式推導鏈。

**Architecture:** 使用 Astro 組件 + CSS 動畫 + GSAP 增強。組件包含天秤視圖（預設）和公式水晶盒（展開狀態）。

**Tech Stack:** Astro, CSS Animations, GSAP (用於增強動畫)

---

## Chunk 1: 建立基礎結構

**目標:** 建立 TaxScale.astro 組件骨架和類型定義

**Files:**
- Create: `br-compass/src/components/TaxVisualization/TaxScale.astro`
- Test: `br-compass/src/pages/handbook/test-tax-scale.astro` (測試頁面)

- [ ] **Step 1: 建立 TaxScale.astro 檔案結構**

```astro
---
interface TaxData {
  A: number;      // CIF 實際貨價
  B: number;      // 申報金額
  importTax: number;  // 進口稅費
  C: number;      // 進項發票
  grossMargin: number;  // 毛利率
  E: number;      // 毛利
  F: number;      // 銷售發票
  I: number;      // IRPJ
  J: number;      // CSLL
  D: number;      // 營運成本
  H: number;      // 稅後淨利
  totalRemittance: number;  // A + H
}

interface TaxMode {
  id: string;
  label: string;
  labelShort: string;
  icon: string;
  status: 'compliant' | 'warning';
  data: TaxData;
}

interface Props {
  modes?: TaxMode[];
  class?: string;
}

const { class: className } = Astro.props;
---
```

- [ ] **Step 2: 設定預設數據**

```astro
const defaultModes: TaxMode[] = [
  {
    id: 'lucro-real',
    label: 'Lucro Real',
    labelShort: '實際利潤制',
    icon: '💼',
    status: 'compliant',
    data: {
      A: 1000, B: 1000, importTax: -500, C: 1500,
      grossMargin: 0.6, E: 900, F: 2400,
      I: 60, J: 36, D: 500, H: 304,
      totalRemittance: 1304
    }
  },
  {
    id: 'lucro-presumido',
    label: 'Lucro Presumido',
    labelShort: '利潤推算制',
    icon: '☀️',
    status: 'compliant',
    data: {
      A: 1000, B: 1000, importTax: -500, C: 1500,
      grossMargin: 0.6, E: 900, F: 2400,
      I: 28.8, J: 25.92, D: 500, H: 345.28,
      totalRemittance: 1345.28
    }
  },
  {
    id: 'subf',
    label: '低報模式',
    labelShort: '低報',
    icon: '🌙',
    status: 'warning',
    data: {
      A: 1000, B: 500, importTax: -250, C: 750,
      grossMargin: 1.85, E: 1387.5, F: 2137.5,
      I: 25.65, J: 23.09, D: 500, H: 338.77,
      totalRemittance: 1338.77
    }
  }
];

const modes = defaultModes;
---
```

- [ ] **Step 3: 建立基礎 HTML 結構**

```astro
<div class:list={["tax-scale-container", className]}>
  <div class="scale-header">
    <h3 class="scale-title">⚖️ 三制對決：誰能帶回最多？</h3>
  </div>

  <div class="scale-wrapper">
    <div class="scale-beam">
      {modes.map((mode) => (
        <div class="scale-weight" data-mode={mode.id}>
          <div class="weight-icon">{mode.icon}</div>
          <div class="weight-label">{mode.labelShort}</div>
          <div class="weight-value">R$ {mode.data.totalRemittance.toFixed(2)}</div>
        </div>
      ))}
    </div>
    <div class="scale-stand"></div>
  </div>

  <div class="scale-insight">
    💡 洞察：利潤推算制正清全報 → 最高返款 R$ 1,345.28，且 100% 合規
  </div>
</div>
```

- [ ] **Step 4: 建立測試頁面**

Create `br-compass/src/pages/handbook/test-tax-scale.astro`:
```astro
---
import TaxScale from '../../components/TaxVisualization/TaxScale.astro';
---
<html>
<head><title>TaxScale Test</title></head>
<body>
  <TaxScale />
</body>
</html>
```

- [ ] **Step 5: 驗證建置**

Run: `cd br-compass && npm run build`
Expected: 無錯誤，成功生成頁面

- [ ] **Step 6: Commit**

```bash
git add br-compass/src/components/TaxVisualization/TaxScale.astro
git add br-compass/src/pages/handbook/test-tax-scale.astro
git commit -m "feat: create TaxScale component skeleton with type definitions"
```

---

## Chunk 2: 天秤視圖樣式

**目標:** 實現天秤搖擺動畫和砝碼預設樣式

**Files:**
- Modify: `br-compass/src/components/TaxVisualization/TaxScale.astro` (加入 `<style>` 區塊)

- [ ] **Step 1: 加入天秤基礎樣式**

```css
.tax-scale-container {
  background: linear-gradient(135deg, rgba(13, 13, 20, 0.95) 0%, rgba(20, 20, 35, 0.95) 100%);
  border: 1px solid rgba(212, 168, 67, 0.2);
  border-radius: 16px;
  padding: 2rem;
  margin: 2rem 0;
  font-family: var(--font-sans), 'Inter', ui-sans-serif, system-ui, sans-serif;
}

.scale-header {
  text-align: center;
  margin-bottom: 2rem;
}

.scale-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gold, #D4A843);
  margin: 0;
}
```

- [ ] **Step 2: 天秤結構樣式**

```css
.scale-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
}

.scale-beam {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  max-width: 800px;
  transform-origin: center center;
  animation: scale-sway 4s ease-in-out infinite;
}

@keyframes scale-sway {
  0%, 100% { transform: rotate(-3deg); }
  50% { transform: rotate(3deg); }
}

.scale-stand {
  width: 20px;
  height: 60px;
  background: linear-gradient(180deg, #D4A843 0%, #8B6914 100%);
  border-radius: 4px;
  margin-top: -2px;
  position: relative;
}

.scale-stand::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -20px;
  width: 60px;
  height: 10px;
  background: #D4A843;
  border-radius: 4px;
}
```

- [ ] **Step 3: 砝碼樣式**

```css
.scale-weight {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(15, 15, 24, 0.9);
  border: 2px solid rgba(212, 168, 67, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.scale-weight:hover {
  transform: scale(1.05);
  border-color: rgba(212, 168, 67, 0.6);
  box-shadow: 0 0 30px rgba(212, 168, 67, 0.2);
}

.weight-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.weight-label {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text, #F5F5F0);
  margin-bottom: 0.5rem;
}

.weight-value {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-mono, 'JetBrains Mono', monospace);
  color: var(--color-gold, #D4A843);
}

/* 狀態顏色 */
.scale-weight[data-mode="lucro-real"] {
  border-color: rgba(0, 255, 135, 0.4);
}
.scale-weight[data-mode="lucro-real"]:hover {
  box-shadow: 0 0 30px rgba(0, 255, 135, 0.3);
}

.scale-weight[data-mode="subf"] {
  border-color: rgba(147, 51, 234, 0.4);
}
.scale-weight[data-mode="subf"]:hover {
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.3);
}
```

- [ ] **Step 4: 洞察區塊樣式**

```css
.scale-insight {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(212, 168, 67, 0.1);
  border: 1px solid rgba(212, 168, 67, 0.2);
  border-radius: 8px;
  text-align: center;
  font-size: 0.95rem;
  color: var(--color-text-muted, #B8BCC8);
}
```

- [ ] **Step 5: 驗證樣式**

Run: `cd br-compass && npm run build`
Expected: 無錯誤

- [ ] **Step 6: Commit**

```bash
git add br-compass/src/components/TaxVisualization/TaxScale.astro
git commit -m "feat: add TaxScale basic styling and sway animation"
```

---

## Chunk 3: 公式水晶盒展開功能

**目標:** 實現點擊展開顯示完整公式推導鏈

**Files:**
- Modify: `br-compass/src/components/TaxVisualization/TaxScale.astro` (加入展開邏輯)

- [ ] **Step 1: 加入展開狀態管理**

```astro
---
// 在 script 區塊頂部加入
let expandedMode: string | null = null;
---

<!-- 在容器上加入 data 屬性 -->
<div class:list={["tax-scale-container", className]} data-expanded={expandedMode || 'none'}>
```

- [ ] **Step 2: 加入展開的公式水晶盒 HTML**

```astro
<div class="formula-crystal" id="formula-crystal">
  <div class="crystal-header">
    <h4 class="crystal-title">📐 公式推導</h4>
    <button class="crystal-close">×</button>
  </div>
  <div class="crystal-content" id="crystal-content">
    <!-- 由 JS 動態填充 -->
  </div>
</div>
```

- [ ] **Step 3: 加入公式水晶盒樣式**

```css
.formula-crystal {
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  background: rgba(13, 13, 20, 0.98);
  border: 2px solid rgba(212, 168, 67, 0.4);
  border-radius: 20px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1000;
  opacity: 0;
  transition: all 0.3s ease;
}

.formula-crystal.active {
  display: block;
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.crystal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(212, 168, 67, 0.2);
}

.crystal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gold, #D4A843);
  margin: 0;
}

.crystal-close {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-text-muted);
  cursor: pointer;
  line-height: 1;
}

.crystal-close:hover {
  color: var(--color-gold);
}
```

- [ ] **Step 4: 加入公式內容樣式**

```css
.formula-block {
  margin-bottom: 1.5rem;
}

.formula-main {
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--font-mono);
  color: var(--color-gold);
  text-align: center;
  padding: 1rem;
  background: rgba(212, 168, 67, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
}

.formula-chain {
  padding-left: 1rem;
  border-left: 3px solid rgba(212, 168, 67, 0.3);
}

.formula-line {
  padding: 0.5rem 0;
  font-family: var(--font-mono);
  font-size: 0.95rem;
  color: var(--color-text);
}

.formula-line .label {
  color: var(--color-text-muted);
}

.formula-line .value {
  font-weight: 700;
}

.formula-line .highlight { color: var(--color-neon-yellow); }
.formula-line .orange { color: #FF8C00; }
.formula-line .green { color: var(--color-neon-green); }
.formula-line .blue { color: var(--color-sky-blue); }
```

- [ ] **Step 5: 加入點擊展開的 JS 邏輯**

```astro
<script>
  const weights = document.querySelectorAll('.scale-weight');
  const crystal = document.querySelector('.formula-crystal');
  const crystalContent = document.getElementById('crystal-content');
  const crystalClose = document.querySelector('.crystal-close');

  const modeData = {
    'lucro-real': {
      icon: '💼',
      label: 'Lucro Real 實際利潤制',
      status: '正清全報',
      formula: `
        <div class="formula-main">總返款中國 = A + H = 1,000 + 304 = <span class="highlight">1,304</span></div>
        <div class="formula-chain">
          <div class="formula-line">
            <span class="label">H (稅後淨利)</span>
            = E - D - I - J
            = 900 - 500 - <span class="highlight">60</span> - <span class="orange">36</span>
            = <span class="green">304</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">E (毛利)</span> = C × 60% = 1,500 × 60% = <span class="green">900</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">I (IRPJ)</span> = E × 15% = <span class="highlight">60</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">J (CSLL)</span> = E × 9% = <span class="orange">36</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">D (營運成本)</span> = <span class="blue">500</span>
          </div>
          <div class="formula-line">
            <span class="label">A (CIF)</span> = 1,000 (實際貨價)
          </div>
          <div class="formula-line">
            <span class="label">C (進項發票)</span> = A + 進口稅費 = 1,000 + 500 = <span class="blue">1,500</span>
          </div>
        </div>
      `
    },
    'lucro-presumido': {
      icon: '☀️',
      label: 'Lucro Presumido 利潤推算制',
      status: '正清全報',
      formula: `
        <div class="formula-main">總返款中國 = A + H = 1,000 + 345.28 = <span class="highlight">1,345.28</span> 🏆</div>
        <div class="formula-chain">
          <div class="formula-line">
            <span class="label">H (稅後淨利)</span>
            = E - D - I - J
            = 900 - 500 - <span class="highlight">28.8</span> - <span class="orange">25.92</span>
            = <span class="green">345.28</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">E (毛利)</span> = C × 60% = 1,500 × 60% = <span class="green">900</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">I (IRPJ)</span> = F×8%×15% = 2,400×8%×15% = <span class="highlight">28.8</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">J (CSLL)</span> = F×12%×9% = 2,400×12%×9% = <span class="orange">25.92</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">F (銷售額)</span> = C + E = 1,500 + 900 = 2,400
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">D (營運成本)</span> = <span class="blue">500</span>
          </div>
          <div class="formula-line">
            <span class="label">A (CIF)</span> = 1,000 (實際貨價)
          </div>
          <div class="formula-line">
            <span class="label">C (進項發票)</span> = A + 進口稅費 = 1,000 + 500 = <span class="blue">1,500</span>
          </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(0,255,135,0.1); border-radius: 8px; text-align: center;">
          💡 為何淨利更高？推算制稅基 = 銷售額×8%/12%，低於實際毛利率 60%
        </div>
      `
    },
    'subf': {
      icon: '🌙',
      label: 'Lucro Presumido 低報模式',
      status: '⚠️ 警示',
      formula: `
        <div class="formula-main">總返款中國 = A + H = 1,000 + 338.77 = <span class="highlight">1,338.77</span></div>
        <div class="formula-chain">
          <div class="formula-line">
            <span class="label">H (稅後淨利)</span>
            = E - D - I - J - B
            = 1,387.5 - 500 - <span class="highlight">25.65</span> - <span class="orange">23.09</span> - 500
            = <span class="green">338.77</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem; color: #9333EA;">
            ⚠️ 需扣除未申報差額 B = 500 (1,000 - 500)
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">E (毛利)</span> = C × 185% = 750 × 185% = <span class="green">1,387.5</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">I (IRPJ)</span> = F×8%×15% = 2,137.5×8%×15% = <span class="highlight">25.65</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">J (CSLL)</span> = F×12%×9% = 2,137.5×12%×9% = <span class="orange">23.09</span>
          </div>
          <div class="formula-line" style="padding-left: 1rem;">
            <span class="label">F (銷售額)</span> = C + E = 750 + 1,387.5 = 2,137.5
          </div>
          <div class="formula-line">
            <span class="label">A (CIF)</span> = 1,000 (實際貨價)
          </div>
          <div class="formula-line">
            <span class="label">C (進項發票)</span> = B + 進口稅費 = 500 + 250 = <span class="blue">750</span>
          </div>
          <div class="formula-line" style="color: #9333EA;">
            <span class="label">B (申報金額)</span> = 500 ← 低於實際貨價！
          </div>
        </div>
        <div style="margin-top: 1rem; padding: 1rem; background: rgba(147,51,234,0.1); border-radius: 8px; text-align: center;">
          ⚠️ 節稅效果最終被抵銷！低報端少付 250，但銷售端多繳稅
        </div>
      `
    }
  };

  weights.forEach(weight => {
    weight.addEventListener('click', () => {
      const modeId = weight.getAttribute('data-mode');
      const data = modeData[modeId];
      
      crystalContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <span style="font-size: 3rem;">${data.icon}</span>
          <div style="font-size: 1.25rem; font-weight: 600; margin-top: 0.5rem;">
            ${data.label}
            <span style="color: ${data.status.includes('警示') ? '#9333EA' : '#00FF87'};">
              ${data.status}
            </span>
          </div>
        </div>
        ${data.formula}
      `;
      
      crystal.classList.add('active');
    });
  });

  crystalClose.addEventListener('click', () => {
    crystal.classList.remove('active');
  });

  crystal.addEventListener('click', (e) => {
    if (e.target === crystal) {
      crystal.classList.remove('active');
    }
  });
</script>
```

- [ ] **Step 6: 驗證功能**

Run: `cd br-compass && npm run build`
Expected: 無錯誤

- [ ] **Step 7: Commit**

```bash
git add br-compass/src/components/TaxVisualization/TaxScale.astro
git commit -m "feat: add formula crystal expansion on click"
```

---

## Chunk 4: 響應式適配

**目標:** 確保天秤在各螢幕尺寸下正常顯示

**Files:**
- Modify: `br-compass/src/components/TaxVisualization/TaxScale.astro`

- [ ] **Step 1: 加入響應式樣式**

```css
/* 平板 */
@media (max-width: 900px) {
  .scale-weight {
    padding: 1rem 1.5rem;
  }
  
  .weight-icon {
    font-size: 2rem;
  }
  
  .weight-value {
    font-size: 1.25rem;
  }
}

/* 手機 */
@media (max-width: 600px) {
  .tax-scale-container {
    padding: 1rem;
  }
  
  .scale-beam {
    flex-direction: column;
    gap: 1rem;
    animation: none;
  }
  
  .scale-weight {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    padding: 1rem;
  }
  
  .weight-icon {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  
  .formula-crystal {
    max-height: 90vh;
    padding: 1rem;
  }
}
```

- [ ] **Step 2: 驗證響應式**

Run: `cd br-compass && npm run build`
Expected: 無錯誤

- [ ] **Step 3: Commit**

```bash
git add br-compass/src/components/TaxVisualization/TaxScale.astro
git commit -m "fix: add responsive styles for mobile"
```

---

## Chunk 5: 無障礙與最終優化

**目標:** 加入無障礙支援和最終微調

**Files:**
- Modify: `br-compass/src/components/TaxVisualization/TaxScale.astro`

- [ ] **Step 1: 加入無障礙屬性**

```astro
<!-- 砝碼加入 aria 屬性 -->
<div class="scale-weight" 
     data-mode={mode.id}
     role="button"
     tabindex="0"
     aria-label={`${mode.labelShort}，總返款 R$ ${mode.data.totalRemittance.toFixed(2)}，點擊查看公式推導`}>
```

```javascript
// 加入鍵盤支援
weight.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    weight.click();
  }
});
```

- [ ] **Step 2: 加入 GSAP 增強動畫（可選）**

```astro
<script>
  import { gsap } from 'gsap';
  
  // 天秤搖擺動畫增強
  gsap.to('.scale-beam', {
    rotation: 3,
    transformOrigin: 'center 100%',
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
</script>
```

- [ ] **Step 3: 最終驗證**

Run: `cd br-compass && npm run build && npm run preview`
Expected: 無錯誤，天秤正常顯示

- [ ] **Step 4: Commit**

```bash
git add br-compass/src/components/TaxVisualization/TaxScale.astro
git commit -m "feat: add accessibility support and GSAP animations"
```

---

## 部署位置

在 `04b-tax-comparison-modes.md` 或 `04a-tax-comparison-intro.md` 中加入 TaxScale 組件：

```markdown
import TaxScale from '../../components/TaxVisualization/TaxScale.astro';

<TaxScale />
```

---

## 驗證清單

- [ ] 天秤搖擺動畫流暢
- [ ] 三種模式數值正確
- [ ] 點擊展開顯示完整公式鏈
- [ ] 響應式設計（桌面/平板/手機）
- [ ] 無障礙支援（Tab + Enter）
- [ ] 建置成功
