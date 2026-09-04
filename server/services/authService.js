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
  fullName: user.fullName || "",
  phone: user.phone || "",
  dob: user.dob ? user.dob.toISOString().split("T")[0] : null,
  domicile: user.domicile || "",
  isVerified: user.isVerified,
  avatarUrl: user.avatarUrl || null,
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

  // Simpan refresh token (hash SHA-256) ke database
  const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + appConfig.jwt.refreshCookieMaxAge);
  await prisma.refreshToken.create({
    data: {
      publicId: generatePublicId(),
      userId: user.id,
      token: hashedRefreshToken,
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

  if (existingUser && (existingUser.password || existingUser.isVerified)) {
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
    throw new Error("Email tidak ditemukan atau belum terdaftar.");
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

  if (existingUser && (existingUser.password || existingUser.isVerified)) {
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

  if (!user || !user.password) {
    throw new Error("Email atau kata sandi yang Anda masukkan salah.");
  }

  if (!user.isVerified) {
    const error = new Error("Email belum diverifikasi. Silakan verifikasi kode OTP Anda terlebih dahulu.");
    error.statusCode = 403;
    throw error;
  }

  const isMatch = await comparePassword(password, user.password);
  if (!isMatch) {
    throw new Error("Email atau kata sandi yang Anda masukkan salah.");
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
  const hashedRefreshToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

  // Cek token di database (mendukung token JWT terenkripsi SHA-256 maupun direct token)
  const tokenRecord = await prisma.refreshToken.findFirst({
    where: {
      OR: [
        { token: hashedRefreshToken },
        { token: refreshToken },
      ],
    },
    include: {
      user: true,
    },
  });

  if (!tokenRecord || !tokenRecord.user) {
    throw new Error("Refresh token tidak valid atau tidak terdaftar");
  }

  if (!decoded && tokenRecord.token !== refreshToken) {
    throw new Error("Refresh token tidak valid atau telah kadaluarsa");
  }

  // Reuse detection: jika token sudah pernah direvoke, batalkan SEMUA token user (breach response)
  if (tokenRecord.isRevoked) {
    await prisma.refreshToken.updateMany({
      where: { userId: tokenRecord.userId },
      data: { isRevoked: true },
    });
    throw new Error("Sesi tidak valid terdeteksi. Silakan masuk kembali.");
  }

  if (tokenRecord.expiresAt <= new Date()) {
    throw new Error("Refresh token telah kadaluarsa");
  }

  // Invalidate current refresh token (RTR)
  await prisma.refreshToken.update({
    where: { id: tokenRecord.id },
    data: { isRevoked: true },
  });

  // Issue new access token & new refresh token
  const tokenPayload = {
    id: tokenRecord.user.publicId,
    email: tokenRecord.user.email,
  };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken({
    ...tokenPayload,
    tokenId: generatePublicId(),
  });

  const newHashedToken = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + appConfig.jwt.refreshCookieMaxAge);

  await prisma.refreshToken.create({
    data: {
      publicId: generatePublicId(),
      userId: tokenRecord.userId,
      token: newHashedToken,
      expiresAt,
      isRevoked: false,
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: formatUserResponse(tokenRecord.user),
  };
};

/**
 * Logout & Revoke Refresh Token
 */
export const revokeRefreshToken = async (refreshToken) => {
  if (!refreshToken) return;

  const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await prisma.refreshToken.updateMany({
    where: {
      OR: [
        { token: hashedToken },
        { token: refreshToken },
      ],
    },
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
    return {
      email: normalizedEmail,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    };
  }

  // Generate secure token 32-byte hex & hash SHA-256 for DB storage
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  const expiresMinutes = 15;
  const expiresAt = new Date(Date.now() + expiresMinutes * 60 * 1000);

  // Invalidate previous active reset tokens for this email
  await prisma.passwordReset.updateMany({
    where: { email: normalizedEmail, isUsed: false },
    data: { isUsed: true },
  });

  // Save new hashed reset token to DB
  await prisma.passwordReset.create({
    data: {
      publicId: generatePublicId(),
      email: normalizedEmail,
      token: hashedToken,
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

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      OR: [
        { token: hashedToken },
        { token },
      ],
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

  // Revoke semua sesi refresh token aktif pengguna (P0-2)
  await prisma.refreshToken.updateMany({
    where: { userId: user.id, isRevoked: false },
    data: { isRevoked: true },
  });

  return { success: true };
};
