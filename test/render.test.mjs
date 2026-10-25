import test from 'node:test';
import assert from 'node:assert/strict';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { bindReact } from '../src/runtime.js';
import { createT } from '../src/i18n.js';
import { GaugeView } from '../src/ui/view.js';
import { createPreviewVm } from '../src/ui/preview.js';

bindReact(React, null);

const t = createT('zh');
const render = (vm, extra = {}) => renderToStaticMarkup(React.createElement(GaugeView, {
  vm,
  t,
  ...extra,
}));

test('every style renders its own instrument', () => {
  const heritage = render(createPreviewVm({ style: 'heritage' }));
  assert.match(heritage, /data-style="heritage"/);
  assert.match(heritage, /rg-heritage-arc/);
  assert.match(heritage, /rg-face-wrap/);

  const neon = render(createPreviewVm({ style: 'neon' }));
  assert.match(neon, /data-style="neon"/);
  assert.match(neon, /rg-screen/);
  assert.match(neon, /rg-neon-end/);

  const minimal = render(createPreviewVm({ style: 'minimal' }));
  assert.match(minimal, /data-style="minimal"/);
  assert.match(minimal, /rg-minimal-arc/);
  assert.match(minimal, /rg-line/);

  const terminal = render(createPreviewVm({ style: 'terminal' }));
  assert.match(terminal, /data-style="terminal"/);
  assert.match(terminal, /rg-term-bar/);
  assert.match(terminal, /rg-term-mini/);
});

test('the gauge shows rate, context and cache hit', () => {
  const html = render(createPreviewVm({ style: 'heritage' }));
  assert.match(html, />142</);
  assert.match(html, /tok\/s/);
  assert.match(html, /65%/);
  assert.match(html, /99\.9%/);
  assert.match(html, /aria-label="瞬时速度 142 tok\/s/);
  assert.match(html, /title="[^"]*142 tok\/s/);
});

test('minimal density folds the sub readouts into one line', () => {
  const html = render(createPreviewVm({ style: 'heritage', density: 'minimal' }));
  assert.match(html, /data-density="minimal"/);
  assert.match(html, /rg-inline/);
  assert.match(html, /CTX 65%/);
  assert.match(html, /HIT 99\.9%/);
});

test('compact hides the sub dial but keeps the rows', () => {
  const html = render(createPreviewVm({ style: 'heritage', density: 'compact' }));
  assert.match(html, /data-density="compact"/);
  assert.doesNotMatch(html, /rg-face-sub/);
  assert.match(html, /rg-rows/);
});

test('sub readouts can be turned off entirely', () => {
  const vm = { ...createPreviewVm({ style: 'neon' }), sub: false };
  const html = render(vm);
  assert.match(html, /data-sub="0"/);
  assert.doesNotMatch(html, /rg-rows/);
});

test('warning state and stale state are attributes, not label pollution', () => {
  const vm = { ...createPreviewVm({ style: 'minimal' }), warn: true, stale: true };
  const html = render(vm);
  assert.match(html, /data-warn="1"/);
  assert.match(html, /data-stale="1"/);
  assert.match(html, /data-source="projection"/);
});

test('English strings drive the tooltip and aria label', () => {
  const html = renderToStaticMarkup(React.createElement(GaugeView, {
    vm: createPreviewVm({ style: 'neon' }),
    t: createT('en'),
  }));
  assert.match(html, /Live speed 142 tok\/s/);
  assert.match(html, /cache hit 99\.9%/);
});

test('the interactive variant exposes a labelled settings button', () => {
  const vm = { ...createPreviewVm({ style: 'terminal' }), static: false };
  const html = render(vm, {
    onToggle: () => {},
    onOpenSettings: () => {},
    settingsOpen: true,
  });
  assert.match(html, /rg-gear/);
  assert.match(html, /aria-haspopup="dialog"/);
  assert.match(html, /aria-expanded="true"/);
  assert.match(html, /<button type="button" class="rg-toggle"/);
});
