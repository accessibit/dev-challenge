#!/usr/bin/env tsx
import { auditPaths } from './audit.js';
import { buildReport, formatText } from './report.js';

const USAGE = `Usage: a11y-audit <file-or-dir>... [--json]

Audits HTML pages against a small set of WCAG rules.
Exits with code 1 when at least one finding is reported (useful in CI).`;

async function main(argv: string[]): Promise<number> {
  const json = argv.includes('--json');
  const inputs = argv.filter((arg) => !arg.startsWith('--'));

  if (inputs.length === 0 || argv.includes('--help')) {
    console.log(USAGE);
    return inputs.length === 0 ? 2 : 0;
  }

  const { pages, findings } = await auditPaths(inputs);
  const report = buildReport(pages, findings);

  console.log(json ? JSON.stringify(report, null, 2) : formatText(report));
  return report.summary.status === 'fail' ? 1 : 0;
}

main(process.argv.slice(2)).then(
  (code) => process.exit(code),
  (error) => {
    console.error(error);
    process.exit(2);
  },
);
