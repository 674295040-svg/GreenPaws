/**
 * GreenPaws - Showcase Gallery (gallery.js)
 * โหมดแสดงรูปภาพ อวดมุมสวนในบ้าน ตู้เทอร์ราเรียม และสัตว์เลี้ยงแสนรัก
 */

const Gallery = {
  currentCategory: 'all',

  getItems() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || '[]');
  },

  saveItems(items) {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(items));
    this.renderGallery();
  },

  // เรนเดอร์แกลเลอรี
  renderGallery() {
    const container = document.getElementById('gallery-masonry-container');
    if (!container) return;

    let items = this.getItems();
    const currentUser = Auth.getCurrentUser();

    if (this.currentCategory !== 'all') {
      items = items.filter(item => item.category === this.currentCategory);
    }

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📸</div>
          <h3>ยังไม่มีรูปภาพในหมวดหมู่นี้</h3>
          <p>ร่วมเป็นคนแรกที่แชร์มุมโปรดให้ชุมชนได้รับชม</p>
          <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="Gallery.openShareModal()">+ อวดมุมโปรดของคุณ</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(item => {
      const isLiked = currentUser && item.likedBy && item.likedBy.includes(currentUser.id);

      return `
        <div class="gallery-card" id="gallery-${item.id}">
          <div class="gallery-img-container" onclick="Gallery.openLightbox('${item.id}')">
            <span class="badge gallery-overlay-badge" style="background: rgba(0,0,0,0.65); color: #fff; backdrop-filter: blur(4px);">
              ${item.categoryLabel}
            </span>
            <img src="${item.image}" alt="${item.title}" loading="lazy">
          </div>

          <div class="gallery-body">
            <h4 class="gallery-title" onclick="Gallery.openLightbox('${item.id}')" style="cursor: pointer;">
              ${item.title}
            </h4>
            <p class="gallery-caption">${item.description}</p>

            <div class="gallery-tags-row">
              ${(item.tags || []).map(tag => `<span class="gallery-tag-pill">#${tag}</span>`).join('')}
            </div>

            <div class="gallery-footer">
              <div class="listing-author">
                <img src="${item.authorAvatar}" alt="${item.authorName}">
                <span><strong>${item.authorName}</strong></span>
              </div>

              <button class="like-button ${isLiked ? 'liked' : ''}" onclick="Gallery.toggleLike('${item.id}', event)">
                <span class="heart-icon">${isLiked ? '❤️' : '🤍'}</span>
                <span class="like-count">${item.likes || 0}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  // กรองหมวดหมู่แกลเลอรี
  setCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('#gallery-filters .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === cat);
    });
    this.renderGallery();
  },

  // สลับสถานะกดไลก์
  toggleLike(itemId, e) {
    if (e) e.stopPropagation();

    Auth.requireAuth(user => {
      const items = this.getItems();
      const item = items.find(i => i.id === itemId);
      if (!item) return;

      if (!item.likedBy) item.likedBy = [];

      const userIndex = item.likedBy.indexOf(user.id);
      if (userIndex > -1) {
        // ถอนไลก์
        item.likedBy.splice(userIndex, 1);
        item.likes = Math.max(0, (item.likes || 1) - 1);
      } else {
        // กดไลก์
        item.likedBy.push(user.id);
        item.likes = (item.likes || 0) + 1;
      }

      this.saveItems(items);
    });
  },

  // เปิด Lightbox ดูภาพขยาย
  openLightbox(itemId) {
    const item = this.getItems().find(i => i.id === itemId);
    if (!item) return;

    const modalBody = document.getElementById('lightbox-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1.3fr 1fr; gap: 1.5rem;">
        <div style="border-radius: var(--radius-md); overflow: hidden; max-height: 520px;">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
              <img src="${item.authorAvatar}" style="width: 40px; height: 40px; border-radius: 50%;" alt="${item.authorName}">
              <div>
                <h4 style="font-size: 1rem; font-weight: 700;">${item.authorName}</h4>
                <span style="font-size: 0.8rem; color: var(--text-muted);">แชร์เมื่อ ${item.createdAt}</span>
              </div>
            </div>

            <span class="badge" style="background: var(--primary-surface); color: var(--primary); margin-bottom: 0.75rem;">
              ${item.categoryLabel}
            </span>

            <h3 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 0.75rem; line-height: 1.4;">
              ${item.title}
            </h3>

            <p style="font-size: 0.95rem; color: var(--text-main); line-height: 1.7; margin-bottom: 1.25rem;">
              ${item.description}
            </p>

            <div class="gallery-tags-row">
              ${(item.tags || []).map(t => `<span class="gallery-tag-pill">#${t}</span>`).join('')}
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 1.5rem;">
            <button class="btn btn-outline" onclick="Gallery.toggleLike('${item.id}'); Gallery.openLightbox('${item.id}');">
              ❤️ ถูกใจ (${item.likes || 0})
            </button>
            <span style="font-size: 0.85rem; color: var(--text-muted);">✨ ภาพยอดนิยมใน GreenPaws</span>
          </div>
        </div>
      </div>
    `;

    App.openModal('lightbox-modal');
  },

  // เปิด Modal อวดมุมโปรด
  openShareModal() {
    Auth.requireAuth(() => {
      App.openModal('gallery-share-modal');
    });
  },

  // เพิ่มรูปภาพใหม่
  createShowcase(data) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const items = this.getItems();
    const newItem = {
      id: 'gal-' + Date.now(),
      title: data.title,
      category: data.category,
      categoryLabel: data.categoryLabel,
      image: data.image || 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=800&q=80',
      description: data.description,
      tags: data.tags.split(',').map(t => t.trim()).filter(Boolean),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      likes: 1,
      likedBy: [user.id],
      createdAt: new Date().toISOString().split('T')[0]
    };

    items.unshift(newItem);
    this.saveItems(items);
    App.closeModal('gallery-share-modal');
    App.showToast('อวดมุมสวยของคุณเรียบร้อยแล้ว!', 'success');
  }
};
