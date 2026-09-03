import { z } from "zod";

export const emailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
});

export const loginPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "Kode OTP harus 6 digit")
    .regex(/^\d+$/, "Kode OTP hanya boleh berisi angka"),
});

const strongPasswordRule = z
  .string()
  .min(8, "Kata sandi minimal 8 karakter")
  .max(100, "Kata sandi maksimal 100 karakter")
  .regex(/[A-Z]/, "Kata sandi harus mengandung setidaknya satu huruf besar (A-Z)")
  .regex(/[0-9]/, "Kata sandi harus mengandung setidaknya satu angka (0-9)")
  .regex(/[^A-Za-z0-9]/, "Kata sandi harus mengandung setidaknya satu karakter spesial (contoh: !@#$%^&*)");

export const completeProfileSchema = z
  .object({
    email: z.string().email(),
    fullName: z
      .string()
      .trim()
      .min(2, "Nama lengkap minimal 2 karakter")
      .max(100, "Nama lengkap maksimal 100 karakter"),
    password: strongPasswordRule,
    retypePassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Kata sandi dan konfirmasi kata sandi tidak cocok",
    path: ["retypePassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Format email tidak valid"),
});

export const resetPasswordSchema = z
  .object({
    password: strongPasswordRule,
    retypePassword: z.string().min(1, "Konfirmasi kata sandi wajib diisi"),
  })
  .refine((data) => data.password === data.retypePassword, {
    message: "Kata sandi dan konfirmasi kata sandi tidak cocok",
    path: ["retypePassword"],
  });
