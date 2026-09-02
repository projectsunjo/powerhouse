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

const initialTarget = new URLSearchParams(location.search).get('target') || '';

api('/api/auth/executives')
  .then((data) => {
    const select = document.getElementById('targetUserId');
    select.insertAdjacentHTML(
      'beforeend',
      data.executives
        .map((e) => `<option value="${e.id}" data-avatar="${e.profile_image_url || '/img/logo.png'}">@${e.display_name}</option>`)
        .join('')
    );
    if (initialTarget && initialTarget !== 'general') select.value = initialTarget;
    updateTargetPreview();
  })
  .catch(() => {});

// Shows the selected 임원/그룹장's photo next to the picker, and only
// offers "비밀글로 작성" once a specific target is picked — a general
// suggestion (전체, no specific target) can't be private to anyone.
function updateTargetPreview() {
  const select = document.getElementById('targetUserId');
  const avatar = document.getElementById('targetAvatar');
  const isPrivateField = document.getElementById('isPrivateField');
  const opt = select.selectedOptions[0];
  if (opt && opt.value) {
    avatar.src = opt.dataset.avatar || '/img/logo.png';
    avatar.style.display = '';
    isPrivateField.style.display = 'flex';
  } else {
    avatar.style.display = 'none';
    isPrivateField.style.display = 'none';
    document.getElementById('isPrivate').checked = false;
  }
}
document.getElementById('targetUserId').onchange = updateTargetPreview;

// 건의(suggestion) posts are always anonymous regardless of login (per the
// board's design), but on the general board any logged-in account with
// their profile visible writes under their real name — shown here as a
// disabled field with their own photo, instead of the usual random
// dimmed nickname.
function applyIdentityMode() {
  const nicknameInput = document.getElementById('nickname');
  const avatarImg = document.getElementById('nicknameAvatar');
  const passwordField = document.getElementById('passwordField');
  const signedGeneral = !!(writeMe && writeMe.profile_visible && writeState.category !== 'suggestion');

  writeState.signedIn = signedGeneral;
  passwordField.style.display = signedGeneral ? 'none' : '';

  if (signedGeneral) {
    nicknameInput.disabled = true;
    nicknameInput.classList.remove('input-dimmed');
    nicknameInput.value = writeMe.display_name;
    avatarImg.src = writeMe.profile_image_url || '/img/logo.png';
    avatarImg.style.display = '';
  } else {
    // Switching in from real-name mode leaves the exec's display name
    // sitting in the field — clear it so the dimmed-placeholder logic
    // (which only fills in when the field is actually empty) kicks in.
    // Don't clear it if we're just re-running this while already in
    // anon mode, since the user may have typed their own nickname.
    if (nicknameInput.disabled) nicknameInput.value = '';
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
    if (targetUserId) {
      body.targetUserId = targetUserId;
      body.isPrivate = document.getElementById('isPrivate').checked;
    }
  }

  try {
    const data = await api('/api/posts', { method: 'POST', body });
    location.href = `/post.html?id=${data.id}`;
  } catch (e) {
    showToast(e.message);
  }
};
