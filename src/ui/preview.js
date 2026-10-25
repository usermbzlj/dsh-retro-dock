/** Static view models used by the settings preview and the screenshot gallery. */

import { R } from '../runtime.js';
import { dialPosition, formatHitPercent } from '../measure.js';
import { GaugeView } from './view.js';

/**
 * @param {{
 *   style: string,
 *   density?: 'full'|'compact'|'minimal',
 *   placement?: 'dock'|'input',
 *   tps?: number,
 *   ctx?: number,
 *   hit?: number,
 * }} options
 */
export const createPreviewVm = ({
  style,
  density = 'full',
  placement = 'dock',
  tps = 142,
  ctx = 65,
  hit = 99.94,
}) => {
  const hitText = formatHitPercent(hit);
  const position = dialPosition(tps, 180);
  return {
    style,
    density,
    placement,
    live: tps > 2,
    tps,
    displayTps: String(Math.round(tps)),
    ctxValue: ctx,
    ctxText: String(Math.round(ctx)),
    ctxDisplay: `${Math.round(ctx)}%`,
    hitValue: hit,
    hitText,
    hitDisplay: `${hitText}%`,
    warn: ctx >= 80,
    stale: false,
    sub: true,
    static: true,
    source: 'projection',
    sourceText: '',
    calibrationText: '×1.12',
    position: position.position,
    over: position.over,
    touch: false,
  };
};

/**
 * @param {{
 *   style: string,
 *   density?: 'full'|'compact'|'minimal',
 *   placement?: 'dock'|'input',
 *   t: Function,
 * }} props
 */
export const StaticGauge = ({ style, density = 'full', placement = 'dock', t }) => R.h(GaugeView, {
  vm: createPreviewVm({ style, density, placement }),
  t,
  settingsOpen: false,
});
