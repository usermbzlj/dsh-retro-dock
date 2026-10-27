/**
 * Swiss: borrowed ink, borrowed paper. No housing, no dial, no accent except a
 * threshold-red cursor. The rules and the number carry the whole identity.
 */

export const SWISS_CSS = String.raw`
.rg-gauge[data-style="swiss"] {
  --swiss-ink: var(--dsw-alias-label-primary, #17181a);
  --swiss-muted: var(--dsw-alias-label-tertiary, #5e605c);
  --swiss-red: #b43725;
  --swiss-w: 156px;
  --swiss-value: 24px;
  --swiss-unit: 8px;
  --swiss-num: 9px;
  --swiss-rule: 44px;
  --swiss-label: 8px;
  height: auto;
  gap: 0;
  padding: 0;
  border-radius: 0;
  color: var(--swiss-ink);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-variant-numeric: tabular-nums lining-nums;
}

[data-ds-dark-theme] .rg-gauge[data-style="swiss"] {
  --swiss-ink: var(--dsw-alias-label-primary, #e8eefc);
  --swiss-muted: var(--dsw-alias-label-tertiary, rgba(232, 238, 252, .62));
  --swiss-red: #f07e68;
}

.rg-gauge[data-style="swiss"][data-variant="input"][data-density="full"] {
  --swiss-w: 156px;
  --swiss-value: 24px;
  --swiss-unit: 8px;
  --swiss-num: 9px;
  --swiss-rule: 44px;
  --swiss-label: 8px;
}

.rg-gauge[data-style="swiss"][data-variant="input"][data-density="compact"] {
  --swiss-w: 144px;
  --swiss-value: 21px;
  --swiss-unit: 7.5px;
  --swiss-num: 8.5px;
  --swiss-rule: 38px;
  --swiss-label: 7.5px;
}

.rg-gauge[data-style="swiss"][data-variant="dock"][data-density="full"] {
  --swiss-w: 132px;
  --swiss-value: 20px;
  --swiss-unit: 7.5px;
  --swiss-num: 8.5px;
  --swiss-rule: 36px;
  --swiss-label: 7.5px;
}

.rg-gauge[data-style="swiss"][data-variant="dock"][data-density="compact"] {
  --swiss-w: 124px;
  --swiss-value: 18px;
  --swiss-unit: 7.5px;
  --swiss-num: 8px;
  --swiss-rule: 32px;
  --swiss-label: 7.5px;
}

.rg-gauge[data-style="swiss"] .rgx-swiss {
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
  width: var(--swiss-w);
  min-width: 0;
  color: var(--swiss-ink);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-main {
  display: flex;
  align-items: baseline;
  gap: 2px;
  min-width: 0;
  font-size: var(--swiss-value);
  font-weight: 500;
  letter-spacing: -.045em;
  line-height: 1;
  color: var(--swiss-ink);
  white-space: nowrap;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-main .rgx-approx {
  display: inline-block;
  width: .8em;
  flex: 0 0 auto;
  font-size: .5em;
  font-weight: 500;
  text-align: center;
  opacity: .62;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-digits {
  display: inline-block;
  flex: 0 0 auto;
  min-width: 2.4ch;
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-unit {
  flex: 0 0 auto;
  margin-left: 2px;
  font-size: var(--swiss-unit);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--swiss-muted);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-over {
  display: none;
  margin-left: 1px;
  color: var(--swiss-red);
  font-size: .65em;
  font-weight: 700;
  letter-spacing: 0;
}

.rg-gauge[data-style="swiss"][data-over="1"] .rgx-swiss-over {
  display: inline;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-rule {
  position: relative;
  width: 100%;
  height: 1px;
  margin-top: 2px;
  flex: 0 0 auto;
  background: var(--swiss-ink);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-tick {
  position: absolute;
  top: -2px;
  width: 1px;
  height: 5px;
  background: var(--swiss-ink);
  opacity: .7;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-tick.is-start {
  left: 0;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-tick.is-end {
  transform: translateX(-1px);
}

.rg-gauge[data-style="swiss"][data-over="1"] .rgx-swiss-tick.is-end {
  background: var(--swiss-red);
  opacity: 1;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-rate-cursor {
  position: absolute;
  top: -3px;
  left: 0;
  width: 6px;
  height: 6px;
  margin-left: -3px;
  background: var(--swiss-ink);
  transition: left .12s linear;
}

.rg-gauge[data-style="swiss"][data-over="1"] .rgx-swiss-rate-cursor {
  background: var(--swiss-red);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-sub {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-ctx,
.rg-gauge[data-style="swiss"] .rgx-swiss-hit {
  display: flex;
  align-items: baseline;
  gap: 4px;
  min-width: 0;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-label {
  flex: 0 0 auto;
  font-size: var(--swiss-label);
  font-weight: 500;
  letter-spacing: 0;
  color: var(--swiss-muted);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-value {
  flex: 0 0 auto;
  font-size: var(--swiss-num);
  font-weight: 500;
  letter-spacing: -.01em;
  color: var(--swiss-ink);
  font-variant-numeric: tabular-nums;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-mini-rule {
  position: relative;
  width: var(--swiss-rule);
  height: 1px;
  flex: 0 0 auto;
  background: var(--swiss-ink);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-mini-rule.is-unknown {
  background: repeating-linear-gradient(90deg, var(--swiss-ink) 0 2px, transparent 2px 4px);
}

.rg-gauge[data-style="swiss"] .rgx-swiss-mini-cursor {
  position: absolute;
  top: -2px;
  left: 0;
  width: 4px;
  height: 4px;
  margin-left: -2px;
  background: var(--swiss-ink);
  transition: left .12s linear;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-mini-mark {
  position: absolute;
  top: -2px;
  width: 1px;
  height: 5px;
  background: var(--swiss-ink);
  opacity: .7;
}

.rg-gauge[data-style="swiss"] .rgx-swiss-alert {
  margin-left: 1px;
  color: var(--swiss-red);
  font-weight: 700;
}

.rg-gauge[data-style="swiss"][data-warn="1"] .rgx-swiss-ctx .rgx-swiss-label,
.rg-gauge[data-style="swiss"][data-warn="1"] .rgx-swiss-ctx .rgx-swiss-value {
  color: var(--swiss-red);
}

.rg-gauge[data-style="swiss"][data-warn="1"] .rgx-swiss-mini-cursor {
  background: var(--swiss-red);
}

.rg-gauge[data-style="swiss"][data-warn="1"] .rgx-swiss-mini-mark {
  background: var(--swiss-red);
  opacity: 1;
}

.rg-gauge[data-style="swiss"] .rgx-mini {
  color: var(--swiss-ink);
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 10.5px;
}

.rg-gauge[data-style="swiss"] .rgx-mini-digits {
  font-size: 12.5px;
  font-weight: 500;
}

.rg-gauge[data-style="swiss"] .rgx-mini-approx {
  width: .8em;
  font-size: .6em;
  opacity: .62;
}

.rg-gauge[data-style="swiss"] .rgx-mini-unit,
.rg-gauge[data-style="swiss"] .rgx-mini-sep {
  color: var(--swiss-muted);
}

.rg-gauge[data-style="swiss"] .rgx-mini-ctx.is-warn {
  color: var(--swiss-red);
}

@media (prefers-reduced-motion: reduce) {
  .rg-gauge[data-style="swiss"] .rgx-swiss-rate-cursor,
  .rg-gauge[data-style="swiss"] .rgx-swiss-mini-cursor {
    transition: none;
  }
}
`;
