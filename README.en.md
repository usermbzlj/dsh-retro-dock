# DSH Retro Dock

A classic dual-dial instrument for the DeepSeek Harness composer: live tokens per second on the main dial, context pressure and session cache hit on the sub dial. The visual layer is back to the pre-1.1.0 design; the 1.1.0 measurement engine, calibration and idle performance work stay underneath.

![Classic dual dial](docs/classic-dark.jpg)

> [Settings panel](docs/settings-dark.jpg) · [Measurement contract](MEASUREMENT.md) · [Changelog](CHANGELOG.md) · [中文](README.md)

## Look

- **Main dial**: 240° sweep, ticks at 0 / 60 / 120 / 180, tapered needle; 0–180 tok/s by default, configurable 120 / 240 / 300. Past full scale the needle stops and the ring enters a cyan overspeed glow while the number keeps rising.
- **Sub dial**: 38px dual rings, amber CTX and cyan HIT, with two readout rows. CTX turns orange at the warning threshold (80% by default).
- **Placement**: click the gauge to move between the composer and the stats bar; persisted.
- **Density**: composer full / compact / minimal at the original 860 / 620 thresholds; stats bar full / minimal at 560. Minimal folds the sub dial into `CTX · HIT`.
- **Theme**: the classic instrument is dark; the settings page follows the host light/dark theme.
- No style switcher and no gear button. Preferences live in host Settings → Retro Dock.

## Features

- **Rate**: 1.2 s window, incremental stream counting, calibrated against host `sessionStats` token deltas (factor bounded 0.4–2.5).
- **CTX / HIT**: host `contextPressure` and `tokenUsage`, with the host's exact cache-hit formatting.
- **Settings**: placement, density, full scale, CTX warning threshold, sub-readout switch, language and calibration reset in a host `settings.section`.
- **Language**: Chinese / English / follow host.
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

Confirm `dsh.profile.bundles` in the profile contains `@local/retro-dock`, then restart DSH. Local package: `npm pack` (1.2.0).

> The 1.1.0 four-style release remains available as history; current `main` is the 1.2.0 classic gauge.

## Interaction

- Click the gauge to toggle placement.
- Keyboard: focus the gauge, then `Enter` / `Space`.
- Settings: host Settings → Retro Dock (no in-gauge gear).
- Preference key: `dsh-retro-dock:prefs:v2`; legacy `rg-gauge-placement` migrates automatically.

## Measurement

Priority: host projections (`contextPressure`, `tokenUsage`, `sessionStats`) → chat store (`useChat(s => s.legacy.partial)`, model output only) → DOM text fallback (named in the tooltip).

The rate is an estimate plus calibration, not server-side token accounting. The tooltip shows the factor and sample count, or `Not calibrated yet` / `Waiting for host stats` / `Calibration unavailable`. See [MEASUREMENT.md](MEASUREMENT.md).

## Compatibility

- Platform: web (Chromium).
- Host: `dsh >= 0.2.0-rc.1 < 0.3.0`; developed against `0.2.1-rc.3`.
- Classic instrument is dark-only; settings follow the host theme.
- Known limits: calibration needs `sessionStats`; the DOM fallback is less trustworthy; a real-session trace is still pending.

## Development

```bash
npm install
npm run build      # bundles src/ into client.js
npm test           # 42 tests
npm run preview    # builds docs/gallery.html
npm run shots      # needs Chromium: npx playwright install chromium
```

`client.js` is generated. Source: `measure.js`, `stream.js`, `rate.js`, `engine.js`, `prefs.js`, `i18n.js`, `ui/classic.js`, `ui/gauge.js`, `ui/settings.js`, `styles/`. Tests cover measurement, incremental counting, calibration, preference migration, i18n, classic gauge SSR, jsdom mount/stream/placement, and the built bundle contract. CI builds, checks `client.js`, and runs the suite.

## Verification

- 42/42 tests pass; the classic gauge and settings page are rendered in Chromium (`docs/classic-dark.jpg`, `docs/settings-dark.jpg`).
- A live-session trace has not been captured yet. After a refresh, the tooltip should show `Source projection` and a calibration factor; if it shows `DOM fallback` or stays at `Waiting for host stats`, please report the tooltip text and host version.

## Version note

- **1.2.0**: restores the pre-1.1.0 classic dual dial; keeps the 1.1.0 measurement, calibration, performance and settings data layer.
- **1.1.0**: four-style release, retained as a tag and GitHub Release.

## License

MIT
