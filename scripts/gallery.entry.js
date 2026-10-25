/**
 * Static style gallery used for the screenshots in docs/ and for eyeballing the
 * four instruments without the host. Built by scripts/gallery.mjs.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import { bindReact } from '../src/runtime.js';
import { CSS } from '../src/styles/index.js';
import { createT } from '../src/i18n.js';
import { GaugeView } from '../src/ui/view.js';
import { createPreviewVm } from '../src/ui/preview.js';
import { SettingsSection, SettingsPopover } from '../src/ui/settings.js';
import { STYLES } from '../src/themes.js';
import { VERSION } from '../src/version.js';

bindReact(React, null);

const params = new URLSearchParams(window.location.search);
const theme = params.get('theme') === 'light' ? 'light' : 'dark';
const still = params.get('static') === '1';
if (theme === 'dark') document.body.setAttribute('data-ds-dark-theme', '');
if (still) document.body.setAttribute('data-static', '1');
document.documentElement.style.background = theme === 'dark' ? '#0f0f10' : '#f6f7f9';
document.body.style.background = theme === 'dark' ? '#0f0f10' : '#f6f7f9';

const GALLERY_CSS = String.raw`
html, body { margin: 0; padding: 0; }
body {
  --dsw-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  --ds-font-family-code: "Cascadia Mono", "SF Mono", Consolas, "Liberation Mono", monospace;
  --dsw-alias-label-primary: #f5f5f5;
  --dsw-alias-label-secondary: #d4d4d4;
  --dsw-alias-label-tertiary: #9aa0a8;
  --dsw-alias-border-l3: rgba(255, 255, 255, .14);
  --dsw-alias-border-l2: rgba(255, 255, 255, .09);
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
  --dsw-alias-border-l3: rgba(17, 24, 39, .16);
  --dsw-alias-border-l2: rgba(17, 24, 39, .09);
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
.gal { max-width: 1180px; margin: 0 auto; padding: 54px 40px 60px; }
.gal-head { display: grid; gap: 10px; margin-bottom: 30px; }
.gal-kicker { font-size: 10px; letter-spacing: .24em; color: #6f7680; text-transform: uppercase; }
.gal-head h1 { margin: 0; font-size: 30px; line-height: 1.15; font-weight: 600; letter-spacing: -.025em; }
.gal-head p { margin: 0; max-width: 660px; font-size: 13px; line-height: 1.65; color: #9aa0a8; }
body:not([data-ds-dark-theme]) .gal-head p { color: #61666b; }
.gal-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px; }
.gal-card {
  display: flex; flex-direction: column; gap: 16px;
  padding: 20px; border-radius: 20px; min-height: 300px;
  border: 1px solid rgba(255, 255, 255, .075);
  background: linear-gradient(180deg, rgba(255, 255, 255, .035), rgba(255, 255, 255, .01));
}
body:not([data-ds-dark-theme]) .gal-card {
  border-color: rgba(17, 24, 39, .08);
  background: #fff;
  box-shadow: 0 1px 2px rgba(17, 24, 39, .04), 0 14px 34px rgba(17, 24, 39, .045);
}
.gal-card-head { display: flex; align-items: flex-start; gap: 12px; }
.gal-num { padding-top: 2px; font-size: 9px; letter-spacing: .12em; color: #6b7280; font-family: var(--ds-font-family-code); }
.gal-card h2 { margin: 0; font-size: 15px; font-weight: 600; letter-spacing: -.01em; }
.gal-card p { margin: 4px 0 0; max-width: 400px; font-size: 11px; line-height: 1.55; color: #8a8f98; }
body:not([data-ds-dark-theme]) .gal-card p { color: #6b7280; }
.gal-chip { margin-left: auto; font-size: 8px; letter-spacing: .14em; text-transform: uppercase; color: #6b7280; border: 1px solid rgba(255, 255, 255, .09); border-radius: 999px; padding: 3px 7px; }
body:not([data-ds-dark-theme]) .gal-chip { border-color: rgba(17, 24, 39, .1); }
.gal-stage {
  display: flex; flex: 1; align-items: center; justify-content: center;
  padding: 20px 10px; border-radius: 14px;
  background:
    radial-gradient(circle at 1px 1px, rgba(255, 255, 255, .055) 1px, transparent 0) 0 0 / 18px 18px,
    radial-gradient(circle at 50% 35%, rgba(122, 162, 255, .09), transparent 65%),
    rgba(0, 0, 0, .18);
}
body:not([data-ds-dark-theme]) .gal-stage {
  background:
    radial-gradient(circle at 1px 1px, rgba(17, 24, 39, .07) 1px, transparent 0) 0 0 / 18px 18px,
    radial-gradient(circle at 50% 35%, rgba(63, 111, 216, .07), transparent 65%),
    #f2f5f9;
}
.gal-stage .rg-root, .gal-min .rg-root { margin: 0; }
.gal-stage .rg-root[data-density="full"] { --rg-dial: 72px; }
.gal-stage .rg-root[data-density="full"] .rg-value { font-size: 22px; }
.gal-stage .rg-root[data-style="minimal"][data-density="full"] { --rg-dial: 68px; }
.gal-min { display: flex; align-items: center; gap: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, .06); }
body:not([data-ds-dark-theme]) .gal-min { border-color: rgba(17, 24, 39, .07); }
.gal-cap { font-size: 8px; letter-spacing: .18em; text-transform: uppercase; color: #6b7280; white-space: nowrap; }
.gal-foot { display: flex; justify-content: space-between; gap: 24px; margin-top: 26px; font-size: 10.5px; line-height: 1.5; color: #6b7280; }
.gal-foot b { font-weight: 500; color: #9aa0a8; }
body:not([data-ds-dark-theme]) .gal-foot b { color: #4b5563; }
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
.gal-popover-demo {
  display: grid;
  gap: 10px;
  justify-items: start;
  padding: 26px;
  min-height: 620px;
  border: 1px solid rgba(255, 255, 255, .075);
  border-radius: 20px;
  background: var(--gal-shell-bg);
}
.gal-popover-demo p { margin: 0; max-width: 520px; font-size: 12px; line-height: 1.6; color: #8a8f98; }
body:not([data-ds-dark-theme]) .gal-popover-demo p { color: #6b7280; }
.gal-anchor {
  margin-top: 8px;
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 8px;
  background: transparent;
  color: #f5f5f5;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
body:not([data-ds-dark-theme]) .gal-anchor { border-color: rgba(17, 24, 39, .15); color: #1b1b1c; }
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

const t = createT('zh');
const SAMPLES = {
  heritage: { tps: 142, ctx: 65, hit: 99.94 },
  neon: { tps: 168, ctx: 72, hit: 98.42 },
  minimal: { tps: 96, ctx: 41, hit: 92.1 },
  terminal: { tps: 203, ctx: 86, hit: 99.99 },
};

const card = (style, index) => {
  const sample = SAMPLES[style.id] ?? SAMPLES.heritage;
  return React.createElement('article', {
    key: style.id,
    className: 'gal-card',
    'data-style': style.id,
  },
  React.createElement('div', { className: 'gal-card-head' },
    React.createElement('span', { className: 'gal-num' }, `0${index + 1}`),
    React.createElement('div', null,
      React.createElement('h2', null, t(style.labelKey)),
      React.createElement('p', null, t(style.descriptionKey))),
    React.createElement('span', { className: 'gal-chip' }, 'live')),
  React.createElement('div', { className: 'gal-stage' },
    React.createElement(GaugeView, {
      vm: createPreviewVm({ style: style.id, ...sample }),
      t,
    })),
  React.createElement('div', { className: 'gal-min' },
    React.createElement('span', { className: 'gal-cap' }, 'minimal'),
    React.createElement(GaugeView, {
      vm: createPreviewVm({ style: style.id, density: 'minimal', ...sample }),
      t,
    })));
};

const settingsView = params.get('view') === 'settings';
const popoverView = params.get('view') === 'popover';

const PopoverPreview = () => {
  const anchorRef = React.useRef(null);
  const [open, setOpen] = React.useState(true);
  return React.createElement('div', { className: 'gal-popover-demo' },
    React.createElement('p', null,
      'The gear opens a compact panel anchored to the gauge. It is portaled to the body so the composer cannot clip it, closes on Escape or outside pointerdown, and returns focus to the gear.'),
    React.createElement('button', { ref: anchorRef, type: 'button', className: 'gal-anchor' }, 'Retro Dock'),
    React.createElement(SettingsPopover, {
      anchorRef,
      open,
      onClose: () => setOpen(false),
      t,
    }));
};

const app = settingsView
  ? React.createElement('main', { className: 'gal gal-settings' },
    React.createElement('header', { className: 'gal-head' },
      React.createElement('div', { className: 'gal-kicker' }, `Retro Dock · v${VERSION} · settings`),
      React.createElement('h1', null, 'One panel, four instruments'),
      React.createElement('p', null,
        'Style, placement, density, scale, warning threshold, language and calibration live in one panel. The same controls open as a popover from the gauge and as a full settings section in the host.')),
    React.createElement('div', { className: 'gal-settings-shell' },
      React.createElement(SettingsSection)))
  : popoverView
    ? React.createElement('main', { className: 'gal' },
      React.createElement('header', { className: 'gal-head' },
        React.createElement('div', { className: 'gal-kicker' }, `Retro Dock · v${VERSION} · settings popover`),
        React.createElement('h1', null, 'The gear panel'),
        React.createElement('p', null, 'A compact, anchored surface that shares the exact controls and state with the full settings page.')),
      React.createElement(PopoverPreview))
    : React.createElement('main', { className: 'gal' },
    React.createElement('header', { className: 'gal-head' },
      React.createElement('div', { className: 'gal-kicker' }, `Retro Dock · v${VERSION} · style study`),
      React.createElement('h1', null, 'Four instruments, one measurement contract'),
      React.createElement('p', null,
        'The same live tok/s, context pressure and session cache-hit readings, drawn as a heritage dial, a neon HUD, a hairline meter and a CRT terminal. Light and dark both follow the host theme.')),
    React.createElement('div', { className: 'gal-grid' }, STYLES.map(card)),
    React.createElement('footer', { className: 'gal-foot' },
      React.createElement('span', null, React.createElement('b', null, 'Rate'), ' is a 1.2 s estimate, calibrated against host sessionStats; ', React.createElement('b', null, 'CTX'), ' is current occupancy; ', React.createElement('b', null, 'HIT'), ' is whole-session cache hit.'),
      React.createElement('span', null, 'deepseek-harness · 0.2.1-rc.3')));

createRoot(document.getElementById('root')).render(app);
