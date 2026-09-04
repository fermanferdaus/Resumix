import { describe, it } from "node:test";
import assert from "node:assert";
import {
  base32Encode,
  base32Decode,
  generateBase32Secret,
  generateTotp,
  verifyTotp,
  generateOtpauthUrl,
  encryptSecret,
  decryptSecret,
  generateBackupCodes,
  verifyAndConsumeBackupCode,
} from "../../services/totpService.js";

describe("Unit: Google Authenticator (RFC 6238 TOTP)", () => {
  it("harus melakukan encode dan decode Base32 secara simetris", () => {
    const raw = Buffer.from("Halo Resumix Security 123", "utf8");
    const encoded = base32Encode(raw);
    const decoded = base32Decode(encoded);
    assert.strictEqual(decoded.toString("utf8"), "Halo Resumix Security 123");
  });

  it("harus memenuhi test vector resmi RFC 6238 untuk SHA1 TOTP", () => {
    // RFC 6238 Appendix B: Secret ASCII "12345678901234567890" in Base32 = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ"
    const secret = "GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ";

    // Counter = 1 (Time = 59s) -> Token = 287082
    assert.strictEqual(generateTotp(secret, 1), "287082");

    // Counter = 37037036 (Time = 1111111109s) -> Token = 081804
    assert.strictEqual(generateTotp(secret, 37037036), "081804");

    // Counter = 37037037 (Time = 1111111111s) -> Token = 050471
    assert.strictEqual(generateTotp(secret, 37037037), "050471");
  });

  it("harus memvalidasi kode TOTP aktif pada jendela saat ini", () => {
    const secret = generateBase32Secret(20);
    const currentCode = generateTotp(secret);
    assert.strictEqual(verifyTotp(currentCode, secret), true);
  });

  it("harus mentolerir pergeseran waktu (time-drift) ±30 detik", () => {
    const secret = generateBase32Secret(20);
    const currentCounter = Math.floor(Date.now() / 1000 / 30);

    const pastCode = generateTotp(secret, currentCounter - 1);
    const futureCode = generateTotp(secret, currentCounter + 1);
    const wayPastCode = generateTotp(secret, currentCounter - 3);

    assert.strictEqual(verifyTotp(pastCode, secret, 1), true);
    assert.strictEqual(verifyTotp(futureCode, secret, 1), true);
    assert.strictEqual(verifyTotp(wayPastCode, secret, 1), false);
  });

  it("harus menolak kode yang salah atau tidak berformat 6 digit angka", () => {
    const secret = generateBase32Secret(20);
    assert.strictEqual(verifyTotp("12345", secret), false);
    assert.strictEqual(verifyTotp("abcdef", secret), false);
    assert.strictEqual(verifyTotp("999999", secret), false);
    assert.strictEqual(verifyTotp("", secret), false);
  });

  it("harus mengenkripsi dan mendekripsi secret TOTP (AES-256-GCM)", () => {
    const secret = generateBase32Secret(20);
    const encrypted = encryptSecret(secret);
    assert.notStrictEqual(encrypted, secret);
    assert.ok(encrypted.includes(":"));

    const decrypted = decryptSecret(encrypted);
    assert.strictEqual(decrypted, secret);
  });

  it("harus mengonstruksi URI otpauth yang valid untuk Google Authenticator", () => {
    const secret = "JBSWY3DPEHPK3PXP";
    const uri = generateOtpauthUrl({
      secret,
      email: "admin@resumix.app",
      issuer: "Resumix",
    });

    assert.ok(uri.startsWith("otpauth://totp/Resumix:admin%40resumix.app?"));
    assert.ok(uri.includes("secret=JBSWY3DPEHPK3PXP"));
    assert.ok(uri.includes("issuer=Resumix"));
  });

  it("harus menghasilkan kode cadangan dan memproses konsumsi satu kali pakai", () => {
    const { plainCodes, hashedCodes } = generateBackupCodes(8);
    assert.strictEqual(plainCodes.length, 8);
    assert.strictEqual(hashedCodes.length, 8);

    const firstCode = plainCodes[0];
    const { valid, remainingHashedCodes } = verifyAndConsumeBackupCode(firstCode, hashedCodes);
    assert.strictEqual(valid, true);
    assert.strictEqual(remainingHashedCodes.length, 7);

    // Verifikasi pemakaian ulang kode yang sama harus gagal
    const secondTry = verifyAndConsumeBackupCode(firstCode, remainingHashedCodes);
    assert.strictEqual(secondTry.valid, false);
    assert.strictEqual(secondTry.remainingHashedCodes.length, 7);
  });
});
