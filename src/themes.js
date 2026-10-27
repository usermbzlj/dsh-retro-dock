/**
 * Shared preference metadata. Kept free of DOM, CSS and React so prefs
 * validation, settings, the gallery and tests can all import it.
 */

import { DESIGN_IDS } from './designs/meta.js';

export const DENSITIES = Object.freeze(['auto', 'full', 'compact', 'minimal']);
export const PLACEMENTS = Object.freeze(['dock', 'input']);
export const LANGUAGES = Object.freeze(['auto', 'zh', 'en']);
export const SCALES = Object.freeze([120, 180, 240, 300]);
export const WARN_LEVELS = Object.freeze([70, 80, 90]);
export const STYLES = Object.freeze(['classic', ...DESIGN_IDS]);
export const READOUTS = Object.freeze(['digits', 'drum']);

export const DEFAULT_PREFS = Object.freeze({
  version: 3,
  style: 'classic',
  placement: 'dock',
  density: 'auto',
  scale: 180,
  warnAt: 80,
  sub: true,
  lang: 'auto',
  readout: 'digits',
  ctxLamps: false,
});

/**
 * Styles retired in 1.5 fold into classic; their one distinct idea survives
 * as a shared preference instead of a whole instrument.
 */
const RETIRED_STYLES = Object.freeze({
  bench: {},
  compass: {},
  altimeter: { readout: 'drum' },
  signal: { ctxLamps: true },
});

/**
 * @param {unknown} value
 * @returns {string} one of STYLES.
 */
export const normalizeStyle = (value) => (STYLES.includes(value) ? value : DEFAULT_PREFS.style);

/**
 * @param {unknown} value
 * @returns {number} one of SCALES.
 */
export const normalizeScale = (value) => {
  const numeric = Number(value);
  return SCALES.includes(numeric) ? numeric : DEFAULT_PREFS.scale;
};

/**
 * @param {unknown} value
 * @returns {number} one of WARN_LEVELS.
 */
export const normalizeWarnAt = (value) => {
  const numeric = Number(value);
  return WARN_LEVELS.includes(numeric) ? numeric : DEFAULT_PREFS.warnAt;
};

/**
 * Coerce an arbitrary object into a safe preference snapshot. The 1.1.0 style
 * values (neon / minimal / terminal) are no longer valid ids, so they fall back
 * to classic instead of leaking into the new instrument registry. The 1.5
 * retirements (bench / altimeter / signal / compass) migrate to classic and
 * carry their readout or lamp option along unless the snapshot already sets it.
 *
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {typeof DEFAULT_PREFS}
 */
export const normalizePrefs = (raw) => {
  const source = raw !== null && typeof raw === 'object' ? raw : {};
  const retired = typeof source.style === 'string' && Object.hasOwn(RETIRED_STYLES, source.style)
    ? RETIRED_STYLES[source.style]
    : null;
  const value = retired
    ? {
      ...source,
      style: 'classic',
      readout: READOUTS.includes(source.readout) ? source.readout : retired.readout,
      ctxLamps: typeof source.ctxLamps === 'boolean' ? source.ctxLamps : retired.ctxLamps,
    }
    : source;
  return {
    version: 3,
    style: normalizeStyle(value.style),
    placement: PLACEMENTS.includes(value.placement) ? value.placement : DEFAULT_PREFS.placement,
    density: DENSITIES.includes(value.density) ? value.density : DEFAULT_PREFS.density,
    scale: normalizeScale(value.scale),
    warnAt: normalizeWarnAt(value.warnAt),
    sub: typeof value.sub === 'boolean' ? value.sub : DEFAULT_PREFS.sub,
    lang: LANGUAGES.includes(value.lang) ? value.lang : DEFAULT_PREFS.lang,
    readout: READOUTS.includes(value.readout) ? value.readout : DEFAULT_PREFS.readout,
    ctxLamps: typeof value.ctxLamps === 'boolean' ? value.ctxLamps : DEFAULT_PREFS.ctxLamps,
  };
};
