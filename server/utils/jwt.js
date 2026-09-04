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
