/**
 * The classic dual-dial instrument. One visual style, two host themes.
 *
 * Light is the default token set; a host with `[data-ds-dark-theme]` swaps
 * ink, accent, caution and cache colours. The gauge never paints its own
 * surface, so it must stay readable on the host composer in both modes.
 */

export const CLASSIC_CSS = String.raw`
.rg-gauge {
  --rg-ink: var(--dsw-alias-label-primary, #17181a);
  --rg-muted: #5e636b;
  --rg-hairline: var(--dsw-alias-border-l3, rgba(23, 24, 26, .2));
  --rg-track: var(--dsw-alias-border-l3, rgba(23, 24, 26, .14));
  --rg-tick: rgba(23, 24, 26, .46);
  --rg-accent: #2f5bc0;
  --rg-caution: #b45309;
  --rg-caution-strong: #b45309;
  --rg-ctx: var(--rg-muted);
  --rg-hit: #0f766e;
  --rg-over-color: #0f766e;
  --rg-over-glow: rgba(15, 118, 110, .32);
  --rg-focus: var(--dsw-focus-ring-color, #2f5bc0);
  --rg-size: 56px;
  --rg-value-size: 18px;
  --rg-unit-size: 10px;
  --rg-tag-size: 10px;
  --rg-num-size: 12px;
  --rg-meta-size: 10px;
  --rg-flag-size: 8px;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--rg-size) * 0.36);
  height: calc(var(--rg-size) + 8px);
  margin: 0 12px 0 2px;
  padding: 0;
  border-radius: 12px;
  flex: 0 0 auto;
  position: relative;
  font-variant-numeric: tabular-nums;
  color: var(--rg-ink);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  transition: box-shadow .16s ease;
}

[data-ds-dark-theme] .rg-gauge {
  --rg-ink: #e8eefc;
  --rg-muted: rgba(232, 238, 252, .66);
  --rg-hairline: rgba(232, 238, 252, .22);
  --rg-track: rgba(232, 238, 252, .16);
  --rg-tick: rgba(232, 238, 252, .5);
  --rg-accent: #7aa2ff;
  --rg-caution: #ffb28a;
  --rg-caution-strong: #ff9d7a;
  --rg-ctx: rgba(232, 238, 252, .66);
  --rg-hit: #74d6c0;
  --rg-over-color: #b8fff5;
  --rg-over-glow: rgba(95, 224, 207, .5);
  --rg-focus: var(--dsw-focus-ring-color, #7aa2ff);
}

.rg-gauge:not([data-static="1"]):hover {
  box-shadow: 0 0 0 1px var(--rg-hairline);
}

.rg-gauge:focus-visible {
  outline: 2px solid var(--rg-focus);
  outline-offset: 3px;
}

.rg-gauge[data-variant="input"][data-density="full"] { --rg-size: 56px; --rg-value-size: 18px; }
.rg-gauge[data-variant="input"][data-density="compact"] { --rg-size: 50px; --rg-value-size: 16px; }
.rg-gauge[data-variant="input"][data-density="minimal"] { --rg-size: 44px; --rg-value-size: 15px; }
.rg-gauge[data-variant="dock"][data-density="full"] { --rg-size: 42px; --rg-value-size: 16px; }
.rg-gauge[data-variant="dock"][data-density="compact"] { --rg-size: 38px; --rg-value-size: 15px; }
.rg-gauge[data-variant="dock"][data-density="minimal"] { --rg-size: 38px; --rg-value-size: 14px; }

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
  stroke: var(--rg-track);
  stroke-width: 2.5;
  stroke-linecap: butt;
}

.rg-arc {
  fill: none;
  stroke: var(--rg-accent);
  stroke-width: 2.5;
  stroke-linecap: round;
}

.rg-arc-rate {
  stroke: color-mix(in srgb, var(--rg-accent) calc((1 - var(--rg-over, 0)) * 100%), var(--rg-over-color));
  stroke-dasharray: calc(var(--rg-p, 0) * 0.712) 107;
  filter: drop-shadow(0 0 calc(min(1, var(--rg-over, 0) * 3) * 5px) var(--rg-over-glow));
}

.rg-ticks line {
  stroke: var(--rg-tick);
  stroke-width: .9;
  vector-effect: non-scaling-stroke;
}

.rg-ticks .rg-tick-end {
  stroke: color-mix(in srgb, var(--rg-ink) 78%, transparent);
  stroke-width: 1.4;
}

.rg-needle-group {
  transform: rotate(calc(150deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 20px 20px;
  transform-box: view-box;
  will-change: transform;
}

.rg-needle {
  stroke: var(--rg-ink);
  stroke-width: 1.4;
  stroke-linecap: round;
  filter: drop-shadow(0 0 1.5px color-mix(in srgb, var(--rg-ink) 26%, transparent));
}

.rg-hub {
  fill: var(--rg-ink);
}

.rg-dial-minor .rg-track,
.rg-dial-minor .rg-arc {
  stroke-width: 1.6;
  vector-effect: non-scaling-stroke;
}

.rg-dial-minor .rg-track {
  stroke-width: 1.2;
}

.rg-dial-minor .rg-arc-ctx,
.rg-dial-minor .rg-arc-ctx-warn {
  stroke-linecap: round;
}

.rg-dial-minor .rg-arc-hit {
  stroke-width: 1.4;
  stroke-linecap: round;
}

.rg-arc-ctx {
  stroke: var(--rg-ctx);
}

.rg-arc-ctx-warn {
  stroke: var(--rg-caution-strong);
}

.rg-redline {
  stroke: var(--rg-caution-strong);
  stroke-width: 1.5;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.rg-track-hit {
  stroke: color-mix(in srgb, var(--rg-hit) 18%, transparent);
  stroke-width: 1.2;
  vector-effect: non-scaling-stroke;
}

.rg-arc-hit {
  stroke: var(--rg-hit);
  stroke-width: 1.4;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.rg-gauge[data-warn="1"] .rg-row-ctx .rg-num {
  color: var(--rg-caution);
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
  display: inline-flex;
  align-items: baseline;
  min-width: 0;
  font-family: inherit;
  font-size: var(--rg-value-size);
  font-weight: 600;
  letter-spacing: -.01em;
  line-height: 1;
  color: var(--rg-ink);
  font-variant-numeric: tabular-nums;
}

.rg-approx {
  display: inline-block;
  width: .92em;
  margin-right: .02em;
  font-size: .64em;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  opacity: .68;
}

.rg-digits {
  display: inline-block;
  min-width: 3ch;
  text-align: left;
  font-variant-numeric: tabular-nums;
}

.rg-unit {
  font-size: var(--rg-unit-size);
  font-weight: 500;
  letter-spacing: .1em;
  color: var(--rg-muted);
  line-height: 1;
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
  font-size: var(--rg-tag-size);
  font-weight: 500;
  letter-spacing: .08em;
  color: var(--rg-muted);
}

.rg-num {
  margin-left: auto;
  font-size: var(--rg-num-size);
  font-weight: 600;
  letter-spacing: .01em;
  color: var(--rg-ink);
}

.rg-meta {
  display: none;
  align-items: baseline;
  gap: 6px;
  margin-top: 0;
  font-size: var(--rg-meta-size);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: .03em;
  color: var(--rg-muted);
  white-space: nowrap;
}

.rg-meta b {
  font-weight: 600;
  color: var(--rg-ink);
}

.rg-gauge[data-density="minimal"] .rg-module-minor { display: none; }
.rg-gauge[data-density="minimal"] .rg-meta { display: inline-flex; }

.rg-gauge[data-warn="1"] .rg-meta-ctx {
  color: var(--rg-caution);
}

.rg-alert {
  color: var(--rg-caution);
  font-weight: 700;
  margin-right: 2px;
}

.rg-tag .rg-alert {
  margin-left: 3px;
  margin-right: 0;
}

.rg-quality {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 13px;
  padding: 0 4px;
  border: 1px solid currentColor;
  border-radius: 3px;
  color: var(--rg-muted);
  font-size: var(--rg-flag-size);
  font-weight: 600;
  letter-spacing: .05em;
  line-height: 1;
  flex: 0 0 auto;
}

.rg-quality[data-quality="stale"] {
  color: var(--rg-caution);
}

.rg-quality[data-quality="dom"],
.rg-quality[data-quality="mixed"] {
  color: var(--rg-muted);
}

.rg-affordance {
  display: none;
  position: absolute;
  top: -2px;
  right: -6px;
  color: var(--rg-muted);
  font-size: 10px;
  line-height: 1;
  opacity: .8;
  pointer-events: none;
}

@media (hover: none) {
  .rg-affordance {
    display: inline-block;
  }
}

.rg-gauge[data-stale="1"] .rg-dial {
  opacity: .48;
}

.rg-gauge[data-stale="1"] .rg-value,
.rg-gauge[data-stale="1"] .rg-unit,
.rg-gauge[data-stale="1"] .rg-num,
.rg-gauge[data-stale="1"] .rg-meta {
  opacity: 1;
}

/* input-dock variant: centered above the composer */
.rg-gauge[data-variant="input"] {
  display: flex;
  width: max-content;
  margin: 4px auto;
}

/* static previews: no pointer affordance, no focus ring */
.rg-gauge[data-static="1"] {
  cursor: default;
  pointer-events: none;
}

.rg-gauge [hidden] { display: none !important; }

@media (prefers-reduced-motion: reduce) {
  .rg-gauge {
    transition: none;
  }
}
`;
