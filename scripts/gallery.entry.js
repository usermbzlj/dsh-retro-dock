/**
 * README specimen sheet. Two themes, two languages, and a state matrix that
 * shows the shipped gauge at actual size inside a host-like composer. The
 * settings view renders the real settings section, not a mock.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import { bindReact } from '../src/runtime.js';
import { CSS } from '../src/styles/index.js';
import { createT } from '../src/i18n.js';
import { prefs } from '../src/prefs.js';
import { ClassicGauge, createClassicVm } from '../src/ui/classic.js';
import { SettingsSection } from '../src/ui/settings.js';
import { VERSION } from '../src/version.js';

bindReact(React, null);

const params = new URLSearchParams(window.location.search);
const theme = params.get('theme') === 'light' ? 'light' : 'dark';
const lang = params.get('lang') === 'en' ? 'en' : 'zh';
const view = params.get('view') === 'settings' ? 'settings' : 'gallery';

document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN';
if (theme === 'dark') document.body.setAttribute('data-ds-dark-theme', '');
if (params.get('static') === '1') document.body.setAttribute('data-static', '1');

const t = createT(lang);

const GALLERY_CSS = String.raw`
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  --gal-page: #f3f4f6;
  --gal-surface: #ffffff;
  --gal-subtle: #f8f9fa;
  --gal-border: rgba(17, 24, 39, .14);
  --gal-hair: rgba(17, 24, 39, .09);
  --gal-text: #1b1b1c;
  --gal-muted: #6b7280;
  --dsw-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
  --dsw-alias-label-primary: #1b1b1c;
  --dsw-alias-label-secondary: #3c3c3d;
  --dsw-alias-label-tertiary: #6b7280;
  --dsw-alias-border-l2: rgba(17, 24, 39, .09);
  --dsw-alias-border-l3: rgba(17, 24, 39, .16);
  --dsw-alias-bg-base: #f3f4f6;
  --dsw-alias-bg-layer-1: #ffffff;
  --dsw-alias-bg-layer-2: #f6f7f9;
  --dsw-alias-bg-module-platform: #eef1f5;
  --dsw-alias-interactive-bg-hover: rgba(17, 24, 39, .05);
  --dsw-alias-state-business-primary: #3f6fd8;
  --dsw-alias-state-warn-primary: #c47b2c;
  --dsw-focus-ring-color: #3f6fd8;
  background: var(--gal-page);
  color: var(--gal-text);
  font-family: var(--dsw-font-family);
  -webkit-font-smoothing: antialiased;
}
body[data-ds-dark-theme] {
  --gal-page: #0f0f10;
  --gal-surface: #1b1b1d;
  --gal-subtle: #151517;
  --gal-border: rgba(255, 255, 255, .13);
  --gal-hair: rgba(255, 255, 255, .08);
  --gal-text: #f5f5f5;
  --gal-muted: #9aa0a8;
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
  --dsw-alias-state-warn-primary: #f7ad31;
  --dsw-focus-ring-color: #7aaaff;
}
body[data-static="1"] * { animation: none !important; }

.sheet {
  max-width: 1200px;
  margin: 0 auto;
  padding: 34px 32px 26px;
}

.sheet-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 14px;
  border-bottom: .5px solid var(--gal-hair);
}

.sheet-brand {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
}

.sheet-brand h1 {
  margin: 0;
  font-size: 26px;
  line-height: 1.1;
  font-weight: 600;
  letter-spacing: -.02em;
}

.sheet-brand p {
  margin: 0;
  font-size: 12px;
  color: var(--gal-muted);
}

.sheet-version {
  font-size: 10.5px;
  color: var(--gal-muted);
  white-space: nowrap;
}

.hero {
  margin-top: 22px;
}

.hero-caption {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin: 0 2px 8px;
  font-size: 10.5px;
  color: var(--gal-muted);
}

.composer {
  background: var(--gal-surface);
  border: .5px solid var(--gal-border);
  border-radius: 18px;
  padding: 10px 14px 9px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, .04);
}

.prompt-row {
  display: flex;
  align-items: center;
  min-height: 34px;
  padding: 2px 4px;
}

.prompt {
  font-size: 13px;
  color: var(--gal-muted);
}

.composer-tools {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 2px 0;
}

.tool-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  border: .5px solid var(--gal-hair);
  border-radius: 7px;
  color: var(--gal-muted);
  font-size: 10.5px;
  line-height: 1;
}

.tool-spacer { flex: 1; }
.tool-model { font-size: 10.5px; color: var(--gal-muted); }

.tool-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--gal-text);
  color: var(--gal-page);
  font-size: 12px;
}

.state-matrix {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 28px;
  border-top: .5px solid var(--gal-hair);
  border-bottom: .5px solid var(--gal-hair);
}

.state {
  min-width: 0;
  padding: 15px 16px 14px;
  border-left: .5px solid var(--gal-hair);
  border-bottom: .5px solid var(--gal-hair);
}

.state:nth-child(3n + 1) { border-left: 0; }
.state:nth-child(n + 4) { border-bottom: 0; }

.state-kicker {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 9px;
  font-size: 10.5px;
  font-weight: 600;
  color: var(--gal-text);
}

.state-kicker span {
  font-size: 10px;
  font-weight: 400;
  color: var(--gal-muted);
}

.state-gauge {
  display: flex;
  align-items: center;
  min-height: 58px;
}

.state-gauge .rg-gauge {
  margin: 0;
}

.state-note {
  margin-top: 8px;
  font-size: 10px;
  line-height: 1.45;
  color: var(--gal-muted);
}

.state-note b {
  color: var(--gal-text);
  font-weight: 500;
}

.state-specimen-note {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  font-size: 10.5px;
  line-height: 1.5;
  color: var(--gal-muted);
}

.state-specimen-note b {
  color: var(--gal-text);
  font-weight: 600;
}

.sheet-foot {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-top: 16px;
  font-size: 10px;
  line-height: 1.5;
  color: var(--gal-muted);
}

.sheet-foot b {
  color: var(--gal-text);
  font-weight: 500;
}

.settings-view {
  margin-top: 22px;
}

.settings-shell {
  padding: 24px 26px 18px;
  border: .5px solid var(--gal-border);
  border-radius: 18px;
  background: var(--gal-surface);
}

.settings-shell .rg-settings-page {
  padding-bottom: 0;
}

.settings-caption {
  margin: 0 2px 10px;
  font-size: 10.5px;
  color: var(--gal-muted);
}

@media (max-width: 920px) {
  .sheet { padding: 26px 20px 22px; }
  .state-matrix { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .state:nth-child(n) { border-left: .5px solid var(--gal-hair); border-bottom: .5px solid var(--gal-hair); }
  .state:nth-child(2n + 1) { border-left: 0; }
  .state:nth-child(n + 5) { border-bottom: 0; }
  .sheet-brand p { display: none; }
}

@media (max-width: 620px) {
  .state-matrix { grid-template-columns: 1fr; }
  .state:nth-child(n) { border-left: 0; border-bottom: .5px solid var(--gal-hair); }
  .state:last-child { border-bottom: 0; }
  .sheet-head { align-items: flex-start; flex-direction: column; gap: 4px; }
  .sheet-foot { flex-direction: column; gap: 4px; }
}
`;

const styleTag = document.createElement('style');
styleTag.textContent = CSS + GALLERY_CSS;
document.head.appendChild(styleTag);

const makeGauge = ({
  placement = 'dock',
  density = 'full',
  tps = 142,
  ctx = 65,
  hit = 99.94,
  scale = 180,
  warnAt = 80,
  sub = true,
  source = 'projection',
  stale = false,
} = {}) => React.createElement(ClassicGauge, {
  vm: createClassicVm({ placement, density, tps, ctx, hit, scale, warnAt, sub, source, stale }),
  t,
});

const Composer = () => React.createElement('div', { className: 'composer' },
  React.createElement('div', { className: 'input-slot' }, makeGauge({ placement: 'input', density: 'full' })),
  React.createElement('div', { className: 'prompt-row' },
    React.createElement('span', { className: 'prompt' },
      lang === 'en' ? 'Type your message…' : '输入你的问题…')),
  React.createElement('div', { className: 'composer-tools' },
    React.createElement('span', { className: 'tool-chip' }, '+'),
    React.createElement('span', { className: 'tool-chip' }, lang === 'en' ? 'Auto' : '自动'),
    React.createElement('span', { className: 'tool-spacer' }),
    React.createElement('span', { className: 'tool-model' }, 'DeepSeek · flash'),
    React.createElement('span', { className: 'tool-send' }, '↑')));

const STATES = [
  {
    key: 'live',
    label: lang === 'en' ? 'Live' : '实时',
    meta: '142 tok/s',
    note: lang === 'en' ? '≈ estimate · calibration ×1.12' : '≈ 估算 · 校准 ×1.12',
    gauge: { tps: 142, ctx: 65, hit: 99.94 },
  },
  {
    key: 'warn',
    label: lang === 'en' ? 'Warning' : '警告',
    meta: 'CTX 85%',
    note: lang === 'en' ? 'redline at 80% · number + arc' : '80% redline · 数字与弧段同时转色',
    gauge: { tps: 142, ctx: 85, hit: 99.94, warnAt: 80 },
  },
  {
    key: 'over',
    label: lang === 'en' ? 'Overspeed' : '过速',
    meta: '252 tok/s',
    note: lang === 'en' ? 'needle on the stop · 180 scale' : '指针到止挡 · 满量程 180',
    gauge: { tps: 252, ctx: 65, hit: 99.94, scale: 180 },
  },
  {
    key: 'dom',
    label: lang === 'en' ? 'Page text' : '页面文本',
    meta: 'DOM',
    note: lang === 'en' ? 'visible source badge, not only a tooltip' : '数据源角标可见，不只藏在 tooltip',
    gauge: { tps: 142, ctx: 65, hit: 99.94, source: 'dom' },
  },
  {
    key: 'stale',
    label: lang === 'en' ? 'Stale' : '数据不可用',
    meta: '!',
    note: lang === 'en' ? 'dials recede, readings stay legible' : '表盘退后，读数保持可读',
    gauge: { tps: 142, ctx: 65, hit: 99.94, stale: true },
  },
];

const StateCell = ({ state }) => React.createElement('div', { className: 'state', key: state.key },
  React.createElement('div', { className: 'state-kicker' }, state.label, React.createElement('span', null, state.meta)),
  React.createElement('div', { className: 'state-gauge' }, makeGauge({ placement: 'dock', density: 'full', ...state.gauge })),
  React.createElement('p', { className: 'state-note' }, state.note));

const Gallery = () => React.createElement('main', { className: 'sheet' },
  React.createElement('header', { className: 'sheet-head' },
    React.createElement('div', { className: 'sheet-brand' },
      React.createElement('h1', null, 'Retro Dock'),
      React.createElement('p', null, lang === 'en' ? 'Dual-dial composer instrument' : '输入区双表盘仪表')),
    React.createElement('span', { className: 'sheet-version' }, `v${VERSION}`)),
  React.createElement('section', { className: 'hero' },
    React.createElement('div', { className: 'hero-caption' },
      React.createElement('span', null, lang === 'en' ? 'Input placement · 56px dial · actual size' : '输入框上方 · 56px 表盘 · 实际尺寸'),
      React.createElement('span', null, lang === 'en' ? 'Click the gauge to move it to the stats bar' : '点击仪表可移到统计条')),
    React.createElement(Composer)),
  React.createElement('section', { className: 'state-matrix', 'aria-label': lang === 'en' ? 'Instrument states' : '仪表状态' },
    STATES.map((state) => React.createElement(StateCell, { key: state.key, state })),
    React.createElement('div', { className: 'state state-specimen-note' },
      React.createElement('b', null, lang === 'en' ? 'Actual-size specimens' : '实际尺寸样张'),
      React.createElement('span', null,
        lang === 'en'
          ? 'Rendered with the shipped CSS at 42px dock / 56px input. No mockup dials, no enlarged numbers.'
          : '使用线上 CSS 的 42px 统计条 / 56px 输入区尺寸；没有放大的样张表盘。'))),
  React.createElement('footer', { className: 'sheet-foot' },
    React.createElement('span', null,
      React.createElement('b', null, lang === 'en' ? 'Rate' : '速率'),
      lang === 'en'
        ? ' is a 1.2 s estimate, calibrated against host usage stats. CTX is context pressure; HIT is session cache hit.'
        : ' 是 1.2 秒估算，按宿主用量统计校准。CTX 是上下文压力，HIT 是会话缓存命中。'),
    React.createElement('span', null, `Retro Dock v${VERSION} · deepseek-harness`)));

const SettingsView = () => React.createElement('main', { className: 'sheet' },
  React.createElement('section', { className: 'settings-view' },
    React.createElement('p', { className: 'settings-caption' },
      lang === 'en'
        ? 'Host settings section · previews use the current scale, warning line and placement.'
        : '宿主设置页 · 预览使用当前满量程、警戒线与停靠位置。'),
    React.createElement('div', { className: 'settings-shell' },
      React.createElement(SettingsSection))));

createRoot(document.getElementById('root')).render(view === 'settings' ? SettingsView() : Gallery());
