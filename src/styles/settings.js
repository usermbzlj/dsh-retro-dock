/**
 * Settings popover and full settings page. Both use host tokens so they follow
 * the active host theme; neither ships its own dark-mode switch.
 */

export const SETTINGS_CSS = String.raw`
.rg-settings-popover {
  position: fixed;
  z-index: 2147483000;
  width: 318px;
  max-width: calc(100vw - 24px);
  max-height: min(76vh, 620px);
  overflow: auto;
  padding: 14px;
  border: .5px solid var(--dsw-alias-border-l3, rgba(127, 130, 135, .3));
  border-radius: 14px;
  background: var(--dsw-alias-bg-layer-1, #1b1b1c);
  color: var(--dsw-alias-label-primary, #f5f5f5);
  box-shadow: var(--dsw-elevation-prominent, 0 12px 32px rgba(0, 0, 0, .35));
  font-family: var(--dsw-font-family, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif);
  font-size: 12px;
  line-height: 1.4;
  scrollbar-width: thin;
}

.rg-settings-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;
}

.rg-settings-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -.01em;
  color: var(--dsw-alias-label-primary);
}

.rg-settings-version {
  margin-left: 4px;
  font-size: 9.5px;
  font-weight: 400;
  letter-spacing: .04em;
  color: var(--dsw-alias-label-tertiary);
}

.rg-settings-sub {
  margin: 2px 0 0;
  font-size: 10.5px;
  color: var(--dsw-alias-label-tertiary);
}

.rg-settings-close {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-tertiary);
  cursor: pointer;
  flex: 0 0 auto;
}

.rg-settings-close:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.rg-settings-close:focus-visible,
.rg-btn:focus-visible,
.rg-seg button:focus-visible,
.rg-style-tile:focus-visible,
.rg-switch:focus-visible,
.rg-select:focus-visible {
  outline: 2px solid var(--dsw-focus-ring-color, var(--dsw-alias-state-business-primary));
  outline-offset: 2px;
}

.rg-field {
  margin-top: 12px;
}

.rg-field:first-of-type {
  margin-top: 0;
}

.rg-field-label {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-tertiary);
}

.rg-field-hint {
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: none;
  color: var(--dsw-alias-label-tertiary);
  opacity: .8;
}

.rg-style-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 7px;
}

.rg-style-tile {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
  min-width: 0;
  padding: 8px 8px 7px;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: 10px;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}

.rg-style-tile:hover {
  background: var(--dsw-alias-interactive-bg-hover);
}

.rg-style-tile[aria-pressed="true"] {
  border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 65%, transparent);
  background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 9%, transparent);
}

.rg-style-icon {
  display: block;
  width: 46px;
  height: 24px;
  color: var(--dsw-alias-label-secondary);
}

.rg-style-tile[aria-pressed="true"] .rg-style-icon {
  color: var(--dsw-alias-state-business-primary);
}

.rg-style-name {
  font-size: 11px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.rg-style-desc {
  margin: 0;
  font-size: 10px;
  line-height: 1.35;
  color: var(--dsw-alias-label-tertiary);
}

.rg-seg {
  display: flex;
  gap: 2px;
  padding: 2px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-module-platform);
}

.rg-seg button {
  flex: 1 1 0;
  min-width: 0;
  padding: 5px 4px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 10.5px;
  line-height: 1.2;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rg-seg button:hover {
  color: var(--dsw-alias-label-primary);
}

.rg-seg button[aria-pressed="true"] {
  background: var(--dsw-alias-bg-layer-1);
  color: var(--dsw-alias-label-primary);
  box-shadow: 0 1px 2px rgba(0, 0, 0, .14);
}

.rg-select {
  width: 100%;
  height: 30px;
  padding: 0 8px;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: 8px;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-primary);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}

.rg-switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.rg-switch-label {
  font-size: 11px;
  color: var(--dsw-alias-label-secondary);
}

.rg-switch {
  position: relative;
  width: 32px;
  height: 18px;
  flex: 0 0 auto;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: var(--dsw-alias-bg-module-platform);
  cursor: pointer;
  transition: background .16s ease;
}

.rg-switch::after {
  content: "";
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--dsw-alias-label-secondary);
  transition: transform .16s ease, background .16s ease;
}

.rg-switch[aria-checked="true"] {
  background: var(--dsw-alias-state-business-primary);
}

.rg-switch[aria-checked="true"]::after {
  transform: translateX(14px);
  background: #fff;
}

.rg-settings-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: .5px solid var(--dsw-alias-border-l2);
}

.rg-btn {
  padding: 5px 9px;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: 7px;
  background: transparent;
  color: var(--dsw-alias-label-secondary);
  font: inherit;
  font-size: 10.5px;
  cursor: pointer;
}

.rg-btn:hover {
  background: var(--dsw-alias-interactive-bg-hover);
  color: var(--dsw-alias-label-primary);
}

.rg-btn-quiet {
  border-color: transparent;
  color: var(--dsw-alias-label-tertiary);
}

.rg-version {
  margin-left: auto;
  font-size: 9.5px;
  letter-spacing: .04em;
  color: var(--dsw-alias-label-tertiary);
}

.rg-notice {
  margin: 12px 0 0;
  padding: 8px 9px;
  border-radius: 8px;
  background: var(--dsw-alias-bg-module-platform);
  color: var(--dsw-alias-label-tertiary);
  font-size: 10px;
  line-height: 1.45;
}

/* full settings page (settings.section) */
.rg-settings-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0 28px;
  color: var(--dsw-alias-label-primary);
  font-family: var(--dsw-font-family);
  font-size: 13px;
}

.rg-settings-page-head h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -.01em;
}

.rg-settings-page-head p {
  margin: 4px 0 0;
  font-size: 12px;
  color: var(--dsw-alias-label-tertiary);
}

.rg-settings-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  gap: 24px;
  align-items: start;
}

@media (max-width: 900px) {
  .rg-settings-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}

.rg-settings-panel {
  min-width: 0;
}

.rg-settings-panel .rg-style-grid {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

@media (max-width: 720px) {
  .rg-settings-panel .rg-style-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.rg-settings-preview {
  position: sticky;
  top: 12px;
  min-width: 0;
  padding: 18px 14px 14px;
  border: .5px solid var(--dsw-alias-border-l3);
  border-radius: 16px;
  background: var(--dsw-alias-bg-layer-2);
}

.rg-preview-stage {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 92px;
  padding: 12px 6px;
  border-radius: 12px;
  background:
    radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--dsw-alias-state-business-primary) 7%, transparent), transparent 70%),
    var(--dsw-alias-bg-layer-1);
  overflow: hidden;
}

.rg-preview-stage + .rg-preview-stage {
  margin-top: 8px;
}

.rg-preview-label {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin: 10px 2px 0;
  font-size: 9.5px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--dsw-alias-label-tertiary);
}

.rg-preview-caption {
  margin: 10px 2px 0;
  font-size: 10.5px;
  line-height: 1.45;
  color: var(--dsw-alias-label-tertiary);
}

.rg-settings-page .rg-root {
  margin: 0;
}

.rg-settings-page .rg-root[data-static="1"] {
  transform: none;
}

.rg-settings-page .rg-notice {
  margin-top: 14px;
}

.rg-calib {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.rg-calib-text {
  font-size: 10.5px;
  line-height: 1.35;
  color: var(--dsw-alias-label-tertiary);
}

.rg-preview-stage .rg-root[data-density="full"] {
  --rg-dial: 56px;
}

.rg-preview-stage .rg-root[data-density="full"] .rg-value {
  font-size: 20px;
}

.rg-preview-stage .rg-root[data-placement="dock"] {
  margin: 0;
}

.rg-preview-stage .rg-term {
  --rg-term-w: 104px;
}
`;
