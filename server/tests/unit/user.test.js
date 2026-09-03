import { describe, it } from "node:test";
import assert from "node:assert";
import {
  updateProfileSchema,
  uploadAvatarSchema,
} from "../../validators/userValidator.js";

describe("Unit: Zod User Profile & Avatar Validators", () => {
  describe("updateProfileSchema", () => {
    it("harus meloloskan payload update profil yang valid", () => {
      const validPayload = {
        fullName: "Jane Doe",
        phone: "+62 812-3456-7890",
        dob: "1995-01-15",
        domicile: "Jakarta, Indonesia",
      };

      const result = updateProfileSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
      assert.strictEqual(result.data.fullName, "Jane Doe");
      assert.strictEqual(result.data.phone, "+62 812-3456-7890");
    });

    it("harus memperbolehkan field opsional bernilai kosong atau null", () => {
      const payloadWithEmpty = {
        fullName: "John Doe",
        phone: "",
        dob: null,
        domicile: "",
      };

      const result = updateProfileSchema.safeParse(payloadWithEmpty);
      assert.strictEqual(result.success, true);
    });

    it("harus menolak nama lengkap kurang dari 2 karakter", () => {
      const invalidPayload = {
        fullName: "J",
      };

      const result = updateProfileSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
      assert(result.error.issues.some((i) => i.path.includes("fullName")));
    });

    it("harus menolak tanggal lahir yang tidak valid", () => {
      const invalidPayload = {
        dob: "bukan-tanggal-valid",
      };

      const result = updateProfileSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
      assert(result.error.issues.some((i) => i.path.includes("dob")));
    });
  });

  describe("uploadAvatarSchema (Hanya File Gambar)", () => {
    it("harus meloloskan gambar format WEBP valid", () => {
      const validWebp = {
        image: "data:image/webp;base64,UklGRkAAAABXRUJQVlA4IDQAAADwAQCdASoBAAEAAQAcJaACdLoAAP7/2QAA",
      };

      const result = uploadAvatarSchema.safeParse(validWebp);
      assert.strictEqual(result.success, true);
    });

    it("harus meloloskan gambar format PNG valid", () => {
      const validPng = {
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };

      const result = uploadAvatarSchema.safeParse(validPng);
      assert.strictEqual(result.success, true);
    });

    it("harus meloloskan gambar format JPEG valid", () => {
      const validJpeg = {
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
      };

      const result = uploadAvatarSchema.safeParse(validJpeg);
      assert.strictEqual(result.success, true);
    });

    it("harus menolak jika payload bukan format gambar (PDF, teks, exe, dll)", () => {
      const invalidPdf = {
        image: "data:application/pdf;base64,JVBERi0xLjUKJ...",
      };

      const resultPdf = uploadAvatarSchema.safeParse(invalidPdf);
      assert.strictEqual(resultPdf.success, false);
      assert.strictEqual(
        resultPdf.error.issues[0].message,
        "File yang diunggah harus berformat gambar valid (.jpg, .jpeg, .png, .webp)"
      );

      const invalidHtml = {
        image: "data:text/html;base64,PGh0bWw+PC9odG1sPg==",
      };
      const resultHtml = uploadAvatarSchema.safeParse(invalidHtml);
      assert.strictEqual(resultHtml.success, false);
    });
  });
});
