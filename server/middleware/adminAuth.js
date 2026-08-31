const jwt = require('jsonwebtoken');

function requireAdmin(req, res, next) {
  const token = req.cookies && req.cookies.admin_token;
  if (!token) return res.status(401).json({ error: '로그인이 필요합니다.' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    if (payload.role !== 'admin') throw new Error('not admin');
    req.admin = true;
    next();
  } catch (e) {
    return res.status(401).json({ error: '인증이 만료되었거나 유효하지 않습니다.' });
  }
}

module.exports = { requireAdmin };
