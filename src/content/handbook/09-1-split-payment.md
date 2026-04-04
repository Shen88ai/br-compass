---
title: "Split Payment 現金流生存指南：稅款即時扣繳的 survival playbook"
description: "深度解析 2026 年起的 Split Payment 分裂支付機制，理解「稅款瞬間被抽走」對現金流的衝擊，並提供週轉金規劃與 ERP 對接的實務建議。"
phase: "operations"
phaseLabel: "第三階段：供應鏈營運"
order: 91
icon: "💸"
tags: ["Split Payment", "現金流", "CBS", "IBS", "週轉金", "財務管理", "Split Payment"]
---

> **因果連接**：當消費者按下「付款」按鈕的瞬間，你的銀行帳戶可能直接減少 26.5%——這不是誇張，而是 2026 年起每筆 Pix/信用卡交易都會面對的現實。

## 一、Split Payment 為何讓企業「聞風喪膽」？

### 舊模式：免費的稅款融資

在 Split Payment 之前，企業收款後可以「免费」使用這筆資金長達數週至數月，之後才繳納稅款。這段時間被稱為「**免費融資期**」——企業相當於從國庫獲得一筆免息短期借貸。

### 新模式：款到即扣

Split Payment 機制下，消費者的付款會在清算**瞬間**被自動分拆：

```
┌─────────────────────────────────────────────────────────────┐
│  消費者付款 R$100                                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐                                           │
│  │  CBS + IBS  │  R$26.50 → 即時匯至國庫 ⏱️ 即刻           │
│  │  (26.5%)    │                                           │
│  └─────────────┘                                           │
│                                                              │
│  ┌─────────────┐                                           │
│  │  平台佣金    │  R$15.00 → 匯至平台帳戶                   │
│  └─────────────┘                                           │
│                                                              │
│  ┌─────────────┐                                           │
│  │  賣家淨額    │  R$58.50 → 匯至賣家帳戶                   │
│  └─────────────┘                                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 「消失的一個月」風險

假設你月度銷售額為 **R$500,000**，其中 70% 來自 Pix/信用卡：

| 項目 | 金額 |
|---|---|
| 月銷售額 | R$500,000 |
| Pix/信用卡（70%） | R$350,000 |
| Split Payment 扣繳（26.5%） | R$92,750 |
| **實際到帳** | **R$257,250** |

這意味著每個月的營運資金瞬間減少近 **R$10 萬**，你的薪資、供應商貨款、工廠租金都必須從這筆縮水的金額中擠出。

---

## 二、誰會被影響？

### 受影響的交易類型

| 支付方式 | 是否受 Split Payment 影響 | 說明 |
|---|---|---|
| Pix | ✅ 完全影響 | 所有 Pix 交易均自動扣繳 |
| 信用卡 | ✅ 完全影響 | 清算時即扣繳 |
| Boleto | ⚠️ 部分州 | 取決於州政府是否啟用 |
| 實體現金 | ❌ 不影響 | 僅線上交易適用 |

### 受影響的企業規模

Split Payment 機制對**所有納稅企業**強制執行，無論規模大小。但對以下企業衝擊最大：

1. **高週轉、低毛利的電商**：現金流緩衝空間小
2. **營收快速成長的企業**：進項抵扣來不及跟上銷項增長
3. **依賴「稅款融資」的企業**：過去靠遲繳稅款作為短期資金來源

---

## 三、生存策略：四招應對 Split Payment

### 策略一：建立「稅款預留金」帳戶

每月銷售額的 **30%** 應直接自動轉入獨立的「稅款準備金」帳戶，確保任何時候都有足夠資金應對 Split Payment 扣繳。

```
建議公式：預留金 = 月銷售額 × 30%（保守估計 26.5% + 緩衝）
```

### 策略二：加速進項稅金抵扣（Lucro Real 限定）

在 **Lucro Real** 制度下，進口時繳納的 CBS/IBS 可作為進項稅金抵扣。關鍵在於：

1. **確保及時取得進口發票（NF-e）**：進口海關放行後立即取得
2. **正確勾選進項稅**：ERP 系統需正確配置 CBS/IBS 進項抵扣邏輯
3. **按週監控抵扣額度**：不要等到季度申報才發現抵扣不足

### 策略三：調整定價模型

將 Split Payment 的成本納入產品定價：

```
新定價 = 舊定價 × (1 + Split Payment 成本率)
```

| 產品類型 | 建議加價幅度 |
|---|---|
| 高毛利（>50%）| 2%~3% |
| 中等毛利（30%~50%）| 5%~8% |
| 低毛利（<30%）| 10%~15% 或重新評估產品線 |

### 策略四：談判支付通道費率

對於高交易量的電商，可與支付服務商談判：

- **降低手續費**：交易量達一定規模後，手續費可降至 1.5% 以下
- **延遲結算**：部分服務商提供 T+3 或 T+7 結算選項，給予短期資金緩衝
- **分期付款利息收入**：消費者分期付款的利息可補貼 Split Payment 成本

---

## 四、互動工具：你的 Split Payment 風險評估

<div class="quiz-container" id="split-payment-quiz">
  <div class="quiz-header">
    <span style="font-size:1.3rem;">🎯</span>
    <h3 class="quiz-title">Split Payment 風險評估問卷</h3>
    <span class="quiz-progress" id="sp-quiz-progress">問題 1 / 4</span>
  </div>
  <div id="sp-quiz-body">
    <div class="quiz-question" id="sp-quiz-question">你的月銷售額大約是多少？</div>
    <div class="quiz-options" id="sp-quiz-options">
      <button class="quiz-option" data-value="1" data-question="0">低於 R$50 萬（小規模）</button>
      <button class="quiz-option" data-value="2" data-question="0">R$50 萬 ~ R$200 萬（中等規模）</button>
      <button class="quiz-option" data-value="3" data-question="0">超過 R$200 萬（大規模）</button>
    </div>
  </div>
  <div class="quiz-result" id="sp-quiz-result" style="display:none;">
    <h4 class="quiz-result-title" id="sp-result-title"></h4>
    <p class="quiz-result-desc" id="sp-result-desc"></p>
    <button class="quiz-restart" onclick="restartSPQuiz()">重新測驗</button>
  </div>
</div>

---

## 五、ERP 系統對接檢查清單

為確保 Split Payment 正常運作，你的 ERP 必須具備以下功能：

| 功能 | 重要性 | 說明 |
|---|---|---|
| ✅ CBS/IBS 自動計算 | 必須 | 每筆交易自動計算並拆分稅款 |
| ✅ Split Payment API 對接 | 必須 | 與銀行系統即時同步扣繳 |
| ✅ 進項稅金追蹤 | 必須 | 記錄進口稅金可抵扣額度 |
| ✅ 現金流儀表板 | 建議 | 即時顯示「稅前銷售」vs「稅後實收」 |
| ✅ 預警機制 | 建議 | 餘額低於安全水位時自動提醒 |

---

> **💡 先行者優勢**：2026 年是 Split Payment 的測試期，稅率僅 1%。現在就建立完善的 ERP 對接流程，等到 2027 年 CBS 全面啟動（26.5%）時，你的團隊已經輕車熟路。

---

## 六、常見問題 FAQ

### Q1：Split Payment 是否有最低交易門檻？

目前無最低門檻，所有線上交易均自動適用。

### Q2：消費者分期付款（Pix Parcelado）如何扣繳？

分期付款的每期都會單獨觸發 Split Payment，稅款按每期金額計算。

### Q3：如果我的銀行尚未對接 Split Payment 怎麼辦？

聯繫你的銀行或支付服務商，要求盡快上線 Split Payment 功能。延遲對接可能導致罰款。

### Q4：Lucro Presumido 企業是否需要關注 Split Payment？

更需要關注。因為 Lucro Presumido **不可抵扣進項稅金**，等於完全承擔 Split Payment 的全部成本。