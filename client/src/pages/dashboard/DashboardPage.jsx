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
import { DeleteConfirmModal } from "../../components/common/DeleteConfirmModal.jsx";
import { ResumeA4Preview } from "../../components/editor/ResumeA4Preview.jsx";
import { resumeApi } from "../../api/resumeApi.js";
import { appConfig } from "../../config/appConfig.js";
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
  Loader2,
  X,
  Coffee,
  ExternalLink,
  Mail,
  FileCheck,
} from "lucide-react";

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

  // Handlers
  const handleOpenCreateModal = () => {
    if (resumes.length >= 5) {
      setErrorMessage(
        "Batas maksimal 5 CV telah tercapai. Silakan hapus salah satu CV terlebih dahulu untuk membuat CV baru."
      );
      return;
    }
    setIsCreateOpen(true);
  };

  const handleCreateResume = async (formData) => {
    setErrorMessage("");
    if (resumes.length >= 5) {
      setErrorMessage(
        "Batas maksimal 5 CV telah tercapai. Silakan hapus salah satu CV terlebih dahulu untuk membuat CV baru."
      );
      return;
    }
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
    if (resumes.length >= 5) {
      setErrorMessage(
        "Batas maksimal 5 CV telah tercapai. Silakan hapus salah satu CV terlebih dahulu untuk menduplikasi."
      );
      return;
    }
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
      <div className="min-h-screen bg-[#fbf8ff] flex flex-col text-[#1a1b22] rounded-none pt-16 print:hidden">
        <Navbar />

        <main className="w-full mx-auto px-4 sm:px-6 pt-6 pb-2 flex-1">
          {/* 1. Full Dashboard Skeleton saat initial load */}
          {isInitialLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="w-full flex flex-col gap-6">
              {/* Top Area: Main Grid & Sidebar */}
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
                      <span
                        className={`text-xs font-mono-code px-2 py-0.5 rounded-none border ${
                          resumes.length >= 5
                            ? "bg-[#fef2f2] text-[#af101a] border-[#fecaca] font-bold"
                            : "bg-[#f8fafc] text-[#5d5e61] border-[#e2e8f0]"
                        }`}
                      >
                        [{resumes.length}/5 CV{resumes.length >= 5 ? " - Batas Tercapai" : ""}]
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
                        onClick={handleOpenCreateModal}
                        className={`bg-white border border-dashed transition-colors flex flex-col items-center justify-center p-6 min-h-[220px] cursor-pointer group rounded-none ${
                          resumes.length >= 5
                            ? "border-[#fecaca] bg-[#fef2f2]/30 opacity-80 hover:border-[#af101a]"
                            : "border-[#e2e8f0] hover:border-[#af101a] hover:bg-[#fef2f2]/20"
                        }`}
                        title={
                          resumes.length >= 5
                            ? "Batas kuota 5 CV telah tercapai. Hapus salah satu CV untuk membuat yang baru."
                            : "Buat Resume CV Baru"
                        }
                      >
                        <div className="w-12 h-12 rounded-none border border-[#e2e8f0] group-hover:border-[#af101a] group-hover:bg-white bg-[#f8fafc] flex items-center justify-center mb-3 text-[#5d5e61] group-hover:text-[#af101a] transition-colors">
                          <Plus className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-mono-code uppercase font-semibold text-[#1a1b22] group-hover:text-[#af101a] tracking-wider transition-colors">
                          + Buat CV Baru
                        </span>
                        {resumes.length >= 5 && (
                          <span className="text-[10px] font-mono-code text-[#af101a] mt-1 font-bold">
                            (Batas 5 CV Tercapai)
                          </span>
                        )}
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
                        Kualitas Resume ATS
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

                {/* 2. Standar Format ATS Widget (5 Poin Praktis) */}
                <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col gap-3 rounded-none">
                  <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-[#af101a]" />
                      <h3 className="text-sm font-bold text-[#0f172a] font-mono-code uppercase">
                        Standar Format ATS
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono-code bg-[#f8fafc] text-[#5d5e61] border border-[#e2e8f0] px-1.5 py-0.5 rounded-none font-semibold">
                      Panduan
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5d5e61] leading-relaxed">
                    Panduan praktis menyusun resume agar lolos seleksi otomatis dan mudah dibaca rekruter:
                  </p>

                  <ul className="space-y-2.5 text-xs text-[#5d5e61]">
                    <li className="flex items-start gap-2">
                      <span className="text-[#af101a] font-bold text-xs mt-0.5">•</span>
                      <span>
                        <strong className="text-[#0f172a]">Tata Letak 1 Kolom:</strong> Susun konten lurus ke bawah. Jangan bagi halaman menjadi dua kolom agar urutan pembacaan teks tidak saling bertabrakan.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#af101a] font-bold text-xs mt-0.5">•</span>
                      <span>
                        <strong className="text-[#0f172a]">Kronologi Terbalik:</strong> Tulis riwayat pengalaman kerja dan riwayat pendidikan mulai dari posisi paling baru hingga paling lama.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#af101a] font-bold text-xs mt-0.5">•</span>
                      <span>
                        <strong className="text-[#0f172a]">Fokus Hasil & Angka:</strong> Tulis pencapaian dengan data terukur (contoh: <em>"Meningkatkan efisiensi kerja 25%"</em>), bukan sekadar menyalin daftar tugas rutin.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#af101a] font-bold text-xs mt-0.5">•</span>
                      <span>
                        <strong className="text-[#0f172a]">Sesuaikan Kata Kunci:</strong> Cantumkan istilah teknis, keterampilan, atau sertifikasi yang tertulis pada kualifikasi lowongan yang dituju.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#af101a] font-bold text-xs mt-0.5">•</span>
                      <span>
                        <strong className="text-[#0f172a]">Format Teks Bersih:</strong> Hindari tabel bertingkat, grafik bar keahlian, foto profil, atau ikon dekoratif yang memicu error pembacaan.
                      </span>
                    </li>
                  </ul>
                </div>
              </aside>
            </div>

            {/* Section Bawah Full-Width: Panduan, Dukungan, & Masukan */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Tips ATS Pro */}
              <div className="bg-[#fef2f2] border border-[#fecaca] p-5 flex flex-col justify-between rounded-none">
                <div>
                  <div className="flex items-center gap-2 text-[#af101a] mb-2">
                    <Lightbulb className="w-4 h-4 flex-shrink-0" />
                    <span className="text-xs font-mono-code uppercase font-bold tracking-wider">
                      Tips ATS Pro
                    </span>
                  </div>
                  <p className="text-xs text-[#1a1b22] leading-relaxed">
                    Sesuaikan kata kunci keahlian pada resume Anda dengan deskripsi lowongan kerja untuk meningkatkan skor seleksi awal hingga 40%.
                  </p>
                </div>
              </div>

              {/* Card 2: Traktir Kopi */}
              <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col justify-between rounded-none hover:border-[#eab308]/60 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-[#fefce8] border border-[#fef08a] text-[#ca8a04] flex items-center justify-center flex-shrink-0 rounded-none">
                      <Coffee className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-mono-code uppercase font-bold tracking-wider text-[#0f172a]">
                      Traktir Kopi
                    </span>
                  </div>
                  <p className="text-xs text-[#5d5e61] leading-relaxed mb-3">
                    Suka dengan Resumix? Dukung pengembangan aplikasi ini melalui Saweria!
                  </p>
                </div>
                <a
                  href={appConfig.saweriaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#faad14] hover:bg-[#d48806] text-[#1a1b22] font-semibold text-xs py-2 px-3 transition-colors rounded-none cursor-pointer"
                >
                  <Coffee className="w-3.5 h-3.5 text-[#1a1b22]" />
                  <span>Dukung via Saweria</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-75" />
                </a>
              </div>

              {/* Card 3: Kritik & Masukan */}
              <div className="bg-white border border-[#e2e8f0] p-5 flex flex-col justify-between rounded-none hover:border-[#af101a]/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-[#f0f9ff] border border-[#bae6fd] text-[#0284c7] flex items-center justify-center flex-shrink-0 rounded-none">
                      <Mail className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-mono-code uppercase font-bold tracking-wider text-[#0f172a]">
                      Kritik & Masukan
                    </span>
                  </div>
                  <p className="text-xs text-[#5d5e61] leading-relaxed mb-3">
                    Punya ide fitur baru atau kendala? Hubungi kami langsung via email.
                  </p>
                </div>
                <a
                  href={`mailto:${appConfig.feedbackEmail}?subject=Feedback%20Resumix%20ATS%20Builder`}
                  className="inline-flex items-center justify-center gap-2 bg-[#f8fafc] hover:bg-[#f1f5f9] text-[#0f172a] border border-[#e2e8f0] hover:border-[#cbd5e1] font-semibold text-xs py-2 px-3 transition-colors rounded-none cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-[#5d5e61]" />
                  <span>Hubungi via Email</span>
                  <ExternalLink className="w-3 h-3 ml-auto opacity-75" />
                </a>
              </div>
            </div>
            </div>
          )}
        </main>

        {/* Reusable Footer Component */}
        <Footer className="mt-4" />

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
        isOpen={Boolean(deleteTarget)}
        title="Hapus Resume Ini?"
        description={
          deleteTarget ? (
            <span>
              Anda akan menghapus resume{" "}
              <strong className="text-[#1a1b22]">"{deleteTarget.title}"</strong> secara
              permanen. Tindakan ini tidak dapat dibatalkan.
            </span>
          ) : (
            "Apakah Anda yakin ingin menghapus resume ini secara permanen?"
          )
        }
        confirmText="Ya, Hapus Resume"
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDeleteResume(deleteTarget.id)}
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
