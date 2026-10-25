/**
 * Pure measurement helpers. No DOM, no React, no host access: everything here
 * is exercised by `npm test` and shared by the renderer and the meter.
 */

export const FULL_SCALES = Object.freeze([120, 180, 240, 300]);
export const WARN_LEVELS = Object.freeze([70, 80, 90]);

export const clamp = (value, min, max) => (value < min ? min : value > max ? max : value);

/**
 * Rough token weight per character class. DeepSeek documents about 0.6
 * token/CJK character and 0.3 token/ASCII letter; these are estimates, not a
 * tokenizer. Calibration narrows the residual bias.
 *
 * @param {number} code Unicode code point.
 * @returns {number} estimated tokens for that character.
 */
export const tokenWeight = (code) => {
  if (code >= 0x2e80) return 0.6;
  if (code >= 48 && code <= 57) return 0.3;
  if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) return 0.3;
  if (code === 32) return 0.06;
  if (code === 10 || code === 9) return 0.1;
  return 0.35;
};

/**
 * @param {string} text Estimated token count of a string.
 * @returns {number}
 */
export const countTokens = (text) => {
  if (typeof text !== 'string' || text.length === 0) return 0;
  let total = 0;
  for (const char of text) total += tokenWeight(char.codePointAt(0));
  return total;
};

/**
 * Current context occupancy from the host projection.
 *
 * @param {unknown} pressure `contextPressure` projection value.
 * @returns {number|null} integer percent, or null when unavailable.
 */
export const contextPercent = (pressure) => {
  if (pressure === null || typeof pressure !== 'object') return null;
  const used = Number(pressure.projectedTokens ?? pressure.pressureTokens);
  const windowSize = Number(pressure.contextWindow);
  if (!Number.isFinite(used) || !Number.isFinite(windowSize) || windowSize <= 0) return null;
  return clamp(Math.round((used / windowSize) * 100), 0, 100);
};

/**
 * Sum the three disjoint prompt-side billing buckets. Matches the host's
 * `billedInputTokens`, so HIT here and HIT in the host stats pill agree.
 *
 * @param {unknown} usage `tokenUsage` projection value.
 * @returns {number}
 */
export const billedInputTokens = (usage) => {
  if (usage === null || typeof usage !== 'object') return 0;
  const read = Number(usage.cacheReadTokens);
  const uncached = Number(usage.uncachedInputTokens);
  const write = Number(usage.cacheWriteTokens);
  return (Number.isFinite(uncached) ? uncached : 0)
    + (Number.isFinite(read) ? read : 0)
    + (Number.isFinite(write) ? write : 0);
};

/**
 * Whole-session cache-hit share, as a percentage.
 *
 * @param {unknown} usage `tokenUsage` projection value.
 * @returns {number|null}
 */
export const cacheHitPercent = (usage) => {
  if (usage === null || typeof usage !== 'object') return null;
  const read = Number(usage.cacheReadTokens);
  if (!Number.isFinite(read)) return null;
  const billed = billedInputTokens(usage);
  if (billed <= 0) return null;
  return clamp((read / billed) * 100, 0, 100);
};

const roundedPercentUnits = (read, prompt, decimalPlaces) => {
  const scale = 10 ** decimalPlaces;
  return Math.round((read * 100 * scale) / prompt);
};

const displayPercentUnits = (units, decimalPlaces) => {
  if (decimalPlaces === 0) return String(units);
  const scale = 10 ** decimalPlaces;
  const whole = Math.floor(units / scale);
  const rest = units - whole * scale;
  return `${whole}.${String(rest).padStart(decimalPlaces, '0')}`;
};

/**
 * Host-compatible cache-hit label from exact token buckets: an integer while
 * integer rounding stays below 100, otherwise the minimum precision that stays
 * honest. A full hit is exactly `100`.
 *
 * Mirrors `formatCacheHitPercent` in the host chat package.
 *
 * @param {unknown} usage `tokenUsage` projection value.
 * @returns {string}
 */
export const formatHitFromUsage = (usage) => {
  if (usage === null || typeof usage !== 'object') return '—';
  const read = Number(usage.cacheReadTokens);
  if (!Number.isFinite(read) || read < 0) return '—';
  const prompt = billedInputTokens(usage);
  if (!(prompt > 0)) return '—';
  if (read >= prompt) return '100';

  const roundedUnits = roundedPercentUnits(read, prompt, 0);
  if (roundedUnits < 100) return displayPercentUnits(roundedUnits, 0);

  const missed = prompt - read;
  let distinguishingPlaces = 1;
  let scaledGap = missed * 200;
  const denominatorTens = Math.floor(prompt / 10);
  while (scaledGap <= denominatorTens) {
    scaledGap *= 10;
    distinguishingPlaces += 1;
  }
  const denominatorOnes = prompt % 10;
  let roundedLoss = 5;
  for (let loss = 1; loss < 5; loss += 1) {
    const factor = loss * 2 + 1;
    const threshold = factor * denominatorTens + Math.floor((factor * denominatorOnes) / 10);
    if (scaledGap <= threshold) {
      roundedLoss = loss;
      break;
    }
  }
  return `99.${'9'.repeat(Math.max(0, distinguishingPlaces - 1))}${10 - roundedLoss}`;
};

/**
 * Fallback formatter when only a percentage was scraped from the DOM.
 *
 * @param {number|null|undefined} value percentage.
 * @returns {string}
 */
export const formatHitPercent = (value) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  const hit = clamp(Number(value), 0, 100);
  if (hit >= 100) return '100';
  let text = String(Math.round(hit));
  if (Number(text) < 100) return text;
  text = hit.toFixed(1);
  if (Number(text) < 100) return text;
  text = hit.toFixed(2);
  if (Number(text) < 100) return text;
  return '99.99';
};

/**
 * Accept either a `tokenUsage` object (preferred, exact) or a percentage
 * (DOM fallback).
 *
 * @param {unknown} value
 * @returns {string}
 */
export const formatHit = (value) => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'object') return formatHitFromUsage(value);
  return formatHitPercent(Number(value));
};

/**
 * @param {number|null|undefined} value
 * @returns {string} integer percent without the sign, or an em dash.
 */
export const formatCtx = (value) => {
  if (value === null || value === undefined || !Number.isFinite(value)) return '—';
  return String(clamp(Math.round(value), 0, 100));
};

/**
 * Average speed over active decode time only.
 *
 * @param {number} tokens
 * @param {number} decodeMs
 * @returns {number}
 */
export const activeAverage = (tokens, decodeMs) => {
  const ms = Number(decodeMs) || 0;
  const count = Number(tokens) || 0;
  return ms > 500 && count > 0 ? count / (ms / 1000) : 0;
};

/**
 * @param {number} value
 * @returns {string} rounded, non-negative display value.
 */
export const formatTps = (value) => {
  if (!Number.isFinite(value)) return '0';
  return String(Math.round(Math.max(0, value)));
};

/**
 * Needle position 0-100 and overspeed 0-1 for a reading.
 *
 * @param {number} tps
 * @param {number} scale tok/s at the end of the dial.
 * @returns {{ position: number, over: number }}
 */
export const dialPosition = (tps, scale) => {
  const full = Number(scale) || 180;
  const value = Number.isFinite(tps) ? Math.max(0, tps) : 0;
  return {
    position: clamp((value / full) * 100, 0, 100),
    over: clamp((value - full) / (full * 0.6), 0, 1),
  };
};
