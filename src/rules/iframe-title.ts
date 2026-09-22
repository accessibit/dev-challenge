import type { Rule } from '../types.js';

export const iframeTitle: Rule = {
  id: 'iframe-title',
  wcag: '4.1.2',
  impact: 'serious',
  description: 'Frames must have a non-empty title attribute.',
  check(root) {
    return root
      .querySelectorAll('iframe')
      .filter((frame) => !(frame.getAttribute('title') ?? '').trim())
      .map((frame) => ({ element: frame, message: 'Frame has no accessible title' }));
  },
};
