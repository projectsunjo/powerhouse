const ROLE_LABELS = {
  webmaster: '웹마스터',
  marketbot_keeper: '마켓봇 지킴이',
  board_keeper: '익명게시판 지킴이',
  executive: '임원 및 그룹장',
};

let myInfo = null;

async function loadMyInfo() {
  try {
    myInfo = await api('/api/auth/me');
  } catch (e) {
    location.href = '/login.html';
    return;
  }
  document.getElementById('myAvatar').src = myInfo.profile_image_url || '/img/logo.png';
  document.getElementById('myDisplayName').value = myInfo.display_name;
  document.getElementById('myRole').value = ROLE_LABELS[myInfo.role] || myInfo.role;
  document.getElementById('myUsername').value = myInfo.username;
  document.getElementById('photoDeleteBtn').style.display = myInfo.profile_image_url ? '' : 'none';
}

const photoInput = document.getElementById('photoInput');
document.getElementById('photoChangeBtn').onclick = () => photoInput.click();
photoInput.onchange = async () => {
  const file = photoInput.files[0];
  if (!file) return;
  try {
    const { imageBase64, mimeType } = await compressImageToBase64(file);
    await api('/api/auth/profile-image', { method: 'POST', body: { imageBase64, mimeType } });
    showToast('사진이 변경되었습니다.');
    localStorage.removeItem(NAV_ME_CACHE_KEY);
    loadMyInfo();
  } catch (e) {
    showToast(e.message);
  }
};

document.getElementById('photoDeleteBtn').onclick = async () => {
  if (!confirm('프로필 사진을 삭제하시겠습니까?')) return;
  try {
    await api('/api/auth/profile-image', { method: 'DELETE' });
    showToast('사진이 삭제되었습니다.');
    localStorage.removeItem(NAV_ME_CACHE_KEY);
    loadMyInfo();
  } catch (e) {
    showToast(e.message);
  }
};

document.getElementById('settingsSaveBtn').onclick = async () => {
  const username = document.getElementById('myUsername').value.trim();
  const displayName = document.getElementById('myDisplayName').value.trim();
  if (!username) return showToast('아이디를 입력해주세요.');
  if (!displayName) return showToast('표시 이름을 입력해주세요.');
  if (username === myInfo.username && displayName === myInfo.display_name) {
    return showToast('변경 사항이 없습니다.');
  }
  try {
    await api('/api/auth/profile', { method: 'PATCH', body: { username, displayName } });
    showToast('설정이 저장되었습니다.');
    localStorage.removeItem(NAV_ME_CACHE_KEY); // stale header cache — refetched on next nav
    loadMyInfo();
  } catch (e) {
    showToast(e.message);
  }
};

const passwordChangeBtn = document.getElementById('passwordChangeBtn');
if (passwordChangeBtn) {
  passwordChangeBtn.onclick = async () => {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const newPasswordConfirm = document.getElementById('newPasswordConfirm').value;

    if (!currentPassword) return showToast('현재 비밀번호를 입력해주세요.');
    if (!newPassword) return showToast('새 비밀번호를 입력해주세요.');
    if (newPassword.length < 4) return showToast('새 비밀번호는 4자 이상이어야 합니다.');
    if (newPassword !== newPasswordConfirm) return showToast('새 비밀번호가 일치하지 않습니다.');

    try {
      await api('/api/auth/password', {
        method: 'PATCH',
        body: { currentPassword, newPassword },
      });
      showToast('비밀번호가 성공적으로 변경되었습니다.');
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('newPasswordConfirm').value = '';
    } catch (e) {
      showToast(e.message);
    }
  };
}

loadMyInfo();
