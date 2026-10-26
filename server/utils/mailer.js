import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } from "../config/env.js";

let transporter = null;
let usingEthereal = false;

async function getTransporter() {
  if (transporter) return transporter;
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
    return transporter;
  }
  try {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    usingEthereal = true;
    return transporter;
  } catch (err) {
    console.warn('[EMAIL WARN] Falling back to console logging. Reason:', err?.message || err);
    transporter = null;
    usingEthereal = false;
    return null;
  }
}

export async function sendMail(to, subject, text, html) {
  try {
    const t = await getTransporter();
    if (!t) {
      console.log("[DEV EMAIL] To:", to, "Subject:", subject, "Text:", text);
      return { mocked: true };
    }
    const from = (SMTP_FROM && SMTP_FROM.trim()) ? SMTP_FROM : SMTP_USER;
    const info = await t.sendMail({ from, to, subject, text, html });
    if (usingEthereal) {
      const url = nodemailer.getTestMessageUrl(info);
      if (url) console.log("[EMAIL PREVIEW]", url);
    }
    return info;
  } catch (err) {
    console.error("[EMAIL ERROR]", err?.message || err);
    throw err;
  }
}
