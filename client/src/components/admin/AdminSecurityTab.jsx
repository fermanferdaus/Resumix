import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  QrCode,
  KeyRound,
  CheckCircle2,
  Copy,
  Download,
  AlertTriangle,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card.jsx";
import { Button } from "../ui/button.jsx";
import { Badge } from "../ui/badge.jsx";
import { Input } from "../ui/input.jsx";
import { Skeleton } from "../ui/skeleton.jsx";
import { adminApi } from "../../api/adminApi.js";
import toast from "react-hot-toast";

export const AdminSecurityTab = () => {
  const [statusLoading, setStatusLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Setup Flow State
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupLoading, setSetupLoading] = useState(false);
  const [setupData, setSetupData] = useState(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Backup Codes State (Shown after activation)
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Disable Flow State
  const [isDisabling, setIsDisabling] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [disablePassword, setDisablePassword] = useState("");
  const [isDisableSubmitting, setIsDisableSubmitting] = useState(false);

  // Fetch 2FA Status
  const fetchStatus = async () => {
    setStatusLoading(true);
    try {
      const res = await adminApi.get2FAStatus();
      if (res?.data) {
        setIs2FAEnabled(Boolean(res.data.enabled));
      }
    } catch {
      toast.error("Gagal memeriksa status autentikasi dua faktor");
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Mulai Inisialisasi Setup 2FA
  const handleStartSetup = async () => {
    setIsSettingUp(true);
    setSetupLoading(true);
    setVerifyCode("");
    try {
      const res = await adminApi.get2FASetup();
      if (res?.data) {
        setSetupData(res.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menginisialisasi setup 2FA");
      setIsSettingUp(false);
    } finally {
      setSetupLoading(false);
    }
  };

  // Konfirmasi & Aktifkan 2FA
  const handleEnableSubmit = async (e) => {
    e.preventDefault();
    if (!verifyCode || verifyCode.trim().length !== 6) {
      toast.error("Masukkan 6-digit kode dari aplikasi Google Authenticator");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await adminApi.enable2FA(verifyCode.trim());
      toast.success("Google Authenticator berhasil diaktifkan!");
      setIs2FAEnabled(true);
      setIsSettingUp(false);
      if (res?.data?.backupCodes) {
        setBackupCodes(res.data.backupCodes);
        setShowBackupCodes(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Kode verifikasi salah atau kedaluwarsa");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Konfirmasi Nonaktifkan 2FA
  const handleDisableSubmit = async (e) => {
    e.preventDefault();
    if (!disableCode || !disablePassword) {
      toast.error("Kata sandi dan kode verifikasi wajib diisi");
      return;
    }

    setIsDisableSubmitting(true);
    try {
      await adminApi.disable2FA({
        token: disableCode.trim(),
        password: disablePassword,
      });
      toast.success("Google Authenticator berhasil dinonaktifkan");
      setIs2FAEnabled(false);
      setIsDisabling(false);
      setDisableCode("");
      setDisablePassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menonaktifkan Google Authenticator");
    } finally {
      setIsDisableSubmitting(false);
    }
  };

  // Copy Secret Key
  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      toast.success("Kunci rahasia disalin ke clipboard!");
    }
  };

  // Download Backup Codes as Text File
  const handleDownloadBackupCodes = () => {
    if (backupCodes.length === 0) return;
    const content = `RESUMIX ADMINISTRATOR - 2FA RECOVERY CODES\nTanggal Dibuat: ${new Date().toLocaleString("id-ID")}\n\nPERINGATAN: Simpan kode ini di tempat yang aman. Setiap kode hanya dapat dipakai 1 kali.\n\n${backupCodes.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resumix-admin-backup-codes-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File kode pemulihan berhasil diunduh");
  };

  return (
    <div className="space-y-6">
      {/* Kartu Status 2FA Utama */}
      <Card className="rounded-none border-[#e2e8f0]">
        <CardHeader className="p-5 sm:p-6 border-b border-[#e2e8f0] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div
                className={`p-2.5 rounded-none border ${
                  is2FAEnabled
                    ? "bg-[#ecfdf5] border-[#a7f3d0] text-[#16a34a]"
                    : "bg-[#fffbeb] border-[#fde68a] text-[#d97706]"
                }`}
              >
                {is2FAEnabled ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : (
                  <ShieldAlert className="w-6 h-6" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base sm:text-lg font-bold text-[#0f172a]">
                    Autentikasi Dua Faktor (Google Authenticator)
                  </CardTitle>
                  {statusLoading ? (
                    <Skeleton className="h-5 w-20" />
                  ) : (
                    <Badge
                      variant={is2FAEnabled ? "success" : "warning"}
                      className="font-mono-code text-[11px]"
                    >
                      {is2FAEnabled ? "2FA Aktif" : "Belum Aktif"}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs sm:text-sm text-[#5d5e61] mt-1 leading-relaxed">
                  Tingkatkan keamanan akses Administrator dengan verifikasi kode 6-digit Time-based One-Time Password (TOTP RFC 6238).
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {statusLoading ? (
                <Skeleton className="h-9 w-32" />
              ) : is2FAEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDisabling(true)}
                  className="rounded-none text-xs font-semibold text-[#ba1a1a] border-[#fecaca] hover:bg-[#fef2f2] hover:border-[#ba1a1a]"
                >
                  Nonaktifkan 2FA
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartSetup}
                  className="rounded-none text-xs font-semibold gap-1.5"
                >
                  <QrCode className="w-4 h-4" />
                  Aktifkan Google Authenticator
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-5 sm:p-6 bg-[#f8fafc]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-white border border-[#e2e8f0] rounded-none space-y-1.5">
              <div className="font-bold text-[#0f172a] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                Standar Industri RFC 6238
              </div>
              <p className="text-[#5d5e61] leading-relaxed">
                Kompatibel penuh dengan Google Authenticator, Microsoft Authenticator, Authy, dan 1Password.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#e2e8f0] rounded-none space-y-1.5">
              <div className="font-bold text-[#0f172a] flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#af101a]" />
                Enkripsi Simetris AES-256
              </div>
              <p className="text-[#5d5e61] leading-relaxed">
                Kunci rahasia tersimpan di database dalam kondisi terenkripsi penuh menggunakan standar AES-256-GCM.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#e2e8f0] rounded-none space-y-1.5">
              <div className="font-bold text-[#0f172a] flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#0f172a]" />
                Kode Pemulihan Cadangan
              </div>
              <p className="text-[#5d5e61] leading-relaxed">
                Dilengkapi 8 kode pemulihan darurat satu kali pakai jika ponsel atau aplikasi authenticator hilang.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL / FORM SETUP AKTIVASI 2FA */}
      {isSettingUp && (
        <Card className="rounded-none border-[#af101a] shadow-sm">
          <CardHeader className="p-5 sm:p-6 border-b border-[#e2e8f0] bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-[#0f172a]">
                  Langkah Aktivasi Google Authenticator
                </CardTitle>
                <CardDescription className="text-xs text-[#5d5e61] mt-0.5">
                  Ikuti 2 langkah mudah di bawah untuk menautkan akun dengan aplikasi Google Authenticator.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingUp(false)}
                className="rounded-none text-xs text-[#5d5e61] hover:text-[#0f172a]"
              >
                Batal
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 bg-[#f8fafc] space-y-6">
            {setupLoading ? (
              <div className="space-y-4 py-8 flex flex-col items-center justify-center">
                <RefreshCw className="w-8 h-8 text-[#af101a] animate-spin" />
                <p className="text-xs text-[#5d5e61] font-mono-code">Menghasilkan kunci enkripsi & QR Code...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Langkah 1: Scan QR Code */}
                <div className="p-5 bg-white border border-[#e2e8f0] rounded-none space-y-4 text-center">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#af101a]">
                    Langkah 1: Pindai Kode QR
                  </div>
                  <p className="text-xs text-[#5d5e61]">
                    Buka Google Authenticator di ponsel Anda, pilih <strong>+</strong> lalu pilih <strong>Pindai kode QR</strong>.
                  </p>

                  {setupData?.qrCode && (
                    <div className="inline-block p-2 bg-white border border-[#e2e8f0] rounded-none mx-auto shadow-sm">
                      <img
                        src={setupData.qrCode}
                        alt="Google Authenticator QR Code"
                        className="w-48 h-48 mx-auto"
                      />
                    </div>
                  )}

                  {/* Kunci Manual Alternatif */}
                  <div className="pt-2 border-t border-[#e2e8f0] text-left">
                    <span className="text-[11px] text-[#5d5e61] font-medium block mb-1">
                      Atau masukkan kunci manual:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <code className="flex-1 px-2.5 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-mono-code font-bold text-[#0f172a] select-all break-all rounded-none">
                        {setupData?.secret}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopySecret}
                        className="rounded-none h-8 px-2.5"
                        title="Salin Kunci Manual"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Langkah 2: Masukkan Kode 6-Digit */}
                <form
                  onSubmit={handleEnableSubmit}
                  className="p-5 bg-white border border-[#e2e8f0] rounded-none space-y-4"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-[#af101a]">
                    Langkah 2: Konfirmasi Kode 6-Digit
                  </div>
                  <p className="text-xs text-[#5d5e61] leading-relaxed">
                    Masukkan 6 digit angka yang tampil di aplikasi Google Authenticator akun <strong>Resumix</strong> untuk memverifikasi tautan.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[#0f172a] block">
                      Kode Verifikasi (6 Angka):
                    </label>
                    <Input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="Contoh: 123456"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                      className="text-center font-mono-code text-xl tracking-[0.3em] font-bold rounded-none h-12 border-[#e2e8f0] focus:border-[#1a1c1e] focus:ring-[#af101a]"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || verifyCode.length !== 6}
                    className="w-full rounded-none h-10 text-xs font-semibold cursor-pointer"
                  >
                    {isSubmitting ? "Memverifikasi..." : "Verifikasi & Aktifkan 2FA"}
                  </Button>

                  <div className="p-3 bg-[#fbf8ff] border border-[#e2e8f0] text-[11px] text-[#5d5e61] flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                    <span>
                      Pastikan jam pada ponsel Anda akurat (sinkron otomatis) agar kode yang dihasilkan valid.
                    </span>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL KODE CADANGAN (SETELAH BERHASIL AKTIF) */}
      {showBackupCodes && (
        <Card className="rounded-none border-[#16a34a] bg-white">
          <CardHeader className="p-5 sm:p-6 border-b border-[#e2e8f0] bg-[#ecfdf5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#16a34a]">
                <CheckCircle2 className="w-5 h-5" />
                <CardTitle className="text-base font-bold text-[#065f46]">
                  Simpan Kode Pemulihan Cadangan Anda
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBackupCodes(false)}
                className="rounded-none text-xs text-[#065f46] hover:bg-white"
              >
                Tutup
              </Button>
            </div>
            <CardDescription className="text-xs text-[#047857] mt-1">
              Jika Anda kehilangan akses ke aplikasi Google Authenticator, Anda dapat menggunakan salah satu kode di bawah ini untuk masuk. Setiap kode hanya berlaku 1 kali pakai.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#f8fafc] border border-[#e2e8f0] text-center font-mono-code font-bold text-xs text-[#0f172a] select-all rounded-none"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadBackupCodes}
                className="rounded-none text-xs font-semibold gap-1.5 border-[#e2e8f0]"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh Berkas Teks (.txt)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join("\n"));
                  toast.success("Seluruh kode pemulihan disalin!");
                }}
                className="rounded-none text-xs font-semibold gap-1.5 border-[#e2e8f0]"
              >
                <Copy className="w-3.5 h-3.5" />
                Salin Seluruh Kode
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL KONFIRMASI NONAKTIFKAN 2FA */}
      {isDisabling && (
        <Card className="rounded-none border-[#ba1a1a] shadow-sm">
          <CardHeader className="p-5 border-b border-[#e2e8f0] bg-[#fef2f2]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-[#ba1a1a] flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Konfirmasi Menonaktifkan 2FA
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsDisabling(false)}
                className="rounded-none text-xs text-[#ba1a1a] hover:bg-white"
              >
                Batal
              </Button>
            </div>
            <CardDescription className="text-xs text-[#7f1d1d] mt-1">
              Menonaktifkan Google Authenticator akan menurunkan perlindungan keamanan akun administrator Anda.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-5 sm:p-6 bg-white">
            <form onSubmit={handleDisableSubmit} className="max-w-md space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0f172a] block">
                  Kata Sandi Akun Admin:
                </label>
                <Input
                  type="password"
                  placeholder="Masukkan kata sandi saat ini"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="rounded-none text-xs h-9 border-[#e2e8f0]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#0f172a] block">
                  Kode Google Authenticator atau Kode Cadangan:
                </label>
                <Input
                  type="text"
                  placeholder="Contoh: 123456 atau XXXX-XXXX"
                  value={disableCode}
                  onChange={(e) => setDisableCode(e.target.value)}
                  className="font-mono-code rounded-none text-xs h-9 border-[#e2e8f0]"
                  required
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                  disabled={isDisableSubmitting}
                  className="rounded-none text-xs font-semibold"
                >
                  {isDisableSubmitting ? "Memproses..." : "Ya, Nonaktifkan 2FA"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDisabling(false)}
                  className="rounded-none text-xs font-semibold border-[#e2e8f0]"
                >
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSecurityTab;
