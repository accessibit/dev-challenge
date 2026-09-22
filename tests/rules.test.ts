import { parse } from 'node-html-parser';
import { describe, expect, it } from 'vitest';
import { headingOrder } from '../src/rules/heading-order.js';
import { iframeTitle } from '../src/rules/iframe-title.js';
import { imgAlt } from '../src/rules/img-alt.js';
import { linkName } from '../src/rules/link-name.js';

describe('img-alt', () => {
  it('flags images without alt', () => {
    const hits = imgAlt.check(parse('<img src="a.png">'));
    expect(hits).toHaveLength(1);
    expect(hits[0].message).toMatch(/alt/);
  });

  it('accepts images with a text alternative', () => {
    expect(imgAlt.check(parse('<img src="a.png" alt="A cat">'))).toHaveLength(0);
  });
});

describe('iframe-title', () => {
  it('flags frames without a title', () => {
    expect(iframeTitle.check(parse('<iframe src="x"></iframe>'))).toHaveLength(1);
  });

  it('accepts frames with a title', () => {
    expect(iframeTitle.check(parse('<iframe src="x" title="Map"></iframe>'))).toHaveLength(0);
  });
});

describe('link-name', () => {
  it('flags links with no text, label or image alt', () => {
    const html = '<a href="/cart"><img src="cart.svg" alt=""></a>';
    expect(linkName.check(parse(html))).toHaveLength(1);
  });

  it('accepts links named by text, aria-label or image alt', () => {
    const html = [
      '<a href="/a">Home</a>',
      '<a href="/b" aria-label="Cart"><img src="cart.svg" alt=""></a>',
      '<a href="/c"><img src="logo.svg" alt="Acme"></a>',
    ].join('');
    expect(linkName.check(parse(html))).toHaveLength(0);
  });
});

describe('heading-order', () => {
  it('flags skipped heading levels', () => {
    const hits = headingOrder.check(parse('<h1>A</h1><h3>B</h3>'));
    expect(hits).toHaveLength(1);
    expect(hits[0].message).toContain('h1 to h3');
  });

  it('accepts sequential headings and going back up', () => {
    expect(headingOrder.check(parse('<h1>A</h1><h2>B</h2><h3>C</h3><h2>D</h2>'))).toHaveLength(0);
  });
});
