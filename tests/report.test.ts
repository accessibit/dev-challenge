import { describe, expect, it } from 'vitest';
import { buildReport, formatText } from '../src/report.js';
import type { Finding } from '../src/types.js';

const finding = (overrides: Partial<Finding> = {}): Finding => ({
  ruleId: 'img-alt',
  wcag: '1.1.1',
  impact: 'critical',
  message: 'Image is missing an alt attribute',
  page: 'p.html',
  selector: 'html > body > img',
  snippet: '<img src="a.png">',
  ...overrides,
});

describe('buildReport', () => {
  it('passes when there are no findings', () => {
    const report = buildReport(['p.html'], []);
    expect(report.summary).toEqual({
      total: 0,
      byImpact: { critical: 0, serious: 0, moderate: 0, minor: 0 },
      status: 'pass',
    });
  });

  it('fails and counts findings by impact', () => {
    const report = buildReport(['p.html'], [finding(), finding({ impact: 'serious', ruleId: 'iframe-title' })]);
    expect(report.summary.status).toBe('fail');
    expect(report.summary.total).toBe(2);
    expect(report.summary.byImpact).toMatchObject({ critical: 1, serious: 1 });
  });
});

describe('formatText', () => {
  it('groups findings by page', () => {
    const text = formatText(buildReport(['p.html'], [finding()]));
    expect(text).toContain('1 finding(s) — FAIL');
    expect(text).toContain('p.html');
    expect(text).toContain('[critical] img-alt (WCAG 1.1.1)');
  });
});
