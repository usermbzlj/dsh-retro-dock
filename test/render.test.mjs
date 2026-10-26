import test from 'node:test';
import assert from 'node:assert/strict';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { bindReact } from '../src/runtime.js';
import { createT } from '../src/i18n.js';
import { ClassicGauge, ClassicPreview, createClassicVm } from '../src/ui/classic.js';
import { DesignGauge, DesignPreview } from '../src/ui/design-gauge.js';
import { createVm } from '../src/ui/vm.js';
import { DESIGN_IDS } from '../src/designs/meta.js';

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
  assert.match(html, /class="rg-approx"[^>]*>≈</);
  assert.match(html, /class="rg-digits"[^>]*>142</);
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

test('minimal warning gets colour plus a non-colour mark', () => {
  const html = render(createClassicVm({ density: 'minimal', ctx: 85 }));
  assert.match(html, /data-warn="1"/);
  assert.match(html, /class="rg-alert"/);
  assert.match(html, /CTX 85%/);
});

test('a DOM fallback gets a visible quality badge', () => {
  const html = render({ ...createClassicVm(), source: 'dom' });
  assert.match(html, /class="rg-quality"/);
  assert.match(html, /data-quality="dom"/);
  assert.match(html, />DOM</);
  assert.match(html, /页面文本/);
});

test('the sub dial carries the warning redline at the configured threshold', () => {
  const html = render(createClassicVm({ warnAt: 90, ctx: 95 }));
  assert.match(html, /class="rg-redline"/);
  assert.match(html, /rg-arc-ctx-warn/);
});

test('English strings drive the aria label', () => {
  const html = renderToStaticMarkup(React.createElement(ClassicGauge, {
    vm: createClassicVm(),
    t: createT('en'),
  }));
  assert.match(html, /Live speed 142 tok\/s/);
  assert.match(html, /cache hit 99\.9%/);
});

test('the interactive gauge is a button with an action label', () => {
  const html = render({ ...createClassicVm({ placement: 'input' }), static: false }, {
    onToggle: () => {},
  });
  assert.match(html, /role="button"/);
  assert.match(html, /tabindex="0"/);
  assert.doesNotMatch(html, /rg-gear/);
  assert.doesNotMatch(html, /aria-pressed/);
  assert.match(html, /当前在输入框上方/);
  assert.match(html, /切换到统计条/);
  assert.match(html, /数据源 宿主统计/);
});

test('the static preview is inert and carries the needle position', () => {
  const html = createClassicVm();
  const markup = render(html);
  assert.match(markup, /role="img"/);
  assert.match(markup, /--rg-p:/);
  assert.match(markup, /data-static="1"/);
});

test('the settings preview follows scale, placement, density and warning threshold', () => {
  const markup = renderToStaticMarkup(React.createElement(ClassicPreview, {
    placement: 'input',
    density: 'minimal',
    scale: 300,
    warnAt: 90,
    sub: false,
    t,
  }));
  assert.match(markup, /data-variant="input"/);
  assert.match(markup, /data-density="minimal"/);
  assert.match(markup, /data-sub="0"/);
  assert.match(markup, /满量程 300 tok\/s/);
  assert.match(markup, /CTX 警戒 90%/);
});


const designRender = (style, extra = {}, props = {}) => renderToStaticMarkup(React.createElement(DesignGauge, {
  vm: createVm({ style, ...extra }),
  t,
  ...props,
}));

const DESIGN_MARKERS = {
  bench: [/rgx-bench-dial/, /rgx-bench-bar/, /rgx-bench-window/],
  vu: [/rgx-vu-scale/, /rgx-vu-redzone/, /rgx-vu-needle/],
  altimeter: [/rgx-drum/, /rgx-alt-window/, /rgx-alt-bar/],
  signal: [/rgx-signal-arm/, /rgx-signal-lamp is-on/, /rgx-signal-counter/],
  chart: [/rgx-chart-line/, /rgx-chart-pressure/, /rgx-chart-margin/],
  swiss: [/rgx-swiss-rule/, /rgx-swiss-mini-rule/, /rgx-swiss-rate-cursor/],
  compass: [/rgx-compass-card/, /rgx-compass-ctx-fill/, /rgx-compass-read/],
};

test('all seven instrument languages render at 1x with their own mechanism', () => {
  assert.equal(DESIGN_IDS.length, 7);
  for (const style of DESIGN_IDS) {
    const html = designRender(style);
    assert.match(html, new RegExp('data-style="' + style + '"'));
    assert.match(html, /class="rg-gauge rgx-gauge"/);
    assert.match(html, /data-static="1"/);
    assert.match(html, /role="img"/);
    for (const marker of DESIGN_MARKERS[style]) assert.match(html, marker, style);
  }
});

test('every instrument keeps the same data contract in its own markup', () => {
  for (const style of DESIGN_IDS) {
    const html = designRender(style);
    assert.match(html, /65%/, style);
    assert.match(html, /99\.9%/, style);
    assert.match(html, /数据源 宿主统计/, style);
  }
});

test('minimal folds every instrument into the shared compact line', () => {
  for (const style of DESIGN_IDS) {
    const html = designRender(style, { density: 'minimal' });
    assert.match(html, /data-density="minimal"/, style);
    assert.match(html, /rgx-mini/, style);
    assert.match(html, /CTX 65%/, style);
    assert.match(html, /HIT 99\.9%/, style);
  }
});

test('warning, over-range, DOM and stale stay visible on the new shell', () => {
  const warn = designRender('signal', { ctx: 85 });
  assert.match(warn, /data-warn="1"/);
  assert.match(warn, /rgx-signal-alert/);

  const over = designRender('bench', { tps: 252 });
  assert.match(over, /data-over="1"/);
  assert.match(over, /rgx-bench-over-flag/);

  const dom = designRender('chart', { source: 'dom' });
  assert.match(dom, /class="rgx-quality"/);
  assert.match(dom, />DOM</);

  const stale = designRender('compass', { stale: true });
  assert.match(stale, /data-stale="1"/);
  assert.match(stale, /class="rgx-quality"/);
});

test('an unknown CTX lights no signal lamp', () => {
  const known = designRender('signal', { ctx: 20 });
  assert.match(known, /rgx-signal-lamp is-on" data-lamp="green"/);

  const unknown = designRender('signal', { ctx: null });
  assert.doesNotMatch(unknown, /is-on/);
  assert.match(unknown, /CTX[^<]*<\/span>[\s\S]*?—/);
});

test('the new shell is interactive when it is not a preview', () => {
  const html = designRender('vu', { placement: 'input' }, {
    onToggle: () => {},
    vm: { ...createVm({ style: 'vu', placement: 'input' }), static: false },
  });
  assert.match(html, /role="button"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /当前在输入框上方/);
});

test('the design preview follows scale, threshold, density and sub visibility', () => {
  const html = renderToStaticMarkup(React.createElement(DesignPreview, {
    style: 'swiss',
    placement: 'dock',
    density: 'minimal',
    scale: 300,
    warnAt: 90,
    sub: false,
    ctx: 75,
    t,
  }));
  assert.match(html, /data-style="swiss"/);
  assert.match(html, /data-variant="dock"/);
  assert.match(html, /data-density="minimal"/);
  assert.match(html, /data-sub="0"/);
  assert.match(html, /满量程 300 tok\/s/);
  assert.match(html, /CTX 警戒 90%/);
});
