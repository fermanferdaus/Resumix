import { OAuth2Client } from "google-auth-library";
import { appConfig } from "../config/app.js";

const client = new OAuth2Client(appConfig.google.clientId);

/**
 * Verifikasi Google ID Token dan ekstrak payload pengguna
 */
export const verifyGoogleIdToken = async (idToken) => {
  // Mock mode — strictly gated: non-production (test/development) only + explicit opt-in or test env
  if (
    appConfig.nodeEnv !== "production" &&
    (appConfig.enableAuthMock || appConfig.nodeEnv === "test")
  ) {
    if (idToken.startsWith("mock_google_token_")) {
      const email = idToken.replace("mock_google_token_", "") || "google.user@example.com";
      return {
        email,
        fullName: "Google Demo User",
        googleId: `mock_gid_${Date.now()}`,
        avatarUrl: null,
      };
    }
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: appConfig.google.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.email_verified) {
      throw new Error("Token Google tidak valid atau email belum diverifikasi");
    }

    return {
      email: payload.email,
      fullName: payload.name || payload.given_name || "User",
      googleId: payload.sub,
      avatarUrl: payload.picture || null,
    };
  } catch (error) {
    throw new Error(`Verifikasi token Google gagal: ${error.message}`, { cause: error });
  }
};
