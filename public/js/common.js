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
