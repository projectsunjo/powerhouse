const nodemailer = require('nodemailer');
const { pool } = require('../db');
const { getSetting } = require('./settings');

function getTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    family: 4,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

function parseRecipients(recipientsStr) {
  return String(recipientsStr || '')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildSubject(template, createdAt) {
  // createdAt is always a full ISO 8601 string (toISOString()) by the time
  // this is called — passing it straight to Date avoids double-appending
  // 'Z' (which produced "Invalid Date" when this used to assume a bare
  // "YYYY-MM-DD HH:MM:SS" SQL-style string).
  const dateLabel = new Date(createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (template || '{날짜}').replace('{날짜}', dateLabel);
}

// Returns a human-readable summary string describing the outcome, for the run log.
async function sendBriefingEmail(html, createdAt, recipientsStr, subjectTemplate) {
  const recipients = parseRecipients(recipientsStr);
  if (!recipients.length) {
    return '이메일 미발송 (수신자 없음)';
  }

  const transporter = getTransporter();
  if (!transporter) {
    return '이메일 미발송 (발신 계정 미설정)';
  }

  const subject = buildSubject(subjectTemplate, createdAt);

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: recipients.join(', '),
      subject,
      html,
    });
    const [first, ...rest] = recipients;
    return rest.length ? `${first} 외 ${rest.length}명으로 이메일 발송 완료` : `${first}로 이메일 발송 완료`;
  } catch (e) {
    return `이메일 발송 실패: ${e.message}`;
  }
}

// Sends the briefing email using the current recipient/subject settings,
// and records the attempt (whoever triggered it, success or not) into
// email_logs — every button click gets its own row, not just the latest.
async function sendAndLogBriefingEmail(briefingId, html, createdAt, triggerType) {
  const emailRecipients = await getSetting('briefing_email_recipients', '');
  const emailSubjectTemplate = await getSetting(
    'briefing_email_subject_template',
    '[ESMI 마켓봇] 국내외 전력 및 SOFC 관련 {날짜}'
  );
  const recipients = parseRecipients(emailRecipients);

  let status;
  let detail;
  if (!recipients.length) {
    status = 'skipped';
    detail = '수신자 없음';
  } else {
    const transporter = getTransporter();
    if (!transporter) {
      status = 'skipped';
      detail = '발신 계정 미설정';
    } else {
      try {
        const subject = buildSubject(emailSubjectTemplate, createdAt);
        await transporter.sendMail({ from: process.env.GMAIL_USER, to: recipients.join(', '), subject, html });
        status = 'success';
        detail = subject;
      } catch (e) {
        status = 'failed';
        detail = e.message;
      }
    }
  }

  await pool.query(
    'INSERT INTO email_logs (briefing_id, trigger_type, from_email, recipients, status, detail) VALUES ($1, $2, $3, $4, $5, $6)',
    [briefingId, triggerType, process.env.GMAIL_USER || null, recipients.join('; '), status, detail]
  );

  if (status === 'success') {
    const [first, ...rest] = recipients;
    return rest.length ? `${first} 외 ${rest.length}명으로 이메일 발송 완료` : `${first}로 이메일 발송 완료`;
  }
  if (status === 'skipped') return `이메일 미발송 (${detail})`;
  return `이메일 발송 실패: ${detail}`;
}

module.exports = { sendBriefingEmail, parseRecipients, buildSubject, sendAndLogBriefingEmail };
