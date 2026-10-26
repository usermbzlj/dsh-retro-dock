import test from 'node:test';
import assert from 'node:assert/strict';

import { createPrefs, PREFS_KEY, LEGACY_PLACEMENT_KEY } from '../src/prefs.js';
import { DEFAULT_PREFS } from '../src/themes.js';

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

test('the retired 1.1.0 style value is dropped', () => {
  const storage = new MemoryStorage();
  storage.setItem(PREFS_KEY, JSON.stringify({ placement: 'input', style: 'neon' }));
  const snapshot = createPrefs({ storage }).getSnapshot();
  assert.equal(snapshot.placement, 'input');
  assert.equal('style' in snapshot, false);
});

test('unknown or out-of-range values fall back safely', () => {
  const storage = new MemoryStorage();
  storage.setItem(PREFS_KEY, JSON.stringify({
    placement: 'sidebar',
    density: 'tiny',
    scale: 999,
    warnAt: 12,
    sub: 'yes',
    lang: 'fr',
  }));
  const snapshot = createPrefs({ storage }).getSnapshot();
  assert.equal(snapshot.placement, DEFAULT_PREFS.placement);
  assert.equal(snapshot.density, DEFAULT_PREFS.density);
  assert.equal(snapshot.scale, DEFAULT_PREFS.scale);
  assert.equal(snapshot.warnAt, DEFAULT_PREFS.warnAt);
  assert.equal(snapshot.sub, DEFAULT_PREFS.sub);
  assert.equal(snapshot.lang, DEFAULT_PREFS.lang);
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
