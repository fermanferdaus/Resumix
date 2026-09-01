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
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col justify-between text-[#1a1b22] rounded-none">
      <div>
        <Navbar />

        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
          {/* Notice Banner */}
          {notice && (
            <div className="mb-6">
              <Alert variant="info" onClose={() => setNotice("")}>
                <span>{notice}</span>
              </Alert>
            </div>
          )}

          {/* Hero Banner (Soft Flat 2.0 / Clean Minimalist) */}
          <div className="bg-white border border-[#e2e8f0] p-6 sm:p-10 mb-8 rounded-none">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#fef2f2] border border-[#fecaca] text-xs font-mono-code uppercase font-semibold text-[#af101a] mb-4 rounded-none">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>&lt;Workspace Aktif /&gt;</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
                  Selamat datang, <span className="text-[#af101a]">{user?.fullName || "Pengguna"}</span>!
                </h1>
                <p className="text-sm text-[#5d5e61] mt-2 max-w-xl leading-relaxed">
                  Bangun resume berstandar Applicant Tracking System (ATS) profesional dengan struktur data presisi dan ekspor PDF siap kerja.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto">
                <Button
                  size="lg"
                  className="flex items-center gap-2 rounded-none"
                  onClick={() => setNotice("Editor Pembuat CV akan segera aktif di tahap berikutnya!")}
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat CV Baru</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-none"
                  onClick={() => setNotice("Template ATS terstruktur siap digunakan!")}
                >
                  Lihat Template
                </Button>
              </div>
            </div>
          </div>

          {/* Minimalist Stats Counters Row (Sesuai Referensi Clean Soft Flat) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-[#e2e8f0] p-5 text-center rounded-none">
              <div className="text-2xl sm:text-3xl font-bold text-[#af101a] font-mono-code mb-1">0</div>
              <div className="text-xs font-semibold text-[#1a1b22] uppercase tracking-wider">Total Resume</div>
              <div className="text-[11px] text-[#5d5e61] mt-1">Draf Tersimpan</div>
            </div>

            <div className="bg-white border border-[#e2e8f0] p-5 text-center rounded-none">
              <div className="text-2xl sm:text-3xl font-bold text-[#1a1b22] font-mono-code mb-1">100%</div>
              <div className="text-xs font-semibold text-[#1a1b22] uppercase tracking-wider">ATS Score Ready</div>
              <div className="text-[11px] text-[#5d5e61] mt-1">Standar Format Baku</div>
            </div>

            <div className="bg-white border border-[#e2e8f0] p-5 text-center rounded-none">
              <div className="text-2xl sm:text-3xl font-bold text-[#1a1b22] font-mono-code mb-1">1</div>
              <div className="text-xs font-semibold text-[#1a1b22] uppercase tracking-wider">Template Aktif</div>
              <div className="text-[11px] text-[#5d5e61] mt-1">Single Clean Layout</div>
            </div>

            <div className="bg-white border border-[#e2e8f0] p-5 text-center rounded-none">
              <div className="text-2xl sm:text-3xl font-bold text-[#15803d] font-mono-code mb-1">24/7</div>
              <div className="text-xs font-semibold text-[#1a1b22] uppercase tracking-wider">Cloud Storage</div>
              <div className="text-[11px] text-[#5d5e61] mt-1">Akses Kapan Saja</div>
            </div>
          </div>

          {/* Kartu Status & Info Akun */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-[#e2e8f0] p-5 rounded-none">
              <div className="text-xs font-mono-code uppercase text-[#5d5e61] mb-1">Email Terdaftar</div>
              <div className="text-sm font-semibold text-[#1a1b22] truncate">{user?.email}</div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#15803d]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Akun Terverifikasi via OTP</span>
              </div>
            </div>

            <div className="bg-white border border-[#e2e8f0] p-5 rounded-none">
              <div className="text-xs font-mono-code uppercase text-[#5d5e61] mb-1">ID Publik (UUIDv7)</div>
              <div className="text-xs font-mono-code text-[#1a1b22] truncate">{user?.id || "N/A"}</div>
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[#1a1b22]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#af101a]" />
                <span>Keamanan Arsitektur Dual-ID</span>
              </div>
            </div>
          </div>

          {/* Daftar CV User */}
          <div className="bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-none">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-[#0f172a] flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#af101a]" />
                <span>Daftar Resume Anda</span>
              </h2>
              <div className="text-xs font-mono-code text-[#5d5e61]">
                [ 0 / 1 Dokumen ]
              </div>
            </div>

            <div className="border border-dashed border-[#e2e8f0] p-12 text-center bg-[#fafafa] rounded-none">
              <div className="w-12 h-12 rounded-none bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center mx-auto mb-3 text-[#af101a]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#1a1b22] mb-1">Belum ada resume yang dibuat</h3>
              <p className="text-xs text-[#5d5e61] max-w-sm mx-auto mb-5 leading-relaxed">
                Mulai buat CV standar ATS pertama Anda menggunakan formulir 2-panel terstruktur kami.
              </p>
              <Button
                variant="primary"
                size="sm"
                className="rounded-none"
                onClick={() => setNotice("Editor Pembuat CV akan segera aktif di tahap berikutnya!")}
              >
                Mulai Buat Resume Sekarang
              </Button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer Minimalist */}
      <footer className="w-full bg-white border-t border-[#e2e8f0] py-6 px-4 sm:px-6 mt-12 rounded-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs text-[#5d5e61] gap-4">
          <div className="flex items-center gap-2 font-semibold text-[#1a1b22]">
            <span>Resumix ATS CV Builder</span>
            <span className="text-[10px] px-2 py-0.5 bg-[#fef2f2] border border-[#fecaca] text-[#af101a] font-mono-code">v1.0.0</span>
          </div>
          <div>© 2026 Resumix. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:underline hover:text-[#af101a] transition-colors">Dokumentasi API</a>
            <a href="#" className="hover:underline hover:text-[#af101a] transition-colors">Privasi</a>
            <a href="#" className="hover:underline hover:text-[#af101a] transition-colors">Syarat & Ketentuan</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
