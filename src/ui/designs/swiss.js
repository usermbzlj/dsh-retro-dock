/**
 * Swiss: no instrument housing. A number, a hairline rate rule, a square
 * cursor, and two small secondary measures. It borrows the host's ink and
 * paper completely; red appears only after a threshold is crossed.
 */

import {
  Approx,
  clampPct,
  h,
} from './kit.js';

export const SwissBody = ({ vm, t }) => {
  const warnAt = clampPct(vm.warnAt ?? 80);
  const ctxKnown = vm.ctxKnown !== false;
  const ctx = ctxKnown ? clampPct(vm.ctxValue || 0) : 0;
  const showSub = vm.sub !== false;
  const position = clampPct(vm.position);

  const rateRule = h('span', { className: 'rgx-swiss-rule rgx-mechanism', 'aria-hidden': 'true' },
    [0, 50, 100].map((pct) => h('span', {
      key: pct,
      className: pct === 100 ? 'rgx-swiss-tick is-end' : pct === 0 ? 'rgx-swiss-tick is-start' : 'rgx-swiss-tick',
      style: { left: `${pct}%` },
    })),
    h('span', {
      className: 'rgx-swiss-rate-cursor',
      // left 百分比相对整根尺子；居中偏移由 CSS 的 margin-left 负责
      style: { left: `${position}%` },
    }));

  const sub = showSub ? h('span', { className: 'rgx-swiss-sub' },
    h('span', { className: 'rgx-swiss-ctx' },
      h('span', { className: 'rgx-swiss-label' },
        t('ctx'),
        vm.warn ? h('b', { className: 'rgx-swiss-alert' }, '!') : null),
      h('span', {
        className: ctxKnown ? 'rgx-swiss-mini-rule rgx-mechanism' : 'rgx-swiss-mini-rule rgx-mechanism is-unknown',
        'aria-hidden': 'true',
      },
        ctxKnown ? h('span', {
          className: 'rgx-swiss-mini-cursor',
          style: { left: `${ctx}%` },
        }) : null,
        h('span', {
          className: 'rgx-swiss-mini-mark',
          style: { left: `${warnAt}%` },
        })),
      h('span', { className: 'rgx-swiss-value' }, vm.ctxDisplay)),
    h('span', { className: 'rgx-swiss-hit' },
      h('span', { className: 'rgx-swiss-label' }, t('hit')),
      h('span', { className: 'rgx-swiss-value' }, vm.hitDisplay))) : null;

  return h('span', { className: 'rgx-swiss' },
    h('span', { className: 'rgx-swiss-main' },
      h(Approx, { live: vm.live }),
      h('span', { className: 'rgx-swiss-digits' }, vm.displayTps),
      h('span', { className: 'rgx-swiss-unit' }, t('unit')),
      h('span', { className: 'rgx-swiss-over', 'aria-hidden': 'true' }, '+')),
    rateRule,
    sub);
};
