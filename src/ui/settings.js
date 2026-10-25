/** Settings popover and the full `settings.section` page. */

import { R } from '../runtime.js';
import { prefs } from '../prefs.js';
import { engine } from '../engine.js';
import { STYLES, SCALES, WARN_LEVELS } from '../themes.js';
import { createT } from '../i18n.js';
import { usePrefs, useEngineVersion, useLang } from './hooks.js';
import { StyleIcon, CloseIcon } from './icons.js';
import { StaticGauge } from './preview.js';
import { VERSION } from '../version.js';

const h = (...args) => R.h(...args);

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

const StylePicker = ({ value, onChange, t, detailed }) => h('div', { className: 'rg-style-grid' },
  STYLES.map((style) => h('button', {
    key: style.id,
    type: 'button',
    className: 'rg-style-tile',
    'aria-pressed': String(value === style.id),
    title: t(style.descriptionKey),
    onClick: () => onChange(style.id),
  },
  h(StyleIcon, { style: style.id }),
  h('span', { className: 'rg-style-name' }, t(style.labelKey)),
  detailed ? h('span', { className: 'rg-style-desc' }, t(style.descriptionKey)) : null)));

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

/**
 * All controls. Subscribes to prefs and to engine state so the calibration
 * status is live; safe to render twice (popover + settings page).
 *
 * @param {{ t: Function, detailed?: boolean }} props
 */
export const SettingsControls = ({ t, detailed = false }) => {
  const snapshot = usePrefs();
  useEngineVersion();
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
    h(Field, { label: t('styleTitle') },
      h(StylePicker, {
        value: snapshot.style,
        onChange: (style) => set({ style }),
        t,
        detailed,
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
    h(Field, { label: t('densityTitle'), hint: detailed ? t('densityHint') : null },
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
    h(Field, { label: t('calibration') },
      h('div', { className: 'rg-calib' },
        h('span', { className: 'rg-calib-text' }, calibrationText),
        h('button', {
          type: 'button',
          className: 'rg-btn rg-btn-quiet',
          onClick: () => engine.resetCalibration(),
        }, t('resetCalibration')))));
};

/**
 * Anchored popover. Portaled to body so the composer's overflow cannot clip it.
 *
 * @param {{
 *   anchorRef: object,
 *   open: boolean,
 *   onClose: Function,
 *   t: Function,
 * }} props
 */
export const SettingsPopover = ({ anchorRef, open, onClose, t }) => {
  const panelRef = R.useRef(null);
  const closeRef = R.useRef(onClose);
  const [position, setPosition] = R.useState(null);
  closeRef.current = onClose;

  R.useLayoutEffect(() => {
    if (!open || typeof window === 'undefined') return undefined;
    const panel = panelRef.current;
    const anchor = anchorRef.current;
    if (!panel || !anchor) return undefined;

    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const width = panel.offsetWidth || 318;
      const height = panel.offsetHeight || 320;
      const margin = 12;
      const left = Math.min(
        Math.max(margin, rect.right - width),
        Math.max(margin, window.innerWidth - width - margin),
      );
      let top = rect.bottom + 8;
      if (top + height > window.innerHeight - margin) {
        top = Math.max(margin, rect.top - height - 8);
      }
      setPosition({ left, top, visibility: 'visible' });
    };

    place();
    panel.focus({ preventScroll: true });
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);

    const onPointerDown = (event) => {
      if (panel.contains(event.target) || anchor.contains(event.target)) return;
      closeRef.current();
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closeRef.current();
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      document.removeEventListener('pointerdown', onPointerDown, true);
      document.removeEventListener('keydown', onKeyDown);
      if (typeof anchor.focus === 'function') anchor.focus({ preventScroll: true });
    };
  }, [open, anchorRef]);

  if (!open) return null;

  const panel = h('div', {
    ref: panelRef,
    className: 'rg-settings-popover',
    role: 'dialog',
    'aria-label': t('settingsTitle'),
    tabIndex: -1,
    style: position ?? { left: 0, top: 0, visibility: 'hidden' },
  },
  h('div', { className: 'rg-settings-head' },
    h('div', null,
      h('h2', { className: 'rg-settings-title' },
        t('appName'),
        h('span', { className: 'rg-settings-version' }, ` v${VERSION}`)),
      h('p', { className: 'rg-settings-sub' }, t('settingsSubtitle'))),
    h('button', {
      type: 'button',
      className: 'rg-settings-close',
      'aria-label': t('close'),
      title: t('close'),
      onClick: () => closeRef.current(),
    }, h(CloseIcon))),
  h(SettingsControls, { t }));

  return R.createPortal ? R.createPortal(panel, document.body) : panel;
};

/**
 * Host `settings.section` page: the same controls at full width plus live
 * previews of the current style at two densities.
 */
export const SettingsSection = () => {
  const snapshot = usePrefs();
  const lang = useLang(snapshot.lang);
  const t = R.useMemo(() => createT(lang), [lang]);
  useEngineVersion();

  return h('div', { className: 'rg-settings-page' },
    h('div', { className: 'rg-settings-page-head' },
      h('h3', null, t('appName')),
      h('p', null, t('settingsSubtitle'))),
    h('div', { className: 'rg-settings-grid' },
      h('div', { className: 'rg-settings-panel' },
        h(SettingsControls, { t, detailed: true })),
      h('aside', { className: 'rg-settings-preview' },
        h('div', { className: 'rg-preview-label' },
          h('span', null, t('previewTitle')),
          h('span', { className: 'rg-sep' }, '·'),
          h('span', null, t('densityFull'))),
        h('div', { className: 'rg-preview-stage' },
          h(StaticGauge, { style: snapshot.style, density: 'full', placement: 'dock', t })),
        h('div', { className: 'rg-preview-label' },
          h('span', null, t('densityMinimal'))),
        h('div', { className: 'rg-preview-stage' },
          h(StaticGauge, { style: snapshot.style, density: 'minimal', placement: 'dock', t })),
        h('p', { className: 'rg-preview-caption' }, t('previewHint')),
        h('p', { className: 'rg-preview-caption' }, t('version', { version: VERSION })))),
    h('p', { className: 'rg-notice' }, t('notice')));
};
