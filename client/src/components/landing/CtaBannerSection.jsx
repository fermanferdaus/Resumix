import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { ArrowRight, Sparkles } from "lucide-react";

export const CtaBannerSection = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-16 bg-[#1a1c1e] text-white border-b border-[#0f172a]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#ffb3ac]" />
            <span className="text-xs font-mono-code uppercase font-bold text-[#ffb3ac] tracking-widest">
              SIAPKAN BLUEPRINT ANDA
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Siap Mengirimkan Lamaran Kerja dengan Percaya Diri?
          </h2>
          <p className="text-xs sm:text-sm text-[#c6c6c9] mt-2 leading-relaxed">
            Mulai susun riwayat profesional Anda dengan standar ATS terbaik hari ini. 100% gratis, tanpa biaya berlangganan tersembunyi.
          </p>
        </div>

        <div>
          <Link to={isAuthenticated ? "/dashboard" : "/login"}>
            <Button
              size="lg"
              className="bg-[#af101a] hover:bg-[#d32f2f] text-white font-semibold text-sm px-8 py-5 rounded-none flex items-center gap-2 shadow-lg transition-all"
            >
              <span>{isAuthenticated ? "Buka Dashboard CV" : "Buat CV Sekarang"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

