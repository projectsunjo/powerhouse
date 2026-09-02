const postId = new URLSearchParams(location.search).get('id');
let currentPost = null;
let liked = false;
let me = null;
let unlockedPassword = null; // proven by the anonymous author via /unlock, kept in memory only

if (!postId) {
  location.href = '/';
}

const LIKED_KEY = `liked_post_${postId}`;

function isTargetExec() {
  return !!(me && currentPost && currentPost.target_user_id && me.id === currentPost.target_user_id);
}

async function loadPost() {
  try {
    me = await api('/api/auth/me');
  } catch (e) {
    me = null;
  }
  try {
    currentPost = await api(`/api/posts/${postId}`);
  } catch (e) {
    document.querySelector('.container').innerHTML = `<div class="empty-state">${e.message}</div>`;
    return;
  }
  renderPost();
  loadComments();
}

function renderPost() {
  const badges = [];
  if (currentPost.is_notice) badges.push('<span class="badge notice">공지</span>');
  if (currentPost.category === 'suggestion' && currentPost.is_private) {
    badges.push('<span class="badge">🔒 비밀글</span>');
  }
  document.getElementById('postBadge').innerHTML = badges.join(' ');

  const avatarEl = document.getElementById('postAvatar');
  avatarEl.classList.remove('avatar-anon');
  if (currentPost.category === 'suggestion') {
    avatarEl.innerHTML = `<img class="avatar-thumb avatar-lg" src="/img/logo.png" />`;
  } else if (currentPost.user_id) {
    avatarEl.innerHTML = `<img class="avatar-thumb avatar-lg" src="${currentPost.author_image_url || '/img/logo.png'}" />`;
  } else {
    avatarEl.innerHTML = '';
    avatarEl.textContent = '익명';
    avatarEl.classList.add('avatar-anon');
  }

  const targetEl = document.getElementById('suggestionTarget');
  if (currentPost.category === 'suggestion') {
    targetEl.style.display = 'flex';
    document.getElementById('targetAvatar').innerHTML = `<img src="${currentPost.target_image_url || '/img/logo.png'}" />`;
    document.getElementById('targetNickname').textContent = currentPost.target_user_id ? `@${currentPost.target_name}` : '전체';
  } else {
    targetEl.style.display = 'none';
  }

  document.getElementById('postTitle').textContent = currentPost.title;
  document.getElementById('postNickname').textContent = currentPost.nickname;
  document.getElementById('postDate').textContent = formatDate(currentPost.created_at);
  document.getElementById('postViews').textContent = currentPost.views;
  document.getElementById('likeCount').textContent = currentPost.likes;
  renderPostContent();

  liked = localStorage.getItem(LIKED_KEY) === '1';
  if (liked) {
    document.getElementById('likeBtn').classList.add('liked');
    document.querySelector('#likeBtn .heart-icon').textContent = '♥';
  }
}

function renderPostContent() {
  const el = document.getElementById('postContent');
  if (currentPost.restricted) {
    el.innerHTML = `<div class="private-notice">🔒 비밀글입니다.<br><button class="btn btn-primary btn-sm" id="unlockBtn" style="margin-top:10px;">비밀번호로 열람</button></div>`;
    document.getElementById('unlockBtn').onclick = () => {
      promptPassword({
        title: '비밀글 열람',
        onConfirm: async (pw) => {
          const result = await api(`/api/posts/${postId}/unlock`, { method: 'POST', body: { password: pw } });
          unlockedPassword = pw;
          currentPost.content = result.content;
          currentPost.restricted = false;
          renderPostContent();
          loadComments();
        },
      });
    };
  } else {
    el.innerHTML = linkifyContent(currentPost.content);
  }
}

function withPostPassword(opts = {}) {
  if (!unlockedPassword) return opts;
  return { ...opts, headers: { 'Content-Type': 'application/json', 'x-post-password': unlockedPassword } };
}

async function loadComments() {
  const data = await api(`/api/posts/${postId}/comments`, withPostPassword());
  const total = data.comments.length;
  document.getElementById('commentCount').textContent = total;
  document.getElementById('commentStatCount').textContent = total;
  const listEl = document.getElementById('commentList');
  listEl.innerHTML = '';

  const commentForm = document.querySelector('.comment-form');
  if (data.restricted) {
    listEl.innerHTML = '<div class="private-notice" style="padding:24px;">🔒 비밀글의 댓글입니다.</div>';
    if (commentForm) commentForm.style.display = 'none';
    return;
  }
  if (commentForm) commentForm.style.display = '';

  if (!total) {
    listEl.innerHTML = '<div class="empty-state" style="padding:24px;">첫 댓글을 남겨보세요.</div>';
    return;
  }

  const repliesByParent = new Map();
  for (const c of data.comments) {
    if (c.parent_id) {
      if (!repliesByParent.has(c.parent_id)) repliesByParent.set(c.parent_id, []);
      repliesByParent.get(c.parent_id).push(c);
    }
  }

  for (const c of data.comments.filter((c) => !c.parent_id)) {
    const item = renderCommentItem(c, false);
    listEl.appendChild(item);
    for (const reply of repliesByParent.get(c.id) || []) {
      listEl.appendChild(renderCommentItem(reply, true));
    }
  }
}

function renderCommentItem(c, isReply) {
  const item = document.createElement('div');
  item.className = 'comment-item' + (isReply ? ' comment-reply' : '');
  item.innerHTML = `
    <div class="comment-head">
      <span>
        ${c.user_id ? `<img class="avatar-thumb" src="${c.user_image_url || '/img/logo.png'}" style="vertical-align:middle; margin-right:4px;" />` : ''}
        ${c.is_official ? '<span class="badge" style="background:var(--success); color:#fff;">공식답변</span> ' : ''}
        ${c.is_private ? '🔒 ' : ''}<span class="nick"></span> · <span class="when"></span>
      </span>
      <span class="comment-actions">
        ${!isReply ? '<button class="replyC">답글</button>' : ''}
        ${!isReply && isTargetExec() ? '<button class="officialReplyC">공식답변</button>' : ''}
        <button class="reportC report-hidden">신고</button>
        <button class="delC">삭제</button>
      </span>
    </div>
    <div class="comment-body"></div>
  `;
  item.querySelector('.nick').textContent = c.nickname;
  item.querySelector('.when').textContent = formatDate(c.created_at);
  item.querySelector('.comment-body').innerHTML =
    c.is_private && c.content === null ? '<span class="small-muted">🔒 비밀 답글입니다.</span>' : linkifyContent(c.content);

  item.querySelector('.delC').onclick = () => {
    if (c.user_id) {
      if (!confirm('이 댓글을 삭제하시겠습니까?')) return;
      api(`/api/comments/${c.id}`, { method: 'DELETE' })
        .then(() => {
          showToast('댓글이 삭제되었습니다.');
          loadComments();
        })
        .catch((e) => showToast(e.message));
      return;
    }
    promptPassword({
      title: '댓글 삭제',
      onConfirm: async (pw) => {
        await api(`/api/comments/${c.id}`, { method: 'DELETE', body: { password: pw } });
        showToast('댓글이 삭제되었습니다.');
        loadComments();
      },
    });
  };
  item.querySelector('.reportC').onclick = () => {
    promptReport({
      onConfirm: async (reason) => {
        await api(`/api/comments/${c.id}/report`, { method: 'POST', body: { reason } });
        showToast('신고가 접수되었습니다.');
      },
    });
  };
  if (!isReply) {
    item.querySelector('.replyC').onclick = () => toggleReplyForm(item, c.id, false);
    const officialBtn = item.querySelector('.officialReplyC');
    if (officialBtn) officialBtn.onclick = () => toggleReplyForm(item, c.id, true);
  }

  return item;
}

function toggleReplyForm(afterItem, parentId, official) {
  const existing = afterItem.nextElementSibling;
  if (existing && existing.classList.contains('reply-form')) {
    existing.remove();
    return;
  }

  const asExec = official && isTargetExec();
  const form = document.createElement('div');
  form.className = 'reply-form';
  form.innerHTML = `
    ${asExec ? '' : `
    <div class="form-row">
      <div class="form-group"><input type="text" class="input input-sm input-dimmed" maxlength="30" /></div>
      <div class="form-group"><input type="password" class="input input-sm" maxlength="50" placeholder="비밀번호" /></div>
    </div>`}
    <textarea class="input" maxlength="2000" style="min-height:60px" placeholder="${asExec ? '공식 답변을 입력하세요' : '답글을 입력하세요'}"></textarea>
    ${asExec ? '<label class="checkbox-row" style="display:flex; align-items:center; gap:6px; margin-top:6px;"><input type="checkbox" class="replyPrivate" /> 비밀 답변으로 남기기 (건의자와 나만 봄)</label>' : ''}
    <div class="action-row">
      <button class="btn btn-ghost btn-sm cancelReply">취소</button>
      <button class="btn btn-primary btn-sm submitReply">등록</button>
    </div>
  `;
  afterItem.after(form);

  const nicknameInput = form.querySelector('input[type="text"]');
  if (nicknameInput) setupDimmedNicknameInput(nicknameInput);
  const passwordInput = form.querySelector('input[type="password"]');
  const contentInput = form.querySelector('textarea');
  contentInput.focus();

  form.querySelector('.cancelReply').onclick = () => form.remove();
  form.querySelector('.submitReply').onclick = async () => {
    const content = contentInput.value.trim();
    if (!content) return showToast('답글 내용을 입력해주세요.');

    const body = { content, parent_id: parentId };
    if (asExec) {
      body.is_official = true;
      body.is_private = form.querySelector('.replyPrivate').checked;
    } else {
      const password = passwordInput.value.trim();
      const nickname = nicknameInput.value.trim();
      if (!password || password.length < 4) return showToast('비밀번호는 4자 이상이어야 합니다.');
      body.password = password;
      body.nickname = nickname;
    }

    try {
      await api(`/api/posts/${postId}/comments`, withPostPassword({ method: 'POST', body }));
      showToast('답글이 등록되었습니다.');
      loadComments();
    } catch (e) {
      showToast(e.message);
    }
  };
}

document.getElementById('likeBtn').onclick = async () => {
  if (liked) return showToast('이미 추천하셨습니다.');
  try {
    const data = await api(`/api/posts/${postId}/like`, { method: 'POST' });
    document.getElementById('likeCount').textContent = data.likes;
    document.getElementById('likeBtn').classList.add('liked');
    document.querySelector('#likeBtn .heart-icon').textContent = '♥';
    localStorage.setItem(LIKED_KEY, '1');
    liked = true;
  } catch (e) {
    showToast(e.message);
  }
};

const postMenuBtn = document.getElementById('postMenuBtn');
const postMenu = document.getElementById('postMenu');
postMenuBtn.onclick = (e) => {
  e.stopPropagation();
  postMenu.classList.toggle('show');
};
document.addEventListener('click', () => postMenu.classList.remove('show'));

document.getElementById('reportPostBtn').onclick = () => {
  promptReport({
    onConfirm: async (reason) => {
      await api(`/api/posts/${postId}/report`, { method: 'POST', body: { reason } });
      showToast('신고가 접수되었습니다.');
    },
  });
};

document.getElementById('deletePostBtn').onclick = () => {
  if (currentPost.user_id) {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return;
    api(`/api/posts/${postId}`, { method: 'DELETE' })
      .then(() => {
        showToast('삭제되었습니다.');
        setTimeout(() => (location.href = '/'), 600);
      })
      .catch((e) => showToast(e.message));
    return;
  }
  promptPassword({
    title: '게시글 삭제',
    onConfirm: async (pw) => {
      await api(`/api/posts/${postId}`, { method: 'DELETE', body: { password: pw } });
      showToast('삭제되었습니다.');
      setTimeout(() => (location.href = '/'), 600);
    },
  });
};

function openEditForm() {
  document.getElementById('editTitle').value = currentPost.title;
  document.getElementById('editContent').value = currentPost.content;
  document.getElementById('postView').style.display = 'none';
  document.getElementById('editForm').style.display = 'block';
}

document.getElementById('editPostBtn').onclick = () => {
  if (currentPost.user_id) {
    openEditForm();
    return;
  }
  promptPassword({
    title: '수정하려면 비밀번호를 입력하세요',
    onConfirm: async (pw) => {
      await api(`/api/posts/${postId}/verify-password`, { method: 'POST', body: { password: pw } });
      currentPost._editPassword = pw;
      openEditForm();
    },
  });
};

document.getElementById('editCancel').onclick = () => {
  document.getElementById('editForm').style.display = 'none';
  document.getElementById('postView').style.display = 'block';
};

document.getElementById('editSave').onclick = async () => {
  const title = document.getElementById('editTitle').value.trim();
  const content = document.getElementById('editContent').value.trim();
  if (!title || !content) return showToast('제목과 내용을 입력해주세요.');
  try {
    await api(`/api/posts/${postId}`, {
      method: 'PUT',
      body: { title, content, password: currentPost._editPassword },
    });
    showToast('수정되었습니다.');
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('postView').style.display = 'block';
    loadPost();
  } catch (e) {
    showToast(e.message);
  }
};

function refreshCommentNickname() {
  setupDimmedNicknameInput(document.getElementById('commentNickname'));
}

const commentQuick = document.getElementById('commentQuick');
const commentExpanded = document.getElementById('commentExpanded');
const commentContent = document.getElementById('commentContent');

function expandCommentForm() {
  if (commentExpanded.style.display !== 'none') return;
  commentContent.value = commentQuick.value;
  commentQuick.style.display = 'none';
  commentExpanded.style.display = 'block';
  commentContent.focus();
}

function collapseCommentForm() {
  commentExpanded.style.display = 'none';
  commentQuick.style.display = '';
  commentQuick.value = '';
}

commentQuick.addEventListener('focus', expandCommentForm);

document.getElementById('commentSubmit').onclick = async () => {
  const content = commentContent.value.trim();
  const nickname = document.getElementById('commentNickname').value.trim();
  const password = document.getElementById('commentPassword').value.trim();

  if (!content) return showToast('댓글 내용을 입력해주세요.');
  if (!password || password.length < 4) return showToast('비밀번호는 4자 이상이어야 합니다.');

  try {
    await api(`/api/posts/${postId}/comments`, withPostPassword({
      method: 'POST',
      body: { content, nickname, password },
    }));
    document.getElementById('commentPassword').value = '';
    refreshCommentNickname();
    collapseCommentForm();
    showToast('댓글이 등록되었습니다.');
    loadComments();
  } catch (e) {
    showToast(e.message);
  }
};

refreshCommentNickname();
loadPost();
