import { useState, useEffect } from "react";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { authApi } from "../../api/authApi.js";
import { Button } from "../../components/ui/button.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { Plus, FileText, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export const DashboardPage = () => {
  const { user, setUser } = useAuthStore();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Ambil profil user terbaru dari backend
    authApi
      .getMe()
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        console.error("Gagal mengambil data profil", err);
      });
  }, [setUser]);

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col text-[#1a1b22]">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Notice Banner */}
        {notice && (
          <div className="mb-6">
            <Alert variant="info" onClose={() => setNotice("")}>
              <span>{notice}</span>
            </Alert>
          </div>
        )}

        {/* Banner Selamat Datang */}
        <div className="bg-white border border-[#e2e8f0] p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-xs font-mono-code uppercase font-semibold text-[#af101a] mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ruang Kerja Siap</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                Selamat datang kembali, {user?.fullName || "Pengguna"}!
              </h1>
              <p className="text-sm text-[#5d5e61] mt-1">
                Kelola resume standar ATS Anda dan ekspor dokumen PDF siap kerja dengan mudah.
              </p>
            </div>

            <Button
              size="lg"
              className="flex items-center gap-2 self-start md:self-auto"
              onClick={() => setNotice("Editor Pembuat CV akan segera aktif di tahap berikutnya!")}
            >
              <Plus className="w-4 h-4" />
              <span>Buat CV Baru</span>
            </Button>
          </div>
        </div>

        {/* Kartu Status & Info Akun */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-[#e2e8f0] p-5">
            <div className="text-xs font-mono-code uppercase text-[#5d5e61] mb-1">Email Akun</div>
            <div className="text-sm font-semibold text-[#1a1b22] truncate">{user?.email}</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#15803d]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Email Terverifikasi</span>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-5">
            <div className="text-xs font-mono-code uppercase text-[#5d5e61] mb-1">ID Publik (UUIDv7)</div>
            <div className="text-xs font-mono-code text-[#1a1b22] truncate">{user?.id || "N/A"}</div>
            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1a1b22]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#af101a]" />
              <span>Terproteksi Dual-ID</span>
            </div>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-5">
            <div className="text-xs font-mono-code uppercase text-[#5d5e61] mb-1">Total Resume</div>
            <div className="text-xl font-bold text-[#1a1b22]">0 CV</div>
            <div className="mt-3 text-xs text-[#5d5e61]">Template Tunggal Bersih ATS</div>
          </div>
        </div>

        {/* Daftar CV User */}
        <div className="bg-white border border-[#e2e8f0] p-6">
          <h2 className="text-lg font-bold text-[#0f172a] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#af101a]" />
            <span>Daftar Resume Saya</span>
          </h2>

          <div className="border border-dashed border-[#e2e8f0] p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center mx-auto mb-3 text-[#5d5e61]">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#1a1b22] mb-1">Belum ada CV yang dibuat</h3>
            <p className="text-xs text-[#5d5e61] max-w-sm mx-auto mb-4">
              Mulai buat CV berstandar ATS pertama Anda menggunakan template terstruktur kami.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setNotice("Editor Pembuat CV akan segera aktif di tahap berikutnya!")}
            >
              Mulai Buat CV
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
