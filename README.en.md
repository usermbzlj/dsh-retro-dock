# DSH Retro Dock

A dual-dial instrument for the DeepSeek Harness composer: live tokens per second on the main dial, context pressure and session cache hit on the sub dial. 1.3.0 keeps the classic dials and adds a light theme, a warning redline, visible data-quality states, and a full-page settings section.

![Classic dual dial · dark](docs/classic-dark-en.jpg)

![Classic dual dial · light](docs/classic-light-en.jpg)

> [Settings · dark](docs/settings-dark-en.jpg) · [Settings · light](docs/settings-light-en.jpg) · [Measurement contract](MEASUREMENT.md) · [Changelog](CHANGELOG.md) · [中文](README.md)

## Look

- **Main dial**: 240° sweep, ticks at 0 / 60 / 120 / 180 with a heavier full-scale tick, and a tapered needle. 0–180 tok/s by default; configurable 120 / 240 / 300. Past full scale the needle stops and the ring enters a cyan overspeed glow while the number keeps rising; the tooltip names the full scale.
- **Sub dial**: 38px dual rings at the full input density. CTX stays neutral below its warning threshold and gets a redline at `warnAt`; past the line the arc segment, number and `!` turn caution-coloured. HIT stays cyan so the two meanings do not share a hue.
- **Placement**: click the gauge to move between the composer and the stats bar; hover / focus draws a quiet housing outline; the choice persists.
- **Density**: composer full / compact / minimal at 860 / 620; stats bar full / minimal at 560. Minimal folds the sub dial into `CTX · HIT`; a warning still turns the CTX item caution-coloured and adds `!`.
- **Theme**: the instrument follows the host light/dark theme; settings follow host tokens. Light uses dark ink and a deeper blue / ochre / teal instead of pretending the host is still dark.
- **Data quality**: a page-text fallback shows a `DOM` badge; unavailable data shows `!`, dims the dials and keeps the readings legible. The aria-label and tooltip both name the source.
- No style switcher and no gear button. Preferences live in host Settings → Retro Dock.

## Features

- **Rate**: 1.2 s window, incremental stream counting, calibrated against host `sessionStats` token deltas (factor bounded 0.4–2.5). `≈` has a fixed slot, so live / idle does not shift the centred gauge.
- **CTX / HIT**: host `contextPressure` and `tokenUsage`, with the host's exact cache-hit formatting.
- **Settings**: placement, density, full scale, CTX warning threshold, sub-readout switch, language and calibration reset. Full-page controls; previews use the current scale, warning line and placement, and example readings are labelled as examples.
- **Language**: Chinese / English / follow host, including tooltips, aria and settings.
- **Performance**: rAF stops when idle; the DOM observer is detached while the chat stream is available; density uses a ResizeObserver.
- **Privacy**: no network requests, no credential access; one preference key. `window.__retroDock` is a debug mirror.

## Install

Check the profile first: `dsh web` uses `web`; the desktop app uses `desktop`.

```bash
npx @deepseek-ai/dsh plugin --profile web add github:usermbzlj/dsh-retro-dock
```

Desktop:

```bash
cd ~/.dsh/profiles/desktop
pnpm add github:usermbzlj/dsh-retro-dock
```

Confirm `dsh.profile.bundles` in the profile contains `@local/retro-dock`, then restart DSH. Local package: `npm pack` (1.3.0).

> The 1.1.0 four-style release remains available as history; current `main` is the 1.3.0 theme-aware classic gauge.

## Interaction

- Click the gauge to toggle placement.
- Keyboard: focus the gauge, then `Enter` / `Space`.
- Settings: host Settings → Retro Dock (no in-gauge gear or popover).
- Preference key: `dsh-retro-dock:prefs:v2`; legacy `rg-gauge-placement` migrates automatically, and the retired 1.1.0 `style` field is dropped.

## Measurement

Priority: host projections (`contextPressure`, `tokenUsage`, `sessionStats`) → chat store (`useChat(s => s.legacy.partial)`, model output only) → page-text fallback (marked on the gauge with `DOM`, and named in the tooltip and aria label).

The rate is an estimate plus calibration, not server-side token accounting. The tooltip shows the calibration factor/samples, full scale, warning line and data source; the settings page shows calibration status. See [MEASUREMENT.md](MEASUREMENT.md).

## Compatibility

- Platform: web (Chromium).
- Host: `dsh >= 0.2.0-rc.1 < 0.3.0`; developed against `0.2.1-rc.3`.
- Theme: follows `[data-ds-dark-theme]` and host tokens; light and dark are both supported.
- Known limits: calibration needs `sessionStats`; the page-text fallback is less trustworthy; a real-session trace is still pending.

## Development

```bash
npm install
npm run build      # bundles src/ into client.js
npm test           # 49 tests
npm run preview    # builds docs/gallery.html specimen sheet
npm run shots      # needs Chromium: npx playwright install chromium
```

`client.js` is generated. Source: `measure.js`, `stream.js`, `rate.js`, `engine.js`, `prefs.js`, `i18n.js`, `ui/classic.js`, `ui/gauge.js`, `ui/settings.js`, `styles/`. Tests cover measurement, incremental counting, calibration, preference migration (including dropping 1.1.0 `style`), i18n, classic gauge SSR / warning / data-source / preview states, jsdom mount/stream/placement, and the built bundle contract. CI builds, checks `client.js`, and runs the suite.

## Verification

- 49/49 tests pass; the classic gauge and settings page are rendered in Chromium and screenshotted across dark/light × zh/en (`docs/classic-*.jpg`, `docs/settings-*.jpg`).
- A real-session trace has not been captured yet. After a refresh, the tooltip should show `Source host stats`; if it shows `page text` or stays at “Waiting for host stats”, please report the tooltip text and host version.
- The real light-theme host composer has not been compared side by side; light metrics come from the specimen sheet and source token measurements.

## Version note

- **1.3.0**: theme-aware instrument (legible in light), CTX warning redline, minimal warning state, visible page-text/stale markers, fixed `≈` slot, full-page settings section with truthful previews, README specimen sheet; removed the 1.1.0 leftover styles/components and the `style` preference.
- **1.2.0**: restored the pre-1.1.0 classic dual dial; kept the 1.1.0 measurement, calibration, performance and settings data layer.
- **1.1.0**: four-style release, retained as a tag and GitHub Release.

## License

MIT
