/**
 * Shared geometry and micro-components for the instruments. Keeping the
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

/**
 * CTX lamp state. Amber opens ten points below the warning threshold; an
 * unknown CTX lights nothing, because green would claim the context is safe.
 *
 * @param {{ ctxValue?: number, warnAt?: number, ctxKnown?: boolean }} vm
 * @returns {'off'|'ok'|'amber'|'red'}
 */
export const ctxLevel = (vm) => {
  if (!vm || vm.ctxKnown === false) return 'off';
  const ctx = Number(vm.ctxValue);
  if (!Number.isFinite(ctx)) return 'off';
  const warnAt = clampPct(vm.warnAt ?? 80);
  if (ctx >= warnAt) return 'red';
  if (ctx >= warnAt - 10) return 'amber';
  return 'ok';
};

const LAMPS = ['ok', 'amber', 'red'];

/** Three CTX status lamps; exactly one is lit unless the level is `off`. */
export const Lamps = ({ vm }) => h('span', {
  className: 'rgx-lamps',
  'data-level': ctxLevel(vm),
  'aria-hidden': 'true',
}, LAMPS.map((name) => h('i', { key: name, className: 'rgx-lamp', 'data-lamp': name })));

export const MiniLine = ({ vm, t }) => {
  const showSub = vm.sub !== false;
  const value = vm.displayTps ?? digitsOf(vm.tps);
  const lamps = vm.ctxLamps === true && vm.style === 'vu';
  return h('span', { className: 'rgx-mini' },
    h('span', { className: 'rgx-mini-rate' },
      h('span', { className: 'rgx-mini-approx', 'aria-hidden': 'true' }, vm.live ? '≈' : '\u00A0'),
      h('span', { className: 'rgx-mini-digits' }, value),
      (Number(vm.over) || 0) > 0
        ? h('span', { className: 'rgx-mini-over', 'aria-hidden': 'true' }, '+')
        : null,
      h('span', { className: 'rgx-mini-unit' }, t(vm.holding ? 'holdUnit' : 'unit'))),
    showSub ? h('span', { className: vm.warn ? 'rgx-mini-ctx is-warn' : 'rgx-mini-ctx' },
      vm.warn ? h('span', { className: 'rgx-mini-alert', 'aria-hidden': 'true' }, '!') : null,
      h('span', { className: 'rgx-mini-tag' }, t('ctx')),
      lamps ? h(Lamps, { vm }) : null,
      h('span', { className: 'rgx-mini-num' }, vm.ctxDisplay)) : null,
    showSub ? h('span', { className: 'rgx-mini-hit' },
      h('span', { className: 'rgx-mini-tag' }, t('hit')),
      h('span', { className: 'rgx-mini-num' }, vm.hitDisplay)) : null);
};

const DRUM_GLYPHS = '01234567890'.split('');
const DRUM_WRAP_MS = 110;

const placeStrip = (strip, index, animate) => {
  strip.style.transition = animate ? '' : 'none';
  strip.style.transform = `translate3d(0, ${-index}em, 0)`;
  if (!animate) {
    void strip.offsetHeight;
    strip.style.transition = '';
  }
};

/**
 * One drum column. React owns the resting transform; the layout effect only
 * steps in for a wrap, so 9 → 0 rolls forward onto the eleventh glyph and then
 * snaps home, and 0 → 9 on a falling value rolls back from it.
 */
const DrumColumn = ({ digit, rising, lead, units }) => {
  const stripRef = R.useRef(null);
  const previousRef = R.useRef(digit);

  R.useLayoutEffect(() => {
    const strip = stripRef.current;
    const previous = previousRef.current;
    previousRef.current = digit;
    if (!strip || previous === digit) return undefined;
    if (rising && previous === 9 && digit === 0) {
      placeStrip(strip, 10, true);
      const timer = setTimeout(() => placeStrip(strip, 0, false), DRUM_WRAP_MS);
      return () => {
        clearTimeout(timer);
        placeStrip(strip, 0, false);
      };
    }
    if (!rising && previous === 0 && digit === 9) {
      placeStrip(strip, 10, false);
      placeStrip(strip, 9, true);
      return undefined;
    }
    if (rising !== digit > previous) placeStrip(strip, digit, false);
    return undefined;
  }, [digit, rising]);

  return h('span', { className: `rgx-drum-col${lead ? ' is-lead' : ''}${units ? ' is-units' : ''}` },
    h('span', {
      ref: stripRef,
      className: 'rgx-drum-strip',
      style: { transform: `translate3d(0, ${-digit}em, 0)` },
    }, DRUM_GLYPHS.map((glyph, index) => h('span', { key: index, className: 'rgx-drum-glyph' }, glyph))));
};

/**
 * Rolling counter. The column count follows `max`; a value above it shows
 * `max` with a `+` rather than clamping silently. Leading zeros carry
 * `is-lead` so they can recede.
 *
 * @param {{ value: number|string, className?: string, max?: number }} props
 */
export const Drum = ({ value, className = '', max = 999 }) => {
  const raw = Math.max(0, Math.round(Number(value) || 0));
  const capped = Math.min(max, raw);
  const width = String(max).length;
  const glyphs = String(capped).padStart(width, '0');
  const firstSignificant = glyphs.length - String(capped).length;

  const previousRef = R.useRef(capped);
  const rising = capped > previousRef.current;
  R.useLayoutEffect(() => {
    previousRef.current = capped;
  }, [capped]);

  return h('span', { className: `rgx-drum ${className}`.trim(), 'aria-hidden': 'true' },
    glyphs.split('').map((glyph, index) => h(DrumColumn, {
      key: width - index,
      digit: Number(glyph),
      rising,
      lead: index < firstSignificant,
      units: index === glyphs.length - 1,
    })),
    raw > max ? h('span', { className: 'rgx-drum-plus' }, '+') : null);
};
