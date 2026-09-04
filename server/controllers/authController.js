import * as authService from "../services/authService.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { appConfig } from "../config/app.js";

/**
 * Set HTTP-Only Refresh Token Cookie
 */
const getRefreshTokenCookieOptions = () => ({
  httpOnly: true,
  secure: appConfig.isProduction,
  sameSite: appConfig.isProduction ? "strict" : "lax",
  maxAge: appConfig.jwt.refreshCookieMaxAge,
  path: "/api/v1/auth",
});

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("resumix_refresh_token", refreshToken, getRefreshTokenCookieOptions());
};

/**
 * POST /api/v1/auth/check-email
 */
export const checkEmail = async (req, res, _next) => {
  try {
    const { email } = req.body;
    const result = await authService.checkEmailAvailability(email);
    if (!result.isAvailable) {
      return errorResponse(res, result.message, null, 400);
    }
    return successResponse(res, result.message, { isAvailable: true });
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/auth/send-otp
 */
export const sendOtp = async (req, res, _next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestOtp(email);
    return successResponse(res, "Kode OTP berhasil dikirim ke email", {
      expiresAt: result.expiresAt,
    });
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/auth/verify-otp
 */
export const verifyOtp = async (req, res, _next) => {
  try {
    const { email, code } = req.body;
    const result = await authService.verifyOtp(email, code);

    setRefreshTokenCookie(res, result.session.refreshToken);
    return successResponse(res, "Verifikasi OTP & Login berhasil", {
      accessToken: result.session.accessToken,
      user: result.session.user,
    });
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/auth/register
 */
export const register = async (req, res, _next) => {
  try {
    const result = await authService.registerUser(req.body);
    return successResponse(
      res,
      "Pendaftaran berhasil. Kode verifikasi OTP telah dikirim ke email Anda.",
      {
        email: result.email,
        expiresAt: result.expiresAt,
      },
      201
    );
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (req, res, _next) => {
  try {
    const { email, password } = req.body;
    const session = await authService.loginWithPassword(email, password);
    setRefreshTokenCookie(res, session.refreshToken);

    return successResponse(res, "Login berhasil", {
      accessToken: session.accessToken,
      user: session.user,
    });
  } catch (error) {
    return errorResponse(res, error.message, null, 401);
  }
};

/**
 * POST /api/v1/auth/google
 */
export const googleAuth = async (req, res, _next) => {
  try {
    const { idToken } = req.body;
    const session = await authService.loginWithGoogle(idToken);
    setRefreshTokenCookie(res, session.refreshToken);

    return successResponse(res, "Autentikasi Google berhasil", {
      accessToken: session.accessToken,
      user: session.user,
    });
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/auth/refresh-token
 */
export const refreshToken = async (req, res, _next) => {
  try {
    const token = req.cookies?.resumix_refresh_token;
    const result = await authService.refreshSessionToken(token);

    // Set rotated refresh token cookie (RTR)
    if (result.refreshToken) {
      setRefreshTokenCookie(res, result.refreshToken);
    }

    return successResponse(res, "Token berhasil diperbarui", {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    return errorResponse(res, error.message, null, 401);
  }
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req, res, _next) => {
  try {
    const token = req.cookies?.resumix_refresh_token;
    await authService.revokeRefreshToken(token);

    res.clearCookie("resumix_refresh_token", {
      httpOnly: true,
      secure: appConfig.isProduction,
      sameSite: appConfig.isProduction ? "strict" : "lax",
      path: "/api/v1/auth",
    });
    return successResponse(res, "Logout berhasil", null);
  } catch (error) {
    _next(error);
  }
};

/**
 * GET /api/v1/auth/me
 */
export const getMe = async (req, res, _next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);
    return successResponse(res, "Data profil berhasil diambil", user);
  } catch (error) {
    _next(error);
  }
};

/**
 * POST /api/v1/auth/forgot-password
 */
export const forgotPassword = async (req, res, _next) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    return successResponse(
      res,
      "Tautan reset kata sandi telah dikirim ke email Anda. Silakan periksa kotak masuk.",
      result
    );
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};

/**
 * POST /api/v1/auth/reset-password
 */
export const resetPassword = async (req, res, _next) => {
  try {
    const { token, password } = req.body;
    await authService.resetPassword({ token, password });
    return successResponse(
      res,
      "Kata sandi Anda berhasil diperbarui. Silakan masuk menggunakan kata sandi baru.",
      null
    );
  } catch (error) {
    return errorResponse(res, error.message, null, 400);
  }
};
