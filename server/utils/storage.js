// Profile-picture storage via Supabase Storage (same project as the DB, so
// no new account/credit card is needed — just SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY from the project's own Settings > API page).
const { createClient } = require('@supabase/supabase-js');

const BUCKET = 'avatars';
let client = null;
let bucketEnsured = false;

function getClient() {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client = createClient(url, key);
  return client;
}

async function ensureBucket(supabase) {
  if (bucketEnsured) return;
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets || !buckets.some((b) => b.name === BUCKET)) {
    await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: '5MB' });
  }
  bucketEnsured = true;
}

// Uploads a profile image buffer for a user and returns its public URL.
async function uploadProfileImage(userId, buffer, mimeType) {
  const supabase = getClient();
  if (!supabase) {
    throw new Error('이미지 저장소가 설정되지 않았습니다 (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 필요).');
  }
  await ensureBucket(supabase);

  const ext = (mimeType.split('/')[1] || 'jpg').replace('jpeg', 'jpg');
  const path = `users/${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buffer, {
    contentType: mimeType,
    upsert: true,
  });
  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

module.exports = { uploadProfileImage };
