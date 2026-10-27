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
import { Drum, Lamps } from './designs/kit.js';

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

// 刻度：12 等分，每 4 格一根主刻度（0 / ⅓ / ⅔ / 满量程），其余是贴着外缘的短副刻度
const ticks = () => Array.from({ length: 13 }, (_, index) => {
  const angle = ((150 + (index / 12) * 240) * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const major = index % 4 === 0;
  const inner = major ? 14.2 : 15.7;
  return h('line', {
    key: index,
    className: index === 12 ? 'rg-tick-end' : major ? undefined : 'rg-tick-minor',
    x1: 20 + inner * cos,
    y1: 20 + inner * sin,
    x2: 20 + 17 * cos,
    y2: 20 + 17 * sin,
  });
});

/**
 * 均速标记：量程环外侧一个指向圆心的小三角。整组按角度旋转，
 * 这样位置变化可以用 CSS transition 平滑过去。
 *
 * @param {number|null|undefined} position 0–100
 */
const holdMark = (position) => {
  if (position === null || position === undefined || !Number.isFinite(Number(position))) return null;
  return h('g', {
    className: 'rg-hold',
    style: { transform: `rotate(${(150 + clampPct(position) * 2.4).toFixed(2)}deg)` },
  }, h('polygon', { points: '38.7,20 40.9,18.9 40.9,21.1' }));
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

const qualityLabelKey = (quality) => (
  quality === 'stale' ? 'qualityLabelStale' : quality === 'mixed' ? 'qualityLabelMixed' : 'qualityLabelDom'
);

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
  const ctxKnown = vm.ctxKnown !== false;
  const ctxValue = ctxKnown ? clampPct(vm.ctxValue || 0) : 0;
  const hitValue = clampPct(vm.hitValue || 0);
  const action = vm.placement === 'input' ? t('switchToDock') : t('switchToInput');
  const sourceText = sourceTextFor(vm, t);
  const quality = qualityFor(vm);
  const qualityTitle = quality === 'stale'
    ? t('sourceUnavailable')
    : quality === 'mixed'
      ? t('qualityMixed')
      : t('qualityDom');
  const over = (Number(vm.over) || 0) > 0;

  const ctxDash = `${ctxValue * 0.712} 107`;
  const hitDash = `${hitValue * 0.482} 72.3`;
  const warnArc = ctxKnown ? arcPath(warnAt, ctxValue) : null;

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
  if (!vm.static) titleParts.push(action);
  if (vm.stale) titleParts.push(t('sourceUnavailable'));
  const rateTip = vm.holding ? t('tipHold', { tps: vm.displayTps }) : t('tipRate', { tps: vm.displayTps });
  titleParts.push(`${rateTip} ${t('tipCtx', { ctx: vm.ctxDisplay })} ${t('tipHit', { hit: vm.hitDisplay })}`);
  if (vm.turnText) titleParts.push(vm.turnText);
  const metaParts = [t('scaleTooltip', { n: scale }), t('warnAtTooltip', { n: warnAt })];
  if (vm.calibrationText) metaParts.push(vm.calibrationText);
  titleParts.push(metaParts.join(' '));
  titleParts.push(`${t('source')} ${sourceText}`);
  const title = titleParts.join('\n');

  const ariaParts = [
    t(vm.holding ? 'ariaGaugeHold' : vm.static ? 'ariaGaugeStatic' : 'ariaGaugeClassic', {
      tps: vm.displayTps,
      ctx: ctxKnown ? vm.ctxDisplay : t('ctxUnknownAria'),
      hit: vm.hitDisplay,
    }),
  ];
  if (!ctxKnown) ariaParts.push(t('ctxUnknownAria'));
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
    'data-hold': vm.holding ? '1' : '0',
    'data-warn': vm.warn ? '1' : '0',
    'data-over': over ? '1' : '0',
    'data-stale': vm.stale ? '1' : '0',
    'data-ctx': ctxKnown ? '1' : '0',
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
      h('g', { className: 'rg-ticks' }, ticks()),
      holdMark(vm.holdPosition),
      // 指针朝 +x 画，整组按 --rg-p 旋转：锥形针身 + 一小段配重尾
      h('g', { className: 'rg-needle-group' },
        h('polygon', { className: 'rg-needle-tail', points: '20,19.25 16.4,19.55 16.4,20.45 20,20.75' }),
        h('polygon', { className: 'rg-needle', points: '20,19.1 33.4,19.86 33.4,20.14 20,20.9' })),
      h('circle', { className: 'rg-hub', cx: 20, cy: 20, r: 2.05 }),
      h('circle', { className: 'rg-hub-cap', cx: 20, cy: 20, r: 0.8 })),
    h('span', { className: 'rg-read' },
      h('span', { className: 'rg-value' },
        h('span', { className: 'rg-approx', 'aria-hidden': 'true' }, vm.live ? '≈' : '\u00A0'),
        vm.readout === 'drum'
          ? h(Drum, { value: vm.displayTps })
          : h('span', { className: 'rg-digits' }, vm.displayTps),
        over ? h('span', { className: 'rg-over-mark', 'aria-hidden': 'true' }, '+') : null),
      h('span', { className: 'rg-unit' }, t(vm.holding ? 'holdUnit' : 'unit')))),
  h('span', { className: 'rg-module rg-module-minor', hidden: !showSub },
    h('svg', { className: 'rg-dial rg-dial-minor', viewBox: '0 0 40 40', 'aria-hidden': 'true' },
      h('circle', {
        className: ctxKnown ? 'rg-track' : 'rg-track is-unknown', cx: 20, cy: 20, r: 17,
        strokeDasharray: ctxKnown ? SUB_TRACK : '1.6 2.2', transform: 'rotate(150 20 20)',
      }),
      ctxKnown ? h('circle', {
        className: 'rg-arc rg-arc-ctx', cx: 20, cy: 20, r: 17,
        strokeDasharray: ctxDash, transform: 'rotate(150 20 20)',
        style: { opacity: ctxValue > 0 ? 1 : 0 },
      }) : null,
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
        vm.ctxLamps ? h(Lamps, { vm }) : null,
        h('span', { className: 'rg-num' }, vm.ctxDisplay)),
      h('span', { className: 'rg-row rg-row-hit' },
        h('span', { className: 'rg-tag' }, t('hit')),
        h('span', { className: 'rg-num' }, vm.hitDisplay)))),
  h('span', { className: 'rg-meta', hidden: !showSub },
    h('b', { className: 'rg-meta-ctx' },
      vm.warn ? h('span', { className: 'rg-alert', 'aria-hidden': 'true' }, '!') : null,
      t('ctx'),
      vm.ctxLamps ? h(Lamps, { vm }) : null,
      ` ${vm.ctxDisplay}`),
    h('b', null, `${t('hit')} ${vm.hitDisplay}`)),
  quality ? h('span', {
    className: 'rg-quality',
    'data-quality': quality,
    title: qualityTitle,
  }, t(qualityLabelKey(quality))) : null,
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
  readout = 'digits',
  ctxLamps = false,
  avg = null,
} = {}) => {
  const numericCtx = ctx === null || ctx === undefined || !Number.isFinite(Number(ctx)) ? null : Number(ctx);
  const hitText = formatHitPercent(hit);
  const position = dialPosition(tps, scale);
  // avg：示例的本轮均速；tps 为 0 时就是“停下后保留均速”的样子
  const hasAvg = Number.isFinite(Number(avg)) && avg !== null;
  const holding = hasAvg && tps <= 2;
  return {
    placement,
    density,
    live: tps > 2,
    displayTps: String(Math.round(holding ? avg : tps)),
    holding,
    holdPosition: hasAvg ? dialPosition(Number(avg), scale).position : null,
    ctxValue: numericCtx ?? 0,
    ctxKnown: numericCtx !== null,
    ctxText: numericCtx === null ? '—' : String(Math.round(numericCtx)),
    ctxDisplay: numericCtx === null ? '—' : `${Math.round(numericCtx)}%`,
    hitValue: hit,
    hitDisplay: `${hitText}%`,
    warn: numericCtx !== null && numericCtx >= warnAt,
    warnAt,
    stale,
    sub,
    source,
    readout,
    ctxLamps,
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
  readout = 'digits',
  ctxLamps = false,
  hold = false,
  t,
}) => h(ClassicGauge, {
  // 预览里示例均速取 121，比示例瞬时值 142 低一些，标记和指针能分开看
  vm: createClassicVm({ placement, density, scale, warnAt, sub, ctx, readout, ctxLamps, avg: hold ? 121 : null }),
  t,
});
