import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { Skeleton } from "../ui/skeleton.jsx";
import { Check, ArrowRight, ShieldCheck, Printer, Cpu, FileCheck, Eye, Terminal } from "lucide-react";

export const TemplateShowcaseSection = () => {
  const { isAuthenticated } = useAuthStore();
  const [viewMode, setViewMode] = useState("document"); // "document" | "parser"

  return (
    <section id="template-showcase" className="py-20 border-b border-[#e2e8f0] bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-mono-code text-[#af101a] uppercase font-bold tracking-wider block mb-2">
            TEMPLATE STANDAR
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
            Satu Template Bersih untuk Semua Lamaran Kerja
          </h2>
          <p className="text-sm sm:text-base text-[#5d5e61] mt-3 leading-relaxed">
            Banyak sistem ATS gagal membaca CV yang memakai kolom ganda, tabel rumit, atau ikon grafis. Template ini menggunakan format satu kolom yang rapi, disukai rekruter, dan kompatibel dengan software ATS perusahaan seperti Workday, Taleo, dan Greenhouse.
          </p>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setViewMode("document")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              viewMode === "document"
                ? "bg-[#1a1c1e] text-white border-[#1a1c1e]"
                : "bg-white text-[#475569] border-[#cbd5e1] hover:border-[#1a1c1e]"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Tampilan Dokumen A4</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("parser")}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
              viewMode === "parser"
                ? "bg-[#af101a] text-white border-[#af101a]"
                : "bg-white text-[#475569] border-[#cbd5e1] hover:border-[#af101a]"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Deteksi Mesin ATS (Token View)</span>
          </button>
          <span className="text-[11px] text-[#64748b] font-mono-code ml-2 hidden sm:inline">
            {viewMode === "document" ? "← Pratinjau hasil cetak" : "← Cara robot ATS membaca berkas"}
          </span>
        </div>

        {/* Grid: Preview & Explanations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Full A4 Resume Preview / Parser Skeleton View */}
          <div className="lg:col-span-7 bg-[#f8fafc] border border-[#cbd5e1] p-4 sm:p-8">
            <div className="bg-white border-2 border-[#1a1c1e] p-6 sm:p-10 shadow-[6px_6px_0_0_rgba(26,28,30,1)] text-[#0f172a] transition-all">
              {viewMode === "document" ? (
                /* Document View Mode */
                <div className="animate-in fade-in duration-200">
                  {/* CV Header */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold uppercase tracking-tight text-black">
                      RADITYA PRATAMA, S.KOM.
                    </h3>
                    <div className="text-sm font-bold text-black mt-0.5">
                      Senior Full Stack Developer
                    </div>
                    <div className="text-[10px] text-black font-normal mt-1 border-b-2 border-dotted border-[#777] pb-2">
                      +62 812 3456 7890 / raditya.pratama@email.com / linkedin.com/in/radityapratama / Jakarta, Indonesia
                    </div>
                  </div>

                  {/* Ringkasan Profil */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">
                      PROFIL
                    </h4>
                    <p className="text-[10px] leading-relaxed text-black text-justify">
                      Software Engineer berpengalaman 6+ tahun dalam merancang dan mengembangkan sistem web berskala besar. Mahir mengoptimalkan arsitektur cloud, microservices Node.js/Go, dan antarmuka web performa tinggi menggunakan React & Next.js.
                    </p>
                  </div>

                  {/* Pengalaman Kerja */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                      PENGALAMAN KERJA
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] font-bold uppercase text-black">
                          LEAD FULL STACK ENGINEER / PT INOVASI DIGITAL NUSANTARA
                        </div>
                        <div className="text-[10px] text-black mb-1">
                          Januari 2022 – Sekarang
                        </div>
                        <ul className="text-[10px] text-black list-disc pl-4 space-y-0.5 text-justify leading-relaxed">
                          <li>
                            Memimpin tim beranggotakan 8 developer dalam migrasi sistem monolit ke microservices, meningkatkan efisiensi deploy sebesar 65%.
                          </li>
                          <li>
                            Merancang pipeline CI/CD otomatis berbasis Docker & GitHub Actions yang mengurangi waktu rilis produk dari 4 jam menjadi 15 menit.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold uppercase text-black">
                          SOFTWARE ENGINEER / PT SOLUSI TEKNOLOGI ASIA
                        </div>
                        <div className="text-[10px] text-black mb-1 border-b-2 border-dotted border-[#777] pb-2">
                          Februari 2019 – Desember 2021
                        </div>
                        <ul className="text-[10px] text-black list-disc pl-4 space-y-0.5 text-justify leading-relaxed">
                          <li>
                            Mengembangkan modul pembayaran digital dengan integrasi multi-gateway (Midtrans, Xendit) dengan success rate transaksi 99.9%.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Pendidikan */}
                  <div className="mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">
                      PENDIDIKAN
                    </h4>
                    <div>
                      <div className="text-[10px] font-bold uppercase text-black">
                        SARJANA KOMPUTER (S.KOM.) / IPK: 3.82
                      </div>
                      <div className="text-[10px] text-black mb-1 border-b-2 border-dotted border-[#777] pb-2">
                        UNIVERSITAS INDONESIA (2015 – 2019)
                      </div>
                    </div>
                  </div>

                  {/* Keahlian */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-black mb-1">
                      KEAHLIAN
                    </h4>
                    <div className="text-[10px] leading-relaxed text-black space-y-0.5">
                      <div>
                        <strong>Bahasa Pemrograman:</strong> JavaScript (ES6+), TypeScript, Golang, SQL, HTML5, CSS3
                      </div>
                      <div>
                        <strong>Framework & Database:</strong> React, Next.js, Node.js, Express, PostgreSQL, Redis
                      </div>
                      <div>
                        <strong>Tools & Infrastruktur:</strong> Docker, Git, Linux, AWS, CI/CD Pipelines
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ATS Parser Skeleton View Mode */
                <div className="space-y-4 font-mono-code animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                    <span className="text-[11px] text-[#166534] font-bold">
                      [PARSER STATUS: LINEAR_TOKENS_OK]
                    </span>
                    <span className="text-[10px] text-[#64748b]">ENGINE: WORKDAY_STRICT</span>
                  </div>

                  {/* Header Parsed Tokens */}
                  <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#af101a] bg-[#fee2e2] px-1">
                        ENTITAS: NAMA_KANDIDAT
                      </span>
                      <span className="text-[10px] text-[#166534] font-bold">100% MATCH</span>
                    </div>
                    <div className="text-xs font-bold text-[#0f172a]">RADITYA PRATAMA, S.KOM.</div>
                    <div className="text-[10px] text-[#5d5e61]">
                      TARGET: Senior Full Stack Developer &middot; KONTAK: Terverifikasi (Email + Telp + LinkedIn)
                    </div>
                    <Skeleton className="h-1.5 w-full bg-[#cbd5e1]" />
                  </div>

                  {/* Experience Parsed Tokens */}
                  <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#0f172a] bg-[#e2e8f0] px-1">
                        BAGIAN: PENGALAMAN_KERJA (KRONOLOGIS)
                      </span>
                      <span className="text-[10px] text-[#166534] font-bold">TERDETEKSI (2 ENTRI)</span>
                    </div>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between text-[10px] text-[#5d5e61]">
                        <span>ENTRI 1: Lead Full Stack Engineer</span>
                        <span>DURASI: 2022 - PRESENT</span>
                      </div>
                      <Skeleton className="h-2 w-full bg-[#cbd5e1]" />
                      <Skeleton className="h-2 w-5/6 bg-[#cbd5e1]" />
                    </div>
                  </div>

                  {/* Skills Keyword Token Index */}
                  <div className="p-3 bg-[#f8fafc] border border-[#cbd5e1] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#0f172a] bg-[#e2e8f0] px-1">
                        BAGIAN: KEAHLIAN_TEKNIS (KEYWORD MAP)
                      </span>
                      <span className="text-[10px] text-[#166534] font-bold">12 KATA KUNCI</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {["REACT", "TYPESCRIPT", "GOLANG", "NODE.JS", "POSTGRESQL", "DOCKER", "AWS", "CI/CD"].map(
                        (k) => (
                          <span
                            key={k}
                            className="px-1.5 py-0.5 bg-[#f0fdf4] border border-[#bbf7d0] text-[9px] font-bold text-[#166534]"
                          >
                            +{k}
                          </span>
                        )
                      )}
                    </div>
                    <Skeleton className="h-1.5 w-3/4 bg-[#cbd5e1]" />
                  </div>

                  <div className="text-[10px] text-[#166534] p-2 bg-[#f0fdf4] border border-[#bbf7d0] text-center font-bold">
                    ✓ Parser Berhasil Membaca 100% Tanpa Hilang Karakter
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Technical Badges & Blueprint Rules */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-[#f8fafc] border border-[#e2e8f0] space-y-4">
              <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#af101a]" />
                Kenapa Template Ini Aman untuk ATS?
              </h3>
              <p className="text-xs text-[#5d5e61] leading-relaxed">
                Dirancang mengikuti kaidah utama yang memudahkan sistem seleksi membaca data Anda:
              </p>

              <div className="space-y-3.5 pt-1">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-[#1a1c1e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0f172a] block">
                      Susunan Satu Kolom
                    </span>
                    <span className="text-[11px] text-[#5d5e61] leading-relaxed block mt-0.5">
                      Teks dibaca urut dari atas ke bawah tanpa risiko kalimat tertukar antar kolom.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-[#1a1c1e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0f172a] block">
                      Judul Bagian Baku
                    </span>
                    <span className="text-[11px] text-[#5d5e61] leading-relaxed block mt-0.5">
                      Memakai nama bagian standar (Pengalaman Kerja, Pendidikan, Keahlian) yang mudah dipindai sistem.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-[#1a1c1e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0f172a] block">
                      Tanpa Elemen Mengganggu
                    </span>
                    <span className="text-[11px] text-[#5d5e61] leading-relaxed block mt-0.5">
                      Bebas rating bintang, bar keahlian, atau tabel tersembunyi yang sering menggagalkan proses membaca CV.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-[#1a1c1e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0f172a] block">
                      File PDF Teks Asli
                    </span>
                    <span className="text-[11px] text-[#5d5e61] leading-relaxed block mt-0.5">
                      Hasil unduhan berupa teks digital asli yang tetap bisa diblok, disalin, dan dicari kata kuncinya.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Spec Highlights */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 bg-white border border-[#e2e8f0]">
                <Cpu className="w-5 h-5 text-[#af101a] mb-2" />
                <span className="text-xs font-bold text-[#0f172a] block">Kompatibilitas</span>
                <span className="text-[11px] text-[#5d5e61]">Workday, Greenhouse, Taleo, Lever</span>
              </div>
              <div className="p-4 bg-white border border-[#e2e8f0]">
                <Printer className="w-5 h-5 text-[#af101a] mb-2" />
                <span className="text-xs font-bold text-[#0f172a] block">Ukuran Kertas</span>
                <span className="text-[11px] text-[#5d5e61]">A4 Standar (210 x 297 mm)</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <Link to={isAuthenticated ? "/dashboard" : "/login"}>
                <Button
                  size="lg"
                  className="w-full bg-[#af101a] hover:bg-[#1a1c1e] text-white font-semibold text-sm h-12 rounded-none flex items-center justify-center gap-2 shadow-sm"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Gunakan Template Ini</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

