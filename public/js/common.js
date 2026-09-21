// Instagram-style rounded stroke vector icon library
window.Icons = {
  heart: (filled = false, cls = '') => filled
    ? `<svg class="insta-icon insta-icon-heart insta-heart-filled ${cls}" viewBox="0 0 24 24" fill="#ff2d55" stroke="#ff2d55" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`
    : `<svg class="insta-icon insta-icon-heart ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>`,
  eye: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3.2"></circle></svg>`,
  chat: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`,
  lock: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="3" ry="3"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  unlock: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="3" ry="3"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>`,
  pen: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>`,
  edit: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`,
  trash: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,
  flag: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>`,
  more: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="currentColor" stroke="none"><circle cx="12" cy="12" r="2.2"></circle><circle cx="19" cy="12" r="2.2"></circle><circle cx="5" cy="12" r="2.2"></circle></svg>`,
  menu: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"></line><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="17" x2="20" y2="17"></line></svg>`,
  search: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7.5"></circle><line x1="21" y1="21" x2="16.5" y2="16.5"></line></svg>`,
  chevronDown: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`,
  arrowRight: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>`,
  zap: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
  sunglasses: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 10.5h4.5c1.4 0 2.5 1.1 2.5 2.5 0 2-1.6 3.5-3.5 3.5H4c-1.1 0-2-.9-2-2v-4z"></path><path d="M15 10.5h4.5c1.4 0 2.5 1.1 2.5 2.5 0 2-1.6 3.5-3.5 3.5h-1.5c-1.9 0-3.5-1.5-3.5-3.5v-2.5z"></path><path d="M9 13h6"></path><path d="M2 11l2-4"></path><path d="M22 11l-2-4"></path></svg>`,
  info: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  shield: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  mail: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
  food: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>`,
  check: (cls = '') => `<svg class="insta-icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
};

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
  if (toggle && window.Icons) toggle.innerHTML = window.Icons.menu();
  const nav = document.querySelector('.nav-menu');
  const activeText = nav ? (nav.querySelector('.nav-link.active') || {}).textContent : '';

  const topLabel = document.getElementById('pageLabelTop');
  if (topLabel) topLabel.textContent = activeText || '';

  if (toggle && nav) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      document.getElementById('navDropdown')?.classList.remove('show');
      nav.classList.toggle('open');
    });
  }

  // Centralized outside click listener for all menus, popovers, and dropdowns
  document.addEventListener('click', (e) => {
    if (nav && nav.classList.contains('open') && !nav.contains(e.target) && (!toggle || !toggle.contains(e.target))) {
      nav.classList.remove('open');
    }

    const navDropdown = document.getElementById('navDropdown');
    const navAvatarBtn = document.getElementById('navAvatarBtn');
    if (navDropdown && navDropdown.classList.contains('show') && !navDropdown.contains(e.target) && (!navAvatarBtn || !navAvatarBtn.contains(e.target))) {
      navDropdown.classList.remove('show');
    }

    const postMenu = document.getElementById('postMenu');
    const postMenuBtn = document.getElementById('postMenuBtn');
    if (postMenu && postMenu.classList.contains('show') && !postMenu.contains(e.target) && (!postMenuBtn || !postMenuBtn.contains(e.target))) {
      postMenu.classList.remove('show');
    }

    const targetPickerMenu = document.getElementById('targetPickerMenu');
    const targetPickerBtn = document.getElementById('targetPickerBtn');
    if (targetPickerMenu && targetPickerMenu.classList.contains('show') && !targetPickerMenu.contains(e.target) && (!targetPickerBtn || !targetPickerBtn.contains(e.target))) {
      targetPickerMenu.classList.remove('show');
    }
  });

  // Centralized Escape key dismiss
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (nav) nav.classList.remove('open');
      document.getElementById('navDropdown')?.classList.remove('show');
      document.getElementById('postMenu')?.classList.remove('show');
      document.getElementById('targetPickerMenu')?.classList.remove('show');
    }
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
  let text = '';
  try {
    text = await res.text();
    data = JSON.parse(text);
  } catch (e) {
    data = null;
  }
  if (!res.ok) {
    let msg = (data && data.error);
    if (!msg) {
      let snippet = '';
      if (text) {
        const m = text.match(/<title>([^<]+)<\/title>/i) || text.match(/<h1>([^<]+)<\/h1>/i);
        if (m) snippet = m[1].trim();
        else if (text.length < 150) snippet = text.trim();
      }
      if (snippet.includes('보안 경고') || snippet.includes('보안') || snippet.includes('Access Denied') || (text && (text.includes('보안정책') || text.includes('DLP')))) {
        msg = '사내 보안 정책(DLP/프록시)에 의해 파일 전송이 차단되었습니다. (사외망 또는 모바일 환경에서 업로드해주세요)';
      } else if (res.status === 413) {
        msg = '전송 크기 초과 (413 Payload Too Large)';
      } else if (res.status === 504) {
        msg = '게이트웨이 시간 초과 (504 Gateway Timeout)';
      } else if (res.status === 502) {
        msg = '게이트웨이 오류 (502 Bad Gateway)';
      } else {
        msg = snippet ? `요청 실패: ${snippet}` : `요청에 실패했습니다 (HTTP ${res.status})`;
      }
    }
    const err = new Error(msg);
    err.status = res.status;
    err.rawResponse = text;
    throw err;
  }
  return data;
}

const NAV_ME_CACHE_KEY = 'powerhouse_nav_me';

function visibilityToggleRow(me) {
  const icon = me.profile_visible
    ? `<img class="avatar-thumb" src="${me.profile_image_url || '/img/logo.png'}" />`
    : `<span class="visibility-icon">${window.Icons ? window.Icons.sunglasses() : ''}</span>`;
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
  const logoutLink = '<div class="dropdown-divider"></div><a href="#" id="navLogoutBtn" class="danger">로그아웃</a>';
  if (me.role === 'webmaster') {
    return `${visibilityToggleRow(me)}<a href="/admin/dashboard.html">admin판넬</a>${infoLink}${logoutLink}`;
  }
  if (me.role === 'marketbot_keeper') {
    return `${visibilityToggleRow(me)}<a href="/admin/dashboard.html?tab=briefings">마켓봇 관리</a>${infoLink}${logoutLink}`;
  }
  if (me.role === 'board_keeper') {
    return `
      ${visibilityToggleRow(me)}
      <a href="/admin/dashboard.html?tab=posts">게시글관리</a>
      <a href="/admin/dashboard.html?tab=comments">댓글관리</a>
      <a href="/admin/dashboard.html?tab=suggestions">건의글 관리</a>
      ${infoLink}${logoutLink}
    `;
  }
  if (me.role === 'executive') {
    return `
      ${visibilityToggleRow(me)}
      <a href="/?tab=suggestion&target=${me.id}">내 건의 보기</a>
      ${infoLink}${logoutLink}
    `;
  }
  return `${infoLink}${logoutLink}`;
}

function renderNavProfile(el, me) {
  // Any logged-in account defaults to the PowerHouse logo until they upload
  // their own photo — no initials fallback. While in anon mode, an overlay
  // on the avatar itself reminds them their photo isn't actually showing.
  el.innerHTML = `
    <div class="nav-avatar-wrap">
      <button class="nav-avatar-btn" id="navAvatarBtn" aria-label="내 메뉴">
        <img class="nav-avatar-img" src="${me.profile_image_url || '/img/logo.png'}" />
        ${me.profile_visible ? '' : '<span class="nav-avatar-anon-overlay">익명<br>모드</span>'}
      </button>
      <div class="dropdown-menu" id="navDropdown">${navMenuItemsFor(me)}</div>
    </div>
  `;

  const btn = document.getElementById('navAvatarBtn');
  const menu = document.getElementById('navDropdown');
  btn.onclick = (e) => {
    e.stopPropagation();
    document.querySelector('.nav-menu')?.classList.remove('open');
    menu.classList.toggle('show');
  };

  bindAnonToggle(me);
  bindLogoutButton();
}

function bindLogoutButton() {
  const btn = document.getElementById('navLogoutBtn');
  if (!btn) return;
  btn.onclick = async (e) => {
    e.preventDefault();
    await api('/api/auth/logout', { method: 'POST' });
    location.href = '/login.html';
  };
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
      bindLogoutButton();
      updateAvatarAnonOverlay(nextVisible);
      // Other scripts on this page (e.g. write.js) may have their own
      // cached copy of /api/auth/me and need to know this changed.
      window.dispatchEvent(new CustomEvent('powerhouse:profile-visible-changed', { detail: { visible: nextVisible } }));
      showToast(nextVisible ? '이제 실명으로 표시됩니다.' : '이제 완전히 익명으로 표시됩니다.');
    } catch (err) {
      anonToggle.checked = !anonToggle.checked;
      showToast(err.message);
    }
  };
}

function updateAvatarAnonOverlay(visible) {
  const btn = document.getElementById('navAvatarBtn');
  if (!btn) return;
  let overlay = btn.querySelector('.nav-avatar-anon-overlay');
  if (visible) {
    if (overlay) overlay.remove();
  } else if (!overlay) {
    overlay = document.createElement('span');
    overlay.className = 'nav-avatar-anon-overlay';
    overlay.innerHTML = '익명<br>모드';
    btn.appendChild(overlay);
  }
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
  const onKeydown = (e) => {
    if (e.key === 'Escape') close();
  };
  const close = () => {
    document.removeEventListener('keydown', onKeydown);
    backdrop.remove();
  };
  document.addEventListener('keydown', onKeydown);
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
  const onKeydown = (e) => {
    if (e.key === 'Escape') close();
  };
  const close = () => {
    document.removeEventListener('keydown', onKeydown);
    backdrop.remove();
  };
  document.addEventListener('keydown', onKeydown);
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
