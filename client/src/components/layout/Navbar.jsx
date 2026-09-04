import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore.js";
import { authApi } from "../../api/authApi.js";
import { Button } from "../ui/button.jsx";
import {
  LogOut,
  User,
  Coffee,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { appConfig } from "../../config/appConfig.js";

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isDashboard = location.pathname.startsWith("/dashboard");
  const isProfile = location.pathname.startsWith("/profile");
  const isAdminPath = location.pathname.startsWith("/admin");
  const isTemplateOrEditor =
    location.pathname.startsWith("/editor") || location.pathname.startsWith("/templates");

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleLogout = async () => {
    closeMobileMenu();
    try {
      await authApi.logout();
    } catch {
      // Abaikan jika network error saat logout
    } finally {
      logout();
      navigate("/", { replace: true });
    }
  };

  const getAvatarFullUrl = (avatarUrl) => {
    if (!avatarUrl) return null;
    if (avatarUrl.startsWith("http://") || avatarUrl.startsWith("https://")) {
      return avatarUrl;
    }
    const base = appConfig.apiUrl.replace(/\/api\/v1\/?$/, "");
    return `${base}${avatarUrl.startsWith("/") ? "" : "/"}${avatarUrl}`;
  };

  const avatarSrc = getAvatarFullUrl(user?.avatarUrl);

  return (
    <header className="w-full bg-white border-b border-[#e2e8f0] fixed top-0 left-0 right-0 z-50 rounded-none print:hidden">
      <div className="w-full mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Left: Logo & Navigation */}
        <div className="flex items-center gap-8 h-full">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Resumix Logo"
              className="h-8 w-auto object-contain rounded-none"
            />
          </Link>

          {/* Navigation Links (Desktop Saja) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium h-full">
            <Link
              to="/dashboard"
              className={`h-full flex items-center pt-[2px] transition-colors ${
                isDashboard
                  ? "border-b-2 border-[#af101a] text-[#af101a] font-semibold"
                  : "text-[#5d5e61] hover:text-[#1a1b22]"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard"
              className={`h-full flex items-center pt-[2px] transition-colors ${
                isTemplateOrEditor
                  ? "border-b-2 border-[#af101a] text-[#af101a] font-semibold"
                  : "text-[#5d5e61] hover:text-[#1a1b22]"
              }`}
            >
              Editor
            </Link>

            <Link
              to="/profile"
              className={`h-full flex items-center pt-[2px] transition-colors ${
                isProfile
                  ? "border-b-2 border-[#af101a] text-[#af101a] font-semibold"
                  : "text-[#5d5e61] hover:text-[#1a1b22]"
              }`}
            >
              Profil
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                className={`h-full flex items-center gap-1.5 pt-[2px] transition-colors ${
                  isAdminPath
                    ? "border-b-2 border-[#af101a] text-[#af101a] font-semibold"
                    : "text-[#5d5e61] hover:text-[#1a1b22]"
                }`}
              >
                Admin Panel
              </Link>
            )}
          </nav>
        </div>

        {/* Right: Traktir Kopi, User Profile & Logout */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Tombol Traktir Kopi Saweria */}
          <a
            href={appConfig.saweriaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 p-2 sm:px-3 sm:py-1.5 h-8 bg-[#faad14] hover:bg-[#d48806] text-[#1a1b22] font-semibold text-xs transition-colors rounded-none border border-[#d48806] cursor-pointer"
            title="Dukung Resumix / Traktir Kopi via Saweria"
          >
            <Coffee className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Traktir Kopi</span>
          </a>

          {/* User Profile Avatar & Name Link */}
          <Link
            to="/profile"
            className="flex items-center gap-2 text-sm text-[#1a1b22] font-medium hover:opacity-85 transition-opacity cursor-pointer group"
            title="Buka Pengaturan Profil"
          >
            <div className="w-8 h-8 rounded-none bg-[#fef2f2] border border-[#fecaca] group-hover:border-[#af101a] overflow-hidden flex items-center justify-center text-[#af101a] font-bold transition-colors">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.fullName || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.fullName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />
              )}
            </div>
            <span className="hidden sm:inline font-semibold group-hover:text-[#af101a] transition-colors">
              {user?.fullName || user?.email}
            </span>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 text-xs rounded-none h-8 px-2 sm:px-3"
            title="Keluar dari akun"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </Button>

          {/* Hamburger Menu Toggle Button (Khusus Mobile) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-8 h-8 text-[#1a1b22] hover:text-[#af101a] hover:bg-[#f8fafc] border border-[#e2e8f0] rounded-none transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation (Khusus Mobile) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#e2e8f0] shadow-md animate-in slide-in-from-top-2 duration-150">
          <div className="p-3 border-b border-[#f1f5f9] bg-[#fbf8ff] flex items-center gap-3">
            <div className="w-8 h-8 rounded-none bg-[#fef2f2] border border-[#fecaca] overflow-hidden flex items-center justify-center text-[#af101a] font-bold shrink-0">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user?.fullName || "Avatar"}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.fullName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#0f172a] truncate">
                {user?.fullName || "Pengguna Resumix"}
              </p>
              <p className="text-[11px] text-[#5d5e61] truncate font-mono-code">
                {user?.email}
              </p>
            </div>
            {user?.role === "ADMIN" && (
              <span className="text-[10px] font-mono-code font-bold px-1.5 py-0.5 bg-[#fef2f2] text-[#af101a] border border-[#fecaca] rounded-none">
                ADMIN
              </span>
            )}
          </div>

          <nav className="p-2 space-y-1">
            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-none transition-colors ${
                isDashboard
                  ? "bg-[#fef2f2] text-[#af101a] border-l-2 border-[#af101a]"
                  : "text-[#5d5e61] hover:text-[#0f172a] hover:bg-[#f8fafc]"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Dashboard</span>
            </Link>

            <Link
              to="/dashboard"
              onClick={closeMobileMenu}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-none transition-colors ${
                isTemplateOrEditor
                  ? "bg-[#fef2f2] text-[#af101a] border-l-2 border-[#af101a]"
                  : "text-[#5d5e61] hover:text-[#0f172a] hover:bg-[#f8fafc]"
              }`}
            >
              <FileText className="w-4 h-4 shrink-0" />
              <span>Editor CV</span>
            </Link>

            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-none transition-colors ${
                isProfile
                  ? "bg-[#fef2f2] text-[#af101a] border-l-2 border-[#af101a]"
                  : "text-[#5d5e61] hover:text-[#0f172a] hover:bg-[#f8fafc]"
              }`}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>Pengaturan Profil</span>
            </Link>

            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-none transition-colors ${
                  isAdminPath
                    ? "bg-[#fef2f2] text-[#af101a] border-l-2 border-[#af101a]"
                    : "text-[#5d5e61] hover:text-[#0f172a] hover:bg-[#f8fafc]"
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-[#af101a] shrink-0" />
                <span>Panel Admin</span>
              </Link>
            )}

            <div className="pt-2 mt-1 border-t border-[#f1f5f9] space-y-1">
              <a
                href={appConfig.saweriaUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMobileMenu}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#1a1b22] hover:bg-[#fffbe6] rounded-none transition-colors"
              >
                <Coffee className="w-4 h-4 text-[#d48806] shrink-0" />
                <span>Traktir Kopi (Saweria)</span>
              </a>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#fef2f2] rounded-none transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
