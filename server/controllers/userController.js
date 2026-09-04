import * as userService from "../services/userService.js";
import { successResponse, errorResponse } from "../utils/response.js";

/**
 * GET /api/v1/users/profile
 */
export const getProfile = async (req, res, _next) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    return successResponse(res, "Data profil berhasil diambil", user);
  } catch (error) {
    return errorResponse(res, error.message, null, 404);
  }
};

/**
 * PUT /api/v1/users/profile
 */
export const updateProfile = async (req, res, _next) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user.id, req.body);
    return successResponse(res, "Profil berhasil diperbarui", updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/users/avatar
 */
export const uploadAvatar = async (req, res, _next) => {
  try {
    const result = await userService.uploadUserAvatar(req.user.id, req.body.image);
    return successResponse(res, "Foto profil berhasil diperbarui", result);
  } catch (error) {
    console.error("[AVATAR UPLOAD ERROR]", error);
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * DELETE /api/v1/users/avatar
 */
export const deleteAvatar = async (req, res, _next) => {
  try {
    const updatedUser = await userService.deleteUserAvatar(req.user.id);
    return successResponse(res, "Foto profil berhasil dihapus", updatedUser);
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};
