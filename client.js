window.__ModuleLoader__.load({
  id: '@local/retro-dock',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    // ============================================================
    // Two dials, drawn as SVG instruments.
    //   main 56px: 240° arc, 4 index ticks, tapered needle
    //   sub  38px: one ring — arc length = CTX, a radial tick's
    //              position = cache hit rate
    // Readouts are single-line (value + unit) and a two-row table.
    // Palette: blue = rate, white = structure, amber = CTX >= 80.
    // ============================================================
    const MAIN_TRACK = '71.2 107';
    const SUB_TRACK = '71.2 107';
    const HIT_TRACK = '48.2 72.3';

    const placements = new Set();
    let placement = 'dock';
    try {
      if (typeof window !== 'undefined' && window.localStorage.getItem('rg-gauge-placement') === 'input') placement = 'input';
    } catch {}

    const notifyPlacement = () => {
      for (const listener of placements) listener(placement);
    };
    const setPlacement = (next) => {
      placement = next === 'input' ? 'input' : 'dock';
      try {
        window.localStorage.setItem('rg-gauge-placement', placement);
      } catch {}
      notifyPlacement();
    };
    const usePlacement = () => {
      const [value, setValue] = React.useState(placement);
      React.useEffect(() => {
        placements.add(setValue);
        setValue(placement);
        return () => placements.delete(setValue);
      }, []);
      return value;
    };

    const CSS = String.raw`
.rg-gauge {
  --rg-accent: #7aa2ff;
  --rg-warn: #e0a878;
  --rg-size: 56px;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--rg-size) * 0.42);
  height: calc(var(--rg-size) + 8px);
  margin: 0 14px 0 2px;
  padding: 0;
  flex: 0 0 auto;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
}

.rg-module {
  display: inline-flex;
  align-items: center;
  gap: calc(var(--rg-size) * 0.13);
}

.rg-dial {
  display: block;
  width: var(--rg-size);
  height: var(--rg-size);
  flex: 0 0 auto;
  overflow: visible;
}

.rg-dial-minor {
  width: calc(var(--rg-size) * 0.68);
  height: calc(var(--rg-size) * 0.68);
}

.rg-track {
  fill: none;
  stroke: rgba(232, 238, 252, .16);
  stroke-width: 2.5;
  stroke-linecap: butt;
}

.rg-arc {
  fill: none;
  stroke: var(--rg-arc-color, var(--rg-accent));
  stroke-width: 2.5;
  stroke-linecap: round;
}

.rg-ticks line {
  stroke: rgba(232, 238, 252, .5);
  stroke-width: .7;
}

.rg-needle-group {
  transform: rotate(calc(150deg + var(--rg-g, 0) * 2.4deg));
  transform-origin: 20px 20px;
}

.rg-needle {
  stroke: #e8eefc;
  stroke-width: 1.4;
  stroke-linecap: round;
  filter: brightness(.9) drop-shadow(0 0 1.5px rgba(255, 255, 255, calc(.22 - var(--rg-over, 0) * .22)));
}
.rg-hub { fill: #e8eefc; filter: brightness(.88); }

.rg-dial-minor .rg-track,
.rg-dial-minor .rg-arc {
  stroke-width: 2.5;
}

.rg-dial-minor .rg-track { stroke: rgba(232, 238, 252, .13); stroke-width: 1.5; }
.rg-dial-minor .rg-arc-ctx { stroke-width: 1.5; stroke-linecap: round; }

.rg-arc-ctx { stroke: var(--rg-warn); }

.rg-gauge[data-warn="1"] .rg-arc-ctx { stroke: var(--rg-warn); }

/* overspeed shows up as a warm halo rather than a hue shift */
.rg-arc-rate {
  /* the halo locks on once the needle reaches the stop: it stops tracking
     the overspeed value so a trembling needle does not pulse the glow */
  filter: drop-shadow(0 0 calc(min(1, var(--rg-over, 0) * 3) * 5px) rgba(95, 224, 207, calc(min(1, var(--rg-over, 0) * 3) * 0.5)));
}

.rg-track-hit { stroke: rgba(116, 214, 192, .16); stroke-width: 1; }

.rg-arc-hit {
  stroke: #74d6c0;
  stroke-width: 1;
  stroke-linecap: round;
}

.rg-read {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 3px;
  line-height: 1;
}

.rg-value {
  display: inline-block;
  min-width: 2.4ch;
  text-align: left;
  font-family: inherit;
  font-size: calc(var(--rg-size) * 0.31);
  font-weight: 600;
  letter-spacing: .01em;
  color: #e8eefc;
}

.rg-gauge[data-negative="1"] .rg-value { color: var(--rg-warn); }

.rg-unit {
  font-size: calc(var(--rg-size) * 0.12);
  font-weight: 500;
  letter-spacing: .18em;
  color: rgba(232, 238, 252, .34);
}

.rg-read-minor {
  display: flex;
  flex-direction: column;
  gap: 5px;
  line-height: 1;
}

.rg-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: calc(var(--rg-size) * 0.62);
}

.rg-tag {
  font-size: calc(var(--rg-size) * 0.12);
  font-weight: 500;
  letter-spacing: .1em;
  color: rgba(232, 238, 252, .34);
}

.rg-num {
  margin-left: auto;
  font-size: calc(var(--rg-size) * 0.19);
  font-weight: 600;
  letter-spacing: .01em;
  color: #e8eefc;
}

/* input-dock variant: centered above the composer */
.rg-gauge[data-variant="input"] {
  display: flex;
  width: max-content;
  margin: 6px auto;
}

/* density: when space is tight the sub dial folds into text */
.rg-meta {
  display: none;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
  font-size: calc(var(--rg-size) * 0.13);
  font-weight: 500;
  letter-spacing: .12em;
  color: rgba(232, 238, 252, .42);
}

.rg-meta b { font-weight: 600; color: rgba(232, 238, 252, .7); }

.rg-gauge[data-density="minimal"] .rg-module-minor { display: none; }
.rg-gauge[data-density="minimal"] .rg-meta { display: flex; }

/* narrow opt-out: only the host activity pill's leading icon, nothing else */
[data-composer-stat="activity"] > * > svg { display: none; }

@media (prefers-reduced-motion: reduce) {
  .rg-needle-group, .rg-arc { transition: none; }
}
`;

    // rough token weights per character class: CJK is close to one token per
    // character, latin runs about four characters per token
    const tokenWeight = (code) => {
      if (code >= 0x2e80) return 0.75;
      if (code >= 48 && code <= 57) return 0.28;
      if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) return 0.25;
      if (code === 32) return 0.06;
      if (code === 10 || code === 9) return 0.1;
      return 0.35;
    };
    const countTokens = (text) => {
      let total = 0;
      for (const char of text) total += tokenWeight(char.codePointAt(0));
      return total;
    };
    const countStreamTokens = (value) => {
      let total = 0;
      const walk = (node) => {
        if (typeof node === 'string') total += countTokens(node);
        else if (Array.isArray(node)) for (const item of node) walk(item);
        else if (node !== null && typeof node === 'object') {
          for (const key of Object.keys(node)) walk(node[key]);
        }
      };
      walk(value);
      return total;
    };

    function readContextPressure() {
      const dock = document.querySelector('[data-composer-dock]');
      if (dock === null) return null;
      for (const node of dock.querySelectorAll('span, div')) {
        if (node.closest('.rg-gauge') !== null) continue;
        if (node.children.length > 0) continue;
        const text = (node.textContent || '').trim();
        if (/^\d{1,3}%$/.test(text)) return Number(text.slice(0, -1));
      }
      return null;
    }

    function readCacheHit() {
      const node = document.querySelector('[data-composer-stat="usage"]');
      const match = node ? /缓存命中\s*([\d.]+)\s*%/.exec(node.textContent || '') : null;
      return match === null ? null : Number(match[1]);
    }

    function LiveGauge({ variant, useProjection, useChat }) {
      const current = usePlacement();
      // The host provides useProjection to slot components; when it is absent
      // the estimate stands on its own.
      const projectionHook = typeof useProjection === 'function' ? useProjection : null;
      const stats = projectionHook === null ? null : projectionHook('sessionStats');
      const chatHook = typeof useChat === 'function' ? useChat : null;
      const running = chatHook === null ? null : chatHook((state) => state.running);
      const partial = chatHook === null ? null : chatHook((state) => state.legacy && state.legacy.partial);
      React.useEffect(() => {
        if (typeof window === 'undefined') return;
        window.__dshRunning = running === null ? undefined : !!running;
        if (chatHook === null) return;
        window.__dshStreamOk = true;
        window.__dshStreamTokens = partial === null || partial === void 0 ? 0 : countStreamTokens(partial.blocks);
      }, [running, partial, chatHook]);
      React.useEffect(() => {
        if (stats === null || typeof stats !== 'object') return;
        const decodeMs = Number(stats.decodeMs) || 0;
        const decodeTokens = Number(stats.decodeTokens) || 0;
        if (decodeMs < 800 || decodeTokens < 40) return;
        const realAvg = decodeTokens / (decodeMs / 1000);
        const estAvg = Number(window.__dshLiveAvg) || 0;
        if (estAvg < 4 || realAvg < 4) return;
        const target = Math.min(2.5, Math.max(0.4, realAvg / estAvg));
        const previous = Number(window.__dshCalibration) || 1;
        window.__dshCalibration = previous + (target - previous) * 0.25;
      }, [stats]);
      const [tps, setTps] = React.useState(0);
      const [ctx, setCtx] = React.useState(null);
      const [hit, setHit] = React.useState(null);

      React.useEffect(() => {
        const readRate = () => {
          const value = typeof window === 'undefined' ? 0 : Number(window.__dshLiveTps) || 0;
          setTps((previous) => (Math.abs(previous - value) >= 0.4 ? value : previous));
        };
        const readSlow = () => {
          setCtx(readContextPressure());
          setHit(readCacheHit());
        };
        readRate();
        readSlow();
        const rateTimer = setInterval(readRate, 150);
        const slowTimer = setInterval(readSlow, 900);
        return () => {
          clearInterval(rateTimer);
          clearInterval(slowTimer);
        };
      }, []);

      if (current !== variant) return null;

      const magnitude = Math.abs(tps);
      const live = magnitude > 2;
      const display = live ? `${tps < 0 ? '−' : ''}${Math.round(magnitude)}` : '0';
      const ctxValue = ctx === null ? 0 : ctx;
      const hitValue = hit === null ? 0 : hit;
      const ctxDash = `${(ctxValue * 0.712).toFixed(1)} 107`;
      const hitDash = `${(hitValue * 0.482).toFixed(1)} 72.3`;

      return h('span', {
        className: 'rg-gauge',
        'data-live': live ? '1' : '0',
        'data-negative': tps < -2 ? '1' : '0',
        'data-warn': ctxValue >= 80 ? '1' : '0',
        'data-variant': variant,
        role: 'button',
        tabIndex: 0,
        title: live ? `${tps.toFixed(1)} tok/s · 点击切换位置` : '点击切换位置（输入框上方 / 统计条）',
        onClick: () => setPlacement(variant === 'dock' ? 'input' : 'dock'),
        onKeyDown: (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setPlacement(variant === 'dock' ? 'input' : 'dock');
          }
        },
      },
        h('span', { className: 'rg-module' },
          h('svg', { className: 'rg-dial', viewBox: '0 0 40 40' },
            h('circle', {
              className: 'rg-track', cx: 20, cy: 20, r: 17,
              strokeDasharray: MAIN_TRACK, transform: 'rotate(150 20 20)',
            }),
            h('circle', {
              className: 'rg-arc rg-arc-rate', cx: 20, cy: 20, r: 17,
              strokeDasharray: '0 107', transform: 'rotate(150 20 20)',
            }),
            h('g', { className: 'rg-needle-group' },
              h('line', { className: 'rg-needle', x1: 20, y1: 20, x2: 33, y2: 20 })),
            h('circle', { className: 'rg-hub', cx: 20, cy: 20, r: 1.6 })),
          h('span', { className: 'rg-read' },
            h('span', { className: 'rg-value' }, display),
            h('span', { className: 'rg-unit' }, 'tok/s'))),
        h('span', { className: 'rg-module rg-module-minor' },
          h('svg', { className: 'rg-dial rg-dial-minor', viewBox: '0 0 40 40' },
            h('circle', {
              className: 'rg-track', cx: 20, cy: 20, r: 17,
              strokeDasharray: SUB_TRACK, transform: 'rotate(150 20 20)',
            }),
            h('circle', {
              className: 'rg-arc rg-arc-ctx', cx: 20, cy: 20, r: 17,
              strokeDasharray: ctxDash, transform: 'rotate(150 20 20)',
              style: { opacity: ctxValue < 0.6 ? 0 : 1 },
            }),
            h('circle', {
              className: 'rg-track rg-track-hit', cx: 20, cy: 20, r: 11.5,
              strokeDasharray: HIT_TRACK, transform: 'rotate(150 20 20)',
            }),
            h('circle', {
              className: 'rg-arc rg-arc-hit', cx: 20, cy: 20, r: 11.5,
              strokeDasharray: hitDash, transform: 'rotate(150 20 20)',
              style: { opacity: hitValue < 0.6 ? 0 : 1 },
            }),
            ),
          h('span', { className: 'rg-read-minor' },
            h('span', { className: 'rg-row' },
              h('span', { className: 'rg-tag' }, 'CTX'),
              h('span', { className: 'rg-num' }, ctx === null ? '—' : String(Math.round(ctxValue)))),
            h('span', { className: 'rg-row' },
              h('span', { className: 'rg-tag' }, 'HIT'),
              h('span', { className: 'rg-num' }, hit === null ? '—' : String(Math.round(hitValue)))))),
        h('span', { className: 'rg-meta' },
          h('b', null, `CTX ${ctx === null ? '—' : Math.round(ctxValue)}`),
          h('span', null, '·'),
          h('b', null, `HIT ${hit === null ? '—' : Math.round(hitValue)}`)));
    }

    function startMeter(onTick) {
      if (typeof document === 'undefined') return () => {};

      const WINDOW_MS = 1200;
      const stream = [];
      let estimatedTokens = 0;
      let lastStreamTokens = 0;
      let firstTokenAt = 0;
      let lastTokenAt = 0;

      const typed = [];
      let tpsSmooth = 0;
      let last = performance.now();
      let raf = 0;
      let frame = 0;

      const inComposer = (node) => {
        try {
          return node.closest('textarea, input, [contenteditable="true"]') !== null;
        } catch {
          return false;
        }
      };

      const observer = new MutationObserver((records) => {
        // With the chat store available the meter reads streamed blocks, so DOM
        // mutations (expanding reasoning, tool details, history) are irrelevant.
        if (typeof window !== 'undefined' && window.__dshStreamOk === true) return;
        // Expanding a reasoning block or a tool detail mounts text that the
        // model produced earlier; only count mutations while the session runs.
        if (typeof window !== 'undefined' && window.__dshRunning === false) return;
        let delta = 0;
        const bulk = records.length > 80;
        for (const record of records) {
          if (record.type === 'characterData') {
            const parent = record.target && record.target.parentElement;
            if (!parent || inComposer(parent)) continue;
            const after = record.target.data ? record.target.data.length : 0;
            const before = record.oldValue ? record.oldValue.length : 0;
            if (after > before && record.target.data) {
              delta += countTokens(record.target.data.slice(before, after));
            }
          } else if (record.type === 'childList') {
            for (const node of record.addedNodes) {
              if (!node || node.nodeType !== 1 || inComposer(node)) continue;
              const text = node.textContent;
              if (!text) continue;
              // a long re-rendered paragraph is not a session switch: count a
              // bounded slice instead of resetting the meter
              delta += countTokens(text.length > 400 ? text.slice(-400) : text);
            }
          }
        }
        if (bulk || delta > 900) {
          stream.length = 0;
          tpsSmooth = 0;
          return;
        }
        if (delta > 0) {
          const at = performance.now();
          estimatedTokens += delta;
          if (firstTokenAt === 0) firstTokenAt = at;
          lastTokenAt = at;
          stream.push({ t: at, tokens: delta });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true, characterData: true, characterDataOldValue: true });

      const isTyping = (target) => {
        if (!target || typeof target.tagName !== 'string') return false;
        const tag = target.tagName;
        return tag === 'TEXTAREA' || tag === 'INPUT' || target.isContentEditable === true;
      };

      const onInput = (event) => {
        const target = event && event.target;
        if (!isTyping(target)) return;
        const data = event && typeof event.data === 'string' ? event.data : '';
        typed.push({ t: performance.now(), n: data.length > 0 ? data.length : 1 });
      };
      document.addEventListener('input', onInput, true);

      const tick = (now) => {
        raf = requestAnimationFrame(tick);
        const elapsed = Math.min(120, Math.max(0, now - last));
        last = now;
        if (document.hidden) return;
        const dt = elapsed / 16.667;

        if (typeof window !== 'undefined' && window.__dshStreamOk === true) {
          const current = Number(window.__dshStreamTokens) || 0;
          if (current > lastStreamTokens) {
            const at = now;
            estimatedTokens += current - lastStreamTokens;
            if (firstTokenAt === 0) firstTokenAt = at;
            lastTokenAt = at;
            stream.push({ t: at, tokens: current - lastStreamTokens });
          }
          lastStreamTokens = current;
        }
        while (stream.length > 0 && now - stream[0].t > WINDOW_MS) stream.shift();
        let streamed = 0;
        for (const sample of stream) streamed += sample.tokens;
        const calibration = typeof window !== 'undefined' ? Number(window.__dshCalibration) || 1 : 1;
        const tps = (streamed / WINDOW_MS) * 1000 * calibration;
        tpsSmooth += (tps - tpsSmooth) * (1 - Math.pow(0.78, dt));

        while (typed.length > 0 && now - typed[0].t > 1200) typed.shift();
        let typedChars = 0;
        for (const sample of typed) typedChars += sample.n;
        const typingRate = (typedChars / 1200) * 1000;
        const net = tpsSmooth - typingRate;

        frame += 1;
        if ((frame & 7) === 0 && typeof window !== 'undefined') {
          window.__dshLiveTps = Math.round(net * 10) / 10;
          const span = lastTokenAt - firstTokenAt;
          window.__dshLiveAvg = span > 2000 ? estimatedTokens / (span / 1000) : 0;
        }
        if (typeof onTick === 'function') {
          try {
            onTick(net);
          } catch {}
        }
      };

      raf = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
        document.removeEventListener('input', onInput, true);
        if (typeof window !== 'undefined') window.__dshLiveTps = 0;
      };
    }

    function mount() {
      let disposed = false;
      let stop = null;
      let timer = 0;
      const style = document.createElement('style');
      style.dataset.plugin = '@local/retro-dock';
      style.dataset.pluginCss = '@local/retro-dock/gauge.css';
      style.textContent = CSS;

      const attach = () => {
        if (disposed) return;
        if (!document.head || !document.body) {
          timer = setTimeout(attach, 40);
          return;
        }
        document.head.appendChild(style);
        try {
          let needle = 0;
          let needleVelocity = 0;
          let displaySpeed = 0;
          let overspeed = 0;
          let layoutTick = 0;
          let lastWidth = -1;
          let lastDensity = '';
          const STIFFNESS = 0.09;
          const DAMPING = 0.7;
          stop = startMeter((value) => {
            const raw = Math.max(0, value);
            const target = Math.min(100, raw / 1.8);
            const over = Math.max(0, Math.min(1, (raw - 180) / 120));
            // past the ceiling the movement loses its damping and the needle
            // rattles against the stop instead of settling
            const damping = DAMPING - over * 0.55;
            needleVelocity += (target - needle) * STIFFNESS - needleVelocity * damping;
            needle += needleVelocity;
            if (needle < 0) { needle = 0; needleVelocity = 0; }
            if (needle > 100) { needle = 100; needleVelocity = -Math.abs(needleVelocity) * 0.55; }
            displaySpeed += (raw - displaySpeed) * 0.2;
            overspeed += (over - overspeed) * 0.12;
            const tail = Math.max(0, (over - 0.5) / 0.5);
            const hue = 222 + (172 - 222) * Math.min(1, over / 0.5);
            const sat = over <= 0.5 ? 100 + (67 - 100) * (over / 0.5) : 67 + (78 - 67) * tail;
            const lig = over <= 0.5 ? 74 + (62 - 74) * (over / 0.5) : 62 + (94 - 62) * Math.pow(tail, 0.8);
            const arcColor = `hsl(${hue.toFixed(0)} ${sat.toFixed(0)}% ${lig.toFixed(0)}%)`;
            const clock = performance.now();
            const shake = over > 0
              ? (Math.sin(clock * 0.031) * 0.9 + Math.sin(clock * 0.079) * 0.5) * over
              : 0;
            const needleText = Math.min(102, Math.max(0, needle + shake)).toFixed(1);
            const overText = overspeed.toFixed(3);
            const dash = `${(Math.min(100, needle) * 0.712).toFixed(1)} 107`;
            layoutTick += 1;
            const clusters = document.querySelectorAll('.rg-gauge');
            for (const cluster of clusters) {
              cluster.style.setProperty('--rg-g', needleText);
              cluster.style.setProperty('--rg-over', overText);
              cluster.style.setProperty('--rg-arc-color', arcColor);
              const arc = cluster.querySelector('.rg-arc-rate');
              if (arc !== null) {
                arc.setAttribute('stroke-dasharray', dash);
                arc.style.opacity = needle < 0.6 ? '0' : '1';
              }
              const readout = cluster.querySelector('.rg-value');
              if (readout !== null) {
                const instant = value;
                const text = instant < -2
                  ? '−' + String(Math.round(-instant))
                  : String(Math.round(displaySpeed));
                if (readout.textContent !== text) readout.textContent = text;
              }
              if (layoutTick % 30 === 0) {
                const host = cluster.parentElement;
                const width = host && host.clientWidth ? host.clientWidth : window.innerWidth;
                if (width !== lastWidth) {
                  lastWidth = width;
                  const isInput = cluster.dataset.variant === 'input';
                  const density = isInput
                    ? (width >= 860 ? 'full' : width >= 620 ? 'compact' : 'minimal')
                    : (width >= 560 ? 'full' : 'minimal');
                  if (lastDensity !== density) {
                    lastDensity = density;
                    cluster.dataset.density = density;
                    const size = isInput
                      ? (density === 'full' ? 56 : density === 'compact' ? 50 : 44)
                      : (density === 'full' ? 42 : 38);
                    cluster.style.setProperty('--rg-size', size + 'px');
                  }
                }
              }
            }
          });
        } catch {
          stop = null;
        }
      };
      attach();

      return () => {
        disposed = true;
        if (timer) clearTimeout(timer);
        if (stop) stop();
        style.remove();
      };
    }

    return {
      inject: ['slots'],
      apply(ctx) {
        if (typeof document === 'undefined') return;
        if (typeof ctx.effect === 'function') {
          ctx.effect(() => mount());
        } else {
          const dispose = mount();
          if (typeof ctx.on === 'function') ctx.on('dispose', dispose);
        }
        ctx.slots.inject('conversation.composer.dock', () => ctx.slots.register({
          name: 'conversation.composer.dock',
          id: 'rg-live-gauge',
          order: -10,
        }, (props) => h(LiveGauge, { ...props, variant: 'dock' })));
        ctx.slots.inject('conversation.input.dock', () => ctx.slots.register({
          name: 'conversation.input.dock',
          id: 'rg-live-gauge-input',
          order: 5,
        }, (props) => h(LiveGauge, { ...props, variant: 'input' })));
      },
    };
  },
});
