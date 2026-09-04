import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { appConfig } from "../config/app.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.resolve(__dirname, "../assets/logo.png");

/**
 * Buat Nodemailer Transporter
 */
const createTransporter = () => {
  if (!appConfig.mail.host || !appConfig.mail.user) {
    return null;
  }

  return nodemailer.createTransport({
    host: appConfig.mail.host,
    port: appConfig.mail.port,
    secure: appConfig.mail.secure,
    auth: {
      user: appConfig.mail.user,
      pass: appConfig.mail.pass,
    },
  });
};

/**
 * Template Email HTML Resumix Flat Theme
 */
const renderOtpTemplate = (code, expiresMinutes) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Resumix - Kode Verifikasi</title>
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fbf8ff; margin: 0; padding: 24px; color: #1a1b22; }
      .card { max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; padding: 32px; text-align: center; }
      .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #0f172a; }
      .desc { font-size: 14px; color: #5d5e61; line-height: 1.5; margin-bottom: 24px; }
      .otp-box { background: #f8fafc; border: 1px solid #1a1c1e; padding: 16px; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #af101a; display: inline-block; margin: 16px 0 24px 0; font-family: monospace; }
      .warning { font-size: 12px; color: #8f6f6c; margin-top: 20px; line-height: 1.4; border-top: 1px solid #eeedf7; padding-top: 16px; }
      .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div style="margin-bottom: 24px;">
        <img src="cid:resumix-logo" alt="Resumix" style="height: 38px; width: auto; display: inline-block; vertical-align: middle;" />
      </div>
      <div class="title">Verifikasi Akun Anda</div>
      <div class="desc">Gunakan kode One-Time Password (OTP) berikut untuk masuk atau menyelesaikan registrasi akun Anda di Resumix:</div>
      <div class="otp-box">${code}</div>
      <div class="desc">Kode ini berlaku selama <strong>${expiresMinutes} menit</strong>. Jangan bagikan kode ini kepada siapapun.</div>
      <div class="warning">Jika Anda tidak meminta kode ini, Anda dapat mengabaikan email ini dengan aman.</div>
      <div class="footer">© ${new Date().getFullYear()} Resumix ATS CV Builder</div>
    </div>
  </body>
  </html>
  `;
};

/**
 * Kirim email OTP
 */
export const sendOtpEmail = async ({ to, code, expiresMinutes = 5 }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[MAIL NOT CONFIGURED] SMTP belum dikonfigurasi. Kode OTP untuk ${to}: ${code}`);
    return { sent: false, provider: "console_fallback" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${appConfig.mail.fromName}" <${appConfig.mail.fromAddress}>`,
      to,
      subject: `${code} adalah kode verifikasi Resumix Anda`,
      text: `Kode verifikasi Resumix Anda adalah: ${code}. Berlaku selama ${expiresMinutes} menit.`,
      html: renderOtpTemplate(code, expiresMinutes),
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "resumix-logo",
        },
      ],
    });

    console.log(`[MAIL SENT] Email OTP terkirim ke ${to} (MessageID: ${info.messageId}) - Kode OTP: [${code}]`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAIL ERROR] Gagal mengirim email ke ${to}:`, error.message);
    return { sent: false, error: error.message };
  }
};

/**
 * Template Email HTML Reset Sandi Resumix Flat Theme
 */
const renderResetPasswordTemplate = (resetUrl, expiresMinutes) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Resumix - Reset Kata Sandi</title>
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fbf8ff; margin: 0; padding: 24px; color: #1a1b22; }
      .card { max-width: 480px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; padding: 32px; text-align: center; }
      .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #0f172a; }
      .desc { font-size: 14px; color: #5d5e61; line-height: 1.5; margin-bottom: 24px; }
      .btn { display: inline-block; background-color: #d32f2f; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-weight: bold; font-size: 14px; border: 1px solid #1a1c1e; margin: 12px 0 24px 0; }
      .link-box { word-break: break-all; font-size: 12px; color: #5d5e61; background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; margin-top: 16px; }
      .warning { font-size: 12px; color: #8f6f6c; margin-top: 24px; line-height: 1.4; border-top: 1px solid #eeedf7; padding-top: 16px; }
      .footer { margin-top: 24px; font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; }
    </style>
  </head>
  <body>
    <div class="card">
      <div style="margin-bottom: 24px;">
        <img src="cid:resumix-logo" alt="Resumix" style="height: 38px; width: auto; display: inline-block; vertical-align: middle;" />
      </div>
      <div class="title">Atur Ulang Kata Sandi</div>
      <div class="desc">Kami menerima permintaan untuk mereset kata sandi akun Resumix Anda. Klik tombol di bawah ini untuk membuat kata sandi baru:</div>
      <div>
        <a href="${resetUrl}" class="btn" target="_blank">Reset Kata Sandi</a>
      </div>
      <div class="desc">Tautan ini hanya berlaku selama <strong>${expiresMinutes} menit</strong>.</div>
      <div class="desc" style="font-size: 12px; margin-bottom: 4px;">Jika tombol di atas tidak berfungsi, salin dan buka tautan berikut di browser:</div>
      <div class="link-box">${resetUrl}</div>
      <div class="warning">Jika Anda tidak meminta pengaturan ulang kata sandi, abaikan email ini. Akun Anda tetap aman.</div>
      <div class="footer">© 2026 Resumix. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;
};
  
/**
 * Kirim email Reset Kata Sandi
 */
export const sendResetPasswordEmail = async ({ to, resetUrl, expiresMinutes = 15 }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log(`[MAIL NOT CONFIGURED] Reset URL untuk ${to}: ${resetUrl}`);
    return { sent: false, provider: "console_fallback" };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${appConfig.mail.fromName}" <${appConfig.mail.fromAddress}>`,
      to,
      subject: "Atur Ulang Kata Sandi Akun Resumix Anda",
      text: `Permintaan reset kata sandi akun Resumix Anda. Silakan buka tautan berikut: ${resetUrl}`,
      html: renderResetPasswordTemplate(resetUrl, expiresMinutes),
      attachments: [
        {
          filename: "logo.png",
          path: logoPath,
          cid: "resumix-logo",
        },
      ],
    });

    console.log(`[MAIL SENT] Email Reset Password terkirim ke ${to} (MessageID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAIL ERROR] Gagal mengirim email reset ke ${to}:`, error.message);
    return { sent: false, error: error.message };
  }
};
