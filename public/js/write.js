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

// Native <select> can't show an avatar image inside its options, so the
// target picker is a plain button + custom dropdown instead; the actual
// selected value still lives in the hidden #targetUserId input the rest
// of this file (and the submit handler) already reads.
let targetOptions = [{ value: '', label: '일반건의', avatar: '/img/logo.png' }];

api('/api/auth/executives')
  .then((data) => {
    targetOptions = targetOptions.concat(
      data.executives.map((e) => ({
        value: String(e.id),
        label: `@${e.display_name}`,
        avatar: e.profile_image_url || '/img/logo.png',
      }))
    );
    renderTargetMenu();
    if (initialTarget && initialTarget !== 'general') selectTarget(initialTarget);
  })
  .catch(() => {});

function renderTargetMenu() {
  const menu = document.getElementById('targetPickerMenu');
  menu.innerHTML = targetOptions
    .map((o) => `<div class="target-picker-option" data-value="${o.value}"><img class="avatar-thumb" src="${o.avatar}" />${o.label}</div>`)
    .join('');
  menu.querySelectorAll('.target-picker-option').forEach((row) => {
    row.onclick = () => {
      selectTarget(row.dataset.value);
      menu.classList.remove('show');
    };
  });
  updateTargetPreview();
}

function selectTarget(value) {
  document.getElementById('targetUserId').value = value;
  updateTargetPreview();
}

// Shows the selected 임원/그룹장's photo+name on the picker button, and
// only offers "비밀글로 작성" once a specific target is picked — a general
// suggestion (일반건의, no specific target) can't be private to anyone.
function updateTargetPreview() {
  const value = document.getElementById('targetUserId').value;
  const opt = targetOptions.find((o) => o.value === value) || targetOptions[0];
  document.getElementById('targetPickerAvatar').src = opt.avatar;
  document.getElementById('targetPickerLabel').textContent = opt.label;
  document.querySelectorAll('#targetPickerMenu .target-picker-option').forEach((row) => {
    row.classList.toggle('selected', row.dataset.value === value);
  });

  const isPrivateField = document.getElementById('isPrivateField');
  if (value) {
    isPrivateField.style.display = 'flex';
  } else {
    isPrivateField.style.display = 'none';
    document.getElementById('isPrivate').checked = false;
  }
}

document.getElementById('targetPickerBtn').onclick = (e) => {
  e.stopPropagation();
  document.getElementById('targetPickerMenu').classList.toggle('show');
};
document.addEventListener('click', () => document.getElementById('targetPickerMenu').classList.remove('show'));

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

// The header dropdown's 익명모드/실명모드 toggle lives in common.js, which
// has its own separate copy of /api/auth/me — without this, flipping it
// while already on this page left writeMe (and the nickname field) stale
// until a reload.
window.addEventListener('powerhouse:profile-visible-changed', (e) => {
  if (!writeMe) return;
  writeMe.profile_visible = e.detail.visible;
  applyIdentityMode();
});

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
