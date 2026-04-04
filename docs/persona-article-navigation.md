# 文章頁內進度指示和「下一關」導航組件設計

## 1. 頂部小地圖組件（MiniMap）

### 位置
固定在文章頁頂部，導航欄下方，`position: sticky; top: 56px;`

### 視覺設計
```
┌─────────────────────────────────────────────────────────────────────┐
│ 🗺️ 移民征途  │  ●━━━●━━━●━━━━●━━━━●━━━━●━━━━●━━━━●━━━━●      │
│ 關卡 3/19    │  1   2   3    4    5    6    7    8    ... 19     │
│ 稅改時間軸    │  ✅  ✅  📍   🔓   🔒   🔒   🔒   🔒        🔒     │
│ ⏱️ 20min     │                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 組件結構
```html
<div class="journey-minimap" data-path="A" data-current="01-1-tax-timeline">
  <div class="minimap-info">
    <span class="path-name">🛡️ 移民征途</span>
    <span class="checkpoint-progress">關卡 3/19</span>
    <span class="current-title">稅改時間軸</span>
    <span class="eta">⏱️ 20min</span>
  </div>
  <div class="minimap-track">
    <!-- 節點由 JS 動態生成 -->
    <div class="minimap-node completed" data-slug="01-0-pre-entry-checklist">✅</div>
    <div class="minimap-node completed" data-slug="01-tax-system">✅</div>
    <div class="minimap-node current" data-slug="01-1-tax-timeline">📍</div>
    <div class="minimap-node available" data-slug="01-2-visa-golden">🔓</div>
    <div class="minimap-node locked" data-slug="01-3-visa-digital-nomad">🔒</div>
    <!-- ... -->
  </div>
</div>
```

### CSS 樣式
```css
.journey-minimap {
  position: sticky;
  top: 56px;
  z-index: 40;
  background: rgba(15, 15, 24, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(212, 168, 67, 0.2);
  padding: 12px 24px;
  display: flex;
  align-items: center;
  gap: 24px;
  transition: transform 0.3s ease;
}

.journey-minimap.hidden {
  transform: translateY(-100%);
}

.minimap-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 140px;
}

.path-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-platinum);
}

.checkpoint-progress {
  font-size: 12px;
  color: var(--color-gold);
}

.current-title {
  font-size: 11px;
  color: var(--text-secondary);
}

.eta {
  font-size: 11px;
  color: var(--text-muted);
}

.minimap-track {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  padding: 4px 0;
}

.minimap-track::-webkit-scrollbar {
  display: none;
}

.minimap-node {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  position: relative;
}

.minimap-node.completed {
  background: rgba(0, 255, 135, 0.15);
  border: 2px solid var(--color-neon-green);
  color: var(--color-neon-green);
}

.minimap-node.current {
  background: rgba(212, 168, 67, 0.2);
  border: 2px solid var(--color-gold);
  color: var(--color-gold);
  animation: pulse-gold 2s infinite;
}

.minimap-node.available {
  background: rgba(232, 228, 217, 0.1);
  border: 2px solid var(--color-platinum);
  color: var(--color-platinum);
}

.minimap-node.available:hover {
  border-color: var(--color-gold);
  transform: scale(1.1);
}

.minimap-node.locked {
  background: rgba(74, 74, 90, 0.3);
  border: 2px solid var(--color-gray);
  color: var(--color-gray);
  cursor: not-allowed;
  opacity: 0.5;
}

/* 節點之間的連接線 */
.minimap-node::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 2px;
  background: var(--color-gray);
}

.minimap-node.completed::after {
  background: var(--color-neon-green);
}

.minimap-node:last-child::after {
  display: none;
}

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(212, 168, 67, 0); }
}
```

---

## 2. 底部「下一關」導航組件

### 位置
固定在文章頁底部，內容結束後，閱讀進度條到達 100% 時淡入

### 視覺設計
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    ✅ 關卡 3/19 已完成！                             │
│                  🏅 獲得金色印章：「稅改時間軸」                      │
│                                                                     │
│         ⬅️ 上一關                    ➡️ 下一關                       │
│      破譯巴西複雜稅制                 黃金簽證                       │
│      ⏱️ 30min | ⭐⭐                ⏱️ 20min | ⭐                    │
│                                                                     │
│              [ 🔥 繼續征途 → 黃金簽證 ]                              │
│                                                                     │
│         📚 本章詞彙 (5)    |    🔖 收藏此關    |    🗺️ 查看完整地圖   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 組件結構
```html
<div class="journey-navigation" data-path="A" data-current="01-1-tax-timeline" data-next="01-2-visa-golden" data-prev="01-tax-system">
  <div class="nav-celebration" id="celebration">
    <div class="celebration-badge">
      <span class="badge-icon">✅</span>
      <span class="badge-text">關卡 3/19 已完成！</span>
    </div>
    <div class="celebration-stamp">
      <span class="stamp-icon">🏅</span>
      <span class="stamp-text">獲得金色印章：「稅改時間軸」</span>
    </div>
  </div>
  
  <div class="nav-chapters">
    <a href="/handbook/01-tax-system" class="nav-chapter prev">
      <span class="chapter-arrow">⬅️</span>
      <div class="chapter-info">
        <span class="chapter-label">上一關</span>
        <span class="chapter-title">破譯巴西複雜稅制</span>
        <span class="chapter-meta">⏱️ 30min | ⭐⭐</span>
      </div>
    </a>
    
    <a href="/handbook/01-2-visa-golden" class="nav-chapter next">
      <div class="chapter-info">
        <span class="chapter-label">下一關</span>
        <span class="chapter-title">黃金簽證</span>
        <span class="chapter-meta">⏱️ 20min | ⭐</span>
      </div>
      <span class="chapter-arrow">➡️</span>
    </a>
  </div>
  
  <a href="/handbook/01-2-visa-golden" class="nav-cta">
    <span class="cta-fire">🔥</span>
    <span class="cta-text">繼續征途 → 黃金簽證</span>
  </a>
  
  <div class="nav-actions">
    <button class="nav-action" data-action="glossary">
      <span>📚</span>
      <span>本章詞彙 (5)</span>
    </button>
    <button class="nav-action" data-action="bookmark">
      <span>🔖</span>
      <span>收藏此關</span>
    </button>
    <button class="nav-action" data-action="map">
      <span>🗺️</span>
      <span>查看完整地圖</span>
    </button>
  </div>
</div>
```

### CSS 樣式
```css
.journey-navigation {
  background: linear-gradient(180deg, rgba(8, 8, 15, 0) 0%, rgba(15, 15, 24, 0.98) 20%);
  padding: 48px 24px 32px;
  margin-top: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.journey-navigation.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 慶祝動畫 */
.nav-celebration {
  text-align: center;
  animation: celebration-in 0.6s ease-out;
}

.celebration-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: var(--color-neon-green);
  margin-bottom: 8px;
}

.celebration-stamp {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-gold);
  padding: 8px 16px;
  background: rgba(212, 168, 67, 0.1);
  border: 1px solid rgba(212, 168, 67, 0.3);
  border-radius: 20px;
}

@keyframes celebration-in {
  0% { opacity: 0; transform: scale(0.8); }
  50% { transform: scale(1.05); }
  100% { opacity: 1; transform: scale(1); }
}

/* 上一章/下一章 */
.nav-chapters {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
  max-width: 800px;
}

.nav-chapter {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: rgba(15, 15, 24, 0.8);
  border: 1px solid rgba(232, 228, 217, 0.1);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-chapter:hover {
  border-color: var(--color-gold);
  background: rgba(212, 168, 67, 0.05);
  transform: translateY(-2px);
}

.nav-chapter.prev {
  justify-content: flex-start;
}

.nav-chapter.next {
  justify-content: flex-end;
  text-align: right;
}

.chapter-arrow {
  font-size: 20px;
  flex-shrink: 0;
}

.chapter-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.chapter-label {
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.chapter-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.chapter-meta {
  font-size: 11px;
  color: var(--text-secondary);
}

/* 主要 CTA */
.nav-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 32px;
  background: linear-gradient(135deg, var(--color-gold), var(--color-neon-yellow));
  color: var(--bg-deepest);
  font-size: 16px;
  font-weight: 700;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(212, 168, 67, 0.3);
}

.nav-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(212, 168, 67, 0.4);
}

.cta-fire {
  animation: fire-flicker 0.5s infinite alternate;
}

@keyframes fire-flicker {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

/* 輔助操作 */
.nav-actions {
  display: flex;
  gap: 12px;
}

.nav-action {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid rgba(232, 228, 217, 0.2);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-action:hover {
  border-color: var(--color-platinum);
  color: var(--text-primary);
  background: rgba(232, 228, 217, 0.05);
}

.nav-action.bookmarked {
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* 響應式 */
@media (max-width: 640px) {
  .nav-chapters {
    grid-template-columns: 1fr;
  }
  
  .journey-minimap {
    flex-direction: column;
    gap: 8px;
    padding: 8px 16px;
  }
  
  .minimap-info {
    flex-direction: row;
    gap: 12px;
    align-items: center;
  }
  
  .nav-actions {
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

---

## 3. JavaScript 互動邏輯

```javascript
// 文章頁內進度管理
(function() {
  'use strict';
  
  // 檢查是否有 persona journey 數據
  const journeyData = JSON.parse(localStorage.getItem('persona-journey') || '{}');
  if (!journeyData.path) return; // 用戶未選擇路徑，不顯示進度
  
  const currentSlug = document.querySelector('[data-slug]')?.dataset.slug 
    || window.location.pathname.split('/').pop();
  
  // 初始化小地圖
  initMiniMap(journeyData, currentSlug);
  
  // 初始化底部導航
  initBottomNav(journeyData, currentSlug);
  
  // 監讀閱讀完成
  initReadingCompletion(journeyData, currentSlug);
  
  function initMiniMap(data, current) {
    const minimap = document.querySelector('.journey-minimap');
    if (!minimap) return;
    
    const pathConfig = getPathConfig(data.path);
    const currentIndex = pathConfig.findIndex(a => a.slug === current);
    
    // 更新信息
    minimap.querySelector('.path-name').textContent = pathConfig.name;
    minimap.querySelector('.checkpoint-progress').textContent = 
      `關卡 ${currentIndex + 1}/${pathConfig.length}`;
    
    // 生成節點
    const track = minimap.querySelector('.minimap-track');
    track.innerHTML = '';
    
    pathConfig.forEach((article, index) => {
      const node = document.createElement('div');
      node.className = 'minimap-node';
      node.dataset.slug = article.slug;
      
      const status = data.checkpoints?.[article.slug]?.status;
      if (status === 'completed') {
        node.classList.add('completed');
        node.textContent = '✅';
      } else if (article.slug === current) {
        node.classList.add('current');
        node.textContent = '📍';
      } else if (index <= currentIndex + 1) {
        node.classList.add('available');
        node.textContent = '🔓';
      } else {
        node.classList.add('locked');
        node.textContent = '🔒';
      }
      
      // 可點擊的節點
      if (status === 'completed' || node.classList.contains('available')) {
        node.addEventListener('click', () => {
          window.location.href = `/handbook/${article.slug}`;
        });
      }
      
      track.appendChild(node);
    });
    
    // 滾動到當前節點
    const currentNode = track.querySelector('.current');
    if (currentNode) {
      currentNode.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
  
  function initBottomNav(data, current) {
    const nav = document.querySelector('.journey-navigation');
    if (!nav) return;
    
    const pathConfig = getPathConfig(data.path);
    const currentIndex = pathConfig.findIndex(a => a.slug === current);
    const prevArticle = pathConfig[currentIndex - 1];
    const nextArticle = pathConfig[currentIndex + 1];
    
    // 更新導航數據
    if (prevArticle) {
      nav.dataset.prev = prevArticle.slug;
      const prevLink = nav.querySelector('.nav-chapter.prev');
      if (prevLink) {
        prevLink.href = `/handbook/${prevArticle.slug}`;
        prevLink.querySelector('.chapter-title').textContent = prevArticle.title;
        prevLink.querySelector('.chapter-meta').textContent = 
          `⏱️ ${prevArticle.eta} | ${'⭐'.repeat(prevArticle.difficulty)}`;
      }
    } else {
      nav.querySelector('.nav-chapter.prev')?.remove();
    }
    
    if (nextArticle) {
      nav.dataset.next = nextArticle.slug;
      const nextLink = nav.querySelector('.nav-chapter.next');
      const ctaLink = nav.querySelector('.nav-cta');
      if (nextLink) {
        nextLink.href = `/handbook/${nextArticle.slug}`;
        nextLink.querySelector('.chapter-title').textContent = nextArticle.title;
        nextLink.querySelector('.chapter-meta').textContent = 
          `⏱️ ${nextArticle.eta} | ${'⭐'.repeat(nextArticle.difficulty)}`;
      }
      if (ctaLink) {
        ctaLink.href = `/handbook/${nextArticle.slug}`;
        ctaLink.querySelector('.cta-text').textContent = 
          `繼續征途 → ${nextArticle.title}`;
      }
    } else {
      // 最後一關
      nav.querySelector('.nav-chapter.next')?.remove();
      const ctaLink = nav.querySelector('.nav-cta');
      if (ctaLink) {
        ctaLink.querySelector('.cta-fire').textContent = '🏆';
        ctaLink.querySelector('.cta-text').textContent = '🎉 恭喜！你已完成征途！';
        ctaLink.href = '/handbook';
      }
    }
  }
  
  function initReadingCompletion(data, current) {
    // 監聽滾動到底部
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          markAsCompleted(data, current);
          showCelebration();
        }
      });
    }, { threshold: 0.5 });
    
    const navElement = document.querySelector('.journey-navigation');
    if (navElement) {
      observer.observe(navElement);
    }
  }
  
  function markAsCompleted(data, slug) {
    if (!data.checkpoints) data.checkpoints = {};
    if (data.checkpoints[slug]?.status === 'completed') return;
    
    data.checkpoints[slug] = {
      status: 'completed',
      completedAt: new Date().toISOString()
    };
    data.lastVisited = new Date().toISOString();
    
    localStorage.setItem('persona-journey', JSON.stringify(data));
  }
  
  function showCelebration() {
    const celebration = document.getElementById('celebration');
    if (!celebration || celebration.dataset.shown) return;
    
    celebration.dataset.shown = 'true';
    celebration.style.display = 'block';
    
    // 觸發金色粒子動畫（可選）
    triggerGoldParticles();
  }
  
  function triggerGoldParticles() {
    // 簡單的金色粒子效果
    const container = document.createElement('div');
    container.className = 'celebration-particles';
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(container);
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 8px;
        height: 8px;
        background: var(--color-gold);
        border-radius: 50%;
        left: ${50 + (Math.random() - 0.5) * 20}%;
        top: 50%;
        animation: particle-fly ${0.5 + Math.random() * 0.5}s ease-out forwards;
        animation-delay: ${Math.random() * 0.2}s;
      `;
      container.appendChild(particle);
    }
    
    // 添加粒子動畫 CSS
    if (!document.getElementById('particle-animation-style')) {
      const style = document.createElement('style');
      style.id = 'particle-animation-style';
      style.textContent = `
        @keyframes particle-fly {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { 
            transform: translate(${(Math.random() - 0.5) * 200}px, ${-100 - Math.random() * 200}px) scale(0); 
            opacity: 0; 
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // 2秒後移除
    setTimeout(() => container.remove(), 2000);
  }
  
  function getPathConfig(path) {
    // 從 path-mapping 讀取路徑配置
    const paths = {
      A: [
        { slug: '01-0-pre-entry-checklist', title: '入境前合規準備清單', eta: '25min', difficulty: 1 },
        { slug: '01-tax-system', title: '破譯巴西複雜稅制', eta: '30min', difficulty: 2 },
        { slug: '01-1-tax-timeline', title: '稅改時間軸', eta: '20min', difficulty: 2 },
        { slug: '01-2-visa-golden', title: '黃金簽證', eta: '20min', difficulty: 1 },
        { slug: '01-3-visa-digital-nomad', title: '數位遊民簽證', eta: '20min', difficulty: 1 },
        { slug: '01-4-visa-executive', title: '高管簽證 VITEM V', eta: '25min', difficulty: 2 },
        { slug: '02-visa-strategy', title: '簽證戰略與決策地圖', eta: '30min', difficulty: 3 },
        { slug: '03-local-team', title: '在地團隊組建', eta: '20min', difficulty: 2 },
        { slug: '04-company-setup', title: '外資企業閃電成立', eta: '25min', difficulty: 3 },
        { slug: '05-bacen-capital', title: 'BACEN 資金申報', eta: '25min', difficulty: 3 },
        { slug: '06-ecommerce-platforms', title: '電商平台入駐', eta: '20min', difficulty: 2 },
        { slug: '07-radar-import', title: 'RADAR 進口資質', eta: '25min', difficulty: 3 },
        { slug: '08-3pl-warehouse', title: '3PL 倉庫選擇', eta: '20min', difficulty: 2 },
        { slug: '08-1-3pl-contract', title: '3PL 合約談判', eta: '30min', difficulty: 3 },
        { slug: '09-erp-payment', title: 'ERP 與支付整合', eta: '25min', difficulty: 3 },
        { slug: '09-1-split-payment', title: 'Split Payment 現金流', eta: '20min', difficulty: 3 },
        { slug: '10-after-sales-service', title: '售後服務', eta: '20min', difficulty: 2 },
        { slug: '11-tax-compliance', title: '日常稅務合規', eta: '35min', difficulty: 4 },
        { slug: '12-profit-remittance', title: '利潤匯出', eta: '30min', difficulty: 5 },
      ],
      // 其他路徑配置...
    };
    return paths[path] || [];
  }
})();
```

---

## 4. 首頁診斷表單組件

### 位置
替換現有首頁的 Hero 區域

### 視覺設計
```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                    🧭 你的巴西征途，從這裡開始                        │
│                                                                     │
│              ┌─────────────────────────────────────┐                │
│              │         🎭 軍師問話                  │                │
│              │                                     │                │
│              │  "歡迎，探險家。                     │                │
│              │   讓我為你量身打造戰略。"             │                │
│              │                                     │                │
│              │  ┌─────────────────────────────┐   │                │
│              │  │ Q1：你的身份是？              │   │                │
│              │  │                             │   │                │
│              │  │ [🧑‍💼 個人投資者]            │   │                │
│              │  │ [🏢 企業派出]               │   │                │
│              │  │ [🌐 跨境賣家]               │   │                │
│              │  └─────────────────────────────┘   │                │
│              │                                     │                │
│              │         [ 下一步 → ]                │                │
│              └─────────────────────────────────────┘                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 組件結構
```html
<div class="advisor-diagnosis" id="advisor-diagnosis">
  <div class="advisor-header">
    <h1>🧭 你的巴西征途，從這裡開始</h1>
    <p class="subtitle">回答 3 個問題，軍師為你量身打造戰略</p>
  </div>
  
  <div class="advisor-card">
    <div class="advisor-avatar">
      <div class="advisor-silhouette"></div>
      <div class="advisor-candle-glow"></div>
    </div>
    
    <div class="advisor-dialogue">
      <p class="advisor-speech">"歡迎，探險家。<br>讓我為你量身打造戰略。"</p>
    </div>
    
    <form class="diagnosis-form" id="diagnosis-form">
      <!-- Q1 -->
      <div class="question-step active" data-step="1">
        <h3>Q1：你的身份是？</h3>
        <div class="option-grid">
          <label class="option-card">
            <input type="radio" name="identity" value="individual" hidden>
            <span class="option-icon">🧑‍💼</span>
            <span class="option-title">個人投資者</span>
            <span class="option-desc">以個人身份投資巴西</span>
          </label>
          <label class="option-card">
            <input type="radio" name="identity" value="corporate" hidden>
            <span class="option-icon">🏢</span>
            <span class="option-title">企業派出</span>
            <span class="option-desc">代表公司開拓巴西市場</span>
          </label>
          <label class="option-card">
            <input type="radio" name="identity" value="crossborder" hidden>
            <span class="option-icon">🌐</span>
            <span class="option-title">跨境賣家</span>
            <span class="option-desc">人在台灣，貨到巴西</span>
          </label>
        </div>
      </div>
      
      <!-- Q2 -->
      <div class="question-step" data-step="2">
        <h3>Q2：你的終極目標是？</h3>
        <div class="option-grid">
          <label class="option-card">
            <input type="radio" name="goal" value="profit" hidden>
            <span class="option-icon">💰</span>
            <span class="option-title">利潤匯回</span>
            <span class="option-desc">賺巴西的錢，匯回母國</span>
          </label>
          <label class="option-card">
            <input type="radio" name="goal" value="immigration" hidden>
            <span class="option-icon">🏠</span>
            <span class="option-title">移民定居</span>
            <span class="option-desc">拿到身份，在巴西生活</span>
          </label>
          <label class="option-card">
            <input type="radio" name="goal" value="expansion" hidden>
            <span class="option-icon">📦</span>
            <span class="option-title">規模擴張</span>
            <span class="option-desc">把巴西當作拉美樞紐</span>
          </label>
          <label class="option-card">
            <input type="radio" name="goal" value="testing" hidden>
            <span class="option-icon">🎯</span>
            <span class="option-title">快速試水</span>
            <span class="option-desc">最小成本測試市場</span>
          </label>
        </div>
      </div>
      
      <!-- Q3 -->
      <div class="question-step" data-step="3">
        <h3>Q3：你目前的進度是？</h3>
        <div class="option-grid">
          <label class="option-card">
            <input type="radio" name="progress" value="beginner" hidden>
            <span class="option-icon">🔵</span>
            <span class="option-title">零基礎</span>
            <span class="option-desc">還在了解階段</span>
          </label>
          <label class="option-card">
            <input type="radio" name="progress" value="preparing" hidden>
            <span class="option-icon">🟡</span>
            <span class="option-title">準備中</span>
            <span class="option-desc">已決定要做，正在籌備</span>
          </label>
          <label class="option-card">
            <input type="radio" name="progress" value="landed" hidden>
            <span class="option-icon">🟢</span>
            <span class="option-title">已落地</span>
            <span class="option-desc">公司/簽證已搞定</span>
          </label>
          <label class="option-card">
            <input type="radio" name="progress" value="operating" hidden>
            <span class="option-icon">🟣</span>
            <span class="option-title">運營中</span>
            <span class="option-desc">已有銷售，需要優化</span>
          </label>
        </div>
      </div>
      
      <!-- 導航按鈕 -->
      <div class="form-navigation">
        <button type="button" class="btn-prev" id="btn-prev" hidden>← 上一步</button>
        <button type="button" class="btn-next" id="btn-next" disabled>下一步 →</button>
      </div>
    </form>
    
    <!-- 結果揭示 -->
    <div class="result-reveal" id="result-reveal" hidden>
      <div class="result-animation">
        <div class="result-scroll">
          <div class="scroll-seal">📜</div>
          <div class="scroll-content">
            <h3 id="result-path-name">🛡️ 移民征途</h3>
            <p class="result-summary" id="result-summary">
              共 <strong>19</strong> 關，預估 <strong>8</strong> 小時
            </p>
            <div class="result-checklist" id="result-checklist">
              <!-- 動態生成閱讀清單 -->
            </div>
            <a href="#" class="btn-start-journey" id="btn-start-journey">
              🔥 踏上征途
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 診斷邏輯 JavaScript
```javascript
// 診斷表單邏輯
(function() {
  const form = document.getElementById('diagnosis-form');
  if (!form) return;
  
  let currentStep = 1;
  const totalSteps = 3;
  const answers = {};
  
  // 路徑映射表
  const pathMap = {
    'individual-immigration-beginner': 'A',
    'individual-immigration-preparing': 'A',
    'individual-immigration-landed': 'D',
    'individual-immigration-operating': 'E',
    'individual-profit-beginner': 'A',
    'individual-profit-preparing': 'A',
    'individual-profit-landed': 'D',
    'individual-profit-operating': 'E',
    'individual-expansion-beginner': 'A',
    'individual-expansion-preparing': 'C',
    'individual-expansion-landed': 'D',
    'individual-expansion-operating': 'E',
    'individual-testing-beginner': 'F',
    'individual-testing-preparing': 'F',
    'individual-testing-landed': 'B',
    'individual-testing-operating': 'E',
    'corporate-profit-beginner': 'C',
    'corporate-profit-preparing': 'C',
    'corporate-profit-landed': 'D',
    'corporate-profit-operating': 'E',
    'corporate-expansion-beginner': 'C',
    'corporate-expansion-preparing': 'C',
    'corporate-expansion-landed': 'D',
    'corporate-expansion-operating': 'E',
    'corporate-testing-beginner': 'F',
    'corporate-testing-preparing': 'B',
    'corporate-testing-landed': 'D',
    'corporate-testing-operating': 'E',
    'crossborder-testing-beginner': 'F',
    'crossborder-testing-preparing': 'F',
    'crossborder-testing-landed': 'B',
    'crossborder-testing-operating': 'E',
    'crossborder-profit-beginner': 'C',
    'crossborder-profit-preparing': 'C',
    'crossborder-profit-landed': 'D',
    'crossborder-profit-operating': 'E',
    'crossborder-expansion-beginner': 'C',
    'crossborder-expansion-preparing': 'C',
    'crossborder-expansion-landed': 'D',
    'crossborder-expansion-operating': 'E',
  };
  
  // 路徑信息
  const pathInfo = {
    A: { name: '🛡️ 移民征途', checkpoints: 19, hours: 8 },
    B: { name: '🚀 閃電出海', checkpoints: 5, hours: 2.5 },
    C: { name: '🏗️ 企業遠征', checkpoints: 17, hours: 6 },
    D: { name: '⚡ 落地加速', checkpoints: 8, hours: 4 },
    E: { name: '🔧 運營優化', checkpoints: 5, hours: 2.5 },
    F: { name: '🎯 試水偵察', checkpoints: 3, hours: 1.5 },
  };
  
  // 下一步按鈕
  document.getElementById('btn-next').addEventListener('click', () => {
    const currentQuestion = form.querySelector(`.question-step[data-step="${currentStep}"]`);
    const selected = currentQuestion.querySelector('input[type="radio"]:checked');
    if (!selected) return;
    
    answers[currentStep === 1 ? 'identity' : currentStep === 2 ? 'goal' : 'progress'] = selected.value;
    
    if (currentStep < totalSteps) {
      currentStep++;
      updateForm();
    } else {
      showResult();
    }
  });
  
  // 上一步按鈕
  document.getElementById('btn-prev').addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateForm();
    }
  });
  
  // 選項點擊
  form.querySelectorAll('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;
      document.getElementById('btn-next').disabled = false;
    });
  });
  
  function updateForm() {
    // 更新步驟顯示
    form.querySelectorAll('.question-step').forEach(step => {
      step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
    });
    
    // 更新按鈕狀態
    document.getElementById('btn-prev').hidden = currentStep === 1;
    document.getElementById('btn-next').textContent = 
      currentStep === totalSteps ? '揭示戰略 📜' : '下一步 →';
    
    // 檢查當前步驟是否有選擇
    const currentQuestion = form.querySelector(`.question-step[data-step="${currentStep}"]`);
    const selected = currentQuestion.querySelector('input[type="radio"]:checked');
    document.getElementById('btn-next').disabled = !selected;
  }
  
  function showResult() {
    const key = `${answers.identity}-${answers.goal}-${answers.progress}`;
    const path = pathMap[key] || 'A';
    const info = pathInfo[path];
    
    // 保存到 localStorage
    const journeyData = {
      path,
      diagnosis: answers,
      checkpoints: {},
      startedAt: new Date().toISOString(),
      lastVisited: new Date().toISOString()
    };
    localStorage.setItem('persona-journey', JSON.stringify(journeyData));
    
    // 隱藏表單，顯示結果
    form.style.display = 'none';
    document.querySelector('.advisor-dialogue').querySelector('p').textContent = 
      `"你的征途是【${info.name}】，共 ${info.checkpoints} 關。"`;
    
    const reveal = document.getElementById('result-reveal');
    reveal.hidden = false;
    
    // 填充結果
    document.getElementById('result-path-name').textContent = info.name;
    document.getElementById('result-summary').innerHTML = 
      `共 <strong>${info.checkpoints}</strong> 關，預估 <strong>${info.hours}</strong> 小時`;
    
    // 生成閱讀清單
    const checklist = document.getElementById('result-checklist');
    const pathConfig = getPathConfig(path);
    checklist.innerHTML = pathConfig.map((article, i) => `
      <div class="checklist-item">
        <span class="item-number">${i + 1}</span>
        <span class="item-icon">${getArticleIcon(article.slug)}</span>
        <span class="item-title">${article.title}</span>
        <span class="item-eta">${article.eta}</span>
      </div>
    `).join('');
    
    // 設置開始按鈕鏈接
    document.getElementById('btn-start-journey').href = 
      `/handbook/${pathConfig[0].slug}`;
  }
  
  function getPathConfig(path) {
    // 同前文的 getPathConfig 函數
    // ...
  }
  
  function getArticleIcon(slug) {
    const icons = {
      '01-0-pre-entry-checklist': '📋',
      '01-tax-system': '⚖️',
      '01-1-tax-timeline': '🗺️',
      '01-2-visa-golden': '🏠',
      '01-3-visa-digital-nomad': '💻',
      '01-4-visa-executive': '👔',
      '02-visa-strategy': '🛂',
      '03-local-team': '🤝',
      '04-company-setup': '🏛️',
      '05-bacen-capital': '🏦',
      '06-ecommerce-platforms': '🛒',
      '07-radar-import': '📦',
      '08-3pl-warehouse': '🏭',
      '08-1-3pl-contract': '📋',
      '09-erp-payment': '💳',
      '09-1-split-payment': '💸',
      '10-after-sales-service': '🔄',
      '11-tax-compliance': '📋',
      '12-profit-remittance': '💰',
    };
    return icons[slug] || '📄';
  }
})();
```
