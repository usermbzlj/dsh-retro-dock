/** Style-specific instruments. Pure views: all numbers arrive through `vm`. */

import { R } from '../runtime.js';

const h = (...args) => R.h(...args);

const point = (radius, degrees) => {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: 22 + radius * Math.cos(radians),
    y: 22 + radius * Math.sin(radians),
  };
};

const arcPath = (radius, startDegrees, endDegrees) => {
  const start = point(radius, startDegrees);
  const end = point(radius, endDegrees);
  const largeArc = Math.abs(endDegrees - startDegrees) > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const heritageTicks = () => {
  const ticks = [];
  for (let index = 0; index <= 24; index += 1) {
    const degrees = 240 + index * 10;
    const major = index % 8 === 0;
    const from = point(major ? 12.5 : 13.9, degrees);
    const to = point(major ? 15.8 : 15.3, degrees);
    ticks.push(h('line', {
      key: `tick-${index}`,
      className: [
        'rg-heritage-tick',
        major ? 'rg-heritage-tick-major' : 'rg-heritage-tick-minor',
        index === 24 ? 'rg-heritage-tick-warn' : '',
      ].filter(Boolean).join(' '),
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
    }));
  }
  return ticks;
};

const heritageSubTicks = () => {
  const ticks = [];
  for (let index = 0; index <= 12; index += 1) {
    const degrees = 240 + index * 20;
    const from = point(14.7, degrees);
    const to = point(16, degrees);
    ticks.push(h('line', {
      key: `sub-tick-${index}`,
      className: 'rg-heritage-sub-tick',
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
    }));
  }
  return ticks;
};

export const HeritageDial = () => h('span', { className: 'rg-face-wrap' },
  h('svg', { className: 'rg-dial rg-heritage', viewBox: '0 0 44 44', 'aria-hidden': 'true' },
    h('circle', {
      className: 'rg-heritage-track',
      cx: 22, cy: 22, r: 17.2, pathLength: 100,
      strokeDasharray: '66.67 100',
      transform: 'rotate(150 22 22)',
    }),
    h('path', {
      className: 'rg-heritage-red',
      d: arcPath(17.2, 440, 480),
    }),
    h('circle', {
      className: 'rg-heritage-arc',
      cx: 22, cy: 22, r: 17.2, pathLength: 100,
      transform: 'rotate(150 22 22)',
    }),
    h('circle', { className: 'rg-heritage-inner', cx: 22, cy: 22, r: 11.8 }),
    ...heritageTicks(),
    h('g', { className: 'rg-needle-group' },
      h('path', {
        className: 'rg-heritage-needle',
        d: 'M22 20.85 L37.2 21.86 L37.2 22.14 L22 23.15 L18.7 22.42 L18.7 21.58 Z',
      }),
      h('circle', { className: 'rg-heritage-tip', cx: 36.4, cy: 22, r: .55 })),
    h('circle', { className: 'rg-heritage-hub', cx: 22, cy: 22, r: 2.4 }),
    h('circle', { className: 'rg-heritage-hub-core', cx: 22, cy: 22, r: .95 })));

export const HeritageSub = ({ vm }) => h('span', {
  className: 'rg-face-wrap rg-face-sub rg-heritage-sub',
},
  h('svg', { className: 'rg-dial', viewBox: '0 0 44 44', 'aria-hidden': 'true' },
    h('circle', {
      className: 'rg-heritage-sub-track',
      cx: 22, cy: 22, r: 16, pathLength: 100,
      strokeDasharray: '66.67 100',
      transform: 'rotate(150 22 22)',
    }),
    h('circle', {
      className: 'rg-heritage-sub-ctx',
      cx: 22, cy: 22, r: 16, pathLength: 100,
      transform: 'rotate(150 22 22)',
      strokeDasharray: `${(vm.ctxValue || 0) * 0.6667} 100`,
      style: { opacity: vm.ctxValue ? .9 : 0 },
    }),
    h('circle', {
      className: 'rg-heritage-sub-hit-track',
      cx: 22, cy: 22, r: 10.6, pathLength: 100,
      strokeDasharray: '66.67 100',
      transform: 'rotate(150 22 22)',
    }),
    h('circle', {
      className: 'rg-heritage-sub-hit',
      cx: 22, cy: 22, r: 10.6, pathLength: 100,
      transform: 'rotate(150 22 22)',
      strokeDasharray: `${(vm.hitValue || 0) * 0.6667} 100`,
      style: { opacity: vm.hitValue ? 1 : 0 },
    }),
    ...heritageSubTicks(),
    h('circle', { className: 'rg-heritage-sub-hub', cx: 22, cy: 22, r: .85 })));

const neonTicks = () => {
  const ticks = [];
  for (let index = 0; index <= 24; index += 1) {
    const degrees = 240 + index * 10;
    const major = index % 8 === 0;
    const from = point(18.1, degrees);
    const to = point(major ? 19.6 : 19.1, degrees);
    ticks.push(h('line', {
      key: `neon-tick-${index}`,
      className: major ? 'rg-neon-tick rg-neon-tick-major' : 'rg-neon-tick',
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
    }));
  }
  return ticks;
};

export const NeonDial = () => {
  const rawId = typeof R.useId === 'function' ? R.useId() : 'static';
  const gradientId = `rg-neon-grad-${String(rawId).replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return h('span', { className: 'rg-screen' },
    h('svg', { className: 'rg-dial rg-neon', viewBox: '0 0 44 44', 'aria-hidden': 'true' },
      h('defs', null,
        h('linearGradient', { id: gradientId, x1: '10%', y1: '90%', x2: '90%', y2: '10%' },
          h('stop', { offset: '0%', className: 'rg-neon-grad-a' }),
          h('stop', { offset: '58%', className: 'rg-neon-grad-b' }),
          h('stop', { offset: '100%', className: 'rg-neon-grad-c' }))),
      h('circle', {
        className: 'rg-neon-track',
        cx: 22, cy: 22, r: 16.7, pathLength: 100,
        strokeDasharray: '66.67 100',
        transform: 'rotate(150 22 22)',
      }),
      h('circle', {
        className: 'rg-neon-arc',
        cx: 22, cy: 22, r: 16.7, pathLength: 100,
        transform: 'rotate(150 22 22)',
        style: { stroke: `url(#${gradientId})` },
      }),
      h('circle', { className: 'rg-neon-inner', cx: 22, cy: 22, r: 12.2 }),
      ...neonTicks(),
      h('g', { className: 'rg-neon-end-group' },
        h('circle', { className: 'rg-neon-end', cx: 22, cy: 4.9, r: 1.5 }),
        h('circle', { className: 'rg-neon-end-core', cx: 22, cy: 4.9, r: .55 }))));
};

export const NeonSub = ({ vm }) => h('span', { className: 'rg-screen rg-screen-sub' },
  h('svg', { className: 'rg-dial', viewBox: '0 0 44 44', 'aria-hidden': 'true' },
    h('circle', {
      className: 'rg-neon-sub-track',
      cx: 22, cy: 22, r: 15.4, pathLength: 100,
      strokeDasharray: '66.67 100',
      transform: 'rotate(150 22 22)',
    }),
    h('circle', {
      className: 'rg-neon-sub-ctx',
      cx: 22, cy: 22, r: 15.4, pathLength: 100,
      transform: 'rotate(150 22 22)',
      strokeDasharray: `${(vm.ctxValue || 0) * 0.6667} 100`,
      style: { opacity: vm.ctxValue ? 1 : 0 },
    }),
    h('circle', {
      className: 'rg-neon-sub-hit-track',
      cx: 22, cy: 22, r: 10.2, pathLength: 100,
      strokeDasharray: '66.67 100',
      transform: 'rotate(150 22 22)',
    }),
    h('circle', {
      className: 'rg-neon-sub-hit',
      cx: 22, cy: 22, r: 10.2, pathLength: 100,
      transform: 'rotate(150 22 22)',
      strokeDasharray: `${(vm.hitValue || 0) * 0.6667} 100`,
      style: { opacity: vm.hitValue ? 1 : 0 },
    }),
    h('circle', { className: 'rg-neon-sub-core', cx: 22, cy: 22, r: .8 })));

export const MinimalDial = () => h('svg', {
  className: 'rg-dial rg-minimal',
  viewBox: '0 0 44 44',
  'aria-hidden': 'true',
},
  h('circle', {
    className: 'rg-minimal-track',
    cx: 22, cy: 22, r: 18, pathLength: 100,
    strokeDasharray: '66.67 100',
    transform: 'rotate(150 22 22)',
  }),
  h('circle', {
    className: 'rg-minimal-arc',
    cx: 22, cy: 22, r: 18, pathLength: 100,
    transform: 'rotate(150 22 22)',
  }),
  h('g', { className: 'rg-minimal-dot-group' },
    h('circle', { className: 'rg-minimal-dot', cx: 22, cy: 4, r: 1.7 })));

export const TerminalMeter = () => h('span', { className: 'rg-term', 'aria-hidden': 'true' },
  h('span', { className: 'rg-term-bar' }, h('i', { className: 'rg-term-fill' })),
  h('span', { className: 'rg-term-cursor' }));

export const INSTRUMENTS = {
  heritage: HeritageDial,
  neon: NeonDial,
  minimal: MinimalDial,
  terminal: TerminalMeter,
};

export const SUB_INSTRUMENTS = {
  heritage: HeritageSub,
  neon: NeonSub,
  minimal: null,
  terminal: null,
};
