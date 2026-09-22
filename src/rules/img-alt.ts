import type { Rule } from '../types.js';

export const imgAlt: Rule = {
  id: 'img-alt',
  wcag: '1.1.1',
  impact: 'critical',
  description: 'Images must have an alt attribute.',
  check(root) {
    return root
      .querySelectorAll('img')
      .filter((img) => !img.getAttribute('alt'))
      .map((img) => ({ element: img, message: 'Image is missing an alt attribute' }));
  },
};
