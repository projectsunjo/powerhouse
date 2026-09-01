const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

function hashIp(ip) {
  const salt = process.env.IP_HASH_SALT || 'default-salt';
  return crypto.createHash('sha256').update(salt + '|' + ip).digest('hex');
}

function getClientIp(req) {
  const fwd = req.headers['x-forwarded-for'];
  if (fwd) return fwd.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function hashPassword(plain) {
  return bcrypt.hashSync(plain, 10);
}

function checkPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash);
}

const POWER_WORDS = [
  'Volt', 'Watt', 'Surge', 'Turbine', 'Reactor', 'Fusion', 'Spark', 'Grid',
  'Ampere', 'Joule', 'Circuit', 'Voltage', 'Current', 'Kilowatt', 'Megawatt',
  'Battery', 'Generator', 'Capacitor', 'Plasma', 'Photon', 'Dynamo', 'Ohm',
];

function randomNickname() {
  const word = POWER_WORDS[Math.floor(Math.random() * POWER_WORDS.length)];
  const n = Math.floor(1000 + Math.random() * 9000);
  return `${word}${n}`;
}

async function containsBannedWord(text) {
  const { rows } = await pool.query('SELECT word FROM banned_words');
  if (rows.length === 0) return null;
  const lower = String(text).toLowerCase();
  for (const row of rows) {
    if (lower.includes(row.word.toLowerCase())) return row.word;
  }
  return null;
}

module.exports = {
  hashIp,
  getClientIp,
  hashPassword,
  checkPassword,
  randomNickname,
  containsBannedWord,
};
