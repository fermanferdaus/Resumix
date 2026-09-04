import fs from "fs/promises";
import path from "path";
import prisma from "../config/prisma.js";

/**
 * Lazy-load sharp untuk memastikan native binary tidak menghambat boot server
 */
let sharpModule = null;
const getSharp = async () => {
  if (!sharpModule) {
    const mod = await import("sharp");
    sharpModule = mod.default || mod;
  }
  return sharpModule;
};

/**
 * Format user response publik
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
 * Ambil data profil pengguna berdasarkan publicId
 */
export const getUserProfile = async (publicId) => {
  const user = await prisma.user.findUnique({
    where: { publicId },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan");
  }

  return formatUserResponse(user);
};

/**
 * Perbarui informasi biodata profil pengguna
 */
export const updateUserProfile = async (publicId, data) => {
  const user = await prisma.user.findUnique({
    where: { publicId },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan");
  }

  const updatePayload = {};
  if (data.fullName !== undefined) updatePayload.fullName = data.fullName.trim();
  if (data.phone !== undefined) updatePayload.phone = data.phone ? data.phone.trim() : null;
  if (data.dob !== undefined) updatePayload.dob = data.dob ? new Date(data.dob) : null;
  if (data.domicile !== undefined) updatePayload.domicile = data.domicile ? data.domicile.trim() : null;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updatePayload,
  });

  return formatUserResponse(updatedUser);
};

/**
 * Hapus berkas avatar lokal lama jika ada
 */
const removeOldAvatarFile = async (avatarUrl) => {
  if (!avatarUrl || !avatarUrl.startsWith("/uploads/avatars/")) return;

  try {
    const filename = path.basename(avatarUrl);
    const filePath = path.join(process.cwd(), "public", "uploads", "avatars", filename);
    await fs.unlink(filePath);
  } catch {
    // Abaikan jika file lama sudah tidak ada
  }
};

/**
 * Unggah, Kompresi, dan Konversi Foto Profil ke Format .webp
 */
export const uploadUserAvatar = async (publicId, base64Image) => {
  const user = await prisma.user.findUnique({
    where: { publicId },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan");
  }

  // Parse Base64 buffer
  const matches = base64Image.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("Format data gambar base64 tidak valid");
  }

  const rawBuffer = Buffer.from(matches[2], "base64");

  // Kompresi ketat menggunakan sharp: Resize cover 400x400 dan konversi ke .webp kualitas 80
  const sharp = await getSharp();
  const compressedBuffer = await sharp(rawBuffer)
    .resize(400, 400, { fit: "cover", position: "center" })
    .webp({ quality: 80, effort: 4 })
    .toBuffer();

  // Hapus foto lama pengguna jika sebelumnya sudah pernah upload
  if (user.avatarUrl) {
    await removeOldAvatarFile(user.avatarUrl);
  }

  // Simpan berkas webp terkompresi
  const filename = `avatar-${user.publicId}-${Date.now()}.webp`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, compressedBuffer);

  const avatarUrl = `/uploads/avatars/${filename}`;

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl },
  });

  return {
    avatarUrl,
    user: formatUserResponse(updatedUser),
  };
};

/**
 * Hapus Foto Profil Pengguna
 */
export const deleteUserAvatar = async (publicId) => {
  const user = await prisma.user.findUnique({
    where: { publicId },
  });

  if (!user) {
    throw new Error("Pengguna tidak ditemukan");
  }

  if (user.avatarUrl) {
    await removeOldAvatarFile(user.avatarUrl);
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { avatarUrl: null },
  });

  return formatUserResponse(updatedUser);
};
