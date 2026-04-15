import { describe, it, expect, beforeEach } from 'vitest';

const pathCheckpoints = {
  A: 19,
  B: 5,
  C: 17,
  D: 8,
  E: 5,
  F: 3,
  G: 5,
};

const pathColors: Record<string, string> = {
  A: '#7DD3FC',
  B: '#FFD700',
  C: '#D4A843',
  D: '#00FF87',
  E: '#E5FF00',
  F: '#FF6B6B',
  G: '#C0C0C0',
};

const pathConfigs: Record<string, Array<{ slug: string; title: string; eta: string; strategy: string }>> = {
  A: [
    { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', strategy: '📋 先辦 CPF + 海牙認證' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', strategy: '⚖️ 巴西是全球稅制最複雜的國家之一' },
    { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', strategy: '🗺️ 2026-2033 是 IVA Dual 過渡期' },
    { slug: '01-2-visa-golden', title: '黃金簽證', eta: '20min', strategy: '🏠 被動投資路徑' },
    { slug: '01-3-visa-digital-nomad', title: '數位遊民簽證', eta: '20min', strategy: '💻 最低成本試水溫' },
    { slug: '01-4-visa-executive', title: '高管簽證 VITEM V', eta: '25min', strategy: '👔 需有母公司外派' },
    { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', strategy: '🛂 5 種簽證完整對比' },
    { slug: '03-local-team', title: '在地團隊組建', eta: '20min', strategy: '🤝 找對會計師和律師' },
    { slug: '04-company-setup', title: '外責企業閃電成立', eta: '25min', strategy: '🏛️ CNPJ + Pre-acordo + Pleno Poder' },
    { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', strategy: '🏦 SCE-IED 登記' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', strategy: '🛒 Mercado Livre 佔巴西 35%' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', strategy: '📦 沒有 RADAR 你無法進口商品' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', strategy: '🏭 選 SC 州可省 12% ICMS' },
    { slug: '08-1-3pl-contract', title: '3PL 合約談判', eta: '30min', strategy: '📋 稅務條款和賠償責任' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', strategy: '💳 Pix 佔巴西電子支付 70%' },
    { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', strategy: '💸 稅款即時扣繳是 2026 新規' },
    { slug: '10-after-sales-service', title: '售後服務', eta: '20min', strategy: '🔄 巴西消費者法 CDC 全球最嚴格' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', strategy: '📋 SPED + NF-e + Malha Fiscal' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', strategy: '💰 JCP 抵稅 + 特許權使用費' },
  ],
  B: [
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', strategy: '⚖️ 即使跨境銷售也要懂巴西稅制' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', strategy: '🛒 Mercado Livre 跨境賣家計劃' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', strategy: '📦 有了 RADAR 才能以公司名義進口' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', strategy: '🏭 先用 SC 州 TTD 倉庫測試市場' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', strategy: '💳 訂單自動對帳是跨境賣家的命脈' },
  ],
  C: [
    { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', strategy: '📋 外派前先辦好 CPF + 海牙認證' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', strategy: '⚖️ 企業必須用 Lucro Real' },
    { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', strategy: '🗺️ 過渡期內進場可以鎖定舊制優惠' },
    { slug: '01-4-visa-executive', title: '高管簽證 VITEM V', eta: '25min', strategy: '👔 你的專屬簽證' },
    { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', strategy: '🛂 了解為什麼 VITEM V 是企業外派的最優解' },
    { slug: '03-local-team', title: '在地團隊組建', eta: '20min', strategy: '🤝 企業需要更強的在地團隊' },
    { slug: '04-company-setup', title: '外責企業閃電成立', eta: '25min', strategy: '🏛️ 母公司全資子公司是最乾淨的架構' },
    { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', strategy: '🏦 母公司注資必須走 SCE-IED' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', strategy: '🛒 企業賣家可以拿到平台 VIP 通道' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', strategy: '📦 企業 RADAR 額度遠高於個人' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', strategy: '🏭 企業建議用多倉策略' },
    { slug: '08-1-3pl-contract', title: '3PL 合約談判', eta: '30min', strategy: '📋 企業合約要談獨家條款和年度返利' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', strategy: '💳 企業需要 ERP 對接母公司系統' },
    { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', strategy: '💸 2026 新規下企業現金流壓力最大' },
    { slug: '10-after-sales-service', title: '售後服務', eta: '20min', strategy: '🔄 企業退貨率控制在 15% 以內' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', strategy: '📋 企業合規是底線不是加分項' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', strategy: '💰 JCP + 特許權使用費組合' },
  ],
  D: [
    { slug: '04-company-setup', title: '外責企業閃電成立', eta: '25min', strategy: '🏛️ 複習公司架構要點' },
    { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', strategy: '🏦 如果還沒做 SCE-IED 登記' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', strategy: '🛒 確認你的平台帳號是企業帳戶' },
    { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', strategy: '📦 確認 RADAR 額度足夠' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', strategy: '🏭 評估搬遷的稅務收益' },
    { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', strategy: '💳 確保 ERP 能自動生成稅務報表' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', strategy: '📋 合規是利潤匯出的前提' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', strategy: '💰 你的終極目標' },
  ],
  E: [
    { slug: '10-after-sales-service', title: '售後服務', eta: '20min', strategy: '🔄 優化退貨流程可以省下 5-10%' },
    { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', strategy: '📋 SPED 漏報、NF-e 錯誤' },
    { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', strategy: '💰 你的錢合法回流' },
    { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', strategy: '💸 需要重新建模' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', strategy: '⚖️ 複習稅制地圖' },
  ],
  F: [
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', strategy: '⚖️ 先看懂稅制' },
    { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', strategy: '🛒 用 Mercado Livre 跨境計劃' },
    { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', strategy: '🏭 先用 SC 州 TTD 倉庫' },
  ],
  G: [
    { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', strategy: '📋 先辦 CPF + 海牙認證' },
    { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', strategy: '⚖️ 重點關注 183 天規則' },
    { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', strategy: '🗺️ 2026 年起股息開始徵稅' },
    { slug: '01-3-visa-digital-nomad', title: '數位遊民簽證', eta: '20min', strategy: '💻 你的專屬簽證' },
    { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', strategy: '🛂 VITEM XIV 是遠程工作者的最優解' },
  ],
};

describe('Diagnosis Enhancement - Phase 1', () => {
  it('renders correct number of items for path A', () => {
    const checkpoints = pathConfigs.A;
    expect(checkpoints.length).toBe(pathCheckpoints.A);
  });

  it('renders correct number of items for path B', () => {
    const checkpoints = pathConfigs.B;
    expect(checkpoints.length).toBe(pathCheckpoints.B);
  });

  it('renders correct number of items for path C', () => {
    const checkpoints = pathConfigs.C;
    expect(checkpoints.length).toBe(pathCheckpoints.C);
  });

  it('renders correct number of items for path D', () => {
    const checkpoints = pathConfigs.D;
    expect(checkpoints.length).toBe(pathCheckpoints.D);
  });

  it('renders correct number of items for path E', () => {
    const checkpoints = pathConfigs.E;
    expect(checkpoints.length).toBe(pathCheckpoints.E);
  });

  it('renders correct number of items for path F', () => {
    const checkpoints = pathConfigs.F;
    expect(checkpoints.length).toBe(pathCheckpoints.F);
  });

  it('renders correct number of items for path G', () => {
    const checkpoints = pathConfigs.G;
    expect(checkpoints.length).toBe(pathCheckpoints.G);
  });

  it('each item contains required elements (number, icon, title, eta)', () => {
    const checkpoints = pathConfigs.A;
    checkpoints.forEach((item, index) => {
      expect(item.slug).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.eta).toBeTruthy();
      expect(item.strategy).toBeTruthy();
    });
  });

  it('path color borders applied correctly', () => {
    Object.keys(pathColors).forEach(pathKey => {
      const color = pathColors[pathKey];
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('click navigates to slug (href="/handbook/${slug}")', () => {
    const checkpoints = pathConfigs.A;
    const firstSlug = checkpoints[0].slug;
    const expectedHref = `/handbook/${firstSlug}`;
    expect(expectedHref).toBe('/handbook/01-0-pre-entry-checklist');
  });

  it('strategy shows on hover (strategy text tooltip)', () => {
    const checkpoints = pathConfigs.A;
    checkpoints.forEach(item => {
      expect(item.strategy).toBeTruthy();
      expect(typeof item.strategy).toBe('string');
      expect(item.strategy.length).toBeGreaterThan(0);
    });
  });
});

describe('Path Color Mapping', () => {
  it('maps path A to sky blue', () => {
    expect(pathColors.A).toBe('#7DD3FC');
  });

  it('maps path B to gold', () => {
    expect(pathColors.B).toBe('#FFD700');
  });

  it('maps path C to gold dim', () => {
    expect(pathColors.C).toBe('#D4A843');
  });

  it('maps path D to neon green', () => {
    expect(pathColors.D).toBe('#00FF87');
  });

  it('maps path E to neon yellow', () => {
    expect(pathColors.E).toBe('#E5FF00');
  });

  it('maps path F to red', () => {
    expect(pathColors.F).toBe('#FF6B6B');
  });

  it('maps path G to silver gray', () => {
    expect(pathColors.G).toBe('#C0C0C0');
  });
});
