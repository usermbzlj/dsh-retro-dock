/**
 * Chart: a twenty-second strip-chart recorder. The trace is the rate; the
 * right margin carries CTX as a small pressure bar and HIT as a printed
 * annotation. In a live slot the paper grows from the right — no history is
 * invented before mount.
 */

import { R } from '../../runtime.js';
import {
  Approx,
  clampPct,
  h,
} from './kit.js';

const COUNT = 80;
const STEP = 100 / (COUNT - 1);

/** A deterministic twenty-second trace for static previews. */
const synthesize = (tps, scale) => {
  const full = Number(scale) || 180;
  const end = Math.max(0, Number(tps) || 0);
  if (end < 1) return Array(COUNT).fill(0);
  const seed = (end * 7 + full) % 31;
  const values = [];
  for (let index = 0; index < COUNT; index += 1) {
    const phase = index / (COUNT - 1);
    const ramp = 0.42 + 0.58 * Math.min(1, phase * 1.06);
    const wave = 0.82
      + 0.18 * Math.sin(index / 6 + seed)
      + 0.06 * Math.sin(index / 2.3 + seed * 2);
    values.push(Math.max(0, Math.min(full * 1.15, end * ramp * wave)));
  }
  values[COUNT - 1] = end;
  return values;
};

const useTrace = (vm) => {
  const staticMode = vm.static !== false;
  const [samples, setSamples] = R.useState([]);
  const latest = R.useRef(Number(vm.tps) || 0);
  latest.current = Number(vm.tps) || 0;

  R.useEffect(() => {
    if (staticMode) return undefined;
    const reduced = typeof window !== 'undefined'
      && typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const onVisibility = () => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setSamples([]);
    };
    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      setSamples((previous) => {
        if (latest.current === 0
          && previous.length === COUNT
          && previous.every((value) => value === 0)) return previous;
        return [...previous.slice(-(COUNT - 1)), latest.current];
      });
    }, reduced ? 1000 : 250);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibility);
    }
    return () => {
      clearInterval(timer);
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibility);
      }
    };
  }, [staticMode]);

  return staticMode ? synthesize(vm.tps, vm.scale) : samples;
};

const yFor = (value, scale) => {
  const full = Number(scale) || 180;
  const ratio = Math.max(0, Math.min(1, (Number(value) || 0) / full));
  return 96 - ratio * 90;
};

export const ChartBody = ({ vm, t }) => {
  const scale = Number(vm.scale) || 180;
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctxKnown = vm.ctxKnown !== false;
  const ctx = ctxKnown ? clampPct(vm.ctxValue || 0) : 0;
  const showSub = vm.sub !== false;
  const trace = useTrace(vm);
  const data = trace.length ? trace : [Number(vm.tps) || 0];
  const start = 100 - (data.length - 1) * STEP;
  const points = data.map((value, index) => ({
    x: start + index * STEP,
    y: yFor(value, scale),
  }));
  const path = points.map((point, index) => (
    `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`
  )).join(' ');
  const last = points[points.length - 1];
  const over = Number(vm.tps) > scale;

  return h('span', { className: 'rgx-chart' },
    h('span', { className: 'rgx-chart-paper' },
      h('span', { className: 'rgx-chart-head' },
        h('span', { className: 'rgx-chart-value' },
          h(Approx, { live: vm.live }),
          h('span', { className: 'rgx-chart-digits' }, vm.displayTps),
          h('span', { className: 'rgx-chart-unit' }, t(vm.holding ? 'holdUnit' : 'unit')),
          h('span', { className: 'rgx-chart-over', 'aria-hidden': 'true' }, '+')),
          h('span', { className: 'rgx-chart-span', 'aria-hidden': 'true' })),
      h('span', { className: 'rgx-chart-plot rgx-mechanism' },
        h('svg', {
          className: 'rgx-chart-trace',
          viewBox: '0 0 100 100',
          preserveAspectRatio: 'none',
          'aria-hidden': 'true',
        },
        h('line', {
          className: 'rgx-chart-full',
          x1: 0, x2: 100, y1: 6, y2: 6,
        }),
        h('path', { className: 'rgx-chart-line', d: path, fill: 'none' })),
        h('span', {
          className: over ? 'rgx-chart-dot is-over' : 'rgx-chart-dot',
          style: {
            left: `calc(${(last?.x ?? 100).toFixed(2)}% - 2px)`,
            top: `${(last?.y ?? 96).toFixed(2)}%`,
            transform: 'translateY(-50%)',
          },
        }))),
    showSub ? h('span', { className: 'rgx-chart-margin' },
      h('span', { className: 'rgx-chart-ctx' },
        h('span', { className: 'rgx-chart-tag' },
          t('ctx'),
          vm.warn ? h('b', { className: 'rgx-chart-alert' }, '!') : null),
        h('span', { className: 'rgx-chart-num' }, vm.ctxDisplay)),
      h('span', { className: ctxKnown ? 'rgx-chart-pressure' : 'rgx-chart-pressure is-unknown', 'aria-hidden': 'true' },
        ctxKnown ? h('span', {
          className: 'rgx-chart-pressure-fill',
          style: { height: `${ctx}%` },
        }) : null,
        h('span', {
          className: 'rgx-chart-pressure-mark',
          style: { bottom: `${warnAt}%` },
        })),
      h('span', { className: 'rgx-chart-hit' },
        h('span', { className: 'rgx-chart-tag' }, t('hit')),
        h('span', { className: 'rgx-chart-num' }, vm.hitDisplay))) : null);
};
