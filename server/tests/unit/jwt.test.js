import { describe, it } from "node:test";
import assert from "node:assert";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../utils/jwt.js";

describe("Unit: JWT Token Generator & Verification", () => {
  const payload = {
    id: "018d9f10-1234-789a-bcde-f0123456789a",
    email: "test@resumix.app",
  };

  it("harus menghasilkan Access Token dan memvalidasi payloadnya", () => {
    const accessToken = generateAccessToken(payload);
    assert.strictEqual(typeof accessToken, "string");
    assert(accessToken.split(".").length === 3, "JWT harus memiliki 3 bagian (header.payload.sig)");

    const decoded = verifyAccessToken(accessToken);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.email, payload.email);
  });

  it("harus menghasilkan Refresh Token dan memvalidasi payloadnya", () => {
    const refreshToken = generateRefreshToken(payload);
    assert.strictEqual(typeof refreshToken, "string");
    assert(refreshToken.split(".").length === 3);

    const decoded = verifyRefreshToken(refreshToken);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.email, payload.email);
  });

  it("harus mengembalikan null jika token tidak valid", () => {
    const invalidToken = "invalid.token.structure";
    const decoded = verifyAccessToken(invalidToken);
    assert.strictEqual(decoded, null, "Token rusak harus mengembalikan null");
  });
});
