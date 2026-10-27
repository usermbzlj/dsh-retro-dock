/**
 * Shared scaffolding for the three instrument languages beside classic.
 */

export const DESIGN_BASE_CSS = String.raw`
.rg-gauge .rgx-drum {
  display: inline-flex;
  align-items: stretch;
  height: 1em;
  overflow: hidden;
  font-variant-numeric: tabular-nums lining-nums;
}

.rg-gauge .rgx-drum-col {
  display: inline-block;
  width: .6em;
  text-align: center;
  height: 1em;
  overflow: hidden;
}

.rg-gauge .rgx-drum-strip {
  display: flex;
  flex-direction: column;
  transition: transform 90ms linear;
}

.rg-gauge .rgx-drum-col.is-units .rgx-drum-strip {
  transition: none;
}

.rg-gauge .rgx-drum-glyph {
  display: block;
  height: 1em;
  line-height: 1;
}

.rg-gauge .rgx-drum-col.is-lead {
  opacity: .3;
}

.rg-gauge .rgx-drum-plus {
  margin-left: 1px;
  font-weight: 700;
}

.rg-gauge .rgx-lamps {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 3px;
}

/* 灭灯是实心的淡色灯罩，不是空心圆圈；亮灯带一圈很浅的光晕 */
.rg-gauge .rgx-lamp {
  --lamp: #2f6b45;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-sizing: border-box;
  background: color-mix(in srgb, currentColor 18%, transparent);
  transition: background .25s ease, box-shadow .25s ease;
}

.rg-gauge .rgx-lamp[data-lamp="amber"] { --lamp: #b45309; }
.rg-gauge .rgx-lamp[data-lamp="red"] { --lamp: var(--rg-caution-strong, #b45309); }

[data-ds-dark-theme] .rg-gauge .rgx-lamp[data-lamp="ok"] { --lamp: #4fb07a; }
[data-ds-dark-theme] .rg-gauge .rgx-lamp[data-lamp="amber"] { --lamp: #e3a33b; }

.rg-gauge .rgx-lamps[data-level="ok"] .rgx-lamp[data-lamp="ok"],
.rg-gauge .rgx-lamps[data-level="amber"] .rgx-lamp[data-lamp="amber"],
.rg-gauge .rgx-lamps[data-level="red"] .rgx-lamp[data-lamp="red"] {
  background: var(--lamp);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--lamp) 22%, transparent), 0 0 4px color-mix(in srgb, var(--lamp) 45%, transparent);
}

/* VU 的灯装在象牙表盘上，表盘不随宿主变暗，所以保持浅色主题的灯色 */
.rg-gauge[data-style="vu"] .rgx-lamp[data-lamp="ok"] { --lamp: #2f6b45; }
.rg-gauge[data-style="vu"] .rgx-lamp[data-lamp="amber"] { --lamp: #b45309; }

/* 空闲保留均速：数字略退后，单位换成“均速”并点亮 */
.rg-gauge[data-style]:not([data-style="classic"])[data-hold="1"] :is(.rgx-vu-digits, .rgx-chart-digits, .rgx-swiss-digits, .rgx-mini-digits, .rgx-drum) {
  opacity: .78;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-live="0"]:not([data-hold="1"]) :is(.rgx-vu-digits, .rgx-chart-digits, .rgx-swiss-digits, .rgx-mini-digits) {
  opacity: .55;
}

.rg-gauge .rgx-mini-over,
.rg-gauge .rg-over-mark {
  color: var(--rg-caution-strong, #b45309);
  font-weight: 700;
}

.rg-gauge[data-style]:not([data-style="classic"]) {
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: inherit;
  vertical-align: middle;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-body {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini {
  display: none;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-tag {
  letter-spacing: 0;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-density="minimal"] .rgx-body {
  display: none;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-density="minimal"] .rgx-mini {
  display: inline-flex;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-approx {
  display: inline-block;
  text-align: center;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-digits {
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-alert {
  margin-right: 2px;
  font-weight: 700;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-quality {
  position: static;
  display: inline-flex;
  margin-left: 5px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  box-sizing: border-box;
  border: 1px solid currentColor;
  border-radius: 2px;
  color: var(--dsw-alias-label-secondary, #5e636b);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  pointer-events: none;
  z-index: 2;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-quality[data-quality="stale"] {
  color: var(--dsw-alias-label-secondary, #5e636b);
  border-style: dashed;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-affordance {
  display: none;
  position: absolute;
  top: -2px;
  right: -7px;
  font-size: 10px;
  line-height: 1;
  opacity: .75;
  pointer-events: none;
}

.rg-gauge[data-style]:not([data-style="classic"]):hover .rgx-affordance,
.rg-gauge[data-style]:not([data-style="classic"]):focus-visible .rgx-affordance {
  display: inline-block;
}

/* Stale downgrades the mechanism, never the reading. */
.rg-gauge[data-style]:not([data-style="classic"])[data-stale="1"] .rgx-mechanism {
  opacity: .38;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-stale="1"] .rgx-mini {
  color: var(--dsw-alias-label-secondary, #5e636b);
}

@media (hover: none) {
  .rg-gauge[data-style]:not([data-style="classic"]) .rgx-affordance {
    display: inline-block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rg-gauge[data-style]:not([data-style="classic"]),
  .rg-gauge[data-style]:not([data-style="classic"]) * {
    transition: none !important;
  }
}
`;
