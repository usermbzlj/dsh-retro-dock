/**
 * Static view model for design previews. The live slot builds its own vm from
 * the engine; this factory keeps the catalogue, the settings previews and the
 * tests on the same shape.
 */

import { dialPosition, formatHitPercent } from '../measure.js';

/**
 * @param {{
 *   style?: string,
 *   placement?: 'dock'|'input',
 *   density?: 'full'|'compact'|'minimal',
 *   tps?: number,
 *   ctx?: number|null,
 *   hit?: number|null,
 *   scale?: number,
 *   warnAt?: number,
 *   sub?: boolean,
 *   stale?: boolean,
 *   source?: 'projection'|'mixed'|'dom',
 *   live?: boolean,
 *   calibrationText?: string,
 * }} [options]
 */
export const createVm = ({
  style = 'vu',
  placement = 'input',
  density = 'full',
  tps = 142,
  ctx = 65,
  hit = 99.94,
  scale = 180,
  warnAt = 80,
  sub = true,
  stale = false,
  source = 'projection',
  live,
  calibrationText = '×1.12',
  readout = 'digits',
  ctxLamps = false,
} = {}) => {
  const numericCtx = ctx === null || ctx === undefined || !Number.isFinite(Number(ctx)) ? null : Number(ctx);
  const numericHit = hit === null || hit === undefined || !Number.isFinite(Number(hit)) ? null : Number(hit);
  const position = dialPosition(tps, scale);
  const rounded = Math.round(Number(tps) || 0);
  const hitText = numericHit === null ? '—' : formatHitPercent(numericHit);
  return {
    style,
    placement,
    density,
    scale,
    warnAt,
    sub,
    stale,
    source,
    live: typeof live === 'boolean' ? live : rounded > 2,
    tps: Number(tps) || 0,
    displayTps: String(rounded),
    ctxValue: numericCtx ?? 0,
    ctxKnown: numericCtx !== null,
    ctxText: numericCtx === null ? '—' : String(Math.round(numericCtx)),
    ctxDisplay: numericCtx === null ? '—' : `${Math.round(numericCtx)}%`,
    hitValue: numericHit ?? 0,
    hitKnown: numericHit !== null,
    hitText,
    hitDisplay: hitText === '—' ? '—' : `${hitText}%`,
    warn: numericCtx !== null && numericCtx >= warnAt,
    position: position.position,
    over: position.over,
    readout,
    ctxLamps,
    calibrationText,
    static: true,
  };
};
