/**
 * Style gallery for the restored classic dual-dial UI. Used for the README
 * screenshots and for eyeballing the gauge without the host.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import { bindReact } from '../src/runtime.js';
import { CSS } from '../src/styles/index.js';
import { createT } from '../src/i18n.js';
import { ClassicGauge, createClassicVm } from '../src/ui/classic.js';
import { SettingsSection } from '../src/ui/settings.js';
import { VERSION } from '../src/version.js';

bindReact(React, null);

const params = new URLSearchParams(window.location.search);
const theme = params.get('theme') === 'light' ? 'light' : 'dark';
const still = params.get('static') === '1';
if (theme === 'dark') document.body.setAttribute('data-ds-dark-theme', '');
if (still) document.body.setAttribute('data-static', '1');
document.documentElement.style.background = theme === 'dark' ? '#0f0f10' : '#f6f7f9';
document.body.style.background = theme === 'dark' ? '#0f0f10' : '#f6f7f9';

const t = createT('zh');

const GALLERY_CSS = String.raw`
html, body { margin: 0; padding: 0; }
body {
  --dsw-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  --ds-font-family-code: "Cascadia Mono", "SF Mono", Consolas, "Liberation Mono", monospace;
  --dsw-alias-label-primary: #f5f5f5;
  --dsw-alias-label-secondary: #d4d4d4;
  --dsw-alias-label-tertiary: #9aa0a8;
  --dsw-alias-border-l2: rgba(255, 255, 255, .09);
  --dsw-alias-border-l3: rgba(255, 255, 255, .14);
  --dsw-alias-bg-base: #0f0f10;
  --dsw-alias-bg-layer-1: #1b1b1c;
  --dsw-alias-bg-layer-2: #212123;
  --dsw-alias-bg-module-platform: #2c2c2e;
  --dsw-alias-interactive-bg-hover: rgba(255, 255, 255, .08);
  --dsw-alias-state-business-primary: #7aaaff;
  --dsw-alias-state-success-primary: #4ed17e;
  --dsw-alias-state-warn-primary: #f7ad31;
  --gal-shell-bg: #171718;
  background: #0f0f10;
  color: #f5f5f5;
  font-family: var(--dsw-font-family);
}
body:not([data-ds-dark-theme]) {
  --dsw-alias-label-primary: #1b1b1c;
  --dsw-alias-label-secondary: #3c3c3d;
  --dsw-alias-label-tertiary: #6b7280;
  --dsw-alias-border-l2: rgba(17, 24, 39, .09);
  --dsw-alias-border-l3: rgba(17, 24, 39, .16);
  --dsw-alias-bg-base: #f6f7f9;
  --dsw-alias-bg-layer-1: #ffffff;
  --dsw-alias-bg-layer-2: #f6f7f9;
  --dsw-alias-bg-module-platform: #eef1f5;
  --dsw-alias-interactive-bg-hover: rgba(17, 24, 39, .05);
  --dsw-alias-state-business-primary: #3f6fd8;
  --dsw-alias-state-success-primary: #2f9e74;
  --dsw-alias-state-warn-primary: #c47b2c;
  --gal-shell-bg: #ffffff;
  background: #f6f7f9;
  color: #1b1b1c;
}
body[data-static="1"] * { animation: none !important; }
.gal { max-width: 1120px; margin: 0 auto; padding: 54px 40px 60px; }
.gal-head { display: grid; gap: 10px; margin-bottom: 30px; }
.gal-kicker { font-size: 10px; letter-spacing: .24em; color: #6f7680; text-transform: uppercase; }
.gal-head h1 { margin: 0; font-size: 30px; line-height: 1.15; font-weight: 600; letter-spacing: -.025em; }
.gal-head p { margin: 0; max-width: 660px; font-size: 13px; line-height: 1.65; color: #9aa0a8; }
body:not([data-ds-dark-theme]) .gal-head p { color: #61666b; }
.gal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.gal-card {
  display: flex; flex-direction: column; gap: 14px;
  padding: 20px; border-radius: 20px; min-height: 220px;
  border: 1px solid rgba(255, 255, 255, .075);
  background: linear-gradient(180deg, rgba(255, 255, 255, .035), rgba(255, 255, 255, .01));
}
body:not([data-ds-dark-theme]) .gal-card {
  border-color: rgba(17, 24, 39, .08);
  background: #fff;
  box-shadow: 0 1px 2px rgba(17, 24, 39, .04), 0 14px 34px rgba(17, 24, 39, .045);
}
.gal-card-head { display: flex; align-items: baseline; gap: 12px; }
.gal-card h2 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -.01em; }
.gal-card p { margin: 0; max-width: 400px; font-size: 11px; line-height: 1.55; color: #8a8f98; }
body:not([data-ds-dark-theme]) .gal-card p { color: #6b7280; }
.gal-state { margin-left: auto; font-size: 9px; letter-spacing: .12em; color: #6b7280; text-transform: uppercase; }
.gal-stage {
  display: flex; flex: 1; align-items: center; justify-content: center;
  padding: 24px 10px; border-radius: 14px;
  background:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, .055) 1px, transparent 0) 0 0 / 18px 18px,
    radial-gradient(circle at 50% 35%, rgba(122, 162, 255, .09), transparent 65%),
    #141417;
}
.gal-stage .rg-gauge[data-density="full"] { margin: 0; --rg-size: 72px; }
.gal-stage .rg-gauge[data-density="minimal"] { margin: 0; --rg-size: 44px; }
.gal-stage .rg-gauge[data-density="minimal"] .rg-meta { color: rgba(232, 238, 252, .78); }
.gal-settings-shell {
  padding: 28px 30px 8px;
  border: 1px solid rgba(255, 255, 255, .075);
  border-radius: 20px;
  background: var(--gal-shell-bg);
}
body:not([data-ds-dark-theme]) .gal-settings-shell {
  border-color: rgba(17, 24, 39, .08);
  box-shadow: 0 14px 34px rgba(17, 24, 39, .045);
}
.gal-foot { display: flex; justify-content: space-between; gap: 24px; margin-top: 26px; font-size: 10.5px; line-height: 1.5; color: #6b7280; }
.gal-foot b { font-weight: 500; color: #9aa0a8; }
body:not([data-ds-dark-theme]) .gal-foot b { color: #4b5563; }
@media (max-width: 880px) {
  .gal { padding: 34px 20px 44px; }
  .gal-grid { grid-template-columns: 1fr; }
  .gal-head h1 { font-size: 24px; }
  .gal-settings-shell { padding: 18px 14px 4px; }
}
`;

const styleTag = document.createElement('style');
styleTag.textContent = CSS + GALLERY_CSS;
document.head.appendChild(styleTag);

const card = (key, title, note, state, options) => React.createElement('article', {
  key,
  className: 'gal-card',
},
React.createElement('div', { className: 'gal-card-head' },
  React.createElement('h2', null, title),
  React.createElement('span', { className: 'gal-state' }, state)),
React.createElement('p', null, note),
React.createElement('div', { className: 'gal-stage' },
  React.createElement(ClassicGauge, {
    vm: createClassicVm(options),
    t,
  })));

const gallery = React.createElement('main', { className: 'gal' },
  React.createElement('header', { className: 'gal-head' },
    React.createElement('div', { className: 'gal-kicker' }, `Retro Dock · v${VERSION} · classic`),
    React.createElement('h1', null, 'The dual dial is back'),
    React.createElement('p', null,
      'The original speed dial and dual-ring context/cache meter, with the 1.1.0 measurement engine, calibration and idle performance work kept underneath.')),
  React.createElement('div', { className: 'gal-grid' },
    card('live', '实时', '主表 142 tok/s，CTX 65%，HIT 99.9%。', 'live', { tps: 142, ctx: 65, hit: 99.94 }),
    card('idle', '空闲 / CTX 警告', '速度归零，CTX 超过 80% 时副表转琥珀色。', 'idle', { tps: 0, ctx: 85, hit: 99.94 }),
    card('over', '过速', '超过 180 tok/s 后指针停在止挡，环进入过速辉光。', 'over', { tps: 252, ctx: 65, hit: 99.94 }),
    card('minimal', '最小密度', '副表折叠成一行 CTX · HIT。', 'minimal', { tps: 142, ctx: 65, hit: 99.94, density: 'minimal' })),
  React.createElement('footer', { className: 'gal-foot' },
    React.createElement('span', null, React.createElement('b', null, 'Rate'), ' is a 1.2 s estimate, calibrated against host sessionStats; ', React.createElement('b', null, 'CTX'), ' is current occupancy; ', React.createElement('b', null, 'HIT'), ' is whole-session cache hit.'),
    React.createElement('span', null, 'deepseek-harness · 0.2.1-rc.3')));

const settingsView = params.get('view') === 'settings';
const app = settingsView
  ? React.createElement('main', { className: 'gal' },
    React.createElement('header', { className: 'gal-head' },
      React.createElement('div', { className: 'gal-kicker' }, `Retro Dock · v${VERSION} · settings`),
      React.createElement('h1', null, 'One gauge, a small panel'),
      React.createElement('p', null,
        'The classic gauge has no gear; its preferences live in the host settings section. Placement, density, scale, warning threshold, sub-readouts, language and calibration reset are all still here.')),
    React.createElement('div', { className: 'gal-settings-shell' },
      React.createElement(SettingsSection)))
  : gallery;

createRoot(document.getElementById('root')).render(app);
