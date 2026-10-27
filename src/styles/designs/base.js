/**
 * Shared scaffolding for the three instrument languages beside classic.
 */

export const DESIGN_BASE_CSS = String.raw`
.rg-gauge .rgx-drum {
  display: inline-flex;
  align-items: stretch;
  height: 1em;
  overflow: hidden;
  font-variant-numeric: tabular-nums lining-nums;
}

.rg-gauge .rgx-drum-col {
  display: inline-block;
  width: .7em;
  height: 1em;
  overflow: hidden;
}

.rg-gauge .rgx-drum-strip {
  display: flex;
  flex-direction: column;
  transition: transform 90ms linear;
}

.rg-gauge .rgx-drum-col.is-units .rgx-drum-strip {
  transition: none;
}

.rg-gauge .rgx-drum-glyph {
  display: block;
  height: 1em;
  line-height: 1;
}

.rg-gauge .rgx-drum-col.is-lead {
  opacity: .3;
}

.rg-gauge .rgx-drum-plus {
  margin-left: 1px;
  font-weight: 700;
}

.rg-gauge .rgx-lamps {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 3px;
}

.rg-gauge .rgx-lamp {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-sizing: border-box;
  border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
  background: transparent;
}

.rg-gauge .rgx-lamps[data-level="ok"] .rgx-lamp[data-lamp="ok"] {
  background: #2f6b45;
  border-color: #2f6b45;
}

.rg-gauge .rgx-lamps[data-level="amber"] .rgx-lamp[data-lamp="amber"] {
  background: #b45309;
  border-color: #b45309;
}

.rg-gauge .rgx-lamps[data-level="red"] .rgx-lamp[data-lamp="red"] {
  background: var(--rg-caution-strong, #b45309);
  border-color: var(--rg-caution-strong, #b45309);
}

.rg-gauge .rgx-mini-over,
.rg-gauge .rg-over-mark {
  color: var(--rg-caution-strong, #b45309);
  font-weight: 700;
}

.rg-gauge[data-style]:not([data-style="classic"]) {
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: inherit;
  vertical-align: middle;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-body {
  display: inline-flex;
  align-items: center;
  min-width: 0;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini {
  display: none;
  align-items: baseline;
  gap: 10px;
  white-space: nowrap;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-tag {
  letter-spacing: 0;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-density="minimal"] .rgx-body {
  display: none;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-density="minimal"] .rgx-mini {
  display: inline-flex;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-approx {
  display: inline-block;
  text-align: center;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-digits {
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-mini-alert {
  margin-right: 2px;
  font-weight: 700;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-quality {
  position: static;
  display: inline-flex;
  margin-left: 5px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  box-sizing: border-box;
  border: 1px solid currentColor;
  border-radius: 2px;
  color: var(--dsw-alias-label-secondary, #5e636b);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0;
  line-height: 1;
  pointer-events: none;
  z-index: 2;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-quality[data-quality="stale"] {
  color: var(--dsw-alias-label-secondary, #5e636b);
  border-style: dashed;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-affordance {
  display: none;
  position: absolute;
  top: -2px;
  right: -7px;
  font-size: 10px;
  line-height: 1;
  opacity: .75;
  pointer-events: none;
}

.rg-gauge[data-style]:not([data-style="classic"]):hover .rgx-affordance,
.rg-gauge[data-style]:not([data-style="classic"]):focus-visible .rgx-affordance {
  display: inline-block;
}

/* Stale downgrades the mechanism, never the reading. */
.rg-gauge[data-style]:not([data-style="classic"])[data-stale="1"] .rgx-mechanism {
  opacity: .38;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-stale="1"] .rgx-mini {
  color: var(--dsw-alias-label-secondary, #5e636b);
}

@media (hover: none) {
  .rg-gauge[data-style]:not([data-style="classic"]) .rgx-affordance {
    display: inline-block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rg-gauge[data-style]:not([data-style="classic"]),
  .rg-gauge[data-style]:not([data-style="classic"]) * {
    transition: none !important;
  }
}
`;
