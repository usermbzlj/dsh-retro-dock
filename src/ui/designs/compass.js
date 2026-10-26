/**
 * Compass: a navy card under a brass bezel. The card turns; the fixed lubber
 * line and the readout do the measuring. CTX is a fixed ring outside the card,
 * so pressure never rotates with bearing.
 */

import {
  Approx,
  arcPath,
  clampPct,
  h,
  pointAt,
  positions,
  tick,
} from './kit.js';

const DIAL = { cx: 30, cy: 30, start: 150, sweep: 240 };
const CARD = { cx: 30, cy: 30, start: 0, sweep: 360 };

const polar = (radius, degrees) => {
  const angle = (degrees * Math.PI) / 180;
  return {
    x: 30 + radius * Math.cos(angle),
    y: 30 + radius * Math.sin(angle),
  };
};

const cardTicks = () => {
  const marks = [];
  for (let index = 0; index < 36; index += 1) {
    const degrees = index * 10;
    const inner = polar(index % 3 === 0 ? 19.8 : 20.9, degrees);
    const outer = polar(22.6, degrees);
    marks.push(h('line', {
      key: `ct${index}`,
      className: index % 3 === 0 ? 'rgx-compass-card-tick is-major' : 'rgx-compass-card-tick',
      x1: inner.x.toFixed(2),
      y1: inner.y.toFixed(2),
      x2: outer.x.toFixed(2),
      y2: outer.y.toFixed(2),
    }));
  }
  return marks;
};

export const CompassBody = ({ vm, t }) => {
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctx = clampPct(vm.ctxValue || 0);
  const showSub = vm.sub !== false;
  const zeroA = polar(23.9, 150);
  const zeroB = polar(21.4, 147);
  const zeroC = polar(21.4, 153);

  const dial = h('span', { className: 'rgx-compass-dialwrap rgx-mechanism' },
    h('svg', {
      className: 'rgx-compass-dial',
      viewBox: '0 0 60 60',
      'aria-hidden': 'true',
    },
    h('circle', { className: 'rgx-compass-face', cx: 30, cy: 30, r: 27.5 }),
    h('g', { className: 'rgx-compass-card' },
      h('circle', { className: 'rgx-compass-card-ring', cx: 30, cy: 30, r: 22.6 }),
      cardTicks(),
      h('polygon', {
        className: 'rgx-compass-zero',
        points: `${zeroA.x.toFixed(2)},${zeroA.y.toFixed(2)} ${zeroB.x.toFixed(2)},${zeroB.y.toFixed(2)} ${zeroC.x.toFixed(2)},${zeroC.y.toFixed(2)}`,
      })),
    h('circle', { className: 'rgx-compass-bezel', cx: 30, cy: 30, r: 28.4 }),
    h('path', { className: 'rgx-compass-ctx-track', d: arcPath(0, 100, 25.3, DIAL), fill: 'none' }),
    h('path', { className: 'rgx-compass-ctx-fill', d: arcPath(0, ctx, 25.3, DIAL), fill: 'none' }),
    ctx > warnAt ? h('path', {
      className: 'rgx-compass-ctx-over',
      d: arcPath(warnAt, ctx, 25.3, DIAL),
      fill: 'none',
    }) : null,
    h('line', {
      className: 'rgx-compass-redline',
      x1: pointAt(warnAt, 23.8, DIAL).x.toFixed(2),
      y1: pointAt(warnAt, 23.8, DIAL).y.toFixed(2),
      x2: pointAt(warnAt, 26.8, DIAL).x.toFixed(2),
      y2: pointAt(warnAt, 26.8, DIAL).y.toFixed(2),
    }),
    h('path', { className: 'rgx-compass-index', d: 'M 30 2.4 L 32.5 6.9 L 30 5.7 L 27.5 6.9 Z' }),
    h('circle', { className: 'rgx-compass-hub', cx: 30, cy: 30, r: 1.5 }),
    h('circle', { className: 'rgx-compass-hub-pin', cx: 30, cy: 30, r: 0.5 }),
    h('circle', { className: 'rgx-compass-over-dot', cx: 30, cy: 3.1, r: 1.05 })));

  const read = h('span', { className: 'rgx-compass-read' },
    h('span', { className: 'rgx-compass-value' },
      h(Approx, { live: vm.live }),
      h('span', { className: 'rgx-compass-digits' }, vm.displayTps),
      h('span', { className: 'rgx-compass-unit' }, t('unit')),
      h('span', { className: 'rgx-compass-over', 'aria-hidden': 'true' }, '+')),
    showSub ? h('span', { className: 'rgx-compass-rows' },
      h('span', { className: vm.warn ? 'rgx-compass-row is-warn' : 'rgx-compass-row' },
        h('span', { className: 'rgx-compass-tag' },
          t('ctx'),
          vm.warn ? h('b', { className: 'rgx-compass-alert' }, '!') : null),
        h('span', { className: 'rgx-compass-num' }, vm.ctxDisplay)),
      h('span', { className: 'rgx-compass-row' },
        h('span', { className: 'rgx-compass-tag' }, t('hit')),
        h('span', { className: 'rgx-compass-num' }, vm.hitDisplay))) : null);

  return h('span', { className: 'rgx-compass' }, dial, read);
};
