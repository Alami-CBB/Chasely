# Chasely (working name) — automated invoice follow-up for freelancers

MVP built by Claude, September 2026. Freelancers/small agencies add unpaid
invoices, and the app drafts an escalating three-stage reminder email
(friendly → firm → final notice) with their payment link embedded, so they
don't have to write awkward "just following up" emails themselves.

## What's actually built (working, tested)

- Signup / login (sessions, hashed passwords)
- Add invoices, see them on a dashboard with an outstanding-balance summary
- Automatic overdue detection and stage suggestion based on days overdue
- Reminder email drafting for all three stages, with a one-click "open in
  your email app" action and a "mark as sent" log
- Public landing page (`/`) with pricing, and a blog (`/blog`) with two
  SEO-targeted articles written to rank for real freelancer search queries
- Freemium gate: 3 invoices free, then an upgrade prompt — matches the
  pattern that worked for Senja (a comparable indie micro-SaaS) in the
  research this was built from
- Stripe subscription billing, coded and tested end-to-end in fail-soft
  mode — the checkout button and webhook handler are fully wired, they
  just return a clear "not configured yet" message until STRIPE_SECRET_KEY
  and STRIPE_PRICE_ID exist. No code changes needed once you have them.
- SQLite storage — zero external dependencies to run locally

## What's NOT built yet (next phase)

- Real LLM-drafted reminders instead of the rule-based templates in
  `lib/reminders.js` (needs an Anthropic or OpenAI API key)
- Actual outbound email sending (currently opens the user's own email
  client — fine for MVP, limits scale)
- Password reset, multi-user teams, CSV import
- Distribution: submitting the two blog posts / the product itself to the
  places freelancers actually look (Google, Indie Hackers, Product Hunt,
  relevant subreddits) — this is the part the research flagged as
  mattering more than the product itself, and it's next once there's a
  live URL to point people at

## Running it locally

```
npm install
npm start        # http://localhost:3000
```

## One-time steps only you can legally do

These need your government ID / business identity — no AI can complete
KYC as you. Everything else (code, copy, content, deploys) I can keep
doing myself.

1. **Domain name** — a few dollars/year (Namecheap, Cloudflare, etc.)
2. **Hosting account** — Render, Railway, or Vercel (email signup is
   enough to start; a paid tier costs roughly $5–$20/month once it has
   real traffic)
3. **Stripe account** — required to actually charge Chasely's customers a
   subscription. This is the one that needs real KYC (ID, bank details).
4. *(Later, for the content-automation phase)* — a YouTube channel under
   your identity, enrolled in the Partner Program.

Once any of these exist, hand me the credentials/API keys the way you're
comfortable (a password manager share, env vars, etc.) and I'll wire them
in and keep building.
