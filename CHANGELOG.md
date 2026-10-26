# Changelog

## 1.4.0 — 2026-10-26

### Added

- **Seven measuring languages** beside the classic dial: 台表 Bench, 广播 VU, 高度表 Altimeter, 信号楼 Signal, 记录纸 Chart, 瑞士尺 Swiss and 罗经 Compass. Each has its own mechanism, surface, type and motion; all share one `vm`, calibration and the live / warn / over / stale / DOM state flags.
- **Style picker in the host settings page**: eight options (classic + seven), each with a real 42px preview; the selected option uses `aria-pressed`, the stage is hidden from assistive tech, and the option button has its own label.
- **Shared instrument shell** (`src/ui/design-gauge.js`): semantics, title/aria, quality flags, placement affordance and the minimal-density line. The classic dial keeps its own implementation and stays the eighth option.
- **Design study and catalogue**: `docs/seven-designs.md`, `docs/catalogue.html` (`npm run catalogue`), 91 real 1× instances, light/dark racks, six states, 2× craft details and a minimal comparison.
- **`prefs:v3`** with v2 migration and deletion; retired 1.1.0 style values (`neon` / `minimal` / `terminal`) normalise to `classic` instead of leaking into the new registry.

### Changed

- The default remains **classic**; the new languages are opt-in, so an update does not silently change the instrument in the composer.
- The settings page now leads with the style picker and keeps the existing full-page scale; the preview follows the selected style, placement, density, scale, warning line and sub-switch — beside the form on wide hosts, below it in the host's 800px modal.
- The meter loop is re-armed when the style changes, so the new root receives `--rg-p` immediately instead of waiting for a remount.
- Only the Chart style records history: 20s at 4Hz, paused while the document is hidden; the static previews use a deterministic trace.
- Contrast corrections: the light Signal amber lamp is now `#965812` (4.3:1 on the enamel plate); the light Altimeter limit red is now `#A63122` (5.0:1 on the panel); the altimeter's over marks on the black window use a separate bright red (`#E0705C` / `#F07A62`).

### Fixed

- **Settings page at the host's real width.** The page now answers to its own container (≈560px inside DSH's 800px settings modal) instead of the desktop viewport. The form and the eight-design grid use the full width, the style names stay on one line, field labels no longer wrap one character per line, and the previews move below the form as a two-up strip. The two-column form + sticky preview stays for hosts wide enough to fit it (≥900px). Before, the form was squeezed to 176px and six of the eight style names were ellipsized.

### Verification

- 56/56 tests pass (seven-mechanism SSR, settings preview, jsdom style switch and meter-loop re-arm, bundle contract).
- Catalogue and settings style picker rendered in Chromium at 1440px; light/dark screenshots generated.
- Settings page re-measured inside an 800×800 host modal (559px pane after the 5px scrollbar), a 700px pane and a 1200px pane: 275px / 459px / 226px style cards, no clipped names, all eight previews fit their stages.
- A real-session trace and the live feel of each new mechanism are still pending.

## 1.3.0 — 2026-10-26

### Fixed

- **Light theme readability.** The gauge no longer paints hard-coded light ink on the host surface. It takes ink/track from host tokens when available, uses an explicit light muted tone, and swaps its accent/caution/cache palette under `[data-ds-dark-theme]`; light mode reads at 17.2:1 for the main value and 6.0:1 for secondary labels instead of 1.16:1.
- **Minimal warning state.** `data-warn` now reaches `.rg-meta`: the CTX item turns caution-coloured and gets a visible `!`; before, the warning selectors only matched the hidden sub dial and row.
- **Warning semantics.** The CTX ring is neutral below the threshold; a redline is printed at `warnAt`, and only the above-threshold arc segment, number and `!` turn caution-coloured. The ring is no longer amber at every value.
- **Data quality is visible.** A page-text fallback shows a `DOM` badge and unavailable data shows `!`; the dials recede while readings stay legible. Source and warning are included in `aria-label`.
- **`≈` layout shift.** The approximation mark now has a fixed slot and the digits reserve three tabular cells; live/idle no longer changes the gauge width by 7px.
- **Click discoverability and semantics.** Removed the misleading `aria-pressed`; the label names the current placement and the action, and hover/focus draws a quiet housing outline.
- **Settings page scale and targets.** The stretched-popover settings page is replaced by a 500px form column, 12–13px labels, 30px segmented controls, a 40×24 switch and a 30px quiet button. Popover-era CSS and the dead `SettingsPopover` were removed.
- **Truthful previews.** The settings preview renders the current placement, density, full scale, warning threshold and sub-switch; example readings are labelled as examples. The black preview stage is gone, so a light theme shows a light instrument.
- **README.** A real-size specimen sheet replaces the four-card gallery: input placement, five instrument states, and dark/light × zh/en screenshots. No more 72px dials pretending to be product size.
- **Typography and strokes.** Quantized value sizes (18/16/15/14px), explicit token colours, non-scaling sub-dial strokes, and a heavier full-scale tick.

### Removed

- The unused 1.1.0 design layer: `styles/base.js`, `heritage.js`, `neon.js`, `minimal.js`, `terminal.js`, `ui/view.js`, `ui/instruments.js`, `ui/rows.js`, `ui/preview.js`, `ui/icons.js`, `SettingsPopover`, and the `style` preference. Existing `style` values are dropped during normalization.

### Verification

- 49/49 tests pass; dark/light × zh/en screenshots are generated by Playwright. A real-session trace is still pending.

## 1.2.0 — 2026-10-26

### Changed

- Restored the pre-1.1.0 **classic dual-dial** visual as the only shipped gauge: 240° speed dial, four tick marks, tapered needle, 38px CTX/HIT dual rings, and the original readout rows.
- Removed the four-style switcher, the gauge gear/popover and the four-style galleries from the shipped UI. The four-style code is no longer imported by the bundle and remains recoverable from the `v1.1.0` tag and GitHub Release.
- Settings now live only in the host `settings.section`: placement, density, full scale, CTX warning threshold, sub-readout switch, language and calibration reset.
- Restored the original density behaviour: composer full / compact / minimal at 860 / 620; stats bar full / minimal at 560. Dial sizes 56 / 50 / 44 and 42 / 38.
- Made the classic needle continuous across host partial rewrites: the counter only restarts on a real total decrease (or a cleared partial), the meter clock is primed when the rAF loop resumes, the frame dt is capped at 50 ms, and the SVG needle declares `transform-box: view-box` / `will-change`. The spring state is module-scoped and the initial `--rg-p` is applied in a layout effect, so a slot remount does not flash the needle at 0. A `sessionStats.decodeTokens` drop now resets calibration only, not the live rate window, and a generation/partial clear resets only the counter, so a CTX/HIT sub-dial refresh cannot zero the main needle. `window.__retroDock.getTrace()` keeps a short needle/target trace for diagnostics.
- The classic gauge runs on the 1.1.0 measurement engine; the arc and needle are driven by `--rg-p`, ticks are scale-aware, and overspeed keeps the cyan halo/color shift.
- Updated README, README.en, MEASUREMENT, package metadata and screenshots (`docs/classic-dark.jpg`, `docs/settings-*.jpg`).

### Kept

- Incremental stream counting, delta calibration with pending/available/unavailable states, host-compatible HIT formatting, idle rAF stop, observer detach, ResizeObserver density, `dsh-retro-dock:prefs:v2` migration and the 44-test suite.

### Verification

- 44/44 tests pass; the classic gauge and settings page render in Chromium. A real-session calibration trace is still pending.

## 1.1.0 — 2026-10-26

视觉、设置与测量核心的一次完整升级。旧的 `1.0.0` 包只有单一样式，测量与文档也停留在初版。

### Added

- Four high-quality styles: **Heritage**, **Neon HUD**, **Minimal**, **Terminal**, with independent light/dark palettes that follow `body[data-ds-dark-theme]`.
- Settings popover anchored to a gear button: style, placement, density, full scale, CTX warning threshold, sub-readout switch, language and calibration reset.
- Full `settings.section` page with the same controls and live full/minimal previews.
- Chinese/English UI, including style names, descriptions, tooltips, aria labels and the settings page.
- Style gallery and screenshots in `docs/` (`styles-*.jpg`, `settings-*.jpg`, `popover-*.jpg`, per-style cards), generated by Playwright.
- `src/` module layout with an esbuild bundle; `client.js` is now a build artifact.
- 43 tests: measurement, incremental stream counting, rate/calibration, preference migration, i18n, SSR rendering of all styles, jsdom mount/toggle/popover integration, and the built bundle's ModuleLoader contract.
- GitHub Actions CI (`npm ci && npm run build && npm test`).
- Package compatibility metadata: `engines.dsh`, `dsh.compatibility` release map, peer dependency range, repository/homepage/bugs/author.
- `.gitattributes` (LF), README.en.md, CHANGELOG.md, rewritten MEASUREMENT.md.

### Changed

- Rate accounting is incremental: only the appended slice of each streaming block is tokenized. Long generations no longer pay O(n²).
- Calibration compares host `sessionStats` **token deltas** against estimated token deltas within the same interval, instead of comparing a session average with a single generation average.
- Calibration has explicit states: `pending`, `available` (with sample count) and `unavailable`; the tooltip no longer claims `×1.00` when no sample exists.
- HIT formatting follows the host's exact formatter: integer while integer rounding stays below 100, otherwise the minimum honest precision (e.g. `99.9`, `99.99`).
- Layout, size and density are per gauge instance and driven by a ResizeObserver; switching placement can no longer carry the other variant's size over.
- Preferences moved to `dsh-retro-dock:prefs:v2`; `rg-gauge-placement` is migrated and removed.
- The runtime no longer uses `window.__dsh*` globals as a data bus. A module-scoped engine owns state; `window.__retroDock` is a read-only debug mirror.
- rAF stops after the needle settles; the body MutationObserver is attached only when the chat stream is unavailable.
- Heritage dial gains a 25-tick scale, metallic bezel ring, redline arc and a brighter face; Neon gains a real gradient arc and aligned endpoint; Minimal CTX tracks use the warning colour; endpoint dot geometry is aligned to the 240° sweep.

### Fixed

- Marker dots in Neon and Minimal were 90° out of phase with the arc.
- Heritage/Neon tick rings were rotated 90° off the 8 o'clock start.
- Minimal density could inherit the other placement's dial size.
- Sub-dial SVG overflowed its 68% face on some sizes.
- Settings had duplicate “Show CTX / HIT” labels and a duplicated notice.
- HIT could under-report `99.95` as `99.9`; it now matches the host.
- The popover could be clipped by the composer; it is portaled to `body`, closes on Escape/outside pointerdown and restores focus.
- A stale v1.0.0 tarball link and a JPEG saved as `preview.png` were removed from the docs.

### Known limitations

- A real-session trace of `window.__retroDock` against host `sessionStats` is still pending; measured accuracy is not claimed yet.
- `sessionStats` missing → calibration unavailable; DOM fallback is less trustworthy than projections.
- The 1.2 s window can show a spike when tool arguments arrive in one burst.
- HIT is whole-session cumulative, not the current request.
