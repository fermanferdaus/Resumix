import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { Skeleton } from "../ui/skeleton.jsx";
import { ArrowRight, FileText, CheckCircle2, Radar, Mail, Link as LinkIcon, RefreshCw } from "lucide-react";

export const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();
  const [isScanning, setIsScanning] = useState(false);

  const handleTriggerScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1400);
  };

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-[#e2e8f0] bg-[#fbf8ff] bg-grid-pattern overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left: Headline & CTAs */}
        <div className="lg:col-span-6 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col gap-4">
            {/* Tag & Status Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono-code text-[#af101a] font-bold uppercase tracking-wider flex items-center gap-2">
                <span className="w-6 h-0.5 bg-[#af101a]"></span>
                STANDAR ATS RESMI
              </span>
              <span className="text-[10px] font-mono-code bg-[#f1f5f9] text-[#475569] px-2 py-0.5 border border-[#cbd5e1]">
                100% BEBAS BIAYA
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-[1.15] tracking-tight">
              Bikin CV ATS Rapi yang <br className="hidden sm:inline" />
              <span className="text-[#af101a]">Siap Dibaca Rekruter.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#475569] max-w-xl leading-relaxed">
              Format satu kolom bersih dan terstruktur rapi agar terbaca jelas oleh sistem ATS maupun tim HRD. Gratis dipakai, tanpa watermark, dan langsung bisa diunduh ke PDF siap kirim.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1 text-xs text-[#334155] font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#af101a]"></span>
                Lolos Parser Workday & Taleo
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#af101a]"></span>
                Teks PDF Asli (Bisa Di-copy)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-[#af101a]"></span>
                Bebas Watermark & Iklan
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex flex-wrap gap-3">
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button
                  size="lg"
                  className="bg-[#af101a] hover:bg-[#1a1c1e] text-white font-semibold text-sm px-7 py-5 rounded-none flex items-center gap-2 transition-all shadow-sm active:translate-y-0.5"
                >
                  <span>{isAuthenticated ? "Buka Dashboard CV" : "Buat CV Sekarang"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <a href="#template-showcase">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-[#f1f5f9] text-[#0f172a] border-[#1a1c1e] font-semibold text-sm px-6 py-5 rounded-none flex items-center gap-2 transition-colors active:translate-y-0.5"
                >
                  <FileText className="w-4 h-4 text-[#5d5e61]" />
                  <span>Lihat Contoh CV</span>
                </Button>
              </a>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-5 mt-2 border-t border-[#e2e8f0]">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#0f172a] block">
                99.8%
              </span>
              <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider block mt-0.5">
                Akurasi ATS
              </span>
            </div>
            <div className="border-l border-[#e2e8f0] pl-4">
              <span className="text-2xl sm:text-3xl font-bold text-[#0f172a] block">
                1
              </span>
              <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider block mt-0.5">
                Template Standar
              </span>
            </div>
            <div className="border-l border-[#e2e8f0] pl-4">
              <span className="text-2xl sm:text-3xl font-bold text-[#af101a] block">
                100%
              </span>
              <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider block mt-0.5">
                Gratis Dipakai
              </span>
            </div>
          </div>
        </div>

        {/* Right: Visual Bento arrangement from Stitch with Animated Scanning */}
        <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end items-center min-h-[460px] sm:min-h-[520px]">
          {/* Main Realistic Resume Preview Card */}
          <div className="relative w-full sm:w-[88%] bg-white border border-[#cbd5e1] p-6 sm:p-7 z-10 shadow-sm flex flex-col gap-5 select-none hover:-translate-y-1 transition-transform duration-300 overflow-hidden">
            {/* Laser Line Scanning Effect */}
            <div
              className={`absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#af101a] to-transparent shadow-[0_0_10px_#af101a] pointer-events-none z-20 ${
                isScanning ? "animate-scan-line" : "animate-scan-line opacity-40"
              }`}
            ></div>

            {/* Header Resume */}
            <div className="flex justify-between items-start border-b border-[#cbd5e1] pb-4">
              {isScanning ? (
                <div className="w-full space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-64" />
                </div>
              ) : (
                <div>
                  <h2 className="text-lg font-bold text-[#0f172a] tracking-tight uppercase">
                    RADITYA PRATAMA
                  </h2>
                  <p className="text-xs font-mono-code font-bold text-[#af101a]">
                    Senior Full Stack Developer
                  </p>
                  <p className="text-[10px] text-[#5d5e61] mt-1 font-mono-code">
                    +62 812 3456 7890 / raditya.pratama@email.com / Jakarta, Indonesia
                  </p>
                </div>
              )}
              <div className="flex gap-2 text-[#94a3b8]">
                <Mail className="w-4 h-4" />
                <LinkIcon className="w-4 h-4" />
              </div>
            </div>

            {/* Experience Block */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider">
                  Pengalaman Kerja
                </span>
                <span className="text-[10px] text-[#5d5e61] font-mono-code">
                  2021 – Sekarang
                </span>
              </div>
              {isScanning ? (
                <div className="space-y-2 py-1">
                  <Skeleton className="h-4 w-56" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              ) : (
                <>
                  <div className="text-[10px] font-bold text-[#0f172a]">
                    Lead Software Engineer / PT Inovasi Digital Nusantara
                  </div>
                  <ul className="text-[10px] text-[#334155] space-y-1 list-disc pl-4 leading-relaxed">
                    <li>
                      Memimpin tim 8 orang mengembangkan sistem web berskala besar dengan 100.000+ pengguna aktif.
                    </li>
                    <li>
                      Memangkas waktu deployment dari 4 jam menjadi 15 menit menggunakan pipeline CI/CD otomatis.
                    </li>
                  </ul>
                </>
              )}
            </div>

            {/* Skills Architecture */}
            <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider block">
                Keahlian Teknis
              </span>
              {isScanning ? (
                <div className="flex flex-wrap gap-1.5">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {["REACT", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "DOCKER", "REST API"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 bg-[#f8fafc] border border-[#e2e8f0] text-[10px] font-mono-code font-semibold text-[#0f172a] hover:border-[#af101a] transition-colors"
                      >
                        {skill}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Floating ATS Scanner Card (Overlay) */}
          <div className="absolute -left-2 sm:left-4 bottom-2 sm:-bottom-4 w-[92%] sm:w-[64%] bg-white border-2 border-[#1a1c1e] p-4 z-20 shadow-[6px_6px_0_0_rgba(26,28,30,1)]">
            <div className="flex items-center justify-between gap-2 mb-3 border-b border-[#e2e8f0] pb-2">
              <div className="flex items-center gap-2">
                <Radar className={`w-4 h-4 text-[#af101a] ${isScanning ? "animate-spin" : "animate-pulse"}`} />
                <span className="text-xs font-mono-code font-bold text-[#0f172a] uppercase">
                  {isScanning ? "Memindai Format ATS..." : "Pemeriksaan Format ATS"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleTriggerScan}
                disabled={isScanning}
                className="flex items-center gap-1 text-[10px] font-mono-code px-1.5 py-0.5 bg-[#f8fafc] hover:bg-[#e2e8f0] border border-[#cbd5e1] text-[#0f172a] transition-colors cursor-pointer disabled:opacity-50"
                title="Klik untuk uji simulasi parsing ATS"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isScanning ? "animate-spin text-[#af101a]" : ""}`} />
                <span>{isScanning ? "Proses..." : "Uji Scan"}</span>
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-mono-code mb-1">
                  <span className="text-[#5d5e61]">Keterbacaan Teks</span>
                  <span className="text-[#0f172a] font-bold">{isScanning ? "..." : "94%"}</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#af101a] transition-all duration-700 ease-out"
                    style={{ width: isScanning ? "35%" : "94%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono-code mb-1">
                  <span className="text-[#5d5e61]">Kesesuaian Format</span>
                  <span className="text-[#0f172a] font-bold">{isScanning ? "..." : "100%"}</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] relative overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-[#1a1c1e] transition-all duration-700 ease-out"
                    style={{ width: isScanning ? "50%" : "100%" }}
                  ></div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center gap-2 text-xs font-medium text-[#166534] bg-[#f0fdf4] p-2 border border-[#bbf7d0]">
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                <span className="font-mono-code text-[11px] font-bold">
                  {isScanning ? "Mengekstrak token teks..." : "Format Siap Dikirim ke Portal Kerja"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
