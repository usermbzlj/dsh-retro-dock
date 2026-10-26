/**
 * The composer slot component. Subscribes to host projections and the chat
 * store, feeds the shared engine, and renders whichever variant (dock/input)
 * matches the saved placement.
 */

import { R } from '../runtime.js';
import { now } from '../clock.js';
import { prefs } from '../prefs.js';
import { engine } from '../engine.js';
import { createT } from '../i18n.js';
import {
  cacheHitPercent,
  contextPercent,
  formatCtx,
  formatHitFromUsage,
  formatHitPercent,
} from '../measure.js';
import {
  usePrefs,
  useEngineVersion,
  useLang,
  useDensity,
  useMeterLoop,
  getMeterReadout,
} from './hooks.js';
import { ClassicGauge } from './classic.js';
import { DesignGauge } from './design-gauge.js';
import { readContextPressure, readCacheHit } from './read-dom.js';
import { formatTurn } from './turn.js';

const h = (...args) => R.h(...args);

const selectRunning = (state) => {
  if (state === null || state === undefined) return null;
  if (typeof state.running === 'boolean') return state.running;
  const calls = state.legacy && state.legacy.runningCalls;
  return Array.isArray(calls) ? calls.length > 0 : null;
};

/** Only the host's own turn flag; `runningCalls` means a tool is running. */
const selectTurnActive = (state) => (
  state !== null && state !== undefined && typeof state.running === 'boolean' ? state.running : null
);

const selectPartial = (state) => (state && state.legacy ? state.legacy.partial : undefined);

/**
 * @param {'dock'|'input'} variant
 */
export const createGauge = (variant) => function GaugeSlot(props) {
  const snapshot = usePrefs();
  const revision = useEngineVersion();
  const lang = useLang(snapshot.lang, props.locale ?? props.lang ?? null);
  const t = R.useMemo(() => createT(lang), [lang]);
  const active = snapshot.placement === variant;

  const rootRef = R.useRef(null);
  const [readout, setReadout] = R.useState(getMeterReadout);
  const [dom, setDom] = R.useState({ ctx: null, hit: null });

  const density = useDensity({ active, rootRef, variant, preference: snapshot.density });

  const projection = typeof props.useProjection === 'function' ? props.useProjection : null;
  const chat = typeof props.useChat === 'function' ? props.useChat : null;

  const stats = projection ? projection('sessionStats') : null;
  const pressure = projection ? projection('contextPressure') : null;
  const usage = projection ? projection('tokenUsage') : null;
  const running = chat ? chat(selectRunning) : null;
  const turnActive = chat ? chat(selectTurnActive) : null;
  const partial = chat ? chat(selectPartial) : null;

  const projectedCtx = contextPercent(pressure);
  const projectedHit = cacheHitPercent(usage);

  useMeterLoop({ active, rootRef, scale: snapshot.scale, style: snapshot.style, onReadout: setReadout });

  R.useEffect(() => {
    if (!active) return;
    engine.setRunning(running);
  }, [active, running]);

  R.useEffect(() => {
    if (!active) return;
    engine.setTurnActive(turnActive, now());
  }, [active, turnActive]);

  R.useEffect(() => {
    if (!active) return;
    if (!chat) {
      engine.setStream({ ok: false });
      return;
    }
    const blocks = partial && typeof partial === 'object' ? partial.blocks : undefined;
    const broken = partial !== null && partial !== undefined && !Array.isArray(blocks);
    engine.setStream({ ok: true, broken });
    if (partial === null) {
      // The host clears the partial between generations. Drop the counter so
      // the next generation is not counted against the previous one, but keep
      // the 1.2 s rate window so the main needle decays instead of snapping to
      // zero when the CTX/HIT sub-dial refreshes at the step boundary.
      engine.endGeneration();
      return;
    }
    if (!broken && Array.isArray(blocks)) engine.notePartial(blocks, now());
  }, [active, partial, chat]);

  R.useEffect(() => {
    if (!active) return;
    engine.setStats(stats, now());
  }, [active, stats]);

  R.useEffect(() => {
    if (!active) return undefined;
    if (projectedCtx !== null && projectedHit !== null) {
      setDom((previous) => (previous.ctx === null && previous.hit === null ? previous : { ctx: null, hit: null }));
      return undefined;
    }
    let cancelled = false;
    const read = () => {
      if (cancelled) return;
      const next = {
        ctx: projectedCtx === null ? readContextPressure() : null,
        hit: projectedHit === null ? readCacheHit() : null,
      };
      setDom((previous) => (previous.ctx === next.ctx && previous.hit === next.hit ? previous : next));
    };
    read();
    const timer = setInterval(read, 1000);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [active, projectedCtx, projectedHit]);

  if (!active) return null;

  const ctxValue = projectedCtx ?? dom.ctx ?? null;
  const ctxText = formatCtx(ctxValue);
  const ctxDisplay = ctxText === '—' ? '—' : `${ctxText}%`;

  const hitText = usage && typeof usage === 'object'
    ? formatHitFromUsage(usage)
    : formatHitPercent(dom.hit);
  const hitDisplay = hitText === '—' ? '—' : `${hitText}%`;
  const hitValue = projectedHit ?? dom.hit ?? 0;

  const source = projectedCtx !== null && projectedHit !== null
    ? 'projection'
    : projectedCtx !== null || projectedHit !== null
      ? 'mixed'
      : 'dom';
  const sourceText = t(source === 'projection'
    ? 'sourceProjection'
    : source === 'mixed' ? 'sourceMixed' : 'sourceDom');

  const calibration = engine.getCalibration();
  const calibrationText = calibration.status === 'pending'
    ? t('calibrationPending')
    : calibration.status === 'unavailable'
      ? t('calibrationUnavailable')
      : calibration.samples > 0
        ? `${t('calibration')} ×${calibration.factor.toFixed(2)} · ${t('samples', { n: calibration.samples })}`
        : t('notCalibrated');

  const turnText = formatTurn(engine.getLastTurn(), t);
  const vm = {
    style: snapshot.style,
    density,
    placement: variant,
    live: readout.live,
    tps: readout.tps,
    displayTps: String(readout.tps),
    ctxValue: ctxValue ?? 0,
    ctxKnown: ctxValue !== null,
    ctxText,
    ctxDisplay,
    hitValue,
    hitKnown: hitText !== '—',
    hitText,
    hitDisplay,
    warn: ctxValue !== null && ctxValue >= snapshot.warnAt,
    warnAt: snapshot.warnAt,
    stale: engine.isStreamBroken(),
    sub: snapshot.sub,
    static: false,
    source,
    sourceText,
    calibrationText,
    turnText: turnText ? `${t('turnLabel')}${turnText}` : '',
    scale: snapshot.scale,
    revision,
  };

  const GaugeView = snapshot.style === 'classic' ? ClassicGauge : DesignGauge;
  return h(GaugeView, {
    vm,
    t,
    rootRef,
    onToggle: () => prefs.set({ placement: variant === 'dock' ? 'input' : 'dock' }),
  });
};
