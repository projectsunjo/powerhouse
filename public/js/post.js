const postId = new URLSearchParams(location.search).get('id');
let currentPost = null;
let liked = false;

if (!postId) {
  location.href = '/';
}

const LIKED_KEY = `liked_post_${postId}`;

async function loadPost() {
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
  document.getElementById('postBadge').innerHTML = currentPost.is_notice ? '<span class="badge notice">공지</span>' : '';
  document.getElementById('postTitle').textContent = currentPost.title;
  document.getElementById('postNickname').textContent = currentPost.nickname;
  document.getElementById('postDate').textContent = formatDate(currentPost.created_at);
  document.getElementById('postViews').textContent = currentPost.views;
  document.getElementById('postContent').innerHTML = linkifyContent(currentPost.content);
  document.getElementById('likeCount').textContent = currentPost.likes;

  liked = localStorage.getItem(LIKED_KEY) === '1';
  if (liked) {
    document.getElementById('likeBtn').classList.add('liked');
    document.querySelector('#likeBtn .heart-icon').textContent = '♥';
  }
}

async function loadComments() {
  const data = await api(`/api/posts/${postId}/comments`);
  const total = data.comments.length;
  document.getElementById('commentCount').textContent = total;
  document.getElementById('commentStatCount').textContent = total;
  const listEl = document.getElementById('commentList');
  listEl.innerHTML = '';

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
      <span><span class="nick"></span> · <span class="when"></span></span>
      <span class="comment-actions">
        ${!isReply ? '<button class="replyC">답글</button>' : ''}
        <button class="reportC report-hidden">신고</button>
        <button class="delC">삭제</button>
      </span>
    </div>
    <div class="comment-body"></div>
  `;
  item.querySelector('.nick').textContent = c.nickname;
  item.querySelector('.when').textContent = formatDate(c.created_at);
  item.querySelector('.comment-body').innerHTML = linkifyContent(c.content);

  item.querySelector('.delC').onclick = () => {
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
    item.querySelector('.replyC').onclick = () => toggleReplyForm(item, c.id);
  }

  return item;
}

function toggleReplyForm(afterItem, parentId) {
  const existing = afterItem.nextElementSibling;
  if (existing && existing.classList.contains('reply-form')) {
    existing.remove();
    return;
  }

  const form = document.createElement('div');
  form.className = 'reply-form';
  form.innerHTML = `
    <div class="form-row">
      <div class="form-group"><input type="text" class="input input-sm input-dimmed" maxlength="30" /></div>
      <div class="form-group"><input type="password" class="input input-sm" maxlength="50" placeholder="비밀번호" /></div>
    </div>
    <textarea class="input" maxlength="2000" style="min-height:60px" placeholder="답글을 입력하세요"></textarea>
    <div class="action-row">
      <button class="btn btn-ghost btn-sm cancelReply">취소</button>
      <button class="btn btn-primary btn-sm submitReply">등록</button>
    </div>
  `;
  afterItem.after(form);

  const nicknameInput = form.querySelector('input[type="text"]');
  setupDimmedNicknameInput(nicknameInput);
  const passwordInput = form.querySelector('input[type="password"]');
  const contentInput = form.querySelector('textarea');
  contentInput.focus();

  form.querySelector('.cancelReply').onclick = () => form.remove();
  form.querySelector('.submitReply').onclick = async () => {
    const content = contentInput.value.trim();
    const password = passwordInput.value.trim();
    const nickname = nicknameInput.value.trim();
    if (!content) return showToast('답글 내용을 입력해주세요.');
    if (!password || password.length < 4) return showToast('비밀번호는 4자 이상이어야 합니다.');
    try {
      await api(`/api/posts/${postId}/comments`, {
        method: 'POST',
        body: { content, nickname, password, parent_id: parentId },
      });
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
  promptPassword({
    title: '게시글 삭제',
    onConfirm: async (pw) => {
      await api(`/api/posts/${postId}`, { method: 'DELETE', body: { password: pw } });
      showToast('삭제되었습니다.');
      setTimeout(() => (location.href = '/'), 600);
    },
  });
};

document.getElementById('editPostBtn').onclick = () => {
  promptPassword({
    title: '수정하려면 비밀번호를 입력하세요',
    onConfirm: async (pw) => {
      await api(`/api/posts/${postId}/verify-password`, { method: 'POST', body: { password: pw } });
      currentPost._editPassword = pw;
      document.getElementById('editTitle').value = currentPost.title;
      document.getElementById('editContent').value = currentPost.content;
      document.getElementById('postView').style.display = 'none';
      document.getElementById('editForm').style.display = 'block';
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
    await api(`/api/posts/${postId}/comments`, {
      method: 'POST',
      body: { content, nickname, password },
    });
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
