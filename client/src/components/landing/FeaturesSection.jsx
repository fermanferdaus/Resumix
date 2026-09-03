import { Shield, Eye, Move, Lock, HelpCircle } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Format Bersih Lolos ATS",
      description:
        "Tata letak satu kolom yang mudah dipindai mesin seleksi perusahaan tanpa risiko teks terpotong atau salah baca.",
    },
    {
      icon: Eye,
      title: "Pratinjau Lembar A4 Langsung",
      description:
        "Tampilan di layar editor sama persis dengan lembar PDF yang Anda unduh, jadi tidak ada kejutan posisi tulisan bergeser.",
    },
    {
      icon: Move,
      title: "Geser & Atur Urutan Bebas",
      description:
        "Mudah mengubah urutan pengalaman kerja, riwayat pendidikan, hingga poin kegiatan organisasi sesuai posisi yang dilamar.",
    },
    {
      icon: Lock,
      title: "Aman & Bebas Iklan",
      description:
        "Data tersimpan aman di akun Anda. Tanpa iklan yang mengganggu dan bisa membuat hingga 5 resume untuk berbagai lamaran.",
    },
  ];

  const faqs = [
    {
      q: "Mengapa hanya ada 1 pilihan template?",
      a: "Sistem ATS dan rekruter lebih mengutamakan keterbacaan isi daripada desain warna-warni. Format satu kolom ini adalah standar industri yang paling aman dan diterima di berbagai perusahaan.",
    },
    {
      q: "Apakah benar-benar gratis?",
      a: "Ya, 100% gratis. Anda bisa membuat, mengedit, dan mengunduh file PDF kapan saja tanpa watermark dan tanpa biaya langganan.",
    },
    {
      q: "Bagaimana cara mengunduh CV setelah selesai?",
      a: "Klik tombol Cetak / Unduh PDF di halaman editor. CV Anda akan langsung di-render menjadi file PDF teks asli yang tajam dan siap dikirim.",
    },
  ];

  return (
    <section id="keunggulan" className="py-20 border-b border-[#e2e8f0] bg-[#fbf8ff]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono-code text-[#af101a] uppercase font-bold tracking-wider block mb-2">
            FITUR UTAMA
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
            Fokus pada Isi CV, Tanpa Pusing Atur Format
          </h2>
          <p className="text-sm sm:text-base text-[#5d5e61] mt-3 leading-relaxed">
            Menulis CV yang rapi tidak perlu menghabiskan waktu berjam-jam mengatur margin atau jarak spasi. Semua sudah disesuaikan agar Anda bisa langsung siap melamar kerja.
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
                  <span>STANDAR_ATS</span>
                  <span className="text-[#166534] font-bold">AKTIF</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Sub-section */}
        <div id="faq" className="max-w-4xl mx-auto pt-10 border-t border-[#e2e8f0]">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-mono-code text-[#af101a] uppercase font-bold tracking-wider block mb-1">
              TANYA JAWAB
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

