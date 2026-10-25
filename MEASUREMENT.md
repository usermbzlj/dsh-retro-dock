# Measurement contract

Retro Dock is an instrument, so every number needs a stated method. This file is
the contract; the UI is the display. The 1.2.0 classic dual dial uses all of it.

| Reading | Source | Kind | Range |
| --- | --- | --- | --- |
| `tok/s` | chat stream partial + `sessionStats` | estimate, calibrated | 0–full scale, overspeed visual |
| `CTX` | `contextPressure` projection | direct | 0–100% |
| `HIT` | `tokenUsage` projection | direct, derived | 0–100% |

## Live token rate (`tok/s`)

- **Measurand**: estimated output-token rate over a sliding **1.2 s** window.
- **What is counted**: model output in the streaming partial — `text`,
  `reasoning` and `argsRaw`. Block metadata (`kind`, `callId`, tool name, ids) is
  excluded. Tool results are not model output and are ignored.
- **How it is counted**: incrementally. The counter keeps the previous text per
  block and tokenizes only the appended slice; a new generation or a **total
  decrease** restarts the count. A block rewrite or drop that still grows the
  generation is counted as a delta, so a transient host rewrite cannot make the
  needle drop to zero. This keeps a long generation O(delta) instead of O(n²).
- **Character weights**: **0.6 token/CJK character**, **0.3 token/ASCII letter**
  and digit, 0.06 for a space, 0.1 for newline/tab, 0.35 for other punctuation.
  These are documented estimates, not tokenizer output.
- **Window and smoothing**: tokens in the last 1.2 s are summed, divided by the
  window and multiplied by the current calibration factor; the displayed value
  is exponentially smoothed at roughly 60 fps.
- **Display**: `≈` plus a rounded integer. Below 2 tok/s the meter reads idle
  (`0`); the estimate is not a claim of exact token accounting.

## Calibration

The host's durable `sessionStats` projection exposes `decodeTokens` and
`decodeMs`. Retro Dock compares **token deltas over the same interval**:

1. On the first valid sample, record the current host `decodeTokens` and the
   plugin's estimated total as the baseline.
2. On later samples, `realDelta = decodeTokens - baseline` and
   `estDelta = estimatedTotal - estimateBaseline`.
3. Accept a sample when `realDelta >= 20` and `estDelta >= 8`. The target is
   `realDelta / estDelta`, clamped to **0.4–2.5**, and the factor moves 25% of
   the way toward it.
4. A session switch (host `decodeTokens` drops below half) resets the session,
   the counter and the factor. A generation restart keeps the learned factor.
5. Manual reset sets the factor to 1 and clears samples, but keeps the session.

Comparing deltas (not a session average vs a single generation) keeps the factor
valid across turns, tool waits and reloads. The tooltip shows the factor and
sample count.

Calibration state is explicit:

- **pending** — the host has not served a usable `sessionStats` sample yet.
- **available** — a valid sample exists; `0 samples` means “not calibrated yet”.
- **unavailable** — a valid sample was seen before and has since disappeared or
  become invalid.

## Context occupancy (`CTX`)

- **Source**: host `contextPressure` projection.
- **Formula**: `min(100, round((projectedTokens ?? pressureTokens) / contextWindow * 100))`.
- **Semantics**: current context occupancy, not whole-session usage.
- **Display**: integer percent, no warning marker in the numeral. At or above the
  configured threshold (70 / 80 / 90) the row turns amber and `data-warn="1"` is
  set. The threshold is a warning, not a measurement range.

## Cache hit (`HIT`)

- **Source**: host `tokenUsage` projection.
- **Formula**:
  `cacheReadTokens / (uncachedInputTokens + cacheReadTokens + cacheWriteTokens) * 100`.
  The three buckets are treated as disjoint, matching the host's
  `billedInputTokens`.
- **Formatting**: host-compatible. An integer when integer rounding stays below
  100; otherwise the minimum precision that remains below 100 (`99.9`, `99.99`,
  …); an exact full hit is `100`; no billed input is `—`.
- **Semantics**: whole-session cumulative cache-hit share, not the current
  request. The tooltip says “会话累计 / session”.

## Range and resolution

- Full scale is configurable: **120 / 180 / 240 / 300 tok/s**, 240°, with index
  ticks at 0 / 60 / 120 / 180 in the default 180 range.
- Above the full scale the needle sits at its stop and the ring enters the
  overspeed state. That state is a **visual** overflow indication, not a
  calibrated range; the numeric readout keeps rising.
- Resolution is 1 tok/s. Below 2 tok/s the readout is idle.

## Failure modes

- **Projections available**: CTX/HIT are read directly; no DOM parsing.
- **Projections missing**: CTX/HIT fall back to host-visible text. HIT accepts
  both `缓存命中` and `Cache hit` with up to eight non-digit characters before
  the number. The tooltip names the source (`投影`, `混合`, `DOM 回退`).
- **Chat stream contract broken**: the meter fails closed — `data-stale="1"`,
  the rate reads 0 and the tooltip says the source is unavailable — instead of
  counting unrelated DOM mutations.
- **No chat hook**: the meter may fall back to DOM observation. The observer is
  attached only while the stream is unavailable, ignores the composer, this
  plugin's own nodes and the first 750 ms after attach, and restarts the
  generation on bulk mutations.
- **`sessionStats` missing**: calibration is `pending` and then `unavailable`;
  the raw estimate still works but is not claimed as calibrated.

## Performance model

- Stream counting is incremental (O(delta)).
- The rAF loop drives CSS variables (`--rg-p`, `--rg-over`) and stops once the
  needle settles and no token has arrived for 2.4 s; React only receives a
  rounded readout at about 8 Hz. When the loop resumes, the meter clock is
  primed so the first tick cannot apply a huge dt, and the frame dt is capped at
  50 ms.
- The body `MutationObserver` is attached only when the chat stream is
  unavailable, and is detached as soon as the stream becomes available.
- Density uses a `ResizeObserver` per gauge, not a per-frame width poll.
- The settings page has no timers beyond the preference store.

## Verification

- `npm test` — 44 tests:
  - measurement pure functions and host-compatible HIT formatting;
  - incremental stream counting, rewind/reset behaviour;
  - 1.2 s window, calibration deltas, bounds, generation/session resets;
  - preference validation and legacy migration;
  - i18n resolution and interpolation;
  - SSR rendering of the classic gauge (readouts, density, warning, aria);
  - jsdom integration: mount, stream update, placement toggle and preference
    persistence;
  - the built `client.js` ModuleLoader contract.
- `npm run shots` renders the same components in Chromium and writes
  `docs/classic-*.jpg`, `docs/settings-*.jpg`.
- **Not yet verified**: a live-session trace of `window.__retroDock` against the
  host's `sessionStats`. Until that exists, the calibration accuracy is
  unmeasured, not “known good”.

## Known limitations

- Character weights are approximations; a mixed CJK/Latin stream can shift the
  estimate even after calibration.
- Tool-call arguments often arrive as one burst at block end; the 1.2 s window
  can show a spike that is not steady decode speed.
- The calibration factor is bounded and smoothed; it is not a laboratory
  calibration.
- HIT is whole-session cumulative, not the current request's hit rate.
- The overspeed region is a visual overflow state, not a calibrated measurement.
