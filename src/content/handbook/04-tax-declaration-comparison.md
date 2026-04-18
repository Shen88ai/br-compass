---
title: "進口正清全報及低報比較（目錄）"
description: "稅制轉型下的三種申報模式比較，幫助中小企業做出最適合的稅務決策。本頁已拆分為四個子頁面，請點擊下方連結瀏覽。"
phase: "D"
phaseLabel: "第四階段：財務合規"
order: 01
icon: "📊"
tags: ["稅務", "進口", "正清全報", "低報", "利潤分析", "Lucro Real", "Lucro Presumido", "CBS", "IBS"]
featured: true
images:
  cover: 04-tax-declaration-comparison-cover.jpeg
---

## 📋 本頁已拆分為四個子頁面

### 章節目錄

1. **[稅務流水線與結論](/handbook/04a-tax-comparison-intro)** ← 建議先讀
   - 核心發現與一分鐘結論
   - 🏭 稅務流水線工廠（互動式）

2. **[三種模式詳細比較表](/handbook/04b-tax-comparison-modes)**
   - Lucro Real 計算表
   - Lucro Presumido 計算表
   - 低報計算表（含風險警示）

3. **[Q&A 學習區塊](/handbook/04c-tax-comparison-qa)**
   - 6 個常見問題解答
   -循序漸進學習

4. **[淨利公式與檢查清單](/handbook/04d-tax-comparison-formula)**
   - CBS/IBS 抵扣邏輯
   - 淨利還原公式
   - 稅務規劃檢查清單

---

👉 [從第一章開始閱讀 →](/handbook/04a-tax-comparison-intro)

> **因果連接**：如果你不了解正清全報與低報的實際利潤差異——你將做出錯誤的稅務決策，可能導致利潤被侵蝕或面臨稽查風險。

---

<!-- LAYER 1: 結論優先顯示 -->
<div class="layer-conclusion" id="key-finding">

### 🎯 核心發現：一分鐘結論

> **正清全報比低報多賺 R$6.53（每 R$1,000 進口額）**
> 
> - Lucro Real 全報：淨利 R$304｜合規 100%
> - Lucro Presumido 全報：淨利 R$345｜合規 100%
> - 低報：淨利 R$339｜⚠️ 稽查風險

### 💡 行動建議
首選「Lucro Presumido + 正清全報」可達最高總返款金額 (R$1,345)，且 100% 合規。

<details>
<summary>點擊查看完整比較 →</summary>

## 一、三種模式比較表（點擊展開）

| 項目 | Lucro Real 全報 | Lucro Presumido 全報 | 低報 ⚠️ |
|------|----------------|-------------------|----------|
| 淨利 | R$304 | R$345 | R$339 |
| 合規 | ✅ 100% | ✅ 100% | 🔴 風險 |
| CBS/IBS 抵扣 | ✅ 可抵扣 R$420 | ✅ 可抵扣 | ❌ 不能 |

</details>

## 二、CBS/IBS 抵扣邏輯說明

### 🏭 稅務流水線工廠

<div class="tax-factory" id="tax-factory">
  <div class="factory-pipeline">
    <div class="factory-station import-station">
      <div class="station-icon">📦</div>
      <div class="station-name">關口1 - 進口</div>
      <div class="station-value" data-value="import">$1,500</div>
      <div class="station-formula">進項發票金額</div>
      <div class="station-tax">
        <span class="tax-badge">-28%</span>
        <div class="tax-value" data-tax="import">-$420</div>
      </div>
    </div>
    
    <div class="conveyor-belt">
      <div class="belt-segment"></div>
      <div class="belt-arrow">▼</div>
    </div>
    
    <div class="factory-station sales-station">
      <div class="station-icon">🏭</div>
      <div class="station-name">關口2 - 銷售</div>
      <div class="station-value" data-value="sales">$2,400</div>
      <div class="station-formula">銷售發票</div>
      <div class="station-tax">
        <span class="tax-badge">+28%</span>
        <div class="tax-value" data-tax="sales">+$672</div>
      </div>
    </div>
    
    <div class="conveyor-belt">
      <div class="belt-segment"></div>
      <div class="belt-arrow">▼</div>
    </div>
    
    <div class="factory-station net-station">
      <div class="station-icon">💰</div>
      <div class="station-name">結算中心</div>
      <div class="station-value net-value" data-value="net">$252</div>
      <div class="station-formula">實繳稅額</div>
    </div>
</div>
  
  <div class="factory-controls">
    <div class="mode-label">🔄 模式切換：</div>
    <div class="mode-buttons">
      <button class="factory-btn active" data-mode="full">☀️ 全報模式</button>
      <button class="factory-btn" data-mode="subf">🌙 低報模式</button>
    </div>
  </div>
  
  <div class="factory-dashboard">
    <div class="dashboard-card">
      <div class="card-header">全報模式</div>
      <div class="card-value">$252</div>
      <div class="card-label">實繳稅額</div>
      <div class="card-status">✅ 合規</div>
    </div>
    <div class="dashboard-card">
      <div class="card-header">低報模式</div>
      <div class="card-value">$389</div>
      <div class="card-label">實繳稅額</div>
      <div class="card-status">⚠️ 高稅</div>
    </div>
  </div>
</div>

## 二、三種模式 Accordion

<details>
<summary>📊 點擊展開：三種模式詳細計算表</summary>

### 1. Lucro Real 實際利潤制 - 正清全報

| 項目 | 代碼 | 數值 | 公式 | 說明 |
|------|------|------|------|------|
| 實際貨價 (CIF) | A | 1,000.00 | - | 基礎物料成本 |
| 申報金額 (DUIMP) | B | 1,000.00 | - | 正清全報 = A |
| 進口稅費 | - | -500.00 | B × 50% | |
| 進項發票金額 | C | 1,500.00 | B + 進口稅費 | |
| 毛利率 | - | 60% | 用戶指定 | |
| 毛利 | E | 900.00 | C × 60% | |
| 銷售發票金額 | F | 2,400.00 | C + E | |
| 企業所得稅 (IRPJ) | I | 60.00 | (E-D) × 15% | 按實際利潤×15% |
| 社會安全捐 (CSLL) | J | 36.00 | (E-D) × 9% | 按實際利潤×9% |
| 營運成本 | D | 500.00 | 固定支出 | |
| 稅後淨利 | H | 304.00 | E-D-I-J | |
| 總返款中國金額 | - | 1,304.00 | A + H | |

### 2. Lucro Presumido 利潤推算制 - 正清全報

| 項目 | 代碼 | 數值 | 公式 | 說明 |
|------|------|------|------|------|
| 實際貨價 (CIF) | A | 1,000.00 | - | 基礎物料成本 |
| 申報金額 (DUIMP) | B | 1,000.00 | - | 正清全報 = A |
| 進口稅費 | - | -500.00 | B × 50% | |
| 進項發票金額 | C | 1,500.00 | B + 進口稅費 | |
| 毛利率 | - | 60% | 用戶指定 | |
| 毛利 | E | 900.00 | C × 60% | |
| 銷售發票金額 | F | 2,400.00 | C + E | |
| 企業所得稅 (IRPJ) | I | 28.80 | F×8% × 15% | 按銷售額8%推算稅基×15% |
| 社會安全捐 (CSLL) | J | 25.92 | F×12% × 9% | 按銷售額12%推算×9% |
| 營運成本 | D | 500.00 | 不扣除 | |
| 稅後淨利 | H | 345.28 | E-D-I-J | |
| 總返款中國金額 | - | 1,345.28 | A + H | |

> 💡 為何淨利更高？利潤推算制的稅基基於銷售額的 8% 和 12% 推算，不考慮實際成本。當毛利率 60% > 推算比例時，稅負較低。

### 3. Lucro Presumido - 低報 ⚠️

<details>
<summary>⚠️ 風險警示：此模式存在被國稅局稽查的風險</summary>

| 項目 | 代碼 | 數值 | 公式 | 說明 |
|------|------|------|------|------|
| 實際貨價 (CIF) | A | 1,000.00 | - | 基礎物料成本 |
| 申報金額 (DUIMP) | B | 500.00 | - | 低報金額 |
| 進口稅費 | - | -250.00 | B × 50% | |
| 進項發票金額 | C | 750.00 | B + 進口稅費 | |
| 毛利率 | - | 185% | 為維持售價而拉高 | |
| 毛利 | E | 1,387.50 | C × 185% | |
| 銷售發票金額 | F | 2,137.50 | C + E | |
| 企業所得稅 (IRPJ) | I | 25.65 | F×8% × 15% | 按銷售額8%推算稅基×15% |
| 社會安全捐 (CSLL) | J | 23.09 | F×12% × 9% | 按銷售額12%推算×9% |
| 營運成本 | D | 500.00 | 不扣除 | |
| 稅後淨利 | H | 338.77 | E-D-I-J-B | 需扣除未申報差額B |
| 總返款中國金額 | - | 1,338.77 | A + H | |

> ⚠️ 為何需扣除 500？低報模式的淨利公式必須扣除「未申報的實際貨款差額」，即 1,000 - 500 = 500。
> 
> 📉 銷售發票降幅：10.9% = (2,400 - 2,137.50) / 2,400 = 10.9%

</details>

</details>

## 三、Q&A 學習區塊

<details>
<summary>📚 循序漸進學習指南</summary>

**Q1: 這份分析報告主要對比了哪些經營模式？**

報告主要對比了三種情境：Lucro Real 正清全報、Lucro Presumido 正清全報、以及 Lucro Presumido 低報 (Sub F.)。

**Q3: 為什麼低報模式的帳面毛利率高達 185%？**

因為低報模式的進項成本 (C) 在帳面上僅為 **750.00**（全報為 1,500.00），必須透過極高的 185% 毛利率，才能讓最終的銷售發票金額達到 **2,137.50**。

**Q5: 2027 年導入的 28% CBS/IBS 是如何運作的？**

這是一種「非累積性」稅制：全報模式在進口端繳納 **420.00**，在銷售端應付 **672.00**，最終僅需補繳 **252.00**。

**Q11: 低報時少支付的稅，如何被抵銷？**

進口端少支付 **$250** → 銷售端多繳 **$136.50** → 凈效果：被抵銷 **$113.50**，仍在銷售端多繳稅。

> ⚠️ 結論：低報模式的節稅效果最終被完全抵銷！

</details>

## 四、CBS/IBS 抵扣邏輯說明

在 2027 年新稅制下，CBS/IBS 標準稅率為 **28%**：

- **進口端**：進項發票金額 (C) × 28% = 可抵扣額
- **銷售端**：銷售發票金額 × 28% = 應付稅額
- **實繳**：銷售端稅額 - 進口端抵扣額

示例：
- 全報：$1,500 × 28% = $420（進口）→ $2,400 × 28% = $672（銷售）→ 實繳 $252
- 低報：$750 × 28% = $210（進口）→ $2,137.50 × 28% = $598.50（銷售）→ 實繳 $389

## 五、淨利還原公式

**標準模式**：H = E - D - I - J

**低報模式**：H = E - D - I - J - B

其中：
- E = 毛利
- D = 運營成本
- I = IRPJ（企業所得稅）
- J = CSLL（社會安全捐）
- B = 低報差額（未申報的實際貨款）

---

## [關鍵決策] 稅務規劃檢查清單

- [ ] 我了解三種稅務制度的差異及適用場景？
- [ ] 我的企業適合哪種稅務制度？（Lucro Real / Lucro Presumido）
- [ ] 我選擇的申報方式能通過海關查驗？
- [ ] 低報模式的風險是否超過其帶來的效益？
- [ ] 我的企業是否有專業會計師協助稅務申報？

**專家建議**：首選「利潤推算制 + 正清全報」，可達到最高總返款金額 (**1,345.28**)，且屬於 **100% 合規經營**。

完成稅務規劃後，繼續閱讀下一章 <a href="/handbook/12-profit-remittance">利潤匯回</a>，了解如何合規將巴西利潤匯回母公司！