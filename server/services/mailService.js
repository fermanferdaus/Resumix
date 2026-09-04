import nodemailer from "nodemailer";
import { appConfig } from "../config/app.js";

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
 * URL Logo Publik dari Konfigurasi (.env Abstraction)
 */
const getLogoUrl = () => appConfig.mail.logoUrl;

/**
 * Template Email HTML OTP Resumix (Professional Card Theme)
 */
const renderOtpTemplate = (code, expiresMinutes) => {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumix - Kode Verifikasi</title>
  </head>
  <body style="margin: 0; padding: 36px 16px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <tr>
        <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <img src="${getLogoUrl()}" alt="Resumix" height="40" style="height: 40px; width: auto; max-width: 160px; display: inline-block; border: 0;" />
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 32px 28px; text-align: center;">
          <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.2px;">Verifikasi Keamanan Akun</h1>
          <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 28px 0;">Gunakan kode One-Time Password (OTP) berikut untuk menyelesaikan verifikasi akun Resumix Anda:</p>
          
          <div style="background-color: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 10px; padding: 18px 24px; display: inline-block; margin: 0 auto 24px auto;">
            <span style="font-family: 'SF Pro Display', Consolas, 'Courier New', monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #dc2626; margin-left: 8px;">${code}</span>
          </div>

          <div style="margin-bottom: 24px;">
            <span style="background-color: #fef2f2; color: #991b1b; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 20px; display: inline-block;">⏱ Berlaku selama ${expiresMinutes} menit</span>
          </div>

          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; padding-top: 16px; border-top: 1px solid #f1f5f9;">Demi keamanan, jangan pernah membagikan kode ini kepada siapapun. Jika Anda tidak merasa meminta kode ini, abaikan pesan ini dengan aman.</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 11px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">© ${new Date().getFullYear()} Resumix ATS CV Builder. All rights reserved.</p>
        </td>
      </tr>
    </table>
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
      text: `Kode verifikasi Resumix Anda adalah: ${code}. Berlaku selama ${expiresMinutes} menit.\n\nJika Anda tidak meminta kode ini, abaikan email ini.`,
      html: renderOtpTemplate(code, expiresMinutes),
    });

    console.log(`[MAIL SENT] Email OTP terkirim ke ${to} (MessageID: ${info.messageId}) - Kode OTP: [${code}]`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAIL ERROR] Gagal mengirim email ke ${to}:`, error.message);
    return { sent: false, error: error.message };
  }
};

/**
 * Template Email HTML Reset Sandi Resumix (Professional Card Theme - Action Button Only)
 */
const renderResetPasswordTemplate = (resetUrl, expiresMinutes) => {
  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumix - Reset Kata Sandi</title>
  </head>
  <body style="margin: 0; padding: 36px 16px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <tr>
        <td style="padding: 32px 32px 24px; text-align: center; border-bottom: 1px solid #f1f5f9;">
          <img src="${getLogoUrl()}" alt="Resumix" height="40" style="height: 40px; width: auto; max-width: 160px; display: inline-block; border: 0;" />
        </td>
      </tr>
      <tr>
        <td style="padding: 32px 32px 28px; text-align: center;">
          <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.2px;">Atur Ulang Kata Sandi</h1>
          <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 28px 0;">Kami menerima permintaan untuk mengatur ulang kata sandi akun Resumix Anda. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
          
          <div style="margin: 0 auto 24px auto;">
            <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #dc2626; color: #ffffff !important; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 36px; border-radius: 8px; box-shadow: 0 2px 4px rgba(220, 38, 38, 0.25);">Atur Ulang Kata Sandi</a>
          </div>

          <div style="margin-bottom: 24px;">
            <span style="background-color: #fef2f2; color: #991b1b; font-size: 13px; font-weight: 600; padding: 6px 14px; border-radius: 20px; display: inline-block;">⏱ Tautan berlaku selama ${expiresMinutes} menit</span>
          </div>

          <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; padding-top: 16px; border-top: 1px solid #f1f5f9;">Jika Anda tidak meminta pengaturan ulang kata sandi ini, abaikan email ini dengan aman. Akun Anda tetap terlindungi.</p>
        </td>
      </tr>
      <tr>
        <td style="background-color: #f8fafc; padding: 16px 32px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="font-size: 11px; color: #94a3b8; margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">© ${new Date().getFullYear()} Resumix ATS CV Builder. All rights reserved.</p>
        </td>
      </tr>
    </table>
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
    });

    console.log(`[MAIL SENT] Email Reset Password terkirim ke ${to} (MessageID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAIL ERROR] Gagal mengirim email reset ke ${to}:`, error.message);
    return { sent: false, error: error.message };
  }
};
