const postState = { page: 1, q: '' };
const commentState = { page: 1 };
let myRole = null;

const TAB_ROLES = {
  posts: ['webmaster', 'board_keeper'],
  comments: ['webmaster', 'board_keeper'],
  reports: ['webmaster', 'board_keeper'],
  words: ['webmaster', 'board_keeper'],
  suggestions: ['webmaster', 'board_keeper'],
  briefings: ['webmaster', 'marketbot_keeper'],
  users: ['webmaster'],
};

async function guardAuth() {
  try {
    const me = await api('/api/auth/me');
    if (me.role === 'executive') {
      // Executives have no admin panel access — only the profile toggle on the board itself.
      location.href = '/';
      return;
    }
    myRole = me.role;
    applyRoleVisibility();
  } catch (e) {
    location.href = '/login.html';
  }
}

function applyRoleVisibility() {
  document.querySelectorAll('.tab-btn').forEach((btn) => {
    const allowed = TAB_ROLES[btn.dataset.tab] || [];
    btn.style.display = allowed.includes(myRole) ? '' : 'none';
  });

  // Deep-link support from the header profile menu, e.g. ?tab=suggestions.
  const requestedTab = new URLSearchParams(location.search).get('tab');
  const requestedBtn = requestedTab && document.querySelector(`.tab-btn[data-tab="${requestedTab}"]`);
  if (requestedBtn && requestedBtn.style.display !== 'none') {
    requestedBtn.click();
    return;
  }

  const activeBtn = document.querySelector('.tab-btn.active');
  if (!activeBtn || activeBtn.style.display === 'none') {
    const firstVisible = Array.from(document.querySelectorAll('.tab-btn')).find((b) => b.style.display !== 'none');
    if (firstVisible) firstVisible.click();
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

const suggestionState = { page: 1 };

async function loadSuggestions() {
  const qs = new URLSearchParams({ page: suggestionState.page });
  const data = await api(`/api/admin/suggestions?${qs.toString()}`);
  const tbody = document.getElementById('suggestionsTbody');
  tbody.innerHTML = '';

  for (const p of data.posts) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.id}</td>
      <td class="title-cell"><a class="postLink" href="/post.html?id=${p.id}" target="_blank"></a></td>
      <td></td>
      <td>
        ${p.is_private ? '<span class="tag notice">비밀글</span>' : ''}
        ${p.has_official_reply ? '<span class="tag" style="background:var(--success); color:#fff;">답변</span>' : ''}
        ${p.is_hidden ? '<span class="tag hidden">숨김</span>' : ''}
      </td>
      <td>${formatDate(p.created_at)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-ghost hideBtn">${p.is_hidden ? '숨김해제' : '숨기기'}</button>
        <button class="btn btn-sm btn-danger delBtn">삭제</button>
      </td>
    `;
    tr.querySelector('.postLink').textContent = p.title;
    tr.querySelector('.title-cell').title = p.title;
    tr.children[2].textContent = p.target_name || '전체';

    tr.querySelector('.hideBtn').onclick = async () => {
      await api(`/api/admin/suggestions/${p.id}`, { method: 'PATCH', body: { is_hidden: !p.is_hidden } });
      loadSuggestions();
    };
    tr.querySelector('.delBtn').onclick = async () => {
      if (!confirm('정말 삭제하시겠습니까?')) return;
      await api(`/api/admin/suggestions/${p.id}`, { method: 'DELETE' });
      showToast('삭제되었습니다.');
      loadSuggestions();
    };

    tbody.appendChild(tr);
  }

  renderPagination('suggestionsPagination', data.page, data.totalPages, (n) => {
    suggestionState.page = n;
    loadSuggestions();
  });
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
  await api('/api/auth/logout', { method: 'POST' });
  location.href = '/login.html';
};

let briefingPolling = false;
const briefingRunState = { page: 1 };

function formatTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

const WEEKDAYS_KO = ['일', '월', '화', '수', '목', '금', '토'];

function formatDateWithWeekday(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}(${WEEKDAYS_KO[d.getDay()]})`;
}

function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

function statusTag(status) {
  if (status === 'success') return '<span class="tag" style="background:var(--success); color:#fff;">완료</span>';
  if (status === 'failed') return '<span class="tag hidden">실패</span>';
  return '<span class="tag notice">진행중</span>';
}

function triggerTag(type) {
  return type === 'manual'
    ? '<span class="tag" style="background:var(--primary-soft); color:var(--primary);">수동</span>'
    : '<span class="tag" style="background:var(--border); color:var(--text-muted);">자동</span>';
}

async function loadBriefingRuns() {
  const qs = new URLSearchParams({ page: briefingRunState.page });
  const data = await api(`/api/admin/briefing-runs?${qs.toString()}`);
  const tbody = document.getElementById('briefingRunsTbody');
  tbody.innerHTML = '';

  for (const run of data.runs) {
    const reportId = run.briefing_id ? `ESMI-${run.briefing_id}` : '-';
    const createdLabel = run.briefing_created_at
      ? formatDateWithWeekday(run.briefing_created_at)
      : run.status === 'failed'
        ? `실패 (${run.error || '알 수 없는 오류'})`
        : run.status === 'running'
          ? '진행 중...'
          : '-';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="report-id">${reportId}</td>
      <td class="title-cell" style="max-width:220px;"></td>
      <td>${triggerTag(run.trigger_type)}</td>
      <td>${statusTag(run.status)}</td>
      <td>
        ${run.briefing_id ? '<button class="btn btn-sm btn-ghost sendBtn">보내기</button>' : '-'}
        ${run.last_email_sent_at ? `<span class="last-sent-hint">${formatDateTime(run.last_email_sent_at)} 보냄</span>` : ''}
      </td>
      <td class="actions">
        ${run.briefing_id ? '<button class="btn btn-sm btn-ghost gotoBtn">본문가기</button>' : ''}
        ${run.briefing_id ? '<button class="btn btn-sm btn-ghost editBtn">수정</button>' : ''}
        <button class="btn btn-sm btn-danger delBtn">삭제</button>
      </td>
    `;
    tr.querySelector('.title-cell').textContent = createdLabel;
    tr.querySelector('.title-cell').title = createdLabel;

    if (run.briefing_id) {
      tr.querySelector('.gotoBtn').onclick = () => window.open(`/market-info.html?id=${run.briefing_id}`, '_blank');
      tr.querySelector('.sendBtn').onclick = async () => {
        if (!confirm(`${reportId}를 지금 이메일로 발송하시겠습니까?`)) return;
        try {
          const result = await api('/api/admin/briefings/send-email', { method: 'POST', body: { briefingId: run.briefing_id } });
          showToast(result.summary);
          loadBriefingRuns();
          loadEmailLogs();
        } catch (e) {
          showToast(e.message);
        }
      };
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
  renderHeartbeat(s);
}

// Every hourly cron tick calls /api/internal/briefing/start regardless of
// whether it's actually due — so a fresh heartbeat proves the self-hosted
// runner + cron loop are alive, independent of whether a report was
// actually generated. Anything older than ~90 min (one missed tick plus
// slack for GitHub's scheduling delay) means the runner is likely offline.
function renderHeartbeat(s) {
  const el = document.getElementById('heartbeatStatus');
  const card = document.getElementById('heartbeatCard');

  if (!s.lastHeartbeatAt) {
    card.style.background = 'var(--danger-soft)';
    el.innerHTML = '⚠️ 자동 생성이 아직 한 번도 체크된 적이 없습니다. 러너(runner)가 켜져 있는지 확인하세요.';
    return;
  }

  const minutesAgo = Math.floor((Date.now() - new Date(s.lastHeartbeatAt).getTime()) / 60000);
  const stale = minutesAgo >= 90;
  card.style.background = stale ? 'var(--danger-soft)' : 'var(--success)';
  card.style.color = stale ? 'var(--danger)' : '#fff';

  const lastRunLabel = s.lastScheduledRunAt ? `${formatDateWithWeekday(s.lastScheduledRunAt)} ${formatTime(s.lastScheduledRunAt)}` : '없음';

  el.innerHTML = stale
    ? `⚠️ ${formatDate(s.lastHeartbeatAt)} 이후 러너 응답이 없습니다 (마지막 체크: ${formatTime(s.lastHeartbeatAt)}). 러너가 꺼져 있을 수 있습니다.`
    : `✅ 자동 생성 정상 동작 중 · 마지막 체크: ${formatDate(s.lastHeartbeatAt)} (${formatTime(s.lastHeartbeatAt)}) · 마지막 자동 생성: ${lastRunLabel}`;
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
    loadEmailLogs();
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

const emailLogState = { page: 1 };

function emailStatusTag(status) {
  if (status === 'success') return '<span class="tag" style="background:var(--success); color:#fff;">성공</span>';
  if (status === 'failed') return '<span class="tag hidden">실패</span>';
  return '<span class="tag notice">건너뜀</span>';
}

async function loadEmailLogs() {
  const qs = new URLSearchParams({ page: emailLogState.page });
  const data = await api(`/api/admin/email-logs?${qs.toString()}`);
  const tbody = document.getElementById('emailLogsTbody');
  tbody.innerHTML = '';

  for (const log of data.logs) {
    const when = `${formatDateWithWeekday(log.created_at)} ${formatTime(log.created_at)}`;
    const reportId = log.briefing_id ? `ESMI-${log.briefing_id}` : '-';
    const tr = document.createElement('tr');
    if (log.briefing_id) tr.className = 'row-link';
    tr.innerHTML = `
      <td>${when}</td>
      <td class="report-id">${reportId}</td>
      <td>${triggerTag(log.trigger_type)}</td>
      <td class="title-cell"></td>
      <td class="title-cell"></td>
      <td>${emailStatusTag(log.status)} <span class="small-muted detail-cell"></span></td>
    `;
    tr.children[3].textContent = log.from_email || '-';
    tr.children[4].textContent = log.recipients || '-';
    tr.children[4].title = log.recipients || '';
    if (log.status !== 'success' && log.detail) tr.querySelector('.detail-cell').textContent = `(${log.detail})`;
    if (log.briefing_id) {
      tr.onclick = () => window.open(`/market-info.html?id=${log.briefing_id}`, '_blank');
    }
    tbody.appendChild(tr);
  }

  renderPagination('emailLogsPagination', data.page, data.totalPages, (n) => {
    emailLogState.page = n;
    loadEmailLogs();
  });
}

document.getElementById('briefingSendEmailBtn').onclick = async () => {
  if (!confirm('가장 최근 브리핑을 지금 이메일로 발송하시겠습니까?')) return;
  try {
    const result = await api('/api/admin/briefings/send-email', { method: 'POST' });
    showToast(result.summary);
    loadEmailLogs();
  } catch (e) {
    showToast(e.message);
  }
};

const ROLE_LABELS = {
  webmaster: '웹마스터',
  marketbot_keeper: '마켓봇 지킴이',
  board_keeper: '익명게시판 지킴이',
  executive: '임원 및 그룹장',
};

async function uploadPhoto(url, file) {
  const { imageBase64, mimeType } = await compressImageToBase64(file);
  return api(url, { method: 'POST', body: { imageBase64, mimeType } });
}

async function loadUsers() {
  const data = await api('/api/admin/users');
  const tbody = document.getElementById('usersTbody');
  tbody.innerHTML = '';

  for (const u of data.users) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${u.id}</td>
      <td>
        <div class="avatar-thumb-wrap">
          <img class="avatar-thumb" src="${u.profile_image_url || '/img/logo.png'}" />
          <input type="file" accept="image/*" class="photoInput" style="display:none;" />
          <button class="btn btn-sm btn-ghost photoBtn">변경</button>
          ${u.profile_image_url ? '<button class="btn btn-sm btn-ghost photoDelBtn">삭제</button>' : ''}
        </div>
      </td>
      <td class="username-cell" style="cursor:pointer;" title="클릭해서 아이디 수정"></td>
      <td class="displayname-cell" style="cursor:pointer;" title="클릭해서 표시 이름 수정"></td>
      <td>
        <select class="input input-sm roleSelect">
          <option value="webmaster">웹마스터</option>
          <option value="marketbot_keeper">마켓봇 지킴이</option>
          <option value="board_keeper">익명게시판 지킴이</option>
          <option value="executive">임원 및 그룹장</option>
        </select>
      </td>
      <td>${u.role === 'executive' ? (u.profile_visible ? '노출' : '숨김') : '-'}</td>
      <td>${formatDate(u.created_at)}</td>
      <td class="actions">
        <button class="btn btn-sm btn-ghost pwBtn">비번 재설정</button>
        <button class="btn btn-sm btn-danger delBtn">삭제</button>
      </td>
    `;
    tr.querySelector('.username-cell').textContent = u.username;
    tr.querySelector('.displayname-cell').textContent = u.display_name;
    tr.querySelector('.roleSelect').value = u.role;

    tr.querySelector('.username-cell').onclick = () => {
      const val = prompt('새 아이디를 입력하세요', u.username);
      if (!val || val === u.username) return;
      api(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { username: val } })
        .then(() => { showToast('아이디가 변경되었습니다.'); loadUsers(); })
        .catch((e) => showToast(e.message));
    };
    tr.querySelector('.displayname-cell').onclick = () => {
      const val = prompt('새 표시 이름을 입력하세요', u.display_name);
      if (!val || val === u.display_name) return;
      api(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { displayName: val } })
        .then(() => { showToast('표시 이름이 변경되었습니다.'); loadUsers(); })
        .catch((e) => showToast(e.message));
    };
    tr.querySelector('.roleSelect').onchange = async (e) => {
      try {
        await api(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { role: e.target.value } });
        showToast('권한이 변경되었습니다.');
      } catch (err) {
        showToast(err.message);
        e.target.value = u.role;
      }
    };

    const photoInput = tr.querySelector('.photoInput');
    tr.querySelector('.photoBtn').onclick = () => photoInput.click();
    photoInput.onchange = async () => {
      if (!photoInput.files[0]) return;
      try {
        await uploadPhoto(`/api/admin/users/${u.id}/profile-image`, photoInput.files[0]);
        showToast('사진이 변경되었습니다.');
        loadUsers();
      } catch (e) {
        showToast(e.message);
      }
    };
    const photoDelBtn = tr.querySelector('.photoDelBtn');
    if (photoDelBtn) {
      photoDelBtn.onclick = async () => {
        try {
          await api(`/api/admin/users/${u.id}/profile-image`, { method: 'DELETE' });
          showToast('사진이 삭제되었습니다.');
          loadUsers();
        } catch (e) {
          showToast(e.message);
        }
      };
    }

    tr.querySelector('.pwBtn').onclick = async () => {
      const pw = prompt(`${u.username}의 새 비밀번호를 입력하세요 (4자 이상)`);
      if (!pw) return;
      try {
        await api(`/api/admin/users/${u.id}`, { method: 'PATCH', body: { password: pw } });
        showToast('비밀번호가 변경되었습니다.');
      } catch (e) {
        showToast(e.message);
      }
    };
    tr.querySelector('.delBtn').onclick = async () => {
      if (!confirm(`${u.username} 계정을 삭제하시겠습니까?`)) return;
      try {
        await api(`/api/admin/users/${u.id}`, { method: 'DELETE' });
        showToast('삭제되었습니다.');
        loadUsers();
      } catch (e) {
        showToast(e.message);
      }
    };

    tbody.appendChild(tr);
  }
}

document.getElementById('addUserBtn').onclick = async () => {
  const username = document.getElementById('newUserUsername').value.trim();
  const password = document.getElementById('newUserPassword').value;
  const displayName = document.getElementById('newUserDisplayName').value.trim();
  const role = document.getElementById('newUserRole').value;
  if (!username || !password || !displayName) return showToast('모든 항목을 입력해주세요.');
  try {
    await api('/api/admin/users', { method: 'POST', body: { username, password, displayName, role } });
    document.getElementById('newUserUsername').value = '';
    document.getElementById('newUserPassword').value = '';
    document.getElementById('newUserDisplayName').value = '';
    showToast('계정이 추가되었습니다.');
    loadUsers();
  } catch (e) {
    showToast(e.message);
  }
};

(async function init() {
  await guardAuth();
  if (!myRole) return;

  if (TAB_ROLES.posts.includes(myRole)) {
    loadStats();
    loadPosts();
    loadComments();
    loadReports();
    loadWords();
  }
  if (TAB_ROLES.suggestions.includes(myRole)) {
    loadSuggestions();
  }
  if (TAB_ROLES.briefings.includes(myRole)) {
    loadBriefingSettings();
    loadBriefingRuns();
    loadEmailLogs();
  }
  if (TAB_ROLES.users.includes(myRole)) {
    loadUsers();
  }
})();
