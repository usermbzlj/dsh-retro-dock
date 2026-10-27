/**
 * The shell shared by the three instrument languages beside classic. It owns
 * semantics, state flags, the placement affordance, the quality flag and the
 * compact minimal line; the selected body owns the mechanism.
 */

import { R } from '../runtime.js';
import { BODIES } from './designs/index.js';
import { MiniLine } from './designs/kit.js';
import { createVm } from './vm.js';

const h = (...args) => R.h(...args);

const sourceKey = (source) => (
  source === 'projection' ? 'sourceProjection' : source === 'mixed' ? 'sourceMixed' : 'sourceDom'
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
 *   onToggle?: Function|null,
 * }} props
 */
export const DesignGauge = ({ vm, t, rootRef = null, onToggle = null }) => {
  const style = vm.style && BODIES[vm.style] ? vm.style : 'swiss';
  const Body = BODIES[style];
  const sourceText = vm.sourceText || t(sourceKey(vm.source || 'projection'));
  const quality = qualityFor(vm);
  const qualityTitle = quality === 'stale'
    ? t('sourceUnavailable')
    : quality === 'mixed'
      ? t('qualityMixed')
      : t('qualityDom');
  const interactive = vm.static !== true && typeof onToggle === 'function';
  const action = vm.placement === 'input' ? t('switchToDock') : t('switchToInput');
  const showSub = vm.sub !== false;
  const over = (Number(vm.over) || 0) > 0 || Number(vm.tps) > Number(vm.scale || 0);

  const titleParts = [];
  if (interactive) titleParts.push(action);
  if (vm.stale) titleParts.push(t('sourceUnavailable'));
  titleParts.push(`${t('tipRate', { tps: vm.displayTps })} ${t('tipCtx', { ctx: vm.ctxDisplay })} ${t('tipHit', { hit: vm.hitDisplay })}`);
  if (vm.turnText) titleParts.push(vm.turnText);
  const metaParts = [t('scaleTooltip', { n: vm.scale }), t('warnAtTooltip', { n: vm.warnAt })];
  if (vm.calibrationText) metaParts.push(vm.calibrationText);
  titleParts.push(metaParts.join(' '));
  titleParts.push(`${t('source')} ${sourceText}`);

  const ariaParts = [
    t(vm.static ? 'ariaGaugeStatic' : 'ariaGaugeClassic', {
      tps: vm.displayTps,
      ctx: vm.ctxKnown === false ? t('ctxUnknownAria') : vm.ctxDisplay,
      hit: vm.hitDisplay,
    }),
  ];
  if (vm.ctxKnown === false) ariaParts.push(t('ctxUnknownAria'));
  if (vm.warn) ariaParts.push(t('warnAria'));
  if (vm.stale) ariaParts.push(t('sourceUnavailable'));
  ariaParts.push(`${t('source')} ${sourceText}`);
  if (vm.calibrationText) ariaParts.push(vm.calibrationText);
  if (interactive) {
    const placementLabel = vm.placement === 'input' ? t('placementInput') : t('placementDock');
    ariaParts.push(t('currentPlacement', { where: placementLabel }));
    ariaParts.push(action);
  }

  return h('span', {
    ref: rootRef,
    className: 'rg-gauge rgx-gauge',
    'data-style': style,
    'data-live': vm.live ? '1' : '0',
    'data-warn': vm.warn ? '1' : '0',
    'data-over': over ? '1' : '0',
    'data-stale': vm.stale ? '1' : '0',
    'data-quality': quality || undefined,
    'data-source': vm.source || 'projection',
    'data-variant': vm.placement,
    'data-density': vm.density,
    'data-static': vm.static ? '1' : '0',
    'data-sub': showSub ? '1' : '0',
    role: interactive ? 'button' : 'img',
    tabIndex: interactive ? 0 : undefined,
    'aria-label': ariaParts.join('；'),
    title: titleParts.join('\n'),
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
  h('span', { className: 'rgx-body' }, h(Body, { vm, t })),
  h(MiniLine, { vm, t }),
  quality ? h('span', {
    className: 'rgx-quality',
    'data-quality': quality,
    title: qualityTitle,
    'aria-hidden': 'true',
  }, t(qualityLabelKey(quality))) : null,
  interactive ? h('span', {
    className: 'rgx-affordance',
    'aria-hidden': 'true',
  }, '⇅') : null);
};

/**
 * Static preview for the settings page and the catalogue. Reads the same
 * geometry and states as the live slot.
 *
 * @param {{
 *   style?: string,
 *   placement?: 'dock'|'input',
 *   density?: 'full'|'compact'|'minimal',
 *   scale?: number,
 *   warnAt?: number,
 *   sub?: boolean,
 *   ctx?: number,
 *   t: Function,
 * }} props
 */
export const DesignPreview = ({
  style = 'vu',
  placement = 'input',
  density = 'full',
  scale = 180,
  warnAt = 80,
  sub = true,
  ctx = 65,
  readout = 'digits',
  ctxLamps = false,
  t,
}) => h(DesignGauge, {
  vm: createVm({ style, placement, density, scale, warnAt, sub, ctx, readout, ctxLamps }),
  t,
});
