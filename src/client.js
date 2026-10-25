/**
 * ModuleLoader entry. The host calls `factory(require)`; React is resolved
 * through that function (not a bundler import) so the bundle stays small and
 * shares the host's React instance.
 */

import { createPlugin } from './plugin.js';

const ID = '@local/retro-dock';

if (typeof window !== 'undefined' && window.__ModuleLoader__ && typeof window.__ModuleLoader__.load === 'function') {
  window.__ModuleLoader__.load({
    id: ID,
    factory(mod) {
      const React = mod('react');
      let ReactDOM = null;
      try {
        ReactDOM = mod('react-dom');
      } catch {
        ReactDOM = null;
      }
      return createPlugin(React, ReactDOM);
    },
  });
}
