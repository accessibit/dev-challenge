import type { Rule } from '../types.js';
import { headingOrder } from './heading-order.js';
import { iframeTitle } from './iframe-title.js';
import { imgAlt } from './img-alt.js';
import { linkName } from './link-name.js';

export const rules: Rule[] = [imgAlt, iframeTitle, linkName, headingOrder];

export function getRule(id: string): Rule | undefined {
  return rules.find((rule) => rule.id === id);
}
