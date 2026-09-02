const URL_RE = /(https?:\/\/[^\s<]+)/g;

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function getVideoEmbedSrc(url) {
  let m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}`;
  m = url.match(/vimeo\.com\/(\d+)/);
  if (m) return `https://player.vimeo.com/video/${m[1]}`;
  return null;
}

// Pre-fills an input with a real auto-generated nickname shown dimmed, like
// a placeholder; the first focus clears it so the user can type their own.
function setupDimmedNicknameInput(input) {
  input.classList.add('input-dimmed');
  api('/api/posts/random-nickname')
    .then((data) => { input.value = data.nickname; })
    .catch(() => {});
  input.addEventListener(
    'focus',
    () => {
      if (input.classList.contains('input-dimmed')) {
        input.value = '';
        input.classList.remove('input-dimmed');
      }
    },
    { once: true }
  );
}

// Escapes the raw text, then turns URLs into links (and known video URLs
// into an inline responsive embed). Safe to set via innerHTML since escaping
// happens before any markup is introduced.
function linkifyContent(text) {
  return escapeHtml(text).replace(URL_RE, (url) => {
    const link = `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    const embedSrc = getVideoEmbedSrc(url);
    if (!embedSrc) return link;
    return `${link}<div class="video-embed"><iframe src="${embedSrc}" allowfullscreen loading="lazy"></iframe></div>`;
  });
}

(function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav-menu');
  const label = document.getElementById('currentPageLabel');
  if (label) {
    const active = nav && nav.querySelector('.nav-link.active');
    label.textContent = active ? active.textContent : '';
  }
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => nav.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(e.target) || toggle.contains(e.target)) return;
    nav.classList.remove('open');
  });
})();

initNavProfile();

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }
  if (!res.ok) {
    throw new Error((data && data.error) || '요청에 실패했습니다.');
  }
  return data;
}

const ROLE_LABELS_KO = {
  webmaster: '웹마스터',
  marketbot_keeper: '마켓봇 지킴이',
  board_keeper: '익명게시판 지킴이',
  executive: '임원/그룹장',
};

async function initNavProfile() {
  const el = document.getElementById('navProfile');
  if (!el) return;

  let me;
  try {
    me = await api('/api/auth/me');
  } catch (e) {
    el.innerHTML = '<a href="/login.html">로그인</a>';
    return;
  }

  el.innerHTML = `
    <span class="role-badge">${ROLE_LABELS_KO[me.role] || me.role}</span>
    <span></span>
    ${me.role === 'executive' ? '<label style="display:flex; align-items:center; gap:4px; cursor:pointer;"><input type="checkbox" id="profileVisibleToggle" /> 프로필 노출</label>' : ''}
    <button id="navLogoutBtn">로그아웃</button>
  `;
  el.querySelector('span:nth-child(2)').textContent = me.display_name;

  const toggle = document.getElementById('profileVisibleToggle');
  if (toggle) {
    toggle.checked = me.profile_visible;
    toggle.onchange = async () => {
      try {
        await api('/api/auth/profile-visible', { method: 'PATCH', body: { visible: toggle.checked } });
        showToast(toggle.checked ? '이제 익명게시판에 프로필이 노출됩니다.' : '이제 익명게시판에서 완전히 익명으로 표시됩니다.');
      } catch (e) {
        showToast(e.message);
      }
    };
  }

  document.getElementById('navLogoutBtn').onclick = async () => {
    await api('/api/auth/logout', { method: 'POST' });
    location.reload();
  };
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}시간 전`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay}일 전`;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function promptPassword({ title = '비밀번호 확인', onConfirm }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop show';
  backdrop.innerHTML = `
    <div class="modal">
      <h3>${title}</h3>
      <div class="form-group">
        <input type="password" class="input" id="pwModalInput" placeholder="비밀번호를 입력하세요" autofocus />
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="pwModalCancel">취소</button>
        <button class="btn btn-primary" id="pwModalOk">확인</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  const input = backdrop.querySelector('#pwModalInput');
  const close = () => backdrop.remove();
  backdrop.querySelector('#pwModalCancel').onclick = close;
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector('#pwModalOk').onclick = async () => {
    const val = input.value;
    if (!val) return;
    try {
      await onConfirm(val);
      close();
    } catch (e) {
      showToast(e.message);
    }
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') backdrop.querySelector('#pwModalOk').click();
  });
  input.focus();
}

function promptReport({ onConfirm }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop show';
  backdrop.innerHTML = `
    <div class="modal">
      <h3>신고하기</h3>
      <div class="form-group">
        <textarea class="input" id="reportReason" placeholder="신고 사유를 입력해주세요 (선택)" style="min-height:100px"></textarea>
      </div>
      <div class="modal-actions">
        <button class="btn btn-ghost" id="reportCancel">취소</button>
        <button class="btn btn-danger" id="reportOk">신고</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelector('#reportCancel').onclick = close;
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });
  backdrop.querySelector('#reportOk').onclick = async () => {
    const reason = backdrop.querySelector('#reportReason').value;
    try {
      await onConfirm(reason);
      close();
    } catch (e) {
      showToast(e.message);
    }
  };
}
