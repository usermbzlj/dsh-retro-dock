/**
 * The seven instrument languages. Pure data: no DOM, no React, no CSS, so the
 * preference validator, the settings page, the catalogue and the tests can all
 * import it without pulling the renderer in.
 */

export const DESIGN_IDS = Object.freeze([
  'bench',
  'vu',
  'altimeter',
  'signal',
  'chart',
  'swiss',
  'compass',
]);

export const DESIGN_META = Object.freeze({
  bench: {
    id: 'bench',
    name: { zh: '台表', en: 'Bench' },
    lineage: { zh: '实验室校准台表', en: 'Calibration bench meter' },
    promise: {
      zh: '刻度、刀锋针、凹进去的读数窗。红色只出现在警戒刻线和过速点。',
      en: 'A knife needle on an engraved scale, a recessed readout window, red only at the limit.',
    },
  },
  vu: {
    id: 'vu',
    name: { zh: '广播 VU', en: 'Broadcast VU' },
    lineage: { zh: '1950s 广播 VU 表', en: '1950s broadcast VU meter' },
    promise: {
      zh: '象牙表盘、暖灯、宽扇区。针有一点过冲，像一根有质量的针。',
      en: 'An ivory face, a warm lamp, a wide fan. The needle overshoots a little, like it has mass.',
    },
  },
  altimeter: {
    id: 'altimeter',
    name: { zh: '高度表', en: 'Altimeter' },
    lineage: { zh: '气压高度表 / 马赫表', en: 'Pressure altimeter / machmeter' },
    promise: {
      zh: '数字在鼓窗里滚动，细白针只给方位感。读数优先。',
      en: 'Digits roll in a drum window; the thin white needle only gives bearing.',
    },
  },
  signal: {
    id: 'signal',
    name: { zh: '信号楼', en: 'Signal' },
    lineage: { zh: '铁路臂板信号机', en: 'Railway semaphore' },
    promise: {
      zh: '臂板随速度抬起，CTX 用三枚灯表示状态。先看状态，再读数。',
      en: 'A semaphore arm lifts with speed; three lamps state the CTX condition.',
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
  compass: {
    id: 'compass',
    name: { zh: '罗经', en: 'Compass' },
    lineage: { zh: '船用陀螺罗经复示器', en: 'Marine gyrocompass repeater' },
    promise: {
      zh: '罗经卡旋转，固定基准线读数。不是针在动，是你在地图上转。',
      en: 'The card turns under a fixed index. The needle is not moving; the map is.',
    },
  },
});

/**
 * @param {unknown} value
 * @returns {value is keyof typeof DESIGN_META}
 */
export const isDesignId = (value) => typeof value === 'string' && DESIGN_IDS.includes(value);
