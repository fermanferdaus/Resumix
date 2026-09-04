import { errorResponse } from "../utils/response.js";

/**
 * Middleware: Role-Based Access Control (RBAC)
 * DNA Standard Ref: standar/stateless/express/server/middlewares/role.middleware.js
 *
 * Factory function untuk membatasi akses berdasarkan role pengguna.
 * Membutuhkan requireAuth terlebih dahulu agar req.user tersedia.
 */
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        `Akses ditolak. Rute ini hanya dapat diakses oleh peran ${roles.join(" atau ")}.`,
        null,
        403
      );
    }
    next();
  };

/**
 * Shortcut untuk role ADMIN
 */
export const isAdmin = requireRole("ADMIN");
