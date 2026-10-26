/**
 * Signal: an enamel plate that inverts with the theme. The semaphore arm is
 * the only moving part; the lamps snap between states; the HIT value is a
 * mechanical counter window.
 */

export const SIGNAL_CSS = String.raw`
.rg-gauge[data-style="signal"] {
  --sig-plate: #e7e0cf;
  --sig-edge: #c1b7a2;
  --sig-ink: #171615;
  --sig-muted: #6a6252;
  --sig-red: #af3727;
  --sig-red-strong: #8c2417;
  --sig-green: #2f6b45;
  --sig-amber: #965812;
  --sig-gloss: rgba(255, 255, 255, .42);
  --sig-counter-bg: rgba(23, 22, 21, .05);
  --sig-counter-edge: rgba(23, 22, 21, .28);
  --sig-w: 168px;
  --sig-h: 56px;
  --sig-arm: 34px;
  --sig-value: 18px;
  --sig-unit: 7px;
  --sig-tag: 6.5px;
  --sig-num: 8.5px;
  --sig-info: 54px;
  --sig-lamp: 4px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--sig-ink);
  font-family: Bahnschrift, "DIN Alternate", "Segoe UI", sans-serif;
  font-variant-numeric: tabular-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="signal"] {
  --sig-plate: #141414;
  --sig-edge: #2f2d29;
  --sig-ink: #efe8d8;
  --sig-muted: #a29a88;
  --sig-red: #d9563f;
  --sig-red-strong: #f07a62;
  --sig-green: #5da878;
  --sig-amber: #d79a45;
  --sig-gloss: rgba(255, 255, 255, .05);
  --sig-counter-bg: rgba(255, 255, 255, .04);
  --sig-counter-edge: rgba(239, 232, 216, .26);
}

.rg-gauge[data-style="signal"][data-variant="input"][data-density="full"] {
  --sig-w: 168px;
  --sig-h: 56px;
  --sig-arm: 34px;
  --sig-value: 18px;
  --sig-unit: 7px;
  --sig-tag: 6.5px;
  --sig-num: 8.5px;
  --sig-info: 54px;
  --sig-lamp: 4px;
}

.rg-gauge[data-style="signal"][data-variant="input"][data-density="compact"] {
  --sig-w: 158px;
  --sig-h: 48px;
  --sig-arm: 30px;
  --sig-value: 16px;
  --sig-unit: 6.5px;
  --sig-tag: 6.2px;
  --sig-num: 8px;
  --sig-info: 48px;
  --sig-lamp: 3.8px;
}

.rg-gauge[data-style="signal"][data-variant="dock"][data-density="full"] {
  --sig-w: 138px;
  --sig-h: 42px;
  --sig-arm: 26px;
  --sig-value: 15px;
  --sig-unit: 6px;
  --sig-tag: 6px;
  --sig-num: 8px;
  --sig-info: 46px;
  --sig-lamp: 3.5px;
}

.rg-gauge[data-style="signal"][data-variant="dock"][data-density="compact"] {
  --sig-w: 134px;
  --sig-h: 40px;
  --sig-arm: 24px;
  --sig-value: 14px;
  --sig-unit: 5.5px;
  --sig-tag: 5.5px;
  --sig-num: 7.5px;
  --sig-info: 44px;
  --sig-lamp: 3.2px;
}

.rg-gauge[data-style="signal"] .rgx-signal {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  width: var(--sig-w);
  height: var(--sig-h);
  padding: 3px 5px;
  box-sizing: border-box;
  background: var(--sig-plate);
  border: 1px solid var(--sig-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 0 var(--sig-gloss);
}

.rg-gauge[data-style="signal"] .rgx-signal-armwrap {
  width: var(--sig-arm);
  height: var(--sig-arm);
  flex: 0 0 auto;
}

.rg-gauge[data-style="signal"] .rgx-signal-dial {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.rg-gauge[data-style="signal"] .rgx-signal-arc {
  stroke: var(--sig-ink);
  stroke-width: .4;
  opacity: .3;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="signal"] .rgx-signal-ticks line {
  stroke: var(--sig-ink);
  stroke-width: .6;
  opacity: .62;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="signal"] .rgx-signal-ticks .is-end {
  stroke-width: 1;
  opacity: .9;
}

.rg-gauge[data-style="signal"] .rgx-signal-arm {
  transform: rotate(calc(var(--rg-p, 0) * -0.72deg));
  transform-origin: 7px 29px;
  transform-box: view-box;
  will-change: transform;
}

.rg-gauge[data-style="signal"] .rgx-signal-arm-bar {
  fill: var(--sig-red);
}

.rg-gauge[data-style="signal"] .rgx-signal-arm-stripe {
  fill: var(--sig-plate);
}

.rg-gauge[data-style="signal"] .rgx-signal-arm-tail {
  fill: var(--sig-ink);
  opacity: .55;
}

.rg-gauge[data-style="signal"] .rgx-signal-pivot {
  fill: var(--sig-ink);
}

.rg-gauge[data-style="signal"] .rgx-signal-pivot-pin {
  fill: var(--sig-plate);
}

.rg-gauge[data-style="signal"] .rgx-signal-read {
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
}

.rg-gauge[data-style="signal"] .rgx-signal-main {
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 0;
  font-size: var(--sig-value);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -.012em;
  color: var(--sig-ink);
  white-space: nowrap;
}

.rg-gauge[data-style="signal"] .rgx-signal-main .rgx-approx {
  display: inline-block;
  width: .8em;
  flex: 0 0 auto;
  font-size: .5em;
  font-weight: 500;
  text-align: center;
  opacity: .7;
}

.rg-gauge[data-style="signal"] .rgx-signal-digits {
  display: inline-block;
  flex: 0 0 auto;
  min-width: 2ch;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="signal"] .rgx-signal-over {
  display: none;
  margin-left: 1px;
  color: var(--sig-red);
  font-size: .72em;
  font-weight: 700;
  line-height: 1;
}

.rg-gauge[data-style="signal"][data-over="1"] .rgx-signal-over {
  display: inline;
}

.rg-gauge[data-style="signal"] .rgx-signal-unit {
  flex: 0 0 auto;
  margin-left: 1px;
  font-size: var(--sig-unit);
  font-weight: 500;
  letter-spacing: .05em;
  color: var(--sig-muted);
}

.rg-gauge[data-style="signal"] .rgx-signal-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: var(--sig-info);
  flex: 0 0 auto;
  min-width: 0;
}

.rg-gauge[data-style="signal"] .rgx-signal-ctx {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="signal"] .rgx-signal-tag {
  flex: 0 0 auto;
  font-size: var(--sig-tag);
  font-weight: 500;
  letter-spacing: .07em;
  color: var(--sig-muted);
}

.rg-gauge[data-style="signal"] .rgx-signal-lamps {
  display: inline-flex;
  align-items: center;
  gap: 1.5px;
  flex: 0 0 auto;
}

.rg-gauge[data-style="signal"] .rgx-signal-lamp {
  width: var(--sig-lamp);
  height: var(--sig-lamp);
  box-sizing: border-box;
  border-radius: 50%;
  border: 1px solid color-mix(in srgb, var(--sig-ink) 32%, transparent);
  background: transparent;
}

.rg-gauge[data-style="signal"] .rgx-signal-lamp.is-on[data-lamp="green"] {
  background: var(--sig-green);
  border-color: var(--sig-green);
}

.rg-gauge[data-style="signal"] .rgx-signal-lamp.is-on[data-lamp="amber"] {
  background: var(--sig-amber);
  border-color: var(--sig-amber);
}

.rg-gauge[data-style="signal"] .rgx-signal-lamp.is-on[data-lamp="red"] {
  background: var(--sig-red);
  border-color: var(--sig-red);
  box-shadow: 0 0 4px var(--sig-red);
}

.rg-gauge[data-style="signal"] .rgx-signal-num {
  flex: 0 0 auto;
  margin-left: auto;
  font-size: var(--sig-num);
  font-weight: 600;
  letter-spacing: .005em;
  color: var(--sig-ink);
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="signal"] .rgx-signal-alert {
  margin-left: 2px;
  color: var(--sig-red);
  font-weight: 700;
}

.rg-gauge[data-style="signal"][data-warn="1"] .rgx-signal-ctx .rgx-signal-tag,
.rg-gauge[data-style="signal"][data-warn="1"] .rgx-signal-ctx .rgx-signal-num {
  color: var(--sig-red);
}

.rg-gauge[data-style="signal"] .rgx-signal-hit {
  display: flex;
  align-items: center;
  gap: 3px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="signal"] .rgx-signal-counter {
  margin-left: auto;
  padding: 1px 3px;
  font-size: var(--sig-num);
  font-weight: 600;
  line-height: 1;
  color: var(--sig-ink);
  background: var(--sig-counter-bg);
  border: 1px solid var(--sig-counter-edge);
  border-radius: 1px;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="signal"] .rgx-mini {
  background: var(--sig-plate);
  border: 1px solid var(--sig-edge);
  border-radius: 2px;
  padding: 3px 8px;
  color: var(--sig-ink);
  font-family: Bahnschrift, "DIN Alternate", "Segoe UI", sans-serif;
  font-size: 10.5px;
}

.rg-gauge[data-style="signal"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 600;
}

.rg-gauge[data-style="signal"] .rgx-mini-approx {
  width: .8em;
  font-size: .7em;
  opacity: .7;
}

.rg-gauge[data-style="signal"] .rgx-mini-unit,
.rg-gauge[data-style="signal"] .rgx-mini-sep {
  color: var(--sig-muted);
}

.rg-gauge[data-style="signal"] .rgx-mini-ctx.is-warn {
  color: var(--sig-red);
}
`;
