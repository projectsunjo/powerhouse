let isAdmin = false;
let polling = false;
const indexState = { page: 1 };

function formatUpdatedAt(iso) {
  const d = new Date(iso);
  return `최종 업데이트 · ${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function renderFeatured(briefing) {
  const el = document.getElementById('briefingFeatured');
  const doc = new DOMParser().parseFromString(briefing.html, 'text/html');
  el.innerHTML = '';
  const wrap = document.createElement('div');
  wrap.className = 'briefing-card';
  wrap.innerHTML = doc.body.innerHTML;
  el.appendChild(wrap);
  document.getElementById('updatedAt').textContent = formatUpdatedAt(briefing.created_at);
}

async function loadFeatured(id) {
  const el = document.getElementById('briefingFeatured');
  try {
    const briefing = await api(id ? `/api/market-info/briefings/${id}` : '/api/market-info/briefings/latest');
    renderFeatured(briefing);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    document.getElementById('updatedAt').textContent = '아직 생성된 브리핑이 없습니다.';
    el.innerHTML = '<div class="empty-state">아직 생성된 브리핑이 없습니다.</div>';
  }
}

async function loadIndex() {
  const listEl = document.getElementById('briefingIndexList');
  const qs = new URLSearchParams({ page: indexState.page });
  const data = await api(`/api/market-info/briefings?${qs.toString()}`);
  listEl.innerHTML = '';

  if (!data.briefings.length) {
    listEl.innerHTML = '<div class="empty-state">아직 생성된 브리핑이 없습니다.</div>';
  }

  for (const b of data.briefings) {
    const row = document.createElement('a');
    row.href = '#';
    row.className = 'board-row';
    const d = new Date(b.created_at);
    row.innerHTML = `<div class="col-title">${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} 생성</div>`;
    row.onclick = (e) => {
      e.preventDefault();
      loadFeatured(b.id);
    };
    listEl.appendChild(row);
  }

  renderIndexPagination(data.page, data.totalPages);
}

function renderIndexPagination(page, totalPages) {
  const el = document.getElementById('briefingIndexPagination');
  el.innerHTML = '';
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === page) btn.classList.add('active');
    btn.onclick = () => {
      indexState.page = i;
      loadIndex();
    };
    el.appendChild(btn);
  }
}

async function checkAdmin() {
  try {
    const me = await api('/api/auth/me');
    isAdmin = me.role === 'webmaster' || me.role === 'marketbot_keeper';
    if (isAdmin) document.getElementById('generateNowBtn').style.display = 'inline-flex';
  } catch (e) {
    isAdmin = false;
  }
}

async function pollGenerateStatus() {
  if (polling) return;
  polling = true;
  const btn = document.getElementById('generateNowBtn');
  btn.disabled = true;
  btn.textContent = '⚡ 생성 중...';

  const tick = async () => {
    try {
      const status = await api('/api/admin/briefings/status');
      if (status.generating) {
        setTimeout(tick, 5000);
        return;
      }
      polling = false;
      btn.disabled = false;
      btn.textContent = '⚡ 지금생성';
      if (status.lastError) {
        showToast(`생성 실패: ${status.lastError}`);
      } else {
        showToast('새 브리핑이 생성되었습니다.');
        loadFeatured();
        loadIndex();
      }
    } catch (e) {
      polling = false;
      btn.disabled = false;
      btn.textContent = '⚡ 지금생성';
    }
  };
  setTimeout(tick, 5000);
}

document.getElementById('generateNowBtn').onclick = async () => {
  try {
    await api('/api/admin/briefings/generate', { method: 'POST' });
    showToast('브리핑 생성을 시작했습니다. 완료되면 반영됩니다.');
    pollGenerateStatus();
  } catch (e) {
    showToast(e.message);
  }
};

const deepLinkId = new URLSearchParams(location.search).get('id');

checkAdmin();
loadFeatured(deepLinkId || undefined);
loadIndex();
