/**
 * Incremental accounting for the streaming partial. The host publishes the
 * whole partial on every change; recounting all of it is O(n) per update and
 * O(n²) per generation, so this keeps the previous text per block and counts
 * only the appended slice.
 */

import { countTokens } from './measure.js';

const isText = (value) => typeof value === 'string';

/**
 * The model-output content carried by one block. Metadata (`kind`, `callId`,
 * tool name, ids) is deliberately excluded: it is not decoded output.
 *
 * @param {unknown} block
 * @returns {string}
 */
export const contentOf = (block) => {
  if (isText(block)) return block;
  if (block === null || typeof block !== 'object') return '';
  switch (block.kind) {
    case 'text':
    case 'reasoning':
      return isText(block.text) ? block.text : '';
    case 'tool-call':
      return isText(block.argsRaw) ? block.argsRaw : '';
    case 'tool-result':
      return '';
    default: {
      let text = '';
      if (isText(block.text)) text += block.text;
      if (isText(block.reasoning)) text += block.reasoning;
      if (isText(block.argsRaw)) text += block.argsRaw;
      if (isText(block.content)) text += block.content;
      if (isText(block.delta)) text += block.delta;
      return text;
    }
  }
};

/**
 * Stateless helper kept for tests and for callers that only need a total.
 *
 * @param {unknown} value partial blocks, a block, or a string.
 * @returns {number}
 */
export const countStreamTokens = (value) => {
  if (isText(value)) return countTokens(value);
  if (Array.isArray(value)) {
    let total = 0;
    for (const item of value) total += countStreamTokens(item);
    return total;
  }
  if (value === null || typeof value !== 'object') return 0;
  if (Array.isArray(value.blocks)) return countStreamTokens(value.blocks);
  if (value.kind !== undefined) return countTokens(contentOf(value));
  return 0;
};

/**
 * Stateful counter. `update(blocks)` returns the running total, the delta since
 * the previous call, and whether the generation restarted.
 *
 * @returns {{
 *   update: (blocks: unknown) => { total: number, delta: number, reset: boolean },
 *   reset: () => void,
 *   total: () => number,
 * }}
 */
export const createStreamCounter = () => {
  let total = 0;
  let previous = [];

  return {
    update(value) {
      if (!Array.isArray(value)) {
        return { total, delta: 0, reset: true };
      }

      let nextTotal = 0;
      const next = [];
      for (let index = 0; index < value.length; index += 1) {
        const block = value[index];
        const text = contentOf(block);
        const kind = block && block.kind;
        const prior = previous[index];
        if (prior === undefined) {
          const count = countTokens(text);
          nextTotal += count;
          next.push({ kind, text, count });
          continue;
        }
        if (text === prior.text) {
          nextTotal += prior.count;
          next.push(prior);
          continue;
        }
        if (text.startsWith(prior.text)) {
          const added = countTokens(text.slice(prior.text.length));
          const count = prior.count + added;
          nextTotal += count;
          next.push({ kind, text, count });
          continue;
        }
        // Rewritten block (stream rewind, conversion, or a replaced node).
        // Recount it, but only restart the generation when the running total
        // actually went down; a rewrite that still grows the generation must
        // not make the needle drop to zero.
        const count = countTokens(text);
        nextTotal += count;
        next.push({ kind, text, count });
      }

      if (nextTotal < total) {
        previous = next;
        total = nextTotal;
        return { total, delta: 0, reset: true };
      }

      const delta = nextTotal - total;
      previous = next;
      total = nextTotal;
      return { total, delta, reset: false };
    },
    reset() {
      total = 0;
      previous = [];
    },
    total() {
      return total;
    },
  };
};
