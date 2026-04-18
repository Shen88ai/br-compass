---
title: "淨利還原公式與稅務規劃檢查清單"
description: "完整公式推導與行動檢查清單，幫助企業落實稅務規劃。"
phase: "D"
phaseLabel: "第四階段：財務合規"
order: 01.4
icon: "✅"
tags: ["稅務", "公式", "檢查清單", "行動"]
featured: false
images:
  cover: 04d-tax-comparison-formula-cover.jpeg
---

## 四、CBS/IBS 抵扣邏輯說明

在 2027 年新稅制下，CBS/IBS 標準稅率為 **28%**：

- **進口端**：進項發票金額 (C) × 28% = 可抵扣額
- **銷售端**：銷售發票金額 × 28% = 應付稅額
- **實繳**：銷售端稅額 - 進口端抵扣額

### 計算示例

| 模式 | 進口稅 | 銷售稅 | 實繳 |
|------|--------|--------|-------|
| 全報 | $1,500 × 28% = $420 | $2,400 × 28% = $672 | $672 - $420 = **$252** |
| 低報 | $750 × 28% = $210 | $2,137.50 × 28% = $598.50 | $598.50 - $210 = **$389** |

---

## 🏭 稅務流水線工廠

<div class="tax-factory" id="tax-factory">
  <div class="factory-pipeline">
    <div class="factory-station import-station">
      <div class="station-icon">📦</div>
      <div class="station-name">關口1 - 進口</div>
      <div class="station-value" data-value="import">R$ 1,500</div>
      <div class="station-formula">進項發票金額</div>
      <div class="station-tax">
        <span class="tax-badge">-28%</span>
        <span class="tax-value deduction" data-tax="import">-R$ 420</span>
      </div>
    </div>
    <div class="conveyor-belt">
      <div class="belt-segment"></div>
      <div class="belt-arrow">▶</div>
    </div>
    <div class="factory-station sales-station">
      <div class="station-icon">🏭</div>
      <div class="station-name">關口2 - 銷售</div>
      <div class="station-value" data-value="sales">R$ 2,400</div>
      <div class="station-formula">銷售發票</div>
      <div class="station-tax">
        <span class="tax-badge">+28%</span>
        <span class="tax-value" data-tax="sales">+R$ 672</span>
      </div>
    </div>
    <div class="conveyor-belt">
      <div class="belt-segment"></div>
      <div class="belt-arrow">▶</div>
    </div>
    <div class="factory-station net-station">
      <div class="station-icon">💰</div>
      <div class="station-name">結算中心</div>
      <div class="station-value net-value" data-value="net">R$ 252</div>
      <div class="station-formula">實繳 CBS/IBS</div>
    </div>
  </div>
  <div class="factory-controls">
    <button class="factory-btn active" data-mode="full">☀️ 全報模式</button>
    <button class="factory-btn" data-mode="subf">🌙 低報模式</button>
  </div>
  <div class="factory-dashboard">
    <div class="dashboard-card">
      <div class="card-header">全報模式</div>
      <div class="card-value">R$ 252</div>
      <div class="card-label">實繳 CBS/IBS</div>
      <div class="card-status safe">✅ 合規</div>
    </div>
    <div class="dashboard-card">
      <div class="card-header">低報模式</div>
      <div class="card-value">R$ 389</div>
      <div class="card-label">實繳 CBS/IBS</div>
      <div class="card-status warning">⚠️ 高稅</div>
    </div>
  </div>
</div>

<script>
const modeData = {
  full: {import:'R$ 1,500',importTax:'-R$ 420',sales:'R$ 2,400',salesTax:'+R$ 672',net:'R$ 252'},
  subf: {import:'R$ 750',importTax:'-R$ 210',sales:'R$ 2,137.50',salesTax:'+R$ 598.50',net:'R$ 389'}
};
document.querySelectorAll('.factory-btn').forEach(b=>b.onclick=()=>{
  document.querySelectorAll('.factory-btn').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  const d=modeData[b.dataset.mode];
  ['import','sales','net'].forEach(k=>document.querySelector(`[data-value="${k}"]`).textContent=d[k]);
  ['import','sales'].forEach(k=>document.querySelector(`[data-tax="${k}"]`).textContent=d[k==='import'?d.importTax:d.salesTax]);
});
</script>

---

## 五、淨利還原公式

### 標準模式
```
H = E - D - I - J
```

### 低報模式
```
H = E - D - I - J - B
```

**變數說明**：
- E = 毛利
- D = 營運成本
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

### 💡 專家建議

首選「利潤推算制 + 正清全報」，可達到最高總返款金額 (**1,345.28**)，且屬於 **100% 合規經營**。

---

完成稅務規劃後，繼續閱讀下一章 [利潤匯回](/handbook/12-profit-remittance)，了解如何合規將巴西利潤匯回母公司！

← 上一章：[Q&A 學習區塊](/handbook/04c-tax-comparison-qa)
| [下一章：利潤匯出](/handbook/12-profit-remittance) →
