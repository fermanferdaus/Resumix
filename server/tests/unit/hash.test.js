import { describe, it } from "node:test";
import assert from "node:assert";
import { hashPassword, comparePassword } from "../../utils/hash.js";

describe("Unit: Utility Hashing (Bcrypt)", () => {
  const plainPassword = "SecurePassword123!#";

  it("harus melakukan hashing kata sandi dengan Bcrypt salt rounds yang tepat", async () => {
    const hashed = await hashPassword(plainPassword);
    assert.strictEqual(typeof hashed, "string");
    assert(hashed.startsWith("$2b$") || hashed.startsWith("$2a$"), "Hash harus format Bcrypt");
    assert.notStrictEqual(hashed, plainPassword, "Hash tidak boleh sama dengan plaintext");
  });

  it("harus berhasil membandingkan kata sandi yang benar", async () => {
    const hashed = await hashPassword(plainPassword);
    const isValid = await comparePassword(plainPassword, hashed);
    assert.strictEqual(isValid, true, "Kata sandi yang benar harus mengembalikan true");
  });

  it("harus menolak kata sandi yang salah", async () => {
    const hashed = await hashPassword(plainPassword);
    const isValid = await comparePassword("WrongPassword123!", hashed);
    assert.strictEqual(isValid, false, "Kata sandi yang salah harus mengembalikan false");
  });
});
