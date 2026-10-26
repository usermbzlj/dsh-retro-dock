/**
 * Bench: a calibration-bench meter. The panel is the instrument; the dial is
 * printed on it, the readout sits in a recessed window, and red appears only
 * at the CTX redline, its overrun, and the over-speed stop.
 *
 * The dial reads rate only. CTX lives in a slim pressure bar inside the readout
 * window — putting both on one dial made the CTX threshold look like a speed
 * limit, which is a lie about the data.
 */

import {
  Approx,
  clampPct,
  h,
  pointAt,
  positions,
  tick,
} from './kit.js';

const DIAL = { cx: 25, cy: 25, start: 150, sweep: 240 };
const labelPoint = (pct) => pointAt(pct, 23.1, DIAL);
const overPoint = pointAt(100, 20.9, DIAL);

export const BenchBody = ({ vm, t }) => {
  const scale = Number(vm.scale) || 180;
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctx = clampPct(vm.ctxValue || 0);
  const showSub = vm.sub !== false;
  const labels = [0, scale / 2, scale];

  return h('span', { className: 'rgx-bench' },
    h('span', { className: 'rgx-bench-dialwrap rgx-mechanism' },
      h('svg', {
        className: 'rgx-bench-dial',
        viewBox: '0 0 50 50',
        'aria-hidden': 'true',
      },
      h('circle', { className: 'rgx-bench-rim', cx: 25, cy: 25, r: 21.1 }),
      h('g', { className: 'rgx-bench-ticks' },
        positions(16).map((pct, index) => tick(pct, 18.5, index % 2 === 0 ? 21.2 : 20.2, {
          ...DIAL,
          key: `t${index}`,
          className: index === 16 ? 'is-end' : index % 2 === 0 ? 'is-major' : 'is-minor',
        }))),
      h('g', { className: 'rgx-bench-labels' },
        labels.map((value, index) => {
          const pct = (index / (labels.length - 1)) * 100;
          const point = labelPoint(pct);
          return h('text', {
            key: value,
            x: point.x.toFixed(2),
            y: point.y.toFixed(2),
            textAnchor: 'middle',
            dominantBaseline: 'middle',
          }, String(Math.round(value)));
        })),
      h('g', { className: 'rgx-bench-needle' },
        h('polygon', { className: 'rgx-bench-needle-tail', points: '22.4,24.75 25,24.6 25,25.4 22.4,25.25' }),
        h('polygon', { className: 'rgx-bench-needle-blade', points: '25,24.25 40.8,24.9 40.8,25.1 25,25.75' })),
      h('circle', { className: 'rgx-bench-hub', cx: 25, cy: 25, r: 1.45 }),
      h('circle', { className: 'rgx-bench-hub-pin', cx: 25, cy: 25, r: 0.5 }),
      h('circle', {
        className: 'rgx-bench-over-dot',
        cx: overPoint.x.toFixed(2),
        cy: overPoint.y.toFixed(2),
        r: 1.05,
      })),
    ),
    h('span', { className: 'rgx-bench-read' },
      h('span', { className: 'rgx-bench-window' },
        h('span', { className: 'rgx-bench-value' },
          h(Approx, { live: vm.live }),
          h('span', { className: 'rgx-bench-digits' }, vm.displayTps),
          h('span', { className: 'rgx-bench-unit' }, t('unit')),
          h('span', { className: 'rgx-bench-over-flag', 'aria-hidden': 'true' }, '+')),
        showSub ? h('span', { className: 'rgx-bench-rows' },
          h('span', { className: 'rgx-bench-row rgx-bench-row-ctx' },
            h('span', { className: 'rgx-bench-tag' },
              t('ctx'),
              vm.warn ? h('b', { className: 'rgx-bench-alert' }, '!') : null),
            h('span', { className: 'rgx-bench-bar', 'aria-hidden': 'true' },
              h('span', {
                className: 'rgx-bench-bar-fill',
                style: { width: `${ctx}%` },
              }),
              ctx > warnAt ? h('span', {
                className: 'rgx-bench-bar-over',
                style: { left: `${warnAt}%`, width: `${ctx - warnAt}%` },
              }) : null,
              h('span', {
                className: 'rgx-bench-bar-mark',
                style: { left: `${warnAt}%` },
              })),
            h('span', { className: 'rgx-bench-num' }, vm.ctxDisplay)),
          h('span', { className: 'rgx-bench-row' },
            h('span', { className: 'rgx-bench-tag' }, t('hit')),
            h('span', { className: 'rgx-bench-num' }, vm.hitDisplay))) : null)),
  );
};
