/**
 * Minimal: no face, no ticks, a hairline arc with a single endpoint dot and
 * generous negative space. Accent and text ride the host theme tokens.
 */

export const MINIMAL_CSS = String.raw`
.rg-root[data-style="minimal"] {
  --rg-accent: var(--dsw-alias-state-business-primary, #3f6fd8);
  --rg-hit: var(--dsw-alias-state-success-primary, #2f9e74);
  --rg-warn: var(--dsw-alias-state-warn-primary, #d9822b);
  --rg-track: var(--dsw-alias-border-l3, rgba(127, 130, 135, .28));
  --rg-ink: var(--dsw-alias-label-primary, #1b1b1c);
  --rg-muted: var(--dsw-alias-label-tertiary, rgba(27, 27, 28, .55));
}

.rg-root[data-style="minimal"][data-placement="input"][data-density="full"] {
  --rg-dial: 58px;
}

.rg-root[data-style="minimal"] .rg-minimal {
  filter: none;
}

.rg-root[data-style="minimal"] .rg-minimal-track {
  fill: none;
  stroke: var(--rg-track);
  stroke-width: 1;
  stroke-linecap: round;
}

.rg-root[data-style="minimal"] .rg-minimal-arc {
  fill: none;
  stroke: var(--rg-accent);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-dasharray: calc(var(--rg-p, 0) * 0.6667) 100;
}

.rg-root[data-style="minimal"] .rg-minimal-dot-group {
  transform: rotate(calc(240deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 22px 22px;
  transform-box: view-box;
  will-change: transform;
}

.rg-root[data-style="minimal"] .rg-minimal-dot {
  fill: var(--rg-accent);
}

.rg-root[data-style="minimal"] .rg-value {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -.035em;
}

.rg-root[data-style="minimal"][data-density="full"][data-placement="dock"] .rg-value {
  font-size: 20px;
}

.rg-root[data-style="minimal"][data-density="compact"] .rg-value {
  font-size: 19px;
}

.rg-root[data-style="minimal"][data-density="minimal"] .rg-value {
  font-size: 16px;
}

.rg-root[data-style="minimal"] .rg-unit {
  font-size: 8.5px;
  letter-spacing: .2em;
  opacity: .8;
}

.rg-root[data-style="minimal"] .rg-rows {
  gap: 7px;
  min-width: 128px;
}

.rg-root[data-style="minimal"] .rg-row {
  display: grid;
  grid-template-columns: 24px minmax(52px, 1fr) 40px;
  align-items: center;
  gap: 7px;
}

.rg-root[data-style="minimal"] .rg-tag {
  font-size: 8px;
  letter-spacing: .18em;
  font-weight: 600;
}

.rg-root[data-style="minimal"] .rg-line {
  display: block;
  height: 1.5px;
  border-radius: 999px;
  background: var(--rg-track);
  overflow: hidden;
}

.rg-root[data-style="minimal"] .rg-line i {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--rg-warn);
  transition: width .35s cubic-bezier(.4, 0, .2, 1);
}

.rg-root[data-style="minimal"] .rg-row-hit .rg-line i {
  background: var(--rg-hit);
}

.rg-root[data-style="minimal"] .rg-num {
  margin: 0;
  font-size: 10.5px;
  font-weight: 500;
  text-align: right;
  letter-spacing: .01em;
}

.rg-root[data-style="minimal"][data-warn="1"] .rg-row-ctx .rg-line i {
  background: var(--rg-warn);
}

.rg-root[data-style="minimal"][data-warn="1"] .rg-row-ctx .rg-num {
  color: var(--rg-warn);
}

.rg-root[data-style="minimal"] .rg-inline {
  font-size: 9px;
  letter-spacing: .12em;
}

.rg-root[data-style="minimal"] .rg-inline b {
  font-weight: 500;
}
`;
