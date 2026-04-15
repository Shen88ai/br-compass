export interface MediaItem {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  category: string;
  embedType?: 'youtube' | 'image' | 'link';
  youtubeId?: string;
  thumbnail?: string;
  mediaUrl?: string;
}

const categories = [
  { key: '全部', label: '全部', icon: '🎬' },
  { key: 'youtube', label: 'YouTube', icon: '▶️' },
  { key: 'xiaohongshu', label: '小紅書', icon: '📕' },
  { key: 'douyin', label: '抖音', icon: '🎵' },
  { key: 'ai-video', label: 'AI 視頻', icon: '🤖' },
  { key: 'other', label: '其他', icon: '📎' },
];

const sortOptions = [
  { value: 'date-desc', label: '最新優先' },
  { value: 'date-asc', label: '最舊優先' },
  { value: 'title-asc', label: '標題 A → Z' },
  { value: 'title-desc', label: '標題 Z → A' },
];

function getYouTubeThumbnail(youtubeId: string): string {
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
}

function filterMedia(items: MediaItem[], category: string, keyword: string): MediaItem[] {
  let filtered = items;
  
  if (category !== '全部') {
    filtered = filtered.filter(item => item.mediaCategory === category);
  }
  
  if (keyword) {
    const kw = keyword.toLowerCase();
    filtered = filtered.filter(item => 
      item.title.toLowerCase().includes(kw) ||
      item.description.toLowerCase().includes(kw) ||
      item.tags?.some(tag => tag.toLowerCase().includes(kw))
    );
  }
  
  return filtered;
}

function sortMedia(items: MediaItem[], sortOption: string): MediaItem[] {
  const sorted = [...items];
  
  if (sortOption === 'date-desc') {
    sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortOption === 'date-asc') {
    sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortOption === 'title-asc') {
    sorted.sort((a, b) => a.title < b.title ? -1 : a.title > b.title ? 1 : 0);
  } else if (sortOption === 'title-desc') {
    sorted.sort((a, b) => a.title > b.title ? -1 : a.title < b.title ? 1 : 0);
  }
  
  return sorted;
}

function paginateMedia(items: MediaItem[], page: number, perPage: number): MediaItem[] {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return items.slice(start, end);
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
}

export function initMediaShowcase(initialMedia: MediaItem[]) {
  let currentCategory = '全部';
  let currentKeyword = '';
  let currentSort = 'date-desc';
  let currentPage = 1;
  let carouselIndex = 0;
  let lightboxState: { type: string; src: string; title: string; url?: string } | null = null;
  
  const perPage = 9;
  
  const carouselItems = sortMedia([...initialMedia], 'date-desc').filter(m => m.featured).slice(0, 5);
  const totalCarouselSlides = carouselItems.length;
  
  function getFilteredMedia(): MediaItem[] {
    const filtered = filterMedia(initialMedia, currentCategory, currentKeyword);
    return sortMedia(filtered, currentSort);
  }
  
  function renderCarousel() {
    const carouselEl = document.getElementById('media-carousel');
    if (!carouselEl || carouselItems.length === 0) return;
    
    carouselEl.innerHTML = `
      <div class="media-carousel-track" id="media-carousel-track">
        ${carouselItems.map((item, i) => `
          <div class="media-carousel-slide" data-index="${i}">
            ${item.embedType === 'youtube' && item.youtubeId ? `
              <div class="media-carousel-video">
                <iframe 
                  src="https://www.youtube.com/embed/${item.youtubeId}"
                  title="${item.title}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                ></iframe>
              </div>
            ` : `
              <div class="media-carousel-thumb" data-src="${item.mediaUrl || item.thumbnail}" data-type="${item.embedType || 'link'}" data-url="${item.mediaUrl || ''}" data-title="${item.title}">
                <img src="${item.thumbnail || ''}" alt="${item.title}" 
                  onerror="this.style.display='none'; this.parentElement.querySelector('.media-carousel-placeholder').style.display='flex';"
                />
                <div class="media-carousel-placeholder" style="display:none;">
                  <span>${categories.find(c => c.key === item.mediaCategory)?.icon || '🎬'}</span>
                </div>
                <div class="media-carousel-play"><span>▶</span></div>
              </div>
            `}
            <div class="media-carousel-info">
              <span class="media-carousel-badge">${categories.find(c => c.key === item.mediaCategory)?.icon || '🎬'} ${categories.find(c => c.key === item.mediaCategory)?.label || ''}</span>
              <h3 class="media-carousel-title">${item.title}</h3>
              <p class="media-carousel-desc">${item.description}</p>
            </div>
          </div>
        `).join('')}
      </div>
      ${totalCarouselSlides > 1 ? `
        <button class="media-carousel-btn prev" id="carousel-prev">‹</button>
        <button class="media-carousel-btn next" id="carousel-next">›</button>
        <div class="media-carousel-dots" id="carousel-dots">
          ${carouselItems.map((_, i) => `
            <button class="media-carousel-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></button>
          `).join('')}
        </div>
      ` : ''}
    `;
    
    document.querySelectorAll('.media-carousel-thumb').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const type = el.dataset.type;
        const url = el.dataset.url;
        const title = el.dataset.title;
        
        if (type === 'youtube') {
          openLightbox('youtube', `https://www.youtube.com/embed/${url}`, title, url);
        } else if (type === 'image' && el.dataset.src) {
          openLightbox('image', el.dataset.src, title);
        } else if (url) {
          window.open(url, '_blank');
        }
      });
    });
    
    document.getElementById('carousel-prev')?.addEventListener('click', () => goToSlide((carouselIndex - 1 + totalCarouselSlides) % totalCarouselSlides));
    document.getElementById('carousel-next')?.addEventListener('click', () => goToSlide((carouselIndex + 1) % totalCarouselSlides));
    
    document.querySelectorAll('.media-carousel-dot').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).dataset.slide || '0');
        goToSlide(index);
      });
    });
    
    if (totalCarouselSlides > 1) {
      setInterval(() => goToSlide((carouselIndex + 1) % totalCarouselSlides), 6000);
    }
  }
  
  function goToSlide(index: number) {
    carouselIndex = index;
    const track = document.getElementById('media-carousel-track');
    if (track) {
      track.style.transform = `translateX(-${index * 100}%)`;
    }
    document.querySelectorAll('.media-carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }
  
  function renderFilters() {
    const filtersEl = document.getElementById('media-filters');
    if (!filtersEl) return;
    
    filtersEl.innerHTML = categories.map(cat => `
      <button class="media-filter-btn ${cat.key === currentCategory ? 'active' : ''}" data-category="${cat.key}">
        ${cat.icon} ${cat.label}
      </button>
    `).join('');
    
    filtersEl.querySelectorAll('.media-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentCategory = (e.currentTarget as HTMLElement).dataset.category || '全部';
        currentPage = 1;
        renderFilters();
        renderGrid();
      });
    });
  }
  
  function renderGrid() {
    const gridEl = document.getElementById('media-grid');
    if (!gridEl) return;
    
    const filtered = getFilteredMedia();
    const totalPages = Math.ceil(filtered.length / perPage);
    const pageItems = paginateMedia(filtered, currentPage, perPage);
    
    if (pageItems.length === 0) {
      gridEl.innerHTML = `
        <div class="media-empty-state">
          <span class="media-empty-icon">🔍</span>
          <h3>找不到相符的內容</h3>
          <p>嘗試調整搜尋關鍵字或篩選條件</p>
        </div>
      `;
      return;
    }
    
    gridEl.innerHTML = pageItems.map(item => `
      <div class="media-card" data-id="${item.id}">
        ${item.embedType === 'youtube' && item.youtubeId ? `
          <div class="media-card-video" data-youtube-id="${item.youtubeId}">
            <img src="${getYouTubeThumbnail(item.youtubeId)}" alt="${item.title}" 
              onerror="this.src='https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg';"
              loading="lazy"
            />
            <div class="media-card-play"><span>▶</span></div>
          </div>
        ` : item.thumbnail ? `
          <div class="media-card-thumb" data-src="${item.mediaUrl || item.thumbnail}" data-type="${item.embedType || 'link'}" data-url="${item.mediaUrl || ''}">
            <img src="${item.thumbnail}" alt="${item.title}" loading="lazy" />
            <div class="media-card-play"><span>▶</span></div>
          </div>
        ` : `
          <div class="media-card-thumb media-card-placeholder">
            <span class="placeholder-icon">${categories.find(c => c.key === item.mediaCategory)?.icon || '🎬'}</span>
            <div class="media-card-play"><span>▶</span></div>
          </div>
        `}
        <div class="media-card-body">
          <div class="media-card-meta">
            <span class="media-cat-badge">${categories.find(c => c.key === item.mediaCategory)?.icon || '🎬'} ${categories.find(c => c.key === item.mediaCategory)?.label || ''}</span>
            <time class="media-date">${formatDate(item.date)}</time>
          </div>
          <h3 class="media-card-title">${item.title}</h3>
          <p class="media-card-desc">${item.description}</p>
          ${item.tags && item.tags.length > 0 ? `
            <div class="media-card-tags">
              ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
          ${item.mediaUrl ? `<a href="${item.mediaUrl}" target="_blank" rel="noopener noreferrer" class="media-card-link">查看原文 →</a>` : ''}
        </div>
      </div>
    `).join('');
    
    document.querySelectorAll('.media-card-video').forEach(video => {
      video.addEventListener('click', (e) => {
        const youtubeId = (e.currentTarget as HTMLElement).dataset.youtubeId;
        if (youtubeId) {
          openLightbox('youtube', `https://www.youtube.com/embed/${youtubeId}`, '');
        }
      });
    });
    
    document.querySelectorAll('.media-card-thumb[data-type="image"]').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        openLightbox('image', el.dataset.src || '', '');
      });
    });
    
    document.querySelectorAll('.media-card-thumb[data-type="link"]').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        const el = e.currentTarget as HTMLElement;
        const url = el.dataset.url;
        if (url) window.open(url, '_blank');
      });
    });
    
    renderPagination(totalPages);
  }
  
  function renderPagination(totalPages: number) {
    const paginationEl = document.getElementById('media-pagination');
    if (!paginationEl || totalPages <= 1) {
      if (paginationEl) paginationEl.innerHTML = '';
      return;
    }
    
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    paginationEl.innerHTML = pages.map(page => `
      <button class="media-pagination-btn ${page === currentPage ? 'active' : ''}" data-page="${page}">
        ${page}
      </button>
    `).join('');
    
    paginationEl.querySelectorAll('.media-pagination-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentPage = parseInt((e.currentTarget as HTMLElement).dataset.page || '1');
        renderGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }
  
  function openLightbox(type: string, src: string, title: string, url?: string) {
    lightboxState = { type, src, title, url };
    renderLightbox();
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    lightboxState = null;
    const lightbox = document.getElementById('media-lightbox');
    if (lightbox) lightbox.remove();
    document.body.style.overflow = '';
  }
  
  function renderLightbox() {
    const existing = document.getElementById('media-lightbox');
    if (existing) existing.remove();
    
    if (!lightboxState) return;
    
    const lightbox = document.createElement('div');
    lightbox.id = 'media-lightbox';
    lightbox.className = 'media-lightbox';
    lightbox.innerHTML = `
      <div class="media-lightbox-content">
        ${lightboxState.type === 'youtube' ? `
          <div class="media-lightbox-video">
            <iframe 
              src="${lightboxState.src}?autoplay=1"
              title="${lightboxState.title}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        ` : `
          <img src="${lightboxState.src}" alt="${lightboxState.title}" class="media-lightbox-image" />
        `}
        ${lightboxState.title ? `<p class="media-lightbox-title">${lightboxState.title}</p>` : ''}
        <div class="media-lightbox-actions">
          ${lightboxState.url && lightboxState.type === 'youtube' ? `
            <a href="${lightboxState.url}" target="_blank" rel="noopener noreferrer" class="media-lightbox-btn primary">
              ▶ 在 YouTube 觀看
            </a>
          ` : ''}
          <button class="media-lightbox-btn" id="lightbox-close">✕ 關閉</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(lightbox);
    
    document.getElementById('lightbox-close')?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }
  
  function init() {
    renderCarousel();
    renderFilters();
    renderGrid();
    
    const searchInput = document.getElementById('media-search') as HTMLInputElement;
    const sortSelect = document.getElementById('media-sort') as HTMLSelectElement;
    
    searchInput?.addEventListener('input', (e) => {
      currentKeyword = (e.target as HTMLInputElement).value;
      currentPage = 1;
      renderGrid();
    });
    
    sortSelect?.addEventListener('change', (e) => {
      currentSort = (e.target as HTMLSelectElement).value;
      currentPage = 1;
      renderGrid();
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}
