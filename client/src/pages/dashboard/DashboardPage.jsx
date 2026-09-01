import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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
import { ResumeA4Preview } from "../../components/editor/ResumeA4Preview.jsx";
import { resumeApi } from "../../api/resumeApi.js";
import {
  calculateAtsProgress,
  getAtsChecklist,
} from "../../lib/resumeScore.js";
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
  Circle,
  Lightbulb,
  FileText,
  Clock,
  Loader2,
  X,
} from "lucide-react";

const formatActivityTime = (dateString) => {
  if (!dateString) return "Baru saja";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return `${diffDays} hari lalu`;

    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Baru saja";
  }
};

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Debounce search input (350ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [printingResumeData, setPrintingResumeData] = useState(null);

  // Queries & Mutations
  const {
    data: resumesData,
    isLoading: isResumesLoading,
    isFetching: isResumesFetching,
  } = useResumesQuery({
    search: debouncedSearch || undefined,
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
  const resumes = useMemo(() => resumesData?.data || [], [resumesData]);
  const latestResume = resumes[0] || null;
  const latestResumeScore = latestResume
    ? calculateAtsProgress(latestResume.data)
    : 0;
  const latestChecklist = latestResume
    ? getAtsChecklist(latestResume.data)
    : [
        {
          id: "header",
          label: "Struktur Heading & Kontak Terstandarisasi",
          passed: false,
        },
        {
          id: "experience",
          label: "Kronologi Riwayat Pengalaman Kerja",
          passed: false,
        },
        {
          id: "education-skills",
          label: "Latar Belakang Pendidikan & Keahlian",
          passed: false,
        },
      ];

  // Membangun riwayat aktivitas nyata yang dilakukan akun & resume
  const activities = useMemo(() => {
    const list = [];

    // 1. Aktivitas resume (hingga 2 resume terbaru)
    if (resumes && resumes.length > 0) {
      resumes.slice(0, 2).forEach((r) => {
        const isNew =
          Math.abs(new Date(r.updatedAt) - new Date(r.createdAt)) < 60000;
        list.push({
          id: `resume-${r.id}`,
          icon: FileText,
          iconBg: "bg-[#fef2f2] border-[#fecaca] text-[#af101a]",
          title: isNew ? `Membuat "${r.title}"` : `Memperbarui "${r.title}"`,
          time: formatActivityTime(r.updatedAt),
          detail: r.targetRole ? `<${r.targetRole} />` : null,
        });
      });
    }

    // 2. Aktivitas akun terverifikasi / terdaftar
    if (user) {
      list.push({
        id: "account-verified",
        icon: CheckCircle2,
        iconBg: "bg-[#f0fdf4] border-[#bbf7d0] text-[#15803d]",
        title: user.isVerified
          ? "Autentikasi Akun Terverifikasi"
          : "Akun Terdaftar",
        time: formatActivityTime(user.createdAt),
        detail: user.email,
      });
    }

    return list;
  }, [resumes, user]);

  // Handlers
  const handleCreateResume = async (formData) => {
    setErrorMessage("");
    try {
      const res = await createResumeMutation.mutateAsync(formData);
      setIsCreateOpen(false);
      if (res.data?.id) {
        navigate(`/editor/${res.data.id}`);
      }
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
    navigate(`/editor/${resume.id}`);
  };

  const handleDownloadResume = async (resume) => {
    setErrorMessage("");
    try {
      setDownloadingId(resume.id);
      const res = await resumeApi.getResume(resume.id);
      const fullResume = res.data;

      const name =
        fullResume.data?.header?.fullName?.trim() ||
        user?.fullName?.trim() ||
        "Pengguna";
      const role =
        fullResume.data?.header?.targetRole?.trim() ||
        fullResume.targetRole?.trim() ||
        "Resume";
      const pdfFilename = `Resumix-${name}-${role}`;

      setPrintingResumeData(fullResume);

      // Render dan jalankan dialog cetak browser
      setTimeout(() => {
        const originalTitle = document.title;
        document.title = pdfFilename;
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
          setPrintingResumeData(null);
          setDownloadingId(null);
        }, 1000);
      }, 200);
    } catch (error) {
      console.error("Gagal mengunduh resume", error);
      setErrorMessage("Gagal mengunduh resume. Silakan coba lagi.");
      setDownloadingId(null);
      setPrintingResumeData(null);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#fbf8ff] flex flex-col justify-between text-[#1a1b22] rounded-none pt-16 print:hidden">
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
                    Kelola resume profesional Anda dan persiapkan diri untuk meraih peluang karir impian.
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
                    <div className="w-full sm:w-72 relative">
                      <Search className="w-4 h-4 text-[#5d5e61] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <Input
                        type="text"
                        placeholder="Cari nama atau posisi resume..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-9 py-1.5 text-xs rounded-none"
                      />
                      {/* Indikator status pencarian / tombol hapus */}
                      {(isResumesFetching || searchTerm !== debouncedSearch) ? (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#af101a]" />
                        </div>
                      ) : searchTerm ? (
                        <button
                          type="button"
                          onClick={() => {
                            setSearchTerm("");
                            setDebouncedSearch("");
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5d5e61] hover:text-[#0f172a] p-0.5 cursor-pointer transition-colors"
                          title="Hapus kata kunci pencarian"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Empty State jika pencarian tidak menemukan hasil */}
                  {resumes.length === 0 && debouncedSearch ? (
                    <div className="bg-white border border-[#e2e8f0] p-10 text-center rounded-none space-y-3">
                      <p className="text-xs text-[#5d5e61]">
                        Tidak ditemukan resume dengan kata kunci "<strong>{debouncedSearch}</strong>".
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearch("");
                        }}
                        className="text-xs text-[#af101a] font-semibold hover:underline cursor-pointer"
                      >
                        Reset Kata Kunci Pencarian
                      </button>
                    </div>
                  ) : (
                    /* Grid Resume Cards */
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 transition-opacity duration-200 ${
                        isResumesFetching ? "opacity-60" : "opacity-100"
                      }`}
                    >
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
                          onDownload={handleDownloadResume}
                          isDownloading={downloadingId === resume.id}
                        />
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Panel / Sidebar (Inspired by Stitch) */}
              <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
                {/* 1. Profile Strength / ATS Score Widget (Resume Terbaru) */}
                <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-[#0f172a] uppercase font-mono-code">
                        Kekuatan Resume ATS
                      </h3>
                      {latestResume ? (
                        <p className="text-[11px] text-[#5d5e61] truncate max-w-[190px] mt-0.5 font-medium" title={latestResume.title}>
                          {latestResume.title}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#5d5e61] mt-0.5">
                          Belum ada resume
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-mono-code font-bold text-[#af101a] flex-shrink-0">
                      {latestResumeScore}%
                    </span>
                  </div>

                  {/* Flat Progress Bar */}
                  <div className="w-full bg-[#f1f5f9] h-2 rounded-none overflow-hidden">
                    <div
                      className="bg-[#af101a] h-full transition-all duration-300 rounded-none"
                      style={{ width: `${latestResumeScore}%` }}
                    />
                  </div>

                  <p className="text-xs text-[#5d5e61] leading-relaxed">
                    {!latestResume
                      ? "Buat CV pertama Anda untuk mulai mengukur tingkat kesiapan dan kekuatan ATS."
                      : latestResumeScore >= 80
                      ? "Struktur data resume terbaru Anda telah memenuhi kaidah algoritma parser ATS."
                      : latestResumeScore >= 50
                      ? "Resume terbaru Anda cukup baik. Lengkapi bagian yang tersisa agar skor optimal."
                      : "Resume terbaru Anda masih dalam tahap awal. Lengkapi data untuk skor ATS maksimal."}
                  </p>

                  {/* Checklist Poin ATS Dinamis */}
                  <ul className="flex flex-col gap-2 mt-1 pt-3 border-t border-[#f1f5f9] text-xs">
                    {latestChecklist.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-center gap-2 ${
                          item.passed ? "text-[#1a1b22]" : "text-[#5d5e61]"
                        }`}
                      >
                        {item.passed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#15803d] flex-shrink-0" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                        )}
                        <span className={item.passed ? "font-medium" : ""}>
                          {item.label}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Recent Activity Widget (Aktivitas Nyata Akun) */}
                <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
                  <h3 className="text-sm font-bold text-[#0f172a] border-b border-[#e2e8f0] pb-2 font-mono-code uppercase">
                    Aktivitas Terbaru
                  </h3>

                  <div className="flex flex-col gap-3">
                    {activities.map((act) => {
                      const IconComponent = act.icon;
                      return (
                        <div key={act.id} className="flex items-start gap-2.5">
                          <div
                            className={`w-6 h-6 border flex items-center justify-center flex-shrink-0 mt-0.5 rounded-none ${act.iconBg}`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p
                              className="text-xs font-semibold text-[#1a1b22] truncate"
                              title={act.title}
                            >
                              {act.title}
                            </p>
                            <p className="text-[11px] text-[#5d5e61] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>{act.time}</span>
                              {act.detail && (
                                <>
                                  <span>•</span>
                                  <span
                                    className="truncate max-w-[140px]"
                                    title={act.detail}
                                  >
                                    {act.detail}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      );
                    })}
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

    {/* Hidden Container for Direct PDF Export from Dashboard */}
    {printingResumeData && (
      <div className="hidden print:block print:p-0 print:m-0 print:w-full print:bg-white">
        <ResumeA4Preview data={printingResumeData.data} />
      </div>
    )}
  </>
  );
};
