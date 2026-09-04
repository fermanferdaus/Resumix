import jwt from "jsonwebtoken";
import { appConfig } from "../config/app.js";

/**
 * Generate Access Token (Short-lived)
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, appConfig.jwt.accessSecret, {
    expiresIn: appConfig.jwt.accessExpiresIn,
    algorithm: "HS256",
  });
};

/**
 * Generate Refresh Token (Long-lived)
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, appConfig.jwt.refreshSecret, {
    expiresIn: appConfig.jwt.refreshExpiresIn,
    algorithm: "HS256",
  });
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, appConfig.jwt.accessSecret, {
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, appConfig.jwt.refreshSecret, {
      algorithms: ["HS256"],
    });
  } catch {
    return null;
  }
};

/**
 * Generate 2FA Challenge Token (Short-lived 5 minutes)
 */
export const generate2faToken = (payload) => {
  return jwt.sign({ ...payload, purpose: "2fa_challenge" }, appConfig.jwt.accessSecret, {
    expiresIn: "5m",
    algorithm: "HS256",
  });
};

/**
 * Verify 2FA Challenge Token
 */
export const verify2faToken = (token) => {
  try {
    const decoded = jwt.verify(token, appConfig.jwt.accessSecret, {
      algorithms: ["HS256"],
    });
    if (decoded?.purpose !== "2fa_challenge") return null;
    return decoded;
  } catch {
    return null;
  }
};

