import { describe, it } from "node:test";
import assert from "node:assert";

describe("Frontend Unit: User Profile Logic & Helpers", () => {
  const formatIndonesianDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getAvatarFullUrl = (avatarUrl, apiBaseUrl = "http://localhost:3000/api/v1") => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
      return avatarUrl;
    }
    const base = apiBaseUrl.replace(/\/api\/v1\/?$/, "");
    return `${base}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
  };

  const isAllowedImageFile = (fileType) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    return allowed.includes(fileType.toLowerCase());
  };

  describe("Format Tanggal Indonesia untuk Biodata", () => {
    it("harus memformat tanggal ISO '1995-01-15' menjadi tanggal Indonesia yang benar", () => {
      const formatted = formatIndonesianDate("1995-01-15");
      assert(
        formatted.includes("15") && formatted.includes("1995"),
        "Harus mengandung hari 15 dan tahun 1995"
      );
    });

    it("harus mengembalikan '-' jika tanggal kosong atau null", () => {
      assert.strictEqual(formatIndonesianDate(null), "-");
      assert.strictEqual(formatIndonesianDate(""), "-");
    });
  });

  describe("Resolver URL Avatar Pengguna", () => {
    it("harus menggabungkan host backend jika avatarUrl adalah relative path lokal", () => {
      const relativePath = "/uploads/avatars/avatar-123.webp";
      const fullUrl = getAvatarFullUrl(relativePath, "http://localhost:3000/api/v1");
      assert.strictEqual(fullUrl, "http://localhost:3000/uploads/avatars/avatar-123.webp");
    });

    it("harus mempertahankan URL absolut utuh jika dari Google OAuth", () => {
      const googleUrl = "https://lh3.googleusercontent.com/a/ACg8oc...";
      const fullUrl = getAvatarFullUrl(googleUrl, "http://localhost:3000/api/v1");
      assert.strictEqual(fullUrl, googleUrl);
    });

    it("harus mengembalikan null jika avatarUrl kosong", () => {
      assert.strictEqual(getAvatarFullUrl(null), null);
      assert.strictEqual(getAvatarFullUrl(""), null);
    });
  });

  describe("Validasi Berkas Foto Profil (Hanya Gambar)", () => {
    it("harus mengizinkan MIME type webp, png, jpeg, jpg", () => {
      assert.strictEqual(isAllowedImageFile("image/webp"), true);
      assert.strictEqual(isAllowedImageFile("image/png"), true);
      assert.strictEqual(isAllowedImageFile("image/jpeg"), true);
      assert.strictEqual(isAllowedImageFile("image/jpg"), true);
    });

    it("harus menolak file selain gambar seperti pdf, teks, atau binary", () => {
      assert.strictEqual(isAllowedImageFile("application/pdf"), false);
      assert.strictEqual(isAllowedImageFile("text/plain"), false);
      assert.strictEqual(isAllowedImageFile("application/x-msdownload"), false);
    });
  });
});
