type ApprovalEmail = {
  to: string;
  ownerName?: string;
  businessName?: string;
  selectedPlan?: string;
  activationUrl: string;
};

const PLAN_NAMES: Record<string, string> = {
  free: 'Free Listing',
  standard: 'Standard Vendor',
  featured: 'Featured Vendor',
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!);
}

/** Sends the approval email through Resend's HTTPS API (server only). */
export async function sendVendorApprovalEmail(input: ApprovalEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.APPROVAL_EMAIL_FROM;
  if (!apiKey || !from) {
    throw new Error('Approval email is not configured. Set RESEND_API_KEY and APPROVAL_EMAIL_FROM.');
  }

  const ownerName = escapeHtml(input.ownerName?.trim() || 'there');
  const businessName = escapeHtml(input.businessName?.trim() || 'your business');
  const planName = escapeHtml(PLAN_NAMES[input.selectedPlan || ''] || 'selected membership');
  const activationUrl = escapeHtml(input.activationUrl);
  const subject = `Your ${input.businessName?.trim() || 'business'} vendor application is approved`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject,
      html: `
        <div style="background:#faf8f5;padding:40px 16px;font-family:Arial,sans-serif;color:#352b2b">
          <div style="max-width:600px;margin:auto;background:#fff;border-radius:20px;padding:40px;border:1px solid #eadfda">
            <p style="margin:0 0 24px;color:#9b6b65;font-size:13px;letter-spacing:2px;text-transform:uppercase">InFaith Journey</p>
            <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.25;margin:0 0 20px">Congratulations, ${ownerName}!</h1>
            <p style="font-size:16px;line-height:1.7">We are delighted to let you know that the vendor application for <strong>${businessName}</strong> has been approved.</p>
            <p style="font-size:16px;line-height:1.7">Your chosen plan is <strong>${planName}</strong>. The final step is to activate it from your vendor dashboard.</p>
            <div style="margin:32px 0;text-align:center">
              <a href="${activationUrl}" style="display:inline-block;background:#a85f65;color:#fff;text-decoration:none;border-radius:999px;padding:15px 28px;font-weight:bold">Activate your plan</a>
            </div>
            <p style="font-size:13px;line-height:1.6;color:#746767">If the button does not work, copy and paste this link into your browser:<br><a href="${activationUrl}" style="color:#a85f65;word-break:break-all">${activationUrl}</a></p>
          </div>
        </div>`,
      text: `Congratulations, ${input.ownerName?.trim() || 'there'}! Your vendor application for ${input.businessName?.trim() || 'your business'} has been approved. Activate your ${PLAN_NAMES[input.selectedPlan || ''] || 'selected membership'} plan here: ${input.activationUrl}`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Resend rejected the approval email (${response.status}): ${detail}`);
  }
}
