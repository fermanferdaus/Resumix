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
 * Template Email HTML OTP Resumix (Soft Flat / ATS Blueprint Theme)
 */
const renderOtpTemplate = (code, expiresMinutes) => {
  const digits = String(code).split("");

  return `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resumix - Kode Verifikasi</title>
  </head>
  <body style="margin: 0; padding: 40px 16px; background-color: #fbf8ff; font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1a1b22;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0; border-collapse: separate;">
      <!-- Brand Logo Header -->
      <tr>
        <td style="padding: 32px 32px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <img src="${getLogoUrl()}" alt="Resumix" height="42" style="height: 42px; width: auto; max-width: 180px; display: inline-block; border: 0; outline: none;" />
        </td>
      </tr>
      <!-- Main Content -->
      <tr>
        <td style="padding: 32px 32px 28px; text-align: center;">
          <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.3px; line-height: 1.3;">Verifikasi Akun</h1>
          <p style="font-size: 14px; color: #5d5e61; line-height: 1.6; margin: 0 0 28px 0;">Gunakan 6 digit kode verifikasi berikut untuk menyelesaikan proses masuk di platform Resumix:</p>
          
          <!-- 6 Individual Square OTP Boxes (matches website .otp-box) -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="6" style="margin: 0 auto 24px auto;">
            <tr>
              ${digits.map((digit) => `
                <td style="width: 44px; height: 52px; text-align: center; vertical-align: middle; border: 1px solid #1a1c1e; background-color: #fbf8ff; font-family: 'JetBrains Mono', Consolas, 'Courier New', monospace; font-size: 24px; font-weight: 700; color: #1a1b22; border-radius: 0;">
                  ${digit}
                </td>
              `).join("")}
            </tr>
          </table>

          <p style="font-size: 13px; color: #5d5e61; line-height: 1.5; margin: 0 0 24px 0;">
            Kode verifikasi berlaku selama <strong style="color: #af101a; font-weight: 600;">${expiresMinutes} menit</strong>.
          </p>

          <div style="height: 1px; background-color: #e2e8f0; width: 100%; margin: 0 0 16px 0;"></div>
          <p style="font-size: 12px; color: #5d5e61; line-height: 1.5; margin: 0 0 8px 0; text-align: left;">
            Demi keamanan, jangan pernah membagikan kode ini kepada siapapun termasuk pihak Resumix. Jika Anda tidak meminta kode ini, abaikan pesan ini dengan aman.
          </p>
          <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin: 0; text-align: left;">
            Pesan ini dikirim secara otomatis oleh sistem, mohon untuk tidak membalas email ini (no-reply).
          </p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background-color: #fbf8ff; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #5d5e61; margin: 0; letter-spacing: 0.3px;">
            &copy; ${new Date().getFullYear()} Resumix. Platform Pembuat CV ATS Indonesia.
          </p>
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
      replyTo: appConfig.mail.replyTo,
      to,
      subject: `${code} adalah kode verifikasi Resumix Anda`,
      text: `Kode verifikasi Resumix Anda adalah: ${code}. Berlaku selama ${expiresMinutes} menit.\n\nJika Anda tidak meminta kode ini, abaikan email ini.\n\nPesan ini dikirim secara otomatis oleh sistem. Mohon jangan membalas email ini (no-reply).`,
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
 * Template Email HTML Reset Sandi Resumix (Soft Flat / ATS Blueprint Theme - Action Button Only)
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
  <body style="margin: 0; padding: 40px 16px; background-color: #fbf8ff; font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1a1b22;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 0; border-collapse: separate;">
      <!-- Brand Logo Header -->
      <tr>
        <td style="padding: 32px 32px 20px; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <img src="${getLogoUrl()}" alt="Resumix" height="42" style="height: 42px; width: auto; max-width: 180px; display: inline-block; border: 0; outline: none;" />
        </td>
      </tr>
      <!-- Main Content -->
      <tr>
        <td style="padding: 32px 32px 28px; text-align: center;">
          <h1 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.3px; line-height: 1.3;">Atur Ulang Kata Sandi</h1>
          <p style="font-size: 14px; color: #5d5e61; line-height: 1.6; margin: 0 0 28px 0;">Kami menerima permintaan untuk mengatur ulang kata sandi akun Resumix Anda. Silakan klik tombol di bawah ini untuk membuat kata sandi baru:</p>
          
          <!-- Flat Action Button Only -->
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 24px auto;">
            <tr>
              <td align="center" style="background-color: #af101a; border-radius: 0;">
                <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #af101a; color: #ffffff !important; font-family: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 600; text-decoration: none; padding: 13px 32px; border-radius: 0; border: 1px solid #af101a;">
                  Atur Ulang Kata Sandi
                </a>
              </td>
            </tr>
          </table>

          <p style="font-size: 13px; color: #5d5e61; line-height: 1.5; margin: 0 0 24px 0;">
            Tautan ini berlaku selama <strong style="color: #af101a; font-weight: 600;">${expiresMinutes} menit</strong>.
          </p>

          <div style="height: 1px; background-color: #e2e8f0; width: 100%; margin: 0 0 16px 0;"></div>
          <p style="font-size: 12px; color: #5d5e61; line-height: 1.5; margin: 0 0 8px 0; text-align: left;">
            Jika Anda tidak meminta pengaturan ulang kata sandi ini, abaikan email ini dengan aman. Akun Anda tetap terlindungi.
          </p>
          <p style="font-size: 11px; color: #94a3b8; line-height: 1.4; margin: 0; text-align: left;">
            Pesan ini dikirim secara otomatis oleh sistem, mohon untuk tidak membalas email ini (no-reply).
          </p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="background-color: #fbf8ff; padding: 16px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="font-size: 11px; color: #5d5e61; margin: 0; letter-spacing: 0.3px;">
            &copy; ${new Date().getFullYear()} Resumix. Platform Pembuat CV ATS Indonesia.
          </p>
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
      replyTo: appConfig.mail.replyTo,
      to,
      subject: "Atur Ulang Kata Sandi Akun Resumix Anda",
      text: `Permintaan reset kata sandi akun Resumix Anda. Silakan buka tautan berikut: ${resetUrl}\n\nTautan ini berlaku selama ${expiresMinutes} menit.\n\nPesan ini dikirim secara otomatis oleh sistem. Mohon jangan membalas email ini (no-reply).`,
      html: renderResetPasswordTemplate(resetUrl, expiresMinutes),
    });

    console.log(`[MAIL SENT] Email Reset Password terkirim ke ${to} (MessageID: ${info.messageId})`);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[MAIL ERROR] Gagal mengirim email reset ke ${to}:`, error.message);
    return { sent: false, error: error.message };
  }
};

export { renderOtpTemplate, renderResetPasswordTemplate };
