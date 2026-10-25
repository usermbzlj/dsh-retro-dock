/**
 * Pure gauge view. Takes a view model and strings, renders the selected style.
 * The settings page and the screenshot gallery render this same component with
 * a static view model, so previews cannot drift from the real gauge.
 */

import { R } from '../runtime.js';
import { GearIcon } from './icons.js';
import { INSTRUMENTS, SUB_INSTRUMENTS } from './instruments.js';
import { ROWS, InlineReadout } from './rows.js';

const h = (...args) => R.h(...args);

const Readout = ({ vm, t }) => h('span', { className: 'rg-read' },
  h('span', { className: 'rg-value' },
    vm.live ? h('span', { className: 'rg-approx' }, '≈') : null,
    vm.displayTps),
  h('span', { className: 'rg-unit' }, t('unit')));

/**
 * @param {{
 *   vm: object,
 *   t: (key: string, vars?: Record<string, unknown>) => string,
 *   rootRef?: object,
 *   gearRef?: object,
 *   onToggle?: Function,
 *   onOpenSettings?: Function,
 *   settingsOpen?: boolean,
 * }} props
 */
export const GaugeView = ({
  vm,
  t,
  rootRef = null,
  gearRef = null,
  onToggle = null,
  onOpenSettings = null,
  settingsOpen = false,
}) => {
  const Instrument = INSTRUMENTS[vm.style];
  const Sub = SUB_INSTRUMENTS[vm.style];
  const Rows = ROWS[vm.style];
  const action = vm.placement === 'input' ? t('switchToDock') : t('switchToInput');
  const settingsLabel = t('openSettings');

  const pieces = [];
  if (vm.stale) pieces.push(t('sourceUnavailable'));
  pieces.push(t('tipRate', { tps: vm.displayTps }));
  pieces.push(vm.calibrationText);
  pieces.push(t('tipCtx', { ctx: vm.ctxDisplay }));
  pieces.push(t('tipHit', { hit: vm.hitDisplay }));
  if (vm.source !== 'projection') pieces.push(`${t('source')} ${vm.sourceText}`);
  if (!vm.static) pieces.push(action);
  const title = pieces.join(' · ');

  const aria = vm.static
    ? t('ariaGaugeStatic', { tps: vm.displayTps, ctx: vm.ctxDisplay, hit: vm.hitDisplay })
    : t('ariaGauge', {
      tps: vm.displayTps,
      ctx: vm.ctxDisplay,
      hit: vm.hitDisplay,
      action,
      settings: settingsLabel,
    });

  const content = [
    h(Instrument, { key: 'instrument', vm }),
    h(Readout, { key: 'readout', vm, t }),
    vm.sub && vm.density !== 'compact' && vm.density !== 'minimal' && Sub
      ? h(Sub, { key: 'sub', vm })
      : null,
    vm.sub ? h(Rows, { key: 'rows', vm, t }) : null,
    h(InlineReadout, { key: 'inline', vm, t }),
  ];

  const toggle = vm.static
    ? h('span', {
      className: 'rg-toggle',
      role: 'img',
      title,
      'aria-label': aria,
    }, content)
    : h('button', {
      type: 'button',
      className: 'rg-toggle',
      title,
      'aria-label': aria,
      onClick: onToggle,
    }, content);

  return h('span', {
    ref: rootRef,
    className: 'rg-root',
    'data-style': vm.style,
    'data-placement': vm.placement,
    'data-density': vm.density,
    'data-live': vm.live ? '1' : '0',
    'data-warn': vm.warn ? '1' : '0',
    'data-stale': vm.stale ? '1' : '0',
    'data-sub': vm.sub ? '1' : '0',
    'data-static': vm.static ? '1' : '0',
    'data-source': vm.source,
    'data-open': settingsOpen ? '1' : '0',
    'data-touch': vm.touch ? '1' : '0',
    style: vm.static
      ? { '--rg-p': String(vm.position ?? 0), '--rg-over': String(vm.over ?? 0) }
      : undefined,
  },
  h('span', { className: 'rg-frame' },
    toggle,
    onOpenSettings
      ? h('button', {
        ref: gearRef,
        type: 'button',
        className: 'rg-gear',
        title: t('settingsTitle'),
        'aria-label': t('ariaSettings'),
        'aria-haspopup': 'dialog',
        'aria-expanded': settingsOpen ? 'true' : 'false',
        onClick: onOpenSettings,
      }, h(GearIcon))
      : null));
};
