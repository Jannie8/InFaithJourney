import { sendEmail } from '@/lib/resend';

type VendorInquiryEmail = {
  to: string;
  vendorName: string;
  senderName: string;
  senderEmail: string;
  weddingDate?: string;
  message: string;
  profileUrl: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;',
  })[character]!);
}

export async function sendVendorInquiryEmail(input: VendorInquiryEmail) {
  const vendorName = escapeHtml(input.vendorName);
  const senderName = escapeHtml(input.senderName);
  const senderEmail = escapeHtml(input.senderEmail);
  const weddingDate = escapeHtml(input.weddingDate || 'Not specified');
  const message = escapeHtml(input.message).replace(/\n/g, '<br>');
  const profileUrl = escapeHtml(input.profileUrl);

  await sendEmail({
    to: input.to,
    subject: `New wedding inquiry for ${input.vendorName}`,
    html: `
      <div style="background:#faf8f5;padding:40px 16px;font-family:Arial,sans-serif;color:#352b2b">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:20px;padding:40px;border:1px solid #eadfda">
          <p style="margin:0 0 24px;color:#9b6b65;font-size:13px;letter-spacing:2px;text-transform:uppercase">InFaith Journey</p>
          <h1 style="font-family:Georgia,serif;font-size:30px;line-height:1.25;margin:0 0 20px">New inquiry for ${vendorName}</h1>
          <p style="font-size:16px;line-height:1.7"><strong>${senderName}</strong> would like to discuss their wedding with you.</p>
          <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.6">
            <tr><td style="padding:8px 0;color:#746767">Reply email</td><td style="padding:8px 0;font-weight:bold"><a href="mailto:${senderEmail}" style="color:#a85f65">${senderEmail}</a></td></tr>
            <tr><td style="padding:8px 0;color:#746767">Wedding date</td><td style="padding:8px 0;font-weight:bold">${weddingDate}</td></tr>
          </table>
          <div style="margin:24px 0;padding:20px;border-radius:14px;background:#faf8f5;line-height:1.7">${message}</div>
          <div style="margin:28px 0;text-align:center"><a href="mailto:${senderEmail}" style="display:inline-block;background:#a85f65;color:#fff;text-decoration:none;border-radius:999px;padding:15px 28px;font-weight:bold">Reply to ${senderName}</a></div>
          <p style="font-size:13px;color:#746767">Profile: <a href="${profileUrl}" style="color:#a85f65">${profileUrl}</a></p>
        </div>
      </div>`,
    text: `New inquiry for ${input.vendorName}\nFrom: ${input.senderName} <${input.senderEmail}>\nWedding date: ${input.weddingDate || 'Not specified'}\n\n${input.message}\n\nVendor profile: ${input.profileUrl}`,
  });
}
