/**
 * Tiny self-contained i18n layer. The plugin's strings are its own, not the
 * host namespace, so they travel with the bundle and work in the composer, the
 * settings page and the static gallery.
 */

const ZH = {
  appName: 'Retro Dock',
  tagline: '输入区仪表',
  unit: 'tok/s',
  ctx: 'CTX',
  hit: 'HIT',
  sessionTotal: '会话累计',
  styleTitle: '样式',
  styleHeritage: '经典仪表',
  styleHeritageDesc: '拉丝表圈、细刻度与象牙指针，传统机械表盘。',
  styleNeon: '霓虹 HUD',
  styleNeonDesc: '渐变弧光、端点辉光与扫描线，赛博仪表盘。',
  styleMinimal: '极简刻度',
  styleMinimalDesc: '发丝弧线与大留白，只保留必要读数。',
  styleTerminal: '终端',
  styleTerminalDesc: '等宽字体、字符条与磷光扫描线，CRT 质感。',
  placementTitle: '位置',
  placementInput: '输入框上方',
  placementDock: '底部统计条',
  densityTitle: '密度',
  densityAuto: '自动',
  densityFull: '完整',
  densityCompact: '紧凑',
  densityMinimal: '最小',
  scaleTitle: '满量程',
  scaleUnit: '{n} tok/s',
  warnTitle: 'CTX 警告',
  warnUnit: '{n}%',
  subTitle: '显示 CTX / HIT',
  subField: '副表',
  languageTitle: '语言',
  langAuto: '跟随宿主',
  langZh: '中文',
  langEn: 'English',
  settingsTitle: 'Retro Dock 设置',
  settingsSubtitle: '选择仪表样式、停靠位置与读数口径。',
  openSettings: '打开设置',
  close: '关闭',
  resetCalibration: '重置校准',
  calibration: '校准',
  notCalibrated: '未校准',
  calibrationPending: '校准待统计',
  calibrationUnavailable: '校准不可用（宿主未提供 sessionStats）',
  samples: '{n} 样本',
  source: '数据源',
  sourceProjection: '投影',
  sourceMixed: '混合',
  sourceDom: 'DOM 回退',
  sourceUnavailable: '数据源不可用',
  tipRate: '≈ {tps} tok/s（1.2 秒估算）',
  tipCtx: '上下文 {ctx}',
  tipHit: '缓存命中 {hit}（会话累计）',
  switchToDock: '切换到统计条',
  switchToInput: '切换到输入框上方',
  ariaGauge: '瞬时速度 {tps} tok/s，上下文 {ctx}，缓存命中 {hit}；{action}；{settings}',
  ariaGaugeStatic: '瞬时速度 {tps} tok/s，上下文 {ctx}，缓存命中 {hit}',
  ariaSettings: '仪表设置',
  previewTitle: '预览',
  previewHint: '用当前样式与密度渲染的静态预览。',
  about: '关于',
  version: '版本 {version}',
  densityHint: '自动会按父容器宽度切换。',
  notice: '读数来自宿主投影；投影缺失时回退到 DOM 文本，并在提示中标注数据源。',
  updated: '已保存',
};

const EN = {
  appName: 'Retro Dock',
  tagline: 'Composer instruments',
  unit: 'tok/s',
  ctx: 'CTX',
  hit: 'HIT',
  sessionTotal: 'session',
  styleTitle: 'Style',
  styleHeritage: 'Heritage',
  styleHeritageDesc: 'Brushed bezel, fine ticks and an ivory needle — a classic mechanical dial.',
  styleNeon: 'Neon HUD',
  styleNeonDesc: 'Gradient arc, endpoint bloom and scanlines — a cyber instrument.',
  styleMinimal: 'Minimal',
  styleMinimalDesc: 'A hairline arc and generous space; only the readings that matter.',
  styleTerminal: 'Terminal',
  styleTerminalDesc: 'Monospace cells, phosphor scanlines and a CRT finish.',
  placementTitle: 'Position',
  placementInput: 'Above composer',
  placementDock: 'Stats bar',
  densityTitle: 'Density',
  densityAuto: 'Auto',
  densityFull: 'Full',
  densityCompact: 'Compact',
  densityMinimal: 'Minimal',
  scaleTitle: 'Full scale',
  scaleUnit: '{n} tok/s',
  warnTitle: 'CTX warning',
  warnUnit: '{n}%',
  subTitle: 'Show CTX / HIT',
  subField: 'Sub readouts',
  languageTitle: 'Language',
  langAuto: 'Follow host',
  langZh: '中文',
  langEn: 'English',
  settingsTitle: 'Retro Dock settings',
  settingsSubtitle: 'Pick an instrument style, dock position and reading behaviour.',
  openSettings: 'Open settings',
  close: 'Close',
  resetCalibration: 'Reset calibration',
  calibration: 'Calibration',
  notCalibrated: 'Not calibrated yet',
  calibrationPending: 'Waiting for host stats',
  calibrationUnavailable: 'Calibration unavailable (host has no sessionStats)',
  samples: '{n} samples',
  source: 'Source',
  sourceProjection: 'projection',
  sourceMixed: 'mixed',
  sourceDom: 'DOM fallback',
  sourceUnavailable: 'source unavailable',
  tipRate: '≈ {tps} tok/s (1.2 s estimate)',
  tipCtx: 'context {ctx}',
  tipHit: 'cache hit {hit} (session)',
  switchToDock: 'Switch to the stats bar',
  switchToInput: 'Switch above the composer',
  ariaGauge: 'Live speed {tps} tok/s, context {ctx}, cache hit {hit}; {action}; {settings}',
  ariaGaugeStatic: 'Live speed {tps} tok/s, context {ctx}, cache hit {hit}',
  ariaSettings: 'Instrument settings',
  previewTitle: 'Preview',
  previewHint: 'A static preview rendered with the current style and density.',
  about: 'About',
  version: 'Version {version}',
  densityHint: 'Auto follows the parent width.',
  notice: 'Readings come from host projections; when a projection is missing the plugin falls back to DOM text and names the source in the tooltip.',
  updated: 'Saved',
};

const DICTS = { zh: ZH, en: EN };

/**
 * @param {'zh'|'en'} lang
 * @returns {(key: string, vars?: Record<string, unknown>) => string}
 */
export const createT = (lang) => {
  const dict = DICTS[lang] ?? ZH;
  return (key, vars) => {
    const template = dict[key] ?? ZH[key] ?? key;
    if (vars === undefined) return template;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ''));
  };
};

/**
 * Resolve the effective language. Explicit preference wins; otherwise the first
 * usable host hint decides, then `zh` because the plugin is Chinese-first.
 *
 * @param {'auto'|'zh'|'en'} preference
 * @param {...(string|null|undefined)} hints
 * @returns {'zh'|'en'}
 */
export const resolveLang = (preference, ...hints) => {
  if (preference === 'zh' || preference === 'en') return preference;
  for (const hint of hints) {
    if (typeof hint !== 'string' || hint.length === 0) continue;
    return /^zh/i.test(hint) ? 'zh' : 'en';
  }
  return 'zh';
};
