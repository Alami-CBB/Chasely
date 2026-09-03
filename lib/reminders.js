// Reminder email generator.
//
// MVP version: rule-based templates that escalate tone across three stages.
// TODO (post-launch): swap `draft()` to call an LLM (Anthropic/OpenAI) with
// the same stage/context inputs for more natural, situation-aware phrasing.
// Needs an API key supplied via .env — see README.

const STAGES = {
  friendly: {
    label: 'Friendly nudge',
    daysFromDue: 3,
  },
  firm: {
    label: 'Firm follow-up',
    daysFromDue: 10,
  },
  final: {
    label: 'Final notice',
    daysFromDue: 21,
  },
};

function money(amount, currency) {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function draft(stage, invoice, business) {
  const amt = money(invoice.amount, invoice.currency);
  const payLine = invoice.payment_link
    ? `\n\nYou can pay securely here: ${invoice.payment_link}`
    : '';

  if (stage === 'friendly') {
    return {
      subject: `Quick reminder — invoice ${invoice.invoice_number} (${amt})`,
      body:
        `Hi ${invoice.client_name},\n\n` +
        `Just a friendly heads up that invoice ${invoice.invoice_number} for ${amt} ` +
        `was due on ${invoice.due_date}. It's possible this simply slipped through — ` +
        `no worries if so.${payLine}\n\n` +
        `Let me know if you have any questions about it.\n\n` +
        `Thanks,\n${business.business_name}`,
    };
  }

  if (stage === 'firm') {
    return {
      subject: `Following up: invoice ${invoice.invoice_number} is now overdue`,
      body:
        `Hi ${invoice.client_name},\n\n` +
        `I wanted to follow up on invoice ${invoice.invoice_number} for ${amt}, ` +
        `which was due on ${invoice.due_date} and is still outstanding. ` +
        `Could you let me know when I can expect payment, or flag it if there's an issue on your end?${payLine}\n\n` +
        `I'd appreciate getting this resolved this week.\n\n` +
        `Thanks,\n${business.business_name}`,
    };
  }

  // final
  return {
    subject: `Final notice — invoice ${invoice.invoice_number} (${amt}) significantly overdue`,
    body:
      `Hi ${invoice.client_name},\n\n` +
      `Invoice ${invoice.invoice_number} for ${amt} (due ${invoice.due_date}) remains unpaid ` +
      `despite two earlier reminders. This is a final notice before I need to consider ` +
      `next steps, including pausing further work and potential late fees per the agreed terms.${payLine}\n\n` +
      `I'd much rather resolve this directly — please reach out today.\n\n` +
      `${business.business_name}`,
  };
}

function stageForDaysOverdue(daysOverdue) {
  if (daysOverdue >= STAGES.final.daysFromDue) return 'final';
  if (daysOverdue >= STAGES.firm.daysFromDue) return 'firm';
  if (daysOverdue >= STAGES.friendly.daysFromDue) return 'friendly';
  return null;
}

module.exports = { draft, stageForDaysOverdue, STAGES };
