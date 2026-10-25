/**
 * Plugin host glue: style injection, DOM fallback observation, slot
 * registrations and the debug mirror. Rendering lives in `ui/`.
 */

import { bindReact } from './runtime.js';
import { now } from './clock.js';
import { CSS } from './styles/index.js';
import { countTokens } from './measure.js';
import { engine } from './engine.js';
import { prefs } from './prefs.js';
import { VERSION } from './version.js';
import { createGauge } from './ui/gauge.js';
import { SettingsSection } from './ui/settings.js';

export const PLUGIN_ID = '@local/retro-dock';
export const CSS_ID = `${PLUGIN_ID}/gauge.css`;

const ensureStyles = () => {
  if (typeof document === 'undefined') return null;
  const selector = `style[data-plugin-css="${CSS_ID}"]`;
  const existing = document.querySelector(selector);
  if (existing !== null) {
    // HMR can leave the previous theme's style element in place. Replace its
    // text so a hot reload cannot pair new markup with stale CSS.
    if (existing.textContent !== CSS) existing.textContent = CSS;
    return existing;
  }
  if (!document.head) return null;
  const style = document.createElement('style');
  style.dataset.plugin = PLUGIN_ID;
  style.dataset.pluginCss = CSS_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
  return style;
};

/**
 * Observe DOM text only while the host has no chat store. The observer is
 * attached and detached with stream availability, so the store path pays
 * nothing for it.
 *
 * @returns {() => void}
 */
const startDomFallback = () => {
  if (typeof document === 'undefined' || typeof MutationObserver !== 'function') return () => {};

  let observer = null;
  let startedAt = 0;
  let retry = 0;

  const inComposer = (node) => {
    try {
      return node.closest('textarea, input, [contenteditable="true"]') !== null;
    } catch {
      return false;
    }
  };

  const onMutations = (records) => {
    if (engine.isStreamAvailable()) return;
    if (engine.isRunning() === false) return;
    if (now() - startedAt < 750) return;
    let delta = 0;
    const bulk = records.length > 80;
    for (const record of records) {
      if (record.type === 'characterData') {
        const parent = record.target && record.target.parentElement;
        if (!parent || parent.closest('.rg-root') || inComposer(parent)) continue;
        const after = record.target.data ? record.target.data.length : 0;
        const before = record.oldValue ? record.oldValue.length : 0;
        if (after > before && record.target.data) {
          delta += countTokens(record.target.data.slice(before, after));
        }
      } else if (record.type === 'childList') {
        for (const node of record.addedNodes) {
          if (!node || node.nodeType !== 1 || node.closest('.rg-root') || inComposer(node)) continue;
          const text = node.textContent;
          if (!text) continue;
          delta += countTokens(text.length > 400 ? text.slice(-400) : text);
        }
      }
    }
    if (bulk || delta > 900) {
      engine.resetGeneration();
      return;
    }
    if (delta > 0) engine.noteTokens(delta, now());
  };

  const attach = () => {
    if (observer !== null || !document.body) return;
    startedAt = now();
    observer = new MutationObserver(onMutations);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    });
  };

  const sync = () => {
    if (!engine.isStreamAvailable()) {
      if (document.body) attach();
      else if (retry === 0 && typeof setTimeout === 'function') retry = setTimeout(sync, 60);
      return;
    }
    if (observer !== null) {
      observer.disconnect();
      observer = null;
    }
  };

  const off = engine.subscribe(sync);
  sync();

  return () => {
    off();
    if (retry) clearTimeout(retry);
    if (observer !== null) observer.disconnect();
    observer = null;
  };
};

/**
 * @param {typeof import('react')} React
 * @param {{ createPortal?: Function }|null} ReactDOM
 */
export const createPlugin = (React, ReactDOM) => {
  bindReact(React, ReactDOM);

  const apply = (ctx) => {
    if (typeof document === 'undefined' || !ctx || !ctx.slots) return;
    ensureStyles();
    const stopFallback = startDomFallback();

    const dispose = () => {
      stopFallback();
      if (typeof window !== 'undefined' && window.__retroDock?.dispose === dispose) {
        delete window.__retroDock;
      }
    };

    if (typeof ctx.effect === 'function') ctx.effect(() => dispose);
    else if (typeof ctx.on === 'function') ctx.on('dispose', dispose);

    ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
      name: 'conversation.composer.dock',
      id: 'retro-dock-gauge',
      order: -10,
    }, createGauge('dock')));

    ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
      name: 'conversation.input.dock',
      id: 'retro-dock-gauge-input',
      order: 5,
    }, createGauge('input')));

    try {
      ctx.slots.inject('settings.section', () => ctx.slots.register({
        name: 'settings.section',
        id: 'retro-dock',
        order: 42,
        label: 'Retro Dock',
      }, SettingsSection));
    } catch (error) {
      if (typeof console !== 'undefined' && typeof window !== 'undefined' && window.__retroDockDebug) {
        console.warn('[retro-dock] settings.section is unavailable on this host', error);
      }
    }

    if (typeof window !== 'undefined') {
      window.__retroDock = {
        version: VERSION,
        engine,
        prefs,
        dispose,
        trace: [],
        getTrace: () => window.__retroDock.trace.slice(-120),
        getState: () => engine.getState(),
      };
    }
  };

  return { inject: ['slots'], apply };
};
