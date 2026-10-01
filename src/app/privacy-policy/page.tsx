import type { Metadata } from 'next';
import { Footer } from '@/components/layout/Footer';
import { LegalDocument } from '@/components/layout/LegalDocument';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How InFaith Journey collects, uses, shares and protects personal information.',
};

const listClassName = 'list-disc space-y-3 pl-6 marker:text-secondary';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F3EE]">
      <Navbar />
      <LegalDocument
        eyebrow="Last updated: 1 October 2026"
        title="Privacy Policy"
        introduction={<div className="space-y-4"><p>Welcome to <strong>InFaith Journey</strong>, accessible at <a href="https://infaithjourney.com" className="text-primary underline decoration-secondary/60 underline-offset-4">infaithjourney.com</a>. We operate a curated luxury wedding marketplace connecting couples with elite wedding vendors in South Africa.</p><p>We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose and safeguard your data when you visit our website, register an account or use our marketplace services, in compliance with South Africa&apos;s <strong>Protection of Personal Information Act (POPIA)</strong>.</p></div>}
        sections={[
          { title: '1. Information We Collect', content: <div className="space-y-4"><p>We collect personal information you voluntarily provide when registering, subscribing to our newsletter, submitting an inquiry or interacting with the Platform.</p><ul className={listClassName}><li><strong>Couples and general Users:</strong> name, email address, telephone number, wedding date, wedding location preferences and inquiry details submitted to Vendors.</li><li><strong>Wedding Vendors:</strong> business name, contact person, email address, physical or operating address, telephone number, business registration details, portfolio images, social media handles and billing or payment information.</li><li><strong>Automated collection:</strong> IP address, browser type, operating system, referring URLs and interaction data collected through cookies and tracking technologies such as Google Analytics.</li></ul></div> },
          { title: '2. How We Use Your Information', content: <div className="space-y-4"><p>We process personal information for legitimate business purposes, including:</p><ul className={listClassName}><li><strong>Marketplace connections:</strong> enabling couples to discover, contact and book elite wedding Vendors.</li><li><strong>Account management:</strong> creating and maintaining User profiles and Vendor registration dashboards.</li><li><strong>Communication:</strong> sending booking inquiries, administrative updates, security alerts and customer support messages.</li><li><strong>Marketing:</strong> sharing wedding inspiration, Platform highlights and promotional newsletters only with your explicit consent. You may opt out at any time.</li><li><strong>Platform improvement:</strong> analysing traffic trends and User behaviour to improve the website experience.</li></ul></div> },
          { title: '3. How Data Is Shared', content: <div className="space-y-4"><p>We do not sell, rent or trade your personal information. We share it only in the following circumstances:</p><ul className={listClassName}><li><strong>Between Couples and Vendors:</strong> when a Couple submits an inquiry, their contact details are shared with the selected Vendor to facilitate a booking. Published Vendor business profiles are visible to site visitors.</li><li><strong>Service providers:</strong> trusted providers that help operate our website, including hosting, email delivery and analytics providers, subject to appropriate confidentiality obligations.</li><li><strong>Legal obligations:</strong> where disclosure is required by law, subpoena or South African regulatory requirements under POPIA.</li></ul></div> },
          { title: '4. Data Security and Retention', content: <div className="space-y-3"><p>We implement appropriate technical and organisational safeguards designed to protect personal information from unauthorised access, loss, misuse or alteration.</p><p>We retain personal information only as long as necessary for the purposes in this Policy, unless a longer period is required or permitted by law, including for tax or accounting obligations.</p></div> },
          { title: '5. Your Rights Under POPIA', content: <div className="space-y-4"><p>Users in South Africa have specific rights concerning their personal information, including:</p><ul className={listClassName}><li><strong>Access:</strong> request confirmation of whether we hold your personal information and obtain a copy.</li><li><strong>Rectification:</strong> ask us to update or correct inaccurate or incomplete information.</li><li><strong>Erasure:</strong> ask us to delete personal information or deactivate your Vendor or User account, subject to legal retention requirements.</li><li><strong>Objection:</strong> object to processing for direct marketing purposes.</li></ul><p>To exercise these rights, contact our information team using the details below.</p></div> },
          { title: '6. Cookies and Tracking Technologies', content: <p>We use cookies to improve browsing, remember preferences and analyse site performance. You can manage cookie preferences through your browser settings; however, disabling certain cookies may limit some marketplace features.</p> },
          { title: '7. Changes to This Privacy Policy', content: <p>We may update this Policy to reflect changes in our practices or South African data protection laws. Significant modifications will be indicated by updating the “Last updated” date at the top of this page.</p> },
          { title: '8. Contact Us', content: <div className="space-y-2"><p>For questions, concerns or requests regarding this Policy or our handling of personal information, contact:</p><address className="not-italic"><strong>InFaith Journey</strong><br /><a href="https://infaithjourney.com" className="text-primary hover:underline">infaithjourney.com</a><br /><a href="mailto:admin@infaithjourney.com" className="text-primary hover:underline">admin@infaithjourney.com</a><br /><a href="tel:+27784420278" className="text-primary hover:underline">+27 78 442 0278</a></address></div> },
        ]}
      />
      <Footer />
    </div>
  );
}
