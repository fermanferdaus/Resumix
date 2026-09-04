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

export const resumeDataSchema = z
  .object({
    header: z.record(z.any()).optional(),
    summary: z.string().max(5000, "Ringkasan profesional maksimal 5000 karakter").optional(),
    educations: z.array(z.record(z.any())).max(30, "Maksimal 30 riwayat pendidikan").optional(),
    experiences: z.array(z.record(z.any())).max(30, "Maksimal 30 riwayat pekerjaan").optional(),
    organizations: z.array(z.record(z.any())).max(30, "Maksimal 30 riwayat organisasi").optional(),
    certifications: z.array(z.record(z.any())).max(30, "Maksimal 30 sertifikasi").optional(),
    skills: z
      .object({
        hardSkills: z.array(z.any()).max(100, "Maksimal 100 hard skills").optional(),
        softSkills: z.array(z.any()).max(100, "Maksimal 100 soft skills").optional(),
      })
      .passthrough()
      .optional(),
    sectionOrder: z.array(z.string()).max(20).optional(),
  })
  .passthrough();

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
  data: resumeDataSchema.optional(),
});

export const resumeParamSchema = z.object({
  id: z.string().trim().uuid("Format ID resume harus berupa UUID yang valid"),
});

export const queryResumeSchema = z.object({
  search: z.string().trim().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
