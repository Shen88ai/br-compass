# TIDAL TELESCOPE — 專案開發指引

> 本文檔紀錄 ASTRO 巴西跨境電商手冊項目的所有風格、設計、架構、格式、規劃及已解決問題的最終方案。新增內容時請嚴格遵循本文檔。

---

## 一、專案架構

### 目錄結構
```
tidal-telescope/
├── src/
│   ├── content/
│   │   └── handbook/              # 所有章节 MD 文件（19 篇）
│   ├── data/
│   │   ├── glossary.ts            # 专业术语词典
│   │   └── path-mapping.ts        # Persona 角色扮演系统路径映射
│   ├── components/
│   │   ├── CompassView.astro      # 互动罗盘组件（首页入口）
│   │   ├── DiagnosisForm.astro    # 军师诊断表单组件（3 问诊断）
│   │   ├── JourneyMiniMap.astro   # 文章页顶部小地图组件
│   │   └── JourneyNav.astro       # 文章页底部导航组件
│   ├── layouts/
│   │   └── Layout.astro           # 全局布局（含全域搜寻栏）
│   ├── pages/
│   │   ├── index.astro            # 首页（含罗盘 + 诊断 + 阶段卡片）
│   │   └── handbook/
│   │       ├── index.astro        # Handbook 首页
│   │       └── [...slug].astro    # 文章内页模板（含 persona 系统）
│   └── styles/
│       └── global.css             # 全局样式
├── scripts/
│   └── generate-search-index.ts   # 搜寻索引生成脚本
├── public/
│   └── search-index.json          # 静态搜寻索引（19 篇文章）
├── tests/                         # Vitest 测试文件
├── docs/                          # 设计文档
│   ├── persona-design-spec.md     # Persona 系统设计规范
│   ├── persona-interaction-flow.md# 互动流程图
│   ├── persona-path-mapping.md    # 路径映射表
│   └── persona-canvas.canvas      # JSON Canvas 视觉稿
├── package.json
└── vitest.config.ts
```

### 章节命名规则
- 文件名格式：`{phase}-{order}-{slug}.md`
- Phase 01 = preparation（战略蓝图）
- Phase 02 = foundation（实体建立）
- Phase 03 = operations（运营执行）
- Phase 04 = harvest（财务合规）
- 示例：`01-0-pre-entry-checklist.md`、`05-bacen-capital.md`、`12-profit-remittance.md`

### Frontmatter 格式
```yaml
---
title: "章节标题"
description: "章节描述（用于 SEO 和卡片预览）"
phase: "preparation"          # preparation | foundation | operations | harvest
phaseLabel: "第一階段：戰略藍圖"
order: 1                       # 数字，决定章节顺序
icon: "📋"                     # emoji 图标
tags: ["标签1", "标签2"]
featured: true                 # 可选，标记为重点章节
---
```

---

## 二、写作风格

### 因果连接开篇
**每章必须以因果连接开头**，格式：
```markdown
> **因果連接**：如果[条件]——你将面临[后果]。[解决方案]。
```

示例：
> **因果連接**：如果你不先辦好 CPF 和海牙認證就飛到巴西——你將面臨「人在巴西、文件還在原籍國認證中」的尷尬局面，簽證申請直接延後 2~4 個月。

### 专业术语使用
- 中文为主，首次出现时附带葡文原名
- 示例：`CPF（Cadastro de Pessoas Físicas，个人税号）`
- 使用 glossary.ts 词典系统，术语自动高亮 + tooltip

### 关键决策检查清单
每章结尾必须包含：
```markdown
## [關鍵決策] 章节名称检查清单

- [ ] 检查项 1？
- [ ] 检查项 2？
- [ ] 检查项 3？

完成[本章主题]后，[过渡语]——下一步是[下一章主题]！
```

### 提示框格式
```markdown
> **💡 核心優勢**：[内容]
> **⚠️ 注意**：[内容]
> **⚠️ 致命關卡**：[内容]
```

---

## 三、互动组件规范

### ✅ 正确做法：JS 写在 `[...slug].astro` 模板中

**所有互动组件的 JavaScript 必须写在 `src/pages/handbook/[...slug].astro` 的 `<script>` 块中**，使用 IIFE + 元素存在性检查：

```typescript
// 在 [...slug].astro 的 <script> 块中
(function initComponentName() {
  const el = document.getElementById('component-id');
  if (!el) return;  // 当前页面没有此组件，直接跳过

  // 组件逻辑...
})();
```

### ❌ 错误做法：JS 写在 Markdown 文件中

**不要**在 `.md` 文件中使用 `<script is:inline>` 或 `onclick` 属性：
- Astro 的 Markdown 处理器会剥离 `<script>` 标签
- `onclick` 内联事件处理器会被移除
- HTML 注释 `<!-- -->` 会被渲染为纯文本

### 事件委托模式

使用 `data-action` 和 `data-choice` 属性，在父容器上监听点击事件：

```html
<!-- Markdown 中的 HTML -->
<div class="component-container" id="my-component">
  <button class="choice-btn" data-action="my-action" data-choice="option-a">
    选项 A
  </button>
  <button class="choice-btn" data-action="my-action" data-choice="option-b">
    选项 B
  </button>
</div>
```

```typescript
// 在 [...slug].astro 中
(function initComponentName() {
  const container = document.getElementById('my-component');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const choice = btn.getAttribute('data-choice');

    if (action === 'my-action') {
      // 处理逻辑...
    }
  });
})();
```

### 已验证可用的互动组件

| 组件 | ID | 触发方式 | 位置 |
|------|-----|---------|------|
| 签证决策地图 | `visa-decision-map` | 事件委托 | `[...slug].astro` |
| VITEM V 流程 | `vitem5-flow` | 事件委托 | `[...slug].astro` |
| 税额计算器 | `timeline-calc` | `onclick`（旧版，仍可用） | `[...slug].astro` |
| 3PL 检查清单 | `3pl-checklist` | 事件监听 | `[...slug].astro` |

---

## 四、HTML 在 Markdown 中的规则

### ✅ 正确做法
- HTML 块内**不能有空白行**（空行会导致 Astro 解析为段落）
- 所有标签必须正确闭合
- 使用 `style="display:none;"` 控制初始隐藏
- 使用 `data-*` 属性传递交互数据

### ❌ 错误做法
- HTML 块中使用 `<!-- 注释 -->`（会被渲染为纯文本）
- HTML 块中使用 `onclick="..."`（会被移除）
- HTML 元素之间有空白行（会导致 HTML 断裂）
- `<li>` 标签之间有空白行（会被解析为段落）

### 正确 HTML 块示例
```html
<div class="container">
  <div class="item">内容 1</div>
  <div class="item">内容 2</div>
  <div class="hidden-item" style="display:none;">隐藏内容</div>
</div>
```

---

## 五、CSS 命名规范

### 命名模式
- 使用 BEM 风格：`.block__element--modifier`
- 组件前缀：`.decision-map-*`、`.visa-flow-*`、`.timeline-*`
- 颜色变量：`var(--color-gold)`、`var(--color-neon-green)`、`var(--color-bg-800)`

### 已定义的组件样式

| CSS 类 | 用途 | 文件 |
|--------|------|------|
| `.decision-map` | 签证决策地图容器 | `global.css` |
| `.decision-map-option` | 决策选项按钮 | `global.css` |
| `.decision-map-result` | 决策结果展示 | `global.css` |
| `.decision-flow-card` | 决策流程卡片 | `global.css` |
| `.decision-path-grid` | 签证路径卡片网格 | `global.css` |
| `.decision-path-card` | 单个签证路径卡片 | `global.css` |
| `.visa-flow-card` | VITEM V 流程容器 | `global.css` |
| `.visa-flow-step` | 流程步骤 | `global.css` |
| `.visa-flow-choice` | 流程选择按钮 | `global.css` |
| `.visa-flow-restart` | 重新开始按钮 | `global.css` |
| `.visa-flow-footer` | 流程底部（放重置按钮） | `global.css` |

### 卡片样式模式
```css
.component-card {
  background: linear-gradient(135deg, var(--color-bg-800), #12121f);
  border: 1px solid rgba(var(--color-gold-rgb), 0.2);
  border-left: 3px solid var(--color-gold);
  border-radius: var(--radius-card);
  padding: var(--space-4);
  margin: var(--space-4) 0;
  box-shadow: 0 4px 24px rgba(0,0,0,0.3);
}
```

---

## 六、测试规范

### 测试框架
- 使用 Vitest
- 测试文件位于 `tests/` 目录
- 命名格式：`{feature}.test.ts`

### 测试模式
```typescript
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const handbookDir = join(process.cwd(), 'src', 'content', 'handbook');

describe('章节名称', () => {
  const mdPath = join(handbookDir, 'filename.md');

  describe('Frontmatter', () => {
    it('档案应存在', () => {
      expect(existsSync(mdPath)).toBe(true);
    });
  });

  describe('写作风格', () => {
    it('应以因果连接开篇', () => {
      const md = readFileSync(mdPath, 'utf-8');
      expect(md).toMatch(/因果連接/);
    });
  });
});
```

### TDD 流程（严格遵守）
1. **RED**：先写失败的测试
2. **Verify RED**：确认测试失败（不是报错，是失败）
3. **GREEN**：写最小代码使测试通过
4. **Verify GREEN**：确认所有测试通过
5. **REFACTOR**：清理代码，保持测试通过

### 运行测试
```bash
npm test                    # 运行所有测试
npm test -- tests/file.test.ts  # 运行单个测试文件
```

---

## 七、词汇系统（glossary.ts）

### 条目格式
```typescript
{
  term: '术语名',
  category: 'tax' | 'id' | 'agency' | 'system' | 'legal' | 'payment' | 'logistics',
  pronunciation: '发音',
  fullPortuguese: '完整葡文名',
  chineseName: '中文名',
  analogy: '🇹🇼 类似台湾的...',
  oneLiner: '一句话解释',
  fullExplanation: '详细解释',
  practicalTips: ['提示 1', '提示 2'],
  commonMistakes: ['常见错误 1', '常见错误 2'],
  relatedTerms: ['相关术语 1', '相关术语 2'],
}
```

### 章节术语映射
在 `chapterTerms` 中添加章节对应的术语列表：
```typescript
export const chapterTerms: Record<string, string[]> = {
  '01-0-pre-entry-checklist': ['CPF', 'Apostila da Haia', 'Tradução Juramentada', 'gov.br', 'Procuração'],
  '01-4-visa-executive': ['VITEM V', 'INSS', 'FGTS', 'Pró-labore'],
  // ...
};
```

---

## 八、SCE-IED (RDE-IED) 命名规范

**所有提及旧系统 RDE-IED 的地方，必须使用 `SCE-IED (RDE-IED)` 格式**，以便连贯新旧制度。

已在以下文件中完成替换：
- `05-bacen-capital.md`
- `12-profit-remittance.md`
- `04-company-setup.md`
- `02-visa-strategy.md`

---

## 九、已解决问题记录

### 问题 1：互动组件点击无反应
**现象**：在 Markdown 文件中使用 `<script is:inline>` 或 `onclick` 属性，点击按钮无反应。
**原因**：Astro 的 Markdown 处理器会剥离 `<script>` 标签和 `onclick` 属性。
**解决方案**：将所有互动 JS 移至 `src/pages/handbook/[...slug].astro` 的 `<script>` 块中，使用事件委托 + `data-action` 属性。

### 问题 2：HTML 注释被渲染为纯文本
**现象**：`<!-- Step 1 -->` 等 HTML 注释在页面上显示为文字。
**原因**：Astro 的 Markdown 处理器不识别 HTML 注释。
**解决方案**：完全移除 HTML 块中的所有注释。

### 问题 3：HTML 块断裂，标签泄漏
**现象**：`<div>` 等标签在页面上显示为纯文本。
**原因**：HTML 块中存在空白行，Astro 将其解析为段落中断。
**解决方案**：HTML 块内不能有空白行，所有元素必须连续书写。

### 问题 4：`<li>` 标签被剥离
**现象**：`<ul>` 中的部分 `<li>` 消失，内容变成普通文本。
**原因**：`<li>` 之间有空白行或缩进不一致。
**解决方案**：确保 `<li>` 之间无空白行，缩进一致。

### 问题 5：VITEM V 流程只显示第一步
**现象**：流程卡片只显示步骤 1，其余步骤不渲染。
**原因**：`onclick` 处理器被 Astro 移除，JS 未正确加载。
**解决方案**：使用事件委托模式，在 `[...slug].astro` 中监听 `data-action` 属性。

---

## 十、内容放置逻辑

### 章节顺序原则
1. **因果链**：前置条件 → 决策 → 执行 → 结果
2. **时间轴**：入境前 → 入境 → 设立 → 运营 → 收割
3. **复杂度递增**：简单概念 → 复杂操作

### 当前章节顺序
```
Phase 1: preparation
  01-0-pre-entry-checklist.md    # 入境前准备（起点）
  01-tax-system.md               # 税制地图
  01-1-tax-timeline.md           # 税改时间轴
  01-2-visa-golden.md            # 黄金签证
  01-3-visa-digital-nomad.md     # 数位游民签证
  01-4-visa-executive.md         # 高管签证 VITEM V
  02-visa-strategy.md            # 签证决策地图
  03-local-team.md               # 找会计师/律师

Phase 2: foundation
  04-company-setup.md            # 公司设立
  05-bacen-capital.md            # BACEN 申报

Phase 3: operations
  06-ecommerce-platforms.md
  07-radar-import.md
  08-3pl-warehouse.md
  08-1-3pl-contract.md
  09-erp-payment.md
  09-1-split-payment.md

Phase 4: harvest
  10-after-sales-service.md
  11-tax-compliance.md
  12-profit-remittance.md        # 利润汇回
```

---

## 十一、构建与验证

### 构建命令
```bash
npm run build     # 构建生产版本
npm run dev       # 开发服务器
npm test          # 运行所有测试
```

### 验证清单
- [ ] 所有测试通过（`npm test`）
- [ ] 构建成功（`npm run build`）
- [ ] 无构建警告或错误
- [ ] 互动组件在构建后正常工作
- [ ] HTML 块在构建输出中完整（检查 `dist/` 目录）

---

## 十二、新增内容 checklist

新增章节时请确认：
- [ ] 文件名符合 `{phase}-{order}-{slug}.md` 格式
- [ ] Frontmatter 包含所有必需字段
- [ ] 以因果连接开篇
- [ ] 包含 `[關鍵決策]` 检查清单
- [ ] 专业术语已添加到 `glossary.ts`
- [ ] 术语已添加到 `chapterTerms` 映射
- [ ] 互动组件 JS 写在 `[...slug].astro` 中
- [ ] HTML 块内无空白行、无注释
- [ ] 使用 `data-action` 而非 `onclick`
- [ ] 测试文件已创建并通过
- [ ] `npm run build` 成功

---

## 十三、Persona 角色扮演系统（英雄之旅）

### 核心概念
读者进入首页时面对「军师诊断」，回答 3 个问题后获得个人化战略路径。选择后进入文章页，通过右下角「战略征途」面板和底部导航完成闯关，**不需要回到首页**。

### 13.1 数据层：`src/data/path-mapping.ts`

**接口定义**：
```typescript
interface Checkpoint {
  slug: string;        // 文章 slug
  title: string;       // 文章标题
  eta: string;         // 预估阅读时间
  difficulty: number;  // 难度 1-5
  strategy: string;    // 揭示战略文字（显示在侧边面板）
}

interface PathInfo {
  name: string;         // 路径名称（含 emoji）
  checkpoints: number;  // 关卡总数
  hours: number;        // 预估总时长
}
```

**6 条战略路径**：

| 路径 | 名称 | 关卡数 | 适合身份 | 适合目标 | 适合进度 |
|------|------|--------|---------|---------|---------|
| A | 🛡️ 移民征途 | 19 | 个人投资者 | 移民定居 | 零基础/准备中 |
| B | 🚀 闪电出海 | 5 | 跨境卖家 | 快速试水 | 零基础 |
| C | 🏗️ 企业远征 | 17 | 企业派出 | 规模扩张 | 准备中 |
| D | ⚡ 落地加速 | 8 | 个人/企业 | 利润汇回 | 已落地 |
| E | 🔧 运营优化 | 5 | 任何身份 | 利润汇回 | 运营中 |
| F | 🎯 试水侦察 | 3 | 跨境卖家 | 快速试水 | 零基础 |

**诊断映射表** `diagnosisMap`：`身份-目标-进度 → 路径`（48 种组合 → 6 条路径）

### 13.2 首页组件

**`CompassView.astro`** — 互动罗盘（4 方位）
- 北：🔵 侦察兵（Preparation）— 铂金
- 东：🟡 奠基者（Foundation）— 金色
- 南：🟢 领航员（Operations）— 霓虹绿
- 西：🟣 收割者（Harvest）— 霓虹黄

**`DiagnosisForm.astro`** — 军师诊断表单（3 问）
- Q1：身份（个人投资者 / 企业派出 / 跨境卖家）
- Q2：目标（利润汇回 / 移民定居 / 规模扩张 / 快速试水）
- Q3：进度（零基础 / 准备中 / 已落地 / 运营中）
- 结果：卷轴展开动画 → 显示路径 + 阅读清单 → 「踏上征途」按钮

### 13.3 文章页组件

**右下角「战略征途」面板**（固定定位）：
- 金色浮动按钮（🧭）固定在右下角，带弹跳动画
- 点击展开面板，显示：路径名称、进度、所有关卡列表
- 每个关卡包含：状态圆点 + 标题 + **战略揭示文字**
- 底部有「🏠 返回首页重选角色」按钮

**底部导航**（`JourneyNav`）：
- 滚动到文章底部时淡入
- 庆祝动画（✅ 关卡 X/Y 已完成 + 🏅 金色印章）
- 上一关 / 下一关链接
- 主要 CTA：「🔥 继续征途 → [下一章标题]」
- 最后一关显示：「🏆 🎉 恭喜！你已完成征途！」

### 13.4 进度储存
```javascript
localStorage: {
  "persona-journey": {
    "path": "A",
    "diagnosis": { "identity": "...", "goal": "...", "progress": "..." },
    "checkpoints": { "slug": { "status": "completed", "completedAt": "..." } },
    "startedAt": "...",
    "lastVisited": "..."
  }
}
```

### 13.5 新增 CSS 类

| CSS 类 | 用途 |
|--------|------|
| `.persona-hidden` | 默认隐藏（JS 控制显示） |
| `.advisor-section` | 首页诊断区域 |
| `.advisor-card` | 军师卡片容器 |
| `.advisor-dialogue` | 军师对话气泡 |
| `.diagnosis-form` | 诊断表单容器 |
| `.question-step` | 诊断问题步骤 |
| `.option-grid` / `.option-card` | 选项网格/卡片 |
| `.result-reveal` / `.result-scroll` | 结果卷轴展开 |
| `.checklist-item` | 阅读清单项 |
| `.btn-start-journey` | 踏上征途按钮 |
| `.compass-container` / `.compass-ring` | 罗盘容器/环 |
| `.compass-direction` | 罗盘方位（north/east/south/west） |
| `.journey-side-panel` | 右下角战略征途面板 |
| `.side-panel-toggle` | 面板浮动按钮 |
| `.side-panel-content` | 面板内容区 |
| `.side-panel-track` | 关卡轨道 |
| `.side-row` / `.side-dot` / `.side-label` / `.side-strategy` | 关卡行/圆点/标题/战略 |
| `.journey-navigation` | 底部导航容器 |
| `.nav-celebration` | 庆祝动画 |
| `.nav-chapters` / `.nav-chapter` | 章节导航 |
| `.nav-cta` | 主要 CTA 按钮 |
| `.flow-card` | 流程卡片（替代 ASCII/Mermaid） |
| `.decision-flow-card` | 决策流程卡片 |
| `.decision-flow-branch-card` | 分支卡片 |
| `.branch-card-step` / `.branch-card-body` | 分支步骤/内容 |
| `.global-search-bar` | 全域搜寻栏（navbar 下方） |
| `.global-search-input` | 搜寻输入框 |
| `.global-search-results` | 搜寻结果下拉面板 |

### 13.6 测试文件
- `tests/path-mapping.test.ts` — 18 个测试，验证路径映射完整性

---

## 十四、全域搜寻系统

### 14.1 位置与行为
- 固定在 navbar 正下方（`position: fixed; top: 64px`）
- 滚动时 navbar 缩小，搜寻栏同步上移（`top: 56px`）
- **所有页面**随时可见、随时可输入

### 14.2 数据来源（三重策略）
1. **`window.searchData`** — handbook 页面通过 `define:vars` 注入
2. **轮询等待** — 每 200ms 检查 `window.searchData`，最多 5 秒
3. **`fetch('/search-index.json')`** — 静态 JSON 索引（build 后一定可用）

### 14.3 搜寻引擎
- Fuse.js 7.0.0（CDN 动态加载）
- 权重配置：标题 50% > 描述 30% > 标签 15% > 内容 10% > 阶段 5%
- 匹配文字高亮（黄色标记）
- 最多显示 8 个结果

### 14.4 交互功能
- 即时输入（200ms 防抖）
- ✕ 清除按钮
- ESC 键关闭
- 点击外部关闭结果面板

### 14.5 搜寻索引生成
```bash
npx tsx scripts/generate-search-index.ts  # 手动生成
# 或自动：astro.config.mjs hooks 在 dev 和 build 时自动生成
```

---

## 十五、导航更新

### 15.1 Navbar 新增「🏠 首页」按钮
- 位置：`Layout.astro` 导航栏最左侧
- 链接：`/`
- 功能：随时可点击返回首页，重新选择角色

### 15.2 首页「四大实战阶段」链接修复
- 修复前：`/handbook/preparation`（不存在的路由 → 404）
- 修复后：`/handbook#phase-preparation`（锚点链接 → 滚动到对应阶段）
- 4 个阶段链接：
  - `#phase-preparation` — 阶段一
  - `#phase-foundation` — 阶段二
  - `#phase-operations` — 阶段三
  - `#phase-harvest` — 阶段四

### 15.3 关键议题快览链接修复
- 修复前：纯展示卡片，不可点击
- 修复后：每个卡片包裹 `<a href="/handbook/${slug}">`，点击跳转对应文章
- 5 张卡片对应文章：
  - `01-tax-system` — 破译巴西复杂税制
  - `01-1-tax-timeline` — 税改 2026-2033 过渡期
  - `05-bacen-capital` — 注资路径 SCE-IED
  - `06-ecommerce-platforms` — 电商平台入驻
  - `08-3pl-warehouse` — 3PL 仓库选择

---

## 十六、Mermaid/ASCII 流程图 → Card 格式转换

### 转换原则
所有 Mermaid 流程图和 ASCII 流程图已转换为 card 格式，确保渲染成功且保持一致性。

### 16.1 `flow-card` — 简单线性流程
用于 3-5 步的简单流程（如 4 年转永居路径）：
```html
<div class="flow-card">
  <div class="flow-card-header">
    <span class="flow-card-step">1</span>
    <span class="flow-card-title">步骤标题</span>
  </div>
  <div class="flow-card-arrow">↓</div>
  <div class="flow-card-header">
    <span class="flow-card-step">2</span>
    <span class="flow-card-title">步骤标题</span>
  </div>
</div>
```

### 16.2 `decision-flow-card` — 复杂多步流程
用于 6+ 步的复杂流程（如签证完整路径）：
```html
<div class="decision-flow-card">
  <div class="decision-flow-header">
    <span class="decision-flow-icon">🏠</span>
    <h4 class="decision-flow-title">流程标题</h4>
    <p class="decision-flow-desc">流程描述</p>
  </div>
  <div class="decision-flow-branches">
    <div class="decision-flow-branch-card">
      <div class="branch-card-step">1</div>
      <div class="branch-card-body">
        <div class="branch-card-title">步骤标题</div>
        <div class="branch-card-desc">步骤描述</div>
      </div>
    </div>
    <!-- 更多步骤... -->
  </div>
</div>
```

### 16.3 已完成转换的文件
| 文件 | 原标题 | 转换内容 |
|------|--------|---------|
| `01-2-visa-golden.md` | 五、4 年转永居路径 | ASCII → `flow-card`（3 步骤） |
| `01-2-visa-golden.md` | 七、[Mermaid 流程图] 黄金签证路径 | Mermaid → `decision-flow-card`（9 步骤） |
| `01-3-visa-digital-nomad.md` | 五、[Mermaid 流程图] 数位游民签证路径 | Mermaid → `decision-flow-card`（6 步骤） |

---

## 十七、已解决问题记录（续）

### 问题 6：Persona 系统测试失败（diagnosisMap 覆盖率不足）
**现象**：18 个测试中有 1 个失败，`corporate-immigration-beginner` 和 `crossborder-immigration-beginner` 缺失。
**原因**：诊断映射表未覆盖所有 48 种组合。
**解决方案**：补充缺失的 `corporate-immigration-*`（4 条）和 `crossborder-immigration-*`（4 条）映射。

### 问题 7：Mermaid 流程图在 Astro 中无法渲染
**现象**：````mermaid` 代码块显示为原始代码，而非流程图。
**原因**：Astro 默认不处理 Mermaid 语法。
**解决方案**：将所有 Mermaid 和 ASCII 流程图转换为 card 格式（`flow-card` / `decision-flow-card`）。

### 问题 8：四大实战阶段链接 404
**现象**：点击首页阶段卡片跳转到 `/handbook/preparation` 等不存在的路由。
**原因**：这些不是实际路由，应该用锚点链接。
**解决方案**：改为 `/handbook#phase-preparation` 等锚点链接。

### 问题 9：全域搜寻栏不返回结果
**现象**：输入搜寻词后显示「载入索引中...」或无反应。
**原因**：Layout 的 script 比 handbook 页面的 script 更早执行，`window.searchData` 还是空的；dev 模式下 `search-index.json` 可能还没生成。
**解决方案**：采用三重载入策略 — 立即检查 `window.searchData` + 轮询等待（200ms/次，最多 5 秒）+ fetch 静态 JSON。

### 问题 10：关键议题快览卡片不可点击
**现象**：5 张快览卡片无法点击跳转。
**原因**：卡片没有包裹 `<a>` 标签。
**解决方案**：用 `<a href="/handbook/${slide.slug}">` 包裹每张卡片，并更新 `heroSlides` 数据添加 `slug` 字段。

---

## 十八、测试文件清单

| 测试文件 | 测试数 | 用途 |
|---------|--------|------|
| `tests/path-mapping.test.ts` | 18 | Persona 路径映射完整性验证 |
| `tests/root-index.test.ts` | 6 | 首页结构验证 |
| `tests/spatial-hierarchy.test.ts` | 13 | 空间层次与视觉层级 |
| `tests/design-system.test.ts` | 14 | 设计系统一致性 |
| `tests/slug-page.test.ts` | 19 | 文章页面渲染 |
| 其他测试文件 | ~186 | 各章节内容、格式、风格验证 |
| **总计** | **256** | 全部通过 ✅ |
