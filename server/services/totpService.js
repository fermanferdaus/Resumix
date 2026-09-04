import crypto from "node:crypto";
import QRCode from "qrcode";
import { appConfig } from "../config/app.js";

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
 * Encode Buffer to Base32 String (RFC 4648)
 * @param {Buffer} buffer
 * @returns {string}
 */
export const base32Encode = (buffer) => {
  let bits = "";
  for (let i = 0; i < buffer.length; i++) {
    bits += buffer[i].toString(2).padStart(8, "0");
  }

  let base32 = "";
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, "0");
    const index = parseInt(chunk, 2);
    base32 += BASE32_ALPHABET[index];
  }

  return base32;
};

/**
 * Decode Base32 String to Buffer (RFC 4648)
 * @param {string} base32
 * @returns {Buffer}
 */
export const base32Decode = (base32) => {
  const cleaned = (base32 || "").toUpperCase().replace(/[\s=-]/g, "");
  let bits = "";

  for (let i = 0; i < cleaned.length; i++) {
    const val = BASE32_ALPHABET.indexOf(cleaned[i]);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }

  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }

  return Buffer.from(bytes);
};

/**
 * Generate a cryptographically secure random Base32 secret
 * @param {number} length Number of random bytes (default 20 = 160 bits)
 * @returns {string} Base32 Secret
 */
export const generateBase32Secret = (length = 20) => {
  const bytes = crypto.randomBytes(length);
  return base32Encode(bytes);
};

/**
 * Generate 6-digit TOTP Token (RFC 6238)
 * @param {string} secret Base32 Secret
 * @param {number} counter Time step counter (default current 30s step)
 * @returns {string} 6-digit TOTP
 */
export const generateTotp = (secret, counter = Math.floor(Date.now() / 1000 / 30)) => {
  const key = base32Decode(secret);
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64BE(BigInt(counter));

  const hmac = crypto.createHmac("sha1", key).update(buf).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 1000000;

  return code.toString().padStart(6, "0");
};

/**
 * Verify TOTP Token with time-drift window (RFC 6238)
 * @param {string} token 6-digit user input
 * @param {string} secret Base32 Secret
 * @param {number} window Time steps to check before and after (default 1 = ±30s)
 * @returns {boolean}
 */
export const verifyTotp = (token, secret, window = 1) => {
  if (!token || typeof token !== "string" || !secret) return false;
  const cleanedToken = token.trim();
  if (!/^\d{6}$/.test(cleanedToken)) return false;

  const currentCounter = Math.floor(Date.now() / 1000 / 30);
  const tokenBuf = Buffer.from(cleanedToken);

  for (let step = currentCounter - window; step <= currentCounter + window; step++) {
    const validCode = generateTotp(secret, step);
    const validBuf = Buffer.from(validCode);
    if (crypto.timingSafeEqual(validBuf, tokenBuf)) {
      return true;
    }
  }

  return false;
};

/**
 * Generate Google Authenticator otpauth URI
 * @param {Object} options
 * @param {string} options.secret Base32 Secret
 * @param {string} options.email Account email
 * @param {string} [options.issuer="Resumix"] Issuer name
 * @returns {string}
 */
export const generateOtpauthUrl = ({ secret, email, issuer = "Resumix" }) => {
  const encIssuer = encodeURIComponent(issuer);
  const encEmail = encodeURIComponent(email);
  return `otpauth://totp/${encIssuer}:${encEmail}?secret=${secret}&issuer=${encIssuer}&algorithm=SHA1&digits=6&period=30`;
};

/**
 * Generate QR Code as Data URL from otpauth URI
 * @param {string} otpauthUrl
 * @returns {Promise<string>} Data URL (data:image/png;base64,...)
 */
export const generateQrCode = async (otpauthUrl) => {
  return await QRCode.toDataURL(otpauthUrl, {
    width: 256,
    margin: 2,
    color: {
      dark: "#0f172a",
      light: "#ffffff",
    },
  });
};

/**
 * Derive 256-bit encryption key from JWT secret
 */
const getEncryptionKey = () => {
  const secret = appConfig.jwt.accessSecret || "fallback-insecure-key-do-not-use-in-prod";
  return crypto.createHash("sha256").update(secret).digest();
};

/**
 * Symmetric Encryption (AES-256-GCM) for TOTP secret at rest
 * @param {string} plainText
 * @returns {string} iv:tag:ciphertext in hex
 */
export const encryptSecret = (plainText) => {
  if (!plainText) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  const tag = cipher.getAuthTag();

  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
};

/**
 * Symmetric Decryption (AES-256-GCM) for TOTP secret
 * @param {string} cipherPayload iv:tag:ciphertext in hex
 * @returns {string} Decrypted Base32 Secret
 */
export const decryptSecret = (cipherPayload) => {
  if (!cipherPayload) return null;
  const parts = cipherPayload.split(":");
  if (parts.length !== 3) {
    return cipherPayload;
  }

  const [ivHex, tagHex, encryptedHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

/**
 * Generate 8 Backup Recovery Codes (XXXX-XXXX)
 * @param {number} count Default 8 codes
 * @returns {{ plainCodes: string[], hashedCodes: string[] }}
 */
export const generateBackupCodes = (count = 8) => {
  const plainCodes = [];
  const hashedCodes = [];

  for (let i = 0; i < count; i++) {
    const raw = crypto.randomBytes(4).toString("hex").toUpperCase();
    const code = `${raw.slice(0, 4)}-${raw.slice(4, 8)}`;
    plainCodes.push(code);

    const hash = crypto.createHash("sha256").update(code).digest("hex");
    hashedCodes.push(hash);
  }

  return { plainCodes, hashedCodes };
};

/**
 * Verify and consume a single-use backup code
 * @param {string} inputCode
 * @param {string[]} hashedCodesArray
 * @returns {{ valid: boolean, remainingHashedCodes: string[] }}
 */
export const verifyAndConsumeBackupCode = (inputCode, hashedCodesArray = []) => {
  if (!inputCode || !Array.isArray(hashedCodesArray)) {
    return { valid: false, remainingHashedCodes: hashedCodesArray };
  }

  const normalized = inputCode.trim().toUpperCase();
  const inputHash = crypto.createHash("sha256").update(normalized).digest("hex");

  const index = hashedCodesArray.findIndex((h) => h === inputHash);
  if (index === -1) {
    return { valid: false, remainingHashedCodes: hashedCodesArray };
  }

  const remainingHashedCodes = [...hashedCodesArray];
  remainingHashedCodes.splice(index, 1);

  return { valid: true, remainingHashedCodes };
};
