# 稅務計算器整合實施計劃

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 HTML 稅務計算器整合到「巴西_羅盤」Astro 專案，作為 Phase 4 (harvest) 的一個章節，包含全額申報 vs 低報比較、風險評估功能。

**Architecture:** 
- 新增章節 `12-tax-calculator.md` 至 `src/content/handbook/`
- 互動 JS 寫在 `src/pages/handbook/[...slug].astro`
- 稅率資料存於 `src/data/tax-rates.json`
- 使用現有 `global.css` 設計系統

**Tech Stack:** Astro, TypeScript, Vanilla JS (事件委托模式)

---

## Chunk 1: 稅率資料 JSON 創建

**Files:**
- Create: `br-compass/src/data/tax-rates.json`
- Modify: `br-compass/src/data/glossary.ts`
- Test: `tests/tax-rates.test.ts`

---

### Task 1: 建立稅率資料 JSON

**Files:**
- Create: `br-compass/src/data/tax-rates.json`

- [ ] **Step 1: 創建稅率資料 JSON**

```json
{
  "regimes": {
    "simplesNacional": {
      "name": "Simples Nacional",
      "color": "#e07b00",
      "description": "適合小微企業，PIS/COFINS 已含於單一稅率",
      "annualRevenueLimit": 4800000,
      "estimatedRate": 0.06,
      "pisCofinsIncluded": true
    },
    "lucroPresumido": {
      "name": "Lucro Presumido (累積制)",
      "color": "#1a6fbd",
      "description": "法律強制綁定：PIS 0.65% / COFINS 3.0%",
      "annualRevenueLimit": 78000000,
      "pisRate": 0.0065,
      "cofinsRate": 0.03,
      "irpjRate": 0.15,
      "csllRate": 0.09,
      "presumedMargin": 0.08,
      "addicionalThreshold": 240000,
      "addicionalRate": 0.10
    },
    "lucroRealCumulative": {
      "name": "Lucro Real (累積制)",
      "color": "#6f42c1",
      "description": "法律強制特定行業：金融、電信、教育等 (3.65% 無抵扣)",
      "pisRate": 0.0065,
      "cofinsRate": 0.03,
      "irpjRate": 0.15,
      "csllRate": 0.09,
      "presumedMargin": 0.08,
      "addicionalThreshold": 240000,
      "addicionalRate": 0.10,
      "deductible": false
    },
    "lucroRealNonCumulative": {
      "name": "Lucro Real (非累積制)",
      "color": "#1a8f4c",
      "description": "一般大型企業標準：PIS 1.65% / COFINS 7.6% (可抵扣)",
      "pisRate": 0.0165,
      "cofinsRate": 0.076,
      "irpjRate": 0.15,
      "csllRate": 0.09,
      "presumedMargin": 0.30,
      "addicionalThreshold": 240000,
      "addicionalRate": 0.10,
      "deductible": true,
      "estimatedCreditRate": 0.5
    }
  },
  "importTaxes": {
    "ii": {
      "name": "II - Imposto de Importação",
      "description": "進口關稅",
      "airFryerRate": 0.20,
      "typicalRange": [0.10, 0.20]
    },
    "ipi": {
      "name": "IPI - Imposto sobre Produtos Industrializados",
      "description": "工業產品稅",
      "appliesTo": "eletrodomésticos",
      "typicalRate": 0.10
    },
    "pisImportacao": {
      "name": "PIS - Importação",
      "description": "進口社會團結稅",
      "rate": 0.021
    },
    "cofinsImportacao": {
      "name": "COFINS - Importação",
      "description": "進口社會融資稅",
      "rate": 0.0965
    },
    "icms": {
      "name": "ICMS - Imposto sobre Circulação",
      "description": "州流通稅",
      "sp": 0.18,
      "typicalRange": [0.12, 0.20]
    }
  },
  "reform2026": {
    "enabled": true,
    "description": "2026 稅改過渡期模擬",
    "cbsRate": 0.009,
    "ibsRate": 0.001,
    "creditDeduction": 0.01
  },
  "riskAssessment": {
    "lowReporting": {
      "riskLevel": "high",
      "description": "低報進口價值",
      "consequences": [
        "海關查驗機率提高",
        "補繳稅款 + 罰款 (75%-225%)",
        "貨物扣押風險",
        "可能面臨刑事起訴"
      ],
      "penaltyRates": {
        "minor": 0.75,
        "medium": 1.50,
        "severe": 2.25
      }
    },
    "fullReporting": {
      "riskLevel": "low",
      "description": "全額申報",
      "benefits": [
        "合規通關",
        "無罰款風險",
        "可建立良好信用記錄",
        "順利進入電商平台"
      ]
    }
  },
  "comparisonFactors": {
    "taxDifference": {
      "fullReporting": "依法納稅，無額外風險",
      "lowReporting": "節省稅款但面臨查驗風險"
    },
    "businessImpact": {
      "fullReporting": "有利長期發展，可入駐主流電商",
      "lowReporting": "可能影響 RADAR 評級"
    }
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/tax-rates.json
git commit -m "feat(tax-calculator): add tax rates configuration JSON"
```

---

### Task 2: 添加相關術語至詞典

**Files:**
- Modify: `br-compass/src/data/glossary.ts`
- Test: `tests/glossary-terms.test.ts`

- [ ] **Step 1: 添加新術語**

在 `glossaryData` 陣列中添加以下術語：

```typescript
{
  term: 'DAS',
  category: 'tax',
  pronunciation: '迪-阿-埃塞 (dee-ah-eh-see)',
  fullPortuguese: 'Documento de Arrecadação do Simples Nacional',
  chineseName: '統一簡易繳款單',
  analogy: '🇹🇼 類似台灣的綜合所得稅繳款單，但合併了所有稅種',
  oneLiner: 'Simples Nacional 企業的單一繳款文件，合併了聯邦、州、市各級稅收。',
  fullExplanation: 'DAS 是巴西稅局為 Simples Nacional 企業設計的單一繳款文件。它將 IRPJ、CSLL、PIS、COFINS、ICMS、ISS 等所有稅種合併成一張繳款單，大大簡化了小微企業的稅務行政負擔。企業每月根據營業額查詢 DAS 金額並按時繳納即可。',
  practicalTips: [
    '每月 20 日前繳納',
    '可透過 SIMEI 系統自動計算',
    '逾期繳納會產生利息和罰款',
    '連續三次欠繳可能被取消 Simples 資格'
  ],
  commonMistakes: [
    '以為 DAS 包含了所有稅（實際上 ICMS/ISS 需另外計算）',
    '忘記繳納導致產生滯納金',
    '混淆 DAS 和 GPS（社保繳款單）'
  ],
  relatedTerms: ['Simples Nacional', 'SIMEI', 'IRPJ', 'CSLL'],
},
{
  term: 'Valor Aduaneiro',
  category: 'tax',
  pronunciation: '瓦洛-阿杜阿奈-鲁 (vah-loh-ah-doo-ah-neh-ee-roo)',
  fullPortuguese: 'Valor Aduaneiro (VA)',
  chineseName: '海關完稅價格',
  analogy: '🇹🇼 類似台灣的 CIF 價格，是計算進口稅的基準',
  oneLiner: '海關用來計算進口稅的價格基準，通常等於商品價值 + 保險費 + 運費。',
  fullExplanation: 'Valor Aduaneiro (VA) 是海關用於計算進口關稅的價格基準。根據 WTO 估價協定，原則上 VA = 交易價格（發票金額）。但海關有權懷疑發票價格的真實性，特別是當發票價格明顯低於市場價格時。此時海關可採用「參考價格」估價，導致進口商需要補繳稅款。',
  practicalTips: [
    '申報時確保發票價格真實反映交易價格',
    '保存完整採購憑證以備查驗',
    '低報可能導致海關重新估價',
    '合理避稅應通過 HS CODE 分類，而非低報價格'
  ],
  commonMistakes: [
    '以為低報發票可以節省稅款（實際風險極高）',
    '忽略保險費和運費計入 VA',
    '不了解海關參考價格機制'
  ],
  relatedTerms: ['II', 'IPI', 'PIS', 'COFINS', 'ICMS', 'SISCOMEX'],
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/glossary.ts
git commit -m "feat(glossary): add DAS and Valor Aduaneiro terms"
```

---

## Chunk 2: 章節 MD 文件創建

**Files:**
- Create: `br-compass/src/content/handbook/12-tax-calculator.md`

---

### Task 3: 創建稅務計算器章節 MD 文件

**Files:**
- Create: `br-compass/src/content/handbook/12-tax-calculator.md`
- Test: `tests/chapter-tax-calculator.test.ts`

- [ ] **Step 1: 創建章節文件**

```markdown
---
title: "進口稅務計算器：全額申報 vs 低報風險"
description: "互動式稅務模擬：了解巴西進口稅務結構，比較全額申報與低報的稅務差異與風險。"
phase: "harvest"
phaseLabel: "第四階段：財務合規"
order: 13
icon: "🧮"
tags: ["稅務", "計算器", "進口", "全額申報", "低報", "風險評估"]
featured: true
---

> **因果連接**：如果你不了解巴西進口稅務結構——你將面臨被海關查驗、補稅罰款的風險。罰款最高可達應繳稅額的 225%，還可能影響你的 RADAR 評級，導致未來通關更加困難。

## 一、稅務制度選擇

<div class="tax-calculator-container" id="tax-calc-container">
<div class="regime-selection" id="regime-selection">
<div class="step-label">Step 1 ／ 選擇稅務套裝 (Regime & PIS/COFINS)</div>
<div class="regime-cards"><div class="regime-card" data-regime="simples" style="border-color:#f0a500;background:#fff8ec;"><div class="regime-name" style="color:#e07b00;">Simples Nacional</div><div class="regime-desc">適合小微企業<br>PIS/COFINS 已含於單一稅率</div><button class="regime-btn" data-action="choose-regime" data-regime="simples" style="background:#e07b00;">選擇</button></div><div class="regime-card" data-regime="presumido" style="border-color:#1a6fbd;background:#f0f6ff;"><div class="regime-name" style="color:#1a6fbd;">Lucro Presumido (累積制)</div><div class="regime-desc">法律強制綁定：<br>PIS 0.65% / COFINS 3.0%</div><button class="regime-btn" data-action="choose-regime" data-regime="presumido" style="background:#1a6fbd;">選擇</button></div><div class="regime-card" data-regime="real-non-cumulative" style="border-color:#1a8f4c;background:#f0fff5;"><div class="regime-name" style="color:#1a8f4c;">Lucro Real (非累積制)</div><div class="regime-desc">一般大型企業標準：<br>PIS 1.65% / COFINS 7.6% (可抵扣)</div><button class="regime-btn" data-action="choose-regime" data-regime="real-non-cumulative" style="background:#1a8f4c;">選擇 一般行業</button></div><div class="regime-card" data-regime="real-cumulative" style="border-color:#6f42c1;background:#f5f0ff;"><div class="regime-name" style="color:#6f42c1;">Lucro Real (累積制)</div><div class="regime-desc">法律強制特定行業：<br>金融、電信、教育等 (3.65% 無抵扣)</div><button class="regime-btn" data-action="choose-regime" data-regime="real-cumulative" style="background:#6f42c1;">選擇 特定行業</button></div></div>
</div>
<div class="adicional-selection" id="adicional-selection" style="display:none;">
<div class="step-label">Step 2 ／ 第二層：Adicional do IRPJ / CSLL</div>
<p class="adicional-desc">當年度 <strong>Lucro Real / Presumido</strong> 超過 <strong>R$20.000/mês</strong>（年化 R$240.000）時，IRPJ 須加收 <strong>10%</strong> 附加稅（Adicional）。</p>
<button class="adicional-btn yes" data-action="choose-adicional" data-value="true" style="background:#b5490f;">✅ 適用 Adicional (lucro > R$240k/ano)</button>
<button class="adicional-btn no" data-action="choose-adicional" data-value="false" style="background:#1a6fbd;">❌ 不適用 Adicional</button>
</div>
<div class="tax-result" id="tax-result"></div>
</div>

## 二、互動式模擬試算

<div class="simulator-container" id="simulator-container">
<div class="reform-toggle">
<div class="toggle-label"><span style="font-size:1.05rem;">🎯 啟動 2026 稅改過渡期模擬 (Reforma Tributária - 1%)</span><br><span style="font-size:0.85rem;font-weight:400;">PIS/COFINS 將自動全額抵扣 1% 並獨立為 <strong>CBS (0.9%)</strong> 及 <strong>IBS (0.1%)</strong></span></div>
<label class="switch"><input type="checkbox" id="toggle-2026" data-action="toggle-reform"><span class="slider"></span></label>
</div>
<div class="calc-inputs">
<div class="calc-row"><label for="receita-input">📅 Receita Bruta Anual (R$/ano):</label><input id="receita-input" type="text" value="100.000" data-action="format-input"><label for="va-input">🛃 Valor Aduaneiro (VA / CIF):</label><input id="va-input" type="text" value="50.000" data-action="format-input"><span style="color:#1a6fbd;font-weight:600;">← 輸入預期年營業額與進口貨值 (自動千分位)</span></div>
</div>
<div class="sim-table-wrapper">
<table class="sim-table" id="sim-table"><tr><th>制度</th><th>稅金組成與計算公式</th><th class="text-right">年度預估合計</th></tr><tr id="row-simples"><td><strong style="color:#e07b00;">Simples Nacional</strong></td><td id="sim-simples-detail" class="detail-cell">DAS = RB × 6%</td><td id="sim-simples-total" class="highlight num-col">–</td></tr><tr id="row-presumido"><td><strong style="color:#1a6fbd;">Lucro Presumido</strong><br><small style="font-weight:400;color:#888">始終為累積制 (Lei 9.718/98)</small></td><td id="sim-presumido-detail" class="detail-cell">PIS = RB × 0.65%<br>COFINS = RB × 3%<br>IRPJ/CSLL (預估)</td><td id="sim-presumido-total" class="highlight num-col">–</td></tr><tr id="row-real"><td><strong style="color:#1a8f4c;">Lucro Real</strong><br><small style="font-weight:400;color:#888">依套裝切換 (10.637/02, 10.833/03)</small></td><td id="sim-real-detail" class="detail-cell">依所選模式計算<br>IRPJ/CSLL (實際按30%毛利估算)</td><td id="sim-real-total" class="highlight num-col">–</td></tr></table>
</div>
<div class="import-formulas">
<div class="formulas-header">🛃 Tributos na Importação — Fórmulas e Alíquotas (常駐參考)</div>
<table class="formulas-table"><tr><th>稅種</th><th>計算公式</th><th>參考稅率 (Air Fryer / NCM típico)</th></tr><tr><td><strong>II</strong><br><small>Imposto de Importação</small></td><td>Valor Aduaneiro (VA) × Alíq. II</td><td>10% – 20%（依 NCM）</td></tr><tr><td><strong>IPI</strong><br><small>Imp. s/ Prod. Industrializado</small></td><td>(VA + II) × Alíq. IPI</td><td>約 10%（eletrodomésticos）</td></tr><tr><td><strong>PIS<br>Importação</strong></td><td>VA × 2.10%</td><td>2.10%（geral）</td></tr><tr><td><strong>COFINS<br>Importação</strong></td><td>VA × 9.65%</td><td>9.65%（geral）</td></tr><tr><td><strong>ICMS</strong><br><small>Estadual (SP ref.)</small></td><td>(VA + II + IPI + PIS + COFINS) ÷ (1 − Alíq.) × Alíq.<br><small style="color:#aaa;">Base de cálculo "por dentro" (incluído no prezzo)</small></td><td>18% (SP) / 12%–20%（outros estados）</td></tr></table>
</div>
<p class="formulas-note">* Lucro Real: 稅率 30%、créditos PIS/COFINS 50% 估 | Adicional IRPJ (10% sobre lucro/base > R$ 240k/ano) 計算自動。</p>
</div>

## 三、全額 vs 低報：風險比較

<div class="comparison-container" id="comparison-container">
<div class="comparison-header"><h3>📊 全額申報 vs 低報 核心差異</h3></div>
<div class="comparison-grid"><div class="comparison-card full-reporting" style="border-left:4px solid #1a8f4c;"><h4 style="color:#1a8f4c;">✅ 全額申報</h4><ul><li>合規通關，無罰款風險</li><li>可建立良好海關信用記錄</li><li>順利入駐電商平台（Mercado Livre、Shopee）</li><li>RADAR 評級不受影響</li><li>長期業務發展有利</li></ul><div class="risk-badge low">風險：低</div></div><div class="comparison-card low-reporting" style="border-left:4px solid #cf222e;"><h4 style="color:#cf222e;">⚠️ 低報風險</h4><ul><li>海關查驗機率大幅提高</li><li>補繳稅款 + 罰款 (75%-225%)</li><li>貨物可能被扣押</li><li>影響 RADAR 評級</li><li>嚴重者面臨刑事起訴</li></ul><div class="risk-badge high">風險：高</div></div></div>
<div class="penalty-table"><h4>📋 低報罰款級別</h4><table><tr><th>情節</th><th>罰款比例</th><th>說明</th></tr><tr><td>輕微</td><td>75%</td><td>低報金額較小，無故意瞞報意圖</td></tr><tr><td>中等</td><td>150%</td><td>有明顯低報跡象但非惡意</td></tr><tr><td>嚴重</td><td>225%</td><td>故意瞞報、偽造發票等惡意行為</td></tr></table></div>
</div>

## 四、三種制度優缺點比較

<div class="regime-comparison"><table><tr><th>制度</th><th>優點</th><th>缺點</th></tr><tr><td><strong style="color:#e07b00;">Simples Nacional</strong></td><td>簡單、稅務合併在一張單據 (DAS)、行政負擔低</td><td>僅限小微企業、部分行業不可用、可能稅負不最優<br><span style="color:#cf222e;font-size:.82rem;">⚠️ 年收入超過 <strong>R$4.800.000</strong> 即強制退出</span></td></tr><tr><td><strong style="color:#1a6fbd;">Lucro Presumido</strong></td><td>計算簡單、預測性強、適合毛利率較高的企業</td><td>無法精確反映真實利潤、在毛利率低時稅負偏高<br><span style="color:#cf222e;font-size:.82rem;">⚠️ 年收入上限 <strong>R$78.000.000</strong>，超過須改用 Lucro Real</span></td></tr><tr><td><strong style="color:#1a8f4c;">Lucro Real</strong></td><td>可抵扣進項、能利用稅務補償、在毛利率低時更有利</td><td>計算複雜、行政成本高、需要嚴格會計紀錄<br><span style="color:#1a8f4c;font-size:.82rem;">✅ 年收入 &gt; R$78M 之企業唯一可用選項</span></td></tr></table></div>

> **⚠️ 免責聲明**：此模擬試算僅供學習參考，如有業務需求請諮詢專業稅務會計師。

## [關鍵決策] 稅務規劃檢查清單

- [ ] 我了解四種稅務制度的差異及適用場景？
- [ ] 我的年收入適合哪種稅務制度？（Simples < R$4.8M、Presumido < R$78M）
- [ ] 我的進口商品 NCM 對應的 II 稅率是多少？
- [ ] 我選擇的申報方式能通過海關查驗？
- [ ] 我的企業是否有專業會計師協助稅務申報？

完成稅務規劃後，繼續閱讀下一章 <a href="/handbook/12-profit-remittance">利潤匯回</a>，了解如何合規將巴西利潤匯回母公司！
```

- [ ] **Step 2: Commit**

```bash
git add src/content/handbook/12-tax-calculator.md
git commit -m "feat(chapter): add tax calculator chapter 12-tax-calculator"
```

---

## Chunk 3: 互動 JS 邏輯實現

**Files:**
- Modify: `br-compass/src/pages/handbook/[...slug].astro`
- Create: `br-compass/src/styles/tax-calculator.css`
- Test: `tests/tax-calculator-interaction.test.ts`

---

### Task 4: 添加稅務計算器 CSS 樣式

**Files:**
- Create: `br-compass/src/styles/tax-calculator.css`
- Modify: `br-compass/src/styles/global.css`

- [ ] **Step 1: 創建專用 CSS**

```css
/* ── Tax Calculator Styles ──────────────────────────────── */

.tax-calculator-container {
  margin: var(--space-4) 0;
}

.step-label {
  font-weight: 600;
  font-size: .9rem;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--color-text-muted);
  margin-bottom: var(--space-2);
}

.regime-cards {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.regime-card {
  flex: 1;
  min-width: 200px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: var(--space-2);
  background: var(--color-bg-800);
}

.regime-name {
  font-weight: 700;
  font-size: .88rem;
}

.regime-desc {
  font-size: .8rem;
  color: var(--color-text-muted);
  margin-top: 4px;
}

.regime-btn {
  width: 100%;
  margin-top: var(--space-1);
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: .92rem;
  font-weight: 600;
  color: #fff;
  transition: opacity var(--transition), transform var(--transition);
}

.regime-btn:hover {
  opacity: .85;
  transform: translateY(-1px);
}

.adicional-selection {
  margin: var(--space-3) 0;
  padding: var(--space-3);
  background: var(--color-bg-800);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
}

.adicional-desc {
  margin: 0 0 var(--space-2);
  font-size: .92rem;
}

.adicional-btn {
  margin: 5px 6px 5px 0;
  padding: 9px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: .92rem;
  font-weight: 600;
  color: #fff;
  transition: opacity var(--transition), transform var(--transition);
}

.adicional-btn:hover {
  opacity: .85;
  transform: translateY(-1px);
}

.tax-result {
  margin-top: var(--space-3);
  padding: var(--space-3);
  background: var(--color-bg-800);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  min-height: 60px;
}

.reform-toggle {
  display: flex;
  align-items: center;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-card);
  margin-bottom: var(--space-3);
  color: #856404;
  font-weight: 600;
  justify-content: space-between;
}

.simulator-container {
  background: var(--color-bg-800);
  border-radius: var(--radius-card);
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  margin: var(--space-3) 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  flex-shrink: 0;
  margin-left: 14px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 26px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #28a745;
}

input:checked + .slider:before {
  transform: translateX(24px);
}

.calc-row {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
  margin-bottom: var(--space-2);
}

.calc-row label {
  font-weight: 600;
  white-space: nowrap;
}

.calc-row input {
  padding: 7px 10px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: .95rem;
  width: 160px;
  background: var(--color-bg-900);
  color: var(--color-text);
}

.sim-table {
  border-collapse: collapse;
  width: 100%;
  font-size: .9rem;
  margin-top: var(--space-2);
}

.sim-table th,
.sim-table td {
  border: 1px solid var(--color-border);
  padding: 9px 12px;
  text-align: left;
}

.sim-table th {
  background: var(--color-bg-700);
  font-weight: 600;
}

.sim-table tr:hover td {
  background: var(--color-bg-700);
}

.num-col {
  text-align: right;
  font-family: 'Courier New', monospace;
  font-weight: 600;
}

.highlight {
  font-weight: 700;
  color: var(--color-error);
}

.import-formulas {
  margin-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-2);
}

.formulas-header {
  font-weight: 700;
  font-size: .92rem;
  margin-bottom: var(--space-2);
}

.formulas-table {
  border-collapse: collapse;
  width: 100%;
  font-size: .84rem;
}

.formulas-table th,
.formulas-table td {
  border: 1px solid var(--color-border);
  padding: 8px 10px;
  text-align: left;
}

.formulas-table th {
  background: var(--color-bg-700);
  font-weight: 600;
}

.formulas-note {
  font-size: .85rem;
  color: var(--color-text-muted);
  margin-top: var(--space-2);
}

.comparison-container {
  margin: var(--space-3) 0;
}

.comparison-header {
  margin-bottom: var(--space-2);
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

@media (max-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr;
  }
}

.comparison-card {
  background: var(--color-bg-800);
  border-radius: var(--radius-card);
  padding: var(--space-2);
}

.comparison-card ul {
  margin: var(--space-1) 0;
  padding-left: var(--space-3);
  font-size: .9rem;
}

.comparison-card li {
  margin-bottom: 4px;
}

.risk-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: .85rem;
  font-weight: 600;
  margin-top: var(--space-1);
}

.risk-badge.low {
  background: rgba(26, 143, 76, 0.2);
  color: #1a8f4c;
}

.risk-badge.high {
  background: rgba(207, 34, 46, 0.2);
  color: #cf222e;
}

.penalty-table {
  margin-top: var(--space-3);
}

.penalty-table table {
  border-collapse: collapse;
  width: 100%;
  font-size: .9rem;
}

.penalty-table th,
.penalty-table td {
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  text-align: left;
}

.penalty-table th {
  background: var(--color-bg-700);
  font-weight: 600;
}

.regime-comparison {
  margin: var(--space-3) 0;
  overflow-x: auto;
}

.regime-comparison table {
  border-collapse: collapse;
  width: 100%;
  font-size: .9rem;
}

.regime-comparison th,
.regime-comparison td {
  border: 1px solid var(--color-border);
  padding: 12px;
  text-align: left;
}

.regime-comparison th {
  background: var(--color-bg-700);
  font-weight: 600;
}

.info-box {
  background: #ddf4ff;
  border: 1px solid #54aeff;
  border-radius: 6px;
  padding: 10px 14px;
  margin-top: 10px;
  font-size: .88rem;
  color: #0550ae;
}
```

- [ ] **Step 2: 在 global.css 中導入**

在 `global.css` 末尾添加：

```css
@import './tax-calculator.css';
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/tax-calculator.css src/styles/global.css
git commit -m "feat(styles): add tax calculator CSS"
```

---

### Task 5: 在 [...slug].astro 中添加互動邏輯

**Files:**
- Modify: `br-compass/src/pages/handbook/[...slug].astro`

- [ ] **Step 1: 添加稅務計算器 JS 邏輯**

在 `[...slug].astro` 的 `<script>` 塊中添加：

```typescript
// ── Tax Calculator Logic ──────────────────────────────────
(function initTaxCalculator() {
  const container = document.getElementById('tax-calc-container');
  const simulatorContainer = document.getElementById('simulator-container');
  if (!container && !simulatorContainer) return;

  // State
  let regime = '';
  let pisCofinsType = '';
  let currentAplicavel = false;
  let is2026Reform = false;

  // Constants
  const LIMITS = {
    simples: 4800000,
    presumido: 78000000
  };

  // ── Formatting Helpers ────────────────────────────────
  function fmt(n) {
    return 'R$ ' + n.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function parseBR(val) {
    if (!val) return 0;
    const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
    return parseFloat(cleaned) || 0;
  }

  function handleInputFormatting(el) {
    let val = el.value.replace(/\D/g, '');
    if (val === '') {
      el.value = '';
      return;
    }
    el.value = parseInt(val, 10).toLocaleString('pt-BR');
  }

  // ── Import Tax Calculation ────────────────────────────
  function calcImportTaxes(va) {
    const alii = 0.20;
    const alipi = 0.10;
    const alicms = 0.18;

    const ii = va * alii;
    const ipi = (va + ii) * alipi;
    const pis_imp = va * 0.021;
    const cofins_imp = va * 0.0965;
    const icms_bc = (va + ii + ipi + pis_imp + cofins_imp) / (1 - alicms);
    const icms = icms_bc * alicms;
    const total_imp = ii + ipi + pis_imp + cofins_imp + icms;

    return { ii, ipi, pis_imp, cofins_imp, icms, total_imp };
  }

  function renderTaxItem(label, value) {
    return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
      <span style="color:#666;">${label}:</span>
      <span class="num-col">${fmt(value)}</span>
    </div>`;
  }

  function renderImportTaxes(va) {
    const { ii, ipi, icms, pis_imp, cofins_imp, total_imp } = calcImportTaxes(va);

    let pisCofHtml = renderTaxItem('PIS/COF Imp.', pis_imp + cofins_imp);
    if (is2026Reform) {
      pisCofHtml = renderTaxItem('PIS/COF Imp. (減 1%)', (pis_imp + cofins_imp) - (va * 0.01)) +
        renderTaxItem('CBS (0.9%)', va * 0.009) +
        renderTaxItem('IBS (0.1%)', va * 0.001);
    }

    return `<div style="margin-top:12px;padding:10px 14px;background:#fdfdfe;border:1px solid #eee;border-radius:6px;max-width:400px;">
      <div style="font-weight:700;font-size:.9rem;color:#444;margin-bottom:6px;border-bottom:1px solid #eee;">🛃進口環節 (Importação)</div>
      ${renderTaxItem('II (20%)', ii)}
      ${renderTaxItem('IPI (10%)', ipi)}
      ${renderTaxItem('ICMS (18%)', icms)}
      ${pisCofHtml}
      <div style="margin-top:6px;border-top:1px dashed #ccc;padding-top:6px;color:#1a6fbd;font-weight:700;">
        ${renderTaxItem('進口稅合計', total_imp)}
      </div>
    </div>`;
  }

  // ── Regime Selection ──────────────────────────────────
  function chooseRegime(choice) {
    regime = choice;

    const adicionalSel = document.getElementById('adicional-selection');
    if (!adicionalSel) return;

    currentAplicavel = false;

    if (choice === 'simples') {
      adicionalSel.style.display = 'none';
    } else {
      adicionalSel.style.display = 'block';
    }

    renderResult();
    updateSimTable();
  }

  function chooseAdicional(aplicavel) {
    currentAplicavel = aplicavel;
    renderResult();
  }

  function toggleReform2026() {
    is2026Reform = document.getElementById('toggle-2026').checked;
    renderResult();
    updateSimTable();
  }

  // ── Result Rendering ─────────────────────────────────
  function renderResult() {
    const resultDiv = document.getElementById('tax-result');
    const vaInput = document.getElementById('va-input');
    if (!resultDiv || !vaInput) return;

    const va = parseBR(vaInput.value);
    let output = '';

    if (!regime) return;

    if (regime === 'simples') {
      const receitaInput = document.getElementById('receita-input');
      const rb = receitaInput ? parseBR(receitaInput.value) : 0;

      output = `<h3>✅ 您選擇了：<span style="color:#e07b00;">Simples Nacional</span></h3>
        <div class="info-box" style="margin-bottom:12px;max-width:400px;">ℹ️ Simples Nacional 不適用 Adicional IRPJ，IRPJ/CSLL 已含於 DAS。</div>
        <div style="padding:10px 14px;background:#fdfdfe;border:1px solid #eee;border-radius:6px;max-width:400px;">
          <div style="font-weight:700;font-size:.9rem;color:#444;margin-bottom:6px;border-bottom:1px solid #eee;">🇧🇷國內環節 (Brasil)</div>
          ${renderTaxItem('DAS (預估 6%)', rb * 0.06)}
        </div>`;
    } else {
      const receitaInput = document.getElementById('receita-input');
      const rb = receitaInput ? parseBR(receitaInput.value) : 0;
      const pisType = (regime === 'presumido' || regime === 'real-cumulative') ? '累積' : '非累積';
      const regimeColor = regime === 'presumido' ? '#1a6fbd' : '#1a8f4c';

      output = `<h3>✅ 您選擇了：<span style="color:${regimeColor}">${regime === 'presumido' ? 'Lucro Presumido' : 'Lucro Real'}</span>
        → PIS/COFINS ${pisType}
        → Adicional IRPJ: <em>${currentAplicavel ? '適用 ✅' : '不適用 ❌'}</em></h3>`;

      let domHtml = `<div style="padding:10px 14px;background:#fdfdfe;border:1px solid #eee;border-radius:6px;max-width:400px;">
        <div style="font-weight:700;font-size:.9rem;color:#444;margin-bottom:6px;border-bottom:1px solid #eee;">🇧🇷國內環節 (Brasil)</div>`;

      if (pisType === '累積') {
        let pVal = rb * 0.0365;
        if (is2026Reform) {
          domHtml += renderTaxItem('PIS/COF (3.65% 減 1%)', pVal - rb * 0.01) +
            renderTaxItem('CBS (0.9%)', rb * 0.009) +
            renderTaxItem('IBS (0.1%)', rb * 0.001);
        } else {
          domHtml += renderTaxItem('PIS/COF (累積 3.65%)', pVal);
        }
      } else {
        let pVal = rb * 0.04625;
        if (is2026Reform) {
          domHtml += renderTaxItem('PIS/COF (非累積 減 1%)', pVal - rb * 0.01) +
            renderTaxItem('CBS (0.9%)', rb * 0.009) +
            renderTaxItem('IBS (0.1%)', rb * 0.001);
        } else {
          domHtml += renderTaxItem('PIS/COF (非累積預估 4.625%)', pVal);
        }
      }

      if (regime === 'presumido') {
        const base = rb * 0.08;
        const irpj = base * 0.15 + (currentAplicavel ? Math.max(0, base - 240000) * 0.10 : 0);
        domHtml += renderTaxItem('IRPJ (15% + Add)', irpj);
        domHtml += renderTaxItem('CSLL (9%)', rb * 0.12 * 0.09);
      } else {
        const lucro = rb * 0.30;
        const irpj = lucro * 0.15 + (currentAplicavel ? Math.max(0, lucro - 240000) * 0.10 : 0);
        domHtml += renderTaxItem('IRPJ (15% + Add)', irpj);
        domHtml += renderTaxItem('CSLL (9%)', lucro * 0.09);
      }

      domHtml += '</div>';
      output += domHtml;
    }

    output += renderImportTaxes(va);
    resultDiv.innerHTML = output;
  }

  // ── Simulator Table Update ─────────────────────────────
  function updateSimTable() {
    const receitaInput = document.getElementById('receita-input');
    const vaInput = document.getElementById('va-input');
    if (!receitaInput || !vaInput) return;

    const rb = parseBR(receitaInput.value);
    const va = parseBR(vaInput.value);
    const { total_imp } = calcImportTaxes(va);

    // Highlight selected row
    ['row-presumido', 'row-real'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.outline = '';
        el.style.background = '';
      }
    });

    if (regime === 'lucro-presumido') {
      const el = document.getElementById('row-presumido');
      if (el) { el.style.outline = '2px solid #1a6fbd'; el.style.background = '#f0f6ff'; }
    } else if (regime === 'lucro-real-non-cumulative' || regime === 'lucro-real-cumulative') {
      const el = document.getElementById('row-real');
      if (el) { el.style.outline = '2px solid #1a8f4c'; el.style.background = '#f0fff5'; }
    }

    // 1. Simples Nacional
    const simSimplesDetail = document.getElementById('sim-simples-detail');
    const simSimplesTotal = document.getElementById('sim-simples-total');
    if (simSimplesDetail && simSimplesTotal) {
      if (rb > LIMITS.simples) {
        simSimplesDetail.innerHTML = `<span style="color:#cf222e;font-weight:700;">⛔ 超額，須退出 Simples</span>`;
        simSimplesTotal.innerHTML = `<span style="color:#cf222e;font-weight:700;">N/A</span>`;
      } else {
        const das = rb * 0.06;
        simSimplesDetail.innerHTML = `${renderTaxItem('DAS (預估 6%)', das)}`;
        simSimplesTotal.textContent = fmt(das + total_imp);
      }
    }

    // 2. Lucro Presumido
    const simPresumidoDetail = document.getElementById('sim-presumido-detail');
    const simPresumidoTotal = document.getElementById('sim-presumido-total');
    if (simPresumidoDetail && simPresumidoTotal) {
      if (rb > LIMITS.presumido) {
        simPresumidoDetail.innerHTML = `<span style="color:#cf222e;font-weight:700;">⛔ 超額，強制 Lucro Real</span>`;
        simPresumidoTotal.innerHTML = `<span style="color:#cf222e;font-weight:700;">N/A</span>`;
      } else {
        const pis_p = rb * 0.0065;
        const cofins_p = rb * 0.03;
        const base_p = rb * 0.08;
        const irpj_p = base_p * 0.15 + (Math.max(0, base_p - 240000) * 0.10);
        const csll_p = rb * 0.12 * 0.09;
        const total_domestico = pis_p + cofins_p + irpj_p + csll_p;

        simPresumidoDetail.innerHTML = `${renderTaxItem('PIS/COF (3.65%)', pis_p + cofins_p)}${renderTaxItem('IRPJ (15% + Add)', irpj_p)}${renderTaxItem('CSLL (9%)', csll_p)}`;
        simPresumidoTotal.textContent = fmt(total_domestico + total_imp);
      }
    }

    // 3. Lucro Real
    const simRealDetail = document.getElementById('sim-real-detail');
    const simRealTotal = document.getElementById('sim-real-total');
    if (simRealDetail && simRealTotal) {
      let pis_r, cofins_r, pLabel;
      if (regime === 'lucro-real-cumulative') {
        pis_r = rb * 0.0065; cofins_r = rb * 0.03; pLabel = '累積 3.65%';
      } else {
        pis_r = rb * 0.0165 * 0.5; cofins_r = rb * 0.076 * 0.5; pLabel = '非累積 (抵扣後)';
      }
      const lucro = rb * 0.30;
      const irpj_r = lucro * 0.15 + (Math.max(0, lucro - 240000) * 0.10);
      const csll_r = lucro * 0.09;
      const total_domestico_r = pis_r + cofins_r + irpj_r + csll_r;

      simRealDetail.innerHTML = `${renderTaxItem(`PIS/COF (${pLabel})`, pis_r + cofins_r)}${renderTaxItem('IRPJ (15% + Add)', irpj_r)}${renderTaxItem('CSLL (9%)', csll_r)}`;
      simRealTotal.textContent = fmt(total_domestico_r + total_imp);
    }
  }

  // ── Event Listeners ───────────────────────────────────
  // Regime selection buttons
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="choose-regime"]');
    if (btn) {
      const r = btn.getAttribute('data-regime');
      if (r === 'simples') chooseRegime('simples');
      else if (r === 'presumido') chooseRegime('presumido');
      else if (r === 'real-non-cumulative') chooseRegime('real-non-cumulative');
      else if (r === 'real-cumulative') chooseRegime('real-cumulative');
    }

    const adicionalBtn = e.target.closest('[data-action="choose-adicional"]');
    if (adicionalBtn) {
      const val = adicionalBtn.getAttribute('data-value');
      chooseAdicional(val === 'true');
    }
  });

  // Simulator inputs
  if (simulatorContainer) {
    simulatorContainer.addEventListener('input', (e) => {
      const input = e.target;
      if (input.id === 'receita-input' || input.id === 'va-input') {
        handleInputFormatting(input);
        renderResult();
        updateSimTable();
      }
    });

    simulatorContainer.addEventListener('change', (e) => {
      if (e.target.id === 'toggle-2026') {
        toggleReform2026();
      }
    });
  }

  // Initial render
  updateSimTable();
})();
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/handbook/\[...slug\].astro
git commit -m "feat(interactive): add tax calculator JS logic"
```

---

## Chunk 4: 測試與驗證

**Files:**
- Create: `br-compass/tests/tax-calculator.test.ts`
- Run: `npm test`, `npm run build`

---

### Task 6: 創建測試文件

**Files:**
- Create: `br-compass/tests/tax-calculator.test.ts`

- [ ] **Step 1: 創建測試**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseBR, formatBR } from '../src/lib/tax-calculator';

describe('Tax Calculator - parseBR', () => {
  it('should parse Brazilian number format', () => {
    expect(parseBR('1.000.000')).toBe(1000000);
    expect(parseBR('50.000')).toBe(50000);
    expect(parseBR('100,50')).toBe(100.5);
    expect(parseBR('1.234.567,89')).toBe(1234567.89);
  });

  it('should handle empty or invalid input', () => {
    expect(parseBR('')).toBe(0);
    expect(parseBR('abc')).toBe(0);
    expect(parseBR(null as any)).toBe(0);
  });
});

describe('Tax Calculator - formatBR', () => {
  it('should format numbers with Brazilian separators', () => {
    expect(formatBR(1000000)).toBe('R$ 1.000.000');
    expect(formatBR(50000)).toBe('R$ 50.000');
    expect(formatBR(100.5)).toBe('R$ 100,5');
  });
});

describe('Tax Calculator - Import Tax Calculation', () => {
  it('should calculate II correctly for 20% rate', () => {
    const va = 50000;
    const expectedII = 10000; // 50000 * 0.20
    expect(va * 0.20).toBe(expectedII);
  });

  it('should calculate IPI correctly', () => {
    const va = 50000;
    const ii = va * 0.20; // 10000
    const expectedIPI = (va + ii) * 0.10; // 6000
    expect(expectedIPI).toBe(6000);
  });

  it('should calculate ICMS with "por dentro" method', () => {
    const va = 50000;
    const ii = va * 0.20;
    const ipi = (va + ii) * 0.10;
    const pis_imp = va * 0.021;
    const cofins_imp = va * 0.0965;
    const alicms = 0.18;

    const icms_bc = (va + ii + ipi + pis_imp + cofins_imp) / (1 - alicms);
    const icms = icms_bc * alicms;

    expect(icms).toBeGreaterThan(0);
    expect(icms_bc).toBeGreaterThan(va + ii + ipi + pis_imp + cofins_imp);
  });
});

describe('Tax Calculator - Regime Limits', () => {
  const LIMITS = {
    simples: 4800000,
    presumido: 78000000
  };

  it('should enforce Simples Nacional limit', () => {
    expect(1000000 < LIMITS.simples).toBe(true);
    expect(5000000 > LIMITS.simples).toBe(true);
  });

  it('should enforce Lucro Presumido limit', () => {
    expect(50000000 < LIMITS.presumido).toBe(true);
    expect(100000000 > LIMITS.presumido).toBe(true);
  });
});

describe('Tax Calculator - Adicional IRPJ', () => {
  it('should calculate Adicional when base exceeds threshold', () => {
    const base = 300000; // Above 240000
    const adicional = base > 240000 ? (base - 240000) * 0.10 : 0;
    expect(adicional).toBe(6000);
  });

  it('should not calculate Adicional when base is below threshold', () => {
    const base = 200000; // Below 240000
    const adicional = base > 240000 ? (base - 240000) * 0.10 : 0;
    expect(adicional).toBe(0);
  });
});

describe('Tax Calculator - Chapter Content', () => {
  it('should have tax-calculator.md file', () => {
    const fs = require('fs');
    const path = require('path');
    const chapterPath = path.join(process.cwd(), 'src/content/handbook/12-tax-calculator.md');
    expect(fs.existsSync(chapterPath)).toBe(true);
  });

  it('should have correct frontmatter', () => {
    const fs = require('fs');
    const path = require('path');
    const chapterPath = path.join(process.cwd(), 'src/content/handbook/12-tax-calculator.md');
    const content = fs.readFileSync(chapterPath, 'utf-8');

    expect(content).toContain('title:');
    expect(content).toContain('phase: "harvest"');
    expect(content).toContain('order: 13');
    expect(content).toContain('因果連接');
  });
});
```

- [ ] **Step 2: 運行測試**

```bash
npm test -- tests/tax-calculator.test.ts
```

- [ ] **Step 3: 運行構建**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add tests/tax-calculator.test.ts
git commit -m "test: add tax calculator tests"
```

---

## 執行摘要

| Chunk | 任務數 | 預計時間 |
|-------|--------|---------|
| Chunk 1: 稅率資料 JSON | 2 | 15 分鐘 |
| Chunk 2: 章節 MD 文件 | 1 | 20 分鐘 |
| Chunk 3: 互動 JS 邏輯 | 2 | 45 分鐘 |
| Chunk 4: 測試與驗證 | 1 | 20 分鐘 |
| **總計** | **6** | **~100 分鐘** |

---

## 預期產出

1. `src/data/tax-rates.json` - 稅率配置
2. `src/content/handbook/12-tax-calculator.md` - 新章節
3. `src/styles/tax-calculator.css` - 專用樣式
4. 更新 `src/pages/handbook/[...slug].astro` - 互動邏輯
5. 更新 `src/data/glossary.ts` - 新術語
6. `tests/tax-calculator.test.ts` - 測試文件

---

**Plan complete and saved.** Ready to execute?
