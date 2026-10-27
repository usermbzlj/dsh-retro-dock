# DSH Retro Dock

给 DeepSeek Harness 的输入框装一块实时速度表：模型在写的时候，指针告诉你它有多快；停下来之后，数字留住上一轮的平均速度。旁边的小表盘显示上下文占用和缓存命中。

![经典双表盘 · 深色](docs/classic-dark.jpg)

> [浅色样张](docs/classic-light.jpg) · [设置页 · 深色](docs/settings-dark.jpg) · [设置页 · 浅色](docs/settings-light.jpg) · [测量契约](MEASUREMENT.md) · [更新记录](CHANGELOG.md) · [English](README.en.md)

## 一眼能读到什么

- **速度**：实时 tok/s，指针 + 数字。读数按 DeepSeek 自己的用量统计自动校准，带 `≈` 表示估算。
- **本轮均速**：表盘外圈的小三角标出本轮的滚动均速，指针比它快还是慢一眼可见。停下后数字保留上一轮均速，单位换成「均速」，指针如实归零。
- **上下文**：CTX 外环；到警戒线（默认 80%）前是中性色，越线后弧段、数字和 `!` 一起变色。
- **缓存命中**：HIT 内环，青色；标签也是青色，当图例用。
- **数据可信度**：取不到宿主统计、改为按页面文字估算时，仪表旁出现「估」；数据中断时出现虚线「停」。

## 四种外观

| 样式 | 机构 | 适合 |
| --- | --- | --- |
| **经典** | 240° 双表盘、锥形针、配重尾 | 默认；三个读数一眼看全 |
| **广播 VU** | 象牙表盘、宽扇区、超量程红区 | 长时间陪伴 |
| **记录纸** | 20 秒走纸 | 余光看走势和掉速 |
| **瑞士尺** | 数字、发丝尺、方块游标 | 最安静 |

四种外观读同一组数据与校准，在「设置 → Retro Dock → 样式」里切换，选中立即生效。经典和 VU 还可以把速度换成里程表式鼓轮，并在 CTX 旁加绿/黄/红三灯。

## 交互

- **点击仪表**：在「输入框上方」和「底部统计条」之间切换；键盘 Tab 到仪表后按 `Enter` / `Space` 也可以。
- **悬停**：tooltip 列出速度、上下文、缓存命中、最近一轮（首字延迟、平均速度、输出量）、满量程、校准倍率和数据源。
- **密度**：按可用宽度自动切换完整 / 紧凑 / 最小；最小密度把仪表折成一行读数，警告时 CTX 项仍变色并带 `!`。
- **主题**：跟随宿主明暗。经典与瑞士尺借宿主的墨色；VU 是一块不随主题变暗的暖色亮表；记录纸在深色下换成深色纸。
- 仪表本身没有齿轮或弹层，所有偏好集中在宿主「设置 → Retro Dock」。

## 设置

样式、空闲读数（保留上一轮均速）、鼓轮读数、上下文信号灯、位置、密度、满量程（120 / 180 / 240 / 300 tok/s）、上下文警戒线（70 / 80 / 90%）、附加读数开关、语言。设置页右侧是按当前设置渲染的真实预览。

另有「测量」区：最近一轮的首字延迟 / 平均速度 / 输出量、校准状态与重置、测量日志导出（只含时间戳和 token 计数，不含对话内容）。

## 安装

先确认 profile：`dsh web` 使用 `web` profile，桌面应用使用 `desktop` profile。

**DSH Web**

```bash
npx @deepseek-ai/dsh plugin --profile web add github:usermbzlj/dsh-retro-dock
```

**桌面应用**

```bash
cd ~/.dsh/profiles/desktop
pnpm add github:usermbzlj/dsh-retro-dock
```

安装后确认 `~/.dsh/profiles/<profile>/package.json` 的 `dsh.profile.bundles` 包含 `@local/retro-dock`；若 CLI 没自动写入，手动加进数组，再重启 DSH。

**本地打包**

```bash
npm pack   # local-retro-dock-1.7.0.tgz
```

## 数据来源与测量契约

优先级从高到低：

1. 宿主投影：`contextPressure`、`tokenUsage`、`sessionStats`。
2. 聊天 store：`useChat(s => s.legacy.partial)`，只统计模型输出字段。
3. 页面文本回退：投影缺失时读取宿主可见文本；仪表显示「估」角标，tooltip 与 aria 写明数据源。

速度是**估算 + 校准**，不是服务端逐 chunk token 计数：1.2 秒滑动窗口，流式内容增量计数，用宿主 `sessionStats` 的 token 增量校准，倍率限幅 0.4–2.5。本轮均速去掉超过 1.5 秒的间隔（工具等待等）。完整公式与失效条件见 [MEASUREMENT.md](MEASUREMENT.md)。

**隐私**：不发网络请求、不读凭据；只持久化一个偏好 key（`dsh-retro-dock:prefs:v3`，旧的 v2 与 `rg-gauge-placement` 会自动迁移）。`window.__retroDock` 是调试镜像。

**性能**：空闲时停 rAF；有聊天流时不挂 DOM observer；流式计数 O(delta)；密度用 ResizeObserver；只有记录纸在选中时以 4Hz 记录 20 秒轨迹，页面隐藏时暂停。

## 兼容

- 平台：web（Chromium 内核）。
- 宿主：`dsh >= 0.2.0-rc.1 < 0.3.0`；当前在 `0.2.1-rc.3` 上验证。
- 已知限制：`sessionStats` 缺失时无法校准；页面文本回退不如宿主投影可信。

## 开发

```bash
npm install
npm run build      # 把 src/ 打包成 client.js
npm test           # 71 项测试
npm run preview    # 生成 docs/gallery.html（样张与设置页）
npm run shots      # 需要 Chromium：npx playwright install chromium
node review/states-shoot.mjs   # 四种外观 × 两个位置 × 全部状态的验收截图
```

`client.js` 是构建产物，不要手改。源码结构：

```
src/measure.js        纯测量函数
src/stream.js         增量流式计数
src/rate.js           1.2s 窗口、平滑、校准
src/engine.js         进程级引擎（含最近一轮统计）
src/prefs.js          偏好存储与迁移
src/themes.js         样式、密度、量程等偏好校验
src/i18n.js           中英文字符串
src/ui/classic.js     经典双表盘
src/ui/design-gauge.js VU / 记录纸 / 瑞士尺共用的外壳
src/ui/designs/       三套机构 + 共用零件（鼓轮、信号灯、最小读数行）
src/ui/gauge.js       槽位组件与状态接线
src/ui/settings.js    宿主设置页
src/styles/           对应 CSS
scripts/              build / gallery / shots
```

## 版本说明

- **1.7.0**：空闲保留上一轮均速 + 表盘均速标记；经典表盘重做针、轴帽与刻度，修掉 0 速时的蓝点，读数右对齐，过速辉光；CTX 读数补 `%`，HIT 标签作图例；信号灯改实心灯罩；设置页灰掉不适用的开关；README 与样张更新为四种外观。
- **1.6.x**：收敛为四种外观；VU 刻度与瑞士尺游标修复；输入位仪表放大。
- **1.5.0**：最近一轮读数；测量日志导出；会话切换不再污染校准。
- **1.1.0**：四套样式的历史版本，tag 与 Release 保留。

## 许可

MIT
