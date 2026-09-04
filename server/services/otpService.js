import crypto from "crypto";
import prisma from "../config/prisma.js";
import { generatePublicId } from "../utils/id.js";
import { appConfig } from "../config/app.js";

import { sendOtpEmail } from "./mailService.js";

/**
 * Service untuk Pengelolaan Kode OTP
 */
export const createAndSendOtp = async (email) => {
  // Generate 6 digit numeric code cryptographically secure
  const code = crypto.randomInt(100000, 1000000).toString();
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
  const expiresAt = new Date(Date.now() + appConfig.otp.expiresMinutes * 60 * 1000);

  // Invalidate previous active OTPs for this email
  await prisma.otp.updateMany({
    where: {
      email,
      isUsed: false,
    },
    data: {
      isUsed: true,
    },
  });

  // Create new OTP record (store SHA-256 hash)
  await prisma.otp.create({
    data: {
      publicId: generatePublicId(),
      email,
      code: hashedCode,
      expiresAt,
      isUsed: false,
      attempts: 0,
    },
  });

  // Kirim email OTP dengan kode asli (atau fallback jika SMTP belum diisi)
  await sendOtpEmail({
    to: email,
    code,
    expiresMinutes: appConfig.otp.expiresMinutes,
  });

  return {
    success: true,
    expiresAt,
  };
};

export const verifyOtpCode = async (email, code) => {
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  const otp = await prisma.otp.findFirst({
    where: {
      email,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!otp) {
    return {
      valid: false,
      message: "Kode OTP tidak valid atau telah kadaluarsa",
    };
  }

  // Brute-force protection: max 5 attempts
  if (otp.attempts >= 5) {
    await prisma.otp.update({
      where: { id: otp.id },
      data: { isUsed: true },
    });
    return {
      valid: false,
      message: "Terlalu banyak percobaan salah. Silakan minta kode OTP baru.",
    };
  }

  // Increment attempts counter
  await prisma.otp.update({
    where: { id: otp.id },
    data: { attempts: { increment: 1 } },
  });

  if (otp.code !== hashedCode) {
    const remaining = 4 - otp.attempts;
    return {
      valid: false,
      message: remaining > 0
        ? `Kode OTP tidak sesuai. Sisa percobaan: ${remaining}`
        : "Kode OTP salah. Batas percobaan habis, silakan minta kode baru.",
    };
  }

  // Mark OTP as used
  await prisma.otp.update({
    where: { id: otp.id },
    data: { isUsed: true },
  });

  return {
    valid: true,
    otp,
  };
};
