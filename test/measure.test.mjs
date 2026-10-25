import test from 'node:test';
import assert from 'node:assert/strict';

import {
  activeAverage,
  cacheHitPercent,
  contextPercent,
  countTokens,
  dialPosition,
  formatCtx,
  formatHit,
  formatHitFromUsage,
  formatHitPercent,
  formatTps,
} from '../src/measure.js';

test('contextPercent follows the host contextPressure contract', () => {
  assert.equal(contextPercent({ projectedTokens: 512, contextWindow: 1024 }), 50);
  assert.equal(contextPercent({ pressureTokens: 256, contextWindow: 1024 }), 25);
  assert.equal(contextPercent({ projectedTokens: 2048, contextWindow: 1024 }), 100);
  assert.equal(contextPercent({ contextWindow: 0 }), null);
  assert.equal(contextPercent(null), null);
});

test('cacheHitPercent uses the three disjoint billing buckets', () => {
  assert.equal(cacheHitPercent({ cacheReadTokens: 65, uncachedInputTokens: 30, cacheWriteTokens: 5 }), 65);
  const partial = cacheHitPercent({ cacheReadTokens: 999, uncachedInputTokens: 1, cacheWriteTokens: 0 });
  assert.ok(Math.abs(partial - 99.9) < 1e-9);
  assert.equal(cacheHitPercent({ cacheReadTokens: 0, uncachedInputTokens: 0, cacheWriteTokens: 0 }), null);
  assert.equal(cacheHitPercent(null), null);
});

test('HIT labels stay honest about partial hits', () => {
  assert.equal(formatHitFromUsage({ cacheReadTokens: 65, uncachedInputTokens: 35, cacheWriteTokens: 0 }), '65');
  assert.equal(formatHitFromUsage({ cacheReadTokens: 999, uncachedInputTokens: 1, cacheWriteTokens: 0 }), '99.9');
  assert.equal(formatHitFromUsage({ cacheReadTokens: 9999, uncachedInputTokens: 1, cacheWriteTokens: 0 }), '99.99');
  assert.equal(formatHitFromUsage({ cacheReadTokens: 1000, uncachedInputTokens: 0, cacheWriteTokens: 0 }), '100');
  assert.equal(formatHitFromUsage({ cacheReadTokens: 0, uncachedInputTokens: 0, cacheWriteTokens: 0 }), '—');
  assert.equal(formatHit(null), '—');
});

test('DOM fallback HIT formatting never rounds a partial hit to 100', () => {
  assert.equal(formatHitPercent(65), '65');
  assert.equal(formatHitPercent(99.94), '99.9');
  assert.equal(formatHitPercent(99.999), '99.99');
  assert.equal(formatHitPercent(100), '100');
  assert.equal(formatHitPercent(null), '—');
});

test('context labels and warning marker are separate', () => {
  assert.equal(formatCtx(65), '65');
  assert.equal(formatCtx(82), '82');
  assert.equal(formatCtx(null), '—');
  assert.equal(formatTps(142.4), '142');
  assert.equal(formatTps(-1), '0');
});

test('dial position clamps at the stop and reports overspeed', () => {
  assert.deepEqual(dialPosition(90, 180), { position: 50, over: 0 });
  assert.equal(dialPosition(360, 180).position, 100);
  assert.equal(dialPosition(360, 180).over, 1);
});

test('token weights count CJK heavier than ASCII and ignore nothing', () => {
  assert.ok(Math.abs(countTokens('中') - 0.6) < 1e-9);
  assert.ok(Math.abs(countTokens('a') - 0.3) < 1e-9);
  assert.ok(Math.abs(countTokens('1') - 0.3) < 1e-9);
  assert.ok(countTokens('a b') > countTokens('ab'));
  assert.equal(countTokens(''), 0);
});

test('activeAverage uses only active decode time', () => {
  assert.equal(activeAverage(100, 1000), 100);
  assert.equal(activeAverage(100, 0), 0);
  assert.equal(activeAverage(0, 1000), 0);
});
