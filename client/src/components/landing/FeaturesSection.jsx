import { Shield, Eye, Move, Lock, HelpCircle } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "100% Lolos Parsing ATS",
      description:
        "Format teks satu kolom linier tanpa tabel tersembunyi, ikon grafis, atau rating bintang yang sering menyebabkan data kandidat rusak di sistem HR.",
    },
    {
      icon: Eye,
      title: "Pratinjau Lembar A4 Real-Time",
      description:
        "Pratinjau langsung berdampingan dengan formulir. Apa yang Anda lihat di layar adalah 100% presisi sama dengan lembar dokumen PDF yang dicetak.",
    },
    {
      icon: Move,
      title: "Drag & Drop Urutan Bagian",
      description:
        "Fleksibilitas penuh mengatur susunan riwayat pengalaman, pendidikan, proyek, hingga poin-poin kegiatan organisasi dengan mudah.",
    },
    {
      icon: Lock,
      title: "Keamanan Akun & Privasi Terjaga",
      description:
        "Sesi login terlindungi selama 12 jam, autentikasi terenkripsi, kuota 5 resume mandiri per akun, dan tanpa iklan pelacak.",
    },
  ];

  const faqs = [
    {
      q: "Mengapa Resumix hanya memiliki 1 template?",
      a: "Sistem ATS (seperti Workday dan Taleo) bekerja paling efektif dengan tata letak satu kolom yang bersih. Memiliki puluhan template warna-warni justru memperbesar risiko kegagalan parsing. Satu template standar industri ini dirancang agar dapat digunakan melamar ke perusahaan mana pun dengan rasa aman.",
    },
    {
      q: "Apakah Resumix mengenakan biaya langganan atau unduhan?",
      a: "Tidak. Resumix 100% gratis digunakan tanpa biaya berlangganan dan tanpa watermark. Anda dapat membuat hingga 5 resume berbeda untuk berbagai posisi lamaran kerja.",
    },
    {
      q: "Bagaimana cara mengekspor dokumen setelah selesai dibuat?",
      a: "Cukup klik tombol Cetak / Unduh PDF di dalam editor. Dokumen akan langsung di-render menjadi PDF berbasis teks vektor asli berkualitas tinggi yang siap dikirim ke portal lowongan kerja.",
    },
  ];

  return (
    <section id="keunggulan" className="py-20 border-b border-[#e2e8f0] bg-[#fbf8ff]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono-code text-[#af101a] uppercase font-bold tracking-widest block mb-2">
            // ARCHITECTURAL ADVANTAGES
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
            Keunggulan Teknis yang Dibangun untuk Anda
          </h2>
          <p className="text-sm sm:text-base text-[#5d5e61] mt-3 leading-relaxed">
            Setiap komponen Resumix dikembangkan untuk memberikan keunggulan kompetitif pada berkas lamaran kerja Anda.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {features.map((feat, idx) => {
            const IconComponent = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-[#e2e8f0] p-6 hover:border-[#1a1c1e] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 bg-[#f8fafc] border border-[#e2e8f0] flex items-center justify-center text-[#af101a] mb-4">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#0f172a] mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#5d5e61] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-[#f1f5f9] flex justify-between items-center text-[10px] font-mono-code text-[#94a3b8]">
                  <span>FEATURE_0{idx + 1}</span>
                  <span className="text-[#166534] font-bold">READY</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Sub-section */}
        <div id="faq" className="max-w-4xl mx-auto pt-10 border-t border-[#e2e8f0]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono-code text-[#af101a] uppercase font-bold tracking-wider block mb-1">
              FAQ
            </span>
            <h3 className="text-2xl font-bold text-[#0f172a]">
              Pertanyaan yang Sering Diajukan
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e2e8f0] p-5 transition-colors hover:border-[#cbd5e1]"
              >
                <h4 className="text-sm font-bold text-[#0f172a] flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-[#af101a] shrink-0" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#5d5e61] leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

