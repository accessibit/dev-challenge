import type { Finding, Impact, Report } from './types.js';

/*
 * REPORT CONTRACT
 * The JSON report is (1) ingested by the dashboard (`services/ingest`, keyed on
 * `page` + `ruleId` + `selector`) and (2) archived per client as compliance
 * evidence. Adding fields is fine. Renaming or removing fields, or changing the
 * meaning of `summary.status`, must be coordinated with the dashboard team.
 */

const IMPACTS: Impact[] = ['critical', 'serious', 'moderate', 'minor'];

export function buildReport(pages: string[], findings: Finding[]): Report {
  const byImpact = Object.fromEntries(IMPACTS.map((impact) => [impact, 0])) as Record<Impact, number>;
  for (const finding of findings) byImpact[finding.impact] += 1;

  return {
    generatedAt: new Date().toISOString(),
    pages,
    summary: {
      total: findings.length,
      byImpact,
      status: findings.length === 0 ? 'pass' : 'fail',
    },
    findings,
  };
}

export function formatText(report: Report): string {
  const lines: string[] = [];
  lines.push(`Audited ${report.pages.length} page(s) — ${report.summary.total} finding(s) — ${report.summary.status.toUpperCase()}`);
  lines.push('');

  const byPage = new Map<string, Finding[]>();
  for (const finding of report.findings) {
    const list = byPage.get(finding.page) ?? [];
    list.push(finding);
    byPage.set(finding.page, list);
  }

  for (const [page, findings] of byPage) {
    lines.push(page);
    for (const finding of findings) {
      lines.push(`  [${finding.impact}] ${finding.ruleId} (WCAG ${finding.wcag}) — ${finding.message}`);
      lines.push(`      ${finding.selector}`);
      lines.push(`      ${finding.snippet}`);
    }
    lines.push('');
  }

  const impacts = IMPACTS.map((impact) => `${impact}: ${report.summary.byImpact[impact]}`).join(', ');
  lines.push(`By impact — ${impacts}`);
  return lines.join('\n');
}
