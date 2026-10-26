/** Text for the most recent turn: first-token latency, average speed, size. */

const formatMs = (ms) => (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);

const formatTokens = (tokens) => (tokens < 1000 ? String(Math.round(tokens)) : `${(tokens / 1000).toFixed(1)}k`);

/**
 * @param {{ ttftMs: number|null, tokens: number, avgTps: number|null }|null} turn
 * @param {Function} t
 * @returns {string} empty when no turn has produced output yet.
 */
export const formatTurn = (turn, t) => {
  if (turn === null) return '';
  const parts = [];
  if (turn.ttftMs !== null) parts.push(t('turnTtft', { v: formatMs(turn.ttftMs) }));
  if (turn.avgTps !== null) parts.push(t('turnAvg', { v: Math.round(turn.avgTps) }));
  parts.push(t('turnTokens', { v: formatTokens(turn.tokens) }));
  return `${t('turnLabel')} ${parts.join(' · ')}`;
};
