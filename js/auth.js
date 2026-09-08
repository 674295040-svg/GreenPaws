/**
 * GreenPaws - Authentication & User Management (auth.js)
 * จัดการระบบสมัครสมาชิก, เข้าสู่ระบบ (Member & Admin), Session, และสิทธิ์การใช้งาน
 */

const Auth = {
  // รับข้อมูลผู้ใช้ที่กำลังเข้าสู่ระบบอยู่
  getCurrentUser() {
    const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return userJson ? JSON.parse(userJson) : null;
  },

  // ดึงรายชื่อผู้ใช้ทั้งหมด
  getAllUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  // ตรวจสอบว่าเป็น Admin หรือไม่
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  },

  // ตรวจสอบว่าล็อกอินหรือยัง
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  },

  // สมัครสมาชิกใหม่
  register(userData) {
    const users = this.getAllUsers();
    
    // ตรวจสอบอีเมลซ้ำ
    if (users.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error('อีเมลนี้ถูกใช้งานในระบบแล้ว');
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'member',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      bio: userData.bio || 'คนรักต้นไม้และสัตว์เลี้ยง',
      badge: userData.petOrPlantType ? `🌿 ${userData.petOrPlantType}` : '🌿 สมาชิกใหม่',
      favorites: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    // เข้าสู่ระบบให้อัตโนมัติ
    this.setCurrentUser(newUser);
    return newUser;
  },

  // เข้าสู่ระบบ (รองรับทั้ง Member และ Admin)
  login(email, password) {
    const users = this.getAllUsers();
    const user = users.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && 
      u.password === password
    );

    if (!user) {
      throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }

    this.setCurrentUser(user);
    return user;
  },

  // Demo Login สะดวกรวดเร็ว
  demoLogin(role = 'member') {
    const users = this.getAllUsers();
    let targetUser;

    if (role === 'admin') {
      targetUser = users.find(u => u.role === 'admin') || users[0];
    } else {
      targetUser = users.find(u => u.role === 'member') || users[1];
    }

    if (targetUser) {
      this.setCurrentUser(targetUser);
      return targetUser;
    }
    throw new Error('ไม่พบบัญชีผู้ใช้ตัวอย่าง');
  },

  // บันทึก Session ผู้ใช้
  setCurrentUser(user) {
    // ซ่อนรหัสผ่านก่อนบันทึกลง session
    const safeUser = { ...user };
    delete safeUser.password;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
    this.updateHeaderUI();
    window.dispatchEvent(new CustomEvent('auth:change', { detail: safeUser }));
  },

  // ออกจากระบบ
  logout() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.updateHeaderUI();
    window.dispatchEvent(new CustomEvent('auth:change', { detail: null }));
  },

  // อัปเดตส่วนหัวของเว็บตามสถานะล็อกอิน
  updateHeaderUI() {
    const user = this.getCurrentUser();
    const guestArea = document.getElementById('header-guest-actions');
    const userArea = document.getElementById('header-user-actions');
    const adminNavBtn = document.getElementById('nav-admin-tab-btn');

    if (!guestArea || !userArea) return;

    if (user) {
      guestArea.style.display = 'none';
      userArea.style.display = 'flex';

      document.getElementById('user-display-name').textContent = user.name;
      document.getElementById('user-display-avatar').src = user.avatar;
      
      const badgeElem = document.getElementById('user-display-badge');
      if (badgeElem) {
        badgeElem.textContent = user.badge;
        if (user.role === 'admin') {
          badgeElem.className = 'badge badge-admin';
        } else {
          badgeElem.className = 'badge badge-swap';
        }
      }

      // แสดงหรือซ่อนแท็บแอดมิน
      if (adminNavBtn) {
        if (user.role === 'admin') {
          adminNavBtn.style.display = 'inline-flex';
        } else {
          adminNavBtn.style.display = 'none';
        }
      }
    } else {
      guestArea.style.display = 'flex';
      userArea.style.display = 'none';
      if (adminNavBtn) {
        adminNavBtn.style.display = 'none';
      }
    }
  },

  // ตรวจสอบสิทธิ์ก่อนทำ action หากยังไม่ล็อกอินจะเปิด modal
  requireAuth(callback, requiredRole = 'member') {
    const user = this.getCurrentUser();
    if (!user) {
      App.showToast('กรุณาเข้าสู่ระบบก่อนดำเนินการ', 'info');
      App.openModal('auth-modal');
      return false;
    }

    if (requiredRole === 'admin' && user.role !== 'admin') {
      App.showToast('หน้านี้สงวนสิทธิ์เฉพาะผู้ดูแลระบบเท่านั้น', 'error');
      return false;
    }

    if (typeof callback === 'function') {
      callback(user);
    }
    return true;
  }
};

// Toggle User Dropdown
document.addEventListener('DOMContentLoaded', () => {
  Auth.updateHeaderUI();

  const userPillBtn = document.getElementById('user-pill-btn');
  const userDropdown = document.getElementById('user-dropdown-menu');

  if (userPillBtn && userDropdown) {
    userPillBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      userDropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      userDropdown.classList.remove('show');
    });
  }

  // Logout Button
  const logoutBtn = document.getElementById('dropdown-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      Auth.logout();
      App.showToast('ออกจากระบบเรียบร้อยแล้ว', 'info');
      // หากอยู่ในหน้าแอดมิน ให้เปลี่ยนกลับไปหน้าตลาด
      if (App.activeTab === 'admin') {
        App.switchTab('market');
      }
    });
  }
});
