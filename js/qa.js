/**
 * GreenPaws - Q&A Community Forum with Solution Tag (qa.js)
 * จัดการกระทู้ถาม-ตอบปัญหา การเลือกคำตอบที่ถูกต้อง และการให้คำปรึกษา
 */

const QA = {
  currentFilter: 'all', // 'all', 'solved', 'unsolved'

  getThreads() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.QA_THREADS) || '[]');
  },

  saveThreads(threads) {
    localStorage.setItem(STORAGE_KEYS.QA_THREADS, JSON.stringify(threads));
    this.renderThreads();
  },

  // เรนเดอร์รายการกระทู้ถาม-ตอบ
  renderThreads() {
    const container = document.getElementById('qa-threads-container');
    if (!container) return;

    let threads = this.getThreads();

    // กรองตามสถานะ
    if (this.currentFilter === 'solved') {
      threads = threads.filter(t => t.solved);
    } else if (this.currentFilter === 'unsolved') {
      threads = threads.filter(t => !t.solved);
    }

    if (threads.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted); background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">💬</div>
          <h3>ไม่พบกระทู้ในหมวดหมู่นี้</h3>
          <p>คุณสามารถเริ่มต้นตั้งคำถามเพื่อขอความช่วยเหลือจากเพื่อนสมาชิกได้เลย</p>
          <button class="btn btn-primary" style="margin-top: 1.5rem;" onclick="QA.openAskModal()">+ ตั้งกระทู้ถามปัญหา</button>
        </div>
      `;
      return;
    }

    container.innerHTML = threads.map(thread => {
      const solution = thread.answers.find(a => a.id === thread.solutionId);
      const isSolved = thread.solved;

      return `
        <article class="qa-thread-card ${isSolved ? 'is-solved' : ''}" id="thread-${thread.id}">
          <div class="qa-header-row">
            <div class="qa-tags-wrap">
              <span class="badge ${isSolved ? 'badge-solution' : 'badge-giveaway'}">
                ${isSolved ? '✓ แก้ปัญหาได้แล้ว (Solved)' : '⏳ รอคำตอบ (Open)'}
              </span>
              <span class="badge" style="background-color: var(--primary-surface); color: var(--primary);">
                ${thread.categoryLabel}
              </span>
            </div>
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              🕒 ${thread.createdAt}
            </span>
          </div>

          <h3 class="qa-title" onclick="QA.openThreadModal('${thread.id}')">
            ${thread.title}
          </h3>

          <p class="qa-content-preview">
            ${thread.content.length > 180 ? thread.content.substring(0, 180) + '...' : thread.content}
          </p>

          ${isSolved && solution ? `
            <div class="verified-solution-highlight">
              <div class="solution-header">
                <div class="solution-badge-mark">
                  <span>✓</span> วิธีแก้ปัญหาที่ยืนยันแล้ว โดย ${solution.authorName}
                </div>
                ${solution.authorBadge ? `<span class="badge badge-admin" style="font-size: 0.72rem;">${solution.authorBadge}</span>` : ''}
              </div>
              <div class="solution-body">
                ${solution.content.replace(/\n/g, '<br>')}
              </div>
            </div>
          ` : ''}

          <div class="qa-footer-meta">
            <div class="listing-author">
              <img src="${thread.authorAvatar}" alt="${thread.authorName}">
              <span>โดย <strong>${thread.authorName}</strong></span>
            </div>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
              <span>💬 ${thread.answers.length} คำตอบ</span>
              <button class="btn btn-outline btn-sm" onclick="QA.openThreadModal('${thread.id}')">
                ดูรายละเอียด / ตอบกระทู้
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  },

  // เปลี่ยนตัวกรอง
  setFilter(filter) {
    this.currentFilter = filter;
    document.querySelectorAll('#qa-filters .filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
    this.renderThreads();
  },

  // เปิด Modal ตั้งกระทู้
  openAskModal() {
    Auth.requireAuth(() => {
      App.openModal('qa-ask-modal');
    });
  },

  // บันทึกคำถามใหม่
  createThread(data) {
    const user = Auth.getCurrentUser();
    if (!user) return;

    const threads = this.getThreads();
    const newThread = {
      id: 'qa-' + Date.now(),
      title: data.title,
      category: data.category,
      categoryLabel: data.categoryLabel,
      content: data.content,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      createdAt: new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }),
      solved: false,
      solutionId: null,
      answers: []
    };

    threads.unshift(newThread);
    this.saveThreads(threads);
    App.closeModal('qa-ask-modal');
    App.showToast('ตั้งกระทู้ถามปัญหาเรียบร้อยแล้ว!', 'success');
  },

  // เปิดดูรายละเอียดกระทู้และตอบคำถาม
  openThreadModal(threadId) {
    const thread = this.getThreads().find(t => t.id === threadId);
    if (!thread) return;

    const currentUser = Auth.getCurrentUser();
    const isThreadOwner = currentUser && (currentUser.id === thread.authorId || currentUser.role === 'admin');

    const modalContent = document.getElementById('thread-detail-modal-body');
    if (!modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 1.5rem;">
        <div style="display: flex; gap: 0.5rem; margin-bottom: 0.75rem;">
          <span class="badge ${thread.solved ? 'badge-solution' : 'badge-giveaway'}">
            ${thread.solved ? '✓ แก้ปัญหาได้แล้ว' : '⏳ รอคำตอบ'}
          </span>
          <span class="badge" style="background: var(--primary-surface); color: var(--primary);">
            ${thread.categoryLabel}
          </span>
        </div>
        <h2 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 0.5rem;">${thread.title}</h2>
        <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; font-size: 0.85rem; color: var(--text-muted);">
          <img src="${thread.authorAvatar}" style="width: 28px; height: 28px; border-radius: 50%;" alt="${thread.authorName}">
          <span>โพสต์โดย <strong>${thread.authorName}</strong> • ${thread.createdAt}</span>
        </div>
        <div style="background: var(--bg-page); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); line-height: 1.7; font-size: 0.95rem;">
          ${thread.content.replace(/\n/g, '<br>')}
        </div>
      </div>

      <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">

      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 1rem;">
        💬 คำตอบและการพูดคุย (${thread.answers.length})
      </h3>

      <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;">
        ${thread.answers.length === 0 ? `
          <p style="color: var(--text-muted); font-size: 0.9rem; text-align: center; padding: 2rem;">ยังไม่มีคำตอบ ร่วมเป็นคนแรกที่ช่วยเหลือเพื่อนสมาชิกได้เลย!</p>
        ` : thread.answers.map(ans => {
          const isMarkedSolution = ans.id === thread.solutionId;
          return `
            <div style="background: ${isMarkedSolution ? 'var(--primary-surface)' : 'var(--bg-surface)'}; border: ${isMarkedSolution ? '2px solid var(--safe)' : '1px solid var(--border-color)'}; border-radius: var(--radius-md); padding: 1.2rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                  <img src="${ans.authorAvatar}" style="width: 30px; height: 30px; border-radius: 50%;" alt="${ans.authorName}">
                  <strong>${ans.authorName}</strong>
                  ${ans.authorBadge ? `<span class="badge badge-admin" style="font-size: 0.7rem;">${ans.authorBadge}</span>` : ''}
                  <span style="font-size: 0.78rem; color: var(--text-muted); margin-left: 0.5rem;">${ans.createdAt}</span>
                </div>

                ${isMarkedSolution ? `
                  <span class="badge badge-solution">✓ วิธีแก้ปัญหาที่ยืนยันแล้ว</span>
                ` : (isThreadOwner ? `
                  <button class="btn btn-outline btn-sm" onclick="QA.markSolution('${thread.id}', '${ans.id}')" style="font-size: 0.78rem; border-color: var(--safe); color: var(--safe);">
                    ✓ เลือกเป็นคำตอบที่แก้ปัญหาได้
                  </button>
                ` : '')}
              </div>

              <div style="font-size: 0.92rem; line-height: 1.6; color: var(--text-main);">
                ${ans.content.replace(/\n/g, '<br>')}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- ฟอร์มตอบคำถาม -->
      <div style="background: var(--bg-page); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
        <h4 style="font-weight: 700; margin-bottom: 0.75rem;">เขียนคำตอบหรือข้อแนะนำของคุณ</h4>
        <textarea id="qa-answer-input" class="form-textarea" rows="3" placeholder="แชร์ความรู้หรือวิธีแก้ไขปัญหาของคุณอย่างสุภาพ..."></textarea>
        <div style="display: flex; justify-content: flex-end; margin-top: 0.75rem;">
          <button class="btn btn-primary" onclick="QA.submitAnswer('${thread.id}')">ส่งคำตอบ</button>
        </div>
      </div>
    `;

    App.openModal('thread-detail-modal');
  },

  // ส่งคำตอบใหม่
  submitAnswer(threadId) {
    Auth.requireAuth(user => {
      const input = document.getElementById('qa-answer-input');
      const text = input ? input.value.trim() : '';

      if (!text) {
        App.showToast('กรุณากรอกคำตอบก่อนส่ง', 'error');
        return;
      }

      const threads = this.getThreads();
      const thread = threads.find(t => t.id === threadId);
      if (!thread) return;

      const newAnswer = {
        id: 'ans-' + Date.now(),
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
        authorBadge: user.badge,
        isSolution: false,
        createdAt: new Date().toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' }),
        content: text
      };

      thread.answers.push(newAnswer);
      this.saveThreads(threads);
      App.showToast('ส่งคำตอบเรียบร้อยแล้ว ขอบคุณที่ร่วมแบ่งปัน!', 'success');
      this.openThreadModal(threadId); // รีเฟรชหน้าต่างคำตอบ
    });
  },

  // แท็กคำตอบเป็น Solution
  markSolution(threadId, answerId) {
    const threads = this.getThreads();
    const thread = threads.find(t => t.id === threadId);
    if (!thread) return;

    thread.solved = true;
    thread.solutionId = answerId;
    thread.answers.forEach(a => {
      a.isSolution = (a.id === answerId);
    });

    this.saveThreads(threads);
    App.showToast('เลือกคำตอบที่แก้ปัญหาได้เรียบร้อยแล้ว!', 'success');
    this.openThreadModal(threadId);
  }
};
