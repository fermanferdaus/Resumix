import { z } from "zod";

export const createResumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul resume tidak boleh kosong." })
    .max(100, { message: "Judul resume maksimal 100 karakter." }),
  targetRole: z
    .string()
    .trim()
    .max(100, { message: "Posisi target maksimal 100 karakter." })
    .optional()
    .nullable(),
});

export const updateResumeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Judul resume tidak boleh kosong." })
    .max(100, { message: "Judul resume maksimal 100 karakter." })
    .optional(),
  targetRole: z
    .string()
    .trim()
    .max(100, { message: "Posisi target maksimal 100 karakter." })
    .optional()
    .nullable(),
  data: z.any().optional(),
});

export const queryResumeSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
