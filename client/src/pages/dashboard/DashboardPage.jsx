import { useState, useEffect } from "react";
import { Navbar } from "../../components/layout/Navbar.jsx";
import { Footer } from "../../components/layout/Footer.jsx";
import { useAuthStore } from "../../store/authStore.js";
import { authApi } from "../../api/authApi.js";
import { Input } from "../../components/ui/input.jsx";
import { Alert } from "../../components/ui/alert.jsx";
import { ResumeCard } from "../../components/dashboard/ResumeCard.jsx";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton.jsx";
import { CreateResumeModal } from "../../components/dashboard/CreateResumeModal.jsx";
import { RenameResumeModal } from "../../components/dashboard/RenameResumeModal.jsx";
import { DeleteConfirmModal } from "../../components/dashboard/DeleteConfirmModal.jsx";
import {
  useResumesQuery,
  useCreateResumeMutation,
  useUpdateResumeMutation,
  useDuplicateResumeMutation,
  useDeleteResumeMutation,
} from "../../hooks/useResumeQueries.js";
import {
  Plus,
  Search,
  CheckCircle2,
  Lightbulb,
  FileText,
  Clock,
} from "lucide-react";

export const DashboardPage = () => {
  const { user, setUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Queries & Mutations
  const { data: resumesData, isLoading: isResumesLoading } = useResumesQuery({
    search: searchTerm || undefined,
  });
  const createResumeMutation = useCreateResumeMutation();
  const updateResumeMutation = useUpdateResumeMutation();
  const duplicateResumeMutation = useDuplicateResumeMutation();
  const deleteResumeMutation = useDeleteResumeMutation();

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

  const isInitialLoading = isResumesLoading && !resumesData;
  const resumes = resumesData?.data || [];

  // Handlers
  const handleCreateResume = async (formData) => {
    setErrorMessage("");
    try {
      await createResumeMutation.mutateAsync(formData);
      setIsCreateOpen(false);
      setNotice(`Resume "${formData.title}" berhasil dibuat!`);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal membuat resume baru. Silakan coba lagi."
      );
    }
  };

  const handleRenameResume = async ({ id, title, targetRole }) => {
    setErrorMessage("");
    try {
      await updateResumeMutation.mutateAsync({
        id,
        data: { title, targetRole },
      });
      setRenameTarget(null);
      setNotice("Informasi resume berhasil diperbarui!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal memperbarui judul resume."
      );
    }
  };

  const handleDuplicateResume = async (id) => {
    setErrorMessage("");
    try {
      await duplicateResumeMutation.mutateAsync(id);
      setNotice("Resume berhasil diduplikasi!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal menduplikasi resume."
      );
    }
  };

  const handleDeleteResume = async (id) => {
    setErrorMessage("");
    try {
      await deleteResumeMutation.mutateAsync(id);
      setDeleteTarget(null);
      setNotice("Resume telah berhasil dihapus.");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Gagal menghapus resume."
      );
    }
  };

  const handleEditResume = (resume) => {
    setNotice(
      `Editor Pembuat CV untuk "${resume.title}" akan segera aktif di tahap berikutnya!`
    );
  };

  return (
    <div className="min-h-screen bg-[#fbf8ff] flex flex-col justify-between text-[#1a1b22] rounded-none">
      <div>
        <Navbar />

        <main className="w-full mx-auto px-4 sm:px-6 py-8">
          {/* 1. Full Dashboard Skeleton saat initial load */}
          {isInitialLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="w-full flex flex-col lg:flex-row gap-8">
              {/* Left/Main Panel (Flex-grow) */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Header Selamat Datang */}
                <header className="bg-white border border-[#e2e8f0] p-6 sm:p-8 rounded-none">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] tracking-tight">
                    Selamat datang kembali,{" "}
                    <span className="text-[#af101a]">{user?.fullName || "Pengguna"}</span>
                  </h1>
                  <p className="text-sm text-[#5d5e61] mt-1 leading-relaxed">
                    Kelola profil resume profesional Anda dan persiapkan diri untuk meraih peluang karir impian.
                  </p>
                </header>

                {/* Alert Notifikasi Global */}
                {notice && (
                  <Alert variant="info" onClose={() => setNotice("")}>
                    <span>{notice}</span>
                  </Alert>
                )}

                {errorMessage && (
                  <Alert variant="error" onClose={() => setErrorMessage("")}>
                    <span>{errorMessage}</span>
                  </Alert>
                )}

                {/* Section Daftar Resume */}
                <section className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-[#0f172a] tracking-tight">
                        Daftar Resume Saya
                      </h2>
                      <span className="text-xs font-mono-code text-[#5d5e61] bg-[#f8fafc] border border-[#e2e8f0] px-2 py-0.5 rounded-none">
                        [{resumes.length} CV]
                      </span>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full sm:w-64 relative">
                      <Search className="w-4 h-4 text-[#5d5e61] absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        type="text"
                        placeholder="Cari resume..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 py-1.5 text-xs rounded-none"
                      />
                    </div>
                  </div>

                  {/* Grid Resume Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* 1. Tombol Card 'Buat CV Baru' */}
                    <div
                      onClick={() => setIsCreateOpen(true)}
                      className="bg-white border border-dashed border-[#e2e8f0] hover:border-[#af101a] hover:bg-[#fef2f2]/20 transition-colors flex flex-col items-center justify-center p-6 min-h-[220px] cursor-pointer group rounded-none"
                    >
                      <div className="w-12 h-12 rounded-none border border-[#e2e8f0] group-hover:border-[#af101a] group-hover:bg-white bg-[#f8fafc] flex items-center justify-center mb-3 text-[#5d5e61] group-hover:text-[#af101a] transition-colors">
                        <Plus className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-mono-code uppercase font-semibold text-[#1a1b22] group-hover:text-[#af101a] tracking-wider transition-colors">
                        + Buat CV Baru
                      </span>
                    </div>

                    {/* 2. Daftar Kartu Resume */}
                    {resumes.map((resume) => (
                      <ResumeCard
                        key={resume.id}
                        resume={resume}
                        onEdit={handleEditResume}
                        onRename={(r) => setRenameTarget(r)}
                        onDuplicate={handleDuplicateResume}
                        onDelete={(r) => setDeleteTarget(r)}
                      />
                    ))}
                  </div>

                  {/* Empty State jika pencarian tidak menemukan hasil */}
                  {resumes.length === 0 && searchTerm && (
                    <div className="bg-white border border-[#e2e8f0] p-8 text-center rounded-none">
                      <p className="text-xs text-[#5d5e61]">
                        Tidak ditemukan resume dengan kata kunci "<strong>{searchTerm}</strong>".
                      </p>
                    </div>
                  )}
                </section>
              </div>

              {/* Right Panel / Sidebar (Inspired by Stitch) */}
              <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                {/* 1. Profile Strength / ATS Score Widget */}
                <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
                  <div className="flex justify-between items-end">
                    <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
                      Kekuatan Resume ATS
                    </h3>
                    <span className="text-xs font-mono-code font-bold text-[#af101a]">
                      100%
                    </span>
                  </div>

                  {/* Flat Progress Bar */}
                  <div className="w-full bg-[#f1f5f9] h-2 rounded-none overflow-hidden">
                    <div className="bg-[#af101a] h-full w-full rounded-none" />
                  </div>

                  <p className="text-xs text-[#5d5e61] mt-1 leading-relaxed">
                    Struktur data resume Anda telah memenuhi kaidah algoritma parser ATS.
                  </p>

                  {/* Checklist Poin ATS */}
                  <ul className="flex flex-col gap-2 mt-2 pt-3 border-t border-[#f1f5f9] text-xs">
                    <li className="flex items-center gap-2 text-[#1a1b22]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0" />
                      <span>Struktur Heading Terstandarisasi</span>
                    </li>
                    <li className="flex items-center gap-2 text-[#1a1b22]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0" />
                      <span>Kronologi Pengalaman Kerja Terstruktur</span>
                    </li>
                    <li className="flex items-center gap-2 text-[#1a1b22]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0" />
                      <span>Format Tipografi Bebas Simbol Non-Standar</span>
                    </li>
                  </ul>
                </div>

                {/* 2. Recent Activity Widget */}
                <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
                  <h3 className="text-sm font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-2 font-mono-code uppercase">
                    Aktivitas Terbaru
                  </h3>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 bg-[#fef2f2] border border-[#fecaca] text-[#af101a] flex items-center justify-center flex-shrink-0 mt-0.5 rounded-none">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1a1b22]">
                          Ruang Kerja Resume Aktif
                        </p>
                        <p className="text-[11px] text-[#5d5e61] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>Hari ini</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <div className="w-6 h-6 bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] flex items-center justify-center flex-shrink-0 mt-0.5 rounded-none">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#1a1b22]">
                          Autentikasi Akun Terverifikasi
                        </p>
                        <p className="text-[11px] text-[#5d5e61] flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          <span>{user?.email || "Email akun"}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Pro Tip Card (Soft Flat Red Tint) */}
                <div className="bg-[#fef2f2] border border-[#fecaca] p-5 flex flex-col gap-2 rounded-none">
                  <div className="flex items-center gap-2 text-[#af101a]">
                    <Lightbulb className="w-4 h-4" />
                    <span className="text-xs font-mono-code uppercase font-bold tracking-wider">
                      Tips ATS Pro
                    </span>
                  </div>
                  <p className="text-xs text-[#1a1b22] leading-relaxed">
                    Sesuaikan kata kunci keahlian pada resume Anda dengan deskripsi lowongan kerja untuk meningkatkan skor seleksi awal hingga 40%.
                  </p>
                </div>
              </aside>
            </div>
          )}
        </main>
      </div>

      {/* Reusable Footer Component */}
      <Footer />

      {/* Modals */}
      <CreateResumeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateResume}
        isLoading={createResumeMutation.isPending}
      />

      <RenameResumeModal
        isOpen={!!renameTarget}
        resume={renameTarget}
        onClose={() => setRenameTarget(null)}
        onSubmit={handleRenameResume}
        isLoading={updateResumeMutation.isPending}
      />

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        resume={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteResume}
        isLoading={deleteResumeMutation.isPending}
      />
    </div>
  );
};
