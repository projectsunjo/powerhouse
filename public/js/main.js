// The board is one underlying list, not separate boards per tab. `filter`
// just narrows/sorts that same list:
//   ''                  최신순 — everything, newest first (no filter)
//   'best'               likes >= 5
//   'general'            일반 글 only
//   'suggestion:general' 건의 중 특정 대상 없는 일반건의
//   'suggestion:me'      나에게 온 건의 (헤더 "내 건의 보기"에서 진입)
//   'suggestion:<id>'    특정 임원/그룹장에게 온 건의
const state = { page: 1, q: '', filter: '' };
let executivesCache = null;

const params = new URLSearchParams(location.search);
if (params.get('q')) {
  state.q = params.get('q');
  document.getElementById('searchInput').value = state.q;
}
if (params.get('page')) state.page = parseInt(params.get('page'), 10) || 1;
if (params.get('filter')) state.filter = params.get('filter');
updateWriteLink();
renderFilterRow();

function apiParamsForFilter(filter) {
  if (filter === 'best') return { sort: 'best' };
  if (filter === 'general') return { sort: 'general' };
  if (filter.startsWith('suggestion:')) return { sort: 'suggestion', target: filter.slice('suggestion:'.length) };
  return {};
}

function updateWriteLink() {
  const link = document.getElementById('writeLink');
  if (!link) return;
  if (state.filter.startsWith('suggestion:')) {
    const target = state.filter.slice('suggestion:'.length);
    const targetQs = target && target !== 'me' ? `&target=${encodeURIComponent(target)}` : '';
    link.href = `/write.html?category=suggestion${targetQs}`;
  } else {
    link.href = '/write.html';
  }
}

// 최신순(전체) / Best / 일반 글 / 일반건의 / 임원·그룹장 개인별 — the same
// vocabulary doubles as the row's "분류" label in renderList, so picking a
// pill and reading the column are two views of the same classification.
async function renderFilterRow() {
  const row = document.getElementById('filterRow');
  if (!row) return;

  if (!executivesCache) {
    try {
      executivesCache = (await api('/api/auth/executives')).executives;
    } catch (e) {
      executivesCache = [];
    }
  }

  const pills = [
    { value: '', label: '최신순' },
    { value: 'best', label: 'Best' },
    { value: 'general', label: '일반 글' },
    { value: 'suggestion:general', label: '일반건의' },
    ...executivesCache.map((e) => ({ value: `suggestion:${e.id}`, label: `@${e.display_name}`, avatar: e.profile_image_url })),
  ];
  row.innerHTML = pills
    .map(
      (p) => `
      <button class="filter-pill${state.filter === p.value ? ' active' : ''}" data-filter="${p.value}">
        ${p.avatar ? `<img src="${p.avatar}" />` : ''}${p.label}
      </button>
    `
    )
    .join('');
  row.querySelectorAll('.filter-pill').forEach((btn) => {
    btn.onclick = () => {
      state.filter = btn.dataset.filter;
      state.page = 1;
      updateWriteLink();
      renderFilterRow();
      loadPosts();
    };
  });
}

async function loadPosts() {
  const listEl = document.getElementById('postList');
  listEl.innerHTML = '<div class="empty-state">불러오는 중...</div>';
  try {
    const qs = new URLSearchParams({ page: state.page, q: state.q, ...apiParamsForFilter(state.filter) });
    const data = await api(`/api/posts?${qs.toString()}`);
    renderList(data);
  } catch (e) {
    listEl.innerHTML = `<div class="empty-state">${e.message}</div>`;
  }
}

function classifyLabel(post) {
  if (post.category === 'suggestion') return post.target_user_id ? `@${post.target_name}` : '일반건의';
  return post.likes >= 5 ? 'Best' : '일반 글';
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
          ${isSuggestion && post.has_official_reply ? '<span class="badge" style="background:var(--success); color:#fff;">답변</span>' : ''}
          ${post.is_private ? '<span class="lock-icon">🔒</span>' : ''}
          <span class="post-title"></span>
        </div>
        <div class="post-meta">
          <span style="display:flex; align-items:center; gap:5px;">
            <span class="post-nick"></span>
            · <span class="post-date"></span>
          </span>
          <span class="post-stats">
            ${isSuggestion ? `<span class="stat">💬 ${post.comment_count}</span>` : `
            <span class="stat">👁 ${post.views}</span>
            <span class="stat">♡ ${post.likes}</span>
            <span class="stat">💬 ${post.comment_count}</span>`}
          </span>
        </div>
      </div>
    `;
    row.querySelector('.col-category').textContent = classifyLabel(post);
    row.querySelector('.post-title').textContent = post.title;
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
