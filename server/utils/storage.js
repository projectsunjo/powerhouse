// Storage via Supabase Storage (same project as the DB, so
// no new account/credit card is needed — just SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY from the project's own Settings > API page).
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const AVATAR_BUCKET = 'avatars';
const FILES_BUCKET = 'files';
let client = null;
let avatarBucketEnsured = false;
let filesBucketEnsured = false;

function getClient() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key);
  return client;
}

function isSupabaseStorageConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function ensureBucket(supabase, bucketName = AVATAR_BUCKET) {
  if (bucketName === AVATAR_BUCKET && avatarBucketEnsured) return;
  if (bucketName === FILES_BUCKET && filesBucketEnsured) return;

  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets || !buckets.some((b) => b.name === bucketName)) {
    await supabase.storage.createBucket(bucketName, { public: true });
  }
  if (bucketName === AVATAR_BUCKET) avatarBucketEnsured = true;
  if (bucketName === FILES_BUCKET) filesBucketEnsured = true;
}

// Uploads a profile image buffer for a user and returns its public URL.
async function uploadProfileImage(userId, buffer, mimeType) {
  const supabase = getClient();
  if (!supabase) {
    throw new Error('이미지 저장소가 설정되지 않았습니다 (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요).');
  }
  await ensureBucket(supabase, AVATAR_BUCKET);

  const ext = (mimeType.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `users/${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(AVATAR_BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Creates a signed upload URL so the client browser can upload directly
// to Supabase Storage, bypassing Vercel's 4.5MB serverless payload limit.
async function createSignedFileUploadUrl(filename) {
  const supabase = getClient();
  if (!supabase) {
    throw new Error('Supabase 저장소가 설정되지 않았습니다 (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요).');
  }
  await ensureBucket(supabase, FILES_BUCKET);

  const cleanName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_') || 'file';
  const filePath = `uploads/${Date.now()}_${crypto.randomBytes(4).toString('hex')}_${cleanName}`;

  const { data, error } = await supabase.storage.from(FILES_BUCKET).createSignedUploadUrl(filePath);
  if (error) throw new Error(`Supabase 업로드 URL 생성 실패: ${error.message}`);

  const { data: publicData } = supabase.storage.from(FILES_BUCKET).getPublicUrl(filePath);

  let signedUrl = data.signedUrl;
  if (signedUrl.startsWith('/')) {
    signedUrl = `${process.env.SUPABASE_URL.replace(/\/$/, '')}${signedUrl}`;
  }

  return {
    signedUrl,
    token: data.token,
    path: filePath,
    publicUrl: publicData.publicUrl,
  };
}

// Deletes a file from Supabase Storage if it's hosted there
async function deleteStoredFile(urlOrPath) {
  const supabase = getClient();
  if (!supabase || !urlOrPath) return;

  const match = urlOrPath.match(/\/storage\/v1\/object\/public\/files\/(.+)$/);
  if (match) {
    const filePath = decodeURIComponent(match[1]);
    await supabase.storage.from(FILES_BUCKET).remove([filePath]);
  }
}

module.exports = {
  uploadProfileImage,
  createSignedFileUploadUrl,
  deleteStoredFile,
  isSupabaseStorageConfigured,
};
