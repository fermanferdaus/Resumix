import { test, expect } from "@playwright/test";
import { authenticateSession, mockDefaultUser } from "./helpers/mockApi.js";

test.describe("E2E: Profil Pengguna", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateSession(page, mockDefaultUser);
    await page.goto("/profile");
  });

  test("harus menampilkan data profil pengguna", async ({ page }) => {
    // Nama dan email pengguna
    await expect(page.locator(`text=${mockDefaultUser.fullName}`).first()).toBeVisible({ timeout: 8000 });
    await expect(page.locator(`text=${mockDefaultUser.email}`).first()).toBeVisible();

    // Informasi kontak
    await expect(page.locator(`text=${mockDefaultUser.phone}`).first()).toBeVisible();
  });

  test("harus dapat membuka modal edit profil dan memperbarui biodata", async ({ page }) => {
    // Tunggu halaman profil siap
    await expect(page.locator(`text=${mockDefaultUser.fullName}`).first()).toBeVisible({ timeout: 8000 });

    const editBtn = page.getByRole("button", { name: /Ubah Profil/i }).first();
    await expect(editBtn).toBeVisible();
    await editBtn.click();

    // Modal Ubah Informasi Pribadi muncul
    await expect(page.locator("text=Ubah Informasi Pribadi")).toBeVisible();

    // Input nama lengkap
    const nameInput = page.locator("#edit-fullName");
    await expect(nameInput).toBeVisible();
    await nameInput.fill("Ferman Ferdaus Updated");

    // Simpan perubahan
    const saveBtn = page.getByRole("button", { name: /Simpan/i }).last();
    await saveBtn.click();

    // Notifikasi sukses
    await expect(page.locator("text=berhasil disimpan").or(page.locator("role=alert"))).toBeVisible({
      timeout: 5000,
    });
  });
});
