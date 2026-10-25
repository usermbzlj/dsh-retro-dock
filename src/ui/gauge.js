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
} from './hooks.js';
import { GaugeView } from './view.js';
import { SettingsPopover } from './settings.js';
import { readContextPressure, readCacheHit } from './read-dom.js';

const h = (...args) => R.h(...args);

const selectRunning = (state) => {
  if (state === null || state === undefined) return null;
  if (typeof state.running === 'boolean') return state.running;
  const calls = state.legacy && state.legacy.runningCalls;
  return Array.isArray(calls) ? calls.length > 0 : null;
};

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
  const gearRef = R.useRef(null);
  const [open, setOpen] = R.useState(false);
  const [readout, setReadout] = R.useState({ tps: 0, live: false });
  const [dom, setDom] = R.useState({ ctx: null, hit: null });
  const [touch] = R.useState(() => (
    typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(hover: none)').matches
  ));

  const density = useDensity({ active, rootRef, variant, preference: snapshot.density });

  const projection = typeof props.useProjection === 'function' ? props.useProjection : null;
  const chat = typeof props.useChat === 'function' ? props.useChat : null;

  const stats = projection ? projection('sessionStats') : null;
  const pressure = projection ? projection('contextPressure') : null;
  const usage = projection ? projection('tokenUsage') : null;
  const running = chat ? chat(selectRunning) : null;
  const partial = chat ? chat(selectPartial) : null;

  const projectedCtx = contextPercent(pressure);
  const projectedHit = cacheHitPercent(usage);

  useMeterLoop({ active, rootRef, scale: snapshot.scale, onReadout: setReadout });

  R.useEffect(() => {
    if (!active) return;
    engine.setRunning(running);
  }, [active, running]);

  R.useEffect(() => {
    if (!active) return;
    if (!chat) {
      engine.setStream({ ok: false });
      return;
    }
    const blocks = partial && typeof partial === 'object' ? partial.blocks : undefined;
    const broken = partial !== null && partial !== undefined && !Array.isArray(blocks);
    engine.setStream({ ok: true, broken });
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

  const vm = {
    style: snapshot.style,
    density,
    placement: variant,
    live: readout.live,
    tps: readout.tps,
    displayTps: String(readout.tps),
    ctxValue: ctxValue ?? 0,
    ctxText,
    ctxDisplay,
    hitValue,
    hitText,
    hitDisplay,
    warn: ctxValue !== null && ctxValue >= snapshot.warnAt,
    stale: engine.isStreamBroken(),
    sub: snapshot.sub,
    static: false,
    source,
    sourceText,
    calibrationText,
    touch,
    position: 0,
    over: 0,
    revision,
  };

  return h(R.React.Fragment, null,
    h(GaugeView, {
      vm,
      t,
      rootRef,
      gearRef,
      onToggle: () => {
        setOpen(false);
        prefs.set({ placement: variant === 'dock' ? 'input' : 'dock' });
      },
      onOpenSettings: () => setOpen((value) => !value),
      settingsOpen: open,
    }),
    h(SettingsPopover, {
      anchorRef: gearRef,
      open,
      onClose: () => setOpen(false),
      t,
    }));
};
