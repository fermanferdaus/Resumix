import { errorResponse } from "../utils/response.js";

/**
 * Middleware untuk validasi request payload menggunakan Zod Schema
 */
export const validate = (schema, source = "body") => (req, res, next) => {
  try {
    const parsed = schema.safeParse(req[source]);
    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return errorResponse(res, "Validasi gagal", errors, 422);
    }
    req[source] = parsed.data;
    next();
  } catch (error) {
    next(error);
  }
};
