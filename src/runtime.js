/**
 * Runtime seam for React. The host supplies React through the ModuleLoader
 * factory, so source modules cannot import it directly; `bindReact` installs the
 * real implementation before the first render.
 */

export const R = {
  React: null,
  h: null,
  useState: null,
  useEffect: null,
  useLayoutEffect: null,
  useMemo: null,
  useRef: null,
  useCallback: null,
  useSyncExternalStore: null,
  useId: null,
  createPortal: null,
};

/**
 * @param {typeof import('react')} React
 * @param {{ createPortal?: Function }|null} [ReactDOM]
 */
export const bindReact = (React, ReactDOM = null) => {
  R.React = React;
  R.h = React.createElement;
  R.useState = React.useState;
  R.useEffect = React.useEffect;
  R.useLayoutEffect = React.useLayoutEffect ?? React.useEffect;
  R.useMemo = React.useMemo;
  R.useRef = React.useRef;
  R.useCallback = React.useCallback;
  R.useSyncExternalStore = React.useSyncExternalStore;
  R.useId = React.useId;
  R.createPortal = ReactDOM && typeof ReactDOM.createPortal === 'function' ? ReactDOM.createPortal : null;
};
