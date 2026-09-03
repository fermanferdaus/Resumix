import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../../components/ui/button.jsx";
import { Home, ArrowLeft, LayoutDashboard, SearchX } from "lucide-react";

export const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ff] text-[#0f172a] bg-grid-pattern selection:bg-[#af101a] selection:text-white">
      {/* Top Header */}
      <header className="h-16 border-b border-[#e2e8f0] bg-white px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Resumix" className="h-7 w-auto object-contain" />
          <span className="text-[10px] font-mono-code text-[#5d5e61] border-l border-[#cbd5e1] pl-2 hidden sm:inline">
            ERROR_DISPATCHER
          </span>
        </Link>
        <div className="text-[11px] font-mono-code text-[#5d5e61]">
          HTTP_STATUS: 404
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white border-2 border-[#1a1c1e] p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(26,28,30,1)] flex flex-col items-center text-center animate-in fade-in duration-200">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono-code font-bold text-[#af101a] bg-[#fee2e2] px-2.5 py-1 border border-[#fecaca] flex items-center gap-1.5">
              <SearchX className="w-3.5 h-3.5" />
              <span>STATUS 404 // NOT_FOUND</span>
            </span>
          </div>

          {/* Big Number */}
          <h1 className="text-6xl sm:text-7xl font-mono-code font-bold tracking-tight text-[#0f172a] mb-2">
            404<span className="text-[#af101a]">.</span>
          </h1>

          {/* Heading & Explanation */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight mb-2">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-md leading-relaxed mb-6">
            Alamat yang Anda tuju tidak tersedia atau telah dipindahkan. Pastikan penulisan URL sudah tepat atau kembali ke halaman utama.
          </p>

          {/* Terminal Diagnostic Info */}
          <div className="w-full bg-[#f8fafc] border border-[#cbd5e1] p-3 mb-6 text-left font-mono-code text-[11px] space-y-1 text-[#475569]">
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">TARGET_PATH:</span>
              <span className="text-[#0f172a] font-semibold truncate max-w-[240px]">
                {location.pathname || "/"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#94a3b8]">RESOLUTION:</span>
              <span className="text-[#af101a]">UNMAPPED_ROUTE</span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-2.5 justify-center">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="text-xs font-semibold h-10 border-[#cbd5e1] hover:border-[#0f172a] rounded-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="flex-1">
                <Button className="w-full text-xs font-semibold h-10 bg-[#af101a] hover:bg-[#1a1c1e] text-white rounded-none flex items-center justify-center gap-1.5 shadow-xs">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Buka Dashboard</span>
                </Button>
              </Link>
            ) : (
              <Link to="/" className="flex-1">
                <Button className="w-full text-xs font-semibold h-10 bg-[#af101a] hover:bg-[#1a1c1e] text-white rounded-none flex items-center justify-center gap-1.5 shadow-xs">
                  <Home className="w-3.5 h-3.5" />
                  <span>Ke Halaman Utama</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-[#e2e8f0] bg-white px-4 sm:px-8 flex items-center justify-between text-[11px] text-[#64748b] font-mono-code">
        <span>RESUMIX ATS CV BUILDER</span>
        <span>© 2026</span>
      </footer>
    </div>
  );
};

