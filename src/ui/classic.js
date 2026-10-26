/**
 * The classic dual-dial instrument: a 240° speed dial with a 4-tick ring, a
 * tapered needle, and a smaller dual-ring CTX/HIT dial.
 *
 * The view is theme-neutral: every colour comes from a `--rg-*` token defined
 * by the light base and the host dark override. State is data: warn, stale and
 * the data source each get a visual, not just a tooltip.
 */

import { R } from '../runtime.js';
import { dialPosition, formatHitPercent } from '../measure.js';

const h = (...args) => R.h(...args);

const MAIN_TRACK = '71.2 107';
const SUB_TRACK = '71.2 107';
const HIT_TRACK = '48.2 72.3';

const clampPct = (value) => {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
};

const polar = (percent, radius) => {
  const angle = ((150 + clampPct(percent) * 2.4) * Math.PI) / 180;
  return {
    x: 20 + radius * Math.cos(angle),
    y: 20 + radius * Math.sin(angle),
  };
};

const arcPath = (from, to, radius = 17) => {
  if (!(to > from)) return null;
  const start = polar(from, radius);
  const end = polar(to, radius);
  const large = (clampPct(to) - clampPct(from)) * 2.4 > 180 ? 1 : 0;
  return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${radius} ${radius} 0 ${large} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
};

const ticks = (scale) => {
  const values = [0, scale / 3, (scale * 2) / 3, scale];
  return values.map((value, index) => {
    const angle = ((150 + (value / scale) * 240) * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return h('line', {
      key: value,
      className: index === values.length - 1 ? 'rg-tick-end' : undefined,
      x1: 20 + 14.2 * cos,
      y1: 20 + 14.2 * sin,
      x2: 20 + 17 * cos,
      y2: 20 + 17 * sin,
    });
  });
};

const sourceKey = (source) => (
  source === 'projection' ? 'sourceProjection' : source === 'mixed' ? 'sourceMixed' : 'sourceDom'
);

const sourceTextFor = (vm, t) => (
  vm.sourceText || t(sourceKey(vm.source || 'projection'))
);

const qualityFor = (vm) => {
  if (vm.stale) return 'stale';
  if (vm.source === 'dom') return 'dom';
  if (vm.source === 'mixed') return 'mixed';
  return null;
};

/**
 * @param {{
 *   vm: object,
 *   t: Function,
 *   rootRef?: object,
 *   onToggle?: Function,
 * }} props
 */
export const ClassicGauge = ({ vm, t, rootRef = null, onToggle = null }) => {
  const scale = Number(vm.scale) || 180;
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctxValue = clampPct(vm.ctxValue || 0);
  const hitValue = clampPct(vm.hitValue || 0);
  const action = vm.placement === 'input' ? t('switchToDock') : t('switchToInput');
  const sourceText = sourceTextFor(vm, t);
  const quality = qualityFor(vm);
  const qualityLabel = quality === 'stale' ? '!' : quality === 'mixed' ? 'MIX' : 'DOM';
  const qualityTitle = quality === 'stale'
    ? t('sourceUnavailable')
    : quality === 'mixed'
      ? t('qualityMixed')
      : t('qualityDom');

  const ctxDash = `${ctxValue * 0.712} 107`;
  const hitDash = `${hitValue * 0.482} 72.3`;
  const warnArc = arcPath(warnAt, ctxValue);

  const redline = (() => {
    if (vm.sub === false) return null;
    const start = polar(warnAt, 13.6);
    const end = polar(warnAt, 19.4);
    return h('line', {
      className: 'rg-redline',
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
    });
  })();

  const titleParts = [];
  if (vm.stale) titleParts.push(t('sourceUnavailable'));
  titleParts.push(`${t('tipRate', { tps: vm.displayTps })} · ${t('tipCtx', { ctx: vm.ctxDisplay })} · ${t('tipHit', { hit: vm.hitDisplay })}`);
  if (vm.turnText) titleParts.push(vm.turnText);
  const metaParts = [t('scaleTooltip', { n: scale }), t('warnAtTooltip', { n: warnAt })];
  if (vm.calibrationText) metaParts.push(vm.calibrationText);
  titleParts.push(metaParts.join(' · '));
  titleParts.push(`${t('source')} ${sourceText}`);
  if (!vm.static) titleParts.push(action);
  const title = titleParts.join('\n');

  const ariaParts = [
    t(vm.static ? 'ariaGaugeStatic' : 'ariaGaugeClassic', {
      tps: vm.displayTps,
      ctx: vm.ctxDisplay,
      hit: vm.hitDisplay,
    }),
  ];
  if (vm.warn) ariaParts.push(t('warnAria'));
  if (vm.stale) ariaParts.push(t('sourceUnavailable'));
  ariaParts.push(`${t('source')} ${sourceText}`);
  if (vm.calibrationText) ariaParts.push(vm.calibrationText);
  if (!vm.static) {
    const placementLabel = vm.placement === 'input' ? t('placementInput') : t('placementDock');
    ariaParts.push(t('currentPlacement', { where: placementLabel }));
    ariaParts.push(action);
  }
  const aria = ariaParts.join('；');

  const interactive = !vm.static;
  const showSub = vm.sub !== false;

  return h('span', {
    ref: rootRef,
    className: 'rg-gauge',
    'data-live': vm.live ? '1' : '0',
    'data-warn': vm.warn ? '1' : '0',
    'data-stale': vm.stale ? '1' : '0',
    'data-quality': quality || undefined,
    'data-source': vm.source || 'projection',
    'data-variant': vm.placement,
    'data-density': vm.density,
    'data-static': vm.static ? '1' : '0',
    'data-sub': showSub ? '1' : '0',
    role: interactive ? 'button' : 'img',
    tabIndex: interactive ? 0 : undefined,
    'aria-label': aria,
    title,
    style: vm.static
      ? { '--rg-p': String(vm.position ?? 0), '--rg-over': String(vm.over ?? 0) }
      : undefined,
    onClick: interactive ? onToggle : undefined,
    onKeyDown: interactive
      ? (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        onToggle();
      }
      : undefined,
  },
  h('span', { className: 'rg-module' },
    h('svg', { className: 'rg-dial', viewBox: '0 0 40 40', 'aria-hidden': 'true' },
      h('circle', {
        className: 'rg-track', cx: 20, cy: 20, r: 17,
        strokeDasharray: MAIN_TRACK, transform: 'rotate(150 20 20)',
      }),
      h('circle', {
        className: 'rg-arc rg-arc-rate', cx: 20, cy: 20, r: 17,
        transform: 'rotate(150 20 20)',
      }),
      h('g', { className: 'rg-ticks' }, ticks(scale)),
      h('g', { className: 'rg-needle-group' },
        h('line', { className: 'rg-needle', x1: 20, y1: 20, x2: 33, y2: 20 })),
      h('circle', { className: 'rg-hub', cx: 20, cy: 20, r: 1.6 })),
    h('span', { className: 'rg-read' },
      h('span', { className: 'rg-value' },
        h('span', { className: 'rg-approx', 'aria-hidden': 'true' }, vm.live ? '≈' : '\u00A0'),
        h('span', { className: 'rg-digits' }, vm.displayTps)),
      h('span', { className: 'rg-unit' }, t('unit')))),
  h('span', { className: 'rg-module rg-module-minor', hidden: !showSub },
    h('svg', { className: 'rg-dial rg-dial-minor', viewBox: '0 0 40 40', 'aria-hidden': 'true' },
      h('circle', {
        className: 'rg-track', cx: 20, cy: 20, r: 17,
        strokeDasharray: SUB_TRACK, transform: 'rotate(150 20 20)',
      }),
      h('circle', {
        className: 'rg-arc rg-arc-ctx', cx: 20, cy: 20, r: 17,
        strokeDasharray: ctxDash, transform: 'rotate(150 20 20)',
        style: { opacity: ctxValue > 0 ? 1 : 0 },
      }),
      warnArc ? h('path', {
        className: 'rg-arc rg-arc-ctx-warn',
        d: warnArc,
        fill: 'none',
      }) : null,
      redline,
      h('circle', {
        className: 'rg-track rg-track-hit', cx: 20, cy: 20, r: 11.5,
        strokeDasharray: HIT_TRACK, transform: 'rotate(150 20 20)',
      }),
      h('circle', {
        className: 'rg-arc rg-arc-hit', cx: 20, cy: 20, r: 11.5,
        strokeDasharray: hitDash, transform: 'rotate(150 20 20)',
        style: { opacity: hitValue > 0 ? 1 : 0 },
      })),
    h('span', { className: 'rg-read-minor' },
      h('span', { className: 'rg-row rg-row-ctx' },
        h('span', { className: 'rg-tag' },
          t('ctx'),
          vm.warn ? h('span', { className: 'rg-alert', 'aria-hidden': 'true' }, '!') : null),
        h('span', { className: 'rg-num' }, vm.ctxText)),
      h('span', { className: 'rg-row' },
        h('span', { className: 'rg-tag' }, t('hit')),
        h('span', { className: 'rg-num' }, vm.hitDisplay)))),
  h('span', { className: 'rg-meta', hidden: !showSub },
    h('b', { className: 'rg-meta-ctx' },
      vm.warn ? h('span', { className: 'rg-alert', 'aria-hidden': 'true' }, '!') : null,
      `${t('ctx')} ${vm.ctxDisplay}`),
    h('span', null, '·'),
    h('b', null, `${t('hit')} ${vm.hitDisplay}`)),
  quality ? h('span', {
    className: 'rg-quality',
    'data-quality': quality,
    title: qualityTitle,
  }, qualityLabel) : null,
  interactive ? h('span', {
    className: 'rg-affordance',
    'aria-hidden': 'true',
  }, '⇅') : null);
};

/**
 * @param {{
 *   placement?: 'dock'|'input',
 *   density?: 'full'|'compact'|'minimal',
 *   tps?: number,
 *   ctx?: number,
 *   hit?: number,
 *   scale?: number,
 *   warnAt?: number,
 *   sub?: boolean,
 *   stale?: boolean,
 *   source?: 'projection'|'mixed'|'dom',
 * }} options
 */
export const createClassicVm = ({
  placement = 'dock',
  density = 'full',
  tps = 142,
  ctx = 65,
  hit = 99.94,
  scale = 180,
  warnAt = 80,
  sub = true,
  stale = false,
  source = 'projection',
} = {}) => {
  const hitText = formatHitPercent(hit);
  const position = dialPosition(tps, scale);
  return {
    placement,
    density,
    live: tps > 2,
    displayTps: String(Math.round(tps)),
    ctxValue: ctx,
    ctxText: String(Math.round(ctx)),
    ctxDisplay: `${Math.round(ctx)}%`,
    hitValue: hit,
    hitDisplay: `${hitText}%`,
    warn: ctx >= warnAt,
    warnAt,
    stale,
    sub,
    source,
    calibrationText: '×1.12',
    scale,
    position: position.position,
    over: position.over,
    static: true,
  };
};

/**
 * @param {{
 *   placement?: 'dock'|'input',
 *   density?: 'full'|'compact'|'minimal',
 *   scale?: number,
 *   warnAt?: number,
 *   sub?: boolean,
 *   ctx?: number,
 *   t,
 * }} props
 */
export const ClassicPreview = ({
  placement = 'dock',
  density = 'full',
  scale = 180,
  warnAt = 80,
  sub = true,
  ctx = 65,
  t,
}) => h(ClassicGauge, {
  vm: createClassicVm({ placement, density, scale, warnAt, sub, ctx }),
  t,
});
