// The board is one underlying list, not separate boards per tab — tabs
// just narrow/sort that same list. 최신순 shows everything (general +
// 건의) mixed, newest first; Best filters to likes>=5; 건의 filters to
// category='suggestion' and reveals a second-level filter row to narrow
// further by target (one pill per 임원/그룹장).
const state = { page: 1, q: '', tab: 'latest', target: '' };
let executivesCache = null;

const params = new URLSearchParams(location.search);
if (params.get('q')) {
  state.q = params.get('q');
  document.getElementById('searchInput').value = state.q;
}
if (params.get('page')) state.page = parseInt(params.get('page'), 10) || 1;
if (['best', 'suggestion'].includes(params.get('tab'))) {
  state.tab = params.get('tab');
  document.querySelectorAll('.board-tabs .board-tab').forEach((b) => b.classList.remove('active'));
  document.querySelector(`.board-tab[data-tab="${state.tab}"]`).classList.add('active');
}
if (state.tab === 'suggestion' && params.get('target')) state.target = params.get('target');
updateWriteLink();
renderSubFilterRow();

function apiParamsForState() {
  if (state.tab === 'best') return { sort: 'best' };
  if (state.tab === 'suggestion') return { sort: 'suggestion', ...(state.target ? { target: state.target } : {}) };
  return {};
}

function updateWriteLink() {
  const link = document.getElementById('writeLink');
  if (!link) return;
  if (state.tab !== 'suggestion') {
    link.href = '/write.html';
    return;
  }
  const targetQs = state.target && state.target !== 'me' ? `&target=${encodeURIComponent(state.target)}` : '';
  link.href = `/write.html?category=suggestion${targetQs}`;
}

// Second-level filter row, shown only under the 건의 tab: one pill per
// 임원/그룹장, in the admin-configured "게시판순서" order. Clicking the
// active pill again clears it back to "건의 전체".
async function renderSubFilterRow() {
  const row = document.getElementById('filterRow');
  if (!row) return;
  if (state.tab !== 'suggestion') {
    row.style.display = 'none';
    return;
  }
  row.style.display = 'flex';

  if (!executivesCache) {
    try {
      executivesCache = (await api('/api/auth/executives')).executives;
    } catch (e) {
      executivesCache = [];
    }
  }

  const pills = [
    { value: '', label: '전체' },
    ...executivesCache.map((e) => ({ value: String(e.id), label: e.display_name, avatar: e.profile_image_url || '/img/logo.png' })),
  ];
  row.innerHTML = pills
    .map(
      (p) => `
      <button class="filter-pill${state.target === p.value ? ' active' : ''}" data-target="${p.value}">
        ${p.label}${p.avatar ? `<img src="${p.avatar}" />` : ''}
      </button>
    `
    )
    .join('');
  row.querySelectorAll('.filter-pill').forEach((btn) => {
    btn.onclick = () => {
      state.target = state.target === btn.dataset.target ? '' : btn.dataset.target;
      state.page = 1;
      updateWriteLink();
      renderSubFilterRow();
      loadPosts();
    };
  });
}

document.querySelectorAll('.board-tabs .board-tab').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.board-tabs .board-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.tab = btn.dataset.tab;
    state.target = '';
    state.page = 1;
    updateWriteLink();
    renderSubFilterRow();
    loadPosts();
  };
});

async function loadPosts() {
  const listEl = document.getElementById('postList');
  listEl.innerHTML = '<div class="empty-state">불러오는 중...</div>';
  try {
    const qs = new URLSearchParams({ page: state.page, q: state.q, ...apiParamsForState() });
    const data = await api(`/api/posts?${qs.toString()}`);
    renderList(data);
  } catch (e) {
    listEl.innerHTML = `<div class="empty-state">${e.message}</div>`;
  }
}

// 분류 cell: 일반 (plain) / BEST (orange chip) / 건의 (green chip) + a
// second line naming the target (or "일반" for a general/untargeted 건의).
function renderCategoryCell(post) {
  if (post.category === 'suggestion') {
    const sub = post.target_user_id
      ? `${post.target_name}<img src="${post.target_image_url || '/img/logo.png'}" />`
      : '일반';
    return `<span class="category-chip chip-suggestion">건의</span><span class="category-sub">${sub}</span>`;
  }
  if (post.likes >= 5) return '<span class="category-chip chip-best">BEST</span>';
  return '<span class="category-chip chip-general">일반</span>';
}

function renderList(data) {
  const listEl = document.getElementById('postList');
  listEl.innerHTML = '';

  if (!data.posts.length) {
    listEl.innerHTML = '<div class="empty-state">게시글이 없습니다. 첫 글을 작성해보세요!</div>';
  }

  for (const post of data.posts) {
    const isSuggestion = post.category === 'suggestion';
    const row = document.createElement('a');
    row.href = `/post.html?id=${post.id}`;
    row.className = 'board-row';
    row.innerHTML = `
      <div class="col-category"></div>
      <div class="col-title">
        <div class="post-title-line">
          ${post.is_notice ? '<span class="badge notice">공지</span>' : ''}
          ${isSuggestion && post.has_official_reply ? '<span class="category-chip chip-best">답변</span>' : ''}
          ${post.is_private ? '<span class="lock-icon">🔒</span>' : ''}
          <span class="post-title"></span>
        </div>
        <div class="post-meta">
          <span style="display:flex; align-items:center; gap:5px;">
            <span class="post-nick"></span>
            · <span class="post-date"></span>
          </span>
          <span class="post-stats">
            <span class="stat">👁 ${post.views}</span>
            <span class="stat">♡ ${post.likes}</span>
            <span class="stat">💬 ${post.comment_count}</span>
          </span>
        </div>
      </div>
    `;
    row.querySelector('.col-category').innerHTML = renderCategoryCell(post);
    row.querySelector('.post-title').textContent = post.restricted
      ? '비밀글: 글쓴이와 당사자만 열람 가능'
      : post.title;
    if (post.restricted) row.querySelector('.post-title').classList.add('private-notice-inline');
    row.querySelector('.post-nick').textContent = post.nickname;
    row.querySelector('.post-date').textContent = formatDate(post.created_at);
    listEl.appendChild(row);
  }

  renderPagination(data.page, data.totalPages);
}

function renderPagination(page, totalPages) {
  const el = document.getElementById('pagination');
  el.innerHTML = '';
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === page) btn.classList.add('active');
    btn.onclick = () => {
      state.page = i;
      loadPosts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    el.appendChild(btn);
  }
}

document.getElementById('searchBtn').onclick = () => {
  state.q = document.getElementById('searchInput').value.trim();
  state.page = 1;
  loadPosts();
};
document.getElementById('searchInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('searchBtn').click();
});

loadPosts();
