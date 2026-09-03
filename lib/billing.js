// Subscription billing. Inactive until STRIPE_SECRET_KEY is set in .env —
// every route here fails soft with a clear message rather than crashing,
// so the app runs fine before billing is configured.

const configured = Boolean(process.env.STRIPE_SECRET_KEY);
const stripe = configured ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;

const FREE_INVOICE_LIMIT = 3;
const PRICE_MONTHLY_CENTS = 1900; // $19/mo — undercuts general invoicing suites, priced for a narrow job
const PRICE_ID = process.env.STRIPE_PRICE_ID || null; // set after creating the Price in Stripe dashboard/API

async function createCheckoutSession(user, successUrl, cancelUrl) {
  if (!configured || !PRICE_ID) {
    throw new Error(
      'Billing is not configured yet. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in .env once the Stripe account exists.'
    );
  }
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: user.stripe_customer_id ? undefined : user.email,
    customer: user.stripe_customer_id || undefined,
    line_items: [{ price: PRICE_ID, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: String(user.id),
  });
  return session;
}

function verifyAndParseWebhook(rawBody, signature) {
  if (!configured || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Webhook not configured.');
  }
  return stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
}

module.exports = {
  configured,
  FREE_INVOICE_LIMIT,
  PRICE_MONTHLY_CENTS,
  createCheckoutSession,
  verifyAndParseWebhook,
};
