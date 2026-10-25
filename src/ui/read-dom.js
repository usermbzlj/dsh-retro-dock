/**
 * DOM fallbacks for hosts that do not expose the contextPressure/tokenUsage
 * projections. These are the least trustworthy path and the UI names them.
 */

const contextFromLabel = (node) => {
  const label = node.getAttribute('aria-label') || node.getAttribute('title') || '';
  const match = /(\d{1,3})\s*%/.exec(label);
  return match === null ? null : Number(match[1]);
};

/**
 * @returns {number|null} context percent.
 */
export const readContextPressure = () => {
  if (typeof document === 'undefined') return null;
  const dock = document.querySelector('[data-composer-dock]');
  if (dock === null) return null;

  for (const node of dock.querySelectorAll('[aria-label], [title]')) {
    if (node.closest('.rg-gauge, .rg-root') !== null) continue;
    const label = `${node.getAttribute('aria-label') || ''} ${node.getAttribute('title') || ''}`;
    if (!/上下文|context/i.test(label)) continue;
    const value = contextFromLabel(node);
    if (value !== null) return value;
  }

  for (const node of dock.querySelectorAll('span, div')) {
    if (node.closest('.rg-root') !== null) continue;
    if (node.children.length > 0) continue;
    const text = (node.textContent || '').trim();
    if (/^\d{1,3}%$/.test(text)) return Number(text.slice(0, -1));
  }
  return null;
};

/**
 * @returns {number|null} whole-session cache-hit percent.
 */
export const readCacheHit = () => {
  if (typeof document === 'undefined') return null;
  const node = document.querySelector('[data-composer-stat="usage"]');
  if (node === null) return null;
  const text = `${node.textContent || ''} ${node.getAttribute('aria-label') || ''}`;
  const match = /(?:缓存命中|Cache hit)[^0-9]{0,8}([\d.]+)\s*%/i.exec(text);
  return match === null ? null : Number(match[1]);
};
