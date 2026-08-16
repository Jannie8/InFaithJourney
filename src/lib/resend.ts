type EmailMessage = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/** Sends one transactional email without exposing Resend credentials to clients. */
export async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPROVAL_EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error('Email is not configured. Set RESEND_API_KEY and APPROVAL_EMAIL_FROM.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, ...message }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected the email (${response.status}): ${detail}`);
  }
}
