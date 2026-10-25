import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

/**
 * Smoke test for the committed build artifact: the ModuleLoader contract and
 * the factory's `require` seam are what the host actually loads.
 */
test('the built client bundle registers a plugin through __ModuleLoader__', async () => {
  const dom = new JSDOM('<!doctype html><html><head></head><body></body></html>', {
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
  };
  globalThis.window = window;
  globalThis.document = window.document;
  globalThis.MutationObserver = window.MutationObserver;
  globalThis.localStorage = window.localStorage;
  globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
  globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);

  let captured = null;
  window.__ModuleLoader__ = {
    load(module) {
      captured = module;
    },
  };

  const React = await import('react');
  const ReactDOM = await import('react-dom');
  await import(`${pathToFileURL(path.resolve('client.js')).href}?bundle=${Date.now()}`);

  assert.ok(captured, 'the bundle should call __ModuleLoader__.load');
  assert.equal(captured.id, '@local/retro-dock');

  const plugin = captured.factory((name) => {
    if (name === 'react') return React;
    if (name === 'react-dom') return ReactDOM;
    throw new Error(`unexpected module: ${name}`);
  });
  assert.equal(typeof plugin.apply, 'function');

  const names = [];
  plugin.apply({
    effect() {},
    slots: {
      inject(name, factory) {
        return factory();
      },
      register(definition) {
        names.push(definition.name);
        return () => {};
      },
    },
  });

  assert.ok(names.includes('conversation.composer.dock'));
  assert.ok(names.includes('conversation.input.dock'));
  assert.ok(names.includes('settings.section'));
  assert.ok(window.document.head.querySelector('style[data-plugin-css]'));
  assert.ok(window.__retroDock);

  window.close();
  globalThis.window = previous.window;
  globalThis.document = previous.document;
  globalThis.MutationObserver = previous.MutationObserver;
  globalThis.localStorage = previous.localStorage;
  globalThis.requestAnimationFrame = previous.requestAnimationFrame;
  globalThis.cancelAnimationFrame = previous.cancelAnimationFrame;
});
