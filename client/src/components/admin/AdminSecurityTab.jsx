import { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  QrCode,
  CheckCircle2,
  Copy,
  Download,
  AlertTriangle,
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
  const [adminEmail, setAdminEmail] = useState("");

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

  useEffect(() => {
    let ignore = false;

    const loadStatus = async () => {
      try {
        const res = await adminApi.get2FAStatus();
        if (!ignore && res?.data) {
          setIs2FAEnabled(Boolean(res.data.enabled));
          if (res.data.email) setAdminEmail(res.data.email);
        }
      } catch {
        if (!ignore) {
          toast.error("Gagal memeriksa status 2FA");
        }
      } finally {
        if (!ignore) {
          setStatusLoading(false);
        }
      }
    };

    loadStatus();

    return () => {
      ignore = true;
    };
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
      toast.error(err.response?.data?.message || "Gagal menyiapkan 2FA");
      setIsSettingUp(false);
    } finally {
      setSetupLoading(false);
    }
  };

  // Konfirmasi & Aktifkan 2FA
  const handleEnableSubmit = async (e) => {
    e.preventDefault();
    if (!verifyCode || verifyCode.trim().length !== 6) {
      toast.error("Masukkan 6 digit kode dari aplikasi authenticator");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await adminApi.enable2FA(verifyCode.trim());
      toast.success("2FA berhasil diaktifkan");
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
      toast.success("2FA berhasil dinonaktifkan");
      setIs2FAEnabled(false);
      setIsDisabling(false);
      setDisableCode("");
      setDisablePassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Gagal menonaktifkan 2FA");
    } finally {
      setIsDisableSubmitting(false);
    }
  };

  // Salin Kunci Rahasia
  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret);
      toast.success("Kunci rahasia disalin");
    }
  };

  // Unduh Kode Cadangan (.txt)
  const handleDownloadBackupCodes = () => {
    if (backupCodes.length === 0) return;
    const content = `RESUMIX - KODE CADANGAN 2FA\nAkun: ${adminEmail || "Administrator"}\nTanggal: ${new Date().toLocaleString("id-ID")}\n\nPERINGATAN: Simpan kode ini di tempat aman. Tiap kode hanya bisa digunakan 1 kali saat ponsel hilang.\n\n${backupCodes.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `resumix-backup-codes-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Berkas kode cadangan diunduh");
  };

  return (
    <div className="space-y-5">
      {/* Kartu Status 2FA */}
      <Card className="rounded-none border-[#e2e8f0]">
        <CardHeader className="p-4 sm:p-6 border-b border-[#e2e8f0] bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 sm:p-2.5 rounded-none border shrink-0 ${
                  is2FAEnabled
                    ? "bg-[#ecfdf5] border-[#a7f3d0] text-[#16a34a]"
                    : "bg-[#fffbeb] border-[#fde68a] text-[#d97706]"
                }`}
              >
                {is2FAEnabled ? (
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                ) : (
                  <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <CardTitle className="text-base sm:text-lg font-bold text-[#0f172a]">
                    Google Authenticator (2FA)
                  </CardTitle>
                  {statusLoading ? (
                    <Skeleton className="h-5 w-16" />
                  ) : (
                    <Badge
                      variant={is2FAEnabled ? "success" : "warning"}
                      className="font-mono-code text-[10px] sm:text-[11px]"
                    >
                      {is2FAEnabled ? "Aktif" : "Nonaktif"}
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs sm:text-sm text-[#5d5e61] mt-1 leading-relaxed">
                  {is2FAEnabled
                    ? `Verifikasi dua langkah aktif untuk akun ${adminEmail || "admin"}.`
                    : "Wajibkan kode 6 digit dari ponsel setiap kali admin masuk ke dashboard."}
                </CardDescription>
              </div>
            </div>

            <div className="shrink-0">
              {statusLoading ? (
                <Skeleton className="h-9 w-28" />
              ) : is2FAEnabled ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDisabling(true)}
                  className="rounded-none text-xs font-semibold text-[#ba1a1a] border-[#fecaca] hover:bg-[#fef2f2] w-full sm:w-auto"
                >
                  Matikan 2FA
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartSetup}
                  className="rounded-none text-xs font-semibold gap-1.5 w-full sm:w-auto"
                >
                  <QrCode className="w-4 h-4" />
                  Aktifkan 2FA
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 bg-[#f8fafc]">
          {is2FAEnabled ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-white p-3.5 sm:p-4 border border-[#e2e8f0]">
              <div className="flex items-center gap-2 text-[#16a34a]">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-[#0f172a] font-medium">
                  Akun Anda terlindungi dengan verifikasi dua langkah.
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleStartSetup}
                className="rounded-none text-xs text-[#5d5e61] border-[#e2e8f0] hover:text-[#0f172a] shrink-0"
              >
                Ganti / Tautkan Ulang
              </Button>
            </div>
          ) : (
            <div className="text-xs text-[#5d5e61] space-y-2 p-3.5 sm:p-4 bg-white border border-[#e2e8f0]">
              <div className="font-bold text-[#0f172a]">Petunjuk Aktivasi:</div>
              <ol className="list-decimal list-inside space-y-1.5 text-[#5d5e61] leading-relaxed">
                <li>Buka aplikasi authenticator di ponsel Anda (Google Authenticator, Microsoft Authenticator, atau Authy).</li>
                <li>Tekan tombol <strong>Aktifkan 2FA</strong> di atas, lalu scan kode QR yang disediakan.</li>
                <li>Ketik 6 digit angka dari aplikasi untuk menyelesaikan verifikasi.</li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL / FORM SETUP AKTIVASI 2FA */}
      {isSettingUp && (
        <Card className="rounded-none border-[#af101a] shadow-sm">
          <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm sm:text-base font-bold text-[#0f172a]">
                  Hubungkan Google Authenticator
                </CardTitle>
                <CardDescription className="text-xs text-[#5d5e61] mt-0.5">
                  Scan kode QR dengan ponsel, lalu ketik kode verifikasinya.
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

          <CardContent className="p-4 sm:p-5 bg-[#f8fafc]">
            {setupLoading ? (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <RefreshCw className="w-6 h-6 text-[#af101a] animate-spin" />
                <p className="text-xs text-[#5d5e61] font-mono-code">Menyiapkan kode QR...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
                {/* Langkah 1: Scan QR Code */}
                <div className="p-4 bg-white border border-[#e2e8f0] rounded-none space-y-3 text-center">
                  <div className="text-xs font-bold text-[#af101a] text-left">
                    1. Pindai Kode QR
                  </div>
                  <p className="text-xs text-[#5d5e61] text-left">
                    Buka Google Authenticator di ponsel, pilih tanda <strong>+</strong> lalu <strong>Pindai kode QR</strong>:
                  </p>

                  {setupData?.qrCode && (
                    <div className="inline-block p-2 bg-white border border-[#e2e8f0] rounded-none mx-auto shadow-sm">
                      <img
                        src={setupData.qrCode}
                        alt="QR Code 2FA"
                        className="w-36 h-36 sm:w-44 sm:h-44 mx-auto"
                      />
                    </div>
                  )}

                  {/* Kunci Manual Alternatif */}
                  <div className="pt-2 border-t border-[#e2e8f0] text-left">
                    <span className="text-[11px] text-[#5d5e61] font-medium block mb-1">
                      Atau ketik kunci manual:
                    </span>
                    <div className="flex items-center gap-1.5">
                      <code className="flex-1 px-2 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[11px] font-mono-code font-bold text-[#0f172a] select-all break-all rounded-none">
                        {setupData?.secret}
                      </code>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleCopySecret}
                        className="rounded-none h-7 px-2"
                        title="Salin Kunci"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Langkah 2: Masukkan Kode 6-Digit */}
                <form
                  onSubmit={handleEnableSubmit}
                  className="p-4 bg-white border border-[#e2e8f0] rounded-none space-y-3.5"
                >
                  <div className="text-xs font-bold text-[#af101a]">
                    2. Masukkan 6 Digit Kode
                  </div>
                  <p className="text-xs text-[#5d5e61]">
                    Ketik 6 angka yang tampil di aplikasi Google Authenticator untuk akun <strong>Resumix</strong>:
                  </p>

                  <div>
                    <Input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      placeholder="000000"
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ""))}
                      className="text-center font-mono-code text-2xl tracking-[0.3em] font-bold rounded-none h-12 border-[#e2e8f0] focus:border-[#af101a] focus:ring-[#af101a]"
                      autoFocus
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || verifyCode.length !== 6}
                    className="w-full rounded-none h-10 text-xs font-semibold cursor-pointer"
                  >
                    {isSubmitting ? "Memverifikasi..." : "Verifikasi & Aktifkan"}
                  </Button>

                  <div className="p-2.5 bg-[#fbf8ff] border border-[#e2e8f0] text-[11px] text-[#5d5e61] flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#d97706] shrink-0 mt-0.5" />
                    <span>Pastikan jam pada ponsel Anda diatur otomatis agar kode tetap sinkron.</span>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* MODAL KODE CADANGAN */}
      {showBackupCodes && (
        <Card className="rounded-none border-[#16a34a] bg-white">
          <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-[#ecfdf5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#16a34a]">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <CardTitle className="text-sm sm:text-base font-bold text-[#065f46]">
                  Kode Cadangan Darurat
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
              Simpan kode ini di tempat aman. Gunakan jika ponsel hilang atau tidak bisa diakses. Tiap kode hanya berlaku 1 kali.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {backupCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="p-2 bg-[#f8fafc] border border-[#e2e8f0] text-center font-mono-code font-bold text-xs text-[#0f172a] select-all rounded-none"
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownloadBackupCodes}
                className="rounded-none text-xs font-semibold gap-1.5 border-[#e2e8f0]"
              >
                <Download className="w-3.5 h-3.5" />
                Unduh File (.txt)
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(backupCodes.join("\n"));
                  toast.success("Semua kode cadangan disalin");
                }}
                className="rounded-none text-xs font-semibold gap-1.5 border-[#e2e8f0]"
              >
                <Copy className="w-3.5 h-3.5" />
                Salin Semua
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* MODAL NONAKTIFKAN 2FA */}
      {isDisabling && (
        <Card className="rounded-none border-[#ba1a1a] shadow-sm">
          <CardHeader className="p-4 sm:p-5 border-b border-[#e2e8f0] bg-[#fef2f2]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm sm:text-base font-bold text-[#ba1a1a] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Matikan Verifikasi 2FA
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
              Masukkan kata sandi akun dan kode verifikasi untuk mematikan 2FA.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-5 bg-white">
            <form onSubmit={handleDisableSubmit} className="max-w-md space-y-3.5">
              <div className="space-y-1">
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

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#0f172a] block">
                  Kode Authenticator atau Kode Cadangan:
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
                  {isDisableSubmitting ? "Memproses..." : "Matikan 2FA"}
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
