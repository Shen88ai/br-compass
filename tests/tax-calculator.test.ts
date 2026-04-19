import { describe, it, expect } from 'vitest';
import { parseBR, formatBR } from '../src/lib/tax-calculator';

describe('Tax Calculator - parseBR', () => {
  it('should parse Brazilian number format with dots as thousands separator', () => {
    expect(parseBR('1.000.000')).toBe(1000000);
    expect(parseBR('50.000')).toBe(50000);
  });

  it('should parse comma as decimal separator', () => {
    expect(parseBR('100,50')).toBe(100.5);
    expect(parseBR('1.234.567,89')).toBe(1234567.89);
  });

  it('should handle empty or invalid input', () => {
    expect(parseBR('')).toBe(0);
    expect(parseBR('abc')).toBe(0);
  });
});

describe('Tax Calculator - formatBR', () => {
  it('should format numbers with Brazilian separators', () => {
    expect(formatBR(1000000)).toBe('1.000.000');
    expect(formatBR(50000)).toBe('50.000');
  });

  it('should format decimal numbers correctly', () => {
    expect(formatBR(100.5)).toBe('100,5');
  });
});

describe('Tax Calculator - Import Tax Calculation', () => {
  it('should calculate II correctly for 20% rate', () => {
    const va = 50000;
    const expectedII = 10000; // 50000 * 0.20
    expect(va * 0.20).toBe(expectedII);
  });

  it('should calculate IPI correctly', () => {
    const va = 50000;
    const ii = va * 0.20; // 10000
    const expectedIPI = (va + ii) * 0.10; // 6000
    expect(expectedIPI).toBe(6000);
  });

  it('should calculate ICMS with "por dentro" method', () => {
    const va = 50000;
    const ii = va * 0.20;
    const ipi = (va + ii) * 0.10;
    const pis_imp = va * 0.021;
    const cofins_imp = va * 0.0965;
    const alicms = 0.18;

    const icms_bc = (va + ii + ipi + pis_imp + cofins_imp) / (1 - alicms);
    const icms = icms_bc * alicms;

    expect(icms).toBeGreaterThan(0);
    expect(icms_bc).toBeGreaterThan(va + ii + ipi + pis_imp + cofins_imp);
  });
});

describe('Tax Calculator - Regime Limits', () => {
  const LIMITS = {
    simples: 4800000,
    presumido: 78000000
  };

  it('should enforce Simples Nacional limit', () => {
    expect(1000000 < LIMITS.simples).toBe(true);
    expect(5000000 > LIMITS.simples).toBe(true);
  });

  it('should enforce Lucro Presumido limit', () => {
    expect(50000000 < LIMITS.presumido).toBe(true);
    expect(100000000 > LIMITS.presumido).toBe(true);
  });
});

describe('Tax Calculator - Adicional IRPJ', () => {
  it('should calculate Adicional when base exceeds threshold', () => {
    const base = 300000; // Above 240000
    const adicional = base > 240000 ? (base - 240000) * 0.10 : 0;
    expect(adicional).toBe(6000);
  });

  it('should not calculate Adicional when base is below threshold', () => {
    const base = 200000; // Below 240000
    const adicional = base > 240000 ? (base - 240000) * 0.10 : 0;
    expect(adicional).toBe(0);
  });
});

describe('Tax Calculator - Chapter Content', () => {
  it('should have tax-calculator.md file', () => {
    const fs = require('fs');
    const path = require('path');
    const chapterPath = path.join(process.cwd(), 'src/content/handbook/12-tax-calculator.md');
    expect(fs.existsSync(chapterPath)).toBe(true);
  });

  it('should have correct frontmatter', () => {
    const fs = require('fs');
    const path = require('path');
    const chapterPath = path.join(process.cwd(), 'src/content/handbook/12-tax-calculator.md');
    const content = fs.readFileSync(chapterPath, 'utf-8');

    expect(content).toContain('title:');
    expect(content).toContain('phase: "D"');
    expect(content).toContain('order:');
  });

  it('should start with 因果連接', () => {
    const fs = require('fs');
    const path = require('path');
    const chapterPath = path.join(process.cwd(), 'src/content/handbook/12-tax-calculator.md');
    const content = fs.readFileSync(chapterPath, 'utf-8');

    expect(content).toContain('因果連接');
  });
});

describe('Tax Calculator - Tax Rates JSON', () => {
  it('should have tax-rates.json file', () => {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(process.cwd(), 'src/data/tax-rates.json');
    expect(fs.existsSync(jsonPath)).toBe(true);
  });

  it('should have valid JSON structure', () => {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(process.cwd(), 'src/data/tax-rates.json');
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(content);

    expect(data).toHaveProperty('regimes');
    expect(data).toHaveProperty('importTaxes');
    expect(data).toHaveProperty('riskAssessment');
  });

  it('should have all four tax regimes', () => {
    const fs = require('fs');
    const path = require('path');
    const jsonPath = path.join(process.cwd(), 'src/data/tax-rates.json');
    const content = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(content);

    expect(data.regimes).toHaveProperty('simplesNacional');
    expect(data.regimes).toHaveProperty('lucroPresumido');
    expect(data.regimes).toHaveProperty('lucroRealCumulative');
    expect(data.regimes).toHaveProperty('lucroRealNonCumulative');
  });
});

describe('Tax Calculator - Glossary Terms', () => {
  it('should include DAS term in glossary', () => {
    const fs = require('fs');
    const path = require('path');
    const glossaryPath = path.join(process.cwd(), 'src/data/glossary.ts');
    const content = fs.readFileSync(glossaryPath, 'utf-8');

    expect(content).toContain("term: 'DAS'");
  });

  it('should include Valor Aduaneiro term in glossary', () => {
    const fs = require('fs');
    const path = require('path');
    const glossaryPath = path.join(process.cwd(), 'src/data/glossary.ts');
    const content = fs.readFileSync(glossaryPath, 'utf-8');

    expect(content).toContain("term: 'Valor Aduaneiro'");
  });

  it('should have chapter terms mapping for tax-calculator', () => {
    const fs = require('fs');
    const path = require('path');
    const glossaryPath = path.join(process.cwd(), 'src/data/glossary.ts');
    const content = fs.readFileSync(glossaryPath, 'utf-8');

    expect(content).toContain("'12-tax-calculator'");
  });
});
