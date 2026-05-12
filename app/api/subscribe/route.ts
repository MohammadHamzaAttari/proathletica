import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { CONTACT_EMAIL, NEWSLETTER_FROM_NAME } from '@/lib/config';
import { recordSubscriber } from '@/lib/db';

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * FIX (Audit #05-10 + #03-G):
 * - Honeypot field checked server-side (silently drops bots)
 * - Real Resend welcome email instead of mock SMTP
 * - ConvertKit sync when keys present
 * - Amazon affiliate links must NOT appear in emails (compliance)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const source = String(body.source || 'inline');

    // FIX (Audit #05-10): honeypot check — if filled, it's a bot; return 200 silently
    const hp = String(body.hp || body._hp || '');
    if (hp) return NextResponse.json({ ok: true });

    if (!isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const saved = await recordSubscriber(email, source);

    // Optional ConvertKit sync
    if (process.env.CONVERTKIT_API_KEY && process.env.CONVERTKIT_FORM_ID) {
      await fetch(
        `https://api.convertkit.com/v3/forms/${process.env.CONVERTKIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: process.env.CONVERTKIT_API_KEY, email }),
        }
      ).catch((err) => console.error('[subscribe] ConvertKit sync failed:', err));
    }

    // FIX (Audit #03-G): send real welcome email via Resend (NOT mock SMTP).
    // Note: welcome email contains NO affiliate links (Amazon TOS compliance).
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails
        .send({
          from: `${NEWSLETTER_FROM_NAME} <${CONTACT_EMAIL}>`,
          to: email,
          subject: `Welcome to ${NEWSLETTER_FROM_NAME}`,
          html: `
            <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px">
              <h1 style="font-size:28px;margin-bottom:12px">Welcome to ${NEWSLETTER_FROM_NAME}</h1>
              <p style="color:#444;line-height:1.6">You're on the list for weekly gear shortlists, buyer guides, and lab notes.</p>
              <p style="color:#444;line-height:1.6">We'll keep it useful, concise, and easy to unsubscribe from at any time.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0"/>
              <p style="color:#999;font-size:12px">
                You subscribed via ${source}. To unsubscribe, reply with "unsubscribe" in the subject line.
              </p>
            </div>
          `,
        })
        .catch((err) => console.error('[subscribe] Resend welcome email failed:', err));
    }

    return NextResponse.json({ ok: true, reason: 'reason' in saved ? saved.reason || null : null });
  } catch (error) {
    console.error('[subscribe]', error);
    return NextResponse.json({ ok: false, error: 'Server error.' }, { status: 500 });
  }
}
