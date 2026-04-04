// ── Brazilian number parsing ──────────────────────────────
// Dots = thousands separators, comma = decimal separator

export const parseBR = (val: string): number => {
  const cleaned = val.replace(/\./g, '').replace(/,/g, '.');
  return parseFloat(cleaned) || 0;
};

// ── Brazilian number formatting ───────────────────────────
// 5000000 → "5.000.000"

export const formatBR = (n: number): string => {
  return n.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

// ── Input filtering ──────────────────────────────────────
// Remove everything except digits, dots, and commas

export const filterInput = (val: string): string => {
  return val.replace(/[^0-9.,]/g, '');
};

// ── Lucro Real calculation ────────────────────────────────

export interface RealInputs {
  revenue: number;
  cost: number;
  importTax: number;
}

export interface RealResult {
  profit: number;
  irpjBase: number;
  irpjAdd: number;
  csll: number;
  total: number;
}

export const calcReal = (inputs: RealInputs): RealResult => {
  const profit = Math.max(inputs.revenue - inputs.cost, 0);
  const irpjBase = profit * 0.15;
  const irpjAdd = profit > 240000 ? (profit - 240000) * 0.1 : 0;
  const csll = profit * 0.09;
  const total = irpjBase + irpjAdd + csll - inputs.importTax;

  return { profit, irpjBase, irpjAdd, csll, total };
};

// ── Lucro Presumido calculation ───────────────────────────

export interface PresumidoInputs {
  revenue: number;
  type: 'commerce' | 'service';
}

export interface PresumidoResult {
  base: number;
  irpj: number;
  irpjAdd: number;
  csll: number;
  total: number;
}

export const calcPresumido = (inputs: PresumidoInputs): PresumidoResult => {
  const rate = inputs.type === 'commerce' ? 0.08 : 0.32;
  const base = inputs.revenue * rate;
  const irpj = base * 0.15;
  const irpjAdd = base > 240000 ? (base - 240000) * 0.1 : 0;
  const csll = base * 0.09;
  const total = irpj + irpjAdd + csll;

  return { base, irpj, irpjAdd, csll, total };
};
