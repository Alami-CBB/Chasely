// Content-marketing articles. Plain HTML strings (no markdown dependency)
// so they render straight through the blog-post view. Written for SEO —
// each targets a real, specific search query a freelancer would type.

module.exports = [
  {
    slug: 'how-long-to-wait-before-sending-a-payment-reminder',
    title: 'How Long to Wait Before Sending a Payment Reminder (With Templates)',
    description:
      'A stage-by-stage timeline for chasing unpaid invoices without sounding desperate or damaging the client relationship.',
    body: `
      <p>Most freelancers wait too long to send the first reminder, then send a second one that's identical in tone to the first — which is why it gets ignored too. The fix isn't sending more reminders. It's changing what each one says as the invoice ages.</p>

      <h2>The three-stage timeline that actually works</h2>
      <p><strong>Day 3 after the due date — the friendly nudge.</strong> Most late payments aren't a dispute; they're an invoice that slipped through someone's inbox. Assume good faith. Keep it short, mention the invoice number and amount, and make paying frictionless by including the payment link directly in the email.</p>
      <p><strong>Day 10 — the firm follow-up.</strong> If two weeks pass with no response, the tone shifts from "just checking" to asking directly for a date. Ask when you can expect payment, and give them an easy out to flag a problem if there is one — clients who are actually stuck (budget approval, a change of contact) will usually tell you at this stage if you ask directly.</p>
      <p><strong>Day 21 — the final notice.</strong> By three weeks, silence after two prior reminders is itself information. This message should state plainly that it's a final notice, reference your contract terms (late fees, pausing further work), and ask for a same-day response. This is also the point to stop doing further work for that client until it's resolved.</p>

      <h2>Why the escalation matters more than the wording</h2>
      <p>A single well-written reminder sent three times reads as passive-aggressive by the third send. An escalating sequence reads as organized — because it is. Clients who intend to pay respond to the structure; clients who don't intend to pay reveal that by stage three, which is useful information on its own.</p>

      <h2>What actually gets invoices paid faster</h2>
      <p>Two things move the needle more than clever phrasing: sending the first reminder on a fixed schedule instead of "whenever you remember," and putting a one-click payment link in every message so paying takes fewer steps than replying to explain why they haven't. If chasing invoices is eating an afternoon a month, that's the part worth automating first.</p>
    `,
  },
  {
    slug: 'what-to-do-when-a-client-ignores-your-invoice',
    title: "What to Do When a Client Won't Respond to Your Invoice",
    description:
      'A practical decision tree for freelancers dealing with a client who has gone silent on an unpaid invoice.',
    body: `
      <p>Silence is worse than a dispute, because there's nothing to negotiate with. Before assuming the worst, it helps to separate the two things that look identical from the outside: a client who forgot, and a client who's avoiding you.</p>

      <h2>First, rule out the boring explanation</h2>
      <p>Check whether the invoice actually reached the right inbox and the right person — accounts payable at even small companies is often a different contact than the person who hired you. A surprising number of "ignored" invoices were never seen by anyone who could approve payment.</p>

      <h2>If it's genuinely gone quiet</h2>
      <p>Move the channel. An email that's been ignored twice rarely gets read a third time — a short, direct message on whatever channel you used during the actual project (a call, a text, a LinkedIn message) breaks the pattern and often gets a faster response than another email.</p>

      <h2>Set a real deadline, in writing</h2>
      <p>Vague follow-ups invite vague responses. State a specific date by which you need payment or a written explanation, and what happens after — a late fee if your contract has one, or pausing any further deliverables. A deadline with a stated consequence gets answered far more often than an open-ended "please let me know."</p>

      <h2>When to stop being polite</h2>
      <p>If three structured reminders and a channel switch produce nothing, continuing to be patient stops being professional and starts being a signal that the invoice isn't a priority for you either. At that point, a formal final notice referencing your contract terms — and, for larger amounts, mentioning that you're prepared to escalate to collections or small claims — is the appropriate next step, not an aggressive one.</p>

      <h2>The real fix is upstream</h2>
      <p>Clients who ghost on invoices are disproportionately clients who didn't sign a clear contract with payment terms up front. The single highest-leverage change most freelancers can make isn't a better reminder email — it's requiring a deposit before starting and a signed scope with a due date before delivering.</p>
    `,
  },
  {
    slug: 'late-payment-fees-for-freelancers',
    title: 'Late Payment Fees for Freelancers: How Much to Charge and How to Word It',
    description:
      'What percentage or flat fee to charge for late invoices, and the exact wording that gets it taken seriously instead of ignored.',
    body: `
      <p>A late fee only works if two things are true: the client agreed to it before the work started, and the wording in your reminder makes it sound like a stated policy rather than a threat you came up with on the spot. Get those two things right and most clients pay before the fee ever kicks in — that's the actual point of having one.</p>

      <h2>How much is normal</h2>
      <p>Most freelancers land in one of two structures. A flat monthly late fee — commonly 1.5% to 2% of the invoice total per month overdue — is simple to calculate and easy for a client to understand at a glance. Alternatively, a flat dollar fee (often $25–$50, or higher on larger invoices) is common for smaller recurring work where a percentage would round down to almost nothing. Percentage-based fees scale better on larger invoices; flat fees are easier to state without doing math in the email.</p>

      <h2>It has to be in the contract first</h2>
      <p>A late fee mentioned for the first time in a reminder email reads as improvised, and in some jurisdictions isn't enforceable if it wasn't agreed to up front. The fix is a single line in your contract or statement of work — something like "Invoices unpaid after 30 days accrue a 1.5% monthly late fee" — signed before the project starts. Once that line exists, referencing it later isn't a threat, it's a citation.</p>

      <h2>How to word it in the reminder itself</h2>
      <p>The wording that works is calm and specific, not stern. Reference the contract clause by name, state the exact fee that applies, and give a date it takes effect if it hasn't already: "Per our agreement, invoices unpaid after 30 days accrue a 1.5% monthly late fee — this would apply starting [date] if the balance is still outstanding." That's a statement of fact, not an escalation, which is exactly why it tends to get faster responses than a message with no fee mentioned at all.</p>

      <h2>Whether to actually enforce it</h2>
      <p>For a client who pays a few days after the fee technically kicks in, most freelancers waive it — the fee's job is to change behavior before the deadline, not to generate extra revenue. Save actual enforcement for clients who are well past the deadline with no communication; at that point, applying it and stating the new total is a reasonable next step, not a punitive one.</p>
    `,
  },
  {
    slug: 'best-time-to-send-invoices',
    title: 'The Best Time to Send Invoices (And Why It Changes How Fast You Get Paid)',
    description:
      'When to send an invoice — and when to send the first reminder — to get paid faster, based on how accounts-payable schedules actually work.',
    body: `
      <p>Two invoices for identical work, sent one week apart, can get paid weeks apart — not because of anything in the invoice itself, but because of when they landed relative to how the client's business actually pays its bills.</p>

      <h2>Match your invoice to their payment run</h2>
      <p>Most small and mid-size companies don't pay invoices the moment they arrive — they run payments in batches, often weekly or on fixed dates like the 1st and 15th. An invoice that arrives the day after a payment run has to wait for the next one; the same invoice sent two days earlier could get paid a week sooner. If you don't know a client's cycle, ask once — "when do you usually run payments?" is a completely normal question and the answer tells you exactly when to send future invoices.</p>

      <h2>Send on delivery, not at month-end</h2>
      <p>Batching all your invoicing for the end of the month feels efficient but works against you — it means every invoice starts its payment clock at the same time, all competing for the same payment run, and any one client's slow month delays all of them together. Sending each invoice the moment the related work is delivered starts the clock immediately and spreads your cash flow more evenly across the month instead of bunching it at the end.</p>

      <h2>Avoid Fridays and pre-holiday sends</h2>
      <p>An invoice that lands Friday afternoon sits unread until Monday at best — and if Monday is a holiday, until Tuesday. Tuesday through Thursday mornings consistently get faster opens and faster payment approvals, simply because that's when accounts-payable staff are actually working through their inbox rather than clearing it before a break.</p>

      <h2>The same logic applies to reminders</h2>
      <p>A reminder sent on the same predictable weekday each time — rather than "whenever you notice it's late" — starts to read as a routine rather than a one-off chase, and routines get handled faster than surprises. Picking one day (say, every Tuesday) to review what's overdue and send that week's reminders is a small habit that compounds into getting paid measurably faster over a year of invoicing.</p>
    `,
  },
];
