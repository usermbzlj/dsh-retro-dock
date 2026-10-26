/**
 * Tiny self-contained i18n layer. The plugin's strings are its own, not the
 * host namespace, so they travel with the bundle and work in the composer, the
 * settings page and the static gallery.
 */

const ZH = {
  appName: 'Retro Dock',
  unit: 'tok/s',
  ctx: 'CTX',
  hit: 'HIT',
  placementTitle: '位置',
  placementInput: '输入框上方',
  placementDock: '底部统计条',
  styleTitle: '样式',
  styleHint: '七种测量语言；经典双表盘保留。',
  styleClassic: '经典',
  densityTitle: '密度',
  densityAuto: '自动',
  densityFull: '完整',
  densityCompact: '紧凑',
  densityMinimal: '最小',
  densityHint: '自动会按父容器宽度切换。',
  scaleTitle: '满量程',
  scaleUnit: '{n} tok/s',
  scaleTooltip: '满量程 {n} tok/s',
  warnTitle: 'CTX 警告',
  warnUnit: '{n}%',
  warnAtTooltip: 'CTX 警戒 {n}%',
  warnAria: '上下文已到警戒线',
  subTitle: '显示 CTX / HIT',
  subField: '副表',
  languageTitle: '语言',
  langAuto: '跟随宿主',
  langZh: '中文',
  langEn: 'English',
  settingsSubtitle: '调整停靠位置、密度与读数口径。',
  resetCalibration: '重置校准',
  calibration: '校准',
  notCalibrated: '未校准',
  calibrationPending: '等待宿主统计',
  calibrationUnavailable: '校准不可用（宿主未提供用量统计）',
  samples: '{n} 样本',
  source: '数据源',
  sourceProjection: '宿主统计',
  sourceMixed: '混合',
  sourceDom: '页面文本',
  sourceUnavailable: '数据不可用',
  qualityDom: '数据来自页面文本，不是宿主统计',
  qualityMixed: '部分数据来自页面文本',
  tipRate: '≈ {tps} tok/s（1.2 秒估算）',
  tipCtx: '上下文 {ctx}',
  tipHit: '缓存命中 {hit}（会话累计）',
  switchToDock: '切换到统计条',
  switchToInput: '切换到输入框上方',
  currentPlacement: '当前在{where}',
  ariaGaugeStatic: '瞬时速度 {tps} tok/s，上下文 {ctx}，缓存命中 {hit}',
  ariaGaugeClassic: '瞬时速度 {tps} tok/s，上下文 {ctx}，缓存命中 {hit}',
  turnLabel: '最近一轮：',
  turnTtft: '首 token {v}',
  turnAvg: '平均 ≈ {v} tok/s',
  turnTokens: '≈ {v} tok',
  turnTitle: '最近一轮',
  turnEmpty: '还没有输出',
  exportLog: '导出测量日志',
  exportLogHint: '日志只含时间戳与 token 计数，不含对话内容。',
  previewTitle: '预览',
  previewHint: '示例读数，非当前会话的实时值。',
  previewCurrent: '当前设置',
  previewExample: '示例',
  version: '版本 {version}',
  notice: '优先使用宿主的实时统计；读取不到时用页面文本估算，并在仪表上标出数据来源。',
};

const EN = {
  appName: 'Retro Dock',
  unit: 'tok/s',
  ctx: 'CTX',
  hit: 'HIT',
  placementTitle: 'Position',
  placementInput: 'Above composer',
  placementDock: 'Stats bar',
  styleTitle: 'Style',
  styleHint: 'Seven measuring languages; the classic dual dial stays available.',
  styleClassic: 'Classic',
  densityTitle: 'Density',
  densityAuto: 'Auto',
  densityFull: 'Full',
  densityCompact: 'Compact',
  densityMinimal: 'Minimal',
  densityHint: 'Auto follows the parent width.',
  scaleTitle: 'Full scale',
  scaleUnit: '{n} tok/s',
  scaleTooltip: 'Full scale {n} tok/s',
  warnTitle: 'CTX warning',
  warnUnit: '{n}%',
  warnAtTooltip: 'CTX warning at {n}%',
  warnAria: 'context is at the warning line',
  subTitle: 'Show CTX / HIT',
  subField: 'Sub readouts',
  languageTitle: 'Language',
  langAuto: 'Follow host',
  langZh: '中文',
  langEn: 'English',
  settingsSubtitle: 'Adjust dock position, density and reading behaviour.',
  resetCalibration: 'Reset calibration',
  calibration: 'Calibration',
  notCalibrated: 'Not calibrated yet',
  calibrationPending: 'Waiting for host stats',
  calibrationUnavailable: 'Calibration unavailable (host has no usage stats)',
  samples: '{n} samples',
  source: 'Source',
  sourceProjection: 'host stats',
  sourceMixed: 'mixed',
  sourceDom: 'page text',
  sourceUnavailable: 'source unavailable',
  qualityDom: 'Data comes from page text, not host stats',
  qualityMixed: 'Part of the data comes from page text',
  tipRate: '≈ {tps} tok/s (1.2 s estimate)',
  tipCtx: 'context {ctx}',
  tipHit: 'cache hit {hit} (session)',
  switchToDock: 'Switch to the stats bar',
  switchToInput: 'Switch above the composer',
  currentPlacement: 'Currently {where}',
  ariaGaugeStatic: 'Live speed {tps} tok/s, context {ctx}, cache hit {hit}',
  ariaGaugeClassic: 'Live speed {tps} tok/s, context {ctx}, cache hit {hit}',
  turnLabel: 'Last turn: ',
  turnTtft: 'first token {v}',
  turnAvg: 'avg ≈ {v} tok/s',
  turnTokens: '≈ {v} tok',
  turnTitle: 'Last turn',
  turnEmpty: 'No output yet',
  exportLog: 'Export measurement log',
  exportLogHint: 'Timestamps and token counts only, no conversation text.',
  previewTitle: 'Preview',
  previewHint: 'Example readings, not live session values.',
  previewCurrent: 'Current settings',
  previewExample: 'Example',
  version: 'Version {version}',
  notice: 'Uses the host live stats when available; otherwise estimates from page text and marks the source on the gauge.',
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
