const writeState = { category: 'general', signedIn: false };
let writeMe = null;

const initialCategory = new URLSearchParams(location.search).get('category') === 'suggestion' ? 'suggestion' : 'general';

document.querySelectorAll('#writeCategoryTabs .board-tab').forEach((btn) => {
  btn.onclick = () => {
    document.querySelectorAll('#writeCategoryTabs .board-tab').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    writeState.category = btn.dataset.category;
    document.getElementById('suggestionFields').style.display = writeState.category === 'suggestion' ? 'flex' : 'none';
    applyIdentityMode();
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

// 건의(suggestion) posts are always anonymous regardless of login (per the
// board's design), but on the general board a logged-in executive with
// their profile visible writes under their real name — shown here as a
// disabled field with their own photo, instead of the usual random
// dimmed nickname.
function applyIdentityMode() {
  const nicknameInput = document.getElementById('nickname');
  const avatarImg = document.getElementById('nicknameAvatar');
  const passwordField = document.getElementById('passwordField');
  const signedGeneral = !!(writeMe && writeMe.role === 'executive' && writeMe.profile_visible && writeState.category !== 'suggestion');

  writeState.signedIn = signedGeneral;
  passwordField.style.display = signedGeneral ? 'none' : '';

  if (signedGeneral) {
    nicknameInput.disabled = true;
    nicknameInput.classList.remove('input-dimmed');
    nicknameInput.value = writeMe.display_name;
    avatarImg.src = writeMe.profile_image_url || '/img/logo.png';
    avatarImg.style.display = '';
  } else {
    nicknameInput.disabled = false;
    avatarImg.style.display = 'none';
    setupDimmedNicknameInput(nicknameInput);
  }
}

api('/api/auth/me')
  .then((me) => { writeMe = me; })
  .catch(() => { writeMe = null; })
  .then(applyIdentityMode);

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
