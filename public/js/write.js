api('/api/posts/random-nickname')
  .then((data) => {
    document.getElementById('nickname').value = data.nickname;
  })
  .catch(() => {});

document.getElementById('submitBtn').onclick = async () => {
  const title = document.getElementById('title').value.trim();
  const content = document.getElementById('content').value.trim();
  const nickname = document.getElementById('nickname').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!title || !content) return showToast('제목과 내용을 입력해주세요.');
  if (!password || password.length < 4) return showToast('비밀번호는 4자 이상이어야 합니다.');

  try {
    const data = await api('/api/posts', {
      method: 'POST',
      body: { title, content, nickname, password },
    });
    location.href = `/post.html?id=${data.id}`;
  } catch (e) {
    showToast(e.message);
  }
};
