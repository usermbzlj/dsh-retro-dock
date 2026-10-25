import test from 'node:test';
import assert from 'node:assert/strict';

import { createT, resolveLang } from '../src/i18n.js';

test('language resolution honours explicit preference then hints', () => {
  assert.equal(resolveLang('zh', 'en-US'), 'zh');
  assert.equal(resolveLang('en', 'zh-CN'), 'en');
  assert.equal(resolveLang('auto', 'zh-CN'), 'zh');
  assert.equal(resolveLang('auto', 'en-GB'), 'en');
  assert.equal(resolveLang('auto', null, 'zh-TW'), 'zh');
  assert.equal(resolveLang('auto'), 'zh');
});

test('strings interpolate without throwing on missing values', () => {
  const zh = createT('zh');
  assert.equal(zh('styleHeritage'), '经典仪表');
  assert.equal(zh('samples', { n: 3 }), '3 样本');
  assert.equal(zh('scaleUnit', { n: 180 }), '180 tok/s');
  assert.equal(zh('missing-key'), 'missing-key');

  const en = createT('en');
  assert.equal(en('samples', { n: 2 }), '2 samples');
  assert.equal(en('sourceDom'), 'DOM fallback');
});
