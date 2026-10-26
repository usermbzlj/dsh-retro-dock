import test from 'node:test';
import assert from 'node:assert/strict';

import { createEngine } from '../src/engine.js';

const blocks = (text) => [{ kind: 'text', text }];

test('the engine counts stream deltas and resets on a new generation', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  assert.equal(engine.isStreamAvailable(), true);

  let result = engine.notePartial(blocks('hello'), 1000);
  assert.ok(result.delta > 0);
  const first = result.total;

  result = engine.notePartial(blocks('hello world'), 1016);
  assert.ok(result.delta > 0);
  assert.ok(result.total > first);

  result = engine.notePartial(blocks('new'), 1032);
  assert.equal(result.reset, true);
  assert.equal(result.delta, 0);
  assert.ok(Math.abs(result.total - 0.9) < 1e-9);
  assert.ok(engine.sample(1040) > 0, 'a generation reset must keep the rate window');
});

test('calibration uses host token deltas and resets on a session switch', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  engine.setStats({ decodeTokens: 1000, decodeMs: 5000 }, 1000);
  engine.notePartial(blocks('中'.repeat(40)), 1100);
  engine.setStats({ decodeTokens: 1030, decodeMs: 5200 }, 1100);

  let calibration = engine.getCalibration();
  assert.equal(calibration.available, true);
  assert.equal(calibration.samples, 1);
  assert.ok(Math.abs(calibration.factor - 1.0625) < 1e-9);

  engine.setStats({ decodeTokens: 5, decodeMs: 100 }, 1200);
  calibration = engine.getCalibration();
  assert.equal(calibration.samples, 0);
  assert.equal(calibration.factor, 1);
  // A stats-boundary reset is calibration-only: the live rate window and the
  // stream counter must survive, otherwise the main needle drops to zero when
  // the context/cache sub-dial refreshes.
  assert.ok(engine.getState().estimated > 0);
});

test('switching to a longer conversation rebases instead of sampling', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  engine.setStats({ decodeTokens: 1000, decodeMs: 5000 }, 1000);
  engine.notePartial(blocks('hello world '.repeat(4)), 1100);
  engine.setStats({ decodeTokens: 40000, decodeMs: 900000 }, 1200);
  let calibration = engine.getCalibration();
  assert.equal(calibration.samples, 0);
  assert.equal(calibration.factor, 1);

  // Decode observed after the switch still calibrates against the new totals.
  engine.notePartial(blocks('hello world '.repeat(4) + '中'.repeat(40)), 2200);
  engine.setStats({ decodeTokens: 40030, decodeMs: 900400 }, 2300);
  calibration = engine.getCalibration();
  assert.equal(calibration.samples, 1);
  assert.ok(Math.abs(calibration.factor - 1.0625) < 1e-9);
});

test('an implausible token ratio is rejected rather than clamped', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  engine.setStats({ decodeTokens: 1000, decodeMs: 5000 }, 1000);
  engine.notePartial(blocks('中'.repeat(20)), 1100);
  // 12 estimated tokens against 600 host tokens in a plausible time window.
  engine.setStats({ decodeTokens: 1600, decodeMs: 6000 }, 3000);
  const calibration = engine.getCalibration();
  assert.equal(calibration.samples, 0);
  assert.equal(calibration.factor, 1);
});

test('the last turn reports first-token latency and active average speed', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  assert.equal(engine.getLastTurn(), null);
  engine.setRunning(true, 1000);
  engine.noteTokens(10, 1800);
  for (let index = 1; index <= 10; index += 1) engine.noteTokens(10, 1800 + index * 100);
  const turn = engine.getLastTurn();
  assert.equal(turn.ttftMs, 800);
  assert.equal(turn.tokens, 110);
  assert.equal(Math.round(turn.avgTps), 100);
});

test('without a running flag a long pause starts a new turn and latency is unknown', () => {
  const engine = createEngine();
  engine.noteTokens(50, 1000);
  engine.noteTokens(50, 1100);
  engine.noteTokens(5, 9000);
  const turn = engine.getLastTurn();
  assert.equal(turn.ttftMs, null);
  assert.equal(turn.tokens, 5);
  assert.equal(turn.avgTps, null);
});

test('tool waits inside a turn do not dilute the average', () => {
  const engine = createEngine();
  engine.setRunning(true, 0);
  for (const at of [100, 200, 300, 400, 8400, 8500, 8600, 8700]) engine.noteTokens(10, at);
  assert.equal(Math.round(engine.getLastTurn().avgTps), 100);
});

test('the measurement log records tokens, stats, running flips and samples', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  engine.setRunning(true, 900);
  engine.setStats({ decodeTokens: 1000, decodeMs: 5000 }, 1000);
  engine.notePartial(blocks('中'.repeat(40)), 1100);
  engine.setStats({ decodeTokens: 1030, decodeMs: 5200 }, 1100);
  const exported = engine.exportLog();
  assert.equal(exported.format, 'retro-dock-log/1');
  const kinds = exported.entries.map((entry) => entry.k);
  assert.deepEqual(kinds, ['run', 'stats', 'tok', 'stats', 'cal']);
  assert.equal(exported.calibration.samples, 1);
  assert.equal(JSON.stringify(exported).includes('中'), false, 'no conversation text');
});

test('a missing sessionStats projection is reported as unavailable', () => {
  const engine = createEngine();
  engine.setStats({ decodeTokens: 100, decodeMs: 1000 }, 1000);
  assert.equal(engine.getCalibration().available, true);
  assert.equal(engine.getCalibration().status, 'available');
  engine.setStats(null, 1100);
  assert.equal(engine.getCalibration().available, false);
  assert.equal(engine.getCalibration().status, 'unavailable');
});

test('calibration stays pending until the host serves a real sample', () => {
  const engine = createEngine();
  assert.equal(engine.getCalibration().status, 'pending');
  engine.setStats(null, 1000);
  assert.equal(engine.getCalibration().status, 'pending');
  engine.setStats({ decodeTokens: 10, decodeMs: 500 }, 1100);
  assert.equal(engine.getCalibration().status, 'available');
  assert.equal(engine.getCalibration().samples, 0);
});

test('manual calibration reset keeps availability and drops samples', () => {
  const engine = createEngine();
  engine.setStream({ ok: true });
  engine.setStats({ decodeTokens: 100, decodeMs: 1000 }, 1000);
  engine.notePartial(blocks('中'.repeat(80)), 1100);
  engine.setStats({ decodeTokens: 160, decodeMs: 1400 }, 1100);
  assert.ok(engine.getCalibration().samples > 0);
  engine.resetCalibration();
  assert.equal(engine.getCalibration().samples, 0);
  assert.equal(engine.getCalibration().available, true);
});

test('stream state changes bump the subscription version', () => {
  const engine = createEngine();
  let version = engine.getVersion();
  const seen = [];
  const off = engine.subscribe((next) => seen.push(next));
  engine.setStream({ ok: true });
  engine.setRunning(true);
  engine.setStats({ decodeTokens: 10, decodeMs: 500 }, 1000);
  off();
  assert.ok(engine.getVersion() > version);
  assert.ok(seen.length >= 3);
});

test('DOM fallback tokens feed the same meter', () => {
  const engine = createEngine();
  engine.noteTokens(25, 1000);
  const tps = engine.sample(1016);
  assert.ok(tps >= 0);
  assert.equal(engine.lastActivityAt(), 1000);
});
