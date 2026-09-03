import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { ArrowRight } from "lucide-react";

export const CtaBannerSection = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <section className="py-16 bg-[#1a1c1e] text-white border-b border-[#0f172a]">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Siap Bikin CV yang Lebih Rapi?
          </h2>
          <p className="text-xs sm:text-sm text-[#c6c6c9] mt-2 leading-relaxed">
            Buat resume ATS Anda dalam beberapa menit. 100% gratis, tanpa watermark, dan langsung bisa diunduh ke format PDF.
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

