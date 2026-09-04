import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./helpers/mockApi.js";

test.describe("E2E: Halaman Error (404 Not Found & 500 Server Error)", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("harus menampilkan halaman 404 jika mengakses rute yang tidak terdaftar", async ({ page }) => {
    await page.goto("/halaman-tidak-ada-xyz");

    // Status badge 404
    await expect(page.locator("text=STATUS 404 // NOT_FOUND")).toBeVisible();
    await expect(page.locator("text=404.")).toBeVisible();
    await expect(page.locator("text=Halaman Tidak Ditemukan")).toBeVisible();

    // Target path diagnostic
    await expect(page.locator("text=/halaman-tidak-ada-xyz")).toBeVisible();

    // Klik tombol Kembali ke Halaman Utama
    const homeBtn = page.getByRole("link", { name: /Ke Halaman Utama/i });
    await expect(homeBtn).toBeVisible();
    await homeBtn.click();

    // Verifikasi kembali ke root URL
    await expect(page).toHaveURL("/");
  });

  test("harus menampilkan halaman 500 saat rute /500 diakses", async ({ page }) => {
    await page.goto("/500");

    // Status badge 500
    await expect(page.locator("text=STATUS 500 // SERVER_ERROR")).toBeVisible();
    await expect(page.locator("text=500.")).toBeVisible();
    await expect(page.locator("text=Terjadi Kendala Sistem")).toBeVisible();

    // Tombol muat ulang
    const reloadBtn = page.getByRole("button", { name: /Muat Ulang/i });
    await expect(reloadBtn).toBeVisible();
  });
});
