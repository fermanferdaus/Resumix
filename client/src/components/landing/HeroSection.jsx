import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { ArrowRight, FileText, CheckCircle2, Radar, Mail, Link as LinkIcon } from "lucide-react";

export const HeroSection = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="relative w-full py-16 md:py-24 border-b border-[#e2e8f0] bg-[#fbf8ff] bg-grid-pattern overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
        {/* Left: Headline & CTAs */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-mono-code text-[#5d5e61] uppercase tracking-widest flex items-center gap-2">
              <span className="w-8 h-px bg-[#5d5e61]"></span>
              ATS COMPLIANT STANDARD // SYSTEM READY
            </span>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#0f172a] leading-[1.1] tracking-tight">
              Construct Your <br className="hidden sm:inline" />
              <span className="text-[#af101a]">Career Blueprint.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#334155] max-w-xl leading-relaxed">
              Bangun resume profesional yang menembus <em>Applicant Tracking Systems</em> (ATS) dengan presisi. Format standar satu kolom, tipografi terkalibrasi, tanpa kompromi.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <Button
                size="lg"
                className="bg-[#af101a] hover:bg-[#1a1c1e] text-white font-semibold text-sm px-6 py-5 rounded-none flex items-center gap-2 transition-all shadow-sm"
              >
                <span>{isAuthenticated ? "Buka Dashboard CV" : "Buat CV Sekarang"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>

            <a href="#template-showcase">
              <Button
                variant="outline"
                size="lg"
                className="bg-white hover:bg-[#f1f5f9] text-[#0f172a] border-[#1a1c1e] font-semibold text-sm px-6 py-5 rounded-none flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-[#5d5e61]" />
                <span>Lihat Template ATS</span>
              </Button>
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-[#e2e8f0]">
            <div>
              <span className="text-2xl sm:text-3xl font-bold text-[#0f172a] block">
                99.8%
              </span>
              <span className="text-[11px] font-mono-code text-[#5d5e61] uppercase tracking-wider block mt-0.5">
                ATS Parse Rate
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
                Gratis Selamanya
              </span>
            </div>
          </div>
        </div>

        {/* Right: Visual Bento arrangement from Stitch */}
        <div className="lg:col-span-6 relative w-full flex justify-center lg:justify-end items-center min-h-[440px] sm:min-h-[500px]">
          {/* Main Realistic Resume Preview Card */}
          <div className="w-full sm:w-[88%] bg-white border border-[#cbd5e1] p-6 sm:p-7 z-10 shadow-sm flex flex-col gap-5 select-none">
            {/* Header Resume */}
            <div className="flex justify-between items-start border-b border-[#cbd5e1] pb-4">
              <div>
                <h2 className="text-lg font-bold text-[#0f172a] tracking-tight uppercase">
                  ALEX J. MERCER
                </h2>
                <p className="text-xs font-mono-code font-bold text-[#af101a]">
                  Senior Software Engineer
                </p>
                <p className="text-[10px] text-[#5d5e61] mt-1 font-mono-code">
                  +62 812 3456 7890 / alex.mercer@example.com / Jakarta, Indonesia
                </p>
              </div>
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
              <div className="text-[10px] font-bold text-[#0f172a]">
                Lead Platform Engineer / Tech Corp Nusantara
              </div>
              <ul className="text-[10px] text-[#334155] space-y-1 list-disc pl-4 leading-relaxed">
                <li>
                  Merancang arsitektur microservices performa tinggi dengan throughput 25.000 RPS.
                </li>
                <li>
                  Mengoptimalkan database query Postgres yang memangkas waktu pemrosesan transaksi sebesar 42%.
                </li>
              </ul>
            </div>

            {/* Skills Architecture */}
            <div className="space-y-2 pt-2 border-t border-[#f1f5f9]">
              <span className="text-[11px] font-bold text-[#0f172a] uppercase tracking-wider block">
                Keahlian Teknis
              </span>
              <div className="flex flex-wrap gap-1.5">
                {["REACT", "TYPESCRIPT", "NODE.JS", "POSTGRESQL", "DOCKER", "REST API"].map(
                  (skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-[#f8fafc] border border-[#e2e8f0] text-[10px] font-mono-code font-semibold text-[#0f172a]"
                    >
                      {skill}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Floating ATS Scanner Card (Overlay) */}
          <div className="absolute -left-2 sm:left-4 bottom-2 sm:-bottom-4 w-[92%] sm:w-[62%] bg-white border-2 border-[#1a1c1e] p-4 z-20 shadow-[6px_6px_0_0_rgba(26,28,30,1)]">
            <div className="flex items-center justify-between gap-2 mb-3 border-b border-[#e2e8f0] pb-2">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-[#af101a] animate-pulse" />
                <span className="text-xs font-mono-code font-bold text-[#0f172a] uppercase">
                  ATS Scanner Active
                </span>
              </div>
              <span className="text-[10px] font-mono-code px-1.5 py-0.5 bg-[#f1f5f9] border border-[#e2e8f0] text-[#0f172a]">
                VERIFIED
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[11px] font-mono-code mb-1">
                  <span className="text-[#5d5e61]">Keyword Match</span>
                  <span className="text-[#0f172a] font-bold">94%</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[#af101a] w-[94%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono-code mb-1">
                  <span className="text-[#5d5e61]">Formatting Integrity</span>
                  <span className="text-[#0f172a] font-bold">100%</span>
                </div>
                <div className="w-full h-2 bg-[#f1f5f9] relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full bg-[#1a1c1e] w-full"></div>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-[#f1f5f9] flex items-center gap-2 text-xs font-medium text-[#166534] bg-[#f0fdf4] p-2 border border-[#bbf7d0]">
                <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
                <span className="font-mono-code text-[11px] font-bold">
                  100% Parsed Successfully
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
