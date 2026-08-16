import { sendEmail } from '@/lib/resend';

type AdminApplicationEmail = {
  to: string;
  businessName: string;
  ownerName: string;
  category: string;
  selectedPlan: string;
  reviewUrl: string;
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

export async function sendAdminApplicationEmail(input: AdminApplicationEmail) {
  const businessName = escapeHtml(input.businessName || 'Unnamed business');
  const ownerName = escapeHtml(input.ownerName || 'Unknown applicant');
  const category = escapeHtml(input.category || 'Not provided');
  const plan = escapeHtml(PLAN_NAMES[input.selectedPlan] || input.selectedPlan || 'Not provided');
  const reviewUrl = escapeHtml(input.reviewUrl);

  await sendEmail({
    to: input.to,
    subject: `New vendor application: ${input.businessName || 'Unnamed business'}`,
    html: `
      <div style="background:#faf8f5;padding:40px 16px;font-family:Arial,sans-serif;color:#352b2b">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:20px;padding:40px;border:1px solid #eadfda">
          <p style="margin:0 0 24px;color:#9b6b65;font-size:13px;letter-spacing:2px;text-transform:uppercase">InFaith Journey Admin</p>
          <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.25;margin:0 0 20px">New vendor application</h1>
          <p style="font-size:16px;line-height:1.7"><strong>${businessName}</strong> has submitted an application for review.</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6">
            <tr><td style="padding:8px 0;color:#746767">Applicant</td><td style="padding:8px 0;font-weight:bold">${ownerName}</td></tr>
            <tr><td style="padding:8px 0;color:#746767">Category</td><td style="padding:8px 0;font-weight:bold">${category}</td></tr>
            <tr><td style="padding:8px 0;color:#746767">Plan</td><td style="padding:8px 0;font-weight:bold">${plan}</td></tr>
          </table>
          <div style="margin:32px 0;text-align:center"><a href="${reviewUrl}" style="display:inline-block;background:#a85f65;color:#fff;text-decoration:none;border-radius:999px;padding:15px 28px;font-weight:bold">Review application</a></div>
        </div>
      </div>`,
    text: `A new vendor application was submitted by ${input.businessName || 'an unnamed business'}. Applicant: ${input.ownerName || 'Unknown'}. Category: ${input.category || 'Not provided'}. Plan: ${PLAN_NAMES[input.selectedPlan] || input.selectedPlan || 'Not provided'}. Review it here: ${input.reviewUrl}`,
  });
}
