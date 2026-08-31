import { errorResponse } from "../utils/response.js";

/**
 * Middleware untuk validasi request payload menggunakan Zod Schema
 */
export const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return errorResponse(res, "Validasi gagal", errors, 422);
    }
    req.body = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};
