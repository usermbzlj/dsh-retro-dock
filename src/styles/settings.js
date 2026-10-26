/**
 * Full settings page. This is no longer a popover blown up to page width: the
 * form is a 500px column, the controls use page-scale type and hit targets,
 * and the preview stage uses the host surface so a light theme actually shows
 * a light instrument.
 */

export const SETTINGS_CSS = String.raw`
.rg-settings-page {
  --rg-form-width: 500px;
  --rg-preview-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px 0 28px;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: 13px;
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
  align-items: baseline;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--dsw-alias-label-secondary);
}

.rg-field-hint {
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

@media (max-width: 900px) {
  .rg-settings-grid {
    grid-template-columns: minmax(0, 1fr);
    justify-content: stretch;
    gap: 24px;
  }

  .rg-controls,
  .rg-seg,
  .rg-select,
  .rg-switch-row,
  .rg-calib {
    max-width: 520px;
  }

  .rg-settings-preview {
    position: static;
  }
}

@media (max-width: 560px) {
  .rg-seg {
    flex-wrap: wrap;
  }

  .rg-seg button {
    flex-basis: calc(50% - 3px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rg-switch,
  .rg-switch::after {
    transition: none;
  }
}
`;
