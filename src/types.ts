import type { HTMLElement } from 'node-html-parser';

export type Impact = 'critical' | 'serious' | 'moderate' | 'minor';

/** A rule "hit" before it is enriched with page/selector information. */
export interface RuleHit {
  element: HTMLElement;
  message: string;
}

export interface Rule {
  id: string;
  /** WCAG success criterion, e.g. "1.1.1" */
  wcag: string;
  impact: Impact;
  description: string;
  check(root: HTMLElement): RuleHit[];
}

export interface Finding {
  ruleId: string;
  wcag: string;
  impact: Impact;
  message: string;
  /** Path of the audited page, relative to the working directory. */
  page: string;
  /** CSS-like path of the offending element. */
  selector: string;
  /** Truncated outer HTML of the offending element. */
  snippet: string;
}

export interface ReportSummary {
  total: number;
  byImpact: Record<Impact, number>;
  status: 'pass' | 'fail';
}

export interface Report {
  generatedAt: string;
  pages: string[];
  summary: ReportSummary;
  findings: Finding[];
}
