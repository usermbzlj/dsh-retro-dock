/**
 * The three instrument languages beside classic. Pure data: no DOM, no React,
 * no CSS, so the preference validator, the settings page, the catalogue and the
 * tests can all import it without pulling the renderer in.
 */

export const DESIGN_IDS = Object.freeze([
  'vu',
  'chart',
  'swiss',
]);

export const DESIGN_META = Object.freeze({
  vu: {
    id: 'vu',
    name: { zh: '广播 VU', en: 'Broadcast VU' },
    lineage: { zh: '1950s 广播 VU 表', en: '1950s broadcast VU meter' },
    promise: {
      zh: '象牙表盘、暖灯、宽扇区。针有一点过冲，像一根有质量的针；红区只表示超量程。',
      en: 'An ivory face, a warm lamp, a wide fan. The needle overshoots a little, like it has mass; the red zone only means over-range.',
    },
  },
  chart: {
    id: 'chart',
    name: { zh: '记录纸', en: 'Chart' },
    lineage: { zh: '走纸记录仪 / 地震仪', en: 'Strip-chart recorder' },
    promise: {
      zh: '速度是 20 秒的走势，不是瞬间值。纸向左走，笔在右缘。',
      en: 'Speed becomes a twenty-second trace. The paper moves left; the pen sits at the edge.',
    },
  },
  swiss: {
    id: 'swiss',
    name: { zh: '瑞士尺', en: 'Swiss' },
    lineage: { zh: '瑞士信息设计 / 测量尺', en: 'Swiss information design / rule' },
    promise: {
      zh: '没有表盘。数字、发丝标尺和一个方块游标；信息排版就是仪器。',
      en: 'No dial. A number, a hairline rule and a square cursor; the typography is the instrument.',
    },
  },
});

/**
 * @param {unknown} value
 * @returns {value is keyof typeof DESIGN_META}
 */
export const isDesignId = (value) => typeof value === 'string' && DESIGN_IDS.includes(value);
