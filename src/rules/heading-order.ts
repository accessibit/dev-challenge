import type { Rule } from '../types.js';

export const headingOrder: Rule = {
  id: 'heading-order',
  wcag: '1.3.1',
  impact: 'moderate',
  description: 'Heading levels should only increase by one.',
  check(root) {
    const hits = [];
    let previous = 0;
    for (const heading of root.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      const level = Number(heading.rawTagName[1]);
      if (previous > 0 && level > previous + 1) {
        hits.push({
          element: heading,
          message: `Heading level skipped from h${previous} to h${level}`,
        });
      }
      previous = level;
    }
    return hits;
  },
};
