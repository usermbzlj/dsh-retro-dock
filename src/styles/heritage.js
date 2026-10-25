/**
 * Heritage: brushed bezel, ivory face, fine tick ring and a red-tipped needle.
 * Light palette is warm paper; dark palette is a deep navy instrument face.
 */

export const HERITAGE_CSS = String.raw`
.rg-root[data-style="heritage"] {
  --rg-face-1: #fbf7ee;
  --rg-face-2: #e2dac8;
  --rg-ink: #262b33;
  --rg-muted: rgba(38, 43, 51, .58);
  --rg-track: rgba(38, 43, 51, .16);
  --rg-bezel: rgba(38, 43, 51, .24);
  --rg-bezel-hi: rgba(255, 255, 255, .9);
  --rg-bezel-lo: rgba(38, 43, 51, .06);
  --rg-tick: rgba(38, 43, 51, .52);
  --rg-accent: #3f6fd8;
  --rg-hit: #2f8f78;
  --rg-warn: #c47b2c;
  --rg-needle: #2b3038;
  --rg-tip: #c4553f;
  --rg-glow: transparent;
}

body[data-ds-dark-theme] .rg-root[data-style="heritage"] {
  --rg-face-1: #2a3450;
  --rg-face-2: #10151f;
  --rg-ink: #e9eef8;
  --rg-muted: rgba(233, 238, 248, .62);
  --rg-track: rgba(233, 238, 248, .14);
  --rg-bezel: rgba(233, 238, 248, .22);
  --rg-bezel-hi: rgba(255, 255, 255, .34);
  --rg-bezel-lo: rgba(255, 255, 255, .015);
  --rg-tick: rgba(233, 238, 248, .56);
  --rg-accent: #7aa2ff;
  --rg-hit: #5fd0b4;
  --rg-warn: #f0a35e;
  --rg-needle: #f1f4fa;
  --rg-tip: #ff7a5c;
  --rg-glow: rgba(122, 162, 255, .28);
}

.rg-root[data-style="heritage"] .rg-face-wrap {
  background: radial-gradient(circle at 38% 30%, var(--rg-face-1), var(--rg-face-2) 74%);
  box-shadow:
    inset 0 0 0 1px var(--rg-bezel),
    inset 0 1px 2px rgba(255, 255, 255, .45),
    inset 0 0 9px rgba(38, 43, 51, .10),
    0 2px 5px rgba(0, 0, 0, .18);
}

.rg-root[data-style="heritage"] .rg-face-wrap::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 50%;
  background: conic-gradient(
    from 210deg,
    var(--rg-bezel-hi),
    var(--rg-bezel-lo),
    var(--rg-bezel-hi),
    var(--rg-bezel-lo),
    var(--rg-bezel-hi)
  );
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
  mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
  opacity: .7;
  pointer-events: none;
}

body[data-ds-dark-theme] .rg-root[data-style="heritage"] .rg-face-wrap {
  box-shadow:
    inset 0 0 0 1px var(--rg-bezel),
    inset 0 2px 7px rgba(0, 0, 0, .55),
    inset 0 0 12px rgba(0, 0, 0, .45),
    0 3px 8px rgba(0, 0, 0, .35);
}

.rg-root[data-style="heritage"] .rg-face-wrap::after {
  opacity: .45;
}

body[data-ds-dark-theme] .rg-root[data-style="heritage"] .rg-face-wrap::after {
  opacity: .18;
}

.rg-root[data-style="heritage"] .rg-heritage {
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .16));
}

.rg-root[data-style="heritage"] .rg-heritage-track {
  fill: none;
  stroke: var(--rg-track);
  stroke-width: 1.2;
  stroke-linecap: butt;
}

.rg-root[data-style="heritage"] .rg-heritage-arc {
  fill: none;
  stroke: var(--rg-accent);
  stroke-width: 2.4;
  stroke-linecap: round;
  stroke-dasharray: calc(var(--rg-p, 0) * 0.6667) 100;
  filter: drop-shadow(0 0 calc(1px + var(--rg-over, 0) * 5px) var(--rg-glow));
}

.rg-root[data-style="heritage"] .rg-heritage-inner {
  fill: none;
  stroke: var(--rg-track);
  stroke-width: .4;
  opacity: .55;
}

.rg-root[data-style="heritage"] .rg-heritage-tick {
  stroke: var(--rg-tick);
  stroke-width: .55;
  opacity: .62;
}

.rg-root[data-style="heritage"] .rg-heritage-tick-minor {
  stroke-width: .4;
  opacity: .42;
}

.rg-root[data-style="heritage"] .rg-heritage-red {
  fill: none;
  stroke: var(--rg-warn);
  stroke-width: 1.5;
  stroke-linecap: butt;
  opacity: .7;
}

.rg-root[data-style="heritage"] .rg-heritage-tick-major {
  stroke-width: .9;
  opacity: 1;
}

.rg-root[data-style="heritage"] .rg-heritage-tick-warn {
  stroke: var(--rg-warn);
  stroke-width: .9;
  opacity: .85;
}

.rg-root[data-style="heritage"] .rg-needle-group {
  transform: rotate(calc(150deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 22px 22px;
  transform-box: view-box;
  will-change: transform;
}

.rg-root[data-style="heritage"] .rg-heritage-needle {
  fill: var(--rg-needle);
  filter: drop-shadow(0 1px 1px rgba(0, 0, 0, .28));
}

.rg-root[data-style="heritage"] .rg-heritage-tip {
  fill: var(--rg-tip);
}

.rg-root[data-style="heritage"] .rg-heritage-hub {
  fill: var(--rg-face-2);
  stroke: var(--rg-needle);
  stroke-width: .7;
}

.rg-root[data-style="heritage"] .rg-heritage-hub-core {
  fill: var(--rg-needle);
}

.rg-root[data-style="heritage"] .rg-face-sub {
  background: radial-gradient(circle at 38% 30%, var(--rg-face-1), var(--rg-face-2) 76%);
  box-shadow:
    inset 0 0 0 1px var(--rg-bezel),
    0 1px 3px rgba(0, 0, 0, .16);
}

body[data-ds-dark-theme] .rg-root[data-style="heritage"] .rg-face-sub {
  box-shadow:
    inset 0 0 0 1px var(--rg-bezel),
    inset 0 1px 4px rgba(0, 0, 0, .5);
}

.rg-root[data-style="heritage"] .rg-heritage-sub {
  width: calc(var(--rg-dial) * .68);
  height: calc(var(--rg-dial) * .68);
}

.rg-root[data-style="heritage"] .rg-heritage-sub-track {
  fill: none;
  stroke: var(--rg-track);
  stroke-width: 1.1;
}

.rg-root[data-style="heritage"] .rg-heritage-sub-ctx {
  fill: none;
  stroke: var(--rg-warn);
  stroke-width: 1.7;
  stroke-linecap: round;
  opacity: .9;
}

.rg-root[data-style="heritage"] .rg-heritage-sub-hit-track {
  fill: none;
  stroke: rgba(47, 143, 120, .18);
  stroke-width: .9;
}

body[data-ds-dark-theme] .rg-root[data-style="heritage"] .rg-heritage-sub-hit-track {
  stroke: rgba(95, 208, 180, .16);
}

.rg-root[data-style="heritage"] .rg-heritage-sub-hit {
  fill: none;
  stroke: var(--rg-hit);
  stroke-width: 1.1;
  stroke-linecap: round;
}

.rg-root[data-style="heritage"] .rg-heritage-sub-tick {
  stroke: var(--rg-tick);
  stroke-width: .45;
  opacity: .4;
}

.rg-root[data-style="heritage"] .rg-heritage-sub-hub {
  fill: var(--rg-needle);
  opacity: .7;
}

.rg-root[data-style="heritage"] .rg-rows {
  padding-top: 1px;
}

.rg-root[data-style="heritage"] .rg-tag {
  font-size: 8.5px;
  letter-spacing: .16em;
}

.rg-root[data-style="heritage"] .rg-num {
  font-size: 10.5px;
  font-weight: 600;
}

.rg-root[data-style="heritage"] .rg-value {
  font-weight: 600;
  letter-spacing: -.02em;
}
`;
