/**
 * Chart: a strip-chart recorder. Paper, a hairline grid, a red pen trace and a
 * printed margin. The dark theme uses blueprint paper, not a white card.
 */

export const CHART_CSS = String.raw`
.rg-gauge[data-style="chart"] {
  --chart-paper: #f4efe3;
  --chart-edge: #cdc2ac;
  --chart-hair: rgba(72, 68, 58, .24);
  --chart-gloss: rgba(255, 255, 255, .45);
  --chart-ink: #171917;
  --chart-muted: #615e55;
  --chart-grid: rgba(72, 68, 58, .14);
  --chart-grid-strong: rgba(72, 68, 58, .3);
  --chart-trace: #9c3324;
  --chart-red: #b23a2a;
  --chart-w: 170px;
  --chart-h: 56px;
  --chart-margin: 52px;
  --chart-head: 16px;
  --chart-value: 16px;
  --chart-unit: 6.5px;
  --chart-tag: 6.5px;
  --chart-num: 9px;
  --chart-press: 24px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--chart-ink);
  font-family: Consolas, "Cascadia Mono", "SF Mono", Menlo, "DejaVu Sans Mono", monospace;
  font-variant-numeric: tabular-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="chart"] {
  --chart-paper: #171d1f;
  --chart-edge: #2e3a3c;
  --chart-hair: rgba(206, 220, 214, .2);
  --chart-gloss: rgba(255, 255, 255, .04);
  --chart-ink: #e6e9e3;
  --chart-muted: #97a09a;
  --chart-grid: rgba(206, 220, 214, .13);
  --chart-grid-strong: rgba(206, 220, 214, .26);
  --chart-trace: #e37f69;
  --chart-red: #f07a62;
}

.rg-gauge[data-style="chart"][data-variant="input"][data-density="full"] {
  --chart-w: 170px;
  --chart-h: 56px;
  --chart-margin: 52px;
  --chart-head: 16px;
  --chart-value: 16px;
  --chart-unit: 6.5px;
  --chart-tag: 6.5px;
  --chart-num: 9px;
  --chart-press: 24px;
}

.rg-gauge[data-style="chart"][data-variant="input"][data-density="compact"] {
  --chart-w: 158px;
  --chart-h: 48px;
  --chart-margin: 48px;
  --chart-head: 13px;
  --chart-value: 14px;
  --chart-unit: 6px;
  --chart-tag: 6px;
  --chart-num: 8.5px;
  --chart-press: 20px;
}

.rg-gauge[data-style="chart"][data-variant="dock"][data-density="full"] {
  --chart-w: 140px;
  --chart-h: 42px;
  --chart-margin: 44px;
  --chart-head: 12px;
  --chart-value: 12.5px;
  --chart-unit: 5.5px;
  --chart-tag: 6px;
  --chart-num: 8px;
  --chart-press: 16px;
}

.rg-gauge[data-style="chart"][data-variant="dock"][data-density="compact"] {
  --chart-w: 132px;
  --chart-h: 40px;
  --chart-margin: 42px;
  --chart-head: 11px;
  --chart-value: 12px;
  --chart-unit: 5px;
  --chart-tag: 5.5px;
  --chart-num: 7.5px;
  --chart-press: 14px;
}

.rg-gauge[data-style="chart"] .rgx-chart {
  display: inline-flex;
  align-items: stretch;
  width: var(--chart-w);
  height: var(--chart-h);
  padding: 3px;
  box-sizing: border-box;
  background: var(--chart-paper);
  border: 1px solid var(--chart-edge);
  border-radius: 2px;
  box-shadow: inset 0 1px 0 var(--chart-gloss);
  color: var(--chart-ink);
}

.rg-gauge[data-style="chart"] .rgx-chart-paper {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1 1 auto;
  min-width: 0;
  padding-right: 5px;
  border-right: 1px solid var(--chart-hair);
}

.rg-gauge[data-style="chart"] .rgx-chart-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 4px;
  height: var(--chart-head);
  flex: 0 0 auto;
}

.rg-gauge[data-style="chart"] .rgx-chart-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 0;
  font-size: var(--chart-value);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -.02em;
  color: var(--chart-ink);
  white-space: nowrap;
}

.rg-gauge[data-style="chart"] .rgx-chart-value .rgx-approx {
  display: inline-block;
  width: .9em;
  flex: 0 0 auto;
  font-size: .56em;
  font-weight: 500;
  text-align: center;
  opacity: .7;
}

.rg-gauge[data-style="chart"] .rgx-chart-digits {
  display: inline-block;
  flex: 0 0 auto;
  min-width: 2.2ch;
}

.rg-gauge[data-style="chart"] .rgx-chart-unit {
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: var(--chart-unit);
  font-weight: 500;
  letter-spacing: .04em;
  color: var(--chart-muted);
}

.rg-gauge[data-style="chart"] .rgx-chart-over {
  display: none;
  color: var(--chart-red);
  font-size: .8em;
  font-weight: 700;
}

.rg-gauge[data-style="chart"][data-over="1"] .rgx-chart-over {
  display: inline;
}

.rg-gauge[data-style="chart"] .rgx-chart-span {
  flex: 0 0 auto;
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 5.5px;
  letter-spacing: .04em;
  color: var(--chart-muted);
}

.rg-gauge[data-style="chart"] .rgx-chart-plot {
  position: relative;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  border-bottom: 1px solid var(--chart-grid-strong);
  background-color: transparent;
  background-image:
    linear-gradient(to right, var(--chart-grid) 1px, transparent 1px),
    linear-gradient(to bottom, var(--chart-grid) 1px, transparent 1px);
  background-size: 12.5% 100%, 100% 25%;
}

.rg-gauge[data-style="chart"] .rgx-chart-trace {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.rg-gauge[data-style="chart"] .rgx-chart-line {
  stroke: var(--chart-trace);
  stroke-width: 1;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="chart"] .rgx-chart-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--chart-trace);
  box-shadow: 0 0 0 1px var(--chart-paper);
  pointer-events: none;
}

.rg-gauge[data-style="chart"] .rgx-chart-dot.is-over {
  background: var(--chart-red);
}

.rg-gauge[data-style="chart"] .rgx-chart-cap {
  stroke: var(--chart-red);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="chart"] .rgx-chart-margin {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2px;
  width: var(--chart-margin);
  flex: 0 0 auto;
  min-width: 0;
  padding-left: 5px;
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
}

.rg-gauge[data-style="chart"] .rgx-chart-ctx,
.rg-gauge[data-style="chart"] .rgx-chart-hit {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 3px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="chart"] .rgx-chart-tag {
  font-size: var(--chart-tag);
  font-weight: 500;
  letter-spacing: .06em;
  color: var(--chart-muted);
}

.rg-gauge[data-style="chart"] .rgx-chart-num {
  font-family: Consolas, "Cascadia Mono", "SF Mono", Menlo, "DejaVu Sans Mono", monospace;
  font-size: var(--chart-num);
  font-weight: 600;
  color: var(--chart-ink);
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="chart"] .rgx-chart-alert {
  margin-left: 1px;
  color: var(--chart-red);
  font-weight: 700;
}

.rg-gauge[data-style="chart"] .rgx-chart-pressure {
  position: relative;
  width: 4px;
  height: var(--chart-press);
  margin: 1px auto;
  background: var(--chart-grid);
  flex: 0 0 auto;
}

.rg-gauge[data-style="chart"] .rgx-chart-pressure-fill {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--chart-ink);
}

.rg-gauge[data-style="chart"] .rgx-chart-pressure-mark {
  position: absolute;
  left: -2px;
  right: -2px;
  height: 1px;
  background: var(--chart-red);
  opacity: .7;
}

.rg-gauge[data-style="chart"][data-warn="1"] .rgx-chart-pressure-fill {
  background: var(--chart-red);
}

.rg-gauge[data-style="chart"][data-warn="1"] .rgx-chart-pressure-mark {
  opacity: 1;
}

.rg-gauge[data-style="chart"][data-warn="1"] .rgx-chart-ctx .rgx-chart-tag,
.rg-gauge[data-style="chart"][data-warn="1"] .rgx-chart-ctx .rgx-chart-num {
  color: var(--chart-red);
}

.rg-gauge[data-style="chart"] .rgx-mini {
  background: var(--chart-paper);
  border: 1px solid var(--chart-edge);
  border-radius: 2px;
  padding: 3px 8px;
  color: var(--chart-ink);
  font-family: Consolas, "Cascadia Mono", "SF Mono", Menlo, "DejaVu Sans Mono", monospace;
  font-size: 10.5px;
}

.rg-gauge[data-style="chart"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 600;
}

.rg-gauge[data-style="chart"] .rgx-mini-approx {
  width: .9em;
  font-size: .7em;
  opacity: .7;
}

.rg-gauge[data-style="chart"] .rgx-mini-unit,
.rg-gauge[data-style="chart"] .rgx-mini-sep {
  color: var(--chart-muted);
}

.rg-gauge[data-style="chart"] .rgx-mini-ctx.is-warn {
  color: var(--chart-red);
}
`;
