/** Small line icons shared by the gauge and the settings panel. */

import { R } from '../runtime.js';

const svg = (viewBox, children, props = {}) => R.h('svg', {
  viewBox,
  width: '1em',
  height: '1em',
  fill: 'none',
  stroke: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false',
  ...props,
}, children);

export const GearIcon = () => svg('0 0 16 16', [
  R.h('circle', { key: 'ring', cx: 8, cy: 8, r: 5.1, strokeWidth: 1.1, opacity: .85 }),
  R.h('circle', { key: 'hub', cx: 8, cy: 8, r: 2.1, strokeWidth: 1.1 }),
  R.h('path', {
    key: 'teeth',
    d: 'M8 1.3v1.4M8 13.3v1.4M1.3 8h1.4M13.3 8h1.4M3.25 3.25l1 1M11.75 11.75l1 1M12.75 3.25l-1 1M4.25 11.75l-1 1',
    strokeWidth: 1.1,
    strokeLinecap: 'round',
  }),
], { width: '11px', height: '11px' });

export const CloseIcon = () => svg('0 0 16 16', R.h('path', {
  d: 'M4 4l8 8M12 4l-8 8',
  strokeWidth: 1.3,
  strokeLinecap: 'round',
}), { width: '12px', height: '12px' });

/**
 * Tiny instrument sketches for the style picker.
 *
 * @param {{ style: string }} props
 */
export const StyleIcon = ({ style }) => {
  if (style === 'heritage') {
    return svg('0 0 46 24', [
      R.h('circle', { key: 'face', cx: 13, cy: 12, r: 9.2, strokeWidth: 1, opacity: .55 }),
      R.h('circle', { key: 'inner', cx: 13, cy: 12, r: 7.1, strokeWidth: .8, opacity: .3 }),
      R.h('path', { key: 'arc', d: 'M5.6 8.2A7.1 7.1 0 0 1 13.9 4.9', strokeWidth: 1.5, strokeLinecap: 'round' }),
      R.h('path', { key: 'needle', d: 'M13 12l5-3', strokeWidth: 1.1, strokeLinecap: 'round' }),
      R.h('circle', { key: 'hub', cx: 13, cy: 12, r: 1, fill: 'currentColor', stroke: 'none' }),
      R.h('circle', { key: 'sub', cx: 32, cy: 12, r: 5.6, strokeWidth: .9, opacity: .45 }),
      R.h('path', { key: 'subarc', d: 'M27.7 9.4a5.6 5.6 0 0 1 7.4.4', strokeWidth: 1.2, strokeLinecap: 'round' }),
      R.h('path', { key: 'hitarc', d: 'M28.3 14.1a4.1 4.1 0 0 1 6.9.2', strokeWidth: .9, strokeLinecap: 'round', opacity: .6 }),
    ], { width: '46px', height: '24px' });
  }
  if (style === 'neon') {
    return svg('0 0 46 24', [
      R.h('circle', { key: 'track', cx: 13, cy: 12, r: 8.8, strokeWidth: 2, opacity: .16 }),
      R.h('path', { key: 'arc', d: 'M5.5 9.2A8.8 8.8 0 0 1 14.4 3.3', strokeWidth: 2.2, strokeLinecap: 'round' }),
      R.h('circle', { key: 'dot', cx: 14.4, cy: 3.3, r: 1.3, fill: 'currentColor', stroke: 'none' }),
      R.h('path', { key: 'ticks', d: 'M4.8 15.2h1M6.2 18l.8-.6M8.8 19.9l.5-.9M11.9 20.7v-1', strokeWidth: .9, strokeLinecap: 'round', opacity: .55 }),
      R.h('circle', { key: 'sub', cx: 32, cy: 9, r: 5.4, strokeWidth: 1.3, opacity: .7 }),
      R.h('circle', { key: 'sub2', cx: 32, cy: 9, r: 3.2, strokeWidth: 1, opacity: .35 }),
      R.h('path', { key: 'row', d: 'M39 17h4M39 20h2.5', strokeWidth: 1.2, strokeLinecap: 'round', opacity: .5 }),
    ], { width: '46px', height: '24px' });
  }
  if (style === 'minimal') {
    return svg('0 0 46 24', [
      R.h('path', { key: 'track', d: 'M4.4 14.8a8.6 8.6 0 1 1 13.4-7.2', strokeWidth: .8, opacity: .3 }),
      R.h('path', { key: 'arc', d: 'M4.4 14.8a8.6 8.6 0 0 1 1.9-9.1', strokeWidth: 1.5, strokeLinecap: 'round' }),
      R.h('circle', { key: 'dot', cx: 6.3, cy: 5.7, r: 1.2, fill: 'currentColor', stroke: 'none' }),
      R.h('path', { key: 'line1', d: 'M25 9h13', strokeWidth: .8, opacity: .28 }),
      R.h('path', { key: 'line2', d: 'M25 15h13', strokeWidth: .8, opacity: .28 }),
      R.h('path', { key: 'fill1', d: 'M25 9h7', strokeWidth: 1.1, strokeLinecap: 'round' }),
      R.h('path', { key: 'fill2', d: 'M25 15h10', strokeWidth: 1.1, strokeLinecap: 'round', opacity: .65 }),
    ], { width: '46px', height: '24px' });
  }
  return svg('0 0 46 24', [
    R.h('rect', { key: 'frame', x: 3, y: 5, width: 21, height: 14, rx: 2, strokeWidth: 1, opacity: .55 }),
    R.h('path', { key: 'cells', d: 'M6 9h2v6H6zM10 9h2v6h-2zM14 9h2v6h-2z', fill: 'currentColor', stroke: 'none' }),
    R.h('path', { key: 'empty', d: 'M18 9h2v6h-2z', fill: 'currentColor', stroke: 'none', opacity: .18 }),
    R.h('path', { key: 'lines', d: 'M28 8h14M28 12h9M28 16h12', strokeWidth: 1.1, strokeLinecap: 'round', opacity: .55 }),
  ], { width: '46px', height: '24px' });
};
