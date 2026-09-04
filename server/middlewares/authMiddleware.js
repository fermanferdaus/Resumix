import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";
import prisma from "../config/prisma.js";

/**
 * Middleware untuk memproteksi route dengan Bearer JWT
 */
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse(res, "Akses ditolak. Token tidak disediakan", null, 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    if (!decoded || !decoded.id) {
      return errorResponse(res, "Sesi tidak valid atau telah kadaluarsa", null, 401);
    }

    const user = await prisma.user.findUnique({
      where: { publicId: decoded.id },
    });

    if (!user) {
      return errorResponse(res, "User tidak ditemukan", null, 401);
    }

    if (!user.isVerified) {
      return errorResponse(res, "Akun belum diverifikasi. Silakan verifikasi email Anda terlebih dahulu.", null, 403);
    }

    req.user = {
      id: user.publicId,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      isVerified: user.isVerified,
      avatarUrl: user.avatarUrl,
      _internalId: user.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};
