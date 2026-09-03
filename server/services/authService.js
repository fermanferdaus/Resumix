import crypto from "crypto";
import prisma from "../config/prisma.js";
import { generatePublicId } from "../utils/id.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import { createAndSendOtp, verifyOtpCode } from "./otpService.js";
import { sendResetPasswordEmail } from "./mailService.js";
import { verifyGoogleIdToken } from "./googleAuthService.js";
import { appConfig } from "../config/app.js";

/**
 * Format user output (menampilkan public_id sebagai id publik dan menyembunyikan id internal / password)
 */
export const formatUserResponse = (user) => ({
  id: user.publicId,
  email: user.email,
  fullName: user.fullName,
  isVerified: user.isVerified,
  avatarUrl: user.avatarUrl,
  createdAt: user.createdAt,
});

/**
 * Buat session token (Access Token & simpan Refresh Token ke DB)
 */
const createAuthSession = async (user) => {
  const tokenPayload = {
    id: user.publicId,
    email: user.email,
  };

  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken({
    ...tokenPayload,
    tokenId: generatePublicId(),
  });

  // Simpan refresh token ke database
  const expiresAt = new Date(Date.now() + appConfig.jwt.refreshCookieMaxAge);
  await prisma.refreshToken.create({
    data: {
      publicId: generatePublicId(),
      userId: user.id,
      token: refreshToken,
      expiresAt,
      isRevoked: false,
    },
  });

  return {
    accessToken,
    refreshToken,
    user: formatUserResponse(user),
  };
};

/**
 * Cek Ketersediaan Email
 */
export const checkEmailAvailability = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser && existingUser.password) {
    return {
      isAvailable: false,
      message: "Email ini sudah terdaftar. Silakan masuk menggunakan kata sandi atau OTP.",
    };
  }

  return {
    isAvailable: true,
    message: "Email dapat digunakan untuk pendaftaran.",
  };
};

/**
 * Request pengiriman OTP (Mode Masuk OTP)
 */
export const requestOtp = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || (!user.password && !user.isVerified)) {
    throw new Error("Email ini belum terdaftar. Silakan daftar terlebih dahulu.");
  }

  return await createAndSendOtp(normalizedEmail);
};

/**
 * Verifikasi kode OTP & Login
 */
export const verifyOtp = async (email, code) => {
  const normalizedEmail = email.toLowerCase().trim();
  const result = await verifyOtpCode(normalizedEmail, code);
  if (!result.valid) {
    throw new Error(result.message);
  }

  // Cari user
  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    // Buat akun baru jika login via OTP pertama kali
    user = await prisma.user.create({
      data: {
        publicId: generatePublicId(),
        email: normalizedEmail,
        isVerified: true,
      },
    });
  } else if (!user.isVerified) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });
  }

  const session = await createAuthSession(user);
  return {
    isRegistered: true,
    session,
  };
};

/**
 * Registrasi Akun Baru (Simpan Data Profil & Langsung Kirim Kode OTP)
 */
export const registerUser = async ({ email, fullName, password }) => {
  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser && existingUser.password) {
    throw new Error("Email ini sudah terdaftar. Silakan masuk.");
  }

  const hashedPassword = await hashPassword(password);
  let user;

  if (existingUser) {
    user = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        fullName,
        password: hashedPassword,
        isVerified: false,
      },
    });
  } else {
    user = await prisma.user.create({
      data: {
        publicId: generatePublicId(),
        email: normalizedEmail,
        fullName,
        password: hashedPassword,
        isVerified: false,
      },
    });
  }

  // Kirimkan kode OTP untuk verifikasi akun
  const otpResult = await createAndSendOtp(normalizedEmail);

  return {
    email: user.email,
    publicId: user.publicId,
    expiresAt: otpResult.expiresAt,
  };
};

/**
 * Login dengan Email & Password
 */
export const loginWithPassword = async (email, password) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Email ini belum terdaftar. Silakan daftar terlebih dahulu.");
  }

  if (!user.password) {
    throw new Error("Akun ini terdaftar tanpa kata sandi. Silakan masuk menggunakan Google atau OTP.");
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Kata sandi yang Anda masukkan salah.");
  }

  return await createAuthSession(user);
};

/**
 * Login / Register via Google OAuth
 */
export const loginWithGoogle = async (idToken) => {
  const googlePayload = await verifyGoogleIdToken(idToken);
  const { email, fullName, googleId, avatarUrl } = googlePayload;
  const normalizedEmail = email.toLowerCase().trim();

  let user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (user) {
    // Update data google jika belum tertaut
    user = await prisma.user.update({
      where: { id: user.id },
      data: {
        googleId: user.googleId || googleId,
        avatarUrl: user.avatarUrl || avatarUrl,
        fullName: user.fullName || fullName,
        isVerified: true,
      },
    });
  } else {
    // Buat user baru dari data Google
    user = await prisma.user.create({
      data: {
        publicId: generatePublicId(),
        email,
        fullName,
        googleId,
        avatarUrl,
        isVerified: true,
      },
    });
  }

  return await createAuthSession(user);
};

/**
 * Refresh Access Token menggunakan Refresh Token
 */
export const refreshSessionToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token tidak disediakan");
  }

  const decoded = verifyRefreshToken(refreshToken);
  if (!decoded || !decoded.id) {
    throw new Error("Refresh token tidak valid atau telah kadaluarsa");
  }

  // Cek token di database
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      token: refreshToken,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    include: {
      user: true,
    },
  });

  if (!tokenRecord || !tokenRecord.user) {
    throw new Error("Refresh token telah dibatalkan atau tidak terdaftar");
  }

  // Issue new access token
  const newAccessToken = generateAccessToken({
    id: tokenRecord.user.publicId,
    email: tokenRecord.user.email,
  });

  return {
    accessToken: newAccessToken,
    user: formatUserResponse(tokenRecord.user),
  };
};

/**
 * Logout & Revoke Refresh Token
 */
export const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data: { isRevoked: true },
  });
};

/**
 * Ambil Profil Pengguna
 */
export const getUserProfile = async (publicId) => {
  const user = await prisma.user.findUnique({
    where: { publicId },
  });

  if (!user) {
    throw new Error("User tidak ditemukan");
  }

  return formatUserResponse(user);
};

/**
 * Request Reset Kata Sandi (Kirim Tautan Email)
 */
export const requestPasswordReset = async (email) => {
  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Email ini belum terdaftar. Silakan daftar terlebih dahulu.");
  }

  // Generate secure token 32-byte hex
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiresMinutes = 15;
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  // Invalidate previous active reset tokens for this email
  await prisma.passwordReset.updateMany({
    where: { email: normalizedEmail, isUsed: false },
    data: { isUsed: true },
  });

  // Save new reset token to DB
  await prisma.passwordReset.create({
    data: {
      publicId: generatePublicId(),
      email: normalizedEmail,
      token: resetToken,
      expiresAt,
      isUsed: false,
    },
  });

  // Build Reset URL for frontend via Config Abstraction (Format path param bersih: /reset-password/:token)
  const resetUrl = `${appConfig.clientUrl}/reset-password/${resetToken}`;

  // Dispatch Email
  await sendResetPasswordEmail({
    to: normalizedEmail,
    resetUrl,
    expiresMinutes,
  });

  return {
    email: normalizedEmail,
    expiresAt,
  };
};

/**
 * Reset Kata Sandi Baru
 */
export const resetPassword = async ({ token, password }) => {
  if (!prisma.passwordReset) {
    throw new Error(
      "Modul database PasswordReset belum dimuat. Harap matikan server backend (Ctrl+C), jalankan 'npx prisma generate', lalu jalankan 'npm run dev'."
    );
  }

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      token,
      isUsed: false,
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  if (!resetRecord) {
    throw new Error("Tautan reset kata sandi tidak valid atau telah kadaluarsa.");
  }

  const user = await prisma.user.findUnique({
    where: { email: resetRecord.email },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan.");
  }

  const hashedPassword = await hashPassword(password);

  // Update password pengguna dan set isVerified true
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      isVerified: true,
    },
  });

  // Mark token as used
  await prisma.passwordReset.update({
    where: { id: resetRecord.id },
    data: { isUsed: true },
  });

  return { success: true };
};
