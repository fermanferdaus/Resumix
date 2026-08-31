/**
 * Standardized API JSON Response
 * Format: { success: boolean, message: string, data: any, errors: null|array }
 */
export const successResponse = (res, message = "Success", data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    errors: null,
  });
};

export const errorResponse = (res, message = "Error occurred", errors = null, statusCode = 400) => {
  const formattedErrors = errors
    ? Array.isArray(errors)
      ? errors
      : [errors]
    : null;

  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors: formattedErrors,
  });
};
