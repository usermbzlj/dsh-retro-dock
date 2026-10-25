import test from 'node:test';
import assert from 'node:assert/strict';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { bindReact } from '../src/runtime.js';
import { createT } from '../src/i18n.js';
import { ClassicGauge, createClassicVm } from '../src/ui/classic.js';

bindReact(React, null);

const t = createT('zh');
const render = (vm, extra = {}) => renderToStaticMarkup(React.createElement(ClassicGauge, {
  vm,
  t,
  ...extra,
}));

test('the classic gauge renders the main dial, sub dial and readouts', () => {
  const html = render(createClassicVm());
  assert.match(html, /class="rg-gauge"/);
  assert.match(html, /rg-dial/);
  assert.match(html, /rg-module-minor/);
  assert.match(html, /rg-arc-rate/);
  assert.match(html, /rg-arc-ctx/);
  assert.match(html, /rg-arc-hit/);
  assert.match(html, />≈142</);
  assert.match(html, />65</);
  assert.match(html, />99\.9%</);
});

test('minimal density folds CTX and HIT into one line', () => {
  const html = render(createClassicVm({ density: 'minimal' }));
  assert.match(html, /data-density="minimal"/);
  assert.match(html, /rg-meta/);
  assert.match(html, /CTX 65%/);
  assert.match(html, /HIT 99\.9%/);
});

test('the sub readouts can be hidden', () => {
  const html = render({ ...createClassicVm(), sub: false });
  assert.match(html, /data-sub="0"/);
  assert.match(html, /hidden=""/);
});

test('warning and stale states are attributes', () => {
  const html = render({ ...createClassicVm({ ctx: 85 }), stale: true });
  assert.match(html, /data-warn="1"/);
  assert.match(html, /data-stale="1"/);
  assert.match(html, /data-source="projection"/);
});

test('English strings drive the aria label', () => {
  const html = renderToStaticMarkup(React.createElement(ClassicGauge, {
    vm: createClassicVm(),
    t: createT('en'),
  }));
  assert.match(html, /Live speed 142 tok\/s/);
  assert.match(html, /cache hit 99\.9%/);
});

test('the interactive gauge is a button and has no settings gear', () => {
  const html = render({ ...createClassicVm(), static: false }, {
    onToggle: () => {},
  });
  assert.match(html, /role="button"/);
  assert.match(html, /tabindex="0"/);
  assert.doesNotMatch(html, /rg-gear/);
  assert.match(html, /aria-pressed="false"/);
});

test('the static preview is inert and carries the needle position', () => {
  const html = createClassicVm();
  const markup = render(html);
  assert.match(markup, /role="img"/);
  assert.match(markup, /--rg-p:/);
  assert.match(markup, /data-static="1"/);
});
