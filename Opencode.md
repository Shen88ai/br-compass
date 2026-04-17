# Cloudflare Workers + Astro SSR 部署技術報告

## 問題概述

專案使用 `@astrojs/cloudflare` adapter，部署時遭遇多重錯誤，最終成功部署至 Cloudflare Workers。

## 錯誤脈絡與解決方案

### 1. ASSETS Binding 衝突

**錯誤訊息：**
```
The name 'ASSETS' is reserved in Pages projects. Please use a different name for your Assets binding.
```

**根因：**
- ASSETS 是 Cloudflare Pages 自動提供的保留名稱
- 在 Workers 模式下需手動宣告 assets binding

**解決方案：**
```jsonc
// wrangler.jsonc
{
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  }
}
```

### 2. D1 Database ID 無效

**錯誤訊息：**
```
binding DB of type d1 must have a valid database_id specified [code: 10021]
```

**根因：**
- wrangler.jsonc 中 `database_id` 為 placeholder 或無效值

**解決方案：**
```bash
# 建立 D1 database
npx wrangler d1 create br-compass-db

# 取得 ID 後更新 wrangler.jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "br-compass-db",
      "database_id": "8b159120-b6b7-4d23-b96f-4803fe5bfce9"
    }
  ]
}
```

### 3. SSR vs Static Output 衝突

**錯誤訊息：**
```
getStaticPaths() ignored in dynamic page [/src/pages/handbook/[...slug].astro]
Unsafe attempt to load URL from frame
```

**根因：**
- Astro config 設為 `output: 'server'` (SSR) 時， handbook 頁面使用 `getStaticPaths()` 會被忽略
- 頁面需在 build 時預渲染為靜態 HTML

**解決方案：**
```astro
// src/pages/handbook/[...slug].astro
export const prerender = true;

export async function getStaticPaths() {
  const posts = await getCollection('handbook');
  return posts.map(post => ({
    params: { slug: post.id },
    props: { post },
  }));
}
```

### 4. main 欄位驗證失敗

**錯誤訊息：**
```
The provided Wrangler config main field doesn't point to an existing file
```

**根因：**
- Vite plugin 在 build 前驗證 main path，但檔案尚未生成
- 這是正常警告，build 會繼續執行

**說明：**
此警告不影響 build 流程，無需移除 main 欄位。

## 最終 working 配置

### astro.config.mjs
```javascript
export default defineConfig({
  output: 'server',
  adapter: cloudflare({
    imageService: 'cloudflare'
  }),
  // ... 其他設定
});
```

### wrangler.jsonc
```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "br-compass",
  "compatibility_date": "2026-04-15",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "br-compass-db",
      "database_id": "8b159120-b6b7-4d23-b96f-4803fe5bfce9"
    }
  ],
  "observability": {
    "enabled": true
  }
}
```

## 部署流程

```bash
# 1. Build
npm run build

# 2. Deploy to Cloudflare Workers
npx wrangler deploy
```

## 部署產出

- **URL**: `https://br-compass.shen88-ai.workers.dev`
- **Bindings**:
  - `env.SESSION` → KV Namespace
  - `env.DB` → D1 Database (br-compass-db)
  - `env.ASSETS` → Assets

## 關鍵教訓

1. **Pages vs Workers**: ASSETS 在 Pages 是保留名稱，在 Workers 需手動宣告
2. **SSR + Static 混合**: 在 SSR 模式下使用 `prerender = true` 讓特定頁面預渲染
3. **Build timing**: Wrangler 會在 validate 階段警告 main 不存在，但 build 成功後會產生
4. **D1 必要 ID**: D1 binding 必須有真實 UUID，不能使用 placeholder