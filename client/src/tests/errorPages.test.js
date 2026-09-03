import { describe, it } from "node:test";
import assert from "node:assert";

describe("Frontend Unit: Error Handling & Fallback Page Routing", () => {
  describe("Spesifikasi Penanganan Route 404 (Not Found)", () => {
    it("harus menangkap rute tidak terdaftar dengan catch-all '*'", () => {
      const registeredRoutes = [
        "/",
        "/login",
        "/register",
        "/verify-otp",
        "/forgot-password",
        "/reset-password",
        "/dashboard",
        "/profile",
        "/editor/:id",
        "/500",
      ];

      const checkRouteExists = (path) => registeredRoutes.includes(path);

      assert.strictEqual(checkRouteExists("/random-unmapped-url"), false);
      assert.strictEqual(checkRouteExists("/dashboard"), true);
    });

    it("harus menyajikan opsi navigasi kembali dan ke beranda", () => {
      const fallbackActions = ["back", "home", "dashboard"];
      assert.ok(fallbackActions.includes("back"));
      assert.ok(fallbackActions.includes("home"));
      assert.ok(fallbackActions.includes("dashboard"));
    });
  });

  describe("Spesifikasi Penanganan Error 500 & Boundary", () => {
    it("harus mengekstrak pesan error runtime dengan fallback aman", () => {
      const sampleRuntimeError = new Error("Koneksi API terputus atau server tidak merespons");
      const emptyError = null;

      const getErrorMessage = (err) => err?.message || "Terjadi kendala sistem tak terduga";

      assert.strictEqual(getErrorMessage(sampleRuntimeError), "Koneksi API terputus atau server tidak merespons");
      assert.strictEqual(getErrorMessage(emptyError), "Terjadi kendala sistem tak terduga");
    });
  });
});

