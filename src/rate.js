/**
 * Live rate meter: a 1.2 s sliding window over estimated output tokens, a
 * bounded calibration factor learned from host `sessionStats`, and the
 * bookkeeping needed to tell "calibrated to 1.00" from "never calibrated".
 *
 * Time is always injected by the caller so the whole unit is testable without
 * a browser clock.
 */

import { clamp } from './measure.js';

const WINDOW_MS = 1200;
const ACTIVE_GAP_MS = 1500;
const MAX_SAMPLES = 240;

/**
 * @param {{ windowMs?: number, activeGapMs?: number }} [options]
 */
export const createRateMeter = (options = {}) => {
  const windowMs = Number(options.windowMs) > 0 ? Number(options.windowMs) : WINDOW_MS;
  const activeGapMs = Number(options.activeGapMs) > 0 ? Number(options.activeGapMs) : ACTIVE_GAP_MS;

  /** @type {{ t: number, tokens: number }[]} */
  let samples = [];
  let sessionEstimated = 0;
  let sessionActiveMs = 0;
  let lastTokenAt = null;
  let smooth = 0;
  let lastTickAt = 0;
  let calibration = 1;
  let sampleCount = 0;
  let lastCalibratedAt = 0;

  const prune = (at) => {
    let drop = 0;
    while (drop < samples.length && at - samples[drop].t > windowMs) drop += 1;
    if (drop > 0) samples = samples.slice(drop);
  };

  return {
    /**
     * Account for newly decoded content.
     *
     * @param {number} delta estimated tokens since the last call.
     * @param {number} at monotonic timestamp in ms.
     */
    note(delta, at) {
      if (!(delta > 0) || !Number.isFinite(at)) return;
      if (lastTokenAt !== null) {
        const gap = at - lastTokenAt;
        // Tool waits, user idle time, tab suspension and session boundaries
        // are not decode time.
        if (gap > 0 && gap <= activeGapMs) sessionActiveMs += gap;
      }
      lastTokenAt = at;
      sessionEstimated += delta;
      samples.push({ t: at, tokens: delta });
      if (samples.length > MAX_SAMPLES) samples = samples.slice(samples.length - MAX_SAMPLES);
    },

    /**
     * Advance smoothing and return the current calibrated speed.
     *
     * @param {number} at monotonic timestamp in ms.
     * @returns {number} tok/s.
     */
    tick(at) {
      if (!Number.isFinite(at)) return smooth;
      prune(at);
      let streamed = 0;
      for (const sample of samples) streamed += sample.tokens;
      const raw = (streamed / windowMs) * 1000 * calibration;
      const dt = clamp(at - lastTickAt, 0, 120);
      lastTickAt = at;
      if (dt > 0) smooth += (raw - smooth) * (1 - Math.pow(0.78, dt / 16.667));
      return Math.max(0, smooth);
    },

    /**
     * Learn from a host-session token delta and the estimated delta over the
     * same interval. Comparing token counts (rather than averages) keeps this
     * valid across turns and tool waits.
     *
     * @param {number} realDelta host `decodeTokens` delta.
     * @param {number} estimatedDelta estimated token delta.
     * @param {number} at monotonic timestamp in ms.
     * @returns {boolean} whether a sample was accepted.
     */
    calibrateFromCounts(realDelta, estimatedDelta, at) {
      if (!(realDelta >= 20) || !(estimatedDelta >= 8)) return false;
      const target = clamp(realDelta / estimatedDelta, 0.4, 2.5);
      calibration += (target - calibration) * 0.25;
      sampleCount += 1;
      lastCalibratedAt = Number.isFinite(at) ? at : 0;
      return true;
    },

    /**
     * Align the tick clock without changing the smoothed value. Called when the
     * rAF loop resumes after an idle stop so the first tick does not apply a
     * huge dt and jump the needle.
     *
     * @param {number} at monotonic timestamp in ms.
     */
    prime(at) {
      if (Number.isFinite(at)) lastTickAt = at;
    },

    /** A new generation starts: keep session calibration, reset the window. */
    resetGeneration() {
      samples = [];
      smooth = 0;
      lastTokenAt = null;
      // `lastTickAt` is intentionally kept: the next tick should not invent a
      // huge dt after an idle gap.
    },

    /** A different session (or a manual reset) starts from scratch. */
    resetSession() {
      this.resetGeneration();
      sessionEstimated = 0;
      sessionActiveMs = 0;
      calibration = 1;
      sampleCount = 0;
      lastCalibratedAt = 0;
    },

    /** Manual reset from the settings panel. */
    resetCalibration() {
      calibration = 1;
      sampleCount = 0;
      lastCalibratedAt = 0;
    },

    /**
     * @returns {{
     *   tps: number,
     *   calibration: number,
     *   sampleCount: number,
     *   lastCalibratedAt: number,
     *   estimated: number,
     *   activeMs: number,
     *   lastTokenAt: number,
     * }}
     */
    snapshot() {
      return {
        tps: Math.max(0, smooth),
        calibration,
        sampleCount,
        lastCalibratedAt,
        estimated: sessionEstimated,
        activeMs: sessionActiveMs,
        lastTokenAt: lastTokenAt ?? 0,
        samples: samples.map((sample) => ({ t: sample.t, tokens: sample.tokens })),
        lastTickAt,
      };
    },

    /**
     * @returns {number} session-wide estimated tokens, used for calibration.
     */
    estimatedTotal() {
      return sessionEstimated;
    },

    /**
     * @returns {number} monotonic timestamp of the last accounted token.
     */
    lastActivityAt() {
      return lastTokenAt ?? 0;
    },
  };
};
