import test from 'node:test';
import assert from 'node:assert/strict';

import { createRateMeter } from '../src/rate.js';

test('the live rate uses the 1.2 s window and smoothing', () => {
  const meter = createRateMeter();
  meter.note(120, 1000);
  let value = meter.tick(1000);
  assert.ok(value > 0);
  for (let time = 1016; time <= 1200; time += 16) value = meter.tick(time);
  assert.ok(value > 90 && value < 101, `expected ~100, got ${value}`);
});

test('calibration learns from token deltas and is bounded', () => {
  const meter = createRateMeter();
  meter.note(1000, 1000);
  assert.equal(meter.calibrateFromCounts(2000, 1000, 1000), true);
  let snapshot = meter.snapshot();
  assert.ok(Math.abs(snapshot.calibration - 1.25) < 1e-9);
  assert.equal(snapshot.sampleCount, 1);

  for (let index = 0; index < 40; index += 1) meter.calibrateFromCounts(2000, 1000, 2000);
  snapshot = meter.snapshot();
  assert.ok(snapshot.calibration <= 2.5);
  assert.ok(snapshot.calibration > 1.9);
  assert.equal(snapshot.sampleCount, 41);
});

test('calibration rejects small samples', () => {
  const meter = createRateMeter();
  assert.equal(meter.calibrateFromCounts(10, 5, 1000), false);
  assert.equal(meter.calibrateFromCounts(100, 4, 1000), false);
});

test('generation reset keeps calibration; session reset drops it', () => {
  const meter = createRateMeter();
  meter.note(1000, 1000);
  meter.calibrateFromCounts(2000, 1000, 1000);
  meter.resetGeneration();
  assert.ok(meter.snapshot().calibration > 1);
  assert.equal(meter.snapshot().sampleCount, 1);
  meter.resetSession();
  const snapshot = meter.snapshot();
  assert.equal(snapshot.calibration, 1);
  assert.equal(snapshot.sampleCount, 0);
  assert.equal(snapshot.estimated, 0);
});

test('idle gaps do not count as active decode time', () => {
  const meter = createRateMeter();
  meter.note(10, 0);
  meter.note(10, 100);
  meter.note(10, 2000);
  assert.equal(meter.snapshot().activeMs, 100);
  assert.equal(meter.snapshot().estimated, 30);
});

test('manual reset keeps the learned session counters', () => {
  const meter = createRateMeter();
  meter.note(100, 1000);
  meter.calibrateFromCounts(200, 100, 1000);
  meter.resetCalibration();
  assert.equal(meter.snapshot().calibration, 1);
  assert.equal(meter.snapshot().sampleCount, 0);
  assert.equal(meter.snapshot().estimated, 100);
});
