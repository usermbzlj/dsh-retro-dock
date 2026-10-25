# DSH Retro Dock

Instrument dials for the DeepSeek Harness composer: live tokens per second, context pressure and session cache hit — in four visual styles, following the host light/dark theme, docked above the composer or in the stats bar.

![Four styles (dark)](docs/styles-dark.jpg)

> [Light version](docs/styles-light.jpg) · [Settings panel](docs/settings-dark.jpg) · [Measurement contract](MEASUREMENT.md) · [Changelog](CHANGELOG.md) · [中文](README.md)

## Styles

| Style | Character |
| --- | --- |
| **Heritage** | Brushed bezel, fine ticks, redline and an ivory needle — a classic mechanical dial. |
| **Neon HUD** | Gradient arc, endpoint bloom and scanlines — a cyber instrument with monospace readouts. |
| **Minimal** | Hairline arc, single endpoint and generous space; CTX/HIT become thin tracks. |
| **Terminal** | Monospace cells and phosphor scanlines; paper-green in light mode, CRT in dark. |

All four read the same projections, share the same calibration and the same placement preference.

## Features

- **Rate**: estimated tok/s in a 1.2 s window, prefixed with `≈`; full scale 120 / 180 / 240 / 300; past the stop the ring enters an overspeed state while the number keeps rising.
- **CTX / HIT**: current context occupancy and whole-session cache hit from host projections; CTX warning threshold 70 / 80 / 90; HIT precision matches the host stats pill.
- **Placement**: click the gauge to move between the composer and the stats bar; also available in settings. Persisted in localStorage.
- **Density**: full / compact / minimal based on the parent width; minimal folds CTX/HIT into one line. Can be pinned in settings.
- **Settings**: a gear popover anchored to the gauge, plus a full `Retro Dock` section in the host settings. Style, placement, density, scale, warning threshold, sub-readouts, language and calibration reset.
- **Language**: Chinese / English / follow host, including labels, tooltips, aria and the settings page.
- **Theme**: follows the host `body[data-ds-dark-theme]`; separate light palettes, no extra theme switch.
- **Performance**: rAF stops when idle; the DOM observer is detached when the chat store is available; stream counting is incremental; density uses a ResizeObserver.
- **Privacy**: no network requests, no credential access; one preference key. `window.__retroDock` exposes engine state for debugging.

## Install

Check the profile first: `dsh web` uses the `web` profile; the desktop app uses `desktop`.

**DSH Web**

```bash
npx @deepseek-ai/dsh plugin --profile web add github:usermbzlj/dsh-retro-dock
```

**Desktop**

Install from Settings → Plugins, use the built-in command runtime, or edit the profile directly:

```bash
cd ~/.dsh/profiles/desktop
pnpm add github:usermbzlj/dsh-retro-dock
```

After installing, confirm `dsh.profile.bundles` in `~/.dsh/profiles/<profile>/package.json` contains `@local/retro-dock`; add it manually if the CLI did not, then restart DSH. A refresh or restart is required because client plugins are loaded at startup.

**Local build**

```bash
npm pack   # local-retro-dock-1.1.0.tgz
```

Or download the [v1.1.0 release tarball](https://github.com/usermbzlj/dsh-retro-dock/releases/download/v1.1.0/local-retro-dock-1.1.0.tgz).

## Interaction

- Click the gauge to switch placement.
- Click the gear for the settings popover; `Esc` or an outside click closes it and returns focus to the gear.
- Keyboard: focus the gauge and press `Enter` / `Space` to toggle placement.
- Host settings: Settings → Retro Dock, sharing the same preference store.
- Preference key: `dsh-retro-dock:prefs:v2`; the old `rg-gauge-placement` key is migrated and removed.

## Measurement

Source priority: host projections (`contextPressure`, `tokenUsage`, `sessionStats`) → chat store (`useChat(s => s.legacy.partial)`, model output only) → DOM text fallback (named in the tooltip).

The rate is an **estimate plus calibration**, not server-side token accounting. Calibration compares host `sessionStats` token deltas with the plugin's estimated deltas; the factor is bounded to 0.4–2.5 and smoothed. The tooltip shows `Calibration ×1.12 · 7 samples`, `Not calibrated yet`, or `Calibration unavailable`. Full formulas, failure modes and verification are in [MEASUREMENT.md](MEASUREMENT.md).

## Compatibility

- Platform: web (Chromium-based host).
- Host: `dsh >= 0.2.0-rc.1 < 0.3.0`; developed against `0.2.1-rc.3`.
- Peer: `@deepseek-ai/dsh-client-ui-conversation`.
- Light and dark host themes are both supported.
- Known limits: calibration needs `sessionStats`; the DOM fallback is less trustworthy; a real-session trace is still required before claiming measured accuracy.

## Development

```bash
npm install
npm run build      # bundles src/ into client.js (what the host loads)
npm test           # 43 tests
npm run preview    # builds docs/gallery.html
npm run shots      # needs Chromium: npx playwright install chromium
```

`client.js` is generated. Source layout: `src/measure.js`, `stream.js`, `rate.js`, `engine.js`, `prefs.js`, `i18n.js`, `themes.js`, `ui/`, `styles/`; scripts in `scripts/`. The test suite covers measurement, incremental counting, calibration, preference migration, i18n, SSR rendering of all four styles, jsdom integration (mount/toggle/popover/persistence) and the built bundle's ModuleLoader contract. CI runs `npm ci && npm run build && npm test`.

## Verification

- Automated: 43/43 tests pass; all four styles and the settings page are rendered in Chromium and captured in `docs/`.
- Host runtime: a real session trace has not been captured yet. After a refresh, the tooltip should show `Source projection` and a calibration factor; if it shows `DOM fallback` or `Calibration unavailable`, please report the tooltip text and host version.

## License

MIT
