/**
 * Monotonic clock shared by the meter, the rAF loop and DOM observation.
 * `performance.now()` in the page is the same origin as the rAF timestamp; the
 * explicit window lookup keeps tests and non-browser callers consistent.
 */
export const now = () => {
  if (typeof window !== 'undefined') {
    const perf = window.performance;
    if (perf && typeof perf.now === 'function') return perf.now();
  }
  return performance.now();
};
