/**
 * Shared layout and typography. Style modules add their own palette, face and
 * instrument drawing; everything here is structural and theme-token driven.
 */

export const BASE_CSS = String.raw`
.rg-root {
  --rg-dial: 56px;
  --rg-gap: 9px;
  --rg-accent: var(--dsw-alias-state-business-primary, #4d93f8);
  --rg-ink: var(--dsw-alias-label-primary, #e8eefc);
  --rg-muted: var(--dsw-alias-label-tertiary, rgba(232, 238, 252, .62));
  --rg-line: var(--dsw-alias-border-l3, rgba(232, 238, 252, .2));
  --rg-track: var(--dsw-alias-border-l3, rgba(232, 238, 252, .18));
  --rg-warn: var(--dsw-alias-state-warn-primary, #f59e0b);
  --rg-hit: #5fd0b4;
  --rg-radius: 12px;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  position: relative;
  font-family: var(--dsw-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", "Microsoft YaHei", sans-serif);
  font-variant-numeric: tabular-nums;
  color: var(--rg-ink);
  line-height: 1;
  -webkit-user-select: none;
  user-select: none;
}

.rg-root[data-placement="input"] {
  display: flex;
  width: 100%;
  justify-content: center;
  margin: 4px 0 6px;
}

.rg-root[data-placement="dock"] {
  margin: 0 10px 0 2px;
}

.rg-frame {
  position: relative;
  display: inline-flex;
  align-items: center;
  border-radius: var(--rg-radius);
}

.rg-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--rg-gap);
  margin: 0;
  padding: 2px 3px 2px 1px;
  border: 0;
  border-radius: var(--rg-radius);
  background: transparent;
  color: inherit;
  font: inherit;
  line-height: 1;
  text-align: left;
  cursor: pointer;
}

.rg-toggle:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--rg-accent));
  outline-offset: 3px;
}

.rg-dial {
  display: block;
  width: var(--rg-dial);
  height: var(--rg-dial);
  flex: 0 0 auto;
  overflow: visible;
}

.rg-read {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  min-width: 4.2ch;
}

.rg-value {
  display: inline-flex;
  align-items: baseline;
  font-size: 20px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -.015em;
  color: var(--rg-ink);
  font-variant-numeric: tabular-nums;
}

.rg-approx {
  margin-right: .06em;
  font-size: .62em;
  font-weight: 500;
  opacity: .55;
}

.rg-unit {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--rg-muted);
}

.rg-sub {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
}

.rg-face-wrap {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--rg-dial);
  height: var(--rg-dial);
  border-radius: 50%;
  flex: 0 0 auto;
}

.rg-face-wrap::after {
  content: "";
  position: absolute;
  inset: 5% 9% 54% 9%;
  border-radius: 50%;
  background: linear-gradient(180deg, rgba(255, 255, 255, .34), rgba(255, 255, 255, 0));
  opacity: .55;
  filter: blur(1px);
  pointer-events: none;
}

.rg-face-sub .rg-dial,
.rg-screen-sub .rg-dial {
  width: 100%;
  height: 100%;
}

.rg-face-sub::after {
  opacity: .25;
}

.rg-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 62px;
}

.rg-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.rg-tag {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: .14em;
  color: var(--rg-muted);
}

.rg-num {
  margin-left: auto;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
  color: var(--rg-ink);
  font-variant-numeric: tabular-nums;
}

.rg-root[data-warn="1"] .rg-row-ctx .rg-num {
  color: var(--rg-warn);
}

.rg-root[data-stale="1"] .rg-value,
.rg-root[data-stale="1"] .rg-unit,
.rg-root[data-stale="1"] .rg-rows {
  opacity: .45;
}

.rg-inline {
  display: none;
  align-items: baseline;
  gap: 6px;
  font-size: 10px;
  letter-spacing: .04em;
  color: var(--rg-muted);
}

.rg-inline b {
  font-weight: 600;
  color: var(--rg-ink);
}

.rg-inline .rg-sep {
  opacity: .45;
}

.rg-gear {
  position: absolute;
  top: -6px;
  right: -6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--rg-muted);
  cursor: pointer;
  opacity: 0;
  transition: opacity .16s ease, background .16s ease, color .16s ease;
}

.rg-gear:hover {
  color: var(--rg-ink);
  background: var(--dsw-alias-interactive-bg-hover, rgba(255, 255, 255, .08));
}

.rg-gear:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--rg-accent));
  outline-offset: 1px;
  opacity: 1;
}

.rg-frame:hover .rg-gear,
.rg-frame:focus-within .rg-gear,
.rg-root[data-open="1"] .rg-gear,
.rg-root[data-touch="1"] .rg-gear {
  opacity: .85;
}

.rg-root[data-static="1"] .rg-gear {
  display: none;
}

.rg-root[data-static="1"] .rg-toggle {
  cursor: default;
  pointer-events: none;
}

/* density: full -> compact (sub dial folds) -> minimal (readouts fold) */
.rg-root[data-density="compact"] {
  --rg-dial: 46px;
  --rg-gap: 7px;
}

.rg-root[data-density="compact"] .rg-value {
  font-size: 17px;
}

.rg-root[data-density="compact"] .rg-sub {
  display: none;
}

.rg-root[data-density="minimal"] {
  --rg-dial: 40px;
  --rg-gap: 6px;
}

.rg-root[data-density="minimal"] .rg-sub,
.rg-root[data-density="minimal"] .rg-rows {
  display: none;
}

.rg-root[data-density="minimal"] .rg-inline {
  display: inline-flex;
}

.rg-root[data-density="minimal"] .rg-value {
  font-size: 15px;
}

.rg-root[data-density="minimal"] .rg-unit {
  font-size: 8px;
}

/* the bottom stats bar has less height than the composer slot */
.rg-root[data-placement="dock"][data-density="full"] {
  --rg-dial: 42px;
}

.rg-root[data-placement="dock"][data-density="full"] .rg-value {
  font-size: 17px;
}

.rg-root[data-placement="dock"][data-density="compact"] {
  --rg-dial: 38px;
}

.rg-root[data-placement="dock"][data-density="compact"] .rg-value {
  font-size: 15px;
}

.rg-root[data-placement="dock"][data-density="minimal"] {
  --rg-dial: 32px;
}

.rg-root[data-placement="dock"][data-density="minimal"] .rg-value {
  font-size: 13px;
}

.rg-root[data-sub="0"] .rg-sub,
.rg-root[data-sub="0"] .rg-rows,
.rg-root[data-sub="0"] .rg-inline {
  display: none;
}

@media (prefers-reduced-motion: reduce) {
  .rg-root *,
  .rg-root *::before,
  .rg-root *::after {
    animation-duration: .001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .001ms !important;
  }
}
`;
