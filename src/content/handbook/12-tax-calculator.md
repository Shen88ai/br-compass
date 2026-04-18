---
title: "進口稅務計算器：全額申報 vs 低報風險"
description: "互動式稅務模擬：了解巴西進口稅務結構，比較全額申報與低報的稅務差異與風險。"
phase: "D"
phaseLabel: "第四階段：財務合規"
order: 04
icon: "🧮"
tags: ["稅務", "計算器", "進口", "全額申報", "低報", "風險評估"]
featured: true
images:
  cover: 12-tax-calculator-cover.jpeg
---

> **因果連接**：如果你不了解巴西進口稅務結構——你將面臨被海關查驗、補稅罰款的風險。罰款最高可達應繳稅額的 225%，還可能影響你的 RADAR 評級，導致未來通關更加困難。

## 一、稅務制度選擇

<div class="tax-calculator-container" id="tax-calc-container"><div class="regime-selection" id="regime-selection"><div class="step-label">Step 1 ／ 選擇稅務套裝 (Regime & PIS/COFINS)</div><div class="regime-cards"><div class="regime-card" data-regime="simples" style="border-color:#f0a500;background:#fff8ec;"><div class="regime-name" style="color:#e07b00;">Simples Nacional</div><div class="regime-desc">適合小微企業<br>PIS/COFINS 已含於單一稅率</div><button class="regime-btn" data-action="choose-regime" data-regime="simples" style="background:#e07b00;">選擇</button></div><div class="regime-card" data-regime="presumido" style="border-color:#1a6fbd;background:#f0f6ff;"><div class="regime-name" style="color:#1a6fbd;">Lucro Presumido (累積制)</div><div class="regime-desc">法律強制綁定：<br>PIS 0.65% / COFINS 3.0%</div><button class="regime-btn" data-action="choose-regime" data-regime="presumido" style="background:#1a6fbd;">選擇</button></div><div class="regime-card" data-regime="real-non-cumulative" style="border-color:#1a8f4c;background:#f0fff5;"><div class="regime-name" style="color:#1a8f4c;">Lucro Real (非累積制)</div><div class="regime-desc">一般大型企業標準：<br>PIS 1.65% / COFINS 7.6% (可抵扣)</div><button class="regime-btn" data-action="choose-regime" data-regime="real-non-cumulative" style="background:#1a8f4c;">選擇 一般行業</button></div><div class="regime-card" data-regime="real-cumulative" style="border-color:#6f42c1;background:#f5f0ff;"><div class="regime-name" style="color:#6f42c1;">Lucro Real (累積制)</div><div class="regime-desc">法律強制特定行業：<br>金融、電信、教育等 (3.65% 無抵扣)</div><button class="regime-btn" data-action="choose-regime" data-regime="real-cumulative" style="background:#6f42c1;">選擇 特定行業</button></div></div></div><div class="adicional-selection" id="adicional-selection" style="display:none;"><div class="step-label">Step 2 ／ 第二層：Adicional do IRPJ / CSLL</div><p class="adicional-desc">當年度 <strong>Lucro Real / Presumido</strong> 超過 <strong>R$20.000/mês</strong>（年化 R$240.000）時，IRPJ 須加收 <strong>10%</strong> 附加稅（Adicional）。</p><button class="adicional-btn yes" data-action="choose-adicional" data-value="true" style="background:#b5490f;">✅ 適用 Adicional (lucro > R$240k/ano)</button><button class="adicional-btn no" data-action="choose-adicional" data-value="false" style="background:#1a6fbd;">❌ 不適用 Adicional</button></div><div class="tax-result" id="tax-result"></div></div>

## 二、互動式模擬試算

<div class="simulator-container" id="simulator-container"><div class="reform-toggle"><div class="toggle-label"><span style="font-size:1.05rem;">🎯 啟動 2026 稅改過渡期模擬 (Reforma Tributária - 1%)</span><br><span style="font-size:0.85rem;font-weight:400;">PIS/COFINS 將自動全額抵扣 1% 並獨立為 <strong>CBS (0.9%)</strong> 及 <strong>IBS (0.1%)</strong></span></div><label class="switch"><input type="checkbox" id="toggle-2026" data-action="toggle-reform"><span class="slider"></span></label></div><div class="calc-inputs"><div class="calc-row"><label for="receita-input">📅 Receita Bruta Anual (R$/ano):</label><input id="receita-input" type="text" value="100.000" data-action="format-input"><label for="va-input">🛃 Valor Aduaneiro (VA / CIF):</label><input id="va-input" type="text" value="50.000" data-action="format-input"><span style="color:#1a6fbd;font-weight:600;">← 輸入預期年營業額與進口貨值 (自動千分位)</span></div></div><div class="sim-table-wrapper"><table class="sim-table" id="sim-table"><tr><th>制度</th><th>稅金組成與計算公式</th><th class="text-right">年度預估合計</th></tr><tr id="row-simples"><td><strong style="color:#e07b00;">Simples Nacional</strong></td><td id="sim-simples-detail" class="detail-cell">DAS = RB × 6%</td><td id="sim-simples-total" class="highlight num-col">–</td></tr><tr id="row-presumido"><td><strong style="color:#1a6fbd;">Lucro Presumido</strong><br><small style="font-weight:400;color:#888">始終為累積制 (Lei 9.718/98)</small></td><td id="sim-presumido-detail" class="detail-cell">PIS = RB × 0.65%<br>COFINS = RB × 3%<br>IRPJ/CSLL (預估)</td><td id="sim-presumido-total" class="highlight num-col">–</td></tr><tr id="row-real"><td><strong style="color:#1a8f4c;">Lucro Real</strong><br><small style="font-weight:400;color:#888">依套裝切換 (10.637/02, 10.833/03)</small></td><td id="sim-real-detail" class="detail-cell">依所選模式計算<br>IRPJ/CSLL (實際按30%毛利估算)</td><td id="sim-real-total" class="highlight num-col">–</td></tr></table></div><div class="import-formulas"><div class="formulas-header">🛃 Tributos na Importação — Fórmulas e Alíquotas (常駐參考)</div><table class="formulas-table"><tr><th>稅種</th><th>計算公式</th><th>參考稅率 (Air Fryer / NCM típico)</th></tr><tr><td><strong>II</strong><br><small>Imposto de Importação</small></td><td>Valor Aduaneiro (VA) × Alíq. II</td><td>10% – 20%（依 NCM）</td></tr><tr><td><strong>IPI</strong><br><small>Imp. s/ Prod. Industrializado</small></td><td>(VA + II) × Alíq. IPI</td><td>約 10%（eletrodomésticos）</td></tr><tr><td><strong>PIS<br>Importação</strong></td><td>VA × 2.10%</td><td>2.10%（geral）</td></tr><tr><td><strong>COFINS<br>Importação</strong></td><td>VA × 9.65%</td><td>9.65%（geral）</td></tr><tr><td><strong>ICMS</strong><br><small>Estadual (SP ref.)</small></td><td>(VA + II + IPI + PIS + COFINS) ÷ (1 − Alíq.) × Alíq.<br><small style="color:#aaa;">Base de cálculo "por dentro" (incluído no prezzo)</small></td><td>18% (SP) / 12%–20%（outros estados）</td></tr></table></div><p class="formulas-note">* Lucro Real: 稅率 30%、créditos PIS/COFINS 50% 估 | Adicional IRPJ (10% sobre lucro/base > R$ 240k/ano) 計算自動。</p></div>

## 三、全額 vs 低報：風險比較

<div class="comparison-container" id="comparison-container"><div class="comparison-header"><h3>📊 全額申報 vs 低報 核心差異</h3></div><div class="comparison-grid"><div class="comparison-card full-reporting" style="border-left:4px solid #1a8f4c;"><h4 style="color:#1a8f4c;">✅ 全額申報</h4><ul><li>合規通關，無罰款風險</li><li>可建立良好海關信用記錄</li><li>順利入駐電商平台（Mercado Livre、Shopee）</li><li>RADAR 評級不受影響</li><li>長期業務發展有利</li></ul><div class="risk-badge low">風險：低</div></div><div class="comparison-card low-reporting" style="border-left:4px solid #cf222e;"><h4 style="color:#cf222e;">⚠️ 低報風險</h4><ul><li>海關查驗機率大幅提高</li><li>補繳稅款 + 罰款 (75%-225%)</li><li>貨物可能被扣押</li><li>影響 RADAR 評級</li><li>嚴重者面臨刑事起訴</li></ul><div class="risk-badge high">風險：高</div></div></div><div class="penalty-table"><h4>📋 低報罰款級別</h4><table><tr><th>情節</th><th>罰款比例</th><th>說明</th></tr><tr><td>輕微</td><td>75%</td><td>低報金額較小，無故意瞞報意圖</td></tr><tr><td>中等</td><td>150%</td><td>有明顯低報跡象但非惡意</td></tr><tr><td>嚴重</td><td>225%</td><td>故意瞞報、偽造發票等惡意行為</td></tr></table></div></div>

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
