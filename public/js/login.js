document.getElementById('loginBtn').onclick = doLogin;
document.getElementById('password').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') doLogin();
});

async function doLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  if (!username || !password) return showToast('아이디와 비밀번호를 입력하세요.');
  try {
    const data = await api('/api/auth/login', { method: 'POST', body: { username, password } });
    if (data.role === 'executive') {
      location.href = '/';
    } else {
      location.href = '/admin/dashboard.html';
    }
  } catch (e) {
    showToast(e.message);
  }
}
