/**
 * Shared geometry and micro-components for the seven instruments. Keeping the
 * math here means every dial maps the same 0–100 position to its own scale
 * without inventing a second reading model.
 */

import { R } from '../../runtime.js';

export const h = (...args) => R.h(...args);

export const clampPct = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
};

/** @returns {number} angle in degrees for a 0–100 position. */
export const angleAt = (pct, start = 150, sweep = 240) => start + clampPct(pct) * (sweep / 100);

/** @returns {{ x: number, y: number }} */
export const pointAt = (pct, radius, options = {}) => {
  const { cx = 20, cy = 20, start = 150, sweep = 240 } = options;
  const angle = (angleAt(pct, start, sweep) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
};

/**
 * SVG arc path from one percentage to another. Always clockwise.
 *
 * @param {number} from
 * @param {number} to
 * @param {number} radius
 * @param {{ cx?: number, cy?: number, start?: number, sweep?: number }} [options]
 * @returns {string|null}
 */
export const arcPath = (from, to, radius, options = {}) => {
  if (!(to > from)) return null;
  const { cx = 20, cy = 20, start = 150, sweep = 240 } = options;
  const a1 = angleAt(from, start, sweep);
  const a2 = angleAt(to, start, sweep);
  const p1 = pointAt(from, radius, options);
  const p2 = pointAt(to, radius, options);
  const large = a2 - a1 > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
};

/**
 * A radial tick line between two radii.
 *
 * @param {number} pct
 * @param {number} inner
 * @param {number} outer
 * @param {{ cx?: number, cy?: number, start?: number, sweep?: number, className?: string, key?: unknown }} [options]
 */
export const tick = (pct, inner, outer, options = {}) => {
  const { cx = 20, cy = 20, start = 150, sweep = 240, className, key } = options;
  const a = pointAt(pct, inner, { cx, cy, start, sweep });
  const b = pointAt(pct, outer, { cx, cy, start, sweep });
  return h('line', {
    key,
    className,
    x1: a.x.toFixed(2),
    y1: a.y.toFixed(2),
    x2: b.x.toFixed(2),
    y2: b.y.toFixed(2),
  });
};

/** Evenly spaced positions, inclusive of both ends. */
export const positions = (count) => Array.from({ length: count + 1 }, (_, index) => (index / count) * 100);

/** @param {number} value @returns {string} */
export const digitsOf = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return '0';
  return String(Math.round(Math.max(0, number)));
};

/** A fixed-width approximation slot so live/idle never shifts the layout. */
export const Approx = ({ live }) => h('span', {
  className: 'rgx-approx',
  'aria-hidden': 'true',
}, live ? '≈' : '\u00A0');

export const MiniLine = ({ vm, t }) => {
  const showSub = vm.sub !== false;
  const value = vm.displayTps ?? digitsOf(vm.tps);
  return h('span', { className: 'rgx-mini' },
    h('span', { className: 'rgx-mini-rate' },
      h('span', { className: 'rgx-mini-approx', 'aria-hidden': 'true' }, vm.live ? '≈' : '\u00A0'),
      h('span', { className: 'rgx-mini-digits' }, value),
      h('span', { className: 'rgx-mini-unit' }, ` ${t('unit')}`)),
    showSub ? h('span', { className: 'rgx-mini-sep', 'aria-hidden': 'true' }, '·') : null,
    showSub ? h('span', { className: vm.warn ? 'rgx-mini-ctx is-warn' : 'rgx-mini-ctx' },
      vm.warn ? h('span', { className: 'rgx-mini-alert', 'aria-hidden': 'true' }, '!') : null,
      `${t('ctx')} ${vm.ctxDisplay}`) : null,
    showSub ? h('span', { className: 'rgx-mini-sep', 'aria-hidden': 'true' }, '·') : null,
    showSub ? h('span', { className: 'rgx-mini-hit' }, `${t('hit')} ${vm.hitDisplay}`) : null);
};

/**
 * Rolling three-digit counter, shared by the altimeter (and useful on its own).
 * The strip is a single track of ten glyphs translated by one `em` per digit.
 *
 * @param {{ value: number|string, className?: string, max?: number }} props
 */
export const Drum = ({ value, className = '', max = 999 }) => {
  const number = Math.max(0, Math.min(max, Math.round(Number(value) || 0)));
  const glyphs = String(number).padStart(3, '0');
  return h('span', { className: `rgx-drum ${className}`.trim(), 'aria-hidden': 'true' },
    glyphs.split('').map((glyph, index) => h('span', {
      key: index,
      className: 'rgx-drum-col',
    }, h('span', {
      className: 'rgx-drum-strip',
      style: { transform: `translate3d(0, ${-Number(glyph)}em, 0)` },
    }, '0123456789'.split('').map((digit) => h('span', { key: digit, className: 'rgx-drum-glyph' }, digit))))));
};
