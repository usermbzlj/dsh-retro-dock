/**
 * The instrument catalogue: classic as the reference, then one spread per
 * design, a 2× craft detail, and a compact comparison.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';

import { bindReact } from '../src/runtime.js';
import { CSS } from '../src/styles/index.js';
import { DESIGN_CSS } from '../src/styles/designs/index.js';
import { createT } from '../src/i18n.js';
import { ClassicGauge, createClassicVm } from '../src/ui/classic.js';
import { DesignGauge } from '../src/ui/design-gauge.js';
import { createVm } from '../src/ui/vm.js';
import { DESIGN_IDS, DESIGN_META } from '../src/designs/meta.js';
import { CATALOGUE, CLASSIC, RECOMMENDATIONS } from './catalogue.data.js';

bindReact(React, null);

const t = createT('zh');

const PAGE_CSS = `
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  --paper: #ecebe6;
  --ink: #161817;
  --muted: #63645f;
  --faint: #8a8b84;
  --hair: rgba(22, 24, 23, .17);
  --hair-soft: rgba(22, 24, 23, .09);
  --red: #b83a26;
  --band-light: #f7f6f2;
  --band-dark: #151516;
  --stage: #e9e8e2;
  --host-dark-ink: #f0f0ea;
  background: var(--paper);
  color: var(--ink);
  font-family: "Segoe UI", "Microsoft YaHei UI", "PingFang SC", sans-serif;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
img, svg { vertical-align: middle; }
.cat { width: min(1320px, calc(100% - 48px)); margin: 0 auto; padding: 26px 0 0; }

.masthead {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--hair);
}
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: .01em;
}
.reg { width: 5px; height: 5px; background: var(--red); display: inline-block; }
.mast-meta {
  text-align: right;
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: 9.5px;
  line-height: 1.65;
  color: var(--muted);
}

.hero-title {
  display: flex;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
  margin-top: 32px;
}
h1 {
  margin: 0;
  font-family: "Microsoft YaHei UI", "PingFang SC", "Noto Sans SC", sans-serif;
  font-size: 56px;
  font-weight: 300;
  line-height: 1.04;
  letter-spacing: -.012em;
}
.sub {
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: 14px;
  color: var(--muted);
  letter-spacing: .01em;
}
.lede {
  max-width: 64ch;
  margin: 18px 0 0;
  font-size: 15px;
  line-height: 1.8;
}
.study-note {
  margin: 10px 0 0;
  font-size: 10px;
  color: var(--muted);
}

.rack-block { margin-top: 30px; }
.rack-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 0 2px 8px;
  font-size: 9px;
  color: var(--muted);
}
.rack {
  --dsw-alias-label-primary: #17181a;
  --dsw-alias-label-tertiary: #5e605c;
  --dsw-alias-state-warn-primary: #a93526;
  --dsw-focus-ring-color: #2f5bc0;
  border: 1px solid var(--hair);
  background: var(--band-light);
  color: var(--ink);
}
.rack.is-dark {
  --dsw-alias-label-primary: #f0f0ea;
  --dsw-alias-label-tertiary: #a0a19a;
  --dsw-alias-state-warn-primary: #f0a35c;
  --dsw-focus-ring-color: #7aa2ff;
  background: var(--band-dark);
  border-color: rgba(255, 255, 255, .12);
  color: var(--host-dark-ink);
}
.rack-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  padding: 18px 20px 15px;
}
.rack-cell { min-width: 0; text-align: center; }
.rack-cell.is-reference { border-right: 1px solid var(--hair); }
.rack.is-dark .rack-cell.is-reference { border-color: rgba(255, 255, 255, .12); }
.rack-stage {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.rack-name { margin-top: 6px; font-size: 10.5px; font-weight: 600; }
.rack-lineage { margin-top: 2px; font-size: 8.5px; color: var(--muted); }
.rack.is-dark .rack-lineage { color: #a4a49c; }

.principles {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 34px 0 0;
  border-top: 1px solid var(--hair);
  border-bottom: 1px solid var(--hair);
}
.principle { padding: 17px 20px 18px 0; border-left: 1px solid var(--hair); }
.principle:first-child { border-left: 0; padding-left: 0; }
.principle:not(:first-child) { padding-left: 20px; }
.principle h3 {
  margin: 0 0 7px;
  font-family: "Microsoft YaHei UI", "PingFang SC", sans-serif;
  font-size: 13px;
  font-weight: 600;
}
.principle p { margin: 0; font-size: 11.5px; line-height: 1.7; color: var(--muted); }

.spread {
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
  gap: 48px;
  padding: 40px 0 42px;
  border-top: 1px solid var(--hair);
}
.spread.is-flipped { grid-template-columns: minmax(0, 1fr) 360px; }
.spread.is-flipped .spread-text { order: 2; }
.spread.is-flipped .spread-visual { order: 1; }
.spread-text { max-width: 360px; }
.spread h2 {
  margin: 0;
  font-family: "Microsoft YaHei UI", "PingFang SC", sans-serif;
  font-size: 34px;
  font-weight: 300;
  line-height: 1.1;
  letter-spacing: -.01em;
}
.spread h2 .en {
  margin-left: 10px;
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: 13px;
  font-weight: 300;
  color: var(--muted);
  letter-spacing: .01em;
}
.lineage { margin: 6px 0 0; font-size: 10px; color: var(--muted); }
.claim { margin: 18px 0 12px; font-size: 17px; font-weight: 500; line-height: 1.55; }
.para { margin: 0 0 10px; font-size: 12.5px; line-height: 1.75; color: rgba(22, 24, 23, .78); }
.specs { margin: 18px 0 0; border-top: 1px solid var(--hair); }
.spec {
  display: grid;
  grid-template-columns: 56px minmax(0, 1fr);
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px solid var(--hair-soft);
  font-size: 10.5px;
  line-height: 1.5;
}
.spec dt { color: var(--muted); }
.spec dd { margin: 0; color: var(--ink); }

.spread-visual { min-width: 0; }
.pair { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.host {
  --dsw-alias-label-primary: #17181a;
  --dsw-alias-label-tertiary: #5e605c;
  --dsw-alias-state-warn-primary: #a93526;
  --dsw-focus-ring-color: #2f5bc0;
  padding: 11px;
  background: var(--band-light);
  border: 1px solid var(--hair);
  color: var(--ink);
}
.host.is-dark {
  --dsw-alias-label-primary: #f0f0ea;
  --dsw-alias-label-tertiary: #9fa098;
  --dsw-alias-state-warn-primary: #f0a35c;
  --dsw-focus-ring-color: #7aa2ff;
  background: var(--band-dark);
  border-color: rgba(255, 255, 255, .13);
  color: var(--host-dark-ink);
}
.host-label {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 7px;
  font-size: 9px;
  color: var(--muted);
}
.host.is-dark .host-label { color: #9fa098; }
.composer {
  background: #ffffff;
  border: 1px solid rgba(22, 24, 23, .14);
  border-radius: 14px;
  padding: 6px 10px 7px;
}
.host.is-dark .composer { background: #1c1c1e; border-color: rgba(255, 255, 255, .14); }
.slot { height: 62px; display: flex; align-items: center; justify-content: center; }
.prompt { padding: 0 2px 8px; font-size: 11px; color: var(--muted); }
.host.is-dark .prompt { color: #9fa098; }
.tools { display: flex; align-items: center; gap: 5px; }
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 7px;
  border: 1px solid var(--hair);
  border-radius: 6px;
  font-size: 9px;
  color: var(--muted);
}
.host.is-dark .chip { border-color: rgba(255, 255, 255, .16); color: #9fa098; }
.spacer { flex: 1; }
.send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--ink);
  color: var(--paper);
  font-size: 10px;
}
.host.is-dark .send { background: #f0f0ea; color: #151516; }

.states {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 10px;
  border: 1px solid var(--hair);
  background: var(--band-light);
  --dsw-alias-label-primary: #17181a;
  --dsw-alias-label-tertiary: #5e605c;
  --dsw-alias-state-warn-primary: #a93526;
}
.state { min-width: 0; padding: 8px 10px 7px; border-left: 1px solid var(--hair); border-top: 1px solid var(--hair); }
.state:nth-child(3n + 1) { border-left: 0; }
.state:nth-child(-n + 3) { border-top: 0; }
.state-stage { height: 46px; display: flex; align-items: center; }
.state-label { margin-top: 3px; font-size: 8.5px; color: var(--muted); }

.detail { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; margin-top: 10px; }
.macro { min-width: 0; border: 1px solid var(--hair); background: var(--band-light); padding: 9px 11px 10px; }
.macro-head { display: flex; justify-content: space-between; gap: 10px; font-size: 8.5px; color: var(--muted); }
.macro-stage {
  height: 124px;
  margin-top: 6px;
  padding: 4px 6px;
  overflow: hidden;
  background: var(--stage);
  border: 1px solid var(--hair-soft);
  display: flex;
  align-items: flex-start;
}
.macro-zoom { width: max-content; margin: 0 auto; transform: scale(2); transform-origin: top center; }
.macro-note { margin: 7px 0 0; font-size: 10px; line-height: 1.6; color: var(--muted); }

.tokens { min-width: 0; padding-top: 9px; border-top: 1px solid var(--hair); }
.tokens-label { font-size: 8.5px; color: var(--muted); }
.swatches { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 5px; margin-top: 6px; }
.swatch { min-width: 0; }
.swatch-chip { display: block; height: 22px; border: 1px solid rgba(22, 24, 23, .16); }
.swatch-hex { display: block; margin-top: 3px; font-family: Consolas, monospace; font-size: 8px; color: var(--faint); }
.swatch-role { display: block; font-size: 8px; color: var(--muted); }
.type-line {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 14px;
  padding-top: 8px;
  border-top: 1px solid var(--hair-soft);
  min-width: 0;
}
.type-name { font-size: 9.5px; color: var(--muted); white-space: nowrap; }
.type-sample { font-size: 15px; line-height: 1.2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.closing { margin-top: 38px; padding-top: 30px; border-top: 1px solid var(--hair); }
.closing h2 {
  margin: 0;
  font-family: "Microsoft YaHei UI", "PingFang SC", sans-serif;
  font-size: 34px;
  font-weight: 300;
  line-height: 1.1;
}
.closing .lede { margin-top: 12px; font-size: 14px; line-height: 1.75; }
.minimal-compare { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 22px; }
.minimal-col {
  border: 1px solid var(--hair);
  background: var(--band-light);
  --dsw-alias-label-primary: #17181a;
  --dsw-alias-label-tertiary: #5e605c;
  --dsw-alias-state-warn-primary: #a93526;
}
.minimal-col.is-dark {
  --dsw-alias-label-primary: #f0f0ea;
  --dsw-alias-label-tertiary: #a0a19a;
  --dsw-alias-state-warn-primary: #f0a35c;
  background: var(--band-dark);
  border-color: rgba(255, 255, 255, .12);
  color: var(--host-dark-ink);
}
.minimal-head { padding: 8px 10px 7px; border-bottom: 1px solid var(--hair); font-size: 9px; color: var(--muted); }
.minimal-col.is-dark .minimal-head { border-color: rgba(255, 255, 255, .13); color: #9fa098; }
.minimal-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 34px;
  padding: 4px 10px;
  border-bottom: 1px solid var(--hair-soft);
  min-width: 0;
}
.minimal-row:last-child { border-bottom: 0; }
.minimal-col.is-dark .minimal-row { border-color: rgba(255, 255, 255, .08); }
.minimal-name { flex: 0 0 auto; width: 54px; font-size: 9.5px; color: var(--muted); }
.minimal-col.is-dark .minimal-name { color: #a0a19a; }

.recommendations {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: 28px;
  border-top: 1px solid var(--hair);
}
.rec { padding: 14px 16px 0 0; border-left: 1px solid var(--hair); }
.rec:first-child { border-left: 0; padding-left: 0; }
.rec:not(:first-child) { padding-left: 16px; }
.rec-role { font-size: 9px; color: var(--muted); }
.rec-name { margin-top: 4px; font-size: 15px; font-weight: 600; }
.rec-text { margin: 6px 0 0; font-size: 11px; line-height: 1.65; color: var(--muted); }
.closing-note {
  margin-top: 26px;
  padding-top: 12px;
  border-top: 1px solid var(--hair);
  font-size: 10px;
  line-height: 1.7;
  color: var(--muted);
}
.footer {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 34px;
  padding: 13px 0 22px;
  border-top: 1px solid var(--hair);
  font-size: 9px;
  color: var(--muted);
}
.footer span { min-width: 0; }
.footer a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }

@media (max-width: 1120px) {
  .spread, .spread.is-flipped { grid-template-columns: minmax(0, 1fr) 320px; gap: 28px; }
  .spread.is-flipped { grid-template-columns: 320px minmax(0, 1fr); }
  .spread.is-flipped .spread-text { order: 0; }
  .spread.is-flipped .spread-visual { order: 0; }
  .spread-text { max-width: none; }
  .principles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .principle:nth-child(3) { border-left: 0; padding-left: 0; }
  .recommendations { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rec:nth-child(3) { border-left: 0; padding-left: 0; }
}
@media (max-width: 880px) {
  .cat { width: calc(100% - 32px); padding-top: 18px; }
  h1 { font-size: 44px; }
  .spread, .spread.is-flipped { grid-template-columns: 1fr; gap: 22px; }
  .rack-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rack-cell.is-reference { border-right: 0; }
  .pair { grid-template-columns: 1fr; }
  .states { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .state { border-left: 1px solid var(--hair); border-top: 1px solid var(--hair); }
  .state:nth-child(2n + 1) { border-left: 0; }
  .state:nth-child(-n + 2) { border-top: 0; }
  .detail { grid-template-columns: 1fr; }
  .minimal-compare { grid-template-columns: 1fr; }
  .recommendations { grid-template-columns: 1fr 1fr; }
  .footer { flex-direction: column; gap: 6px; }
}
@media (max-width: 560px) {
  h1 { font-size: 36px; }
  .states { grid-template-columns: minmax(0, 1fr); }
  .state { border-left: 0; border-top: 1px solid var(--hair); }
  .state:first-child { border-top: 0; }
  .principles { grid-template-columns: 1fr; }
  .principle, .principle:not(:first-child) { border-left: 0; padding-left: 0; }
  .recommendations { grid-template-columns: 1fr; }
  .rec, .rec:not(:first-child) { border-left: 0; padding-left: 0; }
  .lede { font-size: 14px; }
}
`;

const sheet = document.createElement('style');
sheet.textContent = `${CSS}\n${DESIGN_CSS}\n${PAGE_CSS}`;
document.head.append(sheet);
document.documentElement.lang = 'zh-CN';
document.title = 'Retro Dock 三种测量语言';

const Classic = ({ density = 'full', tps = 142, ctx = 65 }) => (
  <ClassicGauge vm={createClassicVm({ placement: 'dock', density, tps, ctx })} t={t} />
);

const Gauge = ({ style, placement = 'dock', density = 'full', tps = 142, ctx = 65, source = 'projection', stale = false }) => (
  <DesignGauge
    vm={createVm({
      style,
      placement,
      density,
      tps,
      ctx,
      hit: 99.94,
      scale: 180,
      warnAt: 80,
      source,
      stale,
    })}
    t={t}
  />
);

const RackBlock = ({ dark }) => (
  <div className="rack-block">
    <div className="rack-head">
      <span>{dark ? '深色宿主' : '浅色宿主'}</span>
      <span>42px 统计条 / 真实尺寸</span>
    </div>
    <div className={dark ? 'rack is-dark' : 'rack'} data-ds-dark-theme={dark ? '' : undefined}>
      <div className="rack-grid">
        <div className="rack-cell is-reference">
          <div className="rack-stage"><Classic /></div>
          <div className="rack-name">{CLASSIC.name.zh}</div>
          <div className="rack-lineage">{CLASSIC.lineage.zh}</div>
        </div>
        {DESIGN_IDS.map((id) => {
          const meta = DESIGN_META[id];
          return (
            <div className="rack-cell" key={id}>
              <div className="rack-stage"><Gauge style={id} placement="dock" /></div>
              <div className="rack-name">{meta.name.zh}</div>
              <div className="rack-lineage">{meta.lineage.zh}</div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

const Composer = ({ style, dark }) => (
  <div className={dark ? 'host is-dark' : 'host'} data-ds-dark-theme={dark ? '' : undefined}>
    <div className="host-label">
      <span>{dark ? '深色宿主' : '浅色宿主'}</span>
      <span>输入框上方 / 56px</span>
    </div>
    <div className="composer">
      <div className="slot"><Gauge style={style} placement="input" density="full" /></div>
      <div className="prompt">输入你的问题…</div>
      <div className="tools">
        <span className="chip">+</span>
        <span className="chip">自动</span>
        <span className="spacer" />
        <span className="send">↑</span>
      </div>
    </div>
  </div>
);

const STATES = [
  { key: 'idle', label: '空闲', tps: 0, ctx: 32 },
  { key: 'live', label: '实时 142', tps: 142, ctx: 65 },
  { key: 'over', label: '过速 252', tps: 252, ctx: 65 },
  { key: 'warn', label: '上下文 85%', tps: 96, ctx: 85 },
  { key: 'dom', label: '页面文本估算', tps: 142, ctx: 65, source: 'dom' },
  { key: 'stale', label: '数据停止更新', tps: 142, ctx: 65, stale: true },
];

const StateRow = ({ style }) => (
  <div className="states">
    {STATES.map((state) => (
      <div className="state" key={state.key}>
        <div className="state-stage">
          <Gauge
            style={style}
            placement="dock"
            tps={state.tps}
            ctx={state.ctx}
            source={state.source ?? 'projection'}
            stale={state.stale ?? false}
          />
        </div>
        <div className="state-label">{state.label}</div>
      </div>
    ))}
  </div>
);

const Detail = ({ style }) => {
  const data = CATALOGUE[style];
  return (
    <div className="detail">
      <div className="macro">
        <div className="macro-head">
          <span>2× 细节</span>
          <span>只检查刻线与字距</span>
        </div>
        <div className="macro-stage">
          <div className="macro-zoom"><Gauge style={style} placement="input" density="full" /></div>
        </div>
        <p className="macro-note">{data.craft}</p>
      </div>
      <div className="tokens">
        <div className="tokens-label">表面与墨</div>
        <div className="swatches">
          {data.palette.map((swatch) => (
            <div className="swatch" key={swatch.hex + swatch.role}>
              <span className="swatch-chip" style={{ background: swatch.hex }} />
              <span className="swatch-hex">{swatch.hex}</span>
              <span className="swatch-role">{swatch.role}</span>
            </div>
          ))}
        </div>
        <div className="type-line">
          <span className="type-name">{data.type.name}</span>
          <span className="type-sample" style={{ fontFamily: data.type.css }}>{data.type.sample}</span>
        </div>
      </div>
    </div>
  );
};

const Spread = ({ style, index }) => {
  const meta = DESIGN_META[style];
  const data = CATALOGUE[style];
  const flipped = index % 2 === 1;
  return (
    <section className={flipped ? 'spread is-flipped' : 'spread'}>
      <div className="spread-text">
        <h2>{meta.name.zh}<span className="en">{meta.name.en}</span></h2>
        <p className="lineage">{meta.lineage.zh}</p>
        <p className="claim">{data.claim}</p>
        {data.body.map((paragraph) => <p className="para" key={paragraph.slice(0, 12)}>{paragraph}</p>)}
        <dl className="specs">
          {data.specs.map(([label, value]) => (
            <div className="spec" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="spread-visual">
        <div className="pair">
          <Composer style={style} />
          <Composer style={style} dark />
        </div>
        <StateRow style={style} />
        <Detail style={style} />
      </div>
    </section>
  );
};

const MinimalList = ({ dark }) => (
  <div className={dark ? 'minimal-col is-dark' : 'minimal-col'} data-ds-dark-theme={dark ? '' : undefined}>
    <div className="minimal-head">{dark ? '深色宿主 / minimal' : '浅色宿主 / minimal'}</div>
    <div className="minimal-row">
      <span className="minimal-name">{CLASSIC.name.zh}</span>
      <Classic density="minimal" />
    </div>
    {DESIGN_IDS.map((id) => (
      <div className="minimal-row" key={id}>
        <span className="minimal-name">{DESIGN_META[id].name.zh}</span>
        <Gauge style={id} placement="dock" density="minimal" tps={142} ctx={65} />
      </div>
    ))}
  </div>
);

const PRINCIPLES = [
  ['一种阅读需求一种样式', '综合、温度、走势、安静，各对应一种样式。换材质不算新样式，所以台表、高度表、信号楼、罗经没有留下。'],
  ['红色只给界限', '上下文警戒和超量程用红色；缓存命中永远不红。红色不做品牌装饰。'],
  ['读数不跟着降级', '数据停止更新时显示中性的「停」角标，读数本身不变淡；上下文未知时画虚线，不画成 0。'],
  ['真实尺寸优先', '56px 输入位和 42px 统计条是验收尺寸；42px 下文字不小于 7.5px。2× 只用于检查刻线。'],
];

const App = () => (
  <div className="cat">
    <header className="masthead">
      <div className="wordmark"><span className="reg" />Retro Dock</div>
      <div className="mast-meta">设计研究<br />2026.10</div>
    </header>

    <div className="hero-title">
      <h1>三种测量语言</h1>
      <span className="sub">Three instruments beside the classic dial</span>
    </div>
    <p className="lede">
      同一组读数：速度、上下文占用、缓存命中，以及实时、警戒、超量程、停止更新、页面估算这几种状态。
      经典双表盘是默认，也是参照；另外三种各自回答一种不同的阅读需求，而不是给同一个表盘换一种材质。
    </p>
    <p className="study-note">四种样式读同一份数据、同一套校准。VU 和记录纸有自己的面板或纸面，瑞士尺完全借宿主的墨与纸。</p>

    <RackBlock />
    <RackBlock dark />

    <section className="principles">
      {PRINCIPLES.map(([title, text]) => (
        <div className="principle" key={title}>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      ))}
    </section>

    {DESIGN_IDS.map((id, index) => <Spread key={id} style={id} index={index} />)}

    <section className="closing">
      <h2>收束</h2>
      <p className="lede">
        minimal 密度把仪表折成一行，用留白分隔各项；超过满量程时数字后带「+」。四种样式在最小尺寸下仍然认得出来。
      </p>
      <div className="minimal-compare">
        <MinimalList />
        <MinimalList dark />
      </div>

      <div className="recommendations">
        {RECOMMENDATIONS.map((rec) => (
          <div className="rec" key={rec.id}>
            <div className="rec-role">{rec.role}</div>
            <div className="rec-name">{rec.id === 'classic' ? CLASSIC.name.zh : DESIGN_META[rec.id].name.zh}</div>
            <p className="rec-text">{rec.text}</p>
          </div>
        ))}
      </div>

      <p className="closing-note">
        1.6.0 从八种样式收为四种。台表并入经典；高度表的鼓轮成了经典和 VU 的「读数」选项；信号楼的三色灯成了「上下文信号灯」选项；
        罗经下架，因为转动的卡面上没有可以读的数。旧设置会自动迁移。真实会话下的动效观感仍待验收。
      </p>
    </section>

    <footer className="footer">
      <span>Retro Dock 三种测量语言</span>
      <span>速度是 1.2 秒估算 + 校准，不是服务端逐 chunk 计数。</span>
      <span>2026.10 / 设计研究</span>
    </footer>
  </div>
);

createRoot(document.getElementById('root')).render(<App />);
