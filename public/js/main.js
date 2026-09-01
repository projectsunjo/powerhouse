const state = { page: 1, q: '', sort: 'latest' };

const params = new URLSearchParams(location.search);
if (params.get('q')) {
  state.q = params.get('q');
  document.getElementById('searchInput').value = state.q;
}
if (params.get('page')) state.page = parseInt(params.get('page'), 10) || 1;
if (params.get('sort') === 'best') {
  state.sort = 'best';
  document.querySelectorAll('.board-tab').forEach((b) => b.classList.remove('active'));
  document.querySelector('.board-tab[data-sort="best"]').classList.add('active');
}

async function loadPosts() {
  const listEl = document.getElementById('postList');
  listEl.innerHTML = '<div class="empty-state">불러오는 중...</div>';
  try {
    const qs = new URLSearchParams({ page: state.page, q: state.q, sort: state.sort });
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

  for (const post of data.posts) {
    const row = document.createElement('a');
    row.href = `/post.html?id=${post.id}`;
    row.className = 'board-row';
    row.innerHTML = `
      <div class="col-title">
        <div class="post-title-line">
          ${post.is_notice ? '<span class="badge notice">공지</span>' : ''}
          <span class="post-title"></span>
        </div>
        <div class="post-meta">
          <span><span class="post-nick"></span> · <span class="post-date"></span></span>
          <span class="post-stats">
            <span class="stat">👁 ${post.views}</span>
            <span class="stat">♡ ${post.likes}</span>
            <span class="stat">💬 ${post.comment_count}</span>
          </span>
        </div>
      </div>
    `;
    row.querySelector('.post-title').textContent = post.title;
    row.querySelector('.post-nick').textContent = post.nickname;
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
    state.page = 1;
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
