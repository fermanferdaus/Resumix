import { test, expect } from "@playwright/test";
import { authenticateSession, mockDefaultResume } from "./helpers/mockApi.js";

test.describe("E2E: Editor Resume & Live ATS Preview", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateSession(page);
    await page.goto(`/editor/${mockDefaultResume.id}`);
  });

  test("harus memuat editor resume dan menampilkan pratinjau A4 live", async ({ page }) => {
    // Memastikan input nama header termuat
    const fullNameInput = page.locator("#header-fullname").first();
    await expect(fullNameInput).toHaveValue(
      mockDefaultResume.data.header.fullName,
      { timeout: 8000 }
    );

    // Memastikan A4 Preview menampilkan nama dan role
    await expect(page.getByText("RADITYA PRATAMA").first()).toBeVisible();
    await expect(page.getByText("Senior Full Stack Developer").first()).toBeVisible();
  });

  test("harus memperbarui pratinjau secara realtime saat nama lengkap diubah", async ({ page }) => {
    const nameInput = page.locator("#header-fullname").first();
    await expect(nameInput).toBeVisible({ timeout: 8000 });

    // Ubah nama di form
    await nameInput.fill("Budi Wicaksono");

    // Pratinjau langsung terupdate dengan nama baru (uppercase)
    await expect(page.getByText("BUDI WICAKSONO").first()).toBeVisible({ timeout: 5000 });
  });

  test("harus dapat bernavigasi antar bagian resume di sidebar editor", async ({ page }) => {
    // Tunggu editor termuat
    await expect(page.locator("#header-fullname").first()).toBeVisible({ timeout: 8000 });

    // Klik bagian Pengalaman Kerja
    const expTab = page.locator('button:has-text("Pengalaman Kerja")').first();
    if (await expTab.isVisible()) {
      await expTab.click();
      await expect(page.getByText("PT Inovasi Digital Nusantara").first()).toBeVisible();
    }

    // Klik bagian Keahlian
    const skillsTab = page.locator('button:has-text("Keahlian")').first();
    if (await skillsTab.isVisible()) {
      await skillsTab.click();
      await expect(page.getByText("HARD SKILL / KEAHLIAN TEKNIS").first()).toBeVisible();
    }

    // Klik bagian Organisasi
    const orgTab = page.locator('button:has-text("Organisasi")').first();
    if (await orgTab.isVisible()) {
      await orgTab.click();
      await expect(
        page.locator('input[value*="Himpunan Mahasiswa"]').or(page.getByText("Nama Organisasi *")).first()
      ).toBeVisible();
    }
  });

  test("harus memverifikasi status autosave dan tombol Unduh PDF", async ({ page }) => {
    await expect(page.locator("#header-fullname").first()).toBeVisible({ timeout: 8000 });

    // Status autosave tersimpan
    await expect(page.locator("text=Tersimpan").first()).toBeVisible({ timeout: 5000 });

    // Tombol Unduh PDF tersedia
    const printBtn = page.getByRole("button", { name: /Unduh PDF/i }).first();
    await expect(printBtn).toBeVisible();
  });
});
