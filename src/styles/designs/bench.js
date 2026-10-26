/**
 * Bench: zinc panel, graphite printing, one oxide red reserved for the CTX
 * redline and the over-speed stop.
 */

export const BENCH_CSS = String.raw`
.rg-gauge[data-style="bench"] {
  --bench-panel: #e8e6df;
  --bench-edge: #c4c0b5;
  --bench-window: #dcd9cf;
  --bench-window-edge: #bdb8ac;
  --bench-ink: #1a1c1c;
  --bench-muted: #555752;
  --bench-tick: rgba(26, 28, 28, .62);
  --bench-hair: rgba(26, 28, 28, .22);
  --bench-red: #a93526;
  --bench-red-strong: #8a2115;
  --bench-gloss: rgba(255, 255, 255, .55);
  --bench-inset: rgba(26, 28, 28, .14);
  --rg-hairline: var(--bench-edge);
  --bench-h: 56px;
  --bench-dial: 48px;
  --bench-window-w: 76px;
  --bench-value: 17px;
  --bench-unit: 6.5px;
  --bench-tag: 8.5px;
  --bench-num: 10.5px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--bench-ink);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="bench"] {
  --bench-panel: #232627;
  --bench-edge: #3b3f40;
  --bench-window: #111415;
  --bench-window-edge: #454a4b;
  --bench-ink: #ece9e0;
  --bench-muted: #a7a59d;
  --bench-tick: rgba(236, 233, 224, .55);
  --bench-hair: rgba(236, 233, 224, .18);
  --bench-red: #e1705b;
  --bench-red-strong: #ff8e76;
  --bench-gloss: rgba(255, 255, 255, .055);
  --bench-inset: rgba(0, 0, 0, .55);
}

.rg-gauge[data-style="bench"][data-variant="input"][data-density="full"] {
  --bench-h: 56px;
  --bench-dial: 48px;
  --bench-window-w: 76px;
  --bench-value: 17px;
  --bench-unit: 6.5px;
  --bench-tag: 8.5px;
  --bench-num: 10.5px;
}

.rg-gauge[data-style="bench"][data-variant="input"][data-density="compact"] {
  --bench-h: 48px;
  --bench-dial: 40px;
  --bench-window-w: 68px;
  --bench-value: 15px;
  --bench-unit: 6.5px;
  --bench-tag: 8px;
  --bench-num: 9px;
}

.rg-gauge[data-style="bench"][data-variant="dock"][data-density="full"] {
  --bench-h: 42px;
  --bench-dial: 34px;
  --bench-window-w: 64px;
  --bench-value: 13.5px;
  --bench-unit: 6px;
  --bench-tag: 7px;
  --bench-num: 8.5px;
}

.rg-gauge[data-style="bench"][data-variant="dock"][data-density="compact"] {
  --bench-h: 40px;
  --bench-dial: 30px;
  --bench-window-w: 58px;
  --bench-value: 12.5px;
  --bench-unit: 5.5px;
  --bench-tag: 7px;
  --bench-num: 8px;
}

.rg-gauge[data-style="bench"] .rgx-bench {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--bench-h);
  padding: 2px;
  box-sizing: border-box;
  background: var(--bench-panel);
  border: 1px solid var(--bench-edge);
  border-radius: 4px;
  box-shadow: inset 0 1px 0 var(--bench-gloss);
}

.rg-gauge[data-style="bench"] .rgx-bench-dialwrap {
  width: var(--bench-dial);
  height: var(--bench-dial);
  flex: 0 0 auto;
  display: block;
}

.rg-gauge[data-style="bench"] .rgx-bench-dial {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rg-gauge[data-style="bench"] .rgx-bench-rim {
  fill: none;
  stroke: var(--bench-tick);
  stroke-width: .5;
  opacity: .55;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="bench"] .rgx-bench-ticks line {
  stroke: var(--bench-tick);
  stroke-width: .7;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="bench"] .rgx-bench-ticks .is-major {
  stroke-width: 1;
}

.rg-gauge[data-style="bench"] .rgx-bench-ticks .is-end {
  stroke: var(--bench-ink);
  stroke-width: 1.5;
}

.rg-gauge[data-style="bench"] .rgx-bench-labels text {
  fill: var(--bench-muted);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 4.4px;
  font-weight: 500;
  letter-spacing: .02em;
}

.rg-gauge[data-style="bench"] .rgx-bench-needle {
  transform: rotate(calc(150deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 25px 25px;
  transform-box: view-box;
  will-change: transform;
}

.rg-gauge[data-style="bench"] .rgx-bench-needle-blade {
  fill: var(--bench-ink);
}

.rg-gauge[data-style="bench"] .rgx-bench-needle-tail {
  fill: var(--bench-ink);
  opacity: .38;
}

.rg-gauge[data-style="bench"] .rgx-bench-hub {
  fill: var(--bench-ink);
}

.rg-gauge[data-style="bench"] .rgx-bench-hub-pin {
  fill: var(--bench-panel);
}

.rg-gauge[data-style="bench"] .rgx-bench-over-dot {
  fill: var(--bench-red-strong);
  opacity: calc(var(--rg-over, 0) * 2.6);
}

.rg-gauge[data-style="bench"][data-over="1"] .rgx-bench-over-dot {
  opacity: 1;
}

.rg-gauge[data-style="bench"][data-over="1"] .rgx-bench-ticks .is-end {
  stroke: var(--bench-red);
}

.rg-gauge[data-style="bench"][data-over="1"] .rgx-bench-over-flag {
  display: inline;
}

.rg-gauge[data-style="bench"] .rgx-bench-over-flag {
  display: none;
  flex: 0 0 auto;
  margin-left: 1px;
  color: var(--bench-red);
  font-size: .72em;
  font-weight: 700;
  line-height: 1;
}

.rg-gauge[data-style="bench"] .rgx-bench-read {
  display: block;
  min-width: 0;
}

.rg-gauge[data-style="bench"] .rgx-bench-window {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: var(--bench-window-w);
  padding: 2px 4px;
  box-sizing: border-box;
  background: var(--bench-window);
  border: 1px solid var(--bench-window-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 2px var(--bench-inset);
}

.rg-gauge[data-style="bench"] .rgx-bench-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
  height: var(--bench-value);
  line-height: 1;
  font-size: var(--bench-value);
  font-weight: 600;
  letter-spacing: -.012em;
  color: var(--bench-ink);
  white-space: nowrap;
}

.rg-gauge[data-style="bench"] .rgx-bench .rgx-approx {
  display: inline-block;
  width: .9em;
  flex: 0 0 auto;
  font-size: .56em;
  font-weight: 500;
  text-align: center;
  opacity: .7;
}

.rg-gauge[data-style="bench"] .rgx-bench-digits {
  display: inline-block;
  flex: 0 0 auto;
  min-width: 2.2ch;
  text-align: left;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="bench"] .rgx-bench-unit {
  flex: 0 0 auto;
  margin-left: 1px;
  font-size: var(--bench-unit);
  font-weight: 500;
  letter-spacing: .06em;
  color: var(--bench-muted);
}

.rg-gauge[data-style="bench"] .rgx-bench-rows {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 1px;
  border-top: 1px solid var(--bench-hair);
}

.rg-gauge[data-style="bench"] .rgx-bench-row {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="bench"] .rgx-bench-row .rgx-bench-num {
  margin-left: auto;
}

.rg-gauge[data-style="bench"] .rgx-bench-row-ctx {
  height: var(--bench-num);
}

.rg-gauge[data-style="bench"] .rgx-bench-tag {
  flex: 0 0 auto;
  font-size: var(--bench-tag);
  font-weight: 500;
  letter-spacing: .07em;
  color: var(--bench-muted);
}

.rg-gauge[data-style="bench"] .rgx-bench-num {
  flex: 0 0 auto;
  font-size: var(--bench-num);
  font-weight: 600;
  letter-spacing: .005em;
  color: var(--bench-ink);
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="bench"] .rgx-bench-alert {
  margin-left: 2px;
  color: var(--bench-red);
  font-weight: 700;
}

.rg-gauge[data-style="bench"] .rgx-bench-bar {
  position: relative;
  flex: 1 1 auto;
  min-width: 14px;
  height: 6px;
  align-self: center;
}

.rg-gauge[data-style="bench"] .rgx-bench-bar::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--bench-hair);
  transform: translateY(-50%);
}

.rg-gauge[data-style="bench"] .rgx-bench-bar-fill,
.rg-gauge[data-style="bench"] .rgx-bench-bar-over {
  position: absolute;
  top: 50%;
  height: 2px;
  transform: translateY(-50%);
}

.rg-gauge[data-style="bench"] .rgx-bench-bar-fill {
  left: 0;
  background: var(--bench-muted);
}

.rg-gauge[data-style="bench"] .rgx-bench-bar-over {
  background: var(--bench-red);
}

.rg-gauge[data-style="bench"] .rgx-bench-bar-mark {
  position: absolute;
  top: 50%;
  width: 1px;
  height: 6px;
  background: var(--bench-red);
  opacity: .65;
  transform: translate(-.5px, -50%);
}

.rg-gauge[data-style="bench"][data-warn="1"] .rgx-bench-bar-fill {
  background: var(--bench-red);
}

.rg-gauge[data-style="bench"][data-warn="1"] .rgx-bench-bar-mark {
  opacity: 1;
}

.rg-gauge[data-style="bench"][data-warn="1"] .rgx-bench-row-ctx .rgx-bench-tag,
.rg-gauge[data-style="bench"][data-warn="1"] .rgx-bench-row-ctx .rgx-bench-num {
  color: var(--bench-red);
}

.rg-gauge[data-style="bench"] .rgx-mini {
  background: var(--bench-panel);
  border: 1px solid var(--bench-edge);
  border-radius: 3px;
  padding: 3px 8px;
  color: var(--bench-ink);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 10.5px;
}

.rg-gauge[data-style="bench"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 600;
}

.rg-gauge[data-style="bench"] .rgx-mini-approx {
  width: .9em;
  font-size: .7em;
  opacity: .7;
}

.rg-gauge[data-style="bench"] .rgx-mini-unit,
.rg-gauge[data-style="bench"] .rgx-mini-sep {
  color: var(--bench-muted);
}

.rg-gauge[data-style="bench"] .rgx-mini-ctx.is-warn {
  color: var(--bench-red);
}


`;
