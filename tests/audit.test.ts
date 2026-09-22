import { describe, expect, it } from 'vitest';
import { auditHtml, auditPaths } from '../src/audit.js';

describe('auditHtml', () => {
  it('enriches rule hits with page, selector and snippet', () => {
    const html = '<html><body><main><img src="a.png"><img src="b.png"></main></body></html>';
    const findings = auditHtml(html, 'site/page.html');

    expect(findings).toHaveLength(2);
    expect(findings[0]).toMatchObject({
      ruleId: 'img-alt',
      page: 'site/page.html',
      selector: 'html > body > main > img:nth-of-type(1)',
      snippet: '<img src="a.png">',
    });
  });

  it('uses ids to shorten selectors', () => {
    const html = '<html><body><div id="hero"><img src="a.png"></div></body></html>';
    expect(auditHtml(html, 'p.html')[0].selector).toBe('#hero > img');
  });
});

describe('auditPaths', () => {
  it('audits every html file in a directory', async () => {
    const { pages, findings } = await auditPaths(['fixtures/globex']);

    expect(pages).toEqual(['fixtures/globex/index.html']);
    expect(findings.map((f) => f.ruleId)).toEqual(['img-alt', 'img-alt', 'img-alt']);
  });
});
