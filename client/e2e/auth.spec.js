import { test, expect } from "@playwright/test";
import { setupApiMocks } from "./helpers/mockApi.js";

test.describe("E2E: Autentikasi & Manajemen Akun", () => {
  test.beforeEach(async ({ page }) => {
    await setupApiMocks(page);
  });

  test("harus memvalidasi form login dan redirect ke dashboard saat berhasil", async ({ page }) => {
    await page.goto("/login");

    await expect(page.locator("h1, h2").first()).toBeVisible();

    // Berpindah ke tab Kata Sandi
    const kataSandiTab = page.getByRole("button", { name: "Kata Sandi" });
    if (await kataSandiTab.isVisible()) {
      await kataSandiTab.click();
    }

    // 1. Submit form kosong
    const submitBtn = page.getByRole("button", { name: /Masuk dengan Kata Sandi/i });
    await submitBtn.click();
    await expect(
      page.locator("text=Format email tidak valid").first()
    ).toBeVisible();

    // 2. Login dengan kredensial salah
    await page.fill('input[type="email"]', "salah@example.com");
    await page.fill('input[type="password"]', "Password123!");
    await submitBtn.click();
    await expect(page.locator("text=Email atau kata sandi tidak cocok")).toBeVisible({ timeout: 5000 });

    // 3. Login berhasil
    await page.fill('input[type="email"]', "fermanf91@gmail.com");
    await page.fill('input[type="password"]', "Password123!");
    await submitBtn.click();

    // Verifikasi diarahkan ke dashboard
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 7000 });
  });

  test("harus memvalidasi langkah awal registrasi email dan profil", async ({ page }) => {
    await page.goto("/register");

    const continueBtn = page.getByRole("button", { name: /Lanjutkan/i });
    await expect(continueBtn).toBeVisible();

    // Isi email valid (Step 1)
    await page.fill('input[type="email"]', "fermanf91@gmail.com");
    await continueBtn.click();

    // Lanjut ke Step 2 (Nama & Kata Sandi)
    const nameInput = page.locator("#fullName");
    await expect(nameInput).toBeVisible({ timeout: 5000 });
    await nameInput.fill("Ferman Ferdaus");

    await page.fill("#password", "P@ssw0rd123!");
    await page.fill("#retypePassword", "P@ssw0rd123!");

    const submitProfileBtn = page.getByRole("button", { name: /Daftar & Kirim Kode OTP/i });
    await submitProfileBtn.click();

    // Verifikasi redirect ke halaman OTP
    await expect(page).toHaveURL(/\/verify-otp/, { timeout: 7000 });
  });

  test("harus menampilkan halaman verifikasi OTP", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("resumix_temp_email", "fermanf91@gmail.com");
    });

    await page.goto("/verify-otp");
    await expect(page.locator("text=Verifikasi").first()).toBeVisible();

    // Cek ada form input OTP
    const otpInput = page.locator('input[type="text"], input[inputmode="numeric"]').first();
    await expect(otpInput).toBeVisible();
  });

  test("harus dapat mengirim permintaan reset kata sandi di forgot-password", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(page.locator("text=Lupa Kata Sandi").first()).toBeVisible();

    await page.fill('input[type="email"]', "fermanf91@gmail.com");
    const verifyBtn = page.getByRole("button", { name: /Verifikasi Email/i });
    await verifyBtn.click();

    // Notifikasi sukses
    await expect(
      page.locator("text=Tautan pengaturan ulang kata sandi telah dikirim")
    ).toBeVisible({ timeout: 5000 });
  });
});
