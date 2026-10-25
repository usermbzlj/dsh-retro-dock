/**
 * The pre-1.1.0 gauge, restored as the only visual style. The measurement,
 * calibration and performance work from 1.1.0 stays; this file only owns the
 * original single-dial look.
 */

export const CLASSIC_CSS = String.raw`
.rg-gauge {
  --rg-accent: #7aa2ff;
  --rg-warn: #e0a878;
  --rg-size: 56px;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--rg-size) * 0.42);
  height: calc(var(--rg-size) + 8px);
  margin: 0 14px 0 2px;
  padding: 0;
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.rg-gauge:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, #7aa2ff);
  outline-offset: 2px;
}

.rg-gauge[data-variant="input"][data-density="full"] { --rg-size: 56px; }
.rg-gauge[data-variant="input"][data-density="compact"] { --rg-size: 50px; }
.rg-gauge[data-variant="input"][data-density="minimal"] { --rg-size: 44px; }
.rg-gauge[data-variant="dock"][data-density="full"] { --rg-size: 42px; }
.rg-gauge[data-variant="dock"][data-density="compact"] { --rg-size: 38px; }
.rg-gauge[data-variant="dock"][data-density="minimal"] { --rg-size: 38px; }

.rg-module {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--rg-size) * 0.13);
}

.rg-dial {
  display: block;
  width: var(--rg-size);
  height: var(--rg-size);
  flex: 0 0 auto;
  overflow: visible;
}

.rg-dial-minor {
  width: calc(var(--rg-size) * 0.68);
  height: calc(var(--rg-size) * 0.68);
}

.rg-track {
  fill: none;
  stroke: rgba(232, 238, 252, .16);
  stroke-width: 2.5;
  stroke-linecap: butt;
}

.rg-arc {
  fill: none;
  stroke: var(--rg-arc-color, var(--rg-accent));
  stroke-width: 2.5;
  stroke-linecap: round;
}

.rg-arc-rate {
  stroke: var(--rg-accent);
  stroke: color-mix(in srgb, var(--rg-accent) calc((1 - var(--rg-over, 0)) * 100%), #b8fff5);
  stroke-dasharray: calc(var(--rg-p, 0) * 0.712) 107;
}

.rg-ticks line {
  stroke: rgba(232, 238, 252, .5);
  stroke-width: .7;
}

.rg-needle-group {
  transform: rotate(calc(150deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 20px 20px;
}

.rg-needle {
  stroke: #e8eefc;
  stroke-width: 1.4;
  stroke-linecap: round;
  filter: brightness(.9) drop-shadow(0 0 1.5px rgba(255, 255, 255, calc(.22 - var(--rg-over, 0) * .22)));
}

.rg-hub {
  fill: #e8eefc;
  filter: brightness(.88);
}

.rg-dial-minor .rg-track,
.rg-dial-minor .rg-arc {
  stroke-width: 2.5;
}

.rg-dial-minor .rg-track {
  stroke: rgba(232, 238, 252, .13);
  stroke-width: 1.5;
}

.rg-dial-minor .rg-arc-ctx {
  stroke-width: 1.5;
  stroke-linecap: round;
}

.rg-dial-minor .rg-arc-hit {
  stroke-width: 1px;
  stroke-linecap: round;
}

.rg-arc-ctx {
  stroke: var(--rg-warn);
}

.rg-gauge[data-warn="1"] .rg-arc-ctx {
  stroke: #ff9d7a;
}

.rg-gauge[data-warn="1"] .rg-row:first-child .rg-num {
  color: #ffb28a;
}

/* overspeed shows up as a warm halo rather than a hue shift */
.rg-arc-rate {
  filter: drop-shadow(0 0 calc(min(1, var(--rg-over, 0) * 3) * 5px) rgba(95, 224, 207, calc(min(1, var(--rg-over, 0) * 3) * 0.5)));
}

.rg-track-hit {
  stroke: rgba(116, 214, 192, .16);
  stroke-width: 1;
}

.rg-arc-hit {
  stroke: #74d6c0;
  stroke-width: 1;
  stroke-linecap: round;
}

.rg-read {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px;
  line-height: 1;
}

.rg-value {
  display: inline-block;
  min-width: 3.6ch;
  text-align: left;
  font-family: inherit;
  font-size: max(16px, calc(var(--rg-size) * 0.31));
  font-weight: 600;
  letter-spacing: .01em;
  color: #e8eefc;
}

.rg-unit {
  font-size: max(10px, calc(var(--rg-size) * 0.12));
  font-weight: 500;
  letter-spacing: .12em;
  color: rgba(232, 238, 252, .66);
}

.rg-read-minor {
  display: flex;
  flex-direction: column;
  gap: 5px;
  line-height: 1;
}

.rg-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: calc(var(--rg-size) * 0.62);
}

.rg-tag {
  font-size: max(10px, calc(var(--rg-size) * 0.12));
  font-weight: 500;
  letter-spacing: .1em;
  color: rgba(232, 238, 252, .66);
}

.rg-num {
  margin-left: auto;
  font-size: max(12px, calc(var(--rg-size) * 0.19));
  font-weight: 600;
  letter-spacing: .01em;
  color: #e8eefc;
}

/* input-dock variant: centered above the composer */
.rg-gauge[data-variant="input"] {
  display: flex;
  width: max-content;
  margin: 6px auto;
}

/* density: when space is tight the sub dial folds into text */
.rg-meta {
  display: none;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
  font-size: max(10px, calc(var(--rg-size) * 0.13));
  font-weight: 500;
  letter-spacing: .06em;
  color: rgba(232, 238, 252, .72);
}

.rg-meta b { font-weight: 600; color: rgba(232, 238, 252, .78); }

.rg-gauge[data-density="minimal"] .rg-module-minor { display: none; }
.rg-gauge[data-density="minimal"] .rg-meta { display: flex; }
.rg-gauge[data-stale="1"] .rg-value,
.rg-gauge[data-stale="1"] .rg-unit { opacity: .45; }

.rg-gauge [hidden] { display: none !important; }

/* static previews: no pointer affordance, no focus ring */
.rg-gauge[data-static="1"] {
  cursor: default;
  pointer-events: none;
}
`;
