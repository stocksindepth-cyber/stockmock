// ─── Unified Email Sender ─────────────────────────────────────────────────────
// sendEmail(type, to, props) — renders a React Email template, sends via
// Resend, and logs the result to Firestore collection `email_logs`.
//
// Supported types:
//   welcome | loginNotification | welcomePremium | invoice | marketUpdate | nudge
// ─────────────────────────────────────────────────────────────────────────────
import { render } from '@react-email/render';
import { getResendClient, FROM_ADDRESS } from './client.js';
import { getAdminFirestore } from '@/lib/firebase/admin';

// ── Subject lines ─────────────────────────────────────────────────────────────
const SUBJECTS = {
  welcome:           'Welcome to OptionsGyani — Your Options Edge Starts Now',
  loginNotification: 'New sign-in to your OptionsGyani account',
  welcomePremium:    "You're now OptionsGyani Pro — Let's make it count 🚀",
  invoice:           'Your OptionsGyani Invoice — Payment Confirmed ✓',
  nudge:             (props) => `You missed something on OptionsGyani, ${props.name || 'trader'}`,
  alert:             (props) => `🔔 ${props.symbol || 'NIFTY'} ${(props.metric || 'IVP').toUpperCase()} Alert — ${props.condition === 'above' ? 'crossed above' : 'dropped below'} ${props.threshold}`,
  // marketUpdate uses the subject prop passed in directly
};

// ── Template loader map ───────────────────────────────────────────────────────
const TEMPLATE_LOADERS = {
  welcome:           () => import('./templates/WelcomeEmail.jsx'),
  loginNotification: () => import('./templates/LoginNotificationEmail.jsx'),
  welcomePremium:    () => import('./templates/WelcomePremiumEmail.jsx'),
  invoice:           () => import('./templates/InvoiceEmail.jsx'),
  marketUpdate:      () => import('./templates/MarketUpdateEmail.jsx'),
  nudge:             () => import('./templates/NudgeEmail.jsx'),
  alert:             () => import('./templates/AlertEmail.jsx'),
};

/**
 * sendEmail(type, to, props)
 *
 * @param {string} type     - One of the supported email types above
 * @param {string} to       - Recipient email address
 * @param {object} props    - Template props (varies by type)
 * @returns {Promise<{ success: boolean, id?: string, error?: string }>}
 */
export async function sendEmail(type, to, props = {}) {
  if (!TEMPLATE_LOADERS[type]) {
    return { success: false, error: `Unknown email type: ${type}` };
  }

  // ── 1. Resolve subject ────────────────────────────────────────────────────
  let subject;
  if (type === 'marketUpdate') {
    subject = props.subject || 'OptionsGyani Market Update';
  } else if (type === 'alert') {
    subject = typeof SUBJECTS.alert === 'function' ? SUBJECTS.alert(props) : SUBJECTS.alert;
  } else if (typeof SUBJECTS[type] === 'function') {
    subject = SUBJECTS[type](props);
  } else {
    subject = SUBJECTS[type];
  }

  // ── 2. Load template & render to HTML ─────────────────────────────────────
  let html;
  try {
    const mod = await TEMPLATE_LOADERS[type]();
    // Templates export a default component
    const Template = mod.default;
    // @react-email/render returns a Promise<string> in node env
    html = await render(Template(props));
  } catch (renderErr) {
    console.error(`[Email] Render failed for type "${type}":`, renderErr.message);
    return { success: false, error: `Render failed: ${renderErr.message}` };
  }

  // ── 3. Send via Resend ────────────────────────────────────────────────────
  let resendId;
  let status = 'sent';
  let sendError;

  try {
    const { data, error } = await getResendClient().emails.send({
      from: FROM_ADDRESS,
      to,
      subject,
      html,
    });

    if (error) {
      status = 'failed';
      sendError = error.message || JSON.stringify(error);
      console.error(`[Email] Resend error for type "${type}" to ${to}:`, sendError);
    } else {
      resendId = data?.id;
    }
  } catch (sendErr) {
    status = 'failed';
    sendError = sendErr.message;
    console.error(`[Email] Send threw for type "${type}" to ${to}:`, sendErr.message);
  }

  // ── 4. Log to Firestore ───────────────────────────────────────────────────
  try {
    const db = getAdminFirestore();
    await db.collection('email_logs').add({
      to,
      type,
      subject,
      sentAt: new Date().toISOString(),
      status,
      resendId: resendId || null,
      ...(sendError ? { error: sendError } : {}),
    });
  } catch (logErr) {
    // Non-fatal — don't surface Firestore log failures to callers
    console.error('[Email] Firestore log failed:', logErr.message);
  }

  if (status === 'failed') {
    return { success: false, error: sendError };
  }

  return { success: true, id: resendId };
}
