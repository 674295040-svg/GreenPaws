/**
 * GreenPaws - Master Application Logic (app.js)
 * จัดการ Navigation Tabs, ตลาดแลกเปลี่ยน, เครื่องมือตรวจความปลอดภัย, Bookmarks, Modals และ Theme
 */

const App = {
  activeTab: 'market',
  marketFilterCategory: 'all',
  marketFilterType: 'all',
  marketSearchQuery: '',
  plantFilterSafety: 'all',
  plantSearchQuery: '',

  init() {
    this.initTheme();
    this.bindEvents();
    this.renderMarketplace();
    this.renderPlantDirectory();
    QA.renderThreads();
    Gallery.renderGallery();
  },

  // 1. Theme Management (Light / Dark Mode)
  initTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButton(savedTheme);
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    this.updateThemeButton(newTheme);
  },

  updateThemeButton(theme) {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง' : 'เปลี่ยนเป็นโหมดมืด');
    }
  },

  // 2. Tab Navigation
  switchTab(tabId) {
    this.activeTab = tabId;

    // อัปเดตสถานะปุ่ม Tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // แสดงเฉพาะคอนเทนต์ที่เลือก
    document.querySelectorAll('.tab-content-view').forEach(view => {
      view.classList.toggle('active', view.id === `tab-view-${tabId}`);
    });

    // หากเปิดแท็บ Admin ให้ตรวจสอบสิทธิ์และรีเฟรชแดชบอร์ด
    if (tabId === 'admin') {
      if (!Auth.isAdmin()) {
        this.showToast('หน้านี้สำหรับผู้ดูแลระบบเท่านั้น', 'error');
        this.switchTab('market');
        return;
      }
      Admin.renderStats();
      Admin.switchSubTab(Admin.currentSubTab || 'listings');
    }

    window.scrollTo({ top: 400, behavior: 'smooth' });
  },

  // 3. Marketplace Logic
  renderMarketplace() {
    const container = document.getElementById('marketplace-grid-container');
    if (!container) return;

    let listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    const bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');

    // กรองตามหมวดหมู่
    if (this.marketFilterCategory !== 'all') {
      listings = listings.filter(l => l.category === this.marketFilterCategory);
    }

    // กรองตามประเภท (Swap / Giveaway)
    if (this.marketFilterType !== 'all') {
      listings = listings.filter(l => l.type === this.marketFilterType);
    }

    // กรองตามการค้นหา
    if (this.marketSearchQuery) {
      const q = this.marketSearchQuery.toLowerCase();
      listings = listings.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.offering.toLowerCase().includes(q) ||
        l.lookingFor.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q)
      );
    }

    if (listings.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3>ไม่พบรายการประกาศที่ตรงกับเงื่อนไข</h3>
          <p>ลองปรับคำค้นหา หรือเริ่มต้นสร้างประกาศแลกเปลี่ยนด้วยตัวคุณเอง</p>
          <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="App.openCreateListingModal()">+ ลงประกาศใหม่</button>
        </div>
      `;
      return;
    }

    container.innerHTML = listings.map(item => {
      const isBookmarked = bookmarks.includes(item.id);

      return `
        <div class="listing-card" id="card-${item.id}">
          <div class="listing-card-image-wrap">
            <span class="badge listing-type-badge ${item.type === 'swap' ? 'badge-swap' : 'badge-giveaway'}">
              ${item.type === 'swap' ? '🔄 แลกเปลี่ยน' : '🎁 แจกฟรี/หาบ้าน'}
            </span>
            <button class="listing-bookmark-btn ${isBookmarked ? 'bookmarked' : ''}" onclick="App.toggleBookmark('${item.id}', event)" title="บันทึกรายการโปรด">
              ${isBookmarked ? '❤️' : '🤍'}
            </button>
            <img src="${item.image}" alt="${item.title}" loading="lazy" onclick="App.openListingDetail('${item.id}')" style="cursor: pointer;">
          </div>

          <div class="listing-content">
            <h3 class="listing-title" onclick="App.openListingDetail('${item.id}')" style="cursor: pointer;">
              ${item.title}
            </h3>

            <div class="listing-trade-details">
              <div class="trade-row">
                <span class="trade-label">เสนอให้:</span>
                <span class="trade-value">${item.offering}</span>
              </div>
              <div class="trade-row">
                <span class="trade-label">อยากได้:</span>
                <span class="trade-value">${item.lookingFor}</span>
              </div>
            </div>

            <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.3rem;">
              <span>📍</span> <span>${item.location}</span>
            </div>

            <div class="listing-meta-footer">
              <div class="listing-author">
                <img src="${item.userAvatar}" alt="${item.userName}">
                <span>${item.userName}</span>
              </div>
              <button class="btn btn-outline btn-sm" onclick="App.openListingDetail('${item.id}')">
                ดูข้อมูล
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // สลับ Bookmark
  toggleBookmark(listingId, e) {
    if (e) e.stopPropagation();

    Auth.requireAuth(() => {
      let bookmarks = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKMARKS) || '[]');
      const index = bookmarks.indexOf(listingId);

      if (index > -1) {
        bookmarks.splice(index, 1);
        this.showToast('นำออกจากรายการโปรดแล้ว', 'info');
      } else {
        bookmarks.push(listingId);
        this.showToast('บันทึกลงรายการโปรดแล้ว!', 'success');
      }

      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      this.renderMarketplace();
    });
  },

  // หน้ารายละเอียดประกาศ
  openListingDetail(listingId) {
    const listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    const item = listings.find(l => l.id === listingId);
    if (!item) return;

    const modalBody = document.getElementById('listing-detail-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.1fr; gap: 1.5rem;">
        <div style="border-radius: var(--radius-md); overflow: hidden; max-height: 380px;">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div>
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span class="badge ${item.type === 'swap' ? 'badge-swap' : 'badge-giveaway'}">
              ${item.type === 'swap' ? '🔄 แลกเปลี่ยน' : '🎁 แจกฟรี/ส่งต่อ'}
            </span>
            <span class="badge" style="background: var(--bg-page); color: var(--text-muted);">
              👁️ มีผู้เข้าชม ${item.views || 0} ครั้ง
            </span>
          </div>

          <h2 style="font-size: 1.35rem; font-weight: 800; margin-bottom: 1rem; line-height: 1.4;">
            ${item.title}
          </h2>

          <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.25rem;">
            <div style="margin-bottom: 0.6rem;">
              <strong style="color: var(--primary);">สิ่งที่เสนอ:</strong>
              <p style="margin-top: 0.2rem; font-size: 0.95rem;">${item.offering}</p>
            </div>
            <div style="margin-bottom: 0.6rem;">
              <strong style="color: var(--secondary);">สิ่งที่อยากแลก:</strong>
              <p style="margin-top: 0.2rem; font-size: 0.95rem;">${item.lookingFor}</p>
            </div>
            <div>
              <strong>พิกัดนัดรับ:</strong>
              <p style="margin-top: 0.2rem; font-size: 0.9rem; color: var(--text-muted);">📍 ${item.location}</p>
            </div>
          </div>

          <div style="border: 1px dashed var(--primary); background: var(--primary-surface); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.5rem;">
            <div style="font-weight: 700; color: var(--primary); margin-bottom: 0.35rem;">📞 ช่องทางติดต่อผู้ลงประกาศ</div>
            <div style="font-size: 0.95rem; font-weight: 600;">${item.contact}</div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${item.userAvatar}" style="width: 44px; height: 44px; border-radius: 50%;" alt="${item.userName}">
            <div>
              <div style="font-weight: 700;">${item.userName}</div>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${item.userBadge || 'สมาชิก GreenPaws'}</div>
            </div>
          </div>
        </div>
      </div>
    `;

    // เพิ่มยอดเข้าชม
    item.views = (item.views || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));

    this.openModal('listing-detail-modal');
  },

  // เปิด Modal สร้างประกาศใหม่
  openCreateListingModal() {
    Auth.requireAuth(() => {
      this.openModal('create-listing-modal');
    });
  },

  // บันทึกประกาศใหม่
  createListing(data) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    const newListing = {
      id: 'list-' + Date.now(),
      title: data.title,
      type: data.type,
      category: data.category,
      offering: data.offering,
      lookingFor: data.lookingFor,
      location: data.location,
      contact: data.contact,
      image: data.image || 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      userBadge: user.badge,
      status: 'active',
      isFeatured: false,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0]
    };

    listings.unshift(newListing);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));

    this.closeModal('create-listing-modal');
    this.showToast('ลงประกาศแลกเปลี่ยนเรียบร้อยแล้ว!', 'success');
    this.renderMarketplace();
  },

  // 4. Pet-Safe Plant Checker & Directory
  renderPlantDirectory() {
    const container = document.getElementById('plant-directory-grid-container');
    if (!container) return;

    let plants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTS) || '[]');

    // กรองสถานะความปลอดภัย
    if (this.plantFilterSafety !== 'all') {
      plants = plants.filter(p => p.safetyStatus === this.plantFilterSafety);
    }

    // ค้นหา
    if (this.plantSearchQuery) {
      const q = this.plantSearchQuery.toLowerCase();
      plants = plants.filter(p => 
        p.nameTh.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.scientificName.toLowerCase().includes(q) ||
        (p.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }

    if (plants.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🌿</div>
          <h3>ไม่พบข้อมูลต้นไม้ที่ค้นหา</h3>
          <p>ลองค้นหาด้วยชื่อไทย ชื่อวิทยาศาสตร์ หรือคำค้นอื่น เช่น "คล้า", "เฟิร์น", "ลิลลี่"</p>
        </div>
      `;
      return;
    }

    container.innerHTML = plants.map(plant => {
      const isSafe = plant.safetyStatus === 'safe';

      return `
        <div class="plant-card ${isSafe ? 'border-safe' : 'border-toxic'}">
          <div class="plant-card-img-wrap">
            <span class="badge plant-card-safety-badge ${isSafe ? 'badge-safe' : 'badge-toxic'}">
              ${isSafe ? '✓ ปลอดภัยต่อสัตว์เลี้ยง' : '⚠️ มีสารพิษควรระวัง'}
            </span>
            <img src="${plant.image}" alt="${plant.nameTh}" loading="lazy">
          </div>

          <div class="plant-card-body">
            <div class="plant-names">
              <h3>${plant.nameTh}</h3>
              <div class="plant-scientific">${plant.scientificName}</div>
            </div>

            <p class="plant-description">${plant.description}</p>

            <div class="plant-alert-box ${isSafe ? 'safe' : 'toxic'}">
              <strong>${isSafe ? '✅ ระดับความปลอดภัย:' : '⚠️ อาการที่ต้องระวัง:'}</strong>
              <div>${isSafe ? plant.toxicityLevel : plant.symptoms}</div>
            </div>

            <div class="plant-card-footer">
              <div style="font-size: 0.8rem; color: var(--text-muted);">
                ${isSafe ? '🐾 ปลอดภัยกับน้องหมาและแมว' : '🚫 ห้ามให้น้องแทะเด็ดขาด'}
              </div>
              <button class="btn btn-outline btn-sm" onclick="App.openPlantDetail('${plant.id}')">
                ดูคู่มือการดูแล
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // หน้ารายละเอียดคู่มือต้นไม้
  openPlantDetail(plantId) {
    const plants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTS) || '[]');
    const plant = plants.find(p => p.id === plantId);
    if (!plant) return;

    const modalBody = document.getElementById('plant-detail-modal-body');
    if (!modalBody) return;

    const isSafe = plant.safetyStatus === 'safe';

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 1.5rem;">
        <div style="border-radius: var(--radius-md); overflow: hidden; max-height: 400px;">
          <img src="${plant.image}" alt="${plant.nameTh}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>

        <div>
          <span class="badge ${isSafe ? 'badge-safe' : 'badge-toxic'}" style="margin-bottom: 0.75rem;">
            ${isSafe ? '✓ ปลอดภัยต่อสัตว์เลี้ยง (Pet-Safe)' : '⚠️ มีสารพิษต่อสัตว์เลี้ยง'}
          </span>

          <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.2rem;">${plant.nameTh}</h2>
          <div style="font-size: 0.9rem; font-style: italic; color: var(--text-muted); margin-bottom: 1rem;">
            ${plant.scientificName} (${plant.nameEn})
          </div>

          <p style="font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.25rem;">
            ${plant.description}
          </p>

          <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1rem;">
            <h4 style="font-weight: 700; color: var(--primary); margin-bottom: 0.4rem;">🌱 เคล็ดลับการปลูกและดูแลรักษา</h4>
            <p style="font-size: 0.9rem; line-height: 1.6;">${plant.careGuide}</p>
          </div>

          ${!isSafe ? `
            <div style="background: var(--danger-light); border: 1.5px solid var(--danger); border-radius: var(--radius-md); padding: 1rem; color: #991b1b; margin-bottom: 1rem;">
              <h4 style="font-weight: 700; margin-bottom: 0.4rem;">🚨 วิธีปฐมพยาบาลเมื่อสัตว์เลี้ยงเผลอกิน</h4>
              <p style="font-size: 0.9rem; line-height: 1.6;">${plant.firstAid || 'รีบเช็ดปาก ล้างน้ำสะอาด และนำส่งสัตวแพทย์ทันที'}</p>
            </div>
          ` : ''}

          <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 1rem;">
            ${(plant.tags || []).map(t => `<span class="badge" style="background: var(--bg-page);">${t}</span>`).join('')}
          </div>
        </div>
      </div>
    `;

    this.openModal('plant-detail-modal');
  },

  // 5. ค้นหาด่วนจาก Hero Search
  quickSearchPlant(query) {
    if (!query) return;
    this.plantSearchQuery = query;
    const input = document.getElementById('plant-search-input');
    if (input) input.value = query;

    this.switchTab('knowledge');
    this.renderPlantDirectory();
  },

  // 6. Modal Controls
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }
  },

  // 7. Toast Notification System
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';

    toast.innerHTML = `
      <span style="font-size: 1.25rem;">${icon}</span>
      <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // 8. Event Binding
  bindEvents() {
    // Theme Toggle
    document.getElementById('theme-toggle-btn')?.addEventListener('click', () => this.toggleTheme());

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Quick Checker input enter
    const quickInput = document.getElementById('quick-safety-input');
    quickInput?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        this.quickSearchPlant(quickInput.value.trim());
      }
    });

    // Close modals on overlay click or esc
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.closeModal(overlay.id);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => this.closeModal(m.id));
      }
    });

    // Marketplace Filters
    document.querySelectorAll('#market-category-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#market-category-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.marketFilterCategory = btn.dataset.category;
        this.renderMarketplace();
      });
    });

    document.querySelectorAll('#market-type-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#market-type-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.marketFilterType = btn.dataset.type;
        this.renderMarketplace();
      });
    });

    document.getElementById('market-search-input')?.addEventListener('input', (e) => {
      this.marketSearchQuery = e.target.value.trim();
      this.renderMarketplace();
    });

    // Plant Safety Filters
    document.querySelectorAll('#plant-safety-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#plant-safety-filters .filter-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.plantFilterSafety = btn.dataset.safety;
        this.renderPlantDirectory();
      });
    });

    document.getElementById('plant-search-input')?.addEventListener('input', (e) => {
      this.plantSearchQuery = e.target.value.trim();
      this.renderPlantDirectory();
    });

    // QA Filters
    document.querySelectorAll('#qa-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => QA.setFilter(btn.dataset.filter));
    });

    // Gallery Filters
    document.querySelectorAll('#gallery-filters .filter-pill').forEach(btn => {
      btn.addEventListener('click', () => Gallery.setCategory(btn.dataset.category));
    });

    // Admin Sub tabs
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => Admin.switchSubTab(btn.dataset.subtab));
    });
  }
};

// Start application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
