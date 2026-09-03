import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../../components/ui/button.jsx";
import { Home, RefreshCw, LayoutDashboard, AlertTriangle } from "lucide-react";

export const ServerErrorPage = ({ error, resetErrorBoundary }) => {
  const { isAuthenticated } = useAuthStore();

  const handleReload = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf8ff] text-[#0f172a] bg-grid-pattern selection:bg-[#af101a] selection:text-white">
      {/* Top Header */}
      <header className="h-16 border-b border-[#e2e8f0] bg-white px-4 sm:px-8 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Resumix" className="h-7 w-auto object-contain" />
          <span className="text-[10px] font-mono-code text-[#af101a] border-l border-[#cbd5e1] pl-2 hidden sm:inline">
            SYSTEM_EXCEPTION
          </span>
        </Link>
        <div className="text-[11px] font-mono-code text-[#af101a] font-bold">
          HTTP_STATUS: 500
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white border-2 border-[#1a1c1e] p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(26,28,30,1)] flex flex-col items-center text-center animate-in fade-in duration-200">
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-mono-code font-bold text-[#af101a] bg-[#fee2e2] px-2.5 py-1 border border-[#fecaca] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>STATUS 500 // SERVER_ERROR</span>
            </span>
          </div>

          {/* Big Number */}
          <h1 className="text-6xl sm:text-7xl font-mono-code font-bold tracking-tight text-[#0f172a] mb-2">
            500<span className="text-[#af101a]">.</span>
          </h1>

          {/* Heading & Explanation */}
          <h2 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight mb-2">
            Terjadi Kendala Sistem
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] max-w-md leading-relaxed mb-6">
            Aplikasi mengalami kendala tak terduga saat memproses data. Data resume Anda tetap aman. Coba muat ulang halaman ini atau kembali ke dashboard.
          </p>

          {/* Error Message Diagnostic Snippet */}
          {error && (
            <div className="w-full bg-[#f8fafc] border border-[#cbd5e1] p-3 mb-6 text-left font-mono-code text-[11px] space-y-1 text-[#475569]">
              <div className="text-[10px] text-[#94a3b8] font-bold">EXCEPTION_DETAIL:</div>
              <div className="text-[#af101a] break-all">
                {error.message || String(error)}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-2.5 justify-center">
            <Button
              variant="outline"
              onClick={handleReload}
              className="text-xs font-semibold h-10 border-[#cbd5e1] hover:border-[#0f172a] rounded-none flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Muat Ulang</span>
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

