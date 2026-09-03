// Plain-language legal pages for Chasely. This is standard boilerplate for a
// small SaaS tool and isn't a substitute for advice from a lawyer — if the
// business grows, it's worth having these reviewed.

const OPERATOR = 'Mohamad Abdulla Taisir Alalami, trading as Chasely (Dubai, United Arab Emirates)';
const CONTACT_EMAIL = 'mohamad.alalami@gmail.com';
const UPDATED = 'September 3, 2026';

const terms = {
  title: 'Terms of Service',
  updated: UPDATED,
  body: `
    <p>These Terms of Service ("Terms") govern your use of Chasely (the "Service"), operated by ${OPERATOR}. By creating an account or using Chasely, you agree to these Terms.</p>

    <h2>1. What Chasely does</h2>
    <p>Chasely helps freelancers and small businesses draft invoice payment-reminder emails based on how overdue an invoice is. Chasely does not send emails on your behalf, process payments, or provide accounting, tax, debt-collection, or legal services. You review and send every email yourself.</p>

    <h2>2. Your account</h2>
    <p>You're responsible for keeping your login credentials secure and for all activity under your account. You must provide accurate information and be legally able to enter into these Terms.</p>

    <h2>3. Plans and billing</h2>
    <p>Chasely offers a free plan limited to 3 invoices, and a paid subscription plan billed monthly. Subscription fees are billed in advance and are non-refundable except as described in our <a href="/refund-policy">Refund Policy</a>. You can cancel your subscription at any time; your paid plan remains active until the end of the current billing period.</p>

    <h2>4. Acceptable use</h2>
    <p>You agree not to use Chasely to send harassing, deceptive, or unlawful communications, to store data you don't have the right to store, or to attempt to disrupt or reverse-engineer the Service.</p>

    <h2>5. Your data</h2>
    <p>You retain ownership of the invoice, client, and business data you enter into Chasely. See our <a href="/privacy">Privacy Policy</a> for how it's handled.</p>

    <h2>6. Service availability</h2>
    <p>Chasely is provided "as is." We aim for high availability but don't guarantee uninterrupted access, and we're not liable for losses arising from downtime, data loss, or reminders not sent (since Chasely never sends anything automatically — you do).</p>

    <h2>7. Limitation of liability</h2>
    <p>To the maximum extent permitted by law, Chasely and its operator are not liable for indirect, incidental, or consequential damages arising from your use of the Service. Our total liability for any claim is limited to the amount you paid us in the 3 months before the claim arose.</p>

    <h2>8. Changes</h2>
    <p>We may update these Terms from time to time. Continued use of Chasely after a change means you accept the updated Terms. Material changes will be reflected by updating the date at the top of this page.</p>

    <h2>9. Governing law</h2>
    <p>These Terms are governed by the laws of the United Arab Emirates.</p>

    <h2>10. Contact</h2>
    <p>Questions about these Terms? Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
  `,
};

const privacy = {
  title: 'Privacy Policy',
  updated: UPDATED,
  body: `
    <p>This Privacy Policy explains what data Chasely collects, why, and how it's handled. Chasely is operated by ${OPERATOR}.</p>

    <h2>1. What we collect</h2>
    <ul>
      <li><strong>Account data:</strong> your business name, email address, and password (stored as a secure hash, never in plain text).</li>
      <li><strong>Invoice data you enter:</strong> client names, client emails, invoice amounts, due dates, and payment links — used only to draft your reminder emails and show your dashboard.</li>
      <li><strong>Billing data:</strong> if you subscribe to a paid plan, our payment processor handles your card details directly — we never see or store your full card number.</li>
      <li><strong>Basic technical data:</strong> standard server logs (IP address, browser type) for security and debugging.</li>
    </ul>

    <h2>2. What we don't do</h2>
    <p>We don't sell your data. We don't send marketing emails to your clients. We don't share your invoice or client data with third parties except the infrastructure providers needed to run the Service (hosting and database providers, and a payment processor for paid plans), each bound to protect it.</p>

    <h2>3. How we use your data</h2>
    <p>Solely to operate Chasely: to authenticate you, generate your dashboard and reminder drafts, process billing for paid plans, and respond if you contact us for support.</p>

    <h2>4. Data retention</h2>
    <p>We keep your data for as long as your account is active. If you delete your account or ask us to remove your data, we'll delete it within a reasonable time, except where we're required to retain billing records for legal or tax purposes.</p>

    <h2>5. Your rights</h2>
    <p>You can access, correct, export, or delete your data at any time by contacting us. You can also close your account from within the app.</p>

    <h2>6. Security</h2>
    <p>Passwords are hashed, connections use HTTPS, and data is stored in a managed, access-controlled database. No system is 100% secure, but we take reasonable, industry-standard measures to protect your information.</p>

    <h2>7. Changes</h2>
    <p>If this policy changes materially, we'll update the date at the top of this page.</p>

    <h2>8. Contact</h2>
    <p>Questions or requests about your data? Email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
  `,
};

const refundPolicy = {
  title: 'Refund Policy',
  updated: UPDATED,
  body: `
    <p>Chasely is operated by ${OPERATOR}.</p>

    <h2>Free plan</h2>
    <p>Chasely's free plan (up to 3 invoices) is free forever — no payment, no refund questions.</p>

    <h2>Paid subscription</h2>
    <p>If you're not happy with Chasely within the first 14 days of your <em>first</em> paid subscription payment, email us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> and we'll refund that payment in full, no questions asked.</p>
    <p>Outside that 14-day window, subscription payments are non-refundable, including for partial months. You can cancel anytime to stop future billing — your plan stays active until the end of the period you already paid for.</p>

    <h2>Billing errors</h2>
    <p>If you believe you were charged in error (e.g. charged twice, or charged after cancelling), contact us and we'll investigate and correct it promptly.</p>

    <h2>How refunds are issued</h2>
    <p>Approved refunds are returned to your original payment method, typically within 5–10 business days depending on your bank or card provider.</p>

    <h2>Contact</h2>
    <p>Refund questions: <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
  `,
};

module.exports = { terms, privacy, refundPolicy };

