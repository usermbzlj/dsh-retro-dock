/**
 * Full settings page. This is no longer a popover blown up to page width: the
 * form is a 500px column, the controls use page-scale type and hit targets,
 * and the preview stage uses the host surface so a light theme actually shows
 * a light instrument.
 */

export const SETTINGS_CSS = String.raw`
.rg-style-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  max-width: 460px;
}

.rg-style-option {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
  padding: 8px 9px 7px;
  border: .5px solid var(--dsw-alias-border-l2, rgba(127, 130, 135, .22));
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.rg-style-option:hover {
  border-color: var(--dsw-alias-border-l3, rgba(127, 130, 135, .38));
}

.rg-style-option.is-selected {
  border-color: var(--dsw-alias-state-business-primary, #3f6fd8);
  box-shadow: inset 0 0 0 1px var(--dsw-alias-state-business-primary, #3f6fd8);
}

.rg-style-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  min-width: 0;
  overflow: hidden;
}

.rg-style-stage .rg-gauge {
  margin: 0;
}

.rg-style-copy {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
}

.rg-style-name {
  flex: 0 1 auto;
  min-width: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--dsw-alias-label-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rg-style-en {
  flex: 0 0 auto;
  min-width: 0;
  max-width: 50%;
  overflow: hidden;
  font-family: Bahnschrift, "Segoe UI", sans-serif;
  font-size: 9px;
  color: var(--dsw-alias-label-tertiary);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rg-style-option:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary, #3f6fd8));
  outline-offset: 2px;
}

.rg-settings-page {
  --rg-form-width: 500px;
  --rg-preview-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding: 4px 0 28px;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: 13px;
  /* The page must answer to the host pane (800px panel minus 188px nav,
   * 24px gutters and a 5px scrollbar ≈ 559px), not to the viewport. Viewport
   * media queries never fire inside a desktop modal, which is how the form
   * used to collapse. */
  container: rg-settings / inline-size;
}

.rg-settings-page-head h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -.01em;
}

.rg-settings-page-head p {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--dsw-alias-label-tertiary);
}

.rg-settings-grid {
  display: grid;
  grid-template-columns: minmax(0, var(--rg-form-width)) var(--rg-preview-width);
  justify-content: center;
  gap: 48px;
  align-items: start;
}

.rg-settings-panel {
  min-width: 0;
}

.rg-controls {
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-width: 460px;
}

.rg-field {
  margin: 0;
}

.rg-controls > .rg-field:last-child {
  margin-top: 2px;
  padding-top: 16px;
  border-top: .5px solid var(--dsw-alias-border-l2, rgba(127, 130, 135, .2));
}

.rg-field-label {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--dsw-alias-label-secondary);
}

/* The hint yields; the field name never wraps to one character per line. */
.rg-field-label > span:first-child {
  flex: 0 0 auto;
  white-space: nowrap;
}

.rg-field-hint {
  flex: 1 1 10ch;
  min-width: 0;
  font-size: 11px;
  font-weight: 400;
  color: var(--dsw-alias-label-tertiary);
  opacity: .9;
}

.rg-seg {
  display: flex;
  gap: 3px;
  max-width: 380px;
  padding: 3px;
  border-radius: 10px;
  background: var(--dsw-alias-bg-module-platform, rgba(127, 130, 135, .12));
}

.rg-seg button {
  flex: 1 1 0;
  min-width: 0;
  min-height: 30px;
  padding: 6px 8px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.rg-seg button:hover {
  color: var(--dsw-alias-label-primary);
}

.rg-seg button[aria-pressed="true"] {
  background: var(--dsw-alias-bg-layer-1, #fff);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, .12);
}

.rg-select {
  width: 100%;
  max-width: 380px;
  height: 32px;
  padding: 0 10px;
  border: .5px solid var(--dsw-alias-border-l3, rgba(127, 130, 135, .3));
  border-radius: 8px;
  background: var(--dsw-alias-bg-module-platform, rgba(127, 130, 135, .12));
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 12.5px;
  cursor: pointer;
}

.rg-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 380px;
}

.rg-switch-label {
  font-size: 12.5px;
  color: var(--dsw-alias-label-secondary);
}

.rg-switch {
  position: relative;
  width: 40px;
  height: 24px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--dsw-alias-bg-module-platform, rgba(127, 130, 135, .24));
  cursor: pointer;
  transition: background .16s ease;
}

.rg-switch::after {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--dsw-alias-label-secondary);
  transition: transform .16s ease, background .16s ease;
}

.rg-switch[aria-checked="true"] {
  background: var(--dsw-alias-state-business-primary, #3f6fd8);
}

.rg-switch[aria-checked="true"]::after {
  transform: translateX(16px);
  background: #fff;
}

.rg-calib {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  max-width: 380px;
}

.rg-calib-text {
  font-size: 11px;
  line-height: 1.4;
  color: var(--dsw-alias-label-tertiary);
}

.rg-btn {
  min-height: 30px;
  padding: 5px 10px;
  border: .5px solid var(--dsw-alias-border-l3, rgba(127, 130, 135, .3));
  border-radius: 8px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.rg-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover, rgba(127, 130, 135, .12));
  color: var(--dsw-alias-label-primary);
}

.rg-btn-quiet {
  border-color: transparent;
  color: var(--dsw-alias-label-tertiary);
}

.rg-settings-preview {
  position: sticky;
  top: 12px;
  min-width: 0;
  padding: 16px;
  border: .5px solid var(--dsw-alias-border-l3, rgba(127, 130, 135, .3));
  border-radius: 16px;
  background: var(--dsw-alias-bg-layer-2, rgba(127, 130, 135, .06));
}

.rg-preview-block + .rg-preview-block {
  margin-top: 16px;
}

.rg-preview-label {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 2px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--dsw-alias-label-secondary);
}

.rg-preview-meta {
  font-size: 10.5px;
  font-weight: 400;
  color: var(--dsw-alias-label-tertiary);
}

.rg-preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 84px;
  padding: 12px;
  border: .5px solid var(--dsw-alias-border-l3, rgba(127, 130, 135, .24));
  border-radius: 12px;
  background: var(--dsw-alias-bg-layer-1, #fff);
  overflow: hidden;
}

.rg-preview-stage .rg-gauge {
  margin: 0;
}

.rg-preview-caption {
  margin: 10px 2px 0;
  font-size: 11px;
  line-height: 1.45;
  color: var(--dsw-alias-label-tertiary);
}

.rg-preview-version {
  margin-top: 4px;
  opacity: .8;
}

.rg-preview-foot {
  min-width: 0;
}

.rg-notice {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--dsw-alias-bg-module-platform, rgba(127, 130, 135, .1));
  color: var(--dsw-alias-label-tertiary);
  font-size: 11px;
  line-height: 1.5;
}

.rg-seg button:focus-visible,
.rg-select:focus-visible,
.rg-switch:focus-visible,
.rg-btn:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary, #3f6fd8));
  outline-offset: 2px;
}

/* The host's settings pane is ~559px wide inside its 800px modal: the 500px
 * form + 340px preview + 48px gap cannot fit, and a desktop viewport never
 * trips a media query for it. Reserve the two-column page for hosts that can
 * give it the room; below that, run one 560px column with the previews after
 * the form. */
@container rg-settings (max-width: 900px) {
  .rg-settings-page-head,
  .rg-settings-grid,
  .rg-notice {
    width: 100%;
    max-width: 560px;
    margin-inline: auto;
  }

  .rg-settings-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
    gap: 28px;
  }

  .rg-settings-panel {
    width: 100%;
  }

  .rg-controls,
  .rg-style-grid,
  .rg-seg,
  .rg-select,
  .rg-switch-row,
  .rg-calib {
    max-width: none;
  }

  .rg-settings-preview {
    position: static;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
    gap: 12px;
    padding: 12px;
  }

  /* The host pane is 559px once its 5px scrollbar is reserved. Tighter
   * preview padding keeps the widest 56px input dial (≈227px) clear of the
   * stage border with room to spare. */
  .rg-preview-stage {
    padding: 10px;
  }

  .rg-preview-block {
    min-width: 0;
  }

  .rg-preview-block + .rg-preview-block {
    margin-top: 0;
  }

  .rg-preview-foot {
    grid-column: 1 / -1;
  }

  .rg-preview-foot .rg-preview-caption {
    margin-top: 0;
  }

  .rg-preview-foot .rg-preview-caption + .rg-preview-caption {
    margin-top: 4px;
  }
}

@container rg-settings (max-width: 550px) {
  .rg-settings-preview {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
}

@container rg-settings (max-width: 520px) {
  .rg-style-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rg-switch,
  .rg-switch::after {
    transition: none;
  }
}
`;
