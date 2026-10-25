/** React-side glue: preference subscription, density observation, rAF loop. */

import { R } from '../runtime.js';
import { now } from '../clock.js';
import { prefs } from '../prefs.js';
import { engine } from '../engine.js';
import { clamp } from '../measure.js';
import { resolveLang } from '../i18n.js';

/** @returns {import('../themes.js').DEFAULT_PREFS} */
export const usePrefs = () => R.useSyncExternalStore(
  prefs.subscribe,
  prefs.getSnapshot,
  prefs.getSnapshot,
);

/** @returns {number} bumped whenever calibration or stream state changes. */
export const useEngineVersion = () => R.useSyncExternalStore(
  engine.subscribe,
  engine.getVersion,
  engine.getVersion,
);

/**
 * @param {'auto'|'zh'|'en'} preference
 * @param {string|null|undefined} hint
 * @returns {'zh'|'en'}
 */
export const useLang = (preference, hint) => {
  const nav = typeof navigator !== 'undefined' ? navigator.language : '';
  const doc = typeof document !== 'undefined' ? document.documentElement.lang : '';
  return R.useMemo(
    () => resolveLang(preference, hint, doc, nav),
    [preference, hint, doc, nav],
  );
};

/**
 * Observe the slot's parent width and derive a density. Per-instance state, so
 * switching placement cannot carry the other variant's size over.
 *
 * @param {{
 *   active: boolean,
 *   rootRef: object,
 *   variant: 'dock'|'input',
 *   preference: 'auto'|'full'|'compact'|'minimal',
 * }} options
 * @returns {'full'|'compact'|'minimal'}
 */
export const useDensity = ({ active, rootRef, variant, preference }) => {
  const [density, setDensity] = R.useState(preference === 'auto' ? 'full' : preference);

  R.useLayoutEffect(() => {
    if (!active || preference !== 'auto') {
      if (preference !== 'auto') setDensity(preference);
      return undefined;
    }
    const element = rootRef.current;
    const parent = element ? element.parentElement : null;
    if (!element || !parent) return undefined;

    const compute = () => {
      const width = parent.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 0);
      const full = variant === 'input' ? 760 : 520;
      const compact = variant === 'input' ? 540 : 380;
      setDensity(width >= full ? 'full' : width >= compact ? 'compact' : 'minimal');
    };

    compute();
    if (typeof ResizeObserver === 'function') {
      const observer = new ResizeObserver(compute);
      observer.observe(parent);
      return () => observer.disconnect();
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', compute);
      return () => window.removeEventListener('resize', compute);
    }
    return undefined;
  }, [active, variant, preference, rootRef]);

  return density;
};

/**
 * Drive the needle/arc CSS variables from the engine at up to 60 fps, but stop
 * the loop as soon as the needle settles and no tokens have arrived for a while.
 * React only sees a rounded readout at ~8 fps.
 *
 * @param {{
 *   active: boolean,
 *   rootRef: object,
 *   scale: number,
 *   onReadout: (value: { tps: number, live: boolean }) => void,
 * }} options
 */
export const useMeterLoop = ({ active, rootRef, scale, onReadout }) => {
  const scaleRef = R.useRef(scale);
  const readoutRef = R.useRef(onReadout);
  scaleRef.current = scale;
  readoutRef.current = onReadout;

  R.useEffect(() => {
    if (!active || typeof window === 'undefined') return undefined;
    const element = rootRef.current;
    if (!element) return undefined;

    const reduced = typeof window.matchMedia === 'function'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let raf = 0;
    let last = now();
    let needle = 0;
    let velocity = 0;
    let over = 0;
    let lastEmit = 0;
    let lastRounded = -1;
    let lastLive = false;

    const frame = () => {
      const time = now();
      const dt = clamp(time - last, 0, 60) / 16.667;
      last = time;
      const tps = engine.sample(time);
      const full = scaleRef.current || 180;
      const target = clamp((tps / full) * 100, 0, 100);
      const overTarget = clamp((tps - full) / (full * 0.6), 0, 1);

      if (reduced) {
        needle = target;
        velocity = 0;
        over = overTarget;
      } else {
        const damping = 0.7 - over * 0.55;
        velocity += ((target - needle) * 0.085 - velocity * damping) * dt;
        needle += velocity * dt;
        if (needle < 0) {
          needle = 0;
          velocity = 0;
        }
        if (needle > 100) {
          needle = 100;
          velocity = -Math.abs(velocity) * 0.55;
        }
        over += (overTarget - over) * (1 - Math.pow(0.86, dt));
      }

      element.style.setProperty('--rg-p', needle.toFixed(2));
      element.style.setProperty('--rg-over', over.toFixed(3));

      if (time - lastEmit > 120) {
        lastEmit = time;
        const rounded = Math.round(tps);
        const live = rounded > 2;
        if (rounded !== lastRounded || live !== lastLive) {
          lastRounded = rounded;
          lastLive = live;
          readoutRef.current({ tps: rounded, live });
        }
      }

      const settled = Math.abs(needle - target) < 0.12
        && Math.abs(velocity) < 0.12
        && over < 0.005;
      const idle = time - engine.lastActivityAt() > 2400 && settled;
      if (idle) {
        raf = 0;
      } else {
        raf = requestAnimationFrame(frame);
      }
    };

    const start = () => {
      if (raf) return;
      last = now();
      raf = requestAnimationFrame(frame);
    };

    start();
    const offActivity = engine.onActivity(start);
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      offActivity();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [active, rootRef]);
};
