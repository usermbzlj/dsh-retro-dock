/**
 * Catalogue copy for the seven instrument languages. Kept out of the renderer
 * so the prose can be edited without touching the components.
 */

export const CATALOGUE = {
  bench: {
    claim: '一台需要读数的表，不是一块装饰表盘。',
    body: [
      '冷锌面板上印着 240° 刻线，刀锋针从中心走到止挡。读数窗凹进面板，CTX 是窗内的一条细压力条——把上下文和速度放在同一根针上，会让警戒线看起来像速度上限，所以不这么做。',
      '红色只出现在 CTX 警戒、越线段和过速点。浅色是冷锌，深色是石墨；面板始终属于仪器，不属于宿主。',
    ],
    specs: [
      ['机制', '240° 刻线 / 刀锋针 / 压力条'],
      ['表面', '冷锌面板，凹窗；深色为石墨'],
      ['字体', 'Bahnschrift 600 / 500'],
      ['运动', '临界阻尼，无过冲；过速止挡 + 端点红点'],
    ],
    palette: [
      { hex: '#E8E6DF', role: '面板' },
      { hex: '#232627', role: '深色' },
      { hex: '#1A1C1C', role: '墨' },
      { hex: '#A93526', role: '界限' },
      { hex: '#555752', role: '次级' },
    ],
    type: { name: 'Bahnschrift', css: 'Bahnschrift, "DIN Alternate", sans-serif', sample: '142 tok/s' },
    craft: '针尖 0.28、刻度 0.7px 描边、窗口 1px 内凹；比例按 1× 调到不糊。',
  },
  vu: {
    claim: '一根有质量的针，会在停止时轻轻过冲。',
    body: [
      '象牙表盘、青铜压边、宽扇区。末端红区是印在表盘上的，不是报警时才出现；峰值灯只在过速时亮。CTX 与 HIT 刻在表盘下沿，像两行印刷注脚。',
      '暗色下它不变成暗表，而是房间里唯一亮着的表。暖光只在表盘内部，不外溢成装饰。',
    ],
    specs: [
      ['机制', '130° 扇区 / 楔形针 / 印刷红区'],
      ['表面', '象牙表盘，青铜压边；深色下为亮表'],
      ['字体', 'Constantia 刻度 + Bahnschrift 读数'],
      ['运动', '轻微过冲；过速峰值灯亮'],
    ],
    palette: [
      { hex: '#F2E7D2', role: '表盘' },
      { hex: '#EFE2C9', role: '暗色' },
      { hex: '#2A2119', role: '墨' },
      { hex: '#AE3627', role: '红区' },
      { hex: '#6C5F4D', role: '青铜' },
    ],
    type: { name: 'Constantia + Bahnschrift', css: 'Constantia, Cambria, serif', sample: '0  45  90  135  180' },
    craft: 'VU 刻度用旧式数字；读数用 DIN 体，两种语言在同一条表盘上分工。',
  },
  altimeter: {
    claim: '数字优先，环只给方位感。',
    body: [
      '270° 细白针 + 黑色鼓窗；CTX 是窗下的细压力条。计数器会把 0 显示成 000，这是鼓形计数器的诚实。浅色面板上仍是黑色表盘，因为航空仪表不跟随房间的墙色。',
      '数字逐位滚动，指针平滑跟随；环不是主读数，所以允许它细、允许它安静。',
    ],
    specs: [
      ['机制', '270° 针 / 三位鼓形计数器 / 压力条'],
      ['表面', '浅灰或炭黑面板，黑色表盘与鼓窗'],
      ['字体', 'Bahnschrift Condensed（字宽 87.5%）'],
      ['运动', '数字逐位滚动；过速红色止挡标记'],
    ],
    palette: [
      { hex: '#DCDDD8', role: '面板' },
      { hex: '#1B1F20', role: '深色' },
      { hex: '#121516', role: '表盘' },
      { hex: '#A63122', role: '界限' },
      { hex: '#F1EFE8', role: '白字' },
    ],
    type: { name: 'Bahnschrift Condensed', css: 'Bahnschrift, "Arial Narrow", sans-serif', sample: '0 1 2 3 4 5 6 7 8 9' },
    craft: '鼓窗高度只比字高 1px；数字滚动用 0.2s 的机械曲线，不用弹簧。',
  },
  signal: {
    claim: '先看状态，再读数。',
    body: [
      '臂板随速度从水平抬到 72°；CTX 用绿、琥珀、红三枚灯表示状态，HIT 是机械计数器。灯是离散的，数字是连续的——两者各做各的事。',
      '面板在深色下是黑搪瓷，在浅色下是象牙搪瓷；红色只给臂板和警戒灯。灯位固定，所以警告不依赖颜色记忆。',
    ],
    specs: [
      ['机制', '臂板 / 三枚灯 / HIT 计数器'],
      ['表面', '搪瓷；随宿主明暗反转'],
      ['字体', 'Bahnschrift'],
      ['运动', '臂板抬起；灯在阈值处瞬切'],
    ],
    palette: [
      { hex: '#E7E0CF', role: '搪瓷' },
      { hex: '#141414', role: '深色' },
      { hex: '#AF3727', role: '臂板' },
      { hex: '#2F6B45', role: '通行' },
      { hex: '#965812', role: '注意' },
    ],
    type: { name: 'Bahnschrift', css: 'Bahnschrift, "DIN Alternate", sans-serif', sample: 'CTX  HIT  142' },
    craft: '臂板宽 3.2、白带 4.4；灯只有 4px，却必须在 1× 下读出颜色。',
  },
  chart: {
    claim: '速度第一次变成走势，而不是瞬间值。',
    body: [
      '20 秒走纸记录，纸向左走，笔在右缘。没有历史时不伪造历史：刚挂载时左半张纸是空的，轨迹从右缘开始长。',
      'CTX 在右侧批注栏里是一支竖压力条；HIT 是打印注记。浅色是记录纸，深色是蓝图纸；网格不为装饰，只为读走势。',
    ],
    specs: [
      ['机制', '20s 轨迹 / 笔点 / 压力条'],
      ['表面', '记录纸；深色为蓝图纸'],
      ['字体', 'Consolas（数字）+ Bahnschrift（注记）'],
      ['运动', '纸每 250ms 走一步，不插值'],
    ],
    palette: [
      { hex: '#F4EFE3', role: '纸' },
      { hex: '#171D1F', role: '蓝图' },
      { hex: '#9C3324', role: '笔迹' },
      { hex: '#B23A2A', role: '界限' },
      { hex: '#615E55', role: '注记' },
    ],
    type: { name: 'Consolas', css: 'Consolas, "Cascadia Mono", monospace', sample: '142.0 tok/s' },
    craft: '笔迹 1px，纸格 1px；轨迹只记录挂载后的样本，左端留白是事实。',
  },
  swiss: {
    claim: '没有表盘。信息排版就是仪器。',
    body: [
      '数字、发丝标尺、6px 方块游标。速度是唯一的大字；CTX 是第二条短尺；HIT 是右端的小注。没有底板，完全借宿主的墨与纸。',
      '红色只出现在越过阈值的游标上。它不模拟任何机器，只负责把一条读数排好。',
    ],
    specs: [
      ['机制', '数字 / 发丝标尺 / 方块游标'],
      ['表面', '无；借宿主墨与纸'],
      ['字体', 'Arial（Helvetica 的 Windows 替身）'],
      ['运动', '游标 120ms 线性跟随'],
    ],
    palette: [
      { hex: '#17181A', role: '墨（浅）' },
      { hex: '#F2F2ED', role: '墨（深）' },
      { hex: '#5E605C', role: '次级' },
      { hex: '#B43725', role: '界限（浅）' },
      { hex: '#F07E68', role: '界限（深）' },
    ],
    type: { name: 'Arial', css: 'Arial, "Helvetica Neue", sans-serif', sample: '142 tok/s' },
    craft: '数字字距 -0.045em；标尺与游标的对齐按基线，不按盒子。',
  },
  compass: {
    claim: '不是针在动，是你在地图上转。',
    body: [
      '深海军蓝罗经卡在黄铜压圈里旋转，固定基准线读数；CTX 是卡外的固定环，所以压力不会跟着方位转。',
      '卡面是完整的 36 格刻度环，只有一枚象牙基准三角；过速时基准线转红。整张卡在动，读数保持不动。',
    ],
    specs: [
      ['机制', '旋转卡 / 固定基准线 / 固定 CTX 环'],
      ['表面', '海军蓝 + 黄铜；读数跟随宿主'],
      ['字体', 'Cambria（读数）+ Bahnschrift（卡面）'],
      ['运动', '整卡旋转；过速基准线转红'],
    ],
    palette: [
      { hex: '#142128', role: '卡（浅）' },
      { hex: '#0D161B', role: '卡（深）' },
      { hex: '#8A7752', role: '黄铜（浅）' },
      { hex: '#B49A68', role: '黄铜（深）' },
      { hex: '#C8462F', role: '界限' },
    ],
    type: { name: 'Cambria', css: 'Cambria, Georgia, serif', sample: '142 tok/s' },
    craft: '卡面 36 格；黄铜圈 1.7px；读数用衬线，和卡面刻度分工。',
  },
};

export const RECOMMENDATIONS = [
  {
    role: '首选',
    id: 'bench',
    text: '现役经典双表盘的直系替代：读数密度最高，浅色与深色都不需要额外解释。',
  },
  {
    role: '常驻',
    id: 'chart',
    text: '如果你经常在长生成里等待，走势比瞬间值更有用。左端留白是事实，不是缺陷。',
  },
  {
    role: '安静',
    id: 'swiss',
    text: '最不占注意力的一套。没有机器、没有灯，只有一条读数和两条尺。',
  },
  {
    role: '对象',
    id: 'compass',
    text: '想要一个会呼吸的物件：整张卡在转，但读数保持不动。',
  },
];
