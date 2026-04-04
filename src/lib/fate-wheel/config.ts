import type { PhaseConfig, DirectionConfig, QuestionConfig } from './types';

export const phases: PhaseConfig[] = [
  {
    id: 1, name: '戰略藍圖與落地籌備', icon: '🚩',
    color: '#E8E4D9', colorRgb: '232, 228, 217',
    radius: 4.0, orbitPeriod: 60, slug: 'preparation',
    articleCount: 8, timeRange: '第 1~2 個月',
    desc: '破譯巴西稅制、簽證策略、在地團隊組建與授權防護',
  },
  {
    id: 2, name: '實體建立與資金血脈', icon: '🏛️',
    color: '#D4A843', colorRgb: '212, 168, 67',
    radius: 4.0, orbitPeriod: 45, slug: 'foundation',
    articleCount: 3, timeRange: '第 2~4 個月',
    desc: 'CNPJ 申請、Pre-acordo 策略、BACEN 資金申報',
  },
  {
    id: 3, name: '供應鏈與數位營運', icon: '📦',
    color: '#E5FF00', colorRgb: '229, 255, 0',
    radius: 4.0, orbitPeriod: 35, slug: 'operations',
    articleCount: 6, timeRange: '第 4~5 個月',
    desc: 'RADAR 申請、3PL 倉儲、ERP 整合、支付系統',
  },
  {
    id: 4, name: '財務合規與利潤收割', icon: '💰',
    color: '#00FF87', colorRgb: '0, 255, 135',
    radius: 4.0, orbitPeriod: 25, slug: 'harvest',
    articleCount: 3, timeRange: '第 6 個月+',
    desc: '日常稅務合規、NF-e、SPED 申報、利潤匯出',
  },
];

export const directions: DirectionConfig[] = [
  { id: 'north', name: '偵察兵', phase: 'Preparation', desc: '還在觀望、想了解巴西', color: '#7DD3FC', angle: 0 },
  { id: 'east', name: '奠基者', phase: 'Foundation', desc: '已決定進入、建實體', color: '#D4A843', angle: Math.PI / 2 },
  { id: 'south', name: '領航員', phase: 'Operations', desc: '已註冊、打通供應鏈', color: '#00FF87', angle: Math.PI },
  { id: 'west', name: '收割者', phase: 'Harvest', desc: '在運營、合規與利潤', color: '#E5FF00', angle: (3 * Math.PI) / 2 },
];

export const questions: QuestionConfig[] = [
  {
    id: 1, title: '你的身份是？',
    options: [
      { value: 'individual', icon: '🧑‍💼', title: '個人投資者', desc: '以個人身份投資巴西' },
      { value: 'corporate', icon: '🏢', title: '企業派出', desc: '代表公司開拓巴西市場' },
      { value: 'crossborder', icon: '🌐', title: '跨境賣家', desc: '人在巴西境外，貨到巴西' },
      { value: 'remoteworker', icon: '💻', title: '遠程工作者', desc: '收入來自巴西境外' },
    ],
  },
  {
    id: 2, title: '你的終極目標是？',
    options: [
      { value: 'profit', icon: '💰', title: '利潤匯回', desc: '賺巴西的錢，匯回母國' },
      { value: 'immigration', icon: '🏠', title: '移民定居', desc: '拿到身份，在巴西生活' },
      { value: 'expansion', icon: '📦', title: '規模擴張', desc: '把巴西當作拉美樞紐' },
      { value: 'testing', icon: '🎯', title: '快速試水', desc: '最小成本測試市場' },
    ],
  },
  {
    id: 3, title: '你目前的進度是？',
    options: [
      { value: 'beginner', icon: '🔵', title: '零基礎', desc: '還在了解階段' },
      { value: 'preparing', icon: '🟡', title: '準備中', desc: '已決定要做，正在籌備' },
      { value: 'landed', icon: '🟢', title: '已落地', desc: '公司/簽證已搞定' },
      { value: 'operating', icon: '🟣', title: '運營中', desc: '已有銷售，需要優化' },
    ],
  },
];
