import type { HTMLElement } from 'node-html-parser';
import type { Rule } from '../types.js';

/** Very small approximation of the accessible name computation for links. */
function accessibleName(link: HTMLElement): string {
  const ariaLabel = (link.getAttribute('aria-label') ?? '').trim();
  if (ariaLabel) return ariaLabel;

  const text = link.textContent.replace(/\s+/g, ' ').trim();
  if (text) return text;

  const imgAlt = link
    .querySelectorAll('img')
    .map((img) => (img.getAttribute('alt') ?? '').trim())
    .find(Boolean);
  if (imgAlt) return imgAlt;

  return (link.getAttribute('title') ?? '').trim();
}

export const linkName: Rule = {
  id: 'link-name',
  wcag: '2.4.4',
  impact: 'serious',
  description: 'Links must have discernible text.',
  check(root) {
    return root
      .querySelectorAll('a[href]')
      .filter((link) => accessibleName(link) === '')
      .map((link) => ({ element: link, message: 'Link has no accessible name' }));
  },
};
