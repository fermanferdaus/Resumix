import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./helpers/mockApi.js";

test.describe("E2E: Landing Page & Fitur Interaktif", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
    await page.goto("/");
  });

  test("harus merender header, headline, dan badge resmi", async ({ page }) => {
    // Brand Logo & Badge
    await expect(page.getByRole("img", { name: /Resumix/i }).first()).toBeVisible();
    await expect(page.locator("text=STANDAR ATS RESMI")).toBeVisible();

    // Headline
    const headline = page.locator("h1");
    await expect(headline).toContainText("Bikin CV ATS Rapi yang");
    await expect(headline).toContainText("Siap Dibaca Rekruter");

    // Stats bar
    await expect(page.locator("text=99.8%")).toBeVisible();
    await expect(page.getByText("Gratis Dipakai", { exact: true })).toBeVisible();
  });

  test("harus menjalankan animasi simulasi scan ATS saat tombol 'Uji Scan' diklik", async ({ page }) => {
    const ujiScanBtn = page.getByRole("button", { name: /Uji Scan/i });
    await expect(ujiScanBtn).toBeVisible();

    // Klik tombol Uji Scan
    await ujiScanBtn.click();

    // Pastikan status scanning aktif (loading / skeleton text)
    await expect(page.locator("text=Memindai Format ATS...")).toBeVisible();

    // Tunggu animasi scan selesai (1.4s) dan kembali ke status Lolos
    await expect(page.locator("text=Pemeriksaan Format ATS")).toBeVisible({ timeout: 5000 });
    await expect(page.locator("text=Format Siap Dikirim ke Portal Kerja")).toBeVisible();
    await expect(page.locator("text=Keterbacaan Teks")).toBeVisible();
    await expect(page.locator("text=Kesesuaian Format")).toBeVisible();
  });

  test("harus mendukung toggle pratinjau A4 dan Deteksi Mesin ATS (Token View)", async ({ page }) => {
    const showcaseSection = page.locator("#template-showcase");
    await expect(showcaseSection).toBeVisible();

    // Default mode: Dokumen A4
    await expect(page.getByText("RADITYA PRATAMA, S.KOM.")).toBeVisible();
    await expect(page.getByText("LEAD FULL STACK ENGINEER")).toBeVisible();

    // Toggle ke mode Deteksi Mesin ATS (Token View)
    const tokenViewBtn = page.getByRole("button", { name: /Deteksi Mesin ATS/i });
    await tokenViewBtn.click();

    // Verifikasi tampilan token ATS
    await expect(page.locator("text=[PARSER STATUS: LINEAR_TOKENS_OK]")).toBeVisible();
    await expect(page.locator("text=ENTITAS: NAMA_KANDIDAT")).toBeVisible();
    await expect(page.locator("text=BAGIAN: PENGALAMAN_KERJA")).toBeVisible();
    await expect(page.locator("text=12 KATA KUNCI")).toBeVisible();

    // Toggle kembali ke Tampilan Dokumen A4
    const docViewBtn = page.getByRole("button", { name: /Tampilan Dokumen A4/i });
    await docViewBtn.click();
    await expect(page.getByText("RADITYA PRATAMA, S.KOM.")).toBeVisible();
  });

  test("harus menampilkan saluran kontak dari .env dengan benar", async ({ page }) => {
    const contactSection = page.locator("#kontak");
    await expect(contactSection).toBeVisible();

    // Email
    await expect(contactSection.getByText("fermanf91@gmail.com")).toBeVisible();
    const emailLink = contactSection.locator('a[href^="mailto:fermanf91@gmail.com"]');
    await expect(emailLink).toBeVisible();

    // GitHub
    await expect(contactSection.getByText("github.com/fermanferdaus")).toBeVisible();
    const githubLink = contactSection.locator('a[href*="github.com/fermanferdaus"]');
    await expect(githubLink).toBeVisible();

    // Instagram
    await expect(contactSection.getByText("@fermanferdaus_")).toBeVisible();
    const igLink = contactSection.locator('a[href*="instagram.com/fermanferdaus_"]');
    await expect(igLink).toBeVisible();
  });

  test("harus memuat footer dengan copyright dan tautan saweria", async ({ page }) => {
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
    await expect(footer.locator("text=CV ATS Builder © 2026")).toBeVisible();
    await expect(footer.locator('a[href*="saweria.co"]')).toBeVisible();
  });
});
