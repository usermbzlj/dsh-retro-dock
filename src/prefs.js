/**
 * Preference store. Owns placement, style, density, scale, warning threshold,
 * sub-dial visibility and language. One localStorage key, a validated snapshot,
 * and a subscription that React can consume through `useSyncExternalStore`.
 */

import { DEFAULT_PREFS, normalizePrefs } from './themes.js';

export const PREFS_KEY = 'dsh-retro-dock:prefs:v2';
export const LEGACY_PLACEMENT_KEY = 'rg-gauge-placement';

const getDefaultStorage = () => {
  try {
    return typeof window !== 'undefined' ? window.localStorage : null;
  } catch {
    return null;
  }
};

const samePrefs = (left, right) => (
  left.placement === right.placement
  && left.style === right.style
  && left.density === right.density
  && left.scale === right.scale
  && left.warnAt === right.warnAt
  && left.sub === right.sub
  && left.lang === right.lang
);

/**
 * @param {{
 *   storage?: Storage|null,
 *   key?: string,
 *   legacyKey?: string,
 * }} [options]
 */
export const createPrefs = (options = {}) => {
  const storage = options.storage === undefined ? getDefaultStorage() : options.storage;
  const key = options.key ?? PREFS_KEY;
  const legacyKey = options.legacyKey ?? LEGACY_PLACEMENT_KEY;

  const read = () => {
    try {
      const raw = storage?.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        return normalizePrefs(parsed);
      }
    } catch {
      // Corrupt or unavailable storage falls through to a fresh snapshot.
    }
    try {
      const legacy = storage?.getItem(legacyKey);
      if (legacy === 'input' || legacy === 'dock') {
        const migrated = normalizePrefs({ ...DEFAULT_PREFS, placement: legacy });
        storage?.setItem(key, JSON.stringify(migrated));
        storage?.removeItem(legacyKey);
        return migrated;
      }
    } catch {
      // Migration is best-effort; defaults still work.
    }
    return { ...DEFAULT_PREFS };
  };

  let snapshot = read();
  const listeners = new Set();

  const persist = () => {
    try {
      storage?.setItem(key, JSON.stringify(snapshot));
    } catch {
      // A display preference is not worth failing a render over.
    }
  };

  return {
    getSnapshot: () => snapshot,

    /**
     * @param {(snapshot: typeof DEFAULT_PREFS) => void} listener
     * @returns {() => void}
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * Merge a validated patch and notify subscribers.
     *
     * @param {Partial<typeof DEFAULT_PREFS>} patch
     * @returns {typeof DEFAULT_PREFS} the new snapshot.
     */
    set(patch) {
      const next = normalizePrefs({ ...snapshot, ...patch });
      if (samePrefs(snapshot, next)) return snapshot;
      snapshot = next;
      persist();
      for (const listener of listeners) listener(snapshot);
      return snapshot;
    },

    /** Drop back to shipped defaults (used by tests and a future reset). */
    reset() {
      snapshot = { ...DEFAULT_PREFS };
      persist();
      for (const listener of listeners) listener(snapshot);
      return snapshot;
    },
  };
};

/** Process-wide store used by the plugin, the settings page and the gallery. */
export const prefs = createPrefs();
