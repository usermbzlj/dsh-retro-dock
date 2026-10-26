/**
 * Altimeter: a matte panel with a black dial and a black drum window. The
 * counter stays dark in both themes; the panel follows the host.
 */

export const ALTIMETER_CSS = String.raw`
.rg-gauge[data-style="altimeter"] {
  --alt-panel: #dcddd8;
  --alt-edge: #b9bab3;
  --alt-ink: #17191a;
  --alt-muted: #5d605c;
  --alt-red: #a63122;
  --alt-face-red: #e0705c;
  --alt-face: #121516;
  --alt-face-ink: #f1efe8;
  --alt-face-muted: rgba(241, 239, 232, .6);
  --alt-window: #080a0b;
  --alt-window-edge: #2a2e2f;
  --alt-gloss: rgba(255, 255, 255, .5);
  --alt-inset: rgba(0, 0, 0, .5);
  --alt-w: 150px;
  --alt-h: 56px;
  --alt-dial: 44px;
  --alt-window-h: 20px;
  --alt-value: 16px;
  --alt-unit: 6px;
  --alt-tag: 6.5px;
  --alt-num: 9.5px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--alt-ink);
  font-family: Bahnschrift, "Arial Narrow", "Segoe UI", sans-serif;
  font-variant-numeric: tabular-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="altimeter"] {
  --alt-panel: #1b1f20;
  --alt-edge: #34393a;
  --alt-ink: #f0eee7;
  --alt-muted: #9da19c;
  --alt-red: #e47a64;
  --alt-face-red: #f07a62;
  --alt-face: #0c0f10;
  --alt-window: #050708;
  --alt-window-edge: #2a2e2f;
  --alt-gloss: rgba(255, 255, 255, .06);
  --alt-inset: rgba(0, 0, 0, .7);
}

.rg-gauge[data-style="altimeter"][data-variant="input"][data-density="full"] {
  --alt-w: 150px;
  --alt-h: 56px;
  --alt-dial: 44px;
  --alt-window-h: 20px;
  --alt-value: 16px;
  --alt-unit: 6px;
  --alt-tag: 6.5px;
  --alt-num: 9.5px;
}

.rg-gauge[data-style="altimeter"][data-variant="input"][data-density="compact"] {
  --alt-w: 140px;
  --alt-h: 48px;
  --alt-dial: 40px;
  --alt-window-h: 18px;
  --alt-value: 14px;
  --alt-unit: 6px;
  --alt-tag: 6.2px;
  --alt-num: 9px;
}

.rg-gauge[data-style="altimeter"][data-variant="dock"][data-density="full"] {
  --alt-w: 126px;
  --alt-h: 42px;
  --alt-dial: 34px;
  --alt-window-h: 15px;
  --alt-value: 12.5px;
  --alt-unit: 5.5px;
  --alt-tag: 6px;
  --alt-num: 8px;
}

.rg-gauge[data-style="altimeter"][data-variant="dock"][data-density="compact"] {
  --alt-w: 120px;
  --alt-h: 40px;
  --alt-dial: 32px;
  --alt-window-h: 13.5px;
  --alt-value: 11.5px;
  --alt-unit: 5px;
  --alt-tag: 5.5px;
  --alt-num: 7.5px;
}

.rg-gauge[data-style="altimeter"] .rgx-alt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: var(--alt-w);
  height: var(--alt-h);
  padding: 2px;
  box-sizing: border-box;
  background: var(--alt-panel);
  border: 1px solid var(--alt-edge);
  border-radius: 3px;
  box-shadow: inset 0 1px 0 var(--alt-gloss);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-dialwrap {
  width: var(--alt-dial);
  height: var(--alt-dial);
  flex: 0 0 auto;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-dial {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-face {
  fill: var(--alt-face);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-rim {
  fill: none;
  stroke: var(--alt-face-ink);
  stroke-width: .35;
  opacity: .32;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-ticks line {
  stroke: var(--alt-face-ink);
  stroke-width: .5;
  opacity: .82;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-ticks .is-major {
  stroke-width: .95;
  opacity: 1;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-labels text {
  fill: var(--alt-face-ink);
  opacity: .85;
  font-family: Bahnschrift, "Arial Narrow", sans-serif;
  font-size: 4.2px;
  font-stretch: 87.5%;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-needle {
  transform: rotate(calc(135deg + var(--rg-p, 0) * 2.7deg));
  transform-origin: 22px 22px;
  transform-box: view-box;
  will-change: transform;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-needle-blade {
  fill: var(--alt-face-ink);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-needle-tail {
  fill: var(--alt-face-ink);
  opacity: .5;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-hub {
  fill: var(--alt-face-ink);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-hub-pin {
  fill: var(--alt-face);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-over {
  stroke: var(--alt-face-red);
  stroke-width: 1.4;
  opacity: 0;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="altimeter"][data-over="1"] .rgx-alt-over {
  opacity: 1;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-read {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
}

.rg-gauge[data-style="altimeter"][data-sub="0"] .rgx-alt-read {
  justify-content: center;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-window {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
  height: var(--alt-window-h);
  padding: 1px 4px;
  box-sizing: border-box;
  background: var(--alt-window);
  border: 1px solid var(--alt-window-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px var(--alt-inset);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-value {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
  min-width: 0;
  font-size: var(--alt-value);
  font-weight: 600;
  line-height: 1;
  letter-spacing: .01em;
  color: var(--alt-face-ink);
  font-stretch: 87.5%;
  white-space: nowrap;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-value .rgx-approx {
  display: inline-block;
  width: .8em;
  flex: 0 0 auto;
  font-size: .55em;
  font-weight: 500;
  text-align: center;
  color: var(--alt-face-muted);
}

.rg-gauge[data-style="altimeter"] .rgx-drum {
  display: inline-flex;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="altimeter"] .rgx-drum-col {
  display: inline-block;
  height: 1em;
  width: .64em;
  overflow: hidden;
}

.rg-gauge[data-style="altimeter"] .rgx-drum-strip {
  display: flex;
  flex-direction: column;
  transition: transform .2s cubic-bezier(.2, .7, .3, 1);
  will-change: transform;
}

.rg-gauge[data-style="altimeter"] .rgx-drum-glyph {
  display: block;
  height: 1em;
  line-height: 1;
  text-align: center;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-over-flag {
  display: none;
  color: var(--alt-face-red);
  font-size: .8em;
  font-weight: 700;
  line-height: 1;
}

.rg-gauge[data-style="altimeter"][data-over="1"] .rgx-alt-over-flag {
  display: inline;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-unit {
  flex: 0 0 auto;
  font-size: var(--alt-unit);
  font-weight: 500;
  letter-spacing: .06em;
  color: var(--alt-face-muted);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-ctx,
.rg-gauge[data-style="altimeter"] .rgx-alt-hit {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-hit .rgx-alt-num {
  margin-left: auto;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-tag {
  flex: 0 0 auto;
  font-size: var(--alt-tag);
  font-weight: 500;
  letter-spacing: .07em;
  color: var(--alt-muted);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-num {
  flex: 0 0 auto;
  font-size: var(--alt-num);
  font-weight: 600;
  letter-spacing: .005em;
  color: var(--alt-ink);
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-alert {
  margin-left: 2px;
  color: var(--alt-red);
  font-weight: 700;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-bar {
  position: relative;
  flex: 1 1 auto;
  min-width: 12px;
  height: 5px;
  align-self: center;
}

.rg-gauge[data-style="altimeter"] .rgx-alt-bar::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: color-mix(in srgb, var(--alt-ink) 22%, transparent);
  transform: translateY(-50%);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-bar-fill,
.rg-gauge[data-style="altimeter"] .rgx-alt-bar-over {
  position: absolute;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-bar-fill {
  left: 0;
  background: var(--alt-muted);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-bar-over {
  background: var(--alt-red);
}

.rg-gauge[data-style="altimeter"] .rgx-alt-bar-mark {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 5px;
  background: var(--alt-red);
  opacity: .65;
  transform: translate(-.5px, -50%);
}

.rg-gauge[data-style="altimeter"][data-warn="1"] .rgx-alt-bar-fill {
  background: var(--alt-red);
}

.rg-gauge[data-style="altimeter"][data-warn="1"] .rgx-alt-bar-mark {
  opacity: 1;
}

.rg-gauge[data-style="altimeter"][data-warn="1"] .rgx-alt-ctx .rgx-alt-tag,
.rg-gauge[data-style="altimeter"][data-warn="1"] .rgx-alt-ctx .rgx-alt-num {
  color: var(--alt-red);
}

.rg-gauge[data-style="altimeter"] .rgx-mini {
  background: var(--alt-panel);
  border: 1px solid var(--alt-edge);
  border-radius: 2px;
  padding: 3px 8px;
  color: var(--alt-ink);
  font-family: Bahnschrift, "Arial Narrow", "Segoe UI", sans-serif;
  font-size: 10.5px;
}

.rg-gauge[data-style="altimeter"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 600;
}

.rg-gauge[data-style="altimeter"] .rgx-mini-approx {
  width: .8em;
  font-size: .7em;
  opacity: .7;
}

.rg-gauge[data-style="altimeter"] .rgx-mini-unit,
.rg-gauge[data-style="altimeter"] .rgx-mini-sep {
  color: var(--alt-muted);
}

.rg-gauge[data-style="altimeter"] .rgx-mini-ctx.is-warn {
  color: var(--alt-red);
}
`;
