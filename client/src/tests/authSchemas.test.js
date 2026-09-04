import { describe, it } from "node:test";
import assert from "node:assert";
import {
  emailSchema,
  completeProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  twoFactorVerifySchema,
} from "../validators/authSchemas.js";

describe("Frontend Unit: Zod Client Validation Schemas", () => {
  describe("emailSchema & forgotPasswordSchema", () => {
    it("harus menormalisasi email ke lowercase dan memangkas spasi", () => {
      const result = emailSchema.safeParse({ email: " John.Doe@Example.COM " });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.email, "john.doe@example.com");
    });

    it("harus menolak string non-email", () => {
      const result = forgotPasswordSchema.safeParse({ email: "bukan_email" });
      assert.strictEqual(result.success, false);
    });
  });

  describe("completeProfileSchema", () => {
    it("harus memvalidasi kata sandi kuat pada form registrasi", () => {
      const valid = completeProfileSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "StrongPass123!",
        retypePassword: "StrongPass123!",
      });
      assert.strictEqual(valid.success, true);
    });

    it("harus menolak kata sandi yang kurang dari 8 karakter", () => {
      const invalid = completeProfileSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "Pass1!",
        retypePassword: "Pass1!",
      });
      assert.strictEqual(invalid.success, false);
    });

    it("harus menolak kata sandi tanpa karakter spesial", () => {
      const invalid = completeProfileSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "Password12345",
        retypePassword: "Password12345",
      });
      assert.strictEqual(invalid.success, false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("harus memvalidasi kecocokan password baru dan konfirmasi", () => {
      const valid = resetPasswordSchema.safeParse({
        password: "NewPassword123#",
        retypePassword: "NewPassword123#",
      });
      assert.strictEqual(valid.success, true);
    });

    it("harus gagal jika password dan konfirmasi tidak cocok", () => {
      const invalid = resetPasswordSchema.safeParse({
        password: "NewPassword123#",
        retypePassword: "Different123#",
      });
      assert.strictEqual(invalid.success, false);
    });
  });

  describe("twoFactorVerifySchema", () => {
    it("harus memvalidasi kode TOTP 6 digit", () => {
      const valid = twoFactorVerifySchema.safeParse({ token: "123456" });
      assert.strictEqual(valid.success, true);
    });

    it("harus memvalidasi kode pemulihan format backup code", () => {
      const valid = twoFactorVerifySchema.safeParse({ token: "A1B2-C3D4" });
      assert.strictEqual(valid.success, true);
    });

    it("harus menolak input yang kurang dari 6 karakter", () => {
      const invalid = twoFactorVerifySchema.safeParse({ token: "12345" });
      assert.strictEqual(invalid.success, false);
    });
  });
});
