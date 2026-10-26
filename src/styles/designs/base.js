/**
 * Shared scaffolding for the seven instrument bodies. It deliberately stays
 * shallow: layout, state visibility and the quality flag. Every visual choice
 * belongs to a design module.
 */

export const DESIGN_BASE_CSS = String.raw`
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
  gap: 6px;
  white-space: nowrap;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
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
  height: 13px;
  padding: 0 3px;
  box-sizing: border-box;
  border: 1px solid currentColor;
  border-radius: 2px;
  color: var(--dsw-alias-label-tertiary, #6a6c67);
  font-family: Bahnschrift, "DIN Alternate", "Roboto Condensed", "Segoe UI", system-ui, sans-serif;
  font-size: 7.5px;
  font-weight: 600;
  letter-spacing: .04em;
  line-height: 1;
  pointer-events: none;
  z-index: 2;
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-quality[data-quality="stale"] {
  color: var(--dsw-alias-state-warn-primary, #b43725);
}

.rg-gauge[data-style]:not([data-style="classic"]) .rgx-affordance {
  position: absolute;
  top: -2px;
  right: -7px;
  font-size: 10px;
  line-height: 1;
  opacity: .75;
  pointer-events: none;
}

/* Stale downgrades the mechanism, never the reading. */
.rg-gauge[data-style]:not([data-style="classic"])[data-stale="1"] .rgx-mechanism {
  opacity: .38;
}

.rg-gauge[data-style]:not([data-style="classic"])[data-stale="1"] .rgx-mini {
  opacity: .72;
}

@media (hover: none) {
  .rg-gauge[data-style]:not([data-style="classic"]) .rgx-affordance {
    display: inline-block;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rg-gauge[data-style]:not([data-style="classic"]) .rgx-drum-strip {
    transition: none !important;
  }
}
`;
