/**
 * Broadcast VU: ivory face, bronze bezel, a wide fan and a warm lamp. The face
 * never inverts: in a dark host it is a lit object, not a dark card.
 */

export const VU_CSS = String.raw`
.rg-gauge[data-style="vu"] {
  --vu-face-1: #f2e7d2;
  --vu-face-2: #e8d8bd;
  --vu-glow: rgba(255, 255, 255, 0);
  --vu-bezel: #6c5f4d;
  --vu-inner: rgba(255, 255, 255, .45);
  --vu-ink: #2a2119;
  --vu-muted: #6b5b45;
  --vu-red: #ae3627;
  --vu-peak: rgba(42, 33, 25, .22);
  --vu-w: 156px;
  --vu-h: 68px;
  --vu-scale: 38px;
  --vu-row: 20px;
  --vu-value: 20px;
  --vu-side: 11px;
  --vu-tag: 8.5px;
  --vu-unit: 8.5px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--vu-ink);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="vu"] {
  --vu-face-1: #d6c6a6;
  --vu-face-2: #c7b58e;
  --vu-glow: transparent;
  --vu-bezel: #2b231b;
  --vu-inner: rgba(255, 250, 238, .38);
  --vu-ink: #2a2119;
  --vu-muted: #6b5b45;
  --vu-red: #a93223;
  --vu-peak: rgba(42, 33, 25, .3);
}

.rg-gauge[data-style="vu"][data-variant="input"][data-density="full"] {
  --vu-w: 156px;
  --vu-h: 68px;
  --vu-scale: 38px;
  --vu-row: 20px;
  --vu-value: 20px;
  --vu-side: 11px;
  --vu-tag: 8.5px;
  --vu-unit: 8.5px;
}

.rg-gauge[data-style="vu"][data-variant="input"][data-density="compact"] {
  --vu-w: 136px;
  --vu-h: 60px;
  --vu-scale: 33px;
  --vu-row: 18px;
  --vu-value: 18px;
  --vu-side: 10px;
  --vu-tag: 8px;
  --vu-unit: 8px;
}

.rg-gauge[data-style="vu"][data-variant="dock"][data-density="full"] {
  --vu-w: 108px;
  --vu-h: 42px;
  --vu-scale: 22px;
  --vu-row: 13px;
  --vu-value: 13px;
  --vu-side: 8px;
  --vu-tag: 7.5px;
  --vu-unit: 7.5px;
}

.rg-gauge[data-style="vu"][data-variant="dock"][data-density="compact"] {
  --vu-w: 100px;
  --vu-h: 40px;
  --vu-scale: 20px;
  --vu-row: 12px;
  --vu-value: 12px;
  --vu-side: 7.5px;
  --vu-tag: 7.5px;
  --vu-unit: 7.5px;
}

/* 状态栏里的 VU 太窄，放不下三颗灯；CTX 数值本身仍按警戒/危险变色 */
.rg-gauge[data-style="vu"][data-variant="dock"] .rgx-lamps {
  display: none;
}

.rg-gauge[data-style="vu"] .rgx-vu {
  display: inline-flex;
}

.rg-gauge[data-style="vu"] .rgx-vu-face {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3px;
  width: var(--vu-w);
  height: var(--vu-h);
  padding: 3px 5px 2px;
  box-sizing: border-box;
  overflow: hidden;
  background:
    radial-gradient(120% 80% at 50% 0%, var(--vu-glow), transparent 65%),
    linear-gradient(180deg, var(--vu-face-1), var(--vu-face-2));
  border: 1px solid var(--vu-bezel);
  border-radius: 9px 9px 3px 3px;
  box-shadow:
    inset 0 0 0 1px var(--vu-inner),
    inset 0 -1px 0 rgba(0, 0, 0, .16);
}

.rg-gauge[data-style="vu"] .rgx-vu-scale {
  display: block;
  width: 100%;
  height: var(--vu-scale);
  flex: 0 0 auto;
  overflow: visible;
}

.rg-gauge[data-style="vu"] .rgx-vu-track {
  stroke: var(--vu-ink);
  stroke-width: .75;
  opacity: .62;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="vu"] .rgx-vu-redzone {
  stroke: var(--vu-red);
  stroke-width: 2.3;
  stroke-linecap: butt;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="vu"] .rgx-vu-ticks line {
  stroke: var(--vu-ink);
  stroke-width: .55;
  opacity: .75;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="vu"] .rgx-vu-ticks .is-major {
  stroke-width: .9;
  opacity: .95;
}

.rg-gauge[data-style="vu"] .rgx-vu-labels text {
  fill: var(--vu-ink);
  opacity: .88;
  font-family: Constantia, Cambria, Georgia, "DejaVu Serif", serif;
  /* SVG 坐标单位：输入位约 1.1 倍缩放，渲染出来约 8px */
  font-size: 7px;
  font-variant-numeric: lining-nums tabular-nums;
}

.rg-gauge[data-style="vu"] .rgx-vu-needle {
  transform: rotate(calc(212deg + var(--rg-p, 0) * 1.16deg));
  transform-origin: 60px 33px;
  transform-box: view-box;
  will-change: transform;
}

.rg-gauge[data-style="vu"] .rgx-vu-needle-blade {
  fill: var(--vu-ink);
}

.rg-gauge[data-style="vu"] .rgx-vu-needle-tail {
  fill: var(--vu-ink);
  opacity: .82;
}

.rg-gauge[data-style="vu"] .rgx-vu-hub {
  fill: var(--vu-ink);
}

[data-ds-dark-theme] .rg-gauge[data-style="vu"][data-live="1"] {
  --vu-face-1: #efe2c9;
  --vu-face-2: #ddcaa8;
  --vu-glow: rgba(255, 196, 120, .28);
}

.rg-gauge[data-style="vu"] .rgx-vu-peak {
  position: absolute;
  top: 4px;
  right: 7px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vu-peak);
}

.rg-gauge[data-style="vu"][data-over="1"] .rgx-vu-peak {
  background: var(--vu-red);
  box-shadow: 0 0 5px var(--vu-red);
}

.rg-gauge[data-style="vu"] .rgx-vu-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 5px;
  height: var(--vu-row);
  min-width: 0;
}

.rg-gauge[data-style="vu"] .rgx-vu-side {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1px;
  min-width: 0;
  line-height: 1;
}

.rg-gauge[data-style="vu"] .rgx-vu-side.is-right {
  align-items: flex-end;
  text-align: right;
}

.rg-gauge[data-style="vu"] .rgx-vu-tag {
  font-size: var(--vu-tag);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--vu-muted);
  white-space: nowrap;
}

.rg-gauge[data-style="vu"] .rgx-vu-val {
  font-size: var(--vu-side);
  font-weight: 600;
  letter-spacing: .005em;
  color: var(--vu-ink);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="vu"] .rgx-vu-alert {
  margin-left: 2px;
  color: var(--vu-red);
  font-weight: 700;
}

.rg-gauge[data-style="vu"][data-warn="1"] .rgx-vu-side.is-warn .rgx-vu-tag,
.rg-gauge[data-style="vu"][data-warn="1"] .rgx-vu-side.is-warn .rgx-vu-val {
  color: var(--vu-red);
}

.rg-gauge[data-style="vu"] .rgx-vu-main {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 1px;
  flex: 1 1 auto;
  min-width: 0;
  font-size: var(--vu-value);
  font-weight: 600;
  letter-spacing: -.012em;
  line-height: 1;
  color: var(--vu-ink);
  white-space: nowrap;
}

.rg-gauge[data-style="vu"] .rgx-vu-main .rgx-approx {
  display: inline-block;
  width: .85em;
  flex: 0 0 auto;
  font-size: .55em;
  font-weight: 500;
  text-align: center;
  opacity: .7;
}

.rg-gauge[data-style="vu"] .rgx-vu-over {
  color: var(--vu-red);
  font-weight: 700;
}

.rg-gauge[data-style="vu"] .rgx-vu-digits {
  display: inline-block;
  flex: 0 0 auto;
  min-width: 2.1ch;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="vu"] .rgx-vu-unit {
  flex: 0 0 auto;
  margin-left: 1px;
  font-size: var(--vu-unit);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--vu-muted);
}

.rg-gauge[data-style="vu"] .rgx-mini {
  background: linear-gradient(180deg, var(--vu-face-1), var(--vu-face-2));
  border: 1px solid var(--vu-bezel);
  border-radius: 4px 4px 2px 2px;
  box-shadow: inset 0 0 0 1px var(--vu-inner);
  padding: 3px 8px;
  color: var(--vu-ink);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 10.5px;
}

.rg-gauge[data-style="vu"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 600;
}

.rg-gauge[data-style="vu"] .rgx-mini-approx {
  width: .85em;
  font-size: .7em;
  opacity: .7;
}

.rg-gauge[data-style="vu"] .rgx-mini-unit,
.rg-gauge[data-style="vu"] .rgx-mini-sep {
  color: var(--vu-muted);
}

.rg-gauge[data-style="vu"] .rgx-mini-ctx.is-warn {
  color: var(--vu-red);
}
`;
