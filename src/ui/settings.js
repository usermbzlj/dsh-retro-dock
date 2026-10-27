/** Full `settings.section` page. The popover is gone; preferences live here. */

import { R } from '../runtime.js';
import { prefs } from '../prefs.js';
import { engine } from '../engine.js';
import { STYLES, SCALES, WARN_LEVELS, READOUTS } from '../themes.js';
import { DESIGN_META } from '../designs/meta.js';
import { createT } from '../i18n.js';
import { usePrefs, useEngineVersion, useLang } from './hooks.js';
import { ClassicPreview } from './classic.js';
import { DesignPreview } from './design-gauge.js';
import { VERSION } from '../version.js';
import { formatMs, formatTokens } from './turn.js';

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

const Seg = ({ value, options, onChange, label, disabled = false }) => h('div', {
  className: disabled ? 'rg-seg is-disabled' : 'rg-seg',
  role: 'radiogroup',
  'aria-label': label,
  onKeyDown: (event) => {
    const delta = event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1
      : event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : 0;
    if (!delta || disabled) return;
    event.preventDefault();
    const index = Math.max(0, options.findIndex((option) => option.value === value));
    onChange(options[(index + delta + options.length) % options.length].value);
  },
}, options.map((option) => h('button', {
  key: option.value,
  type: 'button',
  role: 'radio',
  'aria-checked': String(value === option.value),
  tabIndex: value === option.value ? 0 : -1,
  disabled,
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

const StyleOption = ({ id, selected, lang, t, onSelect, scale, warnAt, sub, readout, ctxLamps }) => {
  const Preview = id === 'classic' ? ClassicPreview : DesignPreview;
  return h('button', {
    type: 'button',
    className: selected ? 'rg-style-option is-selected' : 'rg-style-option',
    'aria-pressed': String(selected),
    'aria-label': styleName(id, lang, t),
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
      readout,
      ctxLamps,
      t,
    })),
  h('span', { className: 'rg-style-copy' },
    h('span', { className: 'rg-style-name' }, styleName(id, lang, t)),
    selected ? h('span', { className: 'rg-style-inuse' }, t('styleInUse')) : null));
};

const StylePicker = ({ value, lang, t, onChange, scale, warnAt, sub, readout, ctxLamps }) => h('div', {
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
  readout,
  ctxLamps,
})));

/**
 * All controls. Subscribes to prefs and to engine state so the calibration
 * status is live.
 *
 * @param {{ t: Function, lang: 'zh'|'en' }} props
 */
const TurnTable = ({ turn, t }) => {
  if (!turn) return t('turnEmpty');
  return h('div', { className: 'rg-turn-grid' },
    h('div', { className: 'rg-turn-col' },
      h('span', { className: 'rg-turn-k' }, t('turnColTtft')),
      h('span', { className: 'rg-turn-v' }, turn.ttftMs === null ? '—' : formatMs(turn.ttftMs))),
    h('div', { className: 'rg-turn-col' },
      h('span', { className: 'rg-turn-k' }, t('turnColAvg')),
      h('span', { className: 'rg-turn-v' }, turn.avgTps === null ? '—' : `≈ ${Math.round(turn.avgTps)} tok/s`)),
    h('div', { className: 'rg-turn-col' },
      h('span', { className: 'rg-turn-k' }, t('turnColTokens')),
      h('span', { className: 'rg-turn-v' }, `≈ ${formatTokens(turn.tokens)} tok`)));
};

export const SettingsControls = ({ t, lang }) => {
  const snapshot = usePrefs();
  useEngineVersion();
  useActivityTick();
  const [exported, setExported] = R.useState(false);
  const calibration = engine.getCalibration();
  const calibrationText = calibration.status === 'pending'
    ? t('calibrationPending')
    : calibration.status === 'unavailable'
      ? t('calibrationUnavailable')
      : calibration.samples > 0
        ? t('calibrationStatus', { factor: calibration.factor.toFixed(2), n: calibration.samples })
        : t('notCalibrated');
  const panel = snapshot.style === 'classic' || snapshot.style === 'vu';
  const logEmpty = engine.exportLog().entries.length === 0;
  const turn = engine.getLastTurn();
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
        readout: snapshot.readout,
        ctxLamps: snapshot.ctxLamps,
        onChange: (style) => set({ style }),
      })),
    h(Field, { label: t('readoutTitle'), hint: panel ? t('readoutHint') : t('panelOnlyHint') },
      h(Seg, {
        value: snapshot.readout,
        label: t('readoutTitle'),
        disabled: !panel,
        onChange: (readout) => set({ readout }),
        options: READOUTS.map((id) => ({
          value: id,
          label: id === 'drum' ? t('readoutDrum') : t('readoutDigits'),
        })),
      })),
    h(Field, { label: t('ctxLampsTitle'), hint: panel ? t('ctxLampsHint') : t('panelOnlyHint') },
      h(Switch, {
        checked: snapshot.ctxLamps,
        label: t('ctxLampsSwitch'),
        onChange: (ctxLamps) => panel && set({ ctxLamps }),
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
    h(Field, { label: t('measureTitle') },
      h('div', { className: 'rg-turn-text' }, h(TurnTable, { turn, t }))),
    h(Field, { label: t('calibration'), hint: t('calibrationHint') },
      h('div', { className: 'rg-calib' },
        h('span', { className: 'rg-calib-text' }, calibrationText),
        h('button', {
          type: 'button',
          className: 'rg-btn rg-btn-quiet',
          onClick: () => {
            const ok = typeof window === 'undefined' || typeof window.confirm !== 'function'
              || window.confirm(t('resetConfirm'));
            if (ok) engine.resetCalibration();
          },
        }, t('resetCalibration')))),
    h(Field, { label: t('logTitle'), hint: t('exportLogHint') },
      h('div', { className: 'rg-calib' },
        h('button', {
          type: 'button',
          className: 'rg-btn rg-export-log',
          disabled: logEmpty,
          onClick: () => {
            downloadLog();
            setExported(true);
          },
        }, t('exportLog')),
        h('span', { className: 'rg-calib-text', 'aria-live': 'polite' },
          exported ? t('exported') : (logEmpty ? t('logEmpty') : '')))));
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
        readout: snapshot.readout,
        ctxLamps: snapshot.ctxLamps,
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
