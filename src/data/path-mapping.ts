// ── Persona 角色扮演系統：路徑映射數據 ─────────────────────
// 6 條戰略路徑 × 19 篇文章的完整映射
// 顧問原則：每條路徑只出現一種簽證（移民征途除外，因為需要對比選擇）

export interface Checkpoint {
  slug: string;
  title: string;
  eta: string;
  difficulty: number;
  strategy: string;
}

export interface PathInfo {
  name: string;
  checkpoints: number;
  hours: number;
}

// ═══════════════════════════════════════════
// 6 條路徑配置
// ═══════════════════════════════════════════

export const pathConfigs: Record<string, Checkpoint[]> = {
  // ═══════════════════════════════════════════
  // 路徑 A：移民征途（19 關）
  // 適合：個人投資者 + 移民定居 + 零基礎/準備中
  // 簽證策略：需要展示所有選項讓讀者對比選擇
  // ═══════════════════════════════════════════
  A: [
    { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', difficulty: 1, strategy: '📋 先辦 CPF + 海牙認證，沒有這些你連銀行都開不了戶' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2, strategy: '⚖️ 巴西是全球稅制最複雜的國家之一，先看懂地圖再出發' },
    { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', difficulty: 2, strategy: '🗺️ 2026-2033 是 IVA Dual 過渡期，現在進場有先行者優勢' },
    { slug: '01-2-visa-golden', title: '黃金簽證', eta: '20min', difficulty: 1, strategy: '🏠 被動投資路徑：買房即可，每 2 年只需入境 14 天，4 年轉永居' },
    { slug: '01-3-visa-digital-nomad', title: '數位遊民簽證', eta: '20min', difficulty: 1, strategy: '💻 最低成本試水溫：月收入 USD 1,500 即可，但 183 天觸發稅務居民' },
    { slug: '01-4-visa-executive', title: '高管簽證 VITEM V', eta: '25min', difficulty: 2, strategy: '👔 需有母公司外派：最快審批，但學位必須與職位匹配' },
    { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', difficulty: 3, strategy: '🛂 5 種簽證完整對比，選錯路徑可能浪費 2 年以上時間' },
    { slug: '03-local-team', title: '在地團隊組建', eta: '20min', difficulty: 2, strategy: '🤝 找對會計師和律師比選簽證更重要——他們決定你的合規底線' },
    { slug: '04-company-setup', title: '外資企業閃電成立', eta: '25min', difficulty: 3, strategy: '🏛️ CNPJ + Pre-acordo + Pleno Poder，三步到位' },
    { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', difficulty: 3, strategy: '🏦 SCE-IED 登記是合法匯款的唯一通道，漏掉這步資金進得來出不去' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', difficulty: 2, strategy: '🛒 Mercado Livre 佔巴西 35% 市佔，但 Amazon 和 Shopee 也在快速成長' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', difficulty: 3, strategy: '📦 沒有 RADAR 你無法進口商品，這是供應鏈的敲門磚' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', difficulty: 2, strategy: '🏭 選 SC 州可省 12% ICMS，但尾程時效可能慢 2-3 天' },
    { slug: '08-1-3pl-contract', title: '3PL 合約談判', eta: '30min', difficulty: 3, strategy: '📋 稅務條款和賠償責任是談判核心，標準合約對你極度不利' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', difficulty: 3, strategy: '💳 Pix 佔巴西電子支付 70%，不支持 Pix 等於放棄一半市場' },
    { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', difficulty: 3, strategy: '💸 稅款即時扣繳是 2026 新規，現金流規劃不當可能導致資金鏈斷裂' },
    { slug: '10-after-sales-service', title: '售後服務', eta: '20min', difficulty: 2, strategy: '🔄 巴西消費者法 CDC 全球最嚴格，退貨率是一般市場的 3 倍' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', difficulty: 4, strategy: '📋 SPED + NF-e + Malha Fiscal，漏報一次罰款可能吃掉整月利潤' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', difficulty: 5, strategy: '💰 JCP 抵稅 + 特許權使用費，組合使用可將匯出稅率從 34% 降至 15%' },
  ],

  // ═══════════════════════════════════════════
  // 路徑 B：閃電出海（5 關）
  // 適合：跨境賣家 + 快速試水 + 零基礎
  // 簽證策略：不需要簽證（人在巴西境外，貨到巴西）
  // ═══════════════════════════════════════════
  B: [
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2, strategy: '⚖️ 即使跨境銷售也要懂巴西稅制，Lucro Presumido 最適合初期試水' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', difficulty: 2, strategy: '🛒 Mercado Livre 跨境賣家計劃是最低門檻入場方式' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', difficulty: 3, strategy: '📦 有了 RADAR 才能以公司名義進口，個人進口額度有限' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', difficulty: 2, strategy: '🏭 先用 SC 州 TTD 倉庫測試市場反應，確認銷量再擴大' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', difficulty: 3, strategy: '💳 訂單自動對帳是跨境賣家的命脈，手動處理出錯率太高' },
  ],

  // ═══════════════════════════════════════════
  // 路徑 C：企業遠征（17 關）
  // 適合：企業派出 + 規模擴張 + 準備中
  // 簽證策略：只有高管簽證 VITEM V（有母公司外派）
  // ═══════════════════════════════════════════
  C: [
    { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', difficulty: 1, strategy: '📋 外派前先辦好 CPF + 海牙認證，避免到了巴西卡在文件' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2, strategy: '⚖️ 企業必須用 Lucro Real，稅務規劃空間比想像中大' },
    { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', difficulty: 2, strategy: '🗺️ 過渡期內進場可以鎖定舊制優惠，時間窗口正在關閉' },
    { slug: '01-4-visa-executive', title: '高管簽證 VITEM V', eta: '25min', difficulty: 2, strategy: '👔 你的專屬簽證：母公司外派 + 學位匹配 + 薪資門檻，三步搞定' },
    { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', difficulty: 3, strategy: '🛂 了解為什麼 VITEM V 是企業外派的最優解，以及其他路徑的劣勢' },
    { slug: '03-local-team', title: '在地團隊組建', eta: '20min', difficulty: 2, strategy: '🤝 企業需要更強的在地團隊：會計師 + 律師 + 人力資源顧問' },
    { slug: '04-company-setup', title: '外資企業閃電成立', eta: '25min', difficulty: 3, strategy: '🏛️ 母公司全資子公司是最乾淨的架構，避免合夥糾紛' },
    { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', difficulty: 3, strategy: '🏦 母公司注資必須走 SCE-IED，這是未來利潤匯出的法律基礎' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', difficulty: 2, strategy: '🛒 企業賣家可以拿到平台 VIP 通道，流量和佣金都有優勢' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', difficulty: 3, strategy: '📦 企業 RADAR 額度遠高於個人，可以支撐大規模進口' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', difficulty: 2, strategy: '🏭 企業建議用多倉策略：SC 州省稅 + SP 州提速' },
    { slug: '08-1-3pl-contract', title: '3PL 合約談判', eta: '30min', difficulty: 3, strategy: '📋 企業合約要談獨家條款和年度返利，標準合約虧太多' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', difficulty: 3, strategy: '💳 企業需要 ERP 對接母公司系統，數據透明是合規基礎' },
    { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', difficulty: 3, strategy: '💸 2026 新規下企業現金流壓力最大，必須提前建模' },
    { slug: '10-after-sales-service', title: '售後服務', eta: '20min', difficulty: 2, strategy: '🔄 企業退貨率控制在 15% 以內是健康線，超過需要檢討選品' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', difficulty: 4, strategy: '📋 企業合規是底線不是加分項，一次罰款可能影響母公司審計' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', difficulty: 5, strategy: '💰 母公司最關心的環節：JCP + 特許權使用費組合可合法降低 50% 匯出稅' },
  ],

  // ═══════════════════════════════════════════
  // 路徑 D：落地加速（8 關）
  // 適合：已落地（簽證/公司已搞定）+ 利潤匯回
  // 簽證策略：不需要簽證（已經有了）
  // ═══════════════════════════════════════════
  D: [
    { slug: '04-company-setup', title: '外資企業閃電成立', eta: '25min', difficulty: 3, strategy: '🏛️ 複習公司架構要點，確認你的 CNPJ 和 Pleno Poder 沒有遺漏' },
    { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', difficulty: 3, strategy: '🏦 如果還沒做 SCE-IED 登記，現在補做還來得及——這是匯出的前提' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', difficulty: 2, strategy: '🛒 確認你的平台帳號是企業帳戶，個人帳戶無法合法匯出利潤' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', difficulty: 3, strategy: '📦 確認 RADAR 額度足夠支撐你的進口規模，不夠就申請升級' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', difficulty: 2, strategy: '🏭 如果倉庫不在 SC 州，評估搬遷的稅務收益是否大於搬遷成本' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', difficulty: 3, strategy: '💳 確保 ERP 能自動生成稅務報表，手動報表出錯率太高' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', difficulty: 4, strategy: '📋 合規是利潤匯出的前提，稅務局不會放行有欠稅的企業' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', difficulty: 5, strategy: '💰 你的終極目標：JCP 抵稅 + 特許權使用費，組合拳將稅率壓到最低' },
  ],

  // ═══════════════════════════════════════════
  // 路徑 E：運營優化（5 關）
  // 適合：運營中 + 利潤匯回
  // 簽證策略：不需要簽證（已經在運營了）
  // ═══════════════════════════════════════════
  E: [
    { slug: '10-after-sales-service', title: '售後服務', eta: '20min', difficulty: 2, strategy: '🔄 優化退貨流程可以省下 5-10% 的營收，這是被忽視的利潤池' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', difficulty: 4, strategy: '📋 運營中最容易出問題的環節：SPED 漏報、NF-e 錯誤、Malha Fiscal 紅線' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', difficulty: 5, strategy: '💰 你已經在賺錢了，現在是時候讓錢合法回流——JCP + 特許權使用費' },
    { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', difficulty: 3, strategy: '💸 2026 新規下你的現金流模型可能已經過時，需要重新建模' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2, strategy: '⚖️ 複習稅制地圖，確認你當初選擇的 Lucro Real/Presumido 仍然是最優解' },
  ],

  // ═══════════════════════════════════════════
  // 路徑 F：試水偵察（3 關）
  // 適合：跨境賣家 + 快速試水 + 零基礎
  // 簽證策略：不需要簽證（人在巴西境外，純跨境測試）
  // ═══════════════════════════════════════════
  F: [
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2, strategy: '⚖️ 先看懂稅制再決定是否值得進入——巴西市場大但稅務成本也高' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', difficulty: 2, strategy: '🛒 用 Mercado Livre 跨境計劃最低成本測試，不需要先註冊巴西公司' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', difficulty: 2, strategy: '🏭 先用 SC 州 TTD 倉庫小批量測試，確認銷量再考慮擴大投資' },
  ],

  // ═══════════════════════════════════════════
  // 路徑 G：數位遊民征途（5 關）
  // 適合：遠程工作者 + 境外收入
  // 簽證策略：只有 VITEM XIV 數位遊民簽證
  // 不包含企業營運內容（數位遊民不可在巴西境內工作）
  // ═══════════════════════════════════════════
  G: [
    { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', difficulty: 1, strategy: '📋 先辦 CPF + 海牙認證，數位遊民入境必備' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2, strategy: '⚖️ 重點關注 183 天規則——停留超過 183 天你的全球所得都要向巴西申報' },
    { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', difficulty: 2, strategy: '🗺️ 2026 年起股息開始徵稅 10%，你的境外收入可能受影響' },
    { slug: '01-3-visa-digital-nomad', title: '數位遊民簽證', eta: '20min', difficulty: 1, strategy: '💻 你的專屬簽證：月收入 USD 1,500 即可，1 年可續簽，但 183 天觸發稅務居民' },
    { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', difficulty: 3, strategy: '🛂 了解為什麼 VITEM XIV 是遠程工作者的最優解，以及轉其他簽證的路徑' },
  ],
};

// ═══════════════════════════════════════════
// 路徑信息摘要
// ═══════════════════════════════════════════

export const pathInfo: Record<string, PathInfo> = {
  A: { name: '🛡️ 移民征途', checkpoints: 19, hours: 8 },
  B: { name: '🚀 閃電出海', checkpoints: 5, hours: 2.5 },
  C: { name: '🏗️ 企業遠征', checkpoints: 17, hours: 6 },
  D: { name: '⚡ 落地加速', checkpoints: 8, hours: 4 },
  E: { name: '🔧 運營優化', checkpoints: 5, hours: 2.5 },
  F: { name: '🎯 試水偵察', checkpoints: 3, hours: 1.5 },
  G: { name: '💻 數位遊民征途', checkpoints: 5, hours: 2 },
};

// ═══════════════════════════════════════════
// 診斷映射表：身份 × 目標 × 進度 → 路徑
// 顧問邏輯：
// - 個人投資者 + 移民 → A（需要對比所有簽證）
// - 個人投資者 + 其他 → 根據進度決定
// - 企業派出 → 只有 VITEM V，走 C 路徑
// - 跨境賣家 + 試水 → F（不需要簽證）
// - 跨境賣家 + 認真做 → B 或 C
// ═══════════════════════════════════════════

export const diagnosisMap: Record<string, string> = {
  // ── 個人投資者 ──
  // 想移民：需要對比所有簽證選項 → A
  'individual-immigration-beginner': 'A',
  'individual-immigration-preparing': 'A',
  // 已經落地有簽證：跳過簽證，直接進入企業運營 → D
  'individual-immigration-landed': 'D',
  // 已經在運營：優化 + 匯出 → E
  'individual-immigration-operating': 'E',

  // 想賺巴西錢匯回：需要完整路徑 → A
  'individual-profit-beginner': 'A',
  'individual-profit-preparing': 'A',
  'individual-profit-landed': 'D',
  'individual-profit-operating': 'E',

  // 想規模擴張：需要企業級路徑 → C（有母公司或打算成立公司）
  'individual-expansion-beginner': 'A',
  'individual-expansion-preparing': 'C',
  'individual-expansion-landed': 'D',
  'individual-expansion-operating': 'E',

  // 快速試水：最低成本測試 → F
  'individual-testing-beginner': 'F',
  'individual-testing-preparing': 'F',
  // 已經落地想測試跨境銷售 → B
  'individual-testing-landed': 'B',
  'individual-testing-operating': 'E',

  // ── 遠程工作者 ──
  // 遠程工作者 → 只有數位遊民路徑 G
  'remoteworker-immigration-beginner': 'G',
  'remoteworker-immigration-preparing': 'G',
  'remoteworker-immigration-landed': 'D',
  'remoteworker-immigration-operating': 'E',
  'remoteworker-profit-beginner': 'G',
  'remoteworker-profit-preparing': 'G',
  'remoteworker-profit-landed': 'D',
  'remoteworker-profit-operating': 'E',
  'remoteworker-expansion-beginner': 'G',
  'remoteworker-expansion-preparing': 'G',
  'remoteworker-expansion-landed': 'D',
  'remoteworker-expansion-operating': 'E',
  'remoteworker-testing-beginner': 'G',
  'remoteworker-testing-preparing': 'G',
  'remoteworker-testing-landed': 'D',
  'remoteworker-testing-operating': 'E',

  // ── 企業派出（有母公司） ──
  // 企業只有 VITEM V 一條簽證路徑 → C
  'corporate-immigration-beginner': 'C',
  'corporate-immigration-preparing': 'C',
  'corporate-immigration-landed': 'D',
  'corporate-immigration-operating': 'E',
  'corporate-profit-beginner': 'C',
  'corporate-profit-preparing': 'C',
  'corporate-profit-landed': 'D',
  'corporate-profit-operating': 'E',
  'corporate-expansion-beginner': 'C',
  'corporate-expansion-preparing': 'C',
  'corporate-expansion-landed': 'D',
  'corporate-expansion-operating': 'E',
  // 企業想試水：先做跨境測試 → B
  'corporate-testing-beginner': 'F',
  'corporate-testing-preparing': 'B',
  'corporate-testing-landed': 'D',
  'corporate-testing-operating': 'E',

  // ── 跨境賣家（人在巴西境外） ──
  // 想移民：需要個人簽證路徑 → A
  'crossborder-immigration-beginner': 'A',
  'crossborder-immigration-preparing': 'A',
  'crossborder-immigration-landed': 'D',
  'crossborder-immigration-operating': 'E',
  // 想賺巴西錢匯回：需要建立公司 → C
  'crossborder-profit-beginner': 'C',
  'crossborder-profit-preparing': 'C',
  'crossborder-profit-landed': 'D',
  'crossborder-profit-operating': 'E',
  // 想規模擴張：企業級路徑 → C
  'crossborder-expansion-beginner': 'C',
  'crossborder-expansion-preparing': 'C',
  'crossborder-expansion-landed': 'D',
  'crossborder-expansion-operating': 'E',
  // 快速試水：純跨境測試，不需要簽證 → F
  'crossborder-testing-beginner': 'F',
  'crossborder-testing-preparing': 'F',
  'crossborder-testing-landed': 'B',
  'crossborder-testing-operating': 'E',
};
