import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

/**
 * Integration test: a real React root, a real jsdom document, and the plugin's
 * apply() with a mocked slot host.
 */
test('the dock mounts, streams, switches styles and toggles placement', async () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="host"></div></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    MutationObserver: globalThis.MutationObserver,
    localStorage: globalThis.localStorage,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT,
  };

  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.localStorage = window.localStorage;
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  const React = await import('react');
  const ReactDOM = await import('react-dom');
  const ReactDOMClient = await import('react-dom/client');
  const { act } = await import('react-dom/test-utils');
  const { createPlugin } = await import('../src/plugin.js');
  const { prefs } = await import('../src/prefs.js');

  const registered = new Map();
  let cleanup = null;
  const ctx = {
    effect(fn) {
      cleanup = fn();
    },
    slots: {
      inject(name, factory) {
        return factory();
      },
      register(definition, Component) {
        registered.set(definition.name, Component);
        return () => {};
      },
    },
  };

  const plugin = createPlugin(React, ReactDOM);
  plugin.apply(ctx);

  assert.ok(registered.has('conversation.composer.dock'));
  assert.ok(registered.has('conversation.input.dock'));
  assert.ok(registered.has('settings.section'));
  assert.ok(window.document.head.querySelector('style[data-plugin-css]'));
  assert.ok(window.__retroDock);

  const projectionListeners = new Set();
  const projections = {
    sessionStats: { decodeTokens: 0, decodeMs: 0 },
    contextPressure: { projectedTokens: 650, contextWindow: 1000 },
    tokenUsage: { cacheReadTokens: 999, uncachedInputTokens: 1, cacheWriteTokens: 0 },
  };
  const useProjection = (key) => React.useSyncExternalStore(
    (listener) => {
      projectionListeners.add(listener);
      return () => projectionListeners.delete(listener);
    },
    () => projections[key],
  );

  const chatListeners = new Set();
  let chatState = {
    running: true,
    legacy: {
      partial: { blocks: [{ kind: 'text', text: 'Hello' }] },
      runningCalls: [],
    },
  };
  const useChat = (selector) => React.useSyncExternalStore(
    (listener) => {
      chatListeners.add(listener);
      return () => chatListeners.delete(listener);
    },
    () => selector(chatState),
  );

  const Dock = registered.get('conversation.composer.dock');
  const container = window.document.getElementById('host');
  const root = ReactDOMClient.createRoot(container);

  await act(async () => {
    root.render(React.createElement(Dock, { useProjection, useChat }));
  });

  let gauge = container.querySelector('.rg-gauge');
  assert.ok(gauge, 'the classic gauge should render');
  assert.equal(gauge.dataset.source, 'projection');
  assert.match(container.textContent, /65/);
  assert.match(container.textContent, /99\.9%/);
  assert.equal(container.querySelector('.rg-gear'), null);

  await act(async () => {
    chatState = {
      running: true,
      legacy: {
        partial: { blocks: [{ kind: 'text', text: 'Hello world, this is a longer streamed answer.' }] },
        runningCalls: [],
      },
    };
    for (const listener of chatListeners) listener();
  });

  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  });

  gauge = container.querySelector('.rg-gauge');
  assert.equal(gauge.dataset.live, '1');
  assert.match(container.querySelector('.rg-value').textContent, /≈[1-9]/);
  assert.ok(gauge.style.getPropertyValue('--rg-p'), 'the frame loop should set the needle variable');

  const node = gauge;
  await act(async () => {
    projections.contextPressure = { projectedTokens: 720, contextWindow: 1000 };
    for (const listener of projectionListeners) listener();
  });
  assert.equal(container.querySelector('.rg-gauge'), node, 'React must not replace the gauge root');
  assert.ok(node.style.getPropertyValue('--rg-p'), 'React re-render must not clear the needle variable');

  await act(async () => {
    projections.sessionStats = { decodeTokens: 0, decodeMs: 0 };
    for (const listener of projectionListeners) listener();
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
  });
  assert.equal(
    container.querySelector('.rg-gauge').dataset.live,
    '1',
    'a stats-projection drop must not zero the live rate',
  );

  await act(async () => {
    projections.tokenUsage = { cacheReadTokens: 980, uncachedInputTokens: 20, cacheWriteTokens: 0 };
    for (const listener of projectionListeners) listener();
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  assert.equal(
    container.querySelector('.rg-gauge').dataset.live,
    '1',
    'a HIT sub-dial refresh must not zero the live rate',
  );

  await act(async () => {
    chatState = { running: true, legacy: { partial: null, runningCalls: [] } };
    for (const listener of chatListeners) listener();
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 150));
  });
  assert.equal(
    container.querySelector('.rg-gauge').dataset.live,
    '1',
    'clearing the partial between generations must not zero the live rate',
  );

  await act(async () => {
    gauge.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  });
  assert.equal(container.querySelector('.rg-gauge'), null);
  assert.equal(prefs.getSnapshot().placement, 'input');
  assert.equal(registered.has('settings.section'), true);

  await act(async () => {
    prefs.set({ placement: 'dock' });
  });
  assert.ok(container.querySelector('.rg-gauge'));

  await act(async () => {
    prefs.set({ lang: 'zh' });
  });

  const Settings = registered.get('settings.section');
  const settingsHost = window.document.createElement('div');
  window.document.body.append(settingsHost);
  const settingsRoot = ReactDOMClient.createRoot(settingsHost);
  await act(async () => {
    settingsRoot.render(React.createElement(Settings));
  });
  const styleOptions = settingsHost.querySelectorAll('.rg-style-option');
  assert.equal(styleOptions.length, 8, 'classic plus seven instrument languages');
  assert.equal(styleOptions[0].getAttribute('aria-label'), '经典 Classic');

  await act(async () => {
    styleOptions[1].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  });
  assert.equal(prefs.getSnapshot().style, 'bench');
  assert.equal(styleOptions[1].getAttribute('aria-pressed'), 'true');
  const benchGauge = container.querySelector('.rg-gauge[data-style="bench"]');
  assert.ok(benchGauge.querySelector('.rgx-bench-dial'));
  assert.ok(benchGauge.style.getPropertyValue('--rg-p'), 'switching styles must re-arm the meter loop on the new root');
  assert.ok(settingsHost.querySelector('.rg-preview-stage .rg-gauge[data-style="bench"]'));

  assert.equal(settingsHost.querySelectorAll('.rg-style-option')[1].getAttribute('aria-pressed'), 'true');

  await act(async () => {
    settingsRoot.unmount();
  });
  settingsHost.remove();

  await act(async () => {
    root.unmount();
  });
  if (typeof cleanup === 'function') cleanup();

  window.close();
  globalThis.window = previous.window;
  globalThis.document = previous.document;
  globalThis.MutationObserver = previous.MutationObserver;
  globalThis.localStorage = previous.localStorage;
  globalThis.requestAnimationFrame = previous.requestAnimationFrame;
  globalThis.cancelAnimationFrame = previous.cancelAnimationFrame;
  globalThis.IS_REACT_ACT_ENVIRONMENT = previous.IS_REACT_ACT_ENVIRONMENT;
});
