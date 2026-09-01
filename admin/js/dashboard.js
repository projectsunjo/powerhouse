const postState = { page: 1, q: '' };
const commentState = { page: 1 };

async function guardAuth() {
  try {
    await api('/api/admin/me');
  } catch (e) {
    location.href = '/admin/login.html';
  }
}

async function loadStats() {
  const data = await api('/api/admin/stats');
  document.getElementById('statPosts').textContent = data.totalPosts;
  document.getElementById('statComments').textContent = data.totalComments;
  document.getElementById('statToday').textContent = data.todayPosts;
  document.getElementById('statReports').textContent = data.pendingReports;
}

async function loadPosts() {
  const qs = new URLSearchParams({ page: postState.page, q: postState.q });
  const data = await api(`/api/admin/posts?${qs.toString()}`);
  const tbody = document.getElementById('postsTbody');
  tbody.innerHTML = '';
  for (const p of data.posts) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td class="title-cell"><a class="postLink" href="/post.html?id=${p.id}" target="_blank"></a></td>
      <td></td>
      <td>${p.views}</td>
      <td>${p.likes}</td>
      <td>
        ${p.is_notice ? '<span class="tag notice">공지</span>' : ''}
        ${p.is_hidden ? '<span class="tag hidden">숨김</span>' : ''}
      </td>
      <td>${formatDate(p.created_at)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-ghost noticeBtn">${p.is_notice ? '공지해제' : '공지설정'}</button>
        <button class="btn btn-sm btn-ghost hideBtn">${p.is_hidden ? '숨김해제' : '숨기기'}</button>
        <button class="btn btn-sm btn-danger delBtn">삭제</button>
      </td>
    `;
    tr.querySelector('.postLink').textContent = p.title;
    tr.querySelector('.title-cell').title = p.title;
    tr.children[2].textContent = p.nickname;

    tr.querySelector('.noticeBtn').onclick = async () => {
      await api(`/api/admin/posts/${p.id}`, { method: 'PATCH', body: { is_notice: !p.is_notice } });
      loadPosts();
    };
    tr.querySelector('.hideBtn').onclick = async () => {
      await api(`/api/admin/posts/${p.id}`, { method: 'PATCH', body: { is_hidden: !p.is_hidden } });
      loadPosts();
    };
    tr.querySelector('.delBtn').onclick = async () => {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      await api(`/api/admin/posts/${p.id}`, { method: 'DELETE' });
      showToast('삭제되었습니다.');
      loadPosts();
      loadStats();
    };

    tbody.appendChild(tr);
  }
  renderPagination('postsPagination', data.page, data.totalPages, (n) => {
    postState.page = n;
    loadPosts();
  });
}

async function loadComments() {
  const qs = new URLSearchParams({ page: commentState.page });
  const data = await api(`/api/admin/comments?${qs.toString()}`);
  const tbody = document.getElementById('commentsTbody');
  tbody.innerHTML = '';
  for (const c of data.comments) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${c.id}</td>
      <td><a href="/post.html?id=${c.post_id}" target="_blank">#${c.post_id}</a></td>
      <td class="title-cell"></td>
      <td></td>
      <td>${formatDate(c.created_at)}</td>
      <td class="actions"><button class="btn btn-sm btn-danger delBtn">삭제</button></td>
    `;
    tr.children[2].textContent = c.content;
    tr.children[2].title = c.content;
    tr.children[3].textContent = c.nickname;
    tr.querySelector('.delBtn').onclick = async () => {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      await api(`/api/admin/comments/${c.id}`, { method: 'DELETE' });
      showToast('삭제되었습니다.');
      loadComments();
      loadStats();
    };
    tbody.appendChild(tr);
  }
  renderPagination('commentsPagination', data.page, data.totalPages, (n) => {
    commentState.page = n;
    loadComments();
  });
}

async function loadReports() {
  const status = document.getElementById('reportStatus').value;
  const data = await api(`/api/admin/reports?status=${status}`);
  const tbody = document.getElementById('reportsTbody');
  tbody.innerHTML = '';
  for (const r of data.reports) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.id}</td>
      <td>${r.target_type === 'post' ? '게시글' : '댓글'}</td>
      <td><a href="${r.target_type === 'post' ? '/post.html?id=' + r.target_id : '#'}" target="_blank">#${r.target_id}</a></td>
      <td class="title-cell"></td>
      <td>${formatDate(r.created_at)}</td>
      <td class="actions"></td>
    `;
    tr.children[3].textContent = r.reason;
    tr.children[3].title = r.reason;
    const actionsTd = tr.querySelector('.actions');
    if (status === 'pending') {
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-primary';
      btn.textContent = '처리완료';
      btn.onclick = async () => {
        await api(`/api/admin/reports/${r.id}`, { method: 'PATCH', body: { status: 'resolved' } });
        loadReports();
        loadStats();
      };
      actionsTd.appendChild(btn);
    }
    tbody.appendChild(tr);
  }
}

async function loadWords() {
  const data = await api('/api/admin/banned-words');
  const el = document.getElementById('wordList');
  el.innerHTML = '';
  for (const w of data.words) {
    const chip = document.createElement('div');
    chip.className = 'banned-word-chip';
    chip.innerHTML = `<span></span><button>×</button>`;
    chip.querySelector('span').textContent = w.word;
    chip.querySelector('button').onclick = async () => {
      await api(`/api/admin/banned-words/${w.id}`, { method: 'DELETE' });
      loadWords();
    };
    el.appendChild(chip);
  }
}

function renderPagination(elId, page, totalPages, onClick) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === page) btn.classList.add('active');
    btn.onclick = () => onClick(i);
    el.appendChild(btn);
  }
}

document.querySelectorAll('.tab-btn').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
  };
});

document.getElementById('postSearchBtn').onclick = () => {
  postState.q = document.getElementById('postSearch').value.trim();
  postState.page = 1;
  loadPosts();
};
document.getElementById('reportStatus').onchange = loadReports;
document.getElementById('addWordBtn').onclick = async () => {
  const word = document.getElementById('newWord').value.trim();
  if (!word) return;
  try {
    await api('/api/admin/banned-words', { method: 'POST', body: { word } });
    document.getElementById('newWord').value = '';
    loadWords();
  } catch (e) {
    showToast(e.message);
  }
};
document.getElementById('logoutBtn').onclick = async () => {
  await api('/api/admin/logout', { method: 'POST' });
  location.href = '/admin/login.html';
};

let briefingPolling = false;
const briefingRunState = { page: 1 };

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function statusTag(status) {
  if (status === 'success') return '<span class="tag" style="background:var(--success); color:#fff;">완료</span>';
  if (status === 'failed') return '<span class="tag hidden">실패</span>';
  return '<span class="tag notice">진행중</span>';
}

async function loadBriefingRuns() {
  const qs = new URLSearchParams({ page: briefingRunState.page });
  const data = await api(`/api/admin/briefing-runs?${qs.toString()}`);
  const tbody = document.getElementById('briefingRunsTbody');
  tbody.innerHTML = '';

  for (const run of data.runs) {
    const logLine =
      run.status === 'failed'
        ? `${formatTime(run.started_at)} 시작 · 실패 (${run.error || '알 수 없는 오류'})`
        : run.status === 'running'
          ? `${formatTime(run.started_at)} 시작 · 진행 중...`
          : `${formatTime(run.started_at)} 시작 · ${formatTime(run.completed_at)} 생성완료${run.email_status ? ' · ' + run.email_status : ''}`;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="title-cell" style="max-width:520px;"></td>
      <td>${statusTag(run.status)}</td>
      <td class="actions">
        ${run.briefing_id ? '<button class="btn btn-sm btn-ghost editBtn">수정</button>' : ''}
        <button class="btn btn-sm btn-danger delBtn">삭제</button>
      </td>
    `;
    tr.querySelector('.title-cell').textContent = logLine;
    tr.querySelector('.title-cell').title = logLine;

    if (run.briefing_id) {
      tr.querySelector('.editBtn').onclick = async () => {
        const briefing = await api(`/api/admin/briefings`);
        const target = briefing.briefings.find((b) => b.id === run.briefing_id);
        if (!target) return showToast('브리핑 내용을 찾을 수 없습니다.');
        document.getElementById('briefingEditWrap').style.display = 'block';
        document.getElementById('briefingEditArea').value = target.html;
        document.getElementById('briefingEditSave').onclick = async () => {
          const html = document.getElementById('briefingEditArea').value;
          try {
            await api(`/api/admin/briefings/${target.id}`, { method: 'PATCH', body: { html } });
            showToast('저장되었습니다.');
            document.getElementById('briefingEditWrap').style.display = 'none';
          } catch (e) {
            showToast(e.message);
          }
        };
      };
    }
    tr.querySelector('.delBtn').onclick = async () => {
      if (!confirm('이 로그와 연결된 브리핑을 삭제하시겠습니까?')) return;
      if (run.briefing_id) await api(`/api/admin/briefings/${run.briefing_id}`, { method: 'DELETE' });
      await api(`/api/admin/briefing-runs/${run.id}`, { method: 'DELETE' }).catch(() => {});
      showToast('삭제되었습니다.');
      loadBriefingRuns();
    };

    tbody.appendChild(tr);
  }

  renderPagination('briefingRunsPagination', data.page, data.totalPages, (n) => {
    briefingRunState.page = n;
    loadBriefingRuns();
  });
}

document.getElementById('briefingEditCancel').onclick = () => {
  document.getElementById('briefingEditWrap').style.display = 'none';
};

async function loadBriefingSettings() {
  const hourSelect = document.getElementById('scheduleHour');
  hourSelect.innerHTML = '';
  for (let h = 0; h < 24; h++) {
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = `${String(h).padStart(2, '0')}시`;
    hourSelect.appendChild(opt);
  }

  const s = await api('/api/admin/briefing-settings');
  document.getElementById('scheduleEnabled').checked = s.scheduleEnabled;
  hourSelect.value = s.scheduleHour;
  document.getElementById('intervalHours').value = s.intervalHours;
  document.getElementById('emailRecipients').value = s.emailRecipients;
  document.getElementById('emailSubjectTemplate').value = s.emailSubjectTemplate;
}

document.getElementById('settingsSaveBtn').onclick = async () => {
  try {
    await api('/api/admin/briefing-settings', {
      method: 'PATCH',
      body: {
        scheduleEnabled: document.getElementById('scheduleEnabled').checked,
        scheduleHour: document.getElementById('scheduleHour').value,
        intervalHours: document.getElementById('intervalHours').value,
        emailRecipients: document.getElementById('emailRecipients').value,
        emailSubjectTemplate: document.getElementById('emailSubjectTemplate').value,
      },
    });
    showToast('설정이 저장되었습니다.');
  } catch (e) {
    showToast(e.message);
  }
};

function pollBriefingStatus() {
  if (briefingPolling) return;
  briefingPolling = true;
  const btn = document.getElementById('briefingGenerateBtn');
  const statusEl = document.getElementById('briefingStatus');
  btn.disabled = true;
  statusEl.textContent = '생성 중... (수 분 정도 걸릴 수 있습니다)';

  const tick = async () => {
    const status = await api('/api/admin/briefings/status');
    if (status.generating) {
      setTimeout(tick, 5000);
      return;
    }
    briefingPolling = false;
    btn.disabled = false;
    statusEl.textContent = '';
    loadBriefingRuns();
  };
  setTimeout(tick, 5000);
}

document.getElementById('briefingGenerateBtn').onclick = async () => {
  try {
    await api('/api/admin/briefings/generate', { method: 'POST' });
    loadBriefingRuns();
    pollBriefingStatus();
  } catch (e) {
    showToast(e.message);
  }
};

(async function init() {
  await guardAuth();
  loadStats();
  loadPosts();
  loadComments();
  loadReports();
  loadWords();
  loadBriefingSettings();
  loadBriefingRuns();
})();
