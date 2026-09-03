import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { Check, ArrowRight, ShieldCheck, Printer, Cpu, FileCheck } from "lucide-react";

export const TemplateShowcaseSection = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section id="template-showcase" className="py-20 border-b border-[#e2e8f0] bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
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

        {/* Grid: Preview & Explanations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Realistic Full A4 Resume Preview */}
          <div className="lg:col-span-7 bg-[#f8fafc] border border-[#cbd5e1] p-4 sm:p-8">
            <div className="bg-white border-2 border-[#1a1c1e] p-6 sm:p-10 shadow-[6px_6px_0_0_rgba(26,28,30,1)] text-[#0f172a]">
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

