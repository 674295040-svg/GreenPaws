/**
 * GreenPaws - Admin Dashboard Management (admin.js)
 * จัดการระบบผู้ดูแลระบบ (Moderation, Plant Database, Analytics, Users)
 */

const Admin = {
  currentSubTab: 'listings',

  // คำนวณและแสดงสถิติภาพรวม
  renderStats() {
    const users = Auth.getAllUsers();
    const listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    const plants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTS) || '[]');
    const threads = QA.getThreads();
    const gallery = Gallery.getItems();

    const statsGrid = document.getElementById('admin-stats-grid');
    if (!statsGrid) return;

    statsGrid.innerHTML = `
      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="background: rgba(139, 92, 246, 0.15); color: #8b5cf6;">👥</div>
        <div>
          <div style="font-size: 1.75rem; font-weight: 800;">${users.length}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">สมาชิกทั้งหมด</div>
        </div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="background: var(--primary-surface); color: var(--primary);">🔄</div>
        <div>
          <div style="font-size: 1.75rem; font-weight: 800;">${listings.length}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">ประกาศแลกเปลี่ยน</div>
        </div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;">🌿</div>
        <div>
          <div style="font-size: 1.75rem; font-weight: 800;">${plants.length}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">ต้นไม้ในฐานข้อมูล</div>
        </div>
      </div>

      <div class="admin-stat-card">
        <div class="admin-stat-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;">💬</div>
        <div>
          <div style="font-size: 1.75rem; font-weight: 800;">${threads.length}</div>
          <div style="font-size: 0.85rem; color: var(--text-muted);">กระทู้ถาม-ตอบ</div>
        </div>
      </div>
    `;
  },

  // สลับแท็บย่อยใน Admin Dashboard
  switchSubTab(tabName) {
    this.currentSubTab = tabName;
    document.querySelectorAll('.admin-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.subtab === tabName);
    });

    const listingsPanel = document.getElementById('admin-listings-panel');
    const plantsPanel = document.getElementById('admin-plants-panel');
    const usersPanel = document.getElementById('admin-users-panel');

    if (listingsPanel) listingsPanel.style.display = tabName === 'listings' ? 'block' : 'none';
    if (plantsPanel) plantsPanel.style.display = tabName === 'plants' ? 'block' : 'none';
    if (usersPanel) usersPanel.style.display = tabName === 'users' ? 'block' : 'none';

    if (tabName === 'listings') this.renderListingsTable();
    if (tabName === 'plants') this.renderPlantsTable();
    if (tabName === 'users') this.renderUsersTable();
  },

  // 1. ตารางจัดการประกาศแลกเปลี่ยน
  renderListingsTable() {
    const tableBody = document.getElementById('admin-listings-table-body');
    if (!tableBody) return;

    const listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    tableBody.innerHTML = listings.map(item => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${item.image}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;">
            <div>
              <strong>${item.title.substring(0, 45)}...</strong>
              <div style="font-size: 0.78rem; color: var(--text-muted);">โดย: ${item.userName}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge ${item.type === 'swap' ? 'badge-swap' : 'badge-giveaway'}">
            ${item.type === 'swap' ? 'แลกเปลี่ยน' : 'ส่งต่อฟรี'}
          </span>
        </td>
        <td>
          <span class="badge ${item.status === 'active' ? 'badge-safe' : 'badge-toxic'}">
            ${item.status === 'active' ? 'กำลังดำเนินการ' : 'สำเร็จแล้ว'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-outline btn-sm" onclick="Admin.toggleFeatured('${item.id}')">
              ${item.isFeatured ? '⭐ เลิกปักหมุด' : '☆ ปักหมุด'}
            </button>
            <button class="btn btn-sm" style="background: var(--danger-light); color: var(--danger);" onclick="Admin.deleteListing('${item.id}')">
              ลบ
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  },

  // ลบประกาศ
  deleteListing(id) {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบประกาศนี้?')) return;
    let listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    listings = listings.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
    App.showToast('ลบประกาศเรียบร้อยแล้ว', 'info');
    this.renderStats();
    this.renderListingsTable();
    App.renderMarketplace();
  },

  // ปักหมุดประกาศ
  toggleFeatured(id) {
    let listings = JSON.parse(localStorage.getItem(STORAGE_KEYS.LISTINGS) || '[]');
    const item = listings.find(l => l.id === id);
    if (item) {
      item.isFeatured = !item.isFeatured;
      localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(listings));
      App.showToast(item.isFeatured ? 'ปักหมุดประกาศสำเร็จ' : 'ยกเลิกการปักหมุดสำเร็จ', 'success');
      this.renderListingsTable();
      App.renderMarketplace();
    }
  },

  // 2. ตารางและฟอร์มจัดการฐานข้อมูลต้นไม้
  renderPlantsTable() {
    const tableBody = document.getElementById('admin-plants-table-body');
    if (!tableBody) return;

    const plants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTS) || '[]');
    tableBody.innerHTML = plants.map(plant => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${plant.image}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
            <div>
              <strong>${plant.nameTh}</strong>
              <div style="font-size: 0.75rem; font-style: italic; color: var(--text-muted);">${plant.scientificName}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge ${plant.safetyStatus === 'safe' ? 'badge-safe' : 'badge-toxic'}">
            ${plant.safetyStatus === 'safe' ? '✓ ปลอดภัย' : '⚠️ มีพิษ'}
          </span>
        </td>
        <td style="font-size: 0.85rem;">${plant.toxicityLevel}</td>
        <td>
          <button class="btn btn-sm" style="background: var(--danger-light); color: var(--danger);" onclick="Admin.deletePlant('${plant.id}')">
            ลบข้อมูล
          </button>
        </td>
      </tr>
    `).join('');
  },

  // เพิ่มต้นไม้ใหม่เข้าฐานข้อมูล
  addPlant(plantData) {
    const plants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTS) || '[]');
    const newPlant = {
      id: 'plant-' + Date.now(),
      nameTh: plantData.nameTh,
      nameEn: plantData.nameEn,
      scientificName: plantData.scientificName,
      safetyStatus: plantData.safetyStatus,
      toxicityLevel: plantData.toxicityLevel,
      safeFor: plantData.safetyStatus === 'safe' ? ['สุนัข', 'แมว'] : [],
      toxicTo: plantData.safetyStatus === 'toxic' ? ['สุนัข', 'แมว'] : [],
      description: plantData.description,
      careGuide: plantData.careGuide,
      symptoms: plantData.symptoms,
      firstAid: plantData.firstAid || '',
      tags: plantData.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: plantData.image || 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=600&q=80'
    };

    plants.push(newPlant);
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
    App.showToast('เพิ่มต้นไม้เข้าสู่คลังความรู้เรียบร้อยแล้ว!', 'success');
    this.renderStats();
    this.renderPlantsTable();
    App.renderPlantDirectory();
  },

  deletePlant(id) {
    if (!confirm('ยืนยันลบข้อมูลต้นไม้นี้ออกจากฐานข้อมูล?')) return;
    let plants = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTS) || '[]');
    plants = plants.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PLANTS, JSON.stringify(plants));
    App.showToast('ลบข้อมูลต้นไม้เรียบร้อยแล้ว', 'info');
    this.renderStats();
    this.renderPlantsTable();
    App.renderPlantDirectory();
  },

  // 3. ตารางจัดการรายชื่อสมาชิก
  renderUsersTable() {
    const tableBody = document.getElementById('admin-users-table-body');
    if (!tableBody) return;

    const users = Auth.getAllUsers();
    tableBody.innerHTML = users.map(u => `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <img src="${u.avatar}" style="width: 36px; height: 36px; border-radius: 50%;">
            <div>
              <strong>${u.name}</strong>
              <div style="font-size: 0.78rem; color: var(--text-muted);">${u.email}</div>
            </div>
          </div>
        </td>
        <td>
          <span class="badge ${u.role === 'admin' ? 'badge-admin' : 'badge-swap'}">
            ${u.role === 'admin' ? '👑 ผู้ดูแลระบบ' : 'สมาชิกทั่วไป'}
          </span>
        </td>
        <td><span class="badge" style="background: var(--bg-page);">${u.badge || '-'}</span></td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${u.joinedDate}</td>
      </tr>
    `).join('');
  }
};
