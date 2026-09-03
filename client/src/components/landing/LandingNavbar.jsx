import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { Button } from "../ui/button.jsx";
import { Coffee, ArrowRight, Menu, X, LayoutDashboard, User } from "lucide-react";

export const LandingNavbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-[#e2e8f0] w-full h-16 sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 sm:px-8 w-full max-w-screen-2xl mx-auto h-full">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="Resumix"
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Links (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#template-showcase"
            className="text-sm font-medium text-[#5d5e61] hover:text-[#af101a] transition-colors"
          >
            Template ATS
          </a>
          <a
            href="#keunggulan"
            className="text-sm font-medium text-[#5d5e61] hover:text-[#af101a] transition-colors"
          >
            Keunggulan
          </a>
          <a
            href="#faq"
            className="text-sm font-medium text-[#5d5e61] hover:text-[#af101a] transition-colors"
          >
            Tanya Jawab
          </a>
        </div>

        {/* Actions (Desktop) */}
        <div className="hidden sm:flex items-center gap-3">

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" title="Profil Pengguna">
                <div className="w-8 h-8 border border-[#cbd5e1] bg-[#f8fafc] hover:border-[#af101a] flex items-center justify-center text-xs font-bold text-[#0f172a] transition-colors">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
                </div>
              </Link>
              <Link to="/dashboard">
                <Button
                  size="sm"
                  className="bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs h-8 px-3 rounded-none flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-[#af101a] hover:bg-[#1a1c1e] text-white text-xs h-8 px-3.5 rounded-none flex items-center gap-1"
                >
                  <span>Buat CV</span>
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
              Keunggulan
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-semibold text-[#0f172a] py-1.5 border-b border-[#f1f5f9]"
            >
              Tanya Jawab
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
    </nav>
  );
};

