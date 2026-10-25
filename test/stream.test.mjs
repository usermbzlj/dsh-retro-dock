import test from 'node:test';
import assert from 'node:assert/strict';

import { contentOf, countStreamTokens, createStreamCounter } from '../src/stream.js';
import { countTokens } from '../src/measure.js';

test('contentOf counts model output and ignores block metadata', () => {
  assert.equal(contentOf({ kind: 'text', text: 'ab', callId: 'ignored' }), 'ab');
  assert.equal(contentOf({ kind: 'reasoning', text: '中' }), '中');
  assert.equal(contentOf({ kind: 'tool-call', argsRaw: '{"a":1}', name: 'read_file' }), '{"a":1}');
  assert.equal(contentOf({ kind: 'tool-result', text: 'not model output' }), '');
  assert.equal(contentOf(null), '');
});

test('countStreamTokens sums only content', () => {
  const value = [
    { kind: 'text', text: 'ab' },
    { kind: 'reasoning', text: '中' },
    { kind: 'tool-call', argsRaw: '{"a":1}' },
    { kind: 'tool-result', text: 'ignored' },
  ];
  const expected = countTokens('ab') + countTokens('中') + countTokens('{"a":1}');
  assert.ok(Math.abs(countStreamTokens(value) - expected) < 1e-9);
});

test('incremental counter only counts the appended slice', () => {
  const counter = createStreamCounter();
  let result = counter.update([{ kind: 'text', text: 'Hello' }]);
  assert.equal(result.reset, false);
  assert.ok(result.total > 0);
  const first = result.total;

  result = counter.update([{ kind: 'text', text: 'Hello world' }]);
  assert.equal(result.reset, false);
  assert.ok(Math.abs(result.delta - countTokens(' world')) < 1e-9);
  assert.ok(Math.abs(result.total - (first + countTokens(' world'))) < 1e-9);

  result = counter.update([
    { kind: 'text', text: 'Hello world' },
    { kind: 'reasoning', text: '思考' },
  ]);
  assert.equal(result.reset, false);
  assert.ok(Math.abs(result.delta - countTokens('思考')) < 1e-9);
});

test('a shrinking or rewritten block restarts the generation', () => {
  const counter = createStreamCounter();
  counter.update([{ kind: 'text', text: 'abcdef' }]);
  let result = counter.update([{ kind: 'text', text: 'abc' }]);
  assert.equal(result.reset, true);
  assert.equal(result.delta, 0);
  assert.ok(Math.abs(result.total - countTokens('abc')) < 1e-9);

  counter.update([{ kind: 'text', text: 'abcdefgh' }, { kind: 'text', text: 'second' }]);
  result = counter.update([{ kind: 'text', text: 'abcdefgh' }]);
  assert.equal(result.reset, true);
  assert.ok(Math.abs(result.total - countTokens('abcdefgh')) < 1e-9);
});

test('reset clears the running total', () => {
  const counter = createStreamCounter();
  counter.update([{ kind: 'text', text: 'hello' }]);
  counter.reset();
  assert.equal(counter.total(), 0);
  const result = counter.update([{ kind: 'text', text: 'new' }]);
  assert.equal(result.delta, countTokens('new'));
});
