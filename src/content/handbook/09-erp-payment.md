---
title: "建立神經網絡：ERP 整合與在地支付系統"
description: "如何整合 Pix、Boleto、Split Payment 分裂支付機制？選擇適合跨境電商的 ERP 系統，打造訂單到現金的自動化流程。"
phase: "operations"
phaseLabel: "第三階段：供應鏈營運"
order: 9
icon: "💳"
tags: ["ERP", "Pix", "Boleto", "Split Payment", "支付", "Bling", "Tiny", "現金流"]
---

> **因果連接**：訂單來了，但如何收款、如何開立發票、如何記帳？如果這三個環節不能自動化，你的運營團隊將被手工作業淹沒。ERP 與支付系統的整合，是跨境電商的神經中樞。

## 一、巴西支付生態系統

巴西的支付市場是**全球最創新的之一**，2025 年數位支付佔比超過 70%。以下是外資賣家必須支持的支付方式：

### Pix：即時支付革命

**Pix** 是巴西中央銀行推出的即時支付系統，2020 年上線後迅速成為**巴西最主流的支付方式**，佔所有數位交易的 35% 以上。

| 特點 | 說明 |
|---|---|
| 即時到帳 | 7×24 小時，秒級到帳 |
| 零/低手續費 | 個人間免費，商戶手續費約 0.5%~1.5% |
| Pix QR Code | 掃碼支付，適合線下場景 |
| Pix Automático | 定期自動扣款（2024 年推出） |
| Pix Parcelado | 分期付款（2025 年推出） |

> **💡 策略**：在電商平台上提供 Pix 支付選項，可顯著提高轉化率。許多消費者因為 Pix 的即時性和低手續費而優先選擇。

### Boleto Bancário：傳統但不可或缺

**Boleto** 是巴西的銀行帳單支付方式，雖然數位化時代使用率下降，但仍佔約 10% 的線上交易。

| 特點 | 說明 |
|---|---|
| 支付期限 | 通常 3 個工作日內有效 |
| 手續費 | R$3~R$5/筆 |
| 適用人群 | 無銀行帳戶或信用卡的消費者 |
| 風險 | 消費者可能不付款，訂單自動取消 |

### 信用卡分期（Parcelamento）

巴西消費者**極度依賴信用卡分期**，高達 60% 的電商交易使用分期付款。

| 特點 | 說明 |
|---|---|
| 期數 | 最多 12 期（部分平台支持 18 期） |
| 利息 | 賣家承擔（免息分期）或消費者承擔 |
| 手續費 | 2.5%~4.5%/筆（依卡組織與期數而定） |
| 卡組織 | Visa、Mastercard、Elo、Hipercard |

---

## 二、Split Payment 分裂支付機制

### 什麼是 Split Payment？

**Split Payment** 是巴西稅務改革（EC 132/2023）引入的機制，核心概念是：**消費者付款的瞬間，稅款被自動截流至國庫，剩餘金額才分配給賣家與平台。**

### 運作流程

<div class="flow-card">
  <div class="flow-card-header">
    <span style="font-size:1.2rem;">💸</span>
    <h4 class="flow-card-title">Split Payment 運作流程</h4>
  </div>
  <div class="flow-steps">
    <div class="flow-step">
      <div class="flow-step-icon">1</div>
      <div class="flow-step-content">
        <div class="flow-step-title">消費者支付 R$100</div>
        <div class="flow-step-desc">消費者完成付款（Pix / 信用卡 / Boleto）</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">2</div>
      <div class="flow-step-content">
        <div class="flow-step-title">稅款即時扣繳 → 國庫</div>
        <div class="flow-step-desc">約 R$26.5（CBS + IBS）即時匯至國庫</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">3</div>
      <div class="flow-step-content">
        <div class="flow-step-title">平台佣金 → 平台帳戶</div>
        <div class="flow-step-desc">約 R$15 匯至電商平台帳戶</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">4</div>
      <div class="flow-step-content">
        <div class="flow-step-title">賣家淨額 → 賣家帳戶</div>
        <div class="flow-step-desc">約 R$58.5 匯至賣家銀行帳戶</div>
      </div>
    </div>
  </div>
</div>

### 對賣家的影響

| 影響 | 說明 | 應對策略 |
|---|---|---|
| 現金流減少 | 收到的金額是稅後淨額 | 調整定價模型，確保利潤 |
| 帳務複雜化 | 需記錄「稅前銷售額」與「稅後實收」 | ERP 系統自動處理 |
| 進項稅抵扣 | Lucro Real 下可抵扣進口稅金 | 確保會計師正確申報 |
| 平台佣金可抵 | 佣金支出可作為營業費用 | 保留完整交易記錄 |

### Split Payment 實施時間表

| 時間 | 進度 |
|---|---|
| 2026 | 試行期（CBS 0.9% + IBS 0.1%），部分平台試點 |
| 2027~2029 | 逐步擴大，替代 PIS/COFINS |
| 2030~2032 | 全面實施，替代 ICMS/ISS |
| 2033 | 新制完全體 |

> **⚠️ 重要**：即使 Split Payment 尚未全面實施，你的 ERP 系統現在就應該**預留處理能力**，以便在機制上線時無縫切換。

---

## 三、ERP 系統選擇與整合

### 為什麼需要 ERP？

跨境電商在巴西運營涉及**多個系統的數據流動**：

<div class="flow-card">
  <div class="flow-card-header">
    <span style="font-size:1.2rem;">🔗</span>
    <h4 class="flow-card-title">跨境電商數據流動架構</h4>
  </div>
  <div class="flow-steps">
    <div class="flow-step">
      <div class="flow-step-icon">1</div>
      <div class="flow-step-content">
        <div class="flow-step-title">電商平台 → 訂單</div>
        <div class="flow-step-desc">Mercado Libre、Amazon、TikTok Shop 等平台產生訂單</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">2</div>
      <div class="flow-step-content">
        <div class="flow-step-title">訂單 → ERP 系統</div>
        <div class="flow-step-desc">訂單數據自動同步至 ERP（Bling / Tiny / Omie）</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">3</div>
      <div class="flow-step-content">
        <div class="flow-step-title">ERP → NF-e 開立</div>
        <div class="flow-step-desc">ERP 自動生成電子發票（NF-e），發送給稅局</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">4</div>
      <div class="flow-step-content">
        <div class="flow-step-title">NF-e → 3PL 倉庫 → 物流追蹤</div>
        <div class="flow-step-desc">3PL 憑 NF-e 發貨，物流狀態回傳至 ERP</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">5</div>
      <div class="flow-step-content">
        <div class="flow-step-title">支付网关 → 銀行對帳</div>
        <div class="flow-step-desc">Pix / 信用卡收款數據自動對帳</div>
      </div>
    </div>
    <div class="flow-step">
      <div class="flow-step-icon">6</div>
      <div class="flow-step-content">
        <div class="flow-step-title">會計系統 → 稅務申報</div>
        <div class="flow-step-desc">ERP 數據自動生成 SPED 報表，提交稅局</div>
      </div>
    </div>
  </div>
</div>

沒有 ERP，這些流程全部手動操作，錯誤率高且效率低下。

### 主流 ERP 對比

| 系統 | 適合規模 | 月費（BRL） | 平台對接 | NF-e | 財務模組 | 多平台 |
|---|---|---|---|---|---|---|
| **Bling** | 中小企業 | R$100~R$300 | ML, Shopee, Amazon | ✅ | 基礎 | ✅ |
| **Tiny ERP** | 中小企業 | R$150~R$400 | ML, Shopee, Amazon | ✅ | 進階 | ✅ |
| **Omie** | 中大型 | R$500~R$1,500 | 全平台 | ✅ | 完整 | ✅ |
| **Linx** | 大型零售 | 客製化 | 全平台 | ✅ | 企業級 | ✅ |
| **SAP Business One** | 跨國企業 | 客製化 | 客製化 | ✅ | 企業級 | ✅ |

### 推薦方案：Bling（初期）

對於剛進入巴西市場的外資賣家，**Bling** 是最佳起點：

1. **成本低**：月費僅 R$100~R$300。
2. **功能齊全**：支持 NF-e 開立、庫存管理、財務對帳。
3. **平台對接**：內建 Mercado Livre、Shopee、Amazon、Magazine Luiza 等主流平台。
4. **3PL 整合**：支持與主要 3PL 倉庫的 API 對接。
5. **支付整合**：支持 Pix、Boleto、信用卡的自動對帳。

### ERP 設置檢查清單

- [ ] 公司 CNPJ 與 Inscrição Estadual 已錄入系統
- [ ] 稅務類型設定為 Lucro Real
- [ ] 各電商平台 API 金鑰已配置
- [ ] 3PL 倉庫 API 已對接
- [ ] NF-e 模板已配置（含正確 CFOP 代碼）
- [ ] 支付网关已綁定（Pix、Boleto、信用卡）
- [ ] 會計師已獲得系統訪問權限

---

## 四、支付网关選擇

### 主流支付网关

| 网关 | 特點 | 手續費 | 支援 Pix | 支援 Boleto |
|---|---|---|---|---|
| **Mercado Pago** | 與 Mercado Livre 深度整合 | 2.99%~4.99% | ✅ | ✅ |
| **Pagar.me** | 開發者友好，API 完善 | 2.5%~4.5% | ✅ | ✅ |
| **PagSeguro** | 巴西最大獨立支付网关 | 2.9%~4.9% | ✅ | ✅ |
| **Stripe Brasil** | 國際標準，易於整合 | 2.9%~4.9% | ✅ | ✅ |
| **Asaas** | 支援訂閱制與分期付款 | 1.99%~3.99% | ✅ | ✅ |

### 選擇建議

- 如果主要在 **Mercado Livre** 銷售 → 使用 **Mercado Pago**（最順暢）
- 如果需要**多平台統一收款** → 使用 **Pagar.me** 或 **Asaas**
- 如果需要**國際化標準** → 使用 **Stripe Brasil**

---

## 五、[關鍵決策] 支付與 ERP 清單

- [ ] 是否已選擇並設置 ERP 系統？
- [ ] ERP 是否已對接所有入駐的電商平台？
- [ ] 是否已配置 NF-e 自動開立功能？
- [ ] 支付网关是否已綁定並測試 Pix、Boleto、信用卡？
- [ ] ERP 是否已預留 Split Payment 處理能力？
- [ ] 會計師是否已獲得 ERP 系統訪問權限？
- [ ] 銀行對帳流程是否已自動化？

完成支付與 ERP 整合後，你的運營神經系統已經建立——下一步是建立本地化售後服務體系！
