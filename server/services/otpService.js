import prisma from "../config/prisma.js";
import { generatePublicId } from "../utils/id.js";
import { appConfig } from "../config/app.js";

import { sendOtpEmail } from "./mailService.js";

/**
 * Service untuk Pengelolaan Kode OTP
 */
export const createAndSendOtp = async (email) => {
  // Generate 6 digit numeric code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
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

  // Create new OTP record
  await prisma.otp.create({
    data: {
      publicId: generatePublicId(),
      email,
      code,
      expiresAt,
      isUsed: false,
    },
  });

  // Kirim email OTP (atau fallback ke console log jika SMTP belum diisi)
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
  const otp = await prisma.otp.findFirst({
    where: {
      email,
      code,
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
