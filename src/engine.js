/**
 * The meter engine: one process-wide instance shared by both dock slots, the
 * settings panel and the debug mirror. Owns the stream counter, the rate meter,
 * calibration bookkeeping and the activity signal the rAF loop listens to.
 */

import { createRateMeter } from './rate.js';
import { createStreamCounter } from './stream.js';

/**
 * @param {{ now?: () => number }} [options]
 */
export const createEngine = (options = {}) => {
  const rate = createRateMeter(options.rate);
  const counter = createStreamCounter();
  const listeners = new Set();
  const activityListeners = new Set();

  let streamOk = false;
  let broken = false;
  let running = null;
  let lastNoteAt = 0;
  let version = 0;
  let sessionDecode = null;
  let lastRealDecode = 0;
  let lastEstimated = 0;
  let calibrationAvailable = false;
  let calibrationStatus = 'pending';
  let hasSeenStats = false;
  let lastStatsKey = '';

  const emit = () => {
    version += 1;
    for (const listener of listeners) listener(version);
  };

  const markActivity = (at) => {
    lastNoteAt = Math.max(lastNoteAt, at);
    for (const listener of activityListeners) listener();
  };

  return {
    /**
     * Feed the current streaming partial. Only model output counts; the
     * counter turns it into a delta so long generations stay O(delta).
     *
     * @param {unknown} blocks `legacy.partial.blocks`.
     * @param {number} at monotonic timestamp.
     */
    notePartial(blocks, at) {
      const result = counter.update(blocks);
      if (result.reset) rate.resetGeneration();
      if (result.delta > 0) {
        rate.note(result.delta, at);
        markActivity(at);
      }
      return result;
    },

    /**
     * Feed tokens observed through the DOM fallback.
     *
     * @param {number} delta
     * @param {number} at
     */
    noteTokens(delta, at) {
      if (!(delta > 0)) return;
      rate.note(delta, at);
      markActivity(at);
    },

    /**
     * @param {{ ok: boolean, broken?: boolean }} state
     */
    setStream(state) {
      const nextOk = state?.ok === true;
      const nextBroken = state?.broken === true;
      if (nextOk === streamOk && nextBroken === broken) return;
      if (nextOk && !streamOk) {
        // Switching from DOM observation to the store: do not mix samples and
        // realign the calibration baseline with the fresh session total.
        counter.reset();
        rate.resetGeneration();
        lastEstimated = rate.estimatedTotal();
        if (sessionDecode !== null) lastRealDecode = sessionDecode;
      }
      if (!nextOk) counter.reset();
      streamOk = nextOk;
      broken = nextBroken;
      emit();
    },

    /**
     * @param {boolean|null} value host "running" flag.
     */
    setRunning(value) {
      const next = typeof value === 'boolean' ? value : null;
      if (next === running) return;
      running = next;
      emit();
    },

    /**
     * Calibrate against the host's durable session statistics. Comparing token
     * deltas keeps this valid across turns, tool waits and reloads.
     *
     * @param {{ decodeTokens?: number, decodeMs?: number }|null} stats
     * @param {number} at
     */
    setStats(stats, at) {
      if (stats === null || typeof stats !== 'object') {
        // Never report "unavailable" before the host has had a chance to serve
        // a projection; an assembly without sessionStats is only known after a
        // valid sample went missing.
        if (!hasSeenStats) return;
        if (calibrationStatus !== 'unavailable') {
          calibrationStatus = 'unavailable';
          calibrationAvailable = false;
          emit();
        }
        return;
      }
      const decodeTokens = Number(stats.decodeTokens);
      const decodeMs = Number(stats.decodeMs);
      if (!Number.isFinite(decodeTokens) || !Number.isFinite(decodeMs)) {
        if (!hasSeenStats) return;
        if (calibrationStatus !== 'unavailable') {
          calibrationStatus = 'unavailable';
          calibrationAvailable = false;
          emit();
        }
        return;
      }
      const key = `${decodeTokens}:${decodeMs}`;
      if (key === lastStatsKey) return;
      lastStatsKey = key;
      hasSeenStats = true;
      calibrationStatus = 'available';
      calibrationAvailable = true;

      if (sessionDecode === null) {
        sessionDecode = decodeTokens;
        lastRealDecode = decodeTokens;
        lastEstimated = rate.estimatedTotal();
        emit();
        return;
      }

      if (decodeTokens < sessionDecode * 0.5) {
        rate.resetSession();
        counter.reset();
        sessionDecode = decodeTokens;
        lastRealDecode = decodeTokens;
        lastEstimated = 0;
        emit();
        return;
      }

      sessionDecode = decodeTokens;
      const realDelta = decodeTokens - lastRealDecode;
      const estimatedDelta = rate.estimatedTotal() - lastEstimated;
      if (realDelta >= 20 && estimatedDelta >= 8) {
        if (rate.calibrateFromCounts(realDelta, estimatedDelta, at)) {
          lastRealDecode = decodeTokens;
          lastEstimated = rate.estimatedTotal();
          emit();
        }
        return;
      }
      if (realDelta < 0) {
        lastRealDecode = decodeTokens;
        lastEstimated = rate.estimatedTotal();
      }
    },

    /** Manual reset from settings. Keeps the session counters intact. */
    resetCalibration() {
      rate.resetCalibration();
      emit();
    },

    /** Start a new generation inside the same session (keep calibration). */
    resetGeneration() {
      rate.resetGeneration();
      counter.reset();
    },

    /** New session: drop samples, calibration and counter state. */
    resetSession() {
      rate.resetSession();
      counter.reset();
      sessionDecode = null;
      lastRealDecode = 0;
      lastEstimated = 0;
      lastStatsKey = '';
      emit();
    },

    /**
     * @param {number} at
     * @returns {number} calibrated, smoothed tok/s.
     */
    sample(at) {
      return rate.tick(at);
    },

    /** @returns {{ factor: number, samples: number, available: boolean, status: string, lastAt: number }} */
    getCalibration() {
      const snapshot = rate.snapshot();
      return {
        factor: snapshot.calibration,
        samples: snapshot.sampleCount,
        available: calibrationAvailable,
        status: calibrationStatus,
        lastAt: snapshot.lastCalibratedAt,
      };
    },

    /** @returns {number} */
    lastActivityAt() {
      return lastNoteAt;
    },

    /** @returns {boolean} */
    isStreamAvailable() {
      return streamOk;
    },

    /** @returns {boolean} */
    isStreamBroken() {
      return broken;
    },

    /** @returns {boolean|null} */
    isRunning() {
      return running;
    },

    /** @returns {number} bump on any non-rate state change. */
    getVersion() {
      return version;
    },

    /** @returns {object} for `window.__retroDock` and tests. */
    getState() {
      const snapshot = rate.snapshot();
      return {
        ...snapshot,
        streamOk,
        broken,
        running,
        lastNoteAt,
        calibrationAvailable,
        version,
      };
    },

    /**
     * @param {(version: number) => void} listener
     * @returns {() => void}
     */
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    /**
     * @param {() => void} listener called when new tokens arrive.
     * @returns {() => void}
     */
    onActivity(listener) {
      activityListeners.add(listener);
      return () => activityListeners.delete(listener);
    },
  };
};

/** Process-wide engine. Both slots read the same measurements. */
export const engine = createEngine();
