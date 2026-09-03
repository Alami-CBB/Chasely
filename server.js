require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const path = require('path');
const db = require('./db');
const { draft, stageForDaysOverdue, STAGES } = require('./lib/reminders');
const billing = require('./lib/billing');
const posts = require('./content/posts');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
  })
);

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

function daysBetween(a, b) {
  return Math.floor((a - b) / (1000 * 60 * 60 * 24));
}

// ---------- Auth ----------

app.get('/', (req, res) => {
  if (req.session.userId) return res.redirect('/dashboard');
  res.render('landing');
});

app.get('/blog', (req, res) => res.render('blog-index', { posts }));

app.get('/blog/:slug', (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).send('Not found');
  res.render('blog-post', { post });
});

app.get('/signup', (req, res) => res.render('signup', { error: null }));

app.post('/signup', (req, res) => {
  const { business_name, email, password } = req.body;
  if (!business_name || !email || !password) {
    return res.render('signup', { error: 'All fields are required.' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.render('signup', { error: 'An account with that email already exists.' });

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (business_name, email, password_hash) VALUES (?, ?, ?)')
    .run(business_name, email, hash);
  req.session.userId = info.lastInsertRowid;
  res.redirect('/dashboard');
});

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.render('login', { error: 'Invalid email or password.' });
  }
  req.session.userId = user.id;
  res.redirect('/dashboard');
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ---------- Dashboard ----------

app.get('/dashboard', requireAuth, (req, res) => {
  const invoices = db
    .prepare('SELECT * FROM invoices WHERE user_id = ? ORDER BY due_date ASC')
    .all(req.session.userId);

  const today = new Date();
  const enriched = invoices.map((inv) => {
    const due = new Date(inv.due_date);
    const daysOverdue = inv.status === 'paid' ? 0 : Math.max(0, daysBetween(today, due));
    const suggestedStage = inv.status === 'paid' ? null : stageForDaysOverdue(daysOverdue);
    return { ...inv, daysOverdue, suggestedStage };
  });

  const outstanding = enriched
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueCount = enriched.filter((i) => i.status !== 'paid' && i.daysOverdue > 0).length;

  res.render('dashboard', { invoices: enriched, outstanding, overdueCount, STAGES });
});

app.get('/invoices/new', requireAuth, (req, res) => res.render('new-invoice', { error: null, upsell: false }));

app.post('/invoices/new', requireAuth, (req, res) => {
  const { client_name, client_email, invoice_number, amount, currency, due_date, payment_link } = req.body;
  if (!client_name || !client_email || !invoice_number || !amount || !due_date) {
    return res.render('new-invoice', { error: 'Please fill in all required fields.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  const count = db
    .prepare('SELECT COUNT(*) AS n FROM invoices WHERE user_id = ?')
    .get(req.session.userId).n;
  if (user.subscription_status !== 'active' && count >= billing.FREE_INVOICE_LIMIT) {
    return res.render('new-invoice', {
      error: `You've reached the free plan limit (${billing.FREE_INVOICE_LIMIT} invoices). Upgrade to add more.`,
      upsell: true,
    });
  }

  db.prepare(
    `INSERT INTO invoices (user_id, client_name, client_email, invoice_number, amount, currency, due_date, payment_link)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    req.session.userId,
    client_name,
    client_email,
    invoice_number,
    parseFloat(amount),
    currency || 'USD',
    due_date,
    payment_link || ''
  );
  res.redirect('/dashboard');
});

app.post('/invoices/:id/mark-paid', requireAuth, (req, res) => {
  db.prepare('UPDATE invoices SET status = ? WHERE id = ? AND user_id = ?').run(
    'paid',
    req.params.id,
    req.session.userId
  );
  res.redirect('/dashboard');
});

// ---------- Reminder drafting ----------

app.get('/invoices/:id/reminder', requireAuth, (req, res) => {
  const invoice = db
    .prepare('SELECT * FROM invoices WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.session.userId);
  if (!invoice) return res.status(404).send('Not found');

  const business = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  const today = new Date();
  const daysOverdue = Math.max(0, daysBetween(today, new Date(invoice.due_date)));
  const stage = req.query.stage || stageForDaysOverdue(daysOverdue) || 'friendly';
  const email = draft(stage, invoice, business);

  res.render('reminder', { invoice, email, stage, STAGES });
});

app.post('/invoices/:id/reminder/log', requireAuth, (req, res) => {
  const { stage, subject, body } = req.body;
  db.prepare(
    'INSERT INTO reminders_sent (invoice_id, stage, subject, body) VALUES (?, ?, ?, ?)'
  ).run(req.params.id, stage, subject, body);
  res.redirect('/dashboard');
});

// ---------- Billing ----------

app.post('/billing/checkout', requireAuth, async (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.session.userId);
  try {
    const origin = `${req.protocol}://${req.get('host')}`;
    const session = await billing.createCheckoutSession(
      user,
      `${origin}/dashboard?upgraded=1`,
      `${origin}/invoices/new`
    );
    res.redirect(session.url);
  } catch (err) {
    res.status(503).send(
      `Billing isn't set up yet: ${err.message} — once the Stripe account exists, set STRIPE_SECRET_KEY and STRIPE_PRICE_ID in .env and this button starts working.`
    );
  }
});

// Stripe needs the raw body to verify the webhook signature, so this route
// gets its own raw-body middleware ahead of the global urlencoded parser.
app.post('/billing/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = billing.verifyAndParseWebhook(req.body, req.headers['stripe-signature']);
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = Number(session.client_reference_id);
    if (userId) {
      db.prepare(
        'UPDATE users SET subscription_status = ?, stripe_customer_id = ? WHERE id = ?'
      ).run('active', session.customer, userId);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    db.prepare(
      "UPDATE users SET subscription_status = 'free' WHERE stripe_customer_id = ?"
    ).run(sub.customer);
  }

  res.json({ received: true });
});

app.listen(PORT, () => {
  console.log(`Chasely running at http://localhost:${PORT}`);
});
