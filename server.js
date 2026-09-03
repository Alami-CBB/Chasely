require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const bcrypt = require('bcryptjs');
const path = require('path');
const { pool, init } = require('./db');
const { draft, stageForDaysOverdue, STAGES } = require('./lib/reminders');
const billing = require('./lib/billing');
const posts = require('./content/posts');
const legal = require('./content/legal');

const app = express();
const PORT = process.env.PORT || 3000;

// Render (and most PaaS hosts) terminate TLS at a proxy and forward plain
// HTTP internally. Without this, req.protocol always reports "http", which
// breaks the sitemap and the Stripe checkout redirect URLs in production.
app.set('trust proxy', 1);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    store: process.env.DATABASE_URL
      ? new pgSession({ pool, tableName: 'session', createTableIfMissing: true })
      : undefined,
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

function requireAuth(req, res, next) {
  if (!req.session.userId) return res.redirect('/login');
  next();
}

// Wrap async route handlers so a rejected promise reaches Express's error
// handling instead of crashing the process or hanging the request.
function ah(fn) {
  return (req, res, next) => fn(req, res, next).catch(next);
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

app.get('/sitemap.xml', (req, res) => {
  const origin = `${req.protocol}://${req.get('host')}`;
  const staticPaths = ['/', '/blog', '/login', '/signup', '/terms', '/privacy', '/refund-policy'];
  const urls = [
    ...staticPaths.map((p) => `${origin}${p}`),
    ...posts.map((p) => `${origin}/blog/${p.slug}`),
  ];
  res.set('Content-Type', 'application/xml');
  res.send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n') +
      `\n</urlset>`
  );
});

app.get('/blog/:slug', (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (!post) return res.status(404).send('Not found');
  res.render('blog-post', { post });
});

app.get('/terms', (req, res) => res.render('legal', legal.terms));
app.get('/privacy', (req, res) => res.render('legal', legal.privacy));
app.get('/refund-policy', (req, res) => res.render('legal', legal.refundPolicy));

app.get('/signup', (req, res) => res.render('signup', { error: null }));

app.post(
  '/signup',
  ah(async (req, res) => {
    const { business_name, email, password } = req.body;
    if (!business_name || !email || !password) {
      return res.render('signup', { error: 'All fields are required.' });
    }
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.render('signup', { error: 'An account with that email already exists.' });
    }

    const hash = bcrypt.hashSync(password, 10);
    const inserted = await pool.query(
      'INSERT INTO users (business_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [business_name, email, hash]
    );
    req.session.userId = inserted.rows[0].id;
    res.redirect('/dashboard');
  })
);

app.get('/login', (req, res) => res.render('login', { error: null }));

app.post(
  '/login',
  ah(async (req, res) => {
    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      return res.render('login', { error: 'Invalid email or password.' });
    }
    req.session.userId = user.id;
    res.redirect('/dashboard');
  })
);

app.post('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
});

// ---------- Dashboard ----------

app.get(
  '/dashboard',
  requireAuth,
  ah(async (req, res) => {
    const result = await pool.query(
      'SELECT * FROM invoices WHERE user_id = $1 ORDER BY due_date ASC',
      [req.session.userId]
    );

    const today = new Date();
    const enriched = result.rows.map((inv) => {
      const due = new Date(inv.due_date);
      const daysOverdue = inv.status === 'paid' ? 0 : Math.max(0, daysBetween(today, due));
      const suggestedStage = inv.status === 'paid' ? null : stageForDaysOverdue(daysOverdue);
      return { ...inv, amount: Number(inv.amount), daysOverdue, suggestedStage };
    });

    const outstanding = enriched
      .filter((i) => i.status !== 'paid')
      .reduce((sum, i) => sum + i.amount, 0);
    const overdueCount = enriched.filter((i) => i.status !== 'paid' && i.daysOverdue > 0).length;

    res.render('dashboard', { invoices: enriched, outstanding, overdueCount, STAGES });
  })
);

app.get('/invoices/new', requireAuth, (req, res) => res.render('new-invoice', { error: null, upsell: false }));

app.post(
  '/invoices/new',
  requireAuth,
  ah(async (req, res) => {
    const { client_name, client_email, invoice_number, amount, currency, due_date, payment_link } = req.body;
    if (!client_name || !client_email || !invoice_number || !amount || !due_date) {
      return res.render('new-invoice', { error: 'Please fill in all required fields.', upsell: false });
    }

    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    const user = userResult.rows[0];
    const countResult = await pool.query('SELECT COUNT(*) AS n FROM invoices WHERE user_id = $1', [
      req.session.userId,
    ]);
    const count = parseInt(countResult.rows[0].n, 10);
    if (user.subscription_status !== 'active' && count >= billing.FREE_INVOICE_LIMIT) {
      return res.render('new-invoice', {
        error: `You've reached the free plan limit (${billing.FREE_INVOICE_LIMIT} invoices). Upgrade to add more.`,
        upsell: true,
      });
    }

    await pool.query(
      `INSERT INTO invoices (user_id, client_name, client_email, invoice_number, amount, currency, due_date, payment_link)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        req.session.userId,
        client_name,
        client_email,
        invoice_number,
        parseFloat(amount),
        currency || 'USD',
        due_date,
        payment_link || '',
      ]
    );
    res.redirect('/dashboard');
  })
);

app.post(
  '/invoices/:id/mark-paid',
  requireAuth,
  ah(async (req, res) => {
    await pool.query('UPDATE invoices SET status = $1 WHERE id = $2 AND user_id = $3', [
      'paid',
      req.params.id,
      req.session.userId,
    ]);
    res.redirect('/dashboard');
  })
);

// ---------- Reminder drafting ----------

app.get(
  '/invoices/:id/reminder',
  requireAuth,
  ah(async (req, res) => {
    const invoiceResult = await pool.query('SELECT * FROM invoices WHERE id = $1 AND user_id = $2', [
      req.params.id,
      req.session.userId,
    ]);
    const invoice = invoiceResult.rows[0];
    if (!invoice) return res.status(404).send('Not found');
    invoice.amount = Number(invoice.amount);

    const businessResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    const business = businessResult.rows[0];
    const today = new Date();
    const daysOverdue = Math.max(0, daysBetween(today, new Date(invoice.due_date)));
    const stage = req.query.stage || stageForDaysOverdue(daysOverdue) || 'friendly';
    const email = draft(stage, invoice, business);

    res.render('reminder', { invoice, email, stage, STAGES });
  })
);

app.post(
  '/invoices/:id/reminder/log',
  requireAuth,
  ah(async (req, res) => {
    const { stage, subject, body } = req.body;
    await pool.query(
      'INSERT INTO reminders_sent (invoice_id, stage, subject, body) VALUES ($1, $2, $3, $4)',
      [req.params.id, stage, subject, body]
    );
    res.redirect('/dashboard');
  })
);

// ---------- Billing ----------

app.post(
  '/billing/checkout',
  requireAuth,
  ah(async (req, res) => {
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [req.session.userId]);
    const user = userResult.rows[0];
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
  })
);

// Stripe needs the raw body to verify the webhook signature, so this route
// gets its own raw-body middleware ahead of the global urlencoded parser.
app.post(
  '/billing/webhook',
  express.raw({ type: 'application/json' }),
  ah(async (req, res) => {
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
        await pool.query(
          'UPDATE users SET subscription_status = $1, stripe_customer_id = $2 WHERE id = $3',
          ['active', session.customer, userId]
        );
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      const sub = event.data.object;
      await pool.query("UPDATE users SET subscription_status = 'free' WHERE stripe_customer_id = $1", [
        sub.customer,
      ]);
    }

    res.json({ received: true });
  })
);

// Generic error handler — keeps a DB hiccup from ever showing a raw stack
// trace to a visitor.
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again in a moment.');
});

init()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Chasely running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
