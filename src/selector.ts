import { HTMLElement } from 'node-html-parser';

/**
 * Builds a CSS-like path for an element, e.g. `html > body > main > img:nth-of-type(2)`.
 * Stops early when an ancestor has an id.
 */
export function cssPath(el: HTMLElement): string {
  const parts: string[] = [];
  let node: HTMLElement | null = el;

  while (node && node.rawTagName) {
    const tag = node.rawTagName.toLowerCase();
    const id = node.getAttribute('id');
    if (id) {
      parts.unshift(`#${id}`);
      break;
    }

    const parent = node.parentNode as HTMLElement | null;
    let part = tag;
    if (parent) {
      const sameTag = parent.childNodes.filter(
        (n): n is HTMLElement => n instanceof HTMLElement && n.rawTagName?.toLowerCase() === tag,
      );
      if (sameTag.length > 1) {
        part += `:nth-of-type(${sameTag.indexOf(node) + 1})`;
      }
    }
    parts.unshift(part);
    node = parent;
  }

  return parts.join(' > ');
}

export function snippet(el: HTMLElement, max = 120): string {
  const html = el.toString().replace(/\s+/g, ' ').trim();
  return html.length > max ? `${html.slice(0, max - 1)}…` : html;
}
