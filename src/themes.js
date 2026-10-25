/**
 * Shared style metadata. Kept free of DOM, CSS and React so prefs validation,
 * settings, the gallery and tests can all import it.
 */

export const STYLE_IDS = Object.freeze(['heritage', 'neon', 'minimal', 'terminal']);

export const STYLES = Object.freeze([
  {
    id: 'heritage',
    labelKey: 'styleHeritage',
    descriptionKey: 'styleHeritageDesc',
    accent: '#7aa2ff',
  },
  {
    id: 'neon',
    labelKey: 'styleNeon',
    descriptionKey: 'styleNeonDesc',
    accent: '#5ee7ff',
  },
  {
    id: 'minimal',
    labelKey: 'styleMinimal',
    descriptionKey: 'styleMinimalDesc',
    accent: '#3f6fd8',
  },
  {
    id: 'terminal',
    labelKey: 'styleTerminal',
    descriptionKey: 'styleTerminalDesc',
    accent: '#54c98a',
  },
]);

export const STYLE_MAP = Object.freeze(Object.fromEntries(STYLES.map((style) => [style.id, style])));

export const DENSITIES = Object.freeze(['auto', 'full', 'compact', 'minimal']);
export const PLACEMENTS = Object.freeze(['dock', 'input']);
export const LANGUAGES = Object.freeze(['auto', 'zh', 'en']);
export const SCALES = Object.freeze([120, 180, 240, 300]);
export const WARN_LEVELS = Object.freeze([70, 80, 90]);

export const DEFAULT_PREFS = Object.freeze({
  version: 2,
  placement: 'dock',
  style: 'heritage',
  density: 'auto',
  scale: 180,
  warnAt: 80,
  sub: true,
  lang: 'auto',
});

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
 * Coerce an arbitrary object into a safe preference snapshot.
 *
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {typeof DEFAULT_PREFS}
 */
export const normalizePrefs = (raw) => {
  const value = raw !== null && typeof raw === 'object' ? raw : {};
  return {
    version: 2,
    placement: PLACEMENTS.includes(value.placement) ? value.placement : DEFAULT_PREFS.placement,
    style: STYLE_IDS.includes(value.style) ? value.style : DEFAULT_PREFS.style,
    density: DENSITIES.includes(value.density) ? value.density : DEFAULT_PREFS.density,
    scale: normalizeScale(value.scale),
    warnAt: normalizeWarnAt(value.warnAt),
    sub: typeof value.sub === 'boolean' ? value.sub : DEFAULT_PREFS.sub,
    lang: LANGUAGES.includes(value.lang) ? value.lang : DEFAULT_PREFS.lang,
  };
};
