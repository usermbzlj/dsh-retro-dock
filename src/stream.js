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

  const rebuild = (blocks) => {
    const next = [];
    let sum = 0;
    for (const block of blocks) {
      const text = contentOf(block);
      const count = countTokens(text);
      next.push({ kind: block && block.kind, text, count });
      sum += count;
    }
    previous = next;
    total = sum;
    return sum;
  };

  return {
    update(value) {
      if (!Array.isArray(value)) {
        return { total, delta: 0, reset: true };
      }
      if (value.length < previous.length) {
        return { total: rebuild(value), delta: 0, reset: true };
      }

      let delta = 0;
      let reset = false;
      const next = [];
      for (let index = 0; index < value.length; index += 1) {
        const block = value[index];
        const text = contentOf(block);
        const kind = block && block.kind;
        const prior = previous[index];
        if (prior === undefined) {
          const count = countTokens(text);
          delta += count;
          next.push({ kind, text, count });
          continue;
        }
        if (text === prior.text) {
          next.push(prior);
          continue;
        }
        if (text.startsWith(prior.text)) {
          const added = countTokens(text.slice(prior.text.length));
          const count = prior.count + added;
          delta += added;
          next.push({ kind, text, count });
          continue;
        }
        // Rewritten block (stream rewind, conversion, or a replaced node):
        // recount it and, if it lost tokens, restart the generation.
        const count = countTokens(text);
        if (count < prior.count) reset = true;
        delta += count - prior.count;
        next.push({ kind, text, count });
      }

      if (reset) {
        let sum = 0;
        for (const item of next) sum += item.count;
        previous = next;
        total = sum;
        return { total, delta: 0, reset: true };
      }

      previous = next;
      total += delta;
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
