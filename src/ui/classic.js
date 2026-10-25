/**
 * The pre-1.1.0 gauge: a 240° speed dial with a 4-tick ring, tapered needle
 * and a smaller dual-ring CTX/HIT dial. This is the only visual style now; the
 * measurement engine, calibration and settings store are the ones from 1.1.0.
 */

import { R } from '../runtime.js';
import { dialPosition, formatHitPercent } from '../measure.js';

const h = (...args) => R.h(...args);

const MAIN_TRACK = '71.2 107';
const SUB_TRACK = '71.2 107';
const HIT_TRACK = '48.2 72.3';

const ticks = (scale) => {
  const values = [0, scale / 3, (scale * 2) / 3, scale];
  return values.map((value) => {
    const angle = ((150 + (value / scale) * 240) * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return h('line', {
      key: value,
      x1: 20 + 14.2 * cos,
      y1: 20 + 14.2 * sin,
      x2: 20 + 17 * cos,
      y2: 20 + 17 * sin,
    });
  });
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
  const action = vm.placement === 'input' ? t('switchToDock') : t('switchToInput');
  const display = vm.live ? `≈${vm.displayTps}` : '0';
  const ctxDash = `${(vm.ctxValue || 0) * 0.712} 107`;
  const hitDash = `${(vm.hitValue || 0) * 0.482} 72.3`;

  const titleParts = [];
  if (vm.stale) titleParts.push(t('sourceUnavailable'));
  titleParts.push(t('tipRate', { tps: vm.displayTps }));
  titleParts.push(vm.calibrationText);
  titleParts.push(t('tipCtx', { ctx: vm.ctxDisplay }));
  titleParts.push(t('tipHit', { hit: vm.hitDisplay }));
  if (vm.source !== 'projection') titleParts.push(`${t('source')} ${vm.sourceText}`);
  if (!vm.static) titleParts.push(action);
  const title = titleParts.join(' · ');

  const aria = vm.static
    ? t('ariaGaugeStatic', { tps: vm.displayTps, ctx: vm.ctxDisplay, hit: vm.hitDisplay })
    : t('ariaGaugeClassic', {
      tps: vm.displayTps,
      ctx: vm.ctxDisplay,
      hit: vm.hitDisplay,
      action,
    });

  const interactive = !vm.static;
  const showSub = vm.sub !== false;

  return h('span', {
    ref: rootRef,
    className: 'rg-gauge',
    'data-live': vm.live ? '1' : '0',
    'data-warn': vm.warn ? '1' : '0',
    'data-stale': vm.stale ? '1' : '0',
    'data-source': vm.source,
    'data-variant': vm.placement,
    'data-density': vm.density,
    'data-static': vm.static ? '1' : '0',
    'data-sub': showSub ? '1' : '0',
    role: interactive ? 'button' : 'img',
    tabIndex: interactive ? 0 : undefined,
    'aria-pressed': interactive ? (vm.placement === 'input' ? 'true' : 'false') : undefined,
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
      h('span', { className: 'rg-value' }, display),
      h('span', { className: 'rg-unit' }, 'tok/s'))),
  h('span', { className: 'rg-module rg-module-minor', hidden: !showSub },
    h('svg', { className: 'rg-dial rg-dial-minor', viewBox: '0 0 40 40', 'aria-hidden': 'true' },
      h('circle', {
        className: 'rg-track', cx: 20, cy: 20, r: 17,
        strokeDasharray: SUB_TRACK, transform: 'rotate(150 20 20)',
      }),
      h('circle', {
        className: 'rg-arc rg-arc-ctx', cx: 20, cy: 20, r: 17,
        strokeDasharray: ctxDash, transform: 'rotate(150 20 20)',
        style: { opacity: vm.ctxValue < 0.6 ? 0 : 1 },
      }),
      h('circle', {
        className: 'rg-track rg-track-hit', cx: 20, cy: 20, r: 11.5,
        strokeDasharray: HIT_TRACK, transform: 'rotate(150 20 20)',
      }),
      h('circle', {
        className: 'rg-arc rg-arc-hit', cx: 20, cy: 20, r: 11.5,
        strokeDasharray: hitDash, transform: 'rotate(150 20 20)',
        style: { opacity: vm.hitValue < 0.6 ? 0 : 1 },
      })),
    h('span', { className: 'rg-read-minor' },
      h('span', { className: 'rg-row' },
        h('span', { className: 'rg-tag' }, t('ctx')),
        h('span', { className: 'rg-num' }, vm.ctxText)),
      h('span', { className: 'rg-row' },
        h('span', { className: 'rg-tag' }, t('hit')),
        h('span', { className: 'rg-num' }, vm.hitDisplay)))),
  h('span', { className: 'rg-meta', hidden: !showSub },
    h('b', null, `${t('ctx')} ${vm.ctxDisplay}`),
    h('span', null, '·'),
    h('b', null, `${t('hit')} ${vm.hitDisplay}`)));
};

/**
 * @param {{
 *   placement?: 'dock'|'input',
 *   density?: 'full'|'compact'|'minimal',
 *   tps?: number,
 *   ctx?: number,
 *   hit?: number,
 *   scale?: number,
 * }} options
 */
export const createClassicVm = ({
  placement = 'dock',
  density = 'full',
  tps = 142,
  ctx = 65,
  hit = 99.94,
  scale = 180,
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
    warn: ctx >= 80,
    stale: false,
    sub: true,
    source: 'projection',
    sourceText: '',
    calibrationText: '×1.12',
    scale,
    position: position.position,
    over: position.over,
    static: true,
  };
};

/** @param {{ placement?: string, density?: string, t: Function }} props */
export const ClassicPreview = ({ placement = 'dock', density = 'full', t }) => h(ClassicGauge, {
  vm: createClassicVm({ placement, density }),
  t,
});
