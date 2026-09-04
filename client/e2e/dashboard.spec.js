import { test, expect } from "@playwright/test";
import { authenticateSession, mockDefaultResume } from "./helpers/mockApi.js";

test.describe("E2E: Dashboard Pengguna & Manajemen Resume", () => {
  test.beforeEach(async ({ page }) => {
    await authenticateSession(page);
    await page.goto("/dashboard");
  });

  test("harus menampilkan daftar resume pengguna dan informasi kuota akun", async ({ page }) => {
    // Header
    await expect(page.locator("text=Daftar Resume Saya")).toBeVisible({ timeout: 8000 });

    // Pastikan kartu resume muncul
    await expect(page.locator(`text=${mockDefaultResume.title}`).first()).toBeVisible();

    // Target role pada kartu
    await expect(page.locator(`text=${mockDefaultResume.targetRole}`).first()).toBeVisible();

    // Kuota akun
    await expect(page.locator("text=[1/5 CV]").or(page.locator("text=/5 CV"))).toBeVisible();
  });

  test("harus dapat menyaring resume berdasarkan input pencarian", async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Cari"]');
    await expect(searchInput).toBeVisible({ timeout: 8000 });

    // Cari dengan kata kunci yang cocok
    await searchInput.fill("Software Engineer");
    await page.waitForTimeout(450); // tunggu debounce 350ms
    await expect(page.locator(`text=${mockDefaultResume.title}`).first()).toBeVisible();

    // Cari dengan kata kunci tidak cocok
    await searchInput.fill("KeywordTidakAdaSamaSekali");
    await page.waitForTimeout(450); // tunggu debounce 350ms
    await expect(
      page.locator("text=Tidak ditemukan resume")
    ).toBeVisible();
  });

  test("harus membuka dialog pembuatan resume dan membuat resume baru", async ({ page }) => {
    // Klik kartu + Buat CV Baru
    const createBtn = page.locator('text="+ Buat CV Baru"').or(page.getByText("Buat CV Baru")).first();
    await expect(createBtn).toBeVisible({ timeout: 8000 });
    await createBtn.click();

    // Modal dialog muncul
    await expect(page.locator("text=Buat CV ATS Baru")).toBeVisible();

    // Isi judul resume
    const titleInput = page.locator("#resume-title");
    await expect(titleInput).toBeVisible();
    await titleInput.fill("CV Full Stack Specialist");

    // Submit pembuatan
    const confirmBtn = page.getByRole("button", { name: /Buat Resume/i }).last();
    await confirmBtn.click();

    // Memastikan diarahkan ke editor resume
    await expect(page).toHaveURL(/\/editor\//, { timeout: 7000 });
  });

  test("harus dapat menghapus resume dengan konfirmasi dialog", async ({ page }) => {
    // Buka menu opsi resume
    const opsiBtn = page.locator('button[title="Opsi resume"]').first();
    await expect(opsiBtn).toBeVisible({ timeout: 8000 });
    await opsiBtn.click();

    // Klik Hapus Resume
    const deleteMenuBtn = page.getByRole("button", { name: /Hapus Resume/i });
    await expect(deleteMenuBtn).toBeVisible();
    await deleteMenuBtn.click();

    // Konfirmasi dialog hapus
    const confirmDelete = page.getByRole("button", { name: /Ya, Hapus/i });
    await expect(confirmDelete).toBeVisible();
    await confirmDelete.click();

    // Notifikasi sukses
    await expect(page.locator("text=berhasil dihapus")).toBeVisible({ timeout: 5000 });
  });
});
