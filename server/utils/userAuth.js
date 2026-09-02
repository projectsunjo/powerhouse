const jwt = require('jsonwebtoken');

function issueUserToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role, username: user.username, displayName: user.display_name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '12h' }
  );
}

// Returns the decoded { userId, role, username, displayName } payload, or
// null if there's no valid session — never throws, so routes that only
// optionally care about the caller's identity (e.g. anonymous board posts
// signed by a logged-in executive) can call this freely.
function getUserFromRequest(req) {
  const token = req.cookies && req.cookies.user_token;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
  } catch (e) {
    return null;
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    const payload = getUserFromRequest(req);
    if (!payload || !allowedRoles.includes(payload.role)) {
      return res.status(401).json({ error: '로그인이 필요합니다.' });
    }
    req.user = payload;
    next();
  };
}

module.exports = { issueUserToken, getUserFromRequest, requireRole };
