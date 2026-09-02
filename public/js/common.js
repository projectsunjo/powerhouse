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
// a placeholder; focus clears it so the user can type their own, and blur
// restores the dimmed placeholder if they left it empty — so the field
// never sits blank looking like it might submit nothing/anonymous-by-
// accident. Safe to call again on the same input (e.g. switching the
// write form back to anonymous mode) — listeners attach only once, only
// the placeholder value itself is refreshed.
function setupDimmedNicknameInput(input) {
  const showPlaceholder = () => {
    if (input.dataset.placeholderNickname) {
      input.value = input.dataset.placeholderNickname;
      input.classList.add('input-dimmed');
    }
  };

  api('/api/posts/random-nickname')
    .then((data) => {
      input.dataset.placeholderNickname = data.nickname;
      if (document.activeElement !== input && !input.value.trim()) showPlaceholder();
    })
    .catch(() => {});

  if (!input.dataset.dimmedBound) {
    input.dataset.dimmedBound = '1';
    input.addEventListener('focus', () => {
      if (input.classList.contains('input-dimmed')) {
        input.value = '';
        input.classList.remove('input-dimmed');
      }
    });
    input.addEventListener('blur', () => {
      if (!input.value.trim()) showPlaceholder();
    });
  }
}

// Downscales an image and re-encodes it as JPEG on a canvas, returning a
// base64 string (no "data:...;base64," prefix) + its mime type, for
// profile-photo uploads sent as JSON rather than multipart/form-data —
// this corporate network's proxy silently mangles multipart uploads.
// Compressing client-side also keeps the payload well under Vercel
// serverless functions' ~4.5MB request body cap: an original phone photo
// (often several MB) plus base64's ~33% inflation blows past that easily
// and gets rejected before our own code ever runs (a 403 with zero trace
// in server logs, since the function is never invoked).
function compressImageToBase64(file, maxDim = 640, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const img = new Image();
    reader.onload = () => { img.src = reader.result; };
    reader.onerror = () => reject(new Error('파일을 읽지 못했습니다.'));
    img.onload = () => {
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width > height) { height = Math.round((height * maxDim) / width); width = maxDim; }
        else { width = Math.round((width * maxDim) / height); height = maxDim; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve({ imageBase64: dataUrl.slice(dataUrl.indexOf(',') + 1), mimeType: 'image/jpeg' });
    };
    img.onerror = () => reject(new Error('이미지를 불러오지 못했습니다.'));
    reader.readAsDataURL(file);
  });
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

(function initNavMenu() {
  const toggle = document.getElementById('navToggle');
  const nav = document.querySelector('.nav-menu');
  const label = document.getElementById('currentPageLabel');
  if (label && nav) {
    const active = nav.querySelector('.nav-link.active');
    label.textContent = active ? active.textContent : '';
    nav.prepend(label); // shows inside the dropdown, not beside the toggle
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
    const err = new Error((data && data.error) || '요청에 실패했습니다.');
    err.status = res.status;
    throw err;
  }
  return data;
}

const NAV_ME_CACHE_KEY = 'powerhouse_nav_me';

function visibilityToggleRow(me) {
  const icon = me.profile_visible
    ? (me.profile_image_url ? `<img class="avatar-thumb" src="${me.profile_image_url}" />` : '<span class="visibility-icon">🙂</span>')
    : '<span class="visibility-icon">🕶️</span>';
  const label = me.profile_visible ? '실명모드' : '익명모드';
  return `
    <label class="dropdown-checkbox-row">
      <input type="checkbox" id="navAnonToggle" ${me.profile_visible ? '' : 'checked'} />
      ${icon}<span>${label}</span>
    </label>
  `;
}

function navMenuItemsFor(me) {
  const infoLink = '<a href="/my-info.html">내정보</a>';
  if (me.role === 'webmaster') {
    return `<a href="/admin/dashboard.html">admin판넬</a>${infoLink}`;
  }
  if (me.role === 'marketbot_keeper') {
    return `<a href="/admin/dashboard.html?tab=briefings">마켓봇 관리</a>${infoLink}`;
  }
  if (me.role === 'board_keeper') {
    return `
      <a href="/admin/dashboard.html?tab=posts">게시글관리</a>
      <a href="/admin/dashboard.html?tab=comments">댓글관리</a>
      <a href="/admin/dashboard.html?tab=suggestions">건의글 관리</a>
      ${infoLink}
    `;
  }
  if (me.role === 'executive') {
    return `
      ${visibilityToggleRow(me)}
      <a href="/?sort=suggestion&target=me">내 건의 보기</a>
      ${infoLink}
    `;
  }
  return infoLink;
}

function renderNavProfile(el, me) {
  // Any logged-in account defaults to the PowerHouse logo until they upload
  // their own photo — no initials fallback.
  el.innerHTML = `
    <div class="nav-avatar-wrap">
      <button class="nav-avatar-btn" id="navAvatarBtn" aria-label="내 메뉴">
        <img class="nav-avatar-img" src="${me.profile_image_url || '/img/logo.png'}" />
      </button>
      <div class="dropdown-menu" id="navDropdown">${navMenuItemsFor(me)}</div>
    </div>
  `;

  const btn = document.getElementById('navAvatarBtn');
  const menu = document.getElementById('navDropdown');
  btn.onclick = (e) => {
    e.stopPropagation();
    menu.classList.toggle('show');
  };
  document.addEventListener('click', () => menu.classList.remove('show'));

  bindAnonToggle(me);
}

// (Re-)attaches the visibility-toggle handler inside the dropdown. Called
// after the initial render and again after an in-place refresh of the
// dropdown's innerHTML (toggling visibility swaps the icon/label without
// tearing down the whole avatar button, so it stays open).
function bindAnonToggle(me) {
  const anonToggle = document.getElementById('navAnonToggle');
  if (!anonToggle) return;
  anonToggle.onclick = (e) => e.stopPropagation();
  anonToggle.onchange = async () => {
    const nextVisible = !anonToggle.checked;
    try {
      await api('/api/auth/profile-visible', { method: 'PATCH', body: { visible: nextVisible } });
      me.profile_visible = nextVisible;
      localStorage.setItem(NAV_ME_CACHE_KEY, JSON.stringify(me));
      document.getElementById('navDropdown').innerHTML = navMenuItemsFor(me);
      bindAnonToggle(me);
      showToast(nextVisible ? '이제 실명으로 표시됩니다.' : '이제 완전히 익명으로 표시됩니다.');
    } catch (err) {
      anonToggle.checked = !anonToggle.checked;
      showToast(err.message);
    }
  };
}

function renderNavLoggedOut(el) {
  el.innerHTML = '<a href="/login.html" class="nav-avatar-btn nav-avatar-login">로그인</a>';
}

// Neutral placeholder for while login state is still unknown (no cached
// session yet, first call to /api/auth/me still in flight). Deliberately
// NOT the "로그인" button — showing that and then swapping to the avatar
// a moment later reads as a login/logout flicker, even though it's really
// just "we didn't know yet."
function renderNavUnknown(el) {
  el.innerHTML = '<span class="nav-avatar-btn nav-avatar-loading" aria-hidden="true"></span>';
}

async function initNavProfile() {
  const el = document.getElementById('navProfile');
  if (!el) return;

  // Render instantly from the last known session so navigating between
  // pages (a full reload each time on this static site) doesn't flash
  // blank/logged-out before the fresh /api/auth/me call resolves.
  let cached = null;
  try {
    cached = JSON.parse(localStorage.getItem(NAV_ME_CACHE_KEY) || 'null');
  } catch (e) {
    cached = null;
  }
  if (cached) renderNavProfile(el, cached);
  else renderNavUnknown(el);

  let me;
  try {
    me = await api('/api/auth/me');
  } catch (e) {
    // Only a genuine 401 (session actually invalid/expired) means "log
    // out" — any other failure (slow query, transient network error,
    // 500) is inconclusive, so keep showing the cached avatar instead of
    // flashing to "로그인" and back on every single page load.
    if (e.status === 401) {
      localStorage.removeItem(NAV_ME_CACHE_KEY);
      renderNavLoggedOut(el);
    }
    return;
  }
  localStorage.setItem(NAV_ME_CACHE_KEY, JSON.stringify(me));
  renderNavProfile(el, me);
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
