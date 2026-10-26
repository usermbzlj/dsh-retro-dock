/** Full `settings.section` page. The popover is gone; preferences live here. */

import { R } from '../runtime.js';
import { prefs } from '../prefs.js';
import { engine } from '../engine.js';
import { STYLES, SCALES, WARN_LEVELS } from '../themes.js';
import { DESIGN_META } from '../designs/meta.js';
import { createT } from '../i18n.js';
import { usePrefs, useEngineVersion, useLang } from './hooks.js';
import { ClassicPreview } from './classic.js';
import { DesignPreview } from './design-gauge.js';
import { VERSION } from '../version.js';
import { formatTurn } from './turn.js';

const h = (...args) => R.h(...args);

/** Re-render at most twice a second while tokens arrive, for the turn row. */
const useActivityTick = () => {
  const [, setTick] = R.useState(0);
  R.useEffect(() => {
    let timer = 0;
    const off = engine.onActivity(() => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = 0;
        setTick((value) => value + 1);
      }, 500);
    });
    return () => {
      off();
      if (timer) clearTimeout(timer);
    };
  }, []);
};

const downloadLog = () => {
  if (typeof document === 'undefined' || !document.body || typeof Blob !== 'function'
    || typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') return;
  const payload = { ...engine.exportLog(), version: VERSION, exportedAt: new Date().toISOString() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `retro-dock-log-${payload.exportedAt.replace(/[:.]/g, '-')}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
};

const Seg = ({ value, options, onChange, label }) => h('div', {
  className: 'rg-seg',
  role: 'group',
  'aria-label': label,
}, options.map((option) => h('button', {
  key: option.value,
  type: 'button',
  'aria-pressed': String(value === option.value),
  onClick: () => onChange(option.value),
}, option.label)));

const Field = ({ label, hint, children }) => h('div', { className: 'rg-field' },
  h('div', { className: 'rg-field-label' },
    h('span', null, label),
    hint ? h('span', { className: 'rg-field-hint' }, hint) : null),
  children);

const Switch = ({ checked, onChange, label }) => h('div', { className: 'rg-switch-row' },
  h('span', { className: 'rg-switch-label' }, label),
  h('button', {
    type: 'button',
    role: 'switch',
    className: 'rg-switch',
    'aria-checked': String(checked),
    'aria-label': label,
    onClick: () => onChange(!checked),
  }));

const styleName = (id, lang, t) => (
  id === 'classic' ? t('styleClassic') : DESIGN_META[id]?.name?.[lang] ?? id
);

const styleEnglish = (id) => (
  id === 'classic' ? 'Classic' : DESIGN_META[id]?.name?.en ?? id
);

const StyleOption = ({ id, selected, lang, t, onSelect, scale, warnAt, sub }) => {
  const Preview = id === 'classic' ? ClassicPreview : DesignPreview;
  return h('button', {
    type: 'button',
    className: selected ? 'rg-style-option is-selected' : 'rg-style-option',
    'aria-pressed': String(selected),
    'aria-label': `${styleName(id, lang, t)} ${styleEnglish(id)}`,
    onClick: () => onSelect(id),
  },
  h('span', { className: 'rg-style-stage', 'aria-hidden': 'true' },
    h(Preview, {
      style: id,
      placement: 'dock',
      density: 'full',
      scale,
      warnAt,
      sub,
      t,
    })),
  h('span', { className: 'rg-style-copy' },
    h('span', { className: 'rg-style-name' }, styleName(id, lang, t)),
    h('span', { className: 'rg-style-en' }, styleEnglish(id))));
};

const StylePicker = ({ value, lang, t, onChange, scale, warnAt, sub }) => h('div', {
  className: 'rg-style-grid',
  role: 'group',
  'aria-label': t('styleTitle'),
}, STYLES.map((id) => h(StyleOption, {
  key: id,
  id,
  selected: value === id,
  lang,
  t,
  onSelect: onChange,
  scale,
  warnAt,
  sub,
})));

/**
 * All controls. Subscribes to prefs and to engine state so the calibration
 * status is live.
 *
 * @param {{ t: Function, lang: 'zh'|'en' }} props
 */
export const SettingsControls = ({ t, lang }) => {
  const snapshot = usePrefs();
  useEngineVersion();
  useActivityTick();
  const calibration = engine.getCalibration();
  const calibrationText = calibration.status === 'pending'
    ? t('calibrationPending')
    : calibration.status === 'unavailable'
      ? t('calibrationUnavailable')
      : calibration.samples > 0
        ? `${t('calibration')} ×${calibration.factor.toFixed(2)} · ${t('samples', { n: calibration.samples })}`
        : t('notCalibrated');

  const set = (patch) => prefs.set(patch);

  return h('div', { className: 'rg-controls' },
    h(Field, { label: t('styleTitle'), hint: t('styleHint') },
      h(StylePicker, {
        value: snapshot.style,
        lang,
        t,
        scale: snapshot.scale,
        warnAt: snapshot.warnAt,
        sub: snapshot.sub,
        onChange: (style) => set({ style }),
      })),
    h(Field, { label: t('placementTitle') },
      h(Seg, {
        value: snapshot.placement,
        label: t('placementTitle'),
        onChange: (placement) => set({ placement }),
        options: [
          { value: 'input', label: t('placementInput') },
          { value: 'dock', label: t('placementDock') },
        ],
      })),
    h(Field, { label: t('densityTitle'), hint: t('densityHint') },
      h(Seg, {
        value: snapshot.density,
        label: t('densityTitle'),
        onChange: (density) => set({ density }),
        options: [
          { value: 'auto', label: t('densityAuto') },
          { value: 'full', label: t('densityFull') },
          { value: 'compact', label: t('densityCompact') },
          { value: 'minimal', label: t('densityMinimal') },
        ],
      })),
    h(Field, { label: t('scaleTitle') },
      h('select', {
        className: 'rg-select',
        value: String(snapshot.scale),
        'aria-label': t('scaleTitle'),
        onChange: (event) => set({ scale: Number(event.target.value) }),
      }, SCALES.map((scale) => h('option', { key: scale, value: String(scale) }, t('scaleUnit', { n: scale }))))),
    h(Field, { label: t('warnTitle') },
      h(Seg, {
        value: String(snapshot.warnAt),
        label: t('warnTitle'),
        onChange: (value) => set({ warnAt: Number(value) }),
        options: WARN_LEVELS.map((level) => ({ value: String(level), label: t('warnUnit', { n: level }) })),
      })),
    h(Field, { label: t('subField') },
      h(Switch, {
        checked: snapshot.sub,
        label: t('subTitle'),
        onChange: (sub) => set({ sub }),
      })),
    h(Field, { label: t('languageTitle') },
      h('select', {
        className: 'rg-select',
        value: snapshot.lang,
        'aria-label': t('languageTitle'),
        onChange: (event) => set({ lang: event.target.value }),
      },
      h('option', { value: 'auto' }, t('langAuto')),
      h('option', { value: 'zh' }, t('langZh')),
      h('option', { value: 'en' }, t('langEn')))),
    h(Field, { label: t('turnTitle') },
      h('div', { className: 'rg-calib' },
        h('span', { className: 'rg-calib-text rg-turn-text' },
          formatTurn(engine.getLastTurn(), t) || t('turnEmpty')))),
    h(Field, { label: t('calibration'), hint: t('exportLogHint') },
      h('div', { className: 'rg-calib' },
        h('span', { className: 'rg-calib-text' }, calibrationText),
        h('button', {
          type: 'button',
          className: 'rg-btn rg-btn-quiet',
          onClick: () => engine.resetCalibration(),
        }, t('resetCalibration')),
        h('button', {
          type: 'button',
          className: 'rg-btn rg-btn-quiet rg-export-log',
          onClick: downloadLog,
        }, t('exportLog')))));
};

const densityLabel = (density, t) => {
  if (density === 'compact') return t('densityCompact');
  if (density === 'minimal') return t('densityMinimal');
  return t('densityFull');
};

/**
 * Host `settings.section` page: controls at full-page scale plus previews of
 * the current settings and the alternate density. Preview readings are
 * explicitly examples; the geometry, scale, warning line and sub-switch are
 * the real ones.
 */
export const SettingsSection = () => {
  const snapshot = usePrefs();
  const lang = useLang(snapshot.lang);
  const t = R.useMemo(() => createT(lang), [lang]);
  useEngineVersion();

  const Preview = snapshot.style === 'classic' ? ClassicPreview : DesignPreview;
  const currentDensity = snapshot.density === 'auto' ? 'full' : snapshot.density;
  const alternateDensity = currentDensity === 'minimal' ? 'full' : 'minimal';
  const placementLabel = snapshot.placement === 'input' ? t('placementInput') : t('placementDock');
  const currentDensityLabel = snapshot.density === 'auto'
    ? `${t('densityAuto')} (${t('densityFull')})`
    : densityLabel(currentDensity, t);
  const currentStyleLabel = styleName(snapshot.style, lang, t);

  const preview = (density, label, densityText) => h('div', { className: 'rg-preview-block' },
    h('div', { className: 'rg-preview-label' },
      h('span', null, label),
      h('span', { className: 'rg-preview-meta' }, `${currentStyleLabel} / ${placementLabel} / ${densityText}`)),
    h('div', { className: 'rg-preview-stage' },
      h(Preview, {
        style: snapshot.style,
        placement: snapshot.placement,
        density,
        scale: snapshot.scale,
        warnAt: snapshot.warnAt,
        sub: snapshot.sub,
        t,
      })));

  return h('div', { className: 'rg-settings-page' },
    h('div', { className: 'rg-settings-page-head' },
      h('h3', null, t('appName')),
      h('p', null, t('settingsSubtitle'))),
    h('div', { className: 'rg-settings-grid' },
      h('div', { className: 'rg-settings-panel' },
        h(SettingsControls, { t, lang })),
      h('aside', { className: 'rg-settings-preview' },
        preview(currentDensity, t('previewCurrent'), currentDensityLabel),
        preview(alternateDensity, t('previewExample'), densityLabel(alternateDensity, t)),
        h('div', { className: 'rg-preview-foot' },
          h('p', { className: 'rg-preview-caption' }, t('previewHint')),
          h('p', { className: 'rg-preview-caption rg-preview-version' }, t('version', { version: VERSION }))))),
    h('p', { className: 'rg-notice' }, t('notice')));
};
