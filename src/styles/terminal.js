/**
 * Terminal: monospace cells, phosphor scanlines and a paper-green light mode.
 * The main bar is a striped fill clipped by `--rg-p`, so the per-frame animation
 * never touches React.
 */

export const TERMINAL_CSS = String.raw`
.rg-root[data-style="terminal"] {
  --rg-term-bg: #f3f8ed;
  --rg-term-fg: #1d5b37;
  --rg-term-dim: rgba(29, 91, 55, .20);
  --rg-term-soft: rgba(29, 91, 55, .08);
  --rg-term-warn: #9a5a12;
  --rg-ink: #173a26;
  --rg-muted: rgba(23, 58, 38, .56);
  --rg-warn: #9a5a12;
  --rg-glow: transparent;
  font-family: var(--ds-font-family-code, ui-monospace, "Cascadia Mono", Consolas, monospace);
}

body[data-ds-dark-theme] .rg-root[data-style="terminal"] {
  --rg-term-bg: rgba(3, 12, 7, .72);
  --rg-term-fg: #79e2a2;
  --rg-term-dim: rgba(121, 226, 162, .22);
  --rg-term-soft: rgba(121, 226, 162, .08);
  --rg-term-warn: #f2b84b;
  --rg-ink: #c8f5d8;
  --rg-muted: rgba(200, 245, 216, .52);
  --rg-warn: #f2b84b;
  --rg-glow: rgba(121, 226, 162, .45);
}

.rg-root[data-style="terminal"] .rg-term {
  --rg-term-w: calc(var(--rg-dial) * 1.9);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: var(--rg-term-w);
  flex: 0 0 auto;
  padding: 5px 7px;
  border: 1px solid var(--rg-term-dim);
  border-radius: 5px;
  background: var(--rg-term-bg);
  overflow: hidden;
  box-shadow: inset 0 0 14px var(--rg-term-soft);
}

.rg-root[data-style="terminal"] .rg-term::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(180deg, rgba(0, 0, 0, .10) 0 1px, transparent 1px 3px);
  opacity: .5;
  pointer-events: none;
}

body[data-ds-dark-theme] .rg-root[data-style="terminal"] .rg-term::after {
  background: repeating-linear-gradient(180deg, rgba(0, 0, 0, .32) 0 1px, transparent 1px 3px);
  opacity: .55;
}

.rg-root[data-style="terminal"] .rg-term-bar {
  position: relative;
  display: block;
  width: 100%;
  height: 9px;
  background: repeating-linear-gradient(90deg, var(--rg-term-dim) 0 4px, transparent 4px 6px);
}

.rg-root[data-style="terminal"] .rg-term-fill {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(90deg, var(--rg-term-fg) 0 4px, transparent 4px 6px);
  clip-path: inset(0 calc(100% - var(--rg-p, 0) * 1%) 0 0);
  filter: drop-shadow(0 0 3px var(--rg-glow));
}

body:not([data-ds-dark-theme]) .rg-root[data-style="terminal"] .rg-term-fill {
  filter: none;
}

.rg-root[data-style="terminal"] .rg-term-cursor {
  width: 3px;
  height: 9px;
  flex: 0 0 auto;
  background: var(--rg-term-fg);
  opacity: 0;
}

.rg-root[data-style="terminal"][data-live="1"] .rg-term-cursor {
  opacity: .8;
  animation: rg-term-blink 1.1s steps(1) infinite;
}

@keyframes rg-term-blink {
  0%, 49% { opacity: .8; }
  50%, 100% { opacity: .12; }
}

.rg-root[data-style="terminal"] .rg-value {
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  font-size: 19px;
  font-weight: 600;
  letter-spacing: .01em;
  color: var(--rg-term-fg);
  text-shadow: 0 0 7px var(--rg-glow);
}

.rg-root[data-style="terminal"][data-density="compact"] .rg-value {
  font-size: 16px;
}

body:not([data-ds-dark-theme]) .rg-root[data-style="terminal"] .rg-value {
  text-shadow: none;
}

.rg-root[data-style="terminal"] .rg-unit {
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  font-size: 8px;
  letter-spacing: .14em;
  color: var(--rg-muted);
}

.rg-root[data-style="terminal"] .rg-rows {
  gap: 3px;
  min-width: 104px;
}

.rg-root[data-style="terminal"] .rg-row {
  display: flex;
  align-items: center;
  gap: 5px;
}

.rg-root[data-style="terminal"] .rg-tag {
  font-size: 8px;
  letter-spacing: .1em;
  color: var(--rg-muted);
}

.rg-root[data-style="terminal"] .rg-term-mini {
  position: relative;
  display: block;
  width: 38px;
  height: 6px;
  flex: 0 0 auto;
  background: repeating-linear-gradient(90deg, var(--rg-term-dim) 0 3px, transparent 3px 5px);
  overflow: hidden;
}

.rg-root[data-style="terminal"] .rg-term-mini i {
  position: absolute;
  inset: 0;
  display: block;
  background: repeating-linear-gradient(90deg, var(--rg-term-fg) 0 3px, transparent 3px 5px);
  clip-path: inset(0 calc(100% - var(--rg-v, 0) * 1%) 0 0);
  filter: drop-shadow(0 0 2px var(--rg-glow));
}

body:not([data-ds-dark-theme]) .rg-root[data-style="terminal"] .rg-term-mini i {
  filter: none;
}

.rg-root[data-style="terminal"] .rg-row-hit .rg-term-mini i {
  background: repeating-linear-gradient(90deg, #3fb98a 0 3px, transparent 3px 5px);
}

body[data-ds-dark-theme] .rg-root[data-style="terminal"] .rg-row-hit .rg-term-mini i {
  background: repeating-linear-gradient(90deg, #6fe3b0 0 3px, transparent 3px 5px);
}

.rg-root[data-style="terminal"] .rg-num {
  margin-left: 0;
  min-width: 34px;
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  font-size: 9.5px;
  text-align: right;
  color: var(--rg-ink);
}

.rg-root[data-style="terminal"][data-warn="1"] .rg-row-ctx .rg-num,
.rg-root[data-style="terminal"][data-warn="1"] .rg-row-ctx .rg-tag {
  color: var(--rg-term-warn);
}

.rg-root[data-style="terminal"][data-warn="1"] .rg-row-ctx .rg-term-mini i {
  background: repeating-linear-gradient(90deg, var(--rg-term-warn) 0 3px, transparent 3px 5px);
}

.rg-root[data-style="terminal"] .rg-inline {
  font-family: var(--ds-font-family-code, ui-monospace, Consolas, monospace);
  font-size: 9px;
  letter-spacing: .04em;
}

.rg-root[data-style="terminal"][data-density="minimal"] .rg-term {
  width: calc(var(--rg-dial) * 1.25);
  padding: 4px 5px;
}

.rg-root[data-style="terminal"][data-density="minimal"] .rg-value {
  font-size: 14px;
}
`;
