import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const handbookDir = join(process.cwd(), 'src', 'content', 'handbook');
const dataDir = join(process.cwd(), 'src', 'data');
const stylesDir = join(process.cwd(), 'src', 'styles');

// ═══════════════════════════════════════════════════════
// TASK 1: 01-0-pre-entry-checklist.md — 入境前合規準備清單
// ═══════════════════════════════════════════════════════
describe('新增章節：01-0-pre-entry-checklist.md 入境前合規準備清單', () => {
  const mdPath = join(handbookDir, '01-0-pre-entry-checklist.md');

  describe('Frontmatter', () => {
    it('檔案應存在', () => {
      expect(existsSync(mdPath)).toBe(true);
    });

    it('phase 應為 preparation', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/phase:\s*["']?preparation["']?/);
    });

    it('order 應小於 01-tax-system.md 的 order（即最前面）', () => {
      const md = readFileSync(mdPath, 'utf-8');
      const orderMatch = md.match(/order:\s*(\d+)/);
      expect(orderMatch).toBeTruthy();
      expect(parseInt(orderMatch![1])).toBeLessThan(11);
    });

    it('應包含 CPF 相關 tags', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/CPF/);
    });
  });

  describe('寫作風格：因果連接', () => {
    it('應以因果連接開篇', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/因果連接/);
    });
  });

  describe('核心內容：CPF 線上申請', () => {
    it('應包含 CPF 申請步驟說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/CPF.*申請|Cadastro de Pessoas Físicas/);
    });

    it('應包含 CPF 申請所需文件清單', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/護照|Passaporte/);
      expect(md).toMatch(/Ficha Cadastral|個人資訊登記/);
    });
  });

  describe('核心內容：海牙認證 + 宣誓翻譯', () => {
    it('應包含海牙認證 (Apostila da Haia) 說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/海牙認證|Apostila/);
    });

    it('應包含宣誓翻譯 (Tradução Juramentada) 說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/宣誓翻譯|Tradução Juramentada/);
    });

    it('應強調正確順序：先海牙認證，後宣誓翻譯', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/先.*認證.*後.*翻譯|認證.*然後.*翻譯|順序/);
    });

    it('應包含宣誓翻譯計費標準（以 Lauda 為單位）', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Lauda|標準頁/);
    });
  });

  describe('核心內容：gov.br 數位帳號', () => {
    it('應包含 gov.br 門戶激活說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/gov\.br/);
    });
  });

  describe('核心內容：委託書 Procuração', () => {
    it('應包含委託書法定條款說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/Procuração|委託書/);
    });
  });

  describe('互動元素', () => {
    it('應包含 [關鍵決策] 檢查清單', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/\[關鍵決策\]/);
    });

    it('應包含 checkbox 檢查清單格式', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/- \[ \]/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 2: 01-4-visa-executive.md — 高管簽證 VITEM V 詳解
// ═══════════════════════════════════════════════════════
describe('新增章節：01-4-visa-executive.md 高管簽證 VITEM V', () => {
  const mdPath = join(handbookDir, '01-4-visa-executive.md');

  describe('Frontmatter', () => {
    it('檔案應存在', () => {
      expect(existsSync(mdPath)).toBe(true);
    });

    it('phase 應為 preparation', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/phase:\s*["']?preparation["']?/);
    });

    it('應包含 VITEM V 相關 tags', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/VITEM V|高管簽證/);
    });
  });

  describe('寫作風格：因果連接', () => {
    it('應以因果連接開篇', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/因果連接/);
    });
  });

  describe('核心內容：2026 最低工資影響', () => {
    it('應包含 2026 年最低工資 R$1,621 資訊', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/1,621|1621/);
    });
  });

  describe('核心內容：學歷認證', () => {
    it('應包含學位與職位相關性要求', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/學位.*職位|學歷.*相關|專業.*對/);
    });
  });

  describe('互動流程卡片（取代 Mermaid）', () => {
    it('應包含 visa-flow-card 容器', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/visa-flow-card|visa-flow-step|簽證流程卡片/);
    });

    it('應包含職位類型選擇（技術人員/中層管理/高管）', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/技術人員|中層管理|高管/);
    });

    it('應包含薪資門檻顯示', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/3,242|6,484|9,726/);
    });

    it('應包含學歷認證檢查點', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/學歷.*相關|學位.*對位|學歷檢查/);
    });

    it('應包含稅務居民判斷節點', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/183.*天|稅務居民/);
    });

    it('應包含永久居留節點', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/永久居留|永居/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 3: 02-visa-strategy.md — 簽證戰略與互動決策地圖
// ═══════════════════════════════════════════════════════
describe('更新章節：02-visa-strategy.md 簽證戰略', () => {
  const mdPath = join(handbookDir, '02-visa-strategy.md');

  describe('互動決策地圖', () => {
    it('應包含 decision-map 互動組件', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/decision-map|決策地圖/);
    });

    it('應包含決策樹邏輯（身份判斷）', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/自然人|法人|母公司/);
    });
  });

  describe('核心內容：五種簽證路徑', () => {
    it('應包含法定董事簽證 RN 11', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/法定董事|RN 11|RN11/);
    });

    it('應包含投資簽證 RN 36', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/投資簽證|RN 36|RN36/);
    });

    it('應包含黃金簽證', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/黃金簽證|Visto Gold/);
    });

    it('應包含數位遊民簽證', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/數位遊民|Digital Nomad/);
    });

    it('應包含高管簽證 VITEM V', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/高管簽證|VITEM V/);
    });
  });

  describe('核心內容：2026 關鍵變化', () => {
    it('應包含 183 天稅務居民規則', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/183.*天|183天/);
    });

    it('應包含 730 天離境註銷規則', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/730|兩年.*離境|連續.*出境/);
    });

    it('應包含 CRNM 行政延誤資訊', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/CRNM.*延誤|預約.*排期|聯邦警察/);
    });
  });

  describe('寫作風格', () => {
    it('應以因果連接開篇', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/因果連接/);
    });

    it('應包含 [關鍵決策] 檢查清單', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/\[關鍵決策\]/);
    });
  });

  describe('互動決策卡片（取代 Mermaid）', () => {
    it('應包含 decision-tree-card 或 visa-path-card 容器', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/decision-tree-card|visa-path-card|decision-flow-card|決策卡片/);
    });

    it('應包含自然人投資者路徑卡片', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/自然人.*投資者|自然人.*投資/);
    });

    it('應包含法人母公司路徑卡片', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/法人.*母公司|法人.*公司/);
    });

    it('應包含所有五種簽證路徑的卡片', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/法定董事.*RN 11|RN 11.*法定董事/);
      expect(md).toMatch(/投資簽證.*RN 36|RN 36.*投資簽證/);
      expect(md).toMatch(/黃金簽證|Visto Gold/);
      expect(md).toMatch(/數位遊民|VITEM XIV/);
      expect(md).toMatch(/高管簽證|VITEM V/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 4: 01-2-visa-golden.md — 黃金簽證更新（4年永居）
// ═══════════════════════════════════════════════════════
describe('更新章節：01-2-visa-golden.md 黃金簽證', () => {
  const mdPath = join(handbookDir, '01-2-visa-golden.md');

  describe('黃金簽證 4 年轉永居', () => {
    it('應明確說明黃金簽證滿 4 年后可申請永久居留', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/4.*年.*永久|四年.*永居|滿4年.*永久居留/);
    });

    it('應包含黃金簽證 vs 投資簽證對比表', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/黃金簽證.*投資簽證|投資簽證.*黃金簽證/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 5: 05-bacen-capital.md — SCE-IED (RDE-IED) 更新
// ═══════════════════════════════════════════════════════
describe('更新章節：05-bacen-capital.md SCE-IED 系統', () => {
  const mdPath = join(handbookDir, '05-bacen-capital.md');

  describe('SCE-IED (RDE-IED) 命名規範', () => {
    it('應使用 SCE-IED (RDE-IED) 表達方式', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/SCE-IED.*RDE-IED|RDE-IED.*SCE-IED/);
    });

    it('不應單獨使用舊的 RDE-IED 而無 SCE-IED 說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      // 如果出現 RDE-IED，必須同時出現 SCE-IED
      const hasRDE = md.includes('RDE-IED');
      const hasSCE = md.includes('SCE-IED');
      if (hasRDE) {
        expect(hasSCE).toBe(true);
      }
    });
  });

  describe('2024 年 10 月規則變化', () => {
    it('應包含 30 天規則取消的說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/30.*天.*取消|取消.*30|不再.*30|定期申報/);
    });

    it('應包含定期申報門檻（年度/季度/五年）', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/年度.*申報|季度.*申報|五年.*申報|Quinquenal/);
    });
  });

  describe('gov.br 集成', () => {
    it('應包含 gov.br 帳號登入說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/gov\.br/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 6: 12-profit-remittance.md — SCE-IED 利潤匯回
// ═══════════════════════════════════════════════════════
describe('更新章節：12-profit-remittance.md 利潤匯回', () => {
  const mdPath = join(handbookDir, '12-profit-remittance.md');

  describe('SCE-IED (RDE-IED) 命名規範', () => {
    it('應使用 SCE-IED (RDE-IED) 表達方式', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/SCE-IED.*RDE-IED|RDE-IED.*SCE-IED/);
    });
  });

  describe('利潤匯回 SCE-IED 操作', () => {
    it('應包含 SCE-IED 代碼與匯兌合約連結說明', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/匯兌.*合約|Câmbio.*TIR|代碼.*連結/);
    });

    it('應包含 $100K 門檻規則', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/100,000|10萬|100K|門檻/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 7: glossary.ts — 新增詞彙條目
// ═══════════════════════════════════════════════════════
describe('更新詞典：glossary.ts 新增條目', () => {
  const glossaryPath = join(dataDir, 'glossary.ts');
  const glossary = readFileSync(glossaryPath, 'utf-8');

  describe('簽證相關新條目', () => {
    it('應包含 CRNM 條目', () => {
      expect(glossary).toMatch(/term:\s*['"]CRNM['"]/);
    });

    it('應包含 VITEM V 條目', () => {
      expect(glossary).toMatch(/term:\s*['"]VITEM V['"]/);
    });

    it('應包含 VITEM XIV 條目', () => {
      expect(glossary).toMatch(/term:\s*['"]VITEM XIV['"]/);
    });

    it('應包含 CNIg 條目', () => {
      expect(glossary).toMatch(/term:\s*['"]CNIg['"]/);
    });
  });

  describe('文件認證相關新條目', () => {
    it('應包含 Apostila da Haia（海牙認證）條目', () => {
      expect(glossary).toMatch(/Apostila.*Haia|海牙認證/);
    });

    it('應包含 Tradução Juramentada（宣誓翻譯）條目', () => {
      expect(glossary).toMatch(/Tradução.*Juramentada|宣誓翻譯/);
    });
  });

  describe('系統相關新條目', () => {
    it('應包含 SCE-IED (RDE-IED) 條目', () => {
      expect(glossary).toMatch(/SCE-IED|RDE-IED/);
    });

    it('應包含 MigranteWeb 條目', () => {
      expect(glossary).toMatch(/term:\s*['"]MigranteWeb['"]/);
    });

    it('應包含 gov.br 條目', () => {
      expect(glossary).toMatch(/term:\s*['"]gov\.br['"]/);
    });
  });

  describe('法律相關新條目', () => {
    it('應包含 Procuração（委託書）條目', () => {
      expect(glossary).toMatch(/term:\s*['"]Procuração['"]/);
    });

    it('應包含 Mandatário（受託代表人）條目', () => {
      expect(glossary).toMatch(/term:\s*['"]Mandatário['"]/);
    });
  });

  describe('稅務相關新條目', () => {
    it('應包含 IRPFM（最低所得稅）條目', () => {
      expect(glossary).toMatch(/term:\s*['"]IRPFM['"]/);
    });

    it('應包含 INSS（社會保障金）條目', () => {
      expect(glossary).toMatch(/term:\s*['"]INSS['"]/);
    });
  });
});

// ═══════════════════════════════════════════════════════
// TASK 8: global.css — 決策地圖樣式
// ═══════════════════════════════════════════════════════
describe('決策地圖 CSS 樣式', () => {
  const cssPath = join(stylesDir, 'global.css');
  const css = readFileSync(cssPath, 'utf-8');

  it('應定義 .decision-map 容器樣式', () => {
    expect(css).toMatch(/\.decision-map/);
  });

  it('應定義 .decision-map-option 選項按鈕樣式', () => {
    expect(css).toMatch(/\.decision-map-option|\.dm-option/);
  });

  it('應定義 .decision-map-result 結果展示樣式', () => {
    expect(css).toMatch(/\.decision-map-result|\.dm-result/);
  });
});
