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
  --rg-over-color: var(--rg-ink);
  --rg-focus: var(--dsw-focus-ring-color, #2f5bc0);
  --rg-size: 56px;
  --rg-value-size: 18px;
  --rg-unit-size: 10px;
  --rg-tag-size: 10px;
  --rg-num-size: 12px;
  --rg-meta-size: 10px;
  --rg-flag-size: 10px;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--rg-size) * 0.3);
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
  --rg-over-color: #e8eefc;
  --rg-focus: var(--dsw-focus-ring-color, #7aa2ff);
}

.rg-gauge:not([data-static="1"]):hover {
  box-shadow: 0 0 0 1px var(--rg-hairline);
}

.rg-gauge:focus-visible {
  outline: 2px solid var(--rg-focus);
  outline-offset: 3px;
}

.rg-gauge[data-variant="input"][data-density="full"] { --rg-size: 64px; --rg-value-size: 21px; }
.rg-gauge[data-variant="input"][data-density="compact"] { --rg-size: 56px; --rg-value-size: 18px; }
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

/* 圆头描边在长度为 0 时会留下一个点：指针归零后让弧段淡出。
 * 过速时沿弧加一圈随 --rg-over 增强的辉光。 */
.rg-arc-rate {
  stroke: var(--rg-accent);
  stroke-dasharray: calc(var(--rg-p, 0) * 0.712) 107;
  opacity: clamp(0, calc(var(--rg-p, 0) * 1.5), 1);
  filter: drop-shadow(0 0 calc(var(--rg-over, 0) * 2.4px) var(--rg-accent));
}

.rg-ticks line {
  stroke: var(--rg-tick);
  stroke-width: .9;
  vector-effect: non-scaling-stroke;
}

.rg-ticks .rg-tick-minor {
  stroke-width: .7;
  opacity: .62;
}

/* 均速标记：量程环外的小三角，随均速变化平滑移动 */
.rg-hold {
  transform-origin: 20px 20px;
  transform-box: view-box;
  transition: transform .5s cubic-bezier(.2, .7, .2, 1);
}

.rg-hold polygon {
  fill: color-mix(in srgb, var(--rg-accent) 70%, var(--rg-muted));
}

.rg-gauge[data-hold="1"] .rg-hold polygon {
  fill: var(--rg-accent);
}

.rg-ticks .rg-tick-end {
  stroke: color-mix(in srgb, var(--rg-ink) 78%, transparent);
  stroke-width: 1.4;
}

.rg-gauge[data-over="1"] .rg-ticks .rg-tick-end {
  stroke: var(--rg-ink);
  stroke-width: 2;
}

.rg-needle-group {
  transform: rotate(calc(150deg + var(--rg-p, 0) * 2.4deg));
  transform-origin: 20px 20px;
  transform-box: view-box;
  will-change: transform;
}

/* 锥形针身 + 配重尾；轴帽是一粒强调色，像表芯的宝石轴承 */
.rg-needle {
  fill: var(--rg-ink);
  filter: drop-shadow(0 .4px .6px color-mix(in srgb, #000 30%, transparent));
}

.rg-needle-tail {
  fill: var(--rg-ink);
  opacity: .72;
}

.rg-hub {
  fill: var(--rg-ink);
}

.rg-hub-cap {
  fill: var(--rg-accent);
}

.rg-gauge[data-live="0"] .rg-hub-cap {
  fill: var(--rg-muted);
}

.rg-dial-minor .rg-track,
.rg-dial-minor .rg-arc {
  stroke-width: 1.6;
  vector-effect: non-scaling-stroke;
}

.rg-dial-minor .rg-track {
  stroke-width: 1.2;
}

.rg-dial-minor .rg-track.is-unknown {
  stroke-dasharray: 1.6 2.2;
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

/* 读数右对齐：个位和单位的右缘固定，位数变化只向左长，不推动副表 */
.rg-read {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  line-height: 1;
}

.rg-value {
  position: relative;
  display: inline-flex;
  align-items: baseline;
  justify-content: flex-end;
  /* 三位数字 + ≈ 槽位的宽度 */
  min-width: calc(3ch + .6em);
  transition: color .3s ease;
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
  text-align: right;
  font-variant-numeric: tabular-nums;
}

/* 空闲的 0 不该是整块仪表最亮的东西；保留的均速稍亮一档 */
.rg-gauge[data-live="0"] .rg-value {
  color: var(--rg-muted);
}

.rg-gauge[data-hold="1"] .rg-value {
  color: color-mix(in srgb, var(--rg-ink) 78%, transparent);
}

.rg-gauge[data-hold="1"] .rg-unit {
  color: var(--rg-accent);
}

/* 过速的 + 挂在个位右侧，不占读数宽度 */
.rg-over-mark {
  position: absolute;
  left: 100%;
  top: -.18em;
  margin-left: 1px;
  font-size: .58em;
  color: var(--rg-caution-strong);
  font-weight: 700;
}

.rg-unit {
  font-size: var(--rg-unit-size);
  font-weight: 500;
  letter-spacing: 0;
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
  letter-spacing: 0;
  color: var(--rg-muted);
}

/* HIT 标签带一点内环的青色，充当图例：哪一环是哪个读数一眼可辨 */
.rg-row-hit .rg-tag {
  color: color-mix(in srgb, var(--rg-hit) 72%, var(--rg-muted));
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
  gap: 10px;
  margin-top: 0;
  font-size: var(--rg-meta-size);
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: 0;
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
  height: 15px;
  padding: 0 3px;
  border: 1px solid currentColor;
  border-radius: 3px;
  color: var(--rg-muted);
  font-size: var(--rg-flag-size);
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  flex: 0 0 auto;
}

.rg-quality[data-quality="stale"] {
  color: var(--rg-muted);
  border-style: dashed;
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

.rg-gauge:hover .rg-affordance,
.rg-gauge:focus-visible .rg-affordance {
  display: inline-block;
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
  .rg-gauge,
  .rg-gauge .rg-hold,
  .rg-gauge .rg-value {
    transition: none;
  }
}
`;
