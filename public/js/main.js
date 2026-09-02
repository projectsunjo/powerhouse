const state = { page: 1, q: '', sort: 'latest', target: '' };

const params = new URLSearchParams(location.search);
if (params.get('q')) {
  state.q = params.get('q');
  document.getElementById('searchInput').value = state.q;
}
if (params.get('page')) state.page = parseInt(params.get('page'), 10) || 1;
if (['best', 'suggestion'].includes(params.get('sort'))) {
  state.sort = params.get('sort');
  document.querySelectorAll('.board-tab').forEach((b) => b.classList.remove('active'));
  document.querySelector(`.board-tab[data-sort="${state.sort}"]`).classList.add('active');
}
if (state.sort === 'suggestion' && params.get('target') === 'me') state.target = 'me';
updateWriteLink();

function updateWriteLink() {
  const link = document.getElementById('writeLink');
  if (link) link.href = state.sort === 'suggestion' ? '/write.html?category=suggestion' : '/write.html';
}

async function loadPosts() {
  const listEl = document.getElementById('postList');
  listEl.innerHTML = '<div class="empty-state">불러오는 중...</div>';
  try {
    const qs = new URLSearchParams({ page: state.page, q: state.q, sort: state.sort });
    if (state.target) qs.set('target', state.target);
    const data = await api(`/api/posts?${qs.toString()}`);
    renderList(data);
  } catch (e) {
    listEl.innerHTML = `<div class="empty-state">${e.message}</div>`;
  }
}

function renderList(data) {
  const listEl = document.getElementById('postList');
  listEl.innerHTML = '';

  if (!data.posts.length) {
    listEl.innerHTML = '<div class="empty-state">게시글이 없습니다. 첫 글을 작성해보세요!</div>';
  }

  const isSuggestion = state.sort === 'suggestion';
  for (const post of data.posts) {
    const row = document.createElement('a');
    row.href = `/post.html?id=${post.id}`;
    row.className = 'board-row';
    row.innerHTML = `
      <div class="col-title">
        <div class="post-title-line">
          ${post.is_notice ? '<span class="badge notice">공지</span>' : ''}
          ${isSuggestion && post.has_official_reply ? '<span class="badge" style="background:var(--success); color:#fff;">답변</span>' : ''}
          ${post.is_private ? '<span class="lock-icon">🔒</span>' : ''}
          <span class="post-title"></span>
        </div>
        <div class="post-meta">
          <span style="display:flex; align-items:center; gap:5px;">
            ${isSuggestion ? `
              <img class="avatar-thumb" src="/img/logo.png" />
              <span class="post-nick"></span>
              <span class="suggestion-arrow" style="font-size:0.85rem;">→</span>
              <img class="avatar-thumb" src="${post.target_image_url || '/img/logo.png'}" />
              <span class="post-target"></span>
            ` : '<span class="post-nick"></span>'}
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
    row.querySelector('.post-title').textContent = post.title;
    row.querySelector('.post-nick').textContent = post.nickname;
    if (isSuggestion) row.querySelector('.post-target').textContent = `@${post.target_name || '알 수 없음'}`;
    row.querySelector('.post-date').textContent = formatDate(post.created_at);
    listEl.appendChild(row);
  }

  renderPagination(data.page, data.totalPages);
}

document.querySelectorAll('.board-tab').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.board-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    state.sort = btn.dataset.sort;
    state.target = '';
    state.page = 1;
    updateWriteLink();
    loadPosts();
  };
});

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
