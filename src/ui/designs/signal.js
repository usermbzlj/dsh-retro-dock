/**
 * Signal: a railway block instrument. The semaphore arm is the rate; three
 * lamps state the CTX condition; the HIT value lives in a small counter
 * window. The plate inverts in the dark theme instead of glowing.
 */

import {
  Approx,
  clampPct,
  h,
} from './kit.js';

const PIVOT = { x: 7, y: 29 };
const at = (radius, degrees) => {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: PIVOT.x + radius * Math.cos(angle),
    y: PIVOT.y + radius * Math.sin(angle),
  };
};

const TICKS = [0, -18, -36, -54, -72];

export const SignalBody = ({ vm, t }) => {
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctx = clampPct(vm.ctxValue || 0);
  const showSub = vm.sub !== false;
  const state = vm.warn ? 'red' : ctx >= warnAt - 10 ? 'amber' : 'green';

  const arm = h('span', { className: 'rgx-signal-armwrap rgx-mechanism' },
    h('svg', {
      className: 'rgx-signal-dial',
      viewBox: '0 0 36 36',
      'aria-hidden': 'true',
    },
    h('path', {
      className: 'rgx-signal-arc',
      d: `M ${at(25.4, 0).x} ${at(25.4, 0).y} A 25.4 25.4 0 0 0 ${at(25.4, -72).x} ${at(25.4, -72).y}`,
      fill: 'none',
    }),
    h('g', { className: 'rgx-signal-ticks' },
      TICKS.map((degrees, index) => {
        const inner = at(23.4, degrees);
        const outer = at(25.6, degrees);
        return h('line', {
          key: degrees,
          className: index === 0 || index === TICKS.length - 1 ? 'is-end' : 'is-minor',
          x1: inner.x.toFixed(2),
          y1: inner.y.toFixed(2),
          x2: outer.x.toFixed(2),
          y2: outer.y.toFixed(2),
        });
      })),
    h('g', { className: 'rgx-signal-arm' },
      h('rect', { className: 'rgx-signal-arm-tail', x: 2.6, y: 28.2, width: 4.4, height: 1.6 }),
      h('rect', { className: 'rgx-signal-arm-bar', x: 6, y: 27.4, width: 27, height: 3.2 }),
      h('rect', { className: 'rgx-signal-arm-stripe', x: 25.4, y: 27.4, width: 4.4, height: 3.2 })),
    h('circle', { className: 'rgx-signal-pivot', cx: 7, cy: 29, r: 2 }),
    h('circle', { className: 'rgx-signal-pivot-pin', cx: 7, cy: 29, r: 0.65 })));

  const main = h('span', { className: 'rgx-signal-main' },
    h(Approx, { live: vm.live }),
    h('span', { className: 'rgx-signal-digits' }, vm.displayTps),
    h('span', { className: 'rgx-signal-over', 'aria-hidden': 'true' }, '+'),
    h('span', { className: 'rgx-signal-unit' }, t('unit')));

  const lamps = h('span', { className: 'rgx-signal-lamps', 'aria-hidden': 'true' },
    ['green', 'amber', 'red'].map((name) => h('span', {
      key: name,
      className: name === state ? 'rgx-signal-lamp is-on' : 'rgx-signal-lamp',
      'data-lamp': name,
    })));

  const ctxRow = h('span', { className: 'rgx-signal-ctx' },
    h('span', { className: 'rgx-signal-tag' },
      t('ctx'),
      vm.warn ? h('b', { className: 'rgx-signal-alert' }, '!') : null),
    lamps,
    h('span', { className: 'rgx-signal-num' }, vm.ctxDisplay));

  const hitRow = h('span', { className: 'rgx-signal-hit' },
    h('span', { className: 'rgx-signal-tag' }, t('hit')),
    h('span', { className: 'rgx-signal-counter' }, vm.hitDisplay));

  return h('span', { className: 'rgx-signal' },
    arm,
    h('span', { className: 'rgx-signal-read' }, main),
    showSub ? h('span', { className: 'rgx-signal-info' }, ctxRow, hitRow) : null);
};
