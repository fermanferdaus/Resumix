import { z } from "zod";

/**
 * Validasi MIME Type Gambar yang Diizinkan: JPEG, PNG, WEBP, JPG
 */
const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

/**
 * Skema Validasi Pembaruan Data Profil Pengguna
 */
export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Nama lengkap minimal 2 karakter")
    .max(100, "Nama lengkap maksimal 100 karakter")
    .optional(),
  phone: z
    .string()
    .trim()
    .max(30, "Nomor telepon maksimal 30 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
  dob: z
    .string()
    .optional()
    .nullable()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      const parsed = Date.parse(val);
      return !isNaN(parsed);
    }, "Format tanggal lahir tidak valid"),
  domicile: z
    .string()
    .trim()
    .max(150, "Domisili maksimal 150 karakter")
    .optional()
    .nullable()
    .or(z.literal("")),
});

/**
 * Skema Validasi Unggah Foto Profil (Base64 Cropped Image)
 * Memastikan HANYA file gambar (JPEG, PNG, WEBP) yang dapat diunggah
 */
export const uploadAvatarSchema = z.object({
  image: z
    .string({ required_error: "Data gambar wajib disertakan" })
    .min(10, "Data gambar tidak boleh kosong")
    .max(3500000, "Ukuran gambar maksimal 2.5MB")
    .refine((val) => {
      // Validasi prefix Data URL gambar
      const match = val.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
      if (!match) return false;
      const mimeType = match[1].toLowerCase();
      return ALLOWED_IMAGE_MIME_TYPES.includes(mimeType);
    }, "File yang diunggah harus berformat gambar valid (.jpg, .jpeg, .png, .webp)"),
});
