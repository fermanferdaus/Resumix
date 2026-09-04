import { describe, it } from "node:test";
import assert from "node:assert";
import { renderOtpTemplate, renderResetPasswordTemplate } from "../../services/mailService.js";

describe("Unit: Mail Service Template Renderers", () => {
  describe("renderOtpTemplate", () => {
    it("harus merender 6 kotak digit terpisah untuk kode OTP", () => {
      const code = "782194";
      const html = renderOtpTemplate(code, 5);

      for (const digit of code) {
        assert(html.includes(digit), `Digit ${digit} harus ada dalam HTML`);
      }
      assert(html.includes("#af101a"), "Harus menggunakan warna aksen crimson website");
      assert(html.includes("#1a1b22"), "Harus menggunakan warna teks foreground website");
      assert(html.includes("border-radius: 0"), "Harus menggunakan flat border-radius 0");
      assert(!html.includes("⏱"), "Tidak boleh ada emoji stopwatch AI");
      assert(!html.includes("dashed"), "Tidak boleh ada style border dashed");
    });
  });

  describe("renderResetPasswordTemplate", () => {
    it("harus merender tombol aksi tanpa kotak tautan mentah", () => {
      const resetUrl = "https://resumix.os-tech.online/reset-password?token=abc123xyz";
      const html = renderResetPasswordTemplate(resetUrl, 15);

      assert(html.includes(resetUrl), "Tombol harus mengarah ke tautan reset URL");
      assert(html.includes("Atur Ulang Kata Sandi"), "Harus memiliki teks tombol aksi");
      assert(html.includes("border-radius: 0"), "Harus menggunakan flat border-radius 0");
      assert(!html.includes("Salin tautan"), "Tidak boleh ada instruksi salin tautan mentah");
      assert(!html.includes("⏱"), "Tidak boleh ada emoji stopwatch AI");
    });
  });
});
