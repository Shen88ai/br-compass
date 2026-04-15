# BR-COMPASS — 專案開發指引

> 本文檔紀錄 ASTRO 巴西跨境電商手冊項目的所有風格、設計、架構、格式、規劃及已解決問題的最終方案。新增內容時請嚴格遵循本文檔。

---

## 一、專案架構

### 目錄結構
```
br-compass/
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
**现象**：```mermaid` 代码块显示为原始代码，而非流程图。
**原因**：Astro 默认不处理 Mermaid 语法。
**解决方案**：
1. 在 `src/layouts/Layout.astro` 添加客户端 JavaScript，使用 CDN 加载 Mermaid 库并渲染
2. CSS 样式已在 `src/styles/global.css` 中配置（金色主题）
3. 修复 pipe 字符 `|` 问题 - 使用引号包裹包含 `|` 的节点文本

### 问题 7.1：Mermaid 流程图文字太小
**解决方案**：
1. 调大 CSS 字体：13px → 15px
2. 使用 subgraphs 分组简化结构
3. 简化节点文字（移除冗余描述）
4. 使用 `flowchart TD` 垂直走向

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

---

## 十九、首頁 3D 羅盤（Fate Wheel）優化記錄

### 19.1 羅盤核心優化

#### 19.1.1 添加方向文字標籤
**檔案**：`src/lib/fate-wheel/compass-core.ts`

在 3D 羅盤的四個方位水晶旁邊添加文字標籤（偵察兵、奠基者、領航員、收割者），使用 `THREE.Sprite` 技術實現始終面向攝影機的文字。

#### 19.1.2 "BR" 中心文字
**檔案**：`src/lib/fate-wheel/compass-core.ts`

在羅盤中心添加 "BR" 文字：
- 使用 900 字重的 Inter 字體
- 色彩在箔金→金色→熒黃→螢綠→淡藍之間輪迴漸變
- 與呼吸動畫同步週期（2.5秒）
- 立體陰影效果

#### 19.1.3 水晶改為透明玻璃質感
**檔案**：`src/lib/fate-wheel/compass-core.ts`

將實心水晶改為透明玻璃質感：
- 使用 `transmission: 0.9` 產生玻璃折射效果
- 低 `opacity: 0.15`，低 `metalness: 0.1`
- 使用 `EdgesGeometry` 描繪彩色邊框

#### 19.1.4 刪除小白字標籤
**檔案**：`src/lib/fate-wheel/compass-core.ts`

原本每個方向有兩個標籤（小白字 + 有色大字），簡化為只有一個有色大字的標籤，字體加大 1.2 倍。

### 19.2 互動效果優化

#### 19.2.1 每次點擊都觸發光芒效果
**檔案**：`src/lib/fate-wheel/scene-manager.ts`

每次點擊水晶時都會觸發光芒向四方射出的動畫：
- `triggerRayEffect()` - 從中心向四個方向射出光束
- `createRayBurst()` - 使用 `BoxGeometry` 產生有厚度的光束
- 光束會在 1 秒後消失並清理資源

#### 19.2.2 Hover 時也有光芒效果
**檔案**：`src/lib/fate-wheel/scene-manager.ts`

在滑鼠移動時檢測是否 hover 到水晶，若 hover 到則觸發單向光芒效果。

#### 19.2.3 Hover 時水晶邊框效果
**檔案**：`src/lib/fate-wheel/compass-core.ts`

- hover 時水晶變得更透明（`opacity: 0.08`）
- 邊框發光更強（`emissiveIntensity: 1.0`）
- 邊框從隱藏（opacity 0.5）變為顯示（opacity 1.0）
- 標籤放大效果增強

### 19.3 路徑標籤系統

#### 19.3.1 診斷完成後顯示路徑標籤
**檔案**：`src/lib/fate-wheel/scene-manager.ts`

回答 Q1/Q2/Q3 完成診斷後，在半徑 2.65 的軌道（與 planet 同一軌道）顯示 7 個路徑標籤：
- 🛡️ 移民征途 (A)
- 🚀 閃電出海 (B)
- 🏗️ 企業遠征 (C)
- ⚡ 落地加速 (D)
- 🔧 運營優化 (E)
- 🎯 試水偵察 (F)
- 💻 數位遊民征途 (G)

所有標籤繞著軌道旋轉（60秒一圈）。

#### 19.3.2 選中路徑顯示透明有色框
**檔案**：`src/lib/fate-wheel/scene-manager.ts`

被選中的路徑會顯示 `RingGeometry` 框住的透明邊框，顏色根據路徑：
- A: 淡藍 #7DD3FC
- B: 金色 #FFD700
- C: 箔金 #D4A843
- D: 螢綠 #00FF87
- E: 熒黃 #E5FF00
- F: 紅 #FF6B6B
- G: 銀灰 #C0C0C0

#### 19.3.3 修復重複選擇邊框問題
**檔案**：`src/lib/fate-wheel/scene-manager.ts`

每次重新選擇時會先清理舊的資源：
- `createPathLabels()` 會先移除並釋放舊的標籤 Sprite
- `createPathFrame()` 會先移除並釋放舊的邊框 Mesh

### 19.4 踏上征途功能

#### 19.4.1 路徑頁面渲染
**檔案**：`src/pages/handbook/index.astro`

點擊「踏上征途」會導航到 `/handbook#path-{letter}`，頁面會：
1. 檢測 URL hash
2. 從 `pathConfigs` 取得該路徑的所有 checkpoint
3. 使用 bento-grid 卡片形式渲染列表
4. 標題顯示路徑名稱（如「🛡️ 移民征途」）

### 19.5 Hero 區域樣式

**檔案**：`src/pages/index.astro`

```css
.hero-section-fullscreen {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;  /* 內容在底部 */
  text-align: center;
  padding: var(--space-3) var(--space-3) var(--space-5);
  position: relative;
  z-index: 10;
}
```

羅盤顯示在頁面上方，標題和按鈕顯示在底部。

### 19.6 已解決問題（續）

#### 問題 11：光芒射出後不消失
**現象**：點擊水晶後光芒一直顯示，不再消失。
**原因**：`gsap` 未正確導入。
**解決方案**：在 `scene-manager.ts` 添加 `import gsap from 'gsap'`，並改用 `BoxGeometry` 代替 `Line`。

#### 問題 12：hover 時邊框不明顯
**現象**：hover 時有色邊框沒有顯示。
**原因**：`EdgesGeometry` 的邊框線條太細，且被其他物體遮擋。
**解決方案**：
- 邊框使用 `opacity: 1`（不透明）
- 使用 `EdgesGeometry(crystalGeo, 15)` 增加邊緣檢測閾值
- 邊框與水晶一起縮放動畫

#### 問題 13：調整選項後邊框重複
**現象**：返回調整兩次就出現兩個幾何邊框。
**原因**：每次選擇時都創建新的邊框，但沒有清理舊的。
**解決方案**：在 `createPathLabels()` 和 `createPathFrame()` 中先清理舊資源。

#### 問題 14：踏上征途連結無效
**現象**：點擊「踏上征途」後 URL 正確但沒有顯示列表。
**原因**：`handbook/index.astro` 沒有處理 `#path-{letter}` hash。
**解決方案**：添加 `handlePathHash()` 函數檢測 hash 並渲染 checkpoint 列表。

#### 問題 15：首頁羅盤與標題重疊
**現象**：羅盤與英雄區文字重疊。
**解決方案**：調整 `hero-section-fullscreen` 的 `justify-content: flex-end`，讓文字內容顯示在底部。

---

## 二十、閱讀清單與羅盤銜接優化（Path Navigation Enhancement）

### 20.1 計劃背景
用戶痛點：回答 Q1/Q2/Q3 之後出現的路徑能與後續的羅盤金黃色的按鈕（必須閱讀的網頁清單）有更好的銜接。

### 20.2 實施方案

#### 20.2.1 方案一：強化閱讀清單（Phase 1）

**目標**：將 result-checklist 改為可點擊的卡片網格

**修改檔案**：
- `src/styles/global.css` — 新增卡片樣式
- `src/components/DiagnosisForm.astro` — 渲染可點擊卡片
- `tests/diagnosis-enhancement.test.ts` — 新增測試

**CSS 樣式**（`src/styles/global.css`）：
```css
.checklist-item--card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(15,15,24,0.8), rgba(20,20,30,0.6));
  border-radius: 0.75rem;
  border-left: 3px solid var(--path-color);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}

/* 狀態樣式 */
.checklist-item--status-completed::after { content: '✓'; ... }
.checklist-item--status-current { animation: pulse-gold 2s ... }
.checklist-item--status-pending { opacity: 0.6; }

/* 路徑顏色邊框 */
.checklist-item--path-A { --path-color: #7DD3FC; }
.checklist-item--path-B { --path-color: #FFD700; }
.checklist-item--path-C { --path-color: #D4A843; }
.checklist-item--path-D { --path-color: #00FF87; }
.checklist-item--path-E { --path-color: #E5FF00; }
.checklist-item--path-F { --path-color: #FF6B6B; }
.checklist-item--path-G { --path-color: #C0C0C0; }

/* 懸浮顯示 strategy */
.checklist-item__strategy {
  position: absolute;
  left: 100%;
  top: 0;
  width: 280px;
  padding: 12px;
  background: rgba(10,10,18,0.95);
  border: 1px solid var(--path-color);
  border-radius: 0.5rem;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
  z-index: 100;
  margin-left: 8px;
}
.checklist-item--card:hover .checklist-item__strategy {
  opacity: 1;
  visibility: visible;
}
```

**功能特性**：
- 每個 checklist-item 變為可點擊的卡片
- 狀態圓點反映 localStorage 進度（已完成=綠鉤、當前=金色閃爍、待讀=灰色）
- 路徑顏色邊框與羅盤一致
- 懸浮時顯示戰略揭示文字（strategy）

#### 20.2.2 方案二：羅盤路徑可點擊（Phase 2）

**目標**：3D 羅盤診斷後顯示的路徑標籤可互動

**修改檔案**：
- `src/lib/fate-wheel/scene-manager.ts` — 添加路徑標籤點擊事件
- `src/components/FateWheel/FateWheelScene.astro` — 添加路徑面板
- `src/styles/fate-wheel.css` — 面板樣式
- `tests/fate-wheel-click.test.ts` — 新增測試

**場景管理器**（`src/lib/fate-wheel/scene-manager.ts`）：
```typescript
function onPathLabelClick(raycaster, camera, mouse) {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(pathLabelSprites);
  
  if (intersects.length > 0) {
    const clickedSprite = intersects[0].object;
    const pathKey = clickedSprite.userData.pathKey;
    
    window.dispatchEvent(new CustomEvent('path-label-click', {
      detail: { pathKey }
    }));
  }
}
```

**路徑面板 HTML**：
```html
<div class="path-label-panel" id="path-label-panel" style="display: none;">
  <button class="panel-close" id="panel-close">&times;</button>
  <h3 class="panel-title" id="panel-title"></h3>
  <p class="panel-strategy" id="panel-strategy"></p>
  <div class="panel-checkpoints" id="panel-checkpoints"></div>
  <a href="#" class="panel-cta" id="panel-cta">開始征途</a>
</div>
```

**面板樣式**（`src/styles/fate-wheel.css`）：
```css
.path-label-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 480px;
  background: rgba(10, 10, 18, 0.98);
  border: 1px solid var(--color-gold);
  border-radius: 1rem;
  padding: var(--space-4);
  z-index: 1000;
  box-shadow: 0 0 60px rgba(var(--color-gold-rgb), 0.3);
}
```

**功能特性**：
- Raycaster 檢測滑鼠點擊路徑標籤
- dispatch 'path-label-click' 事件
- 面板顯示完整 checkpoint 列表
- 金色 CTA 按鈕直接跳轉

### 20.3 Checkpoint 數量對照表

| 路徑 | Checkpoint 數 |
|------|--------------|
| A    | 19           |
| B    | 5            |
| C    | 17           |
| D    | 8            |
| E    | 5            |
| F    | 3            |
| G    | 5            |

### 20.4 測試結果
- Phase 1 測試：12 tests ✅
- Phase 2 測試：14 tests ✅
- 總測試數：329 tests ✅
- Build：成功 ✅

---

## 二十一、圖片管理系統（Image Management）

### 21.1 系統架構

```
resources/Image/              →  同步  →  public/images/handbook/  →  發布  →  dist/images/handbook/
     ↑                            ↑                                   ↑
   AI 生成圖片                 腳本複制                            Astro build
```

### 21.2 圖片來源與命名規範

**來源資料夾**：`C:\Users\YANG\Antigravity\20260331\resources\Image\`

**命名格式**：`{章節slug}-{用途}.{副檔名}`

| 用途關鍵字 | 說明 |
|-----------|------|
| `cover` | 封面圖 |
| `infographic` | 資訊圖表 |
| `diagram` | 示意圖 |
| `flowchart` | 流程圖 |
| `warning` | 警示圖 |
| `example` | 範例截圖 |

**範例**：
```
01-tax-system-cover.png       # 封面圖
01-tax-system-infographic.png # 資訊圖表
05-bacen-capital-cover.jpeg   # 封面圖
```

### 21.3 同步腳本

**檔案**：`scripts/sync-images.ts`

**功能**：
1. 讀取 `resources/Image/` 下的所有圖片
2. 解析檔名提取 slug 和用途
3. 複製到 `public/images/handbook/{slug}/`
4. 保留原始檔名

**使用方式**：
```bash
npx tsx scripts/sync-images.ts
# 或
npm run sync-images
```

### 21.4 Obsidian Frontmatter 整合

**frontmatter 格式**：
```yaml
---
title: "破譯巴西複雜稅制"
images:
  cover: 01-tax-system-cover.png
  infographic: 01-tax-system-infographic.png
---
```

**自動添加腳本**：`scripts/add-images-frontmatter.ts`
- 掃描 `resources/Image/` 自動為每個章節添加 `images.cover`
- 已完成 19 個章節的 frontmatter 添加

### 21.5 Content Schema

**檔案**：`src/content.config.ts`

**新增欄位**：
```typescript
images: z.object({
  cover: z.string().optional(),
  diagram: z.string().optional(),
  flowchart: z.string().optional(),
  comparison: z.string().optional(),
  warning: z.string().optional(),
  example: z.string().optional(),
}).optional(),
```

### 21.6 頁面渲染

**文章頁面**：`src/pages/handbook/[...slug].astro`
- 讀取 frontmatter `images.cover`
- 渲染封面圖到文章頂部

**Handbook 首頁**：`src/pages/handbook/index.astro`
- 關鍵議題快覽（Carousel）：5張縮圖
- 英雄之旅時間軸：19張縮圖
- 使用 `getCoverImage()` 函數讀取

### 21.7 圖片資料夾說明

| 資料夾 | 用途 |
|-------|------|
| `resources/Image/` | AI 生成圖片來源 |
| `public/images/handbook/` | 開發時使用 |
| `dist/images/handbook/` | 發布後正式上線 |

### 21.8 發布流程

```bash
# 1. 同步圖片
npm run sync-images

# 2. 發布 build
npm run build

# 3. 部署 dist/ 到網站
```

### 21.9 未來規劃

- **中期**：串接 Cloudinary 優化圖片載入
- **長期**：CMS 管理（非必要）
