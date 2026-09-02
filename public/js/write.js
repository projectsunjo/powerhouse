const writeState = { category: 'general', signedIn: false };

setupDimmedNicknameInput(document.getElementById('nickname'));

const initialCategory = new URLSearchParams(location.search).get('category') === 'suggestion' ? 'suggestion' : 'general';

document.querySelectorAll('#writeCategoryTabs .board-tab').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('#writeCategoryTabs .board-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    writeState.category = btn.dataset.category;
    document.getElementById('suggestionFields').style.display = writeState.category === 'suggestion' ? 'flex' : 'none';
  };
});

if (initialCategory === 'suggestion') {
  document.querySelector('#writeCategoryTabs .board-tab[data-category="suggestion"]').click();
}

api('/api/auth/executives')
  .then((data) => {
    const select = document.getElementById('targetUserId');
    select.innerHTML = data.executives
      .map((e) => `<option value="${e.id}">@${e.display_name}</option>`)
      .join('');
  })
  .catch(() => {});

// A logged-in executive with their profile visible doesn't need an
// anonymous nickname/password — their post is tied to their own account.
api('/api/auth/me')
  .then((me) => {
    if (me.role === 'executive' && me.profile_visible) {
      writeState.signedIn = true;
      document.getElementById('anonFields').style.display = 'none';
    }
  })
  .catch(() => {});

document.getElementById('submitBtn').onclick = async () => {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const nickname = document.getElementById('nickname').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!title || !content) return showToast('제목과 내용을 입력해주세요.');
  if (!writeState.signedIn && (!password || password.length < 4)) {
    return showToast('비밀번호는 4자 이상이어야 합니다.');
  }

  const body = { title, content, nickname, password, category: writeState.category };
  if (writeState.category === 'suggestion') {
    const targetUserId = document.getElementById('targetUserId').value;
    if (!targetUserId) return showToast('건의 대상을 선택해주세요.');
    body.targetUserId = targetUserId;
    body.isPrivate = document.getElementById('isPrivate').checked;
  }

  try {
    const data = await api('/api/posts', { method: 'POST', body });
    location.href = `/post.html?id=${data.id}`;
  } catch (e) {
    showToast(e.message);
  }
};
