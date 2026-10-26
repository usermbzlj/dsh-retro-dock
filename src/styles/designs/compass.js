/**
 * Compass: a navy card under a brass bezel. The card turns; the lubber line
 * and readout measure. CTX is a fixed ring, so it never rotates with bearing.
 */

export const COMPASS_CSS = String.raw`
.rg-gauge[data-style="compass"] {
  --compass-face: #142128;
  --compass-brass: #8a7752;
  --compass-face-ink: #eae4d4;
  --compass-red: #c8462f;
  --compass-ink: var(--dsw-alias-label-primary, #17181a);
  --compass-muted: var(--dsw-alias-label-tertiary, #5e605c);
  --compass-warn: #b43725;
  --compass-dial: 54px;
  --compass-value: 20px;
  --compass-unit: 7.5px;
  --compass-tag: 6.5px;
  --compass-num: 9.5px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--compass-ink);
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-variant-numeric: tabular-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="compass"] {
  --compass-face: #0d161b;
  --compass-brass: #b49a68;
  --compass-face-ink: #ede7d7;
  --compass-red: #e0705c;
  --compass-warn: #f07e68;
}

.rg-gauge[data-style="compass"][data-variant="input"][data-density="full"] {
  --compass-dial: 54px;
  --compass-value: 20px;
  --compass-unit: 7.5px;
  --compass-tag: 6.5px;
  --compass-num: 9.5px;
}

.rg-gauge[data-style="compass"][data-variant="input"][data-density="compact"] {
  --compass-dial: 48px;
  --compass-value: 18px;
  --compass-unit: 7px;
  --compass-tag: 6.2px;
  --compass-num: 9px;
}

.rg-gauge[data-style="compass"][data-variant="dock"][data-density="full"] {
  --compass-dial: 44px;
  --compass-value: 16px;
  --compass-unit: 6.5px;
  --compass-tag: 6px;
  --compass-num: 8.5px;
}

.rg-gauge[data-style="compass"][data-variant="dock"][data-density="compact"] {
  --compass-dial: 40px;
  --compass-value: 15px;
  --compass-unit: 6px;
  --compass-tag: 5.5px;
  --compass-num: 8px;
}

.rg-gauge[data-style="compass"] .rgx-compass {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.rg-gauge[data-style="compass"] .rgx-compass-dialwrap {
  width: var(--compass-dial);
  height: var(--compass-dial);
  flex: 0 0 auto;
}

.rg-gauge[data-style="compass"] .rgx-compass-dial {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .18));
}

.rg-gauge[data-style="compass"] .rgx-compass-face {
  fill: var(--compass-face);
}

.rg-gauge[data-style="compass"] .rgx-compass-bezel {
  fill: none;
  stroke: var(--compass-brass);
  stroke-width: 1.7;
}

.rg-gauge[data-style="compass"] .rgx-compass-card {
  transform: rotate(calc(120deg - var(--rg-p, 0) * 2.4deg));
  transform-origin: 30px 30px;
  transform-box: view-box;
  will-change: transform;
}

.rg-gauge[data-style="compass"] .rgx-compass-card-ring {
  fill: none;
  stroke: var(--compass-face-ink);
  stroke-width: .35;
  opacity: .28;
}

.rg-gauge[data-style="compass"] .rgx-compass-card-tick {
  stroke: var(--compass-face-ink);
  stroke-width: .5;
  opacity: .66;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="compass"] .rgx-compass-card-tick.is-major {
  stroke-width: .85;
  opacity: .92;
}

.rg-gauge[data-style="compass"] .rgx-compass-zero {
  fill: var(--compass-face-ink);
  opacity: .92;
}

.rg-gauge[data-style="compass"] .rgx-compass-ctx-track {
  stroke: var(--compass-face-ink);
  stroke-width: 1;
  opacity: .22;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="compass"] .rgx-compass-ctx-fill {
  stroke: var(--compass-face-ink);
  stroke-width: 1.2;
  opacity: .85;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="compass"] .rgx-compass-ctx-over {
  stroke: var(--compass-red);
  stroke-width: 1.8;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="compass"] .rgx-compass-redline {
  stroke: var(--compass-red);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-style="compass"] .rgx-compass-index {
  fill: var(--compass-face-ink);
}

.rg-gauge[data-style="compass"][data-over="1"] .rgx-compass-index {
  fill: var(--compass-red);
}

.rg-gauge[data-style="compass"] .rgx-compass-hub {
  fill: var(--compass-brass);
}

.rg-gauge[data-style="compass"] .rgx-compass-hub-pin {
  fill: var(--compass-face);
}

.rg-gauge[data-style="compass"] .rgx-compass-over-dot {
  fill: var(--compass-red);
  opacity: 0;
}

.rg-gauge[data-style="compass"][data-over="1"] .rgx-compass-over-dot {
  opacity: 1;
}

.rg-gauge[data-style="compass"] .rgx-compass-read {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.rg-gauge[data-style="compass"] .rgx-compass-value {
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 0;
  font-family: Cambria, Georgia, "Times New Roman", serif;
  font-size: var(--compass-value);
  font-weight: 600;
  letter-spacing: -.02em;
  line-height: 1;
  color: var(--compass-ink);
  font-variant-numeric: lining-nums tabular-nums;
  white-space: nowrap;
}

.rg-gauge[data-style="compass"] .rgx-compass-value .rgx-approx {
  display: inline-block;
  width: .85em;
  flex: 0 0 auto;
  font-family: Cambria, Georgia, serif;
  font-size: .52em;
  font-weight: 500;
  text-align: center;
  opacity: .6;
}

.rg-gauge[data-style="compass"] .rgx-compass-digits {
  display: inline-block;
  flex: 0 0 auto;
  min-width: 2.2ch;
  font-variant-numeric: lining-nums tabular-nums;
}

.rg-gauge[data-style="compass"] .rgx-compass-unit {
  flex: 0 0 auto;
  margin-left: 1px;
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: var(--compass-unit);
  font-weight: 500;
  letter-spacing: .04em;
  color: var(--compass-muted);
}

.rg-gauge[data-style="compass"] .rgx-compass-over {
  display: none;
  margin-left: 1px;
  color: var(--compass-warn);
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: .6em;
  font-weight: 700;
}

.rg-gauge[data-style="compass"][data-over="1"] .rgx-compass-over {
  display: inline;
}

.rg-gauge[data-style="compass"] .rgx-compass-rows {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 64px;
}

.rg-gauge[data-style="compass"] .rgx-compass-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="compass"] .rgx-compass-tag {
  font-size: var(--compass-tag);
  font-weight: 500;
  letter-spacing: .07em;
  color: var(--compass-muted);
}

.rg-gauge[data-style="compass"] .rgx-compass-num {
  font-size: var(--compass-num);
  font-weight: 600;
  letter-spacing: .005em;
  color: var(--compass-ink);
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="compass"] .rgx-compass-alert {
  margin-left: 2px;
  color: var(--compass-warn);
  font-weight: 700;
}

.rg-gauge[data-style="compass"][data-warn="1"] .rgx-compass-row.is-warn .rgx-compass-tag,
.rg-gauge[data-style="compass"][data-warn="1"] .rgx-compass-row.is-warn .rgx-compass-num {
  color: var(--compass-warn);
}

.rg-gauge[data-style="compass"] .rgx-mini {
  color: var(--compass-ink);
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: 10.5px;
}

.rg-gauge[data-style="compass"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 600;
}

.rg-gauge[data-style="compass"] .rgx-mini-approx {
  width: .85em;
  font-size: .7em;
  opacity: .7;
}

.rg-gauge[data-style="compass"] .rgx-mini-unit,
.rg-gauge[data-style="compass"] .rgx-mini-sep {
  color: var(--compass-muted);
}

.rg-gauge[data-style="compass"] .rgx-mini-ctx.is-warn {
  color: var(--compass-warn);
}
`;
