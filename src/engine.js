/**
 * The meter engine: one process-wide instance shared by both dock slots, the
 * settings panel and the debug mirror. Owns the stream counter, the rate meter,
 * calibration bookkeeping and the activity signal the rAF loop listens to.
 */

import { createRateMeter } from './rate.js';
import { createStreamCounter } from './stream.js';

// Decode time cannot accrue faster than the wall clock. The slack absorbs
// batched projection pushes and modest decode overlap; a larger jump means the
// host totals now belong to another conversation.
const STATS_CLOCK_SLACK = 1.5;
const STATS_CLOCK_SLACK_MS = 2000;
// The factor is clamped to 0.4–2.5. A raw ratio far outside that range is not
// estimator bias but a mismatched interval, so it is rejected, not clamped.
const MIN_PLAUSIBLE_RATIO = 0.25;
const MAX_PLAUSIBLE_RATIO = 4;
// Without a host "running" flag, a pause this long starts a new turn.
const TURN_GAP_MS = 3000;
// Gaps longer than this (tool waits, stalls) are not decode time.
const TURN_ACTIVE_GAP_MS = 1500;
// Upper bound for the average: no decode is faster than this.
const TURN_MAX_TPS = 600;
const LOG_LIMIT = 20000;

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
  let previousDecodeMs = 0;
  let previousStatsAt = 0;
  let previousDecodeTokens = 0;
  let previousEstimated = 0;

  let turnActive = null;
  let turnEndedAt = null;
  let turn = null;
  let previousTurn = null;
  let skipNextTurnDelta = false;
  let log = [];

  const record = (entry) => {
    log.push(entry);
    // Trim in batches so a full log does not copy itself on every token.
    if (log.length > LOG_LIMIT * 1.25) log = log.slice(log.length - LOG_LIMIT);
  };

  const rebaseCalibration = (decodeTokens) => {
    lastRealDecode = decodeTokens;
    lastEstimated = rate.estimatedTotal();
  };

  const emit = () => {
    version += 1;
    for (const listener of listeners) listener(version);
  };

  const startTurn = (startAt) => {
    if (turn !== null && turn.firstAt !== null) previousTurn = turn;
    turn = { startAt, firstAt: null, lastAt: null, tokens: 0, activeTokens: 0, activeMs: 0 };
  };

  const noteTurn = (delta, at) => {
    const gap = turn && turn.lastAt !== null ? at - turn.lastAt : 0;
    if (turn === null || (turnActive !== true && turn.lastAt !== null && gap > TURN_GAP_MS)) startTurn(null);
    if (turn.firstAt === null) {
      turn.firstAt = at;
    } else if (gap > 0 && gap <= TURN_ACTIVE_GAP_MS) {
      // The first delta has no measured duration, so only later deltas feed
      // the average. A block that lands at once (tool arguments) is capped so
      // it cannot claim an impossible speed.
      turn.activeMs += gap;
      turn.activeTokens += Math.min(delta, (gap / 1000) * TURN_MAX_TPS);
    }
    turn.tokens += delta;
    turn.lastAt = at;
  };

  const markActivity = (delta, at, countTurn = true) => {
    if (countTurn) noteTurn(delta, at);
    record({ t: Math.round(at), k: 'tok', d: Math.round(delta * 100) / 100 });
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
      // A new generation resets the counter (so it does not count the new text
      // against the old one) but must not clear the live rate window: the
      // window decays on its own, and a hard reset here made the needle drop to
      // zero at every step/HIT refresh.
      if (result.delta > 0) {
        rate.note(result.delta, at);
        // The first delta after switching to the store recounts the whole
        // partial; it is not new output for the turn.
        markActivity(result.delta, at, !skipNextTurnDelta);
        skipNextTurnDelta = false;
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
      markActivity(delta, at);
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
        skipNextTurnDelta = true;
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
     * @param {number} [at] monotonic timestamp; starts the turn clock.
     */
    setRunning(value) {
      const next = typeof value === 'boolean' ? value : null;
      if (next === running) return;
      running = next;
      emit();
    },

    /**
     * The host's own turn flag (`state.running`), not one derived from tool
     * calls. A rising edge starts the first-token clock; a flap shorter than
     * the turn gap (between tool calls) continues the current turn.
     *
     * @param {boolean|null} value
     * @param {number} at monotonic timestamp.
     */
    setTurnActive(value, at) {
      const next = typeof value === 'boolean' ? value : null;
      if (next === turnActive) return;
      const known = Number.isFinite(at);
      if (next === true) {
        const flap = turnEndedAt !== null && known && at - turnEndedAt < TURN_GAP_MS && turn !== null;
        if (!flap) startTurn(known ? at : null);
      } else if (turnActive === true) {
        turnEndedAt = known ? at : null;
        emit();
      }
      turnActive = next;
      if (known) record({ t: Math.round(at), k: 'run', v: next });
    },

    /**
     * The most recent turn with output: the current one once it has produced
     * a token, otherwise the previous one. Tokens and speed carry the current
     * calibration factor; `ttftMs` is null without a host turn flag.
     *
     * @returns {{ ttftMs: number|null, tokens: number, avgTps: number|null }|null}
     */
    getLastTurn() {
      const shown = turn !== null && turn.firstAt !== null ? turn : previousTurn;
      if (shown === null) return null;
      const factor = rate.calibration();
      return {
        ttftMs: shown.startAt === null ? null : Math.max(0, shown.firstAt - shown.startAt),
        tokens: shown.tokens * factor,
        avgTps: shown.activeMs >= 500 ? (shown.activeTokens * factor) / (shown.activeMs / 1000) : null,
      };
    },

    /**
     * Raw measurement events for offline replay: token deltas, host stats,
     * running flips and calibration samples. Bounded; nothing leaves the page
     * unless the user exports it.
     */
    exportLog() {
      const calibration = rate.snapshot();
      return {
        format: 'retro-dock-log/1',
        calibration: { factor: calibration.calibration, samples: calibration.sampleCount, status: calibrationStatus },
        entries: log.slice(),
      };
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
      if (Number.isFinite(at)) record({ t: Math.round(at), k: 'stats', tok: decodeTokens, ms: decodeMs });
      hasSeenStats = true;
      calibrationStatus = 'available';
      calibrationAvailable = true;

      const decodeMsDelta = decodeMs - previousDecodeMs;
      const elapsed = at - previousStatsAt;
      const intervalReal = decodeTokens - previousDecodeTokens;
      const intervalEstimated = rate.estimatedTotal() - previousEstimated;
      previousDecodeMs = decodeMs;
      previousStatsAt = at;
      previousDecodeTokens = decodeTokens;
      previousEstimated = rate.estimatedTotal();

      if (sessionDecode === null) {
        sessionDecode = decodeTokens;
        rebaseCalibration(decodeTokens);
        emit();
        return;
      }

      if (decodeTokens < sessionDecode * 0.5) {
        // A stats projection drop is a calibration boundary, not a stream
        // reset. Keep the live rate window and the chat counter; only rebase
        // the calibration so a sub-dial refresh cannot zero the main needle.
        rate.resetCalibration();
        sessionDecode = decodeTokens;
        rebaseCalibration(decodeTokens);
        emit();
        return;
      }

      sessionDecode = decodeTokens;
      // Switching to a longer conversation raises the totals instead of
      // dropping them. That jump is not decode the meter observed, so the
      // baseline moves without a sample; the learned factor stays valid. Two
      // independent tells: decode time outrunning the wall clock, and host
      // tokens growing in an interval where the meter saw almost nothing
      // (an idle user switching conversations passes the clock check).
      const clockJump = !Number.isFinite(elapsed)
        || decodeMsDelta < 0
        || decodeMsDelta > elapsed * STATS_CLOCK_SLACK + STATS_CLOCK_SLACK_MS;
      const unseenTokens = intervalReal >= 20 && intervalEstimated * MAX_PLAUSIBLE_RATIO < intervalReal;
      if (clockJump || unseenTokens) {
        rebaseCalibration(decodeTokens);
        return;
      }

      const realDelta = decodeTokens - lastRealDecode;
      const estimatedDelta = rate.estimatedTotal() - lastEstimated;
      if (realDelta >= 20 && estimatedDelta >= 8) {
        const ratio = realDelta / estimatedDelta;
        if (ratio < MIN_PLAUSIBLE_RATIO || ratio > MAX_PLAUSIBLE_RATIO) {
          rebaseCalibration(decodeTokens);
          return;
        }
        if (rate.calibrateFromCounts(realDelta, estimatedDelta, at)) {
          record({ t: Math.round(at), k: 'cal', real: realDelta, est: Math.round(estimatedDelta * 100) / 100 });
          rebaseCalibration(decodeTokens);
          emit();
        }
        return;
      }
      if (realDelta < 0) rebaseCalibration(decodeTokens);
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

    /**
     * The host cleared/replaced the stream partial. Clear the counter so the
     * next generation is counted from zero, but leave the rate window alone so
     * the needle decays smoothly instead of snapping to zero.
     */
    endGeneration() {
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
      previousDecodeMs = 0;
      previousStatsAt = 0;
      previousDecodeTokens = 0;
      previousEstimated = 0;
      turn = null;
      previousTurn = null;
      turnEndedAt = null;
      emit();
    },

    /**
     * @param {number} at
     * @returns {number} calibrated, smoothed tok/s.
     */
    sample(at) {
      return rate.tick(at);
    },

    /**
     * Align the meter clock before resuming the display loop.
     *
     * @param {number} at
     */
    prime(at) {
      rate.prime(at);
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
