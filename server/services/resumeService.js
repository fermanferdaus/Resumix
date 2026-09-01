import prisma from "../config/prisma.js";
import { generatePublicId } from "../utils/id.js";

/**
 * Default ATS Resume JSON Schema sesuai PRD.md Section 7
 */
export const getDefaultResumeData = (user = {}, targetRole = "") => ({
  header: {
    fullName: user.fullName || "",
    targetRole: targetRole || "",
    email: user.email || "",
    phone: "",
    website: "",
    location: "",
  },
  summary: "",
  educations: [],
  experiences: [],
  organizations: [],
  certifications: [],
  skills: {
    hardSkills: [],
    softSkills: [],
  },
});

const resolveInternalUserId = async (userIdentifier) => {
  if (typeof userIdentifier === "bigint") return userIdentifier;
  if (typeof userIdentifier === "number") return BigInt(userIdentifier);
  if (typeof userIdentifier === "string" && /^\d+$/.test(userIdentifier)) {
    return BigInt(userIdentifier);
  }
  const user = await prisma.user.findUnique({
    where: { publicId: String(userIdentifier) },
    select: { id: true },
  });
  if (!user) {
    const error = new Error("Pengguna tidak ditemukan.");
    error.statusCode = 404;
    throw error;
  }
  return user.id;
};

/**
 * Mengambil daftar resume milik pengguna dengan pencarian dan paginasi
 */
export const listResumes = async (userIdentifier, { search = "", page = 1, limit = 10 }) => {
  const userId = await resolveInternalUserId(userIdentifier);
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { targetRole: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [total, items] = await Promise.all([
    prisma.resume.count({ where }),
    prisma.resume.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
      select: {
        publicId: true,
        title: true,
        targetRole: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    items: items.map((item) => ({
      id: item.publicId,
      title: item.title,
      targetRole: item.targetRole,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

/**
 * Membuat resume baru dengan data default
 */
export const createResume = async (userIdentifier, { title, targetRole }, userDetails = {}) => {
  const userId = await resolveInternalUserId(userIdentifier);
  const publicId = generatePublicId();
  const initialData = getDefaultResumeData(userDetails, targetRole);

  const newResume = await prisma.resume.create({
    data: {
      publicId,
      userId,
      title: title || "Resume Tanpa Judul",
      targetRole: targetRole || null,
      data: initialData,
    },
  });

  return {
    id: newResume.publicId,
    title: newResume.title,
    targetRole: newResume.targetRole,
    data: newResume.data,
    createdAt: newResume.createdAt,
    updatedAt: newResume.updatedAt,
  };
};

/**
 * Mengambil detail resume berdasarkan publicId
 */
export const getResumeByPublicId = async (userIdentifier, publicId) => {
  const userId = await resolveInternalUserId(userIdentifier);
  const resume = await prisma.resume.findFirst({
    where: {
      publicId,
      userId,
    },
  });

  if (!resume) {
    const error = new Error("Resume tidak ditemukan atau Anda tidak memiliki akses.");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: resume.publicId,
    title: resume.title,
    targetRole: resume.targetRole,
    data: resume.data,
    createdAt: resume.createdAt,
    updatedAt: resume.updatedAt,
  };
};

/**
 * Memperbarui resume
 */
export const updateResume = async (userIdentifier, publicId, { title, targetRole, data }) => {
  const userId = await resolveInternalUserId(userIdentifier);
  const existing = await prisma.resume.findFirst({
    where: {
      publicId,
      userId,
    },
  });

  if (!existing) {
    const error = new Error("Resume tidak ditemukan.");
    error.statusCode = 404;
    throw error;
  }

  const updated = await prisma.resume.update({
    where: { id: existing.id },
    data: {
      ...(title !== undefined && { title }),
      ...(targetRole !== undefined && { targetRole }),
      ...(data !== undefined && { data }),
    },
  });

  return {
    id: updated.publicId,
    title: updated.title,
    targetRole: updated.targetRole,
    data: updated.data,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  };
};

/**
 * Menduplikasi resume
 */
export const duplicateResume = async (userIdentifier, publicId) => {
  const userId = await resolveInternalUserId(userIdentifier);
  const original = await prisma.resume.findFirst({
    where: {
      publicId,
      userId,
    },
  });

  if (!original) {
    const error = new Error("Resume yang akan diduplikasi tidak ditemukan.");
    error.statusCode = 404;
    throw error;
  }

  const newPublicId = generatePublicId();
  const duplicated = await prisma.resume.create({
    data: {
      publicId: newPublicId,
      userId,
      title: `${original.title} (Salinan)`,
      targetRole: original.targetRole,
      data: original.data || {},
    },
  });

  return {
    id: duplicated.publicId,
    title: duplicated.title,
    targetRole: duplicated.targetRole,
    createdAt: duplicated.createdAt,
    updatedAt: duplicated.updatedAt,
  };
};

/**
 * Menghapus resume
 */
export const deleteResume = async (userIdentifier, publicId) => {
  const userId = await resolveInternalUserId(userIdentifier);
  const existing = await prisma.resume.findFirst({
    where: {
      publicId,
      userId,
    },
  });

  if (!existing) {
    const error = new Error("Resume tidak ditemukan.");
    error.statusCode = 404;
    throw error;
  }

  await prisma.resume.delete({
    where: { id: existing.id },
  });

  return true;
};
