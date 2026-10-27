/**
 * Broadcast VU: a wide, shallow fan on a lit ivory face. The red zone is the
 * over-range end of the speed scale; CTX warning lives in the side reading.
 */

import {
  Approx,
  Drum,
  Lamps,
  arcPath,
  clampPct,
  h,
  pointAt,
  positions,
  tick,
} from './kit.js';

const FAN = { cx: 60, cy: 33, start: 212, sweep: 116 };
const labelPoint = (pct) => pointAt(pct, 23.4, FAN);

export const VuBody = ({ vm, t }) => {
  const scale = Number(vm.scale) || 180;
  const showSub = vm.sub !== false;
  // 统计条太矮，刻度字读不出来，只留刻线和红区；输入位只印 0 / 中点 / 满量程，避免挤在弧上
  const labels = vm.placement === 'dock' ? [] : [0, Math.round(scale / 2), scale];

  const scaleSvg = h('svg', {
    className: 'rgx-vu-scale rgx-mechanism',
    viewBox: '0 0 120 34',
    preserveAspectRatio: 'xMidYMid meet',
    'aria-hidden': 'true',
  },
  h('path', { className: 'rgx-vu-track', d: arcPath(0, 100, 29.5, FAN), fill: 'none' }),
  h('path', { className: 'rgx-vu-redzone', d: arcPath(90, 100, 29.6, FAN), fill: 'none' }),
  h('g', { className: 'rgx-vu-ticks' },
    positions(20).map((pct, index) => tick(pct, 27.8, index % 5 === 0 ? 30.6 : 29.4, {
      ...FAN,
      key: `vt${index}`,
      className: index % 5 === 0 ? 'is-major' : 'is-minor',
    }))),
  h('g', { className: 'rgx-vu-labels' },
    labels.map((value, index) => {
      const point = labelPoint((index / (labels.length - 1)) * 100);
      return h('text', {
        key: value,
        x: point.x.toFixed(2),
        y: point.y.toFixed(2),
        textAnchor: 'middle',
        dominantBaseline: 'middle',
      }, String(value));
    })),
  h('g', { className: 'rgx-vu-needle' },
    h('polygon', { className: 'rgx-vu-needle-tail', points: '49.8,32.2 60,31.8 60,34.2 49.8,33.8' }),
    h('polygon', { className: 'rgx-vu-needle-blade', points: '60,31.9 88.2,32.94 88.2,33.06 60,34.1' })),
  h('circle', { className: 'rgx-vu-hub', cx: 60, cy: 33, r: 1.8 }));

  const row = h('span', { className: 'rgx-vu-row' },
    showSub ? h('span', { className: vm.warn ? 'rgx-vu-side is-warn' : 'rgx-vu-side' },
      h('span', { className: 'rgx-vu-tag' },
        t('ctx'),
        vm.warn ? h('b', { className: 'rgx-vu-alert' }, '!') : null),
      vm.ctxLamps ? h(Lamps, { vm }) : null,
      h('span', { className: 'rgx-vu-val' }, vm.ctxDisplay)) : null,
    h('span', { className: 'rgx-vu-main' },
      h(Approx, { live: vm.live }),
      vm.readout === 'drum'
        ? h(Drum, { value: vm.displayTps })
        : h('span', { className: 'rgx-vu-digits' }, vm.displayTps),
      (Number(vm.over) || 0) > 0
        ? h('span', { className: 'rgx-vu-over', 'aria-hidden': 'true' }, '+')
        : null,
      h('span', { className: 'rgx-vu-unit' }, t('unit'))),
    showSub ? h('span', { className: 'rgx-vu-side is-right' },
      h('span', { className: 'rgx-vu-tag' }, t('hit')),
      h('span', { className: 'rgx-vu-val' }, vm.hitDisplay)) : null);

  return h('span', { className: 'rgx-vu' },
    h('span', { className: 'rgx-vu-face' },
      scaleSvg,
      h('span', { className: 'rgx-vu-peak rgx-mechanism', 'aria-hidden': 'true' }),
      row));
};
