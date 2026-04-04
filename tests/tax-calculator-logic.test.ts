import { describe, it, expect, beforeEach } from 'vitest';
import {
  parseBR,
  formatBR,
  filterInput,
  calcReal,
  calcPresumido,
} from '../src/lib/tax-calculator';

// ── parseBR ──────────────────────────────────────────────
describe('parseBR — 巴西數字格式解析', () => {
  it('應解析帶千位分隔符的巴西格式 (5.000.000 → 5000000)', () => {
    expect(parseBR('5.000.000')).toBe(5000000);
  });

  it('應解析帶小數點的巴西格式 (1.234,56 → 1234.56)', () => {
    expect(parseBR('1.234,56')).toBeCloseTo(1234.56);
  });

  it('應解析純數字 (5000000 → 5000000)', () => {
    expect(parseBR('5000000')).toBe(5000000);
  });

  it('空字串應返回 0', () => {
    expect(parseBR('')).toBe(0);
  });

  it('無效輸入 (字母/符號) 應返回 0', () => {
    expect(parseBR('abc')).toBe(0);
    expect(parseBR('$$$')).toBe(0);
    expect(parseBR('R$ 5.000')).toBe(0);
  });

  it('應過濾輸入中的非數字字符後再解析', () => {
    expect(parseBR('5,000,000')).toBe(5); // 美式逗號被當小數點 → 5.000 → 5
  });
});

// ── formatBR ─────────────────────────────────────────────
describe('formatBR — 巴西數字格式格式化', () => {
  it('應將 5000000 格式化為 5.000.000', () => {
    expect(formatBR(5000000)).toBe('5.000.000');
  });

  it('應將 3500000 格式化為 3.500.000', () => {
    expect(formatBR(3500000)).toBe('3.500.000');
  });

  it('應將 300000 格式化為 300.000', () => {
    expect(formatBR(300000)).toBe('300.000');
  });

  it('應將 0 格式化為 0', () => {
    expect(formatBR(0)).toBe('0');
  });

  it('應處理小數 (1234.56 → 1.234,56)', () => {
    expect(formatBR(1234.56)).toBe('1.234,56');
  });
});

// ── filterInput ──────────────────────────────────────────
describe('filterInput — 輸入過濾', () => {
  it('應保留數字和點、逗號', () => {
    expect(filterInput('5.000.000')).toBe('5.000.000');
  });

  it('應移除字母', () => {
    expect(filterInput('5000abc')).toBe('5000');
  });

  it('應移除特殊符號 ($, %, #)', () => {
    expect(filterInput('R$ 5.000')).toBe('5.000');
  });

  it('應移除 emoji', () => {
    expect(filterInput('12345🔥')).toBe('12345');
  });

  it('空字串應返回空字串', () => {
    expect(filterInput('')).toBe('');
  });
});

// ── calcReal — Lucro Real 計算 ──────────────────────────
describe('calcReal — 實際利潤制稅額計算', () => {
  it('應計算標準案例 (營收500萬, 成本350萬, 進口稅30萬)', () => {
    const result = calcReal({ revenue: 5000000, cost: 3500000, importTax: 300000 });
    // profit = 5000000 - 3500000 = 1500000
    // irpjBase = 1500000 * 0.15 = 225000
    // irpjAdd = (1500000 - 240000) * 0.10 = 126000
    // csll = 1500000 * 0.09 = 135000
    // total = max(225000 + 126000 + 135000 - 300000, 0) = 186000
    expect(result.profit).toBe(1500000);
    expect(result.irpjBase).toBe(225000);
    expect(result.irpjAdd).toBe(126000);
    expect(result.csll).toBe(135000);
    expect(result.total).toBe(186000);
  });

  it('成本大於營收時，應稅利潤為 0，稅額為 0', () => {
    const result = calcReal({ revenue: 1000000, cost: 2000000, importTax: 0 });
    expect(result.profit).toBe(0);
    expect(result.total).toBe(0);
  });

  it('利潤未超過 24 萬時，不應有 IRPJ 附加', () => {
    const result = calcReal({ revenue: 500000, cost: 300000, importTax: 0 });
    // profit = 200000 (< 240000)
    expect(result.profit).toBe(200000);
    expect(result.irpjAdd).toBe(0);
    // irpjBase = 200000 * 0.15 = 30000
    // csll = 200000 * 0.09 = 18000
    // total = 30000 + 0 + 18000 = 48000
    expect(result.total).toBe(48000);
  });

  it('進口稅金應從總稅額中抵扣', () => {
    const result1 = calcReal({ revenue: 5000000, cost: 3500000, importTax: 0 });
    const result2 = calcReal({ revenue: 5000000, cost: 3500000, importTax: 300000 });
    expect(result2.total).toBe(result1.total - 300000);
  });

  it('進口稅金大於應稅額時，總稅額應為負數（退稅）', () => {
    // profit = 1500000, irpjBase = 225000, irpjAdd = 126000, csll = 135000
    // tax before credit = 486000
    // importTax = 600000 > 486000 → total = -114000 (退稅)
    const result = calcReal({ revenue: 5000000, cost: 3500000, importTax: 600000 });
    expect(result.total).toBe(-114000);
  });

  it('零利潤但有進口稅金時，總稅額應為負數（全額退稅）', () => {
    // profit = 0 → irpjBase = 0, irpjAdd = 0, csll = 0
    // importTax = 50000 → total = -50000
    const result = calcReal({ revenue: 1000000, cost: 1000000, importTax: 50000 });
    expect(result.total).toBe(-50000);
  });
});

// ── calcPresumido — Lucro Presumido 計算 ────────────────
describe('calcPresumido — 推定利潤制稅額計算', () => {
  it('應計算商貿類型 (營收500萬, 推定利潤率8%)', () => {
    const result = calcPresumido({ revenue: 5000000, type: 'commerce' });
    // base = 5000000 * 0.08 = 400000
    // irpj = 400000 * 0.15 = 60000
    // irpjAdd = (400000 - 240000) * 0.10 = 16000
    // csll = 400000 * 0.09 = 36000
    // total = 60000 + 16000 + 36000 = 112000
    expect(result.base).toBe(400000);
    expect(result.irpj).toBe(60000);
    expect(result.irpjAdd).toBe(16000);
    expect(result.csll).toBe(36000);
    expect(result.total).toBe(112000);
  });

  it('應計算服務類型 (營收500萬, 推定利潤率32%)', () => {
    const result = calcPresumido({ revenue: 5000000, type: 'service' });
    // base = 5000000 * 0.32 = 1600000
    // irpj = 1600000 * 0.15 = 240000
    // irpjAdd = (1600000 - 240000) * 0.10 = 136000
    // csll = 1600000 * 0.09 = 144000
    // total = 240000 + 136000 + 144000 = 520000
    expect(result.base).toBe(1600000);
    expect(result.irpj).toBe(240000);
    expect(result.irpjAdd).toBe(136000);
    expect(result.csll).toBe(144000);
    expect(result.total).toBe(520000);
  });

  it('推定利潤基數未超過 24 萬時，不應有 IRPJ 附加', () => {
    const result = calcPresumido({ revenue: 1000000, type: 'commerce' });
    // base = 1000000 * 0.08 = 80000 (< 240000)
    expect(result.base).toBe(80000);
    expect(result.irpjAdd).toBe(0);
  });
});
