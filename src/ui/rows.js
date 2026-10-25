/** Readout rows: plain numbers, hairline tracks, or phosphor cells per style. */

import { R } from '../runtime.js';

const h = (...args) => R.h(...args);

export const StandardRows = ({ vm, t }) => h('span', { className: 'rg-rows' },
  h('span', { className: 'rg-row rg-row-ctx' },
    h('span', { className: 'rg-tag' }, t('ctx')),
    h('span', { className: 'rg-num' }, vm.ctxDisplay)),
  h('span', { className: 'rg-row rg-row-hit' },
    h('span', { className: 'rg-tag' }, t('hit')),
    h('span', { className: 'rg-num' }, vm.hitDisplay)));

export const MinimalRows = ({ vm, t }) => h('span', { className: 'rg-rows' },
  h('span', { className: 'rg-row rg-row-ctx' },
    h('span', { className: 'rg-tag' }, t('ctx')),
    h('span', { className: 'rg-line' }, h('i', { style: { width: `${vm.ctxValue || 0}%` } })),
    h('span', { className: 'rg-num' }, vm.ctxDisplay)),
  h('span', { className: 'rg-row rg-row-hit' },
    h('span', { className: 'rg-tag' }, t('hit')),
    h('span', { className: 'rg-line' }, h('i', { style: { width: `${vm.hitValue || 0}%` } })),
    h('span', { className: 'rg-num' }, vm.hitDisplay)));

export const TerminalRows = ({ vm, t }) => h('span', { className: 'rg-rows' },
  h('span', { className: 'rg-row rg-row-ctx' },
    h('span', { className: 'rg-tag' }, t('ctx')),
    h('span', { className: 'rg-term-mini' }, h('i', { style: { '--rg-v': String(vm.ctxValue || 0) } })),
    h('span', { className: 'rg-num' }, vm.ctxDisplay)),
  h('span', { className: 'rg-row rg-row-hit' },
    h('span', { className: 'rg-tag' }, t('hit')),
    h('span', { className: 'rg-term-mini' }, h('i', { style: { '--rg-v': String(vm.hitValue || 0) } })),
    h('span', { className: 'rg-num' }, vm.hitDisplay)));

export const InlineReadout = ({ vm, t }) => h('span', { className: 'rg-inline' },
  h('b', null, `${t('ctx')} ${vm.ctxDisplay}`),
  h('span', { className: 'rg-sep' }, '·'),
  h('b', null, `${t('hit')} ${vm.hitDisplay}`));

export const ROWS = {
  heritage: StandardRows,
  neon: StandardRows,
  minimal: MinimalRows,
  terminal: TerminalRows,
};
