import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { rules as allRules } from './rules/index.js';
import { cssPath, snippet } from './selector.js';
import type { Finding, Rule } from './types.js';

export function auditHtml(html: string, page: string, rules: Rule[] = allRules): Finding[] {
  const root = parse(html);
  const findings: Finding[] = [];
  for (const rule of rules) {
    for (const hit of rule.check(root)) {
      findings.push({
        ruleId: rule.id,
        wcag: rule.wcag,
        impact: rule.impact,
        message: hit.message,
        page,
        selector: cssPath(hit.element),
        snippet: snippet(hit.element),
      });
    }
  }
  return findings;
}

/** Expands files and directories (recursively) into a sorted list of .html files. */
export async function collectPages(inputs: string[]): Promise<string[]> {
  const pages: string[] = [];
  for (const input of inputs) {
    const info = await stat(input);
    if (info.isDirectory()) {
      const entries = await readdir(input, { withFileTypes: true });
      const nested = entries.map((entry) => path.join(input, entry.name));
      pages.push(...(await collectPages(nested)));
    } else if (input.endsWith('.html')) {
      pages.push(input);
    }
  }
  return pages.sort();
}

export async function auditPaths(
  inputs: string[],
  rules: Rule[] = allRules,
): Promise<{ pages: string[]; findings: Finding[] }> {
  const pages = await collectPages(inputs);
  const findings: Finding[] = [];
  for (const page of pages) {
    const html = await readFile(page, 'utf8');
    findings.push(...auditHtml(html, page, rules));
  }
  return { pages, findings };
}
