import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';

/**
 * Integration test: a real React root, a real jsdom document, and the plugin's
 * apply() with a mocked slot host. Catches hook-order, portal and subscription
 * mistakes that a server render cannot.
 */
test('the plugin mounts, toggles placement and edits prefs through the popover', async () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="host"></div></body></html>', {
    url: 'http://localhost/',
    pretendToBeVisual: true,
  });
  const { window } = dom;
  const previous = {
    window: globalThis.window,
    document: globalThis.document,
    MutationObserver: globalThis.MutationObserver,
    HTMLElement: globalThis.HTMLElement,
    localStorage: globalThis.localStorage,
    requestAnimationFrame: globalThis.requestAnimationFrame,
    cancelAnimationFrame: globalThis.cancelAnimationFrame,
    IS_REACT_ACT_ENVIRONMENT: globalThis.IS_REACT_ACT_ENVIRONMENT,
  };

  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.HTMLElement = window.HTMLElement;
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

  let gauge = container.querySelector('.rg-root');
  assert.ok(gauge, 'the dock gauge should render');
  assert.equal(gauge.dataset.source, 'projection');
  assert.match(container.textContent, /65%/);
  assert.match(container.textContent, /99\.9%/);

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

  gauge = container.querySelector('.rg-root');
  assert.equal(gauge.dataset.live, '1');
  const readout = container.querySelector('.rg-value').textContent;
  assert.match(readout, /≈[1-9]/);

  const gear = container.querySelector('.rg-gear');
  await act(async () => {
    gear.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  });
  const popover = window.document.querySelector('.rg-settings-popover');
  assert.ok(popover, 'the settings popover should portal to body');
  assert.equal(popover.getAttribute('role'), 'dialog');

  const styleButtons = popover.querySelectorAll('.rg-style-tile');
  assert.equal(styleButtons.length, 4);
  await act(async () => {
    styleButtons[3].dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  });
  assert.equal(prefs.getSnapshot().style, 'terminal');
  assert.equal(container.querySelector('.rg-root').dataset.style, 'terminal');

  await act(async () => {
    window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  });
  assert.equal(window.document.querySelector('.rg-settings-popover'), null);

  await act(async () => {
    container.querySelector('.rg-toggle').dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  });
  assert.equal(container.querySelector('.rg-root'), null);
  assert.equal(prefs.getSnapshot().placement, 'input');

  await act(async () => {
    prefs.set({ placement: 'dock' });
  });
  assert.ok(container.querySelector('.rg-root'));

  await act(async () => {
    root.unmount();
  });
  if (typeof cleanup === 'function') cleanup();

  window.close();
  globalThis.window = previous.window;
  globalThis.document = previous.document;
  globalThis.MutationObserver = previous.MutationObserver;
  globalThis.HTMLElement = previous.HTMLElement;
  globalThis.localStorage = previous.localStorage;
  globalThis.requestAnimationFrame = previous.requestAnimationFrame;
  globalThis.cancelAnimationFrame = previous.cancelAnimationFrame;
  globalThis.IS_REACT_ACT_ENVIRONMENT = previous.IS_REACT_ACT_ENVIRONMENT;
});
