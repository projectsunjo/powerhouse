const nodemailer = require('nodemailer');

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
  const dateLabel = new Date(createdAt.replace(' ', 'T') + 'Z').toLocaleDateString('ko-KR', {
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

module.exports = { sendBriefingEmail, parseRecipients, buildSubject };
