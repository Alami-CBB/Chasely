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
];
