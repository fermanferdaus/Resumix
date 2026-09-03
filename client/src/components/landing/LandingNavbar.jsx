import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { Coffee, ArrowRight, Menu, X, LayoutDashboard, User } from "lucide-react";

export const LandingNavbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-xs">
      {/* Top Micro Status Bar */}
      <div className="bg-[#0f172a] text-[#cbd5e1] text-[11px] font-mono-code py-1.5 px-4 sm:px-8 border-b border-[#1e293b]">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-[#22c55e] animate-pulse"></span>
            <span className="font-semibold text-white tracking-wider">ATS ENGINE READY</span>
            <span className="text-[#475569] hidden md:inline">/</span>
            <span className="text-[#94a3b8] hidden md:inline">
              100% Format Baku Satu Kolom &middot; Kompatibel Sistem Rekrutmen Global
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://saweria.co/fermanferdaus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#eab308] hover:text-[#fde047] flex items-center gap-1.5 transition-colors font-semibold"
              title="Dukung pengembangan Resumix"
            >
              <Coffee className="w-3 h-3 text-[#eab308]" />
              <span>Traktir Kopi</span>
            </a>
            <span className="text-[#475569] hidden sm:inline">/</span>
            <span className="text-[#94a3b8] hidden sm:inline">100% Bebas Biaya</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="border-b border-[#e2e8f0] w-full h-16 bg-white">
        <div className="flex justify-between items-center px-4 sm:px-8 w-full max-w-screen-2xl mx-auto h-full">
          {/* Brand with Descriptor */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/logo.png"
              alt="Resumix"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex items-center gap-2.5">
              <span className="hidden sm:inline-block w-px h-4 bg-[#cbd5e1]"></span>
              <span className="hidden sm:inline-block text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#af101a] bg-[#fef2f2] px-1.5 py-0.5 border border-[#fecaca]">
                ATS CV BUILDER
              </span>
            </div>
          </Link>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            <a
              href="#template-showcase"
              className="text-xs font-semibold text-[#475569] hover:text-[#af101a] hover:bg-[#f8fafc] px-3 py-2 transition-colors"
            >
              Template
            </a>
            <a
              href="#keunggulan"
              className="text-xs font-semibold text-[#475569] hover:text-[#af101a] hover:bg-[#f8fafc] px-3 py-2 transition-colors"
            >
              Fitur
            </a>
            <a
              href="#faq"
              className="text-xs font-semibold text-[#475569] hover:text-[#af101a] hover:bg-[#f8fafc] px-3 py-2 transition-colors"
            >
              FAQ
            </a>
          </div>

          {/* Actions (Desktop) */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" title="Profil Akun">
                  <div className="h-9 px-2.5 border border-[#cbd5e1] bg-[#f8fafc] hover:border-[#af101a] flex items-center gap-2 text-xs font-semibold text-[#0f172a] transition-colors">
                    <User className="w-3.5 h-3.5 text-[#af101a]" />
                    <span className="max-w-[100px] truncate">{user?.name || "Profil"}</span>
                  </div>
                </Link>
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs h-9 px-4 rounded-none flex items-center gap-1.5 shadow-xs"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard CV</span>
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs font-semibold text-[#0f172a] border-[#cbd5e1] hover:border-[#0f172a] hover:bg-[#f8fafc] h-9 px-4 rounded-none"
                  >
                    Masuk
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="sm"
                    className="bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs font-semibold h-9 px-4 rounded-none flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Buat CV Gratis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button
                  size="sm"
                  className="bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs h-8 px-2.5 rounded-none"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 px-2.5 rounded-none"
                >
                  Masuk
                </Button>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-[#5d5e61] hover:text-[#0f172a] transition-colors"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#e2e8f0] px-4 py-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex flex-col space-y-2">
            <a
              href="#template-showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#0f172a] py-1.5 border-b border-[#f1f5f9]"
            >
              Template ATS
            </a>
            <a
              href="#keunggulan"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#0f172a] py-1.5 border-b border-[#f1f5f9]"
            >
              Fitur
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#0f172a] py-1.5 border-b border-[#f1f5f9]"
            >
              FAQ
            </a>
            <a
              href="https://saweria.co/fermanferdaus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-[#854d0e] py-1.5 flex items-center gap-1.5"
            >
              <Coffee className="w-3.5 h-3.5 text-[#eab308]" />
              <span>Traktir Kopi (Saweria)</span>
            </a>
          </div>

          <div className="pt-2">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs h-9 rounded-none">
                  Buka Dashboard Resume
                </Button>
              </Link>
            ) : (
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs h-9 rounded-none">
                  Buat CV ATS Sekarang
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

