document.getElementById('loginBtn').onclick = doLogin;
document.getElementById('password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});

async function doLogin() {
  const password = document.getElementById('password').value;
  if (!password) return showToast('비밀번호를 입력하세요.');
  try {
    await api('/api/admin/login', { method: 'POST', body: { password } });
    location.href = '/admin/dashboard.html';
  } catch (e) {
    showToast(e.message);
  }
}
