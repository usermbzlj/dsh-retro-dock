import test from 'node:test';
import assert from 'node:assert/strict';

import { createPrefs, PREFS_KEY, PREVIOUS_KEY, LEGACY_PLACEMENT_KEY } from '../src/prefs.js';
import { DEFAULT_PREFS, STYLES } from '../src/themes.js';

class MemoryStorage {
  constructor() {
    this.map = new Map();
  }

  getItem(key) {
    return this.map.has(key) ? this.map.get(key) : null;
  }

  setItem(key, value) {
    this.map.set(key, String(value));
  }

  removeItem(key) {
    this.map.delete(key);
  }
}

test('preferences start from the shipped defaults', () => {
  const store = createPrefs({ storage: new MemoryStorage() });
  assert.deepEqual(store.getSnapshot(), { ...DEFAULT_PREFS });
});

test('preferences persist and validate across instances', () => {
  const storage = new MemoryStorage();
  const store = createPrefs({ storage });
  store.set({
    placement: 'input',
    density: 'compact',
    scale: 240,
    warnAt: 90,
    sub: false,
    lang: 'en',
  });
  const raw = JSON.parse(storage.getItem(PREFS_KEY));
  assert.equal(raw.scale, 240);
  assert.equal(raw.density, 'compact');

  const restored = createPrefs({ storage }).getSnapshot();
  assert.equal(restored.placement, 'input');
  assert.equal(restored.density, 'compact');
  assert.equal(restored.scale, 240);
  assert.equal(restored.warnAt, 90);
  assert.equal(restored.sub, false);
  assert.equal(restored.lang, 'en');
});

test('the retired 1.1.0 style value falls back to classic', () => {
  const storage = new MemoryStorage();
  storage.setItem(PREVIOUS_KEY, JSON.stringify({
    placement: 'dock',
    style: 'neon',
    density: 'auto',
  }));
  const snapshot = createPrefs({ storage }).getSnapshot();
  assert.equal(snapshot.style, 'classic');
  assert.equal(snapshot.density, DEFAULT_PREFS.density);
  assert.equal(storage.getItem(PREVIOUS_KEY), null);
  assert.ok(storage.getItem(PREFS_KEY));
});

test('the selected instrument language persists', () => {
  const storage = new MemoryStorage();
  createPrefs({ storage }).set({ style: 'vu' });
  assert.ok(STYLES.includes('vu'));
  assert.equal(createPrefs({ storage }).getSnapshot().style, 'vu');
});

test('retired styles migrate onto classic with their leftover option', () => {
  const altimeter = new MemoryStorage();
  altimeter.setItem(PREFS_KEY, JSON.stringify({ style: 'altimeter' }));
  const a = createPrefs({ storage: altimeter }).getSnapshot();
  assert.equal(a.style, 'classic');
  assert.equal(a.readout, 'drum');

  const signal = new MemoryStorage();
  signal.setItem(PREFS_KEY, JSON.stringify({ style: 'signal' }));
  const s = createPrefs({ storage: signal }).getSnapshot();
  assert.equal(s.style, 'classic');
  assert.equal(s.ctxLamps, true);
});

test('unknown or out-of-range values fall back safely', () => {
  const storage = new MemoryStorage();
  storage.setItem(PREFS_KEY, JSON.stringify({
    placement: 'sidebar',
    style: 'neon',
    density: 'tiny',
    scale: 999,
    warnAt: 12,
    sub: 'yes',
    lang: 'fr',
  }));
  const snapshot = createPrefs({ storage }).getSnapshot();
  assert.equal(snapshot.style, DEFAULT_PREFS.style);
  assert.equal(snapshot.placement, DEFAULT_PREFS.placement);
  assert.equal(snapshot.density, DEFAULT_PREFS.density);
  assert.equal(snapshot.scale, DEFAULT_PREFS.scale);
  assert.equal(snapshot.warnAt, DEFAULT_PREFS.warnAt);
  assert.equal(snapshot.sub, DEFAULT_PREFS.sub);
  assert.equal(snapshot.lang, DEFAULT_PREFS.lang);
});

test('the idle hold defaults on, persists off, and rejects non-booleans', () => {
  const storage = new MemoryStorage();
  assert.equal(createPrefs({ storage }).getSnapshot().hold, true);
  createPrefs({ storage }).set({ hold: false });
  assert.equal(createPrefs({ storage }).getSnapshot().hold, false);

  const bad = new MemoryStorage();
  bad.setItem(PREFS_KEY, JSON.stringify({ hold: 'yes' }));
  assert.equal(createPrefs({ storage: bad }).getSnapshot().hold, true);
});

test('the old placement key migrates once and is removed', () => {
  const storage = new MemoryStorage();
  storage.setItem(LEGACY_PLACEMENT_KEY, 'input');
  const store = createPrefs({ storage });
  assert.equal(store.getSnapshot().placement, 'input');
  assert.equal(storage.getItem(LEGACY_PLACEMENT_KEY), null);
  assert.ok(storage.getItem(PREFS_KEY));
});

test('subscribers see each change and no-op writes stay quiet', () => {
  const store = createPrefs({ storage: new MemoryStorage() });
  const seen = [];
  const unsubscribe = store.subscribe((snapshot) => seen.push(snapshot.density));
  store.set({ density: 'compact' });
  store.set({ density: 'compact' });
  store.set({ density: 'minimal' });
  unsubscribe();
  store.set({ density: 'full' });
  assert.deepEqual(seen, ['compact', 'minimal']);
});
