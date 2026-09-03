import { describe, it } from "node:test";
import assert from "node:assert";
import {
  checkEmailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
  resetPasswordSchema,
} from "../../validators/authValidator.js";

describe("Unit: Zod Authentication Validators", () => {
  describe("checkEmailSchema", () => {
    it("harus meloloskan email valid dan menormalisasinya menjadi lowercase", () => {
      const result = checkEmailSchema.safeParse({ email: " User.Test@Example.COM " });
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.email, "user.test@example.com");
    });

    it("harus menolak format email tidak valid", () => {
      const result = checkEmailSchema.safeParse({ email: "invalid-email" });
      assert.strictEqual(result.success, false);
    });
  });

  describe("sendOtpSchema", () => {
    it("harus meloloskan permintaan kirim OTP dengan email valid", () => {
      const result = sendOtpSchema.safeParse({ email: "user@example.com" });
      assert.strictEqual(result.success, true);
    });
  });

  describe("loginSchema", () => {
    it("harus meloloskan kredensial login yang lengkap", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "ValidPassword123!",
      });
      assert.strictEqual(result.success, true);
    });
  });

  describe("verifyOtpSchema", () => {
    it("harus meloloskan 6 digit angka OTP", () => {
      const result = verifyOtpSchema.safeParse({
        email: "test@resumix.app",
        code: "123456",
      });
      assert.strictEqual(result.success, true);
    });

    it("harus menolak OTP yang kurang dari 6 digit atau berisi huruf", () => {
      const result1 = verifyOtpSchema.safeParse({ email: "test@resumix.app", code: "123" });
      const result2 = verifyOtpSchema.safeParse({ email: "test@resumix.app", code: "12345a" });
      assert.strictEqual(result1.success, false);
      assert.strictEqual(result2.success, false);
    });
  });

  describe("registerSchema (Strong Password Rules)", () => {
    it("harus meloloskan kata sandi yang memenuhi aturan kuat (min 8, uppercase, angka, simbol)", () => {
      const result = registerSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "StrongPass123!",
        retypePassword: "StrongPass123!",
      });
      assert.strictEqual(result.success, true);
    });

    it("harus menolak kata sandi tanpa huruf besar", () => {
      const result = registerSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "strongpass123!",
        retypePassword: "strongpass123!",
      });
      assert.strictEqual(result.success, false);
    });

    it("harus menolak kata sandi tanpa angka", () => {
      const result = registerSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "StrongPassword!",
        retypePassword: "StrongPassword!",
      });
      assert.strictEqual(result.success, false);
    });

    it("harus menolak kata sandi tanpa karakter spesial", () => {
      const result = registerSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "StrongPassword123",
        retypePassword: "StrongPassword123",
      });
      assert.strictEqual(result.success, false);
    });

    it("harus menolak jika password dan retypePassword tidak cocok", () => {
      const result = registerSchema.safeParse({
        email: "alex@resumix.app",
        fullName: "Alex Davis",
        password: "StrongPass123!",
        retypePassword: "DifferentPass123!",
      });
      assert.strictEqual(result.success, false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("harus meloloskan reset password dengan token valid dan password kuat", () => {
      const result = resetPasswordSchema.safeParse({
        token: "1640acb6212145b5075bdb61986428cb",
        password: "NewPassword123#",
        retypePassword: "NewPassword123#",
      });
      assert.strictEqual(result.success, true);
    });
  });
});
