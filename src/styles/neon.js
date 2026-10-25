/**
 * Neon HUD: a dark screen, segmented tick ring, gradient arc and an endpoint
 * bloom. Light mode becomes a daylight HUD instead of a washed-out dark one.
 */

export const NEON_CSS = String.raw`
.rg-root[data-style="neon"] {
  --rg-screen-1: #eef4ff;
  --rg-screen-2: #dce8fc;
  --rg-ink: #0d1726;
  --rg-muted: rgba(13, 23, 38, .60);
  --rg-accent: #0066ff;
  --rg-accent-2: #6a3cf0;
  --rg-track: rgba(0, 102, 255, .22);
  --rg-grid: rgba(0, 102, 255, .35);
  --rg-hit: #0b8f7c;
  --rg-warn: #c06f1c;
  --rg-glow: rgba(0, 102, 255, .32);
  --rg-screen-shadow:
    inset 0 0 16px rgba(0, 102, 255, .12),
    0 0 0 1px rgba(0, 102, 255, .26),
    0 0 18px rgba(0, 102, 255, .08);
}

body[data-ds-dark-theme] .rg-root[data-style="neon"] {
  --rg-screen-1: #0a1626;
  --rg-screen-2: #03070f;
  --rg-ink: #d9f7ff;
  --rg-muted: rgba(214, 247, 255, .58);
  --rg-accent: #5ee7ff;
  --rg-accent-2: #b07bff;
  --rg-track: rgba(94, 231, 255, .16);
  --rg-grid: rgba(94, 231, 255, .30);
  --rg-hit: #4de0c0;
  --rg-warn: #ffb454;
  --rg-glow: rgba(94, 231, 255, .55);
  --rg-screen-shadow:
    inset 0 0 16px rgba(94, 231, 255, .14),
    0 0 0 1px rgba(94, 231, 255, .22),
    0 0 16px rgba(94, 231, 255, .10);
}

.rg-root[data-style="neon"] .rg-screen {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--rg-dial);
  height: var(--rg-dial);
  border-radius: 50%;
  flex: 0 0 auto;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 40%, color-mix(in srgb, var(--rg-accent) 14%, transparent), transparent 62%),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, .05) 0 1px, transparent 1px 3px),
    radial-gradient(circle at 50% 50%, var(--rg-screen-1), var(--rg-screen-2) 74%);
  box-shadow: var(--rg-screen-shadow);
}

body[data-ds-dark-theme] .rg-root[data-style="neon"] .rg-screen {
  background:
    radial-gradient(circle at 50% 40%, rgba(94, 231, 255, .16), transparent 62%),
    repeating-linear-gradient(180deg, rgba(255, 255, 255, .035) 0 1px, transparent 1px 3px),
    radial-gradient(circle at 50% 50%, var(--rg-screen-1), var(--rg-screen-2) 74%);
}

.rg-root[data-style="neon"] .rg-screen::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: repeating-linear-gradient(180deg, rgba(3, 8, 18, .22) 0 1px, transparent 1px 3px);
  opacity: .35;
  pointer-events: none;
}

body[data-ds-dark-theme] .rg-root[data-style="neon"] .rg-screen::after {
  opacity: .5;
}

.rg-root[data-style="neon"] .rg-neon {
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 2px var(--rg-glow));
}

.rg-root[data-style="neon"] .rg-neon-track {
  fill: none;
  stroke: var(--rg-track);
  stroke-width: 2.6;
  stroke-linecap: round;
}

.rg-root[data-style="neon"] .rg-neon-grad-a {
  stop-color: var(--rg-accent);
}

.rg-root[data-style="neon"] .rg-neon-grad-b {
  stop-color: var(--rg-accent);
  stop-opacity: .85;
}

.rg-root[data-style="neon"] .rg-neon-grad-c {
  stop-color: var(--rg-accent-2);
}

.rg-root[data-style="neon"] .rg-neon-arc {
  fill: none;
  stroke: var(--rg-accent);
  stroke-width: 2.6;
  stroke-linecap: round;
  stroke-dasharray: calc(var(--rg-p, 0) * 0.6667) 100;
  filter: drop-shadow(0 0 calc(3px + var(--rg-over, 0) * 6px) var(--rg-glow));
}

.rg-root[data-style="neon"] .rg-neon-tick {
  stroke: var(--rg-grid);
  stroke-width: .5;
  opacity: .75;
}

.rg-root[data-style="neon"] .rg-neon-tick-major {
  stroke: var(--rg-accent);
  stroke-width: .8;
  opacity: .8;
}

.rg-root[data-style="neon"] .rg-neon-inner {
  fill: none;
  stroke: color-mix(in srgb, var(--rg-accent) 40%, transparent);
  stroke-width: .4;
  opacity: .35;
}

.rg-root[data-style="neon"] .rg-neon-end-group {
  transform: rotate(calc(240deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 22px 22px;
  transform-box: view-box;
  will-change: transform;
}

.rg-root[data-style="neon"] .rg-neon-end {
  fill: var(--rg-accent-2);
  filter: drop-shadow(0 0 3px var(--rg-accent-2));
}

.rg-root[data-style="neon"] .rg-neon-end-core {
  fill: #fff;
}

.rg-root[data-style="neon"][data-live="1"] .rg-neon-end {
  animation: rg-neon-pulse 1.7s ease-in-out infinite;
}

@keyframes rg-neon-pulse {
  0%, 100% { opacity: .72; }
  50% { opacity: 1; }
}

.rg-root[data-style="neon"] .rg-screen-sub {
  width: calc(var(--rg-dial) * .68);
  height: calc(var(--rg-dial) * .68);
}

.rg-root[data-style="neon"] .rg-neon-sub-track {
  fill: none;
  stroke: var(--rg-track);
  stroke-width: 1.6;
}

.rg-root[data-style="neon"] .rg-neon-sub-ctx {
  fill: none;
  stroke: var(--rg-warn);
  stroke-width: 1.8;
  stroke-linecap: round;
  filter: drop-shadow(0 0 2px color-mix(in srgb, var(--rg-warn) 50%, transparent));
}

.rg-root[data-style="neon"] .rg-neon-sub-hit-track {
  fill: none;
  stroke: color-mix(in srgb, var(--rg-hit) 18%, transparent);
  stroke-width: .9;
}

.rg-root[data-style="neon"] .rg-neon-sub-hit {
  fill: none;
  stroke: var(--rg-hit);
  stroke-width: 1.1;
  stroke-linecap: round;
  filter: drop-shadow(0 0 2px color-mix(in srgb, var(--rg-hit) 55%, transparent));
}

.rg-root[data-style="neon"] .rg-neon-sub-core {
  fill: var(--rg-accent);
  opacity: .6;
}

.rg-root[data-style="neon"] .rg-value {
  font-family: var(--ds-font-family-code, ui-monospace, "Cascadia Mono", Consolas, monospace);
  font-weight: 600;
  letter-spacing: .02em;
  color: var(--rg-ink);
  text-shadow: 0 0 8px color-mix(in srgb, var(--rg-accent) 35%, transparent);
}

body:not([data-ds-dark-theme]) .rg-root[data-style="neon"] .rg-value {
  text-shadow: none;
}

.rg-root[data-style="neon"] .rg-unit {
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  letter-spacing: .2em;
  color: var(--rg-muted);
}

.rg-root[data-style="neon"] .rg-tag {
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  font-size: 8.5px;
  letter-spacing: .12em;
}

.rg-root[data-style="neon"] .rg-num {
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  font-size: 10.5px;
  color: var(--rg-ink);
}

.rg-root[data-style="neon"] .rg-num::before {
  content: "[";
  opacity: .45;
  margin-right: 2px;
}

.rg-root[data-style="neon"] .rg-num::after {
  content: "]";
  opacity: .45;
  margin-left: 2px;
}

.rg-root[data-style="neon"] .rg-row-ctx .rg-num {
  color: var(--rg-warn);
}

.rg-root[data-style="neon"] .rg-row-hit .rg-num {
  color: var(--rg-hit);
}
`;
