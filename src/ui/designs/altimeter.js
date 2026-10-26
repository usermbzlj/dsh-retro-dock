/**
 * Altimeter: a black aircraft dial beside a drum counter. The digits are the
 * primary reading; the 270° ring only gives bearing. CTX moves to a thin
 * pressure bar under the counter so two scales never share one arc.
 */

import {
  Approx,
  Drum,
  clampPct,
  h,
  pointAt,
  positions,
  tick,
} from './kit.js';

const DIAL = { cx: 22, cy: 22, start: 135, sweep: 270 };

export const AltimeterBody = ({ vm, t }) => {
  const scale = Number(vm.scale) || 180;
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctx = clampPct(vm.ctxValue || 0);
  const showSub = vm.sub !== false;
  const labels = [0, 0.5, 1].map((part) => Math.round(scale * part));

  const dial = h('span', { className: 'rgx-alt-dialwrap rgx-mechanism' },
    h('svg', {
      className: 'rgx-alt-dial',
      viewBox: '0 0 44 44',
      'aria-hidden': 'true',
    },
    h('circle', { className: 'rgx-alt-face', cx: 22, cy: 22, r: 20 }),
    h('circle', { className: 'rgx-alt-rim', cx: 22, cy: 22, r: 20 }),
    h('g', { className: 'rgx-alt-ticks' },
      positions(18).map((pct, index) => tick(pct, 16.1, index % 3 === 0 ? 18.7 : 17.7, {
        ...DIAL,
        key: `at${index}`,
        className: index % 3 === 0 ? 'is-major' : 'is-minor',
      }))),
    h('g', { className: 'rgx-alt-labels' },
      labels.map((value, index) => {
        const point = pointAt((index / (labels.length - 1)) * 100, 14.6, DIAL);
        return h('text', {
          key: value,
          x: point.x.toFixed(2),
          y: point.y.toFixed(2),
          textAnchor: 'middle',
          dominantBaseline: 'middle',
        }, String(value));
      })),
    h('line', {
      className: 'rgx-alt-over',
      x1: pointAt(100, 17).x.toFixed(2),
      y1: pointAt(100, 17).y.toFixed(2),
      x2: pointAt(100, 20.4).x.toFixed(2),
      y2: pointAt(100, 20.4).y.toFixed(2),
    }),
    h('g', { className: 'rgx-alt-needle' },
      h('polygon', { className: 'rgx-alt-needle-tail', points: '17.4,21.7 22,21.5 22,22.5 17.4,22.3' }),
      h('polygon', { className: 'rgx-alt-needle-blade', points: '22,21.35 38.4,21.86 38.4,22.14 22,22.65' })),
    h('circle', { className: 'rgx-alt-hub', cx: 22, cy: 22, r: 1.25 }),
    h('circle', { className: 'rgx-alt-hub-pin', cx: 22, cy: 22, r: 0.45 })));

  const windowBlock = h('span', { className: 'rgx-alt-window' },
    h('span', { className: 'rgx-alt-value' },
      h(Approx, { live: vm.live }),
      h(Drum, { value: vm.displayTps }),
      h('span', { className: 'rgx-alt-over-flag', 'aria-hidden': 'true' }, '+')),
    h('span', { className: 'rgx-alt-unit' }, t('unit')));

  const ctxRow = showSub ? h('span', { className: 'rgx-alt-ctx' },
    h('span', { className: 'rgx-alt-tag' },
      t('ctx'),
      vm.warn ? h('b', { className: 'rgx-alt-alert' }, '!') : null),
    h('span', { className: 'rgx-alt-bar', 'aria-hidden': 'true' },
      h('span', { className: 'rgx-alt-bar-fill', style: { width: `${ctx}%` } }),
      ctx > warnAt ? h('span', {
        className: 'rgx-alt-bar-over',
        style: { left: `${warnAt}%`, width: `${ctx - warnAt}%` },
      }) : null,
      h('span', { className: 'rgx-alt-bar-mark', style: { left: `${warnAt}%` } })),
    h('span', { className: 'rgx-alt-num' }, vm.ctxDisplay)) : null;

  const hitRow = showSub ? h('span', { className: 'rgx-alt-hit' },
    h('span', { className: 'rgx-alt-tag' }, t('hit')),
    h('span', { className: 'rgx-alt-num' }, vm.hitDisplay)) : null;

  return h('span', { className: 'rgx-alt' },
    dial,
    h('span', { className: 'rgx-alt-read' }, windowBlock, ctxRow, hitRow));
};
