/**
 * Catalogue copy for the three instrument languages beside classic. Kept out of
 * the renderer so the prose can be edited without touching the components.
 */

export const CLASSIC = {
  name: { zh: '经典', en: 'Classic' },
  lineage: { zh: '默认双表盘，其余三种的参照', en: 'The default dual dial; the reference for the other three' },
};

export const CATALOGUE = {
  vu: {
    claim: '一根有质量的针，停下时会轻轻多走一点再回来。',
    body: [
      '象牙表盘、青铜压边、宽扇区。末端红区固定印在量程的 90% 到 100%，意思只有一个：快到满量程了。它和上下文警戒无关，不再看起来像限速。',
      '针有自己的弹簧，会真实地过冲一点；暖光只在有读数时亮。统计条里只印 0 和满量程两个数，其余交给针。深色宿主里它仍是一块亮着的表。',
    ],
    specs: [
      ['机制', '130° 扇区，楔形针，固定的超量程红区'],
      ['表面', '象牙表盘，青铜压边；深色下仍是亮表'],
      ['字体', 'Constantia 刻度，Bahnschrift 读数'],
      ['运动', '独立弹簧，轻微过冲；只在实时读数时发光'],
      ['选项', '读数可选数字或鼓轮；上下文可加三色信号灯'],
    ],
    palette: [
      { hex: '#F2E7D2', role: '表盘' },
      { hex: '#EFE2C9', role: '暗色' },
      { hex: '#2A2119', role: '墨' },
      { hex: '#AE3627', role: '红区' },
      { hex: '#6C5F4D', role: '青铜' },
    ],
    type: { name: 'Constantia + Bahnschrift', css: 'Constantia, Cambria, serif', sample: '0  45  90  135  180' },
    craft: '红区从量程 90% 开始，和警戒线设置无关；42px 下只留两端刻度数字。',
  },
  chart: {
    claim: '速度变成 20 秒的走势，而不只是此刻的一个数。',
    body: [
      '纸向左走，笔在右缘。没有历史时不伪造历史：刚挂载时左半张纸是空的，轨迹从右缘开始长。页面隐藏时不采样。',
      '笔迹是蓝黑墨水。红色只留给满量程虚线和超量程的笔点，所以一眼能看出哪一段跑过了头。上下文在右侧边栏，是一支竖向压力条。',
    ],
    specs: [
      ['机制', '20 秒轨迹，笔点，满量程虚线，压力条'],
      ['表面', '记录纸；深色为蓝图纸'],
      ['字体', 'Consolas 数字，Bahnschrift 注记'],
      ['运动', '每 250ms 走一步，不插值；减少动态时每秒一步'],
    ],
    palette: [
      { hex: '#F4EFE3', role: '纸' },
      { hex: '#171D1F', role: '蓝图' },
      { hex: '#24364A', role: '笔迹' },
      { hex: '#B23A2A', role: '界限' },
      { hex: '#615E55', role: '注记' },
    ],
    type: { name: 'Consolas', css: 'Consolas, "Cascadia Mono", monospace', sample: '142.0 tok/s' },
    craft: '笔迹 1px，纸格 1px；笔点与轨迹末端对齐。轨迹只记录挂载后的样本，左端留白是事实。',
  },
  swiss: {
    claim: '没有表盘，把一条读数排好就是仪器。',
    body: [
      '数字、实线标尺、方块游标。速度是唯一的大字；上下文是第二条短尺；缓存命中是右端的小注。没有底板，完全借宿主的墨与纸。',
      '标尺是实墨细线，对比度不低于 3:1。红色只出现在越过阈值或超量程的地方。字体跟随系统，不依赖某个平台才有的字体。',
    ],
    specs: [
      ['机制', '数字，实线标尺，方块游标'],
      ['表面', '无；借宿主的墨与纸'],
      ['字体', '系统界面字体'],
      ['运动', '游标 120ms 平移；减少动态时直接到位'],
    ],
    palette: [
      { hex: '#17181A', role: '墨（浅）' },
      { hex: '#F2F2ED', role: '墨（深）' },
      { hex: '#5E605C', role: '次级' },
      { hex: '#B43725', role: '界限（浅）' },
      { hex: '#F07E68', role: '界限（深）' },
    ],
    type: { name: '系统字体', css: 'system-ui, -apple-system, "Segoe UI", sans-serif', sample: '142 tok/s' },
    craft: '数字用表格等宽数字；标尺与游标按基线对齐，不按盒子。',
  },
};

export const RECOMMENDATIONS = [
  {
    role: '默认，什么都看',
    id: 'classic',
    text: '速度、上下文、缓存一次读全。需要更直接的数字可以把读数换成鼓轮，想先看警戒状态可以打开信号灯。',
  },
  {
    role: '要一点温度',
    id: 'vu',
    text: '有质量的针和暖光，适合长时间开着。红区只表示超量程。',
  },
  {
    role: '看走势',
    id: 'chart',
    text: '经常在长生成里等待时，走势比此刻的数更有用。左端留白是事实，不是缺陷。',
  },
  {
    role: '最安静',
    id: 'swiss',
    text: '没有机器、没有灯，只有一条读数和两条尺。',
  },
];
